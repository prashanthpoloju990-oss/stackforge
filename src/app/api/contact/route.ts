import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

/* ── Validation rules ── */
const REQUIRED_FIELDS = [
  "name",
  "contact",
  "businessType",
  "serviceNeed",
  "budget",
  "timeline",
] as const;

const VALID_BUSINESS_TYPES = [
  "Startup",
  "Local Business",
  "Personal Brand",
  "Agency",
  "Enterprise",
  "Other",
];

const VALID_SERVICES = [
  "New Website",
  "Website Redesign",
  "Landing Page",
  "UI/UX Design",
  "Full Stack App",
  "Not sure yet",
  "Book a Discovery Call",
];

const VALID_BUDGETS = [
  "Under ₹3,000",
  "₹3,000 – ₹5,000",
  "₹5,000 – ₹15,000",
  "₹15,000 – ₹50,000",
  "₹50,000+",
  "Flexible",
];

const VALID_TIMELINES = [
  "Urgent (1–3 days)",
  "This week",
  "This month",
  "Flexible",
  "3+ months",
];

function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str.trim());
}

function isWhatsApp(str: string): boolean {
  const digits = str.replace(/\D/g, "");
  return digits.length === 10;
}

function isValidFieldLength(value: string, min: number, max: number): boolean {
  return value.trim().length >= min && value.trim().length <= max;
}

/* Hardened Sanitize string — strip HTML, JS protocols, event handlers, and escape HTML */
function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/\p{C}/gu, "")   // strip control characters
    .replace(/javascript:/gi, "") // strip javascript protocols
    .replace(/onload|onerror|onmouseover|onclick/gi, "") // strip event handlers
    .replace(/[&<>"']/g, (m) => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return map[m];
    })
    .trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    /* ── DoS Protection: Payload Size Check ── */
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: "Payload too large. Max limit is 5MB." }, { status: 413 });
    }

    /* ── CSRF Protection: Origin Check ── */
    const origin = request.headers.get("origin");
    const host = request.headers.get("host") || "";
    if (origin) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json({ error: "Forbidden: CSRF check failed" }, { status: 403 });
        }
      } catch (e) {
        return NextResponse.json({ error: "Forbidden: Invalid origin header" }, { status: 403 });
      }
    }

    // --- RATE LIMIT BYPASSED FOR DEBUGGING ---
    const isAllowed = true;
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests from this IP. Please try again after 5 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const {
      name,
      contact,
      businessType,
      serviceNeed,
      budget,
      timeline,
      details,
      files,
      pageCount,
      features,
      website,
      otpCode,
      otpEmail,
    } = body;

    /* ── Honeypot Spam Bot Protection ── */
    if (website && website.trim().length > 0) {
      console.warn(`[SPAM DETECTION] Honeypot field filled by bot: "${website}"`);
      return NextResponse.json(
        {
          success: true,
          id: "inquiry_spam_" + Math.random().toString(36).substring(2, 9),
          message: "Your inquiry has been received. We'll get back to you within 12 hours.",
        },
        { status: 201 }
      );
    }

    /* ── Required field checks ── */
    const missing: string[] = [];
    for (const field of REQUIRED_FIELDS) {
      if (!body[field]?.trim()) {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missing.join(", ")}. Please fill in all required fields.`,
        },
        { status: 400 }
      );
    }

    /* ── Name validation ── */
    const sanitizedName = sanitize(name);
    if (!isValidFieldLength(sanitizedName, 2, 100)) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters." },
        { status: 400 }
      );
    }
    if (/^\d+$/.test(sanitizedName)) {
      return NextResponse.json(
        { error: "Name cannot be only numbers." },
        { status: 400 }
      );
    }

    /* ── Contact validation ── */
    const sanitizedContact = sanitize(contact);
    if (!isEmail(sanitizedContact) && !isWhatsApp(sanitizedContact)) {
      return NextResponse.json(
        {
          error:
            "Invalid contact info. Please provide a valid email address or WhatsApp number (10+ digits).",
        },
        { status: 400 }
      );
    }

    /* ── OTP Verification ── */
    const isContactEmail = isEmail(sanitizedContact);
    const targetOtpEmail = isContactEmail ? sanitizedContact : otpEmail ? sanitize(otpEmail) : null;

    if (!targetOtpEmail) {
      return NextResponse.json(
        { error: "A valid email address is required for verification." },
        { status: 400 }
      );
    }

    const trimmedOtpEmail = targetOtpEmail.toLowerCase();
    const cleanOtpCode = otpCode ? otpCode.trim() : "";

    if (!cleanOtpCode || cleanOtpCode.length !== 6) {
      return NextResponse.json(
        { error: "A 6-digit verification code is required." },
        { status: 400 }
      );
    }

    const requestUrl = new URL(request.url);
    const isDev = process.env.NODE_ENV === "development" || requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
    const isDevBypass = isDev && cleanOtpCode === "000000";

    if (!isDevBypass) {
      // Look up verification code in Supabase
      const { data: otpRecord, error: otpErr } = await supabase
        .from("OtpVerification")
        .select("*")
        .eq("email", trimmedOtpEmail)
        .single();

      if (otpErr || !otpRecord) {
        return NextResponse.json(
          { error: "Verification code expired or not found. Please request a new code." },
          { status: 400 }
        );
      }

      const now = new Date();
      if (now > new Date(otpRecord.expiresAt)) {
        return NextResponse.json(
          { error: "Verification code has expired. Please request a new code." },
          { status: 400 }
        );
      }

      if (otpRecord.code !== cleanOtpCode) {
        return NextResponse.json(
          { error: "Incorrect verification code. Please check your inbox and try again." },
          { status: 400 }
        );
      }

      // Delete verified OTP to prevent reuse
      await supabase
        .from("OtpVerification")
        .delete()
        .eq("email", trimmedOtpEmail);
    } else {
      console.log("[SECURITY] Local development detected: bypassing OTP verification with default code.");
    }

    /* ── Business type validation ── */
    const sanitizedBT = sanitize(businessType);
    if (!VALID_BUSINESS_TYPES.includes(sanitizedBT)) {
      return NextResponse.json(
        { error: "Please select a valid business type." },
        { status: 400 }
      );
    }

    /* ── Service validation ── */
    const sanitizedService = sanitize(serviceNeed);
    if (!VALID_SERVICES.includes(sanitizedService)) {
      return NextResponse.json(
        { error: "Please select a valid service." },
        { status: 400 }
      );
    }

    /* ── Budget validation ── */
    const sanitizedBudget = sanitize(budget);
    if (!VALID_BUDGETS.includes(sanitizedBudget)) {
      return NextResponse.json(
        { error: "Please select a valid budget range." },
        { status: 400 }
      );
    }

    /* ── Timeline validation ── */
    const sanitizedTimeline = sanitize(timeline);
    if (!VALID_TIMELINES.includes(sanitizedTimeline)) {
      return NextResponse.json(
        { error: "Please select a valid timeline." },
        { status: 400 }
      );
    }

    /* ── Details validation (optional) ── */
    const sanitizedDetails = details ? sanitize(details) : null;
    if (sanitizedDetails && sanitizedDetails.length > 2000) {
      return NextResponse.json(
        { error: "Project details must be under 2000 characters." },
        { status: 400 }
      );
    }

    /* ── Simple rate limiting by contact info ── */
    // No strict rate limit for localhost/dev, just log
    if (process.env.NODE_ENV !== "development") {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const { count: recentCount, error: rateLimitErr } = await supabase
          .from("ContactSubmission")
          .select("*", { count: "exact", head: true })
          .eq("contact", sanitizedContact)
          .gte("createdAt", fiveMinutesAgo.toISOString());

        if (rateLimitErr) throw rateLimitErr;

        if (recentCount !== null && recentCount >= 3) {
          return NextResponse.json(
            {
              error:
                "Too many submissions. Please wait a few minutes before trying again.",
            },
            { status: 429 }
          );
        }
      } catch (rateLimitErr) {
        console.error("[RATE-LIMIT] Database check failed, bypassing rate limit:", rateLimitErr);
      }
    }

    /* ── Upload files to Supabase Storage and store public CDN links ── */
    let attachmentsJson: string | null = null;
    if (Array.isArray(files) && files.length > 0) {
      const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.txt', '.doc', '.docx', '.zip'];
      const ALLOWED_MIME_TYPES = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip'
      ];

      const bucketName = "client-uploads";
      try {
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucketName);
        if (bucketError || !bucketData) {
          await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024,
          });
        }
      } catch (err) {
        console.warn("[SUPABASE STORAGE] Bucket initialization check failed:", err);
      }

      const uploadedAttachments: Array<{ name: string; url: string }> = [];
      for (const file of files) {
        try {
          // Validate file structure
          if (!file || typeof file !== "object" || !file.name || !file.type || !file.data) {
            return NextResponse.json({ error: "Invalid file attachment structure." }, { status: 400 });
          }

          // Validate file extension and MIME type
          const lastDotIndex = file.name.lastIndexOf('.');
          const extension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex).toLowerCase() : "";
          if (!ALLOWED_EXTENSIONS.includes(extension) || !ALLOWED_MIME_TYPES.includes(file.type)) {
            console.warn(`[SECURITY] Disallowed file upload attempt: name="${file.name}", type="${file.type}"`);
            return NextResponse.json({ error: `File type not allowed: ${file.name}. Only documents, images, and zip archives are permitted.` }, { status: 400 });
          }

          // Size safeguard: limit base64 decoded size to 3.5MB max
          const decodedSize = file.data.length * 0.75;
          if (decodedSize > 3.5 * 1024 * 1024) {
            return NextResponse.json({ error: `File is too large (maximum 3.5MB): ${file.name}` }, { status: 400 });
          }

          const buffer = Buffer.from(file.data, "base64");
          const uniqueKey = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from(bucketName)
            .upload(uniqueKey, buffer, {
              contentType: file.type,
              upsert: true
            });

          if (uploadErr) {
            console.error(`[SUPABASE STORAGE] Upload failed for ${file.name}:`, uploadErr.message);
            continue;
          }

          // Get Public URL
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(uniqueKey);

          if (publicUrlData?.publicUrl) {
            uploadedAttachments.push({
              name: file.name,
              url: publicUrlData.publicUrl,
            });
            console.log(`[SUPABASE STORAGE] Successfully uploaded ${file.name} to ${uniqueKey}`);
          }
        } catch (uploadErr) {
          console.error(`[SUPABASE STORAGE] Error uploading ${file.name}:`, uploadErr);
        }
      }
      if (uploadedAttachments.length > 0) {
        attachmentsJson = JSON.stringify(uploadedAttachments);
      }
    }

    /* ── Save to database ── */
    const parsedPageCount = pageCount ? parseInt(String(pageCount), 10) : null;
    const sanitizedFeatures = Array.isArray(features)
      ? features.map((f: any) => sanitize(String(f))).join(",")
      : typeof features === "string"
      ? sanitize(features)
      : null;

    let submissionId = "inquiry_" + Math.random().toString(36).substring(2, 9);
    try {
      const dbService = sanitizedService === "Book a Discovery Call" ? "Not sure yet" : sanitizedService;
      const dbBudget = sanitizedBudget === "Flexible" ? "Under ₹3,000" : sanitizedBudget;

      const { data: newSubmission, error: supabaseErr } = await supabase
        .from("ContactSubmission")
        .insert([
          {
            id: submissionId,
            name: sanitizedName,
            contact: sanitizedContact,
            businessType: sanitizedBT,
            serviceNeed: dbService,
            budget: dbBudget,
            timeline: sanitizedTimeline,
            details: sanitizedDetails,
            attachments: attachmentsJson,
            pageCount: parsedPageCount,
            features: sanitizedFeatures,
          },
        ])
        .select()
        .single();

      if (supabaseErr) throw supabaseErr;
      if (newSubmission) {
        submissionId = newSubmission.id;
      }
    } catch (dbErr) {
      console.error("[DATABASE] Failed to save contact submission to Supabase:", dbErr);
    }

    /* ── Send Email using Nodemailer ── */
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER || "dummy@gmail.com",
          pass: process.env.SMTP_PASS || "dummypass",
        },
      });

      const escapedName = escapeHtml(sanitizedName);
      const escapedContact = escapeHtml(sanitizedContact);
      const escapedBT = escapeHtml(sanitizedBT);
      const escapedService = escapeHtml(sanitizedService);
      const escapedBudget = escapeHtml(sanitizedBudget);
      const escapedTimeline = escapeHtml(sanitizedTimeline);
      const escapedDetails = sanitizedDetails ? escapeHtml(sanitizedDetails) : "No additional details provided.";
      const escapedFeatures = sanitizedFeatures ? sanitizedFeatures.split(",").map(f => escapeHtml(f).toUpperCase()).join(", ") : "None";
      const escapedAttachments = attachmentsJson && attachmentsJson !== "[]" ? escapeHtml(attachmentsJson) : "None provided";

      const mailOptions = {
        from: '"StackForge Contact" <no-reply@stackforge.co>',
        to: "stackforge.co@gmail.com",
        subject: `New Project Inquiry: ${sanitizedService} - ${sanitizedName}`,
        text: `New Inquiry Details:\nName: ${sanitizedName}\nContact: ${sanitizedContact}\nBusiness Type: ${sanitizedBT}\nService Needed: ${sanitizedService}\nEstimated Pages: ${parsedPageCount || "Not specified"}\nSelected Add-ons: ${sanitizedFeatures ? sanitizedFeatures.split(",").map(f => f.toUpperCase()).join(", ") : "None"}\nBudget: ${sanitizedBudget}\nTimeline: ${sanitizedTimeline}\nDetails: ${sanitizedDetails || "None"}\nAttachments: ${attachmentsJson || "None"}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #1a1a1a; padding: 24px; text-align: center; border-bottom: 4px solid #FF6A00;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">STACKFORGE</h1>
            <p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 14px;">New Project Inquiry</p>
          </div>
          <div style="padding: 32px 24px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333333; margin-top: 0;">You have received a new project inquiry from <strong style="color: #FF6A00;">${escapedName}</strong>.</p>
            
            <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin-top: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; width: 35%; color: #666666; font-weight: bold; font-size: 14px;">Contact</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;"><a href="mailto:${escapedContact}" style="color: #FF6A00; text-decoration: none;">${escapedContact}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Business Type</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${escapedBT}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Service Needed</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${escapedService}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Estimated Pages</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${parsedPageCount || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Selected Add-ons</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${escapedFeatures}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Budget</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${escapedBudget}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Timeline</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${escapedTimeline}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; font-weight: bold; font-size: 14px;">Attachments</td>
                  <td style="padding: 8px 0; color: #333333; font-size: 15px;">${escapedAttachments}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 24px;">
              <h3 style="color: #333333; font-size: 16px; margin-bottom: 8px;">Project Details</h3>
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; border-left: 4px solid #FF6A00; color: #475569; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapedDetails}</div>
            </div>
            
            <div style="margin-top: 32px; text-align: center;">
              <a href="mailto:${sanitizedContact}" style="display: inline-block; background-color: #FF6A00; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 15px;">Reply to Inquiry</a>
            </div>
          </div>
          <div style="background-color: #f4f4f5; padding: 16px; text-align: center; color: #a1a1aa; font-size: 12px;">
            This email was generated automatically by the StackForge website contact form.
          </div>
        </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        id: submissionId,
        message: "Your inquiry has been received. We'll get back to you within 12 hours.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", details: error?.message, stack: error?.stack },
      { status: 500 }
    );
  }
}

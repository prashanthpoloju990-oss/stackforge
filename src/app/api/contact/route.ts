import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

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
];

const VALID_BUDGETS = [
  "$100 – $300",
  "$300 – $700",
  "$700 – $1,500",
  "$1,500 – $5,000",
  "$5,000+",
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
  return /^\+?\d[\d\s-]{9,}$/.test(str.replace(/\s/g, ""));
}

function isValidFieldLength(value: string, min: number, max: number): boolean {
  return value.trim().length >= min && value.trim().length <= max;
}

/* Sanitize string — strip HTML tags and trim */
function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, "") // strip HTML
    .replace(/\p{C}/gu, "")   // strip control characters
    .trim();
}

export async function POST(request: NextRequest) {
  try {
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
    } = body;

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
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentCount = await db.contactSubmission.count({
        where: {
          createdAt: { gte: fiveMinutesAgo },
          contact: sanitizedContact, // Rate-limit by contact info instead of IP
        },
      });

      if (recentCount >= 3) {
        return NextResponse.json(
          {
            error:
              "Too many submissions. Please wait a few minutes before trying again.",
          },
          { status: 429 }
        );
      }
    }

    /* ── Upload files to OQENS Storage and store public CDN links ── */
    let attachmentsJson: string | null = null;
    if (Array.isArray(files) && files.length > 0) {
      const apiKey = process.env.OQENS_API_KEY;
      const cloudId = process.env.OQENS_CLOUD_ID;

      if (apiKey && cloudId) {
        const uploadedAttachments = [];
        for (const file of files) {
          try {
            const buffer = Buffer.from(file.data, "base64");
            const blob = new Blob([buffer], { type: file.type });
            const uniqueKey = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

            const formData = new FormData();
            formData.append("file", blob, uniqueKey);

            const uploadRes = await fetch("https://auth.oqens.me/api/bucket/upload", {
              method: "POST",
              headers: {
                "X-API-Key": apiKey,
              },
              body: formData,
            });

            if (uploadRes.ok) {
              uploadedAttachments.push({
                name: file.name,
                url: `https://dl.oqens.me/${cloudId}/${uniqueKey}`,
              });
              console.log(`[OQENS] Successfully uploaded ${file.name} to ${uniqueKey}`);
            } else {
              console.error(`[OQENS] Upload failed for ${file.name}:`, await uploadRes.text());
            }
          } catch (uploadErr) {
            console.error(`[OQENS] Error uploading ${file.name}:`, uploadErr);
          }
        }
        if (uploadedAttachments.length > 0) {
          attachmentsJson = JSON.stringify(uploadedAttachments);
        }
      } else {
        console.warn("[OQENS] Credentials are not configured in environment variables.");
      }
    }

    /* ── Save to database ── */
    const submission = await db.contactSubmission.create({
      data: {
        name: sanitizedName,
        contact: sanitizedContact,
        businessType: sanitizedBT,
        serviceNeed: sanitizedService,
        budget: sanitizedBudget,
        timeline: sanitizedTimeline,
        details: sanitizedDetails,
        attachments: attachmentsJson,
      },
    });

    /* ── Send Email using Nodemailer ── */
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER || "dummy@gmail.com",
          pass: process.env.SMTP_PASS || "dummypass",
        },
      });

      const mailOptions = {
        from: '"StackForge Contact" <no-reply@stackforge.co>',
        to: "stackforge.co@gmail.com",
        subject: `New Project Inquiry: ${sanitizedService} - ${sanitizedName}`,
        text: `New Inquiry Details:\nName: ${sanitizedName}\nContact: ${sanitizedContact}\nBusiness Type: ${sanitizedBT}\nService Needed: ${sanitizedService}\nBudget: ${sanitizedBudget}\nTimeline: ${sanitizedTimeline}\nDetails: ${sanitizedDetails || "None"}\nAttachments: ${attachmentsJson || "None"}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #1a1a1a; padding: 24px; text-align: center; border-bottom: 4px solid #FF6A00;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">STACKFORGE</h1>
            <p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 14px;">New Project Inquiry</p>
          </div>
          <div style="padding: 32px 24px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333333; margin-top: 0;">You have received a new project inquiry from <strong style="color: #FF6A00;">${sanitizedName}</strong>.</p>
            
            <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin-top: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; width: 35%; color: #666666; font-weight: bold; font-size: 14px;">Contact</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;"><a href="mailto:${sanitizedContact}" style="color: #FF6A00; text-decoration: none;">${sanitizedContact}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Business Type</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${sanitizedBT}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Service Needed</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${sanitizedService}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Budget</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${sanitizedBudget}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #666666; font-weight: bold; font-size: 14px;">Timeline</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 15px;">${sanitizedTimeline}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; font-weight: bold; font-size: 14px;">Attachments</td>
                  <td style="padding: 8px 0; color: #333333; font-size: 15px;">${attachmentsJson && attachmentsJson !== "[]" ? attachmentsJson : "None provided"}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 24px;">
              <h3 style="color: #333333; font-size: 16px; margin-bottom: 8px;">Project Details</h3>
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; border-left: 4px solid #FF6A00; color: #475569; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${sanitizedDetails || "No additional details provided."}</div>
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
        id: submission.id,
        message: "Your inquiry has been received. We'll get back to you within 12 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

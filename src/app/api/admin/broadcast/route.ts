import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import nodemailer from "nodemailer";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || process.env.SUPABASE_SECRET_KEY || "stackforge_default_secure_jwt_key_2026";
  return new TextEncoder().encode(secret);
}

async function getAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return false;

    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload && payload.role === "admin";
  } catch (error) {
    return false;
  }
}

function buildNewsletterHtml(subject: string, previewText: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background:#040407; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; color:#eaeaea;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#040407; padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" style="max-width:560px; width:100%; border-radius:14px; overflow:hidden; border:1px solid #1a1a24; background:#0a0a0f;">
          
          <!-- Header -->
          <tr>
            <td style="background:#09090b; padding:28px 32px; text-align:center; border-bottom:4px solid #FF6A00;">
              <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:800; letter-spacing:2px; font-family:Georgia,serif;">STACKFORGE</h1>
              <p style="color:#FF6A00; margin:6px 0 0; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-family:monospace;">Studio Update</p>
            </td>
          </tr>

          <!-- Banner / Preview text -->
          ${previewText ? `
          <tr>
            <td style="background:rgba(255,106,0,0.03); padding:16px 32px; text-align:center; border-bottom:1px solid #1a1a24;">
              <p style="color:#FF6A00; font-size:13px; font-weight:600; margin:0; font-family:monospace;">${previewText}</p>
            </td>
          </tr>
          ` : ""}

          <!-- Body -->
          <tr>
            <td style="padding:32px; line-height:1.7; font-size:15px; color:#c5c5d2;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer divider -->
          <tr>
            <td style="padding:0 32px 28px; border-top:1px solid #1a1a24;">
              <p style="font-size:13px; color:#71717a; line-height:1.6; margin:20px 0 0;">
                You are receiving this because you subscribed to updates from StackForge.<br/>
                <strong style="color:#ffffff;">— The StackForge Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer bar -->
          <tr>
            <td style="background:#09090b; padding:18px 32px; text-align:center; color:#52525b; font-size:11px; border-top:1px solid #1a1a24; line-height:1.6;">
              StackForge Studio · Hyderabad, India<br/>
              <span style="color:#3f3f46;">If you no longer wish to receive these emails, you can unsubscribe at any time.</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({ error: "System configuration missing key" }, { status: 500 });
  }

  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subject, previewText, body } = await req.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and Body are required" }, { status: 400 });
    }

    // Fetch all newsletter subscribers
    const { data: subscribers, error: subErr } = await supabase
      .from("Newsletter")
      .select("email")
      .order("createdAt", { ascending: true });

    if (subErr) {
      console.error("[BROADCAST-API] DB error fetching subscribers:", subErr);
      return NextResponse.json({ error: "Database error fetching subscribers" }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, message: "No subscribers found to send to", count: 0 });
    }

    const recipientEmails = subscribers.map((s) => s.email);

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS via STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test SMTP credentials
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error("[BROADCAST-API] SMTP Connection verification failed:", verifyErr);
      return NextResponse.json({ error: "Failed to connect to SMTP server" }, { status: 500 });
    }

    // Send emails in batches of 5 to avoid overloading the mail server
    const batchSize = 5;
    let successCount = 0;
    let failureCount = 0;

    const emailHtml = buildNewsletterHtml(subject, previewText || "", body);
    const emailText = `${subject}\n\n${previewText ? previewText + "\n\n" : ""}${body.replace(/<[^>]*>/g, "")}\n\n— The StackForge Team`;

    for (let i = 0; i < recipientEmails.length; i += batchSize) {
      const batch = recipientEmails.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (email) => {
        try {
          await transporter.sendMail({
            from: `"StackForge Studio" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: emailHtml,
            text: emailText,
            headers: {
              "Precedence": "list",
              "List-ID": "stackforge-newsletter",
              "List-Unsubscribe": `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
              "X-Auto-Response-Suppress": "All",
            },
          });
          successCount++;
        } catch (sendErr) {
          console.error(`[BROADCAST-API] Failed to send email to ${email}:`, sendErr);
          failureCount++;
        }
      });

      await Promise.all(emailPromises);
    }

    console.log(`[BROADCAST-API] Newsletter sent. Success: ${successCount}, Failed: ${failureCount}`);

    return NextResponse.json({
      success: true,
      message: `Newsletter broadcast completed. Sent to ${successCount} subscribers. Failed: ${failureCount}.`,
      count: successCount,
    });
  } catch (error) {
    console.error("[BROADCAST-API] Unexpected error:", error);
    return NextResponse.json({ error: "Broadcast operation failed" }, { status: 500 });
  }
}

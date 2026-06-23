import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";

function buildPortalOtpHtml(code: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Portal Login Verification Code</title>
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
              <p style="color:#FF6A00; margin:6px 0 0; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-family:monospace;">Client Project Portal</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px; line-height:1.7;">
              <h2 style="color:#FF6A00; margin-top:0; font-size:18px; font-weight:700;">Project Portal Access Key</h2>
              <p style="font-size:15px; color:#c5c5d2;">You requested access to your StackForge project progress tracking dashboard. Please use the following one-time verification key to log in:</p>
              
              <div style="background:rgba(255,106,0,0.05); border-left:4px solid #FF6A00; padding:20px; margin:24px 0; font-family:monospace; text-align:center; border-radius:4px;">
                <span style="font-size:32px; letter-spacing:8px; font-weight:bold; color:#FF6A00;">${code}</span>
              </div>
              
              <p style="font-size:13px; color:#71717a;">This code is valid for 10 minutes. If you did not request this code, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Footer bar -->
          <tr>
            <td style="background:#09090b; padding:18px 32px; text-align:center; color:#52525b; font-size:11px; border-top:1px solid #1a1a24; line-height:1.6;">
              StackForge Studio · Hyderabad, India
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
  try {
    // IP-Based Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const clientIp = ip.split(",")[0].trim();
    const isIpAllowed = await checkRateLimit(`ip:portal-otp:${clientIp}`, 5, 10 * 60 * 1000); // 5 requests per 10 minutes
    if (!isIpAllowed) {
      return NextResponse.json(
        { error: "Too many login attempts from this IP. Please try again in 10 minutes." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Email-Based Rate Limiting
    const isEmailAllowed = await checkRateLimit(`email:portal-otp:${trimmedEmail}`, 3, 10 * 60 * 1000); // 3 requests per 10 minutes
    if (!isEmailAllowed) {
      return NextResponse.json(
        { error: "Too many login requests for this email. Please try again in 10 minutes." },
        { status: 429 }
      );
    }

    // Verify if email has any inquiries in ContactSubmission
    const { data: submission, error: subErr } = await supabase
      .from("ContactSubmission")
      .select("id")
      .eq("contact", trimmedEmail)
      .limit(1)
      .maybeSingle();

    if (subErr) {
      console.error("[PORTAL-OTP-API] DB error checking inquiry:", subErr);
      return NextResponse.json({ error: "Database error checking email" }, { status: 500 });
    }

    if (!submission) {
      return NextResponse.json({
        error: "No active project inquiry found for this email. Please check your spelling or contact support."
      }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otpCode = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Clear old OTPs
    await supabase
      .from("OtpVerification")
      .delete()
      .eq("email", trimmedEmail);

    // Save to database
    const { error: dbErr } = await supabase
      .from("OtpVerification")
      .insert([
        {
          email: trimmedEmail,
          code: otpCode,
          expiresAt: expiresAt.toISOString(),
        },
      ]);

    if (dbErr) {
      console.error("[PORTAL-OTP-API] Error saving OTP:", dbErr);
      return NextResponse.json({ error: "Database error saving verification code" }, { status: 500 });
    }

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"StackForge Studio" <${process.env.SMTP_USER}>`,
        to: trimmedEmail,
        subject: "🔑 Verification Code for Project Portal",
        html: buildPortalOtpHtml(otpCode),
        text: `Your StackForge Client Project Portal verification code: ${otpCode}. It is valid for 10 minutes.`,
      });
      console.log(`[PORTAL-OTP-API] OTP sent successfully to ${trimmedEmail}`);
    } catch (mailErr) {
      console.error("[PORTAL-OTP-API] Email send failed:", mailErr);
      return NextResponse.json({ error: "Failed to dispatch verification email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Verification code sent successfully" });
  } catch (error) {
    console.error("[PORTAL-OTP-API] General failure:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

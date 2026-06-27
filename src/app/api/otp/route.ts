import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomInt } from "crypto";

const OTP_TEMPLATES = [
  {
    subject: "⚠️ SECURITY PROTOCOL: Verification Required",
    headline: "OTP Protocol Activated! 🤖",
    body: (code: string) => `
      <p style="font-size:15px; line-height:1.6; color:#333;">Beep boop. A project submission request has triggered our human-verification protocol.</p>
      <div style="background:#fcf8f2; border-left:4px solid #FF6A00; padding:16px; margin:20px 0; font-family:monospace; text-align:center;">
        <span style="font-size:28px; letter-spacing:8px; font-weight:bold; color:#FF6A00;">${code}</span>
      </div>
      <p style="font-size:14px; line-height:1.6; color:#666;">Please input these 6 digits before the space-time continuum collapses. Or at least before the code expires in 10 minutes. Do not share this with any rogue artificial intelligences or time travelers.</p>
    `,
  },
  {
    subject: "🕵️ CLASSIFIED: Your Agent Authorization Code",
    headline: "For Your Eyes Only! 🕶️",
    body: (code: string) => `
      <p style="font-size:15px; line-height:1.6; color:#333;">Your request to initiate a project build has reached the intelligence department. We have generated your one-time passkey.</p>
      <div style="background:#fcf8f2; border-left:4px solid #FF6A00; padding:16px; margin:20px 0; font-family:monospace; text-align:center;">
        <span style="font-size:28px; letter-spacing:8px; font-weight:bold; color:#FF6A00;">${code}</span>
      </div>
      <p style="font-size:14px; line-height:1.6; color:#666;">Memorize this code. Destroy this email. Self-destruct sequence not included, so please delete manually if you want to feel like a secret agent. Expires in 10 minutes.</p>
    `,
  },
  {
    subject: "🍌 Important: Highly-Trained Monkey Computations inside",
    headline: "Calculations Complete! 🐒",
    body: (code: string) => `
      <p style="font-size:15px; line-height:1.6; color:#333;">We had to hire three highly-trained monkeys and promise them at least five bananas to calculate a secure verification code for your inquiry.</p>
      <div style="background:#fcf8f2; border-left:4px solid #FF6A00; padding:16px; margin:20px 0; font-family:monospace; text-align:center;">
        <span style="font-size:28px; letter-spacing:8px; font-weight:bold; color:#FF6A00;">${code}</span>
      </div>
      <p style="font-size:14px; line-height:1.6; color:#666;">Please use it quickly so their hard work doesn't go to waste and they get paid. You have 10 minutes before the bananas rot.</p>
    `,
  },
  {
    subject: "🍞 BEEP BOOP: Proof of Non-Toaster Status Required",
    headline: "Are You a Toaster? 🔌",
    body: (code: string) => `
      <p style="font-size:15px; line-height:1.6; color:#333;">Our firewall suspects you might be an automated kitchen appliance (specifically a smart toaster). Prove your organic, carbon-based human status using this key:</p>
      <div style="background:#fcf8f2; border-left:4px solid #FF6A00; padding:16px; margin:20px 0; font-family:monospace; text-align:center;">
        <span style="font-size:28px; letter-spacing:8px; font-weight:bold; color:#FF6A00;">${code}</span>
      </div>
      <p style="font-size:14px; line-height:1.6; color:#666;">If you are indeed a toaster, please return to the kitchen. If not, enter the code on our form within 10 minutes.</p>
    `,
  },
];

function buildHtml(template: typeof OTP_TEMPLATES[number], code: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${template.subject}</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f5; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" style="max-width:560px; width:100%; border-radius:14px; overflow:hidden; border:1px solid #e0e0e0; background:#ffffff;">
          
          <!-- Header -->
          <tr>
            <td style="background:#0A0A0A; padding:24px 32px; text-align:center; border-bottom:4px solid #FF6A00;">
              <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:800; letter-spacing:2px; font-family:Georgia,serif;">STACKFORGE</h1>
              <p style="color:#FF6A00; margin:4px 0 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; font-family:monospace;">Human Verification Protocol</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#FF6A00; margin-top:0; font-size:18px; font-weight:700;">${template.headline}</h2>
              ${template.body(code)}
            </td>
          </tr>

          <!-- Footer bar -->
          <tr>
            <td style="background:#f5f5f7; padding:16px 32px; text-align:center; color:#86868b; font-size:11px; border-top:1px solid #e0e0e0; line-height:1.6;">
              StackForge Studio · Hyderabad, India<br/>
              <span style="color:#aaa;">If you did not request this code, you can safely ignore this email.</span>
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

export async function POST(request: NextRequest) {
  try {
    // ── IP-Based Rate Limiting ──
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    const clientIp = ip.split(",")[0].trim();
    const isIpAllowed = await checkRateLimit(`ip:otp-request:${clientIp}`, 5, 10 * 60 * 1000); // 5 requests per 10 minutes
    if (!isIpAllowed) {
      return NextResponse.json(
        { error: "Too many verification requests from this IP. Please try again in 10 minutes." },
        { status: 429 }
      );
    }

    const { email, contact } = await request.json();
    const targetContact = (contact || email || "").trim();

    if (!targetContact || typeof targetContact !== "string") {
      return NextResponse.json({ error: "Contact (email or phone) is required" }, { status: 400 });
    }

    const isEmail = targetContact.includes("@");
    const formattedContact = isEmail ? targetContact.toLowerCase() : targetContact.replace(/\D/g, "");

    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formattedContact)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (!isEmail && formattedContact.length < 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // ── Email/Phone-Based Rate Limiting ──
    const isContactAllowed = await checkRateLimit(`contact:otp-request:${formattedContact}`, 3, 10 * 60 * 1000); // 3 requests per 10 minutes
    if (!isContactAllowed) {
      return NextResponse.json(
        { error: "Too many verification requests for this contact. Please try again in 10 minutes." },
        { status: 429 }
      );
    }

    // 1. Generate secure 6-digit OTP code
    const otpCode = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 2. Save OTP to Supabase
    await supabase
      .from("OtpVerification")
      .delete()
      .eq("email", formattedContact); // We reuse the 'email' column to store the contact for simplicity

    const { error: dbErr } = await supabase
      .from("OtpVerification")
      .insert([
        {
          email: formattedContact,
          code: otpCode,
          expiresAt: expiresAt.toISOString(),
        },
      ]);

    if (dbErr) {
      console.error("[OTP-DB] Error saving OTP:", dbErr);
      return NextResponse.json({ error: "Database error saving validation key" }, { status: 500 });
    }

    // 3. Send OTP
    if (isEmail) {
      const template = OTP_TEMPLATES[Math.floor(Math.random() * OTP_TEMPLATES.length)];
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"StackForge Studio" <${process.env.SMTP_USER}>`,
        to: formattedContact,
        subject: template.subject,
        html: buildHtml(template, otpCode),
        text: `StackForge Verification Code: ${otpCode}. Code expires in 10 minutes.`,
        headers: {
          "Precedence": "list",
          "X-Auto-Response-Suppress": "All",
        },
      });
    } else {
      // Send via SMS using Seven.io API
      const sevenApiKey = process.env.SEVEN_API_KEY;
      if (!sevenApiKey) {
        throw new Error("SEVEN_API_KEY is not configured in environment variables.");
      }
      
      const phoneWithCountryCode = formattedContact.startsWith("91") && formattedContact.length === 12 
        ? formattedContact
        : formattedContact.length === 10 ? `91${formattedContact}` : formattedContact;

      const params = new URLSearchParams();
      params.append("to", phoneWithCountryCode);
      params.append("text", `Your StackForge verification code is: ${otpCode}. It expires in 10 minutes.`);
      params.append("from", "StackForge");

      const smsResponse = await fetch("https://gateway.seven.io/api/sms", {
        method: "POST",
        headers: {
          "X-Api-Key": sevenApiKey,
          "Accept": "application/json"
        },
        body: params
      });

      if (!smsResponse.ok) {
        const errData = await smsResponse.text();
        console.error("[OTP-SMS] Seven.io SMS failed:", errData);
        throw new Error("Failed to send SMS via Seven.io.");
      }
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("[OTP-API] Failed to generate/send OTP:", error);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}

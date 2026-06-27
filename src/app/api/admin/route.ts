import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import nodemailer from "nodemailer";
import { randomInt, randomBytes } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function getJwtSecret(): Uint8Array {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error("SUPABASE_SECRET_KEY is missing");
  }
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

// ── GET: Fetch dashboard data ──
export async function GET(req: NextRequest) {
  if (!process.env.SUPABASE_SECRET_KEY) {
    console.error("[SECURITY] SUPABASE_SECRET_KEY environment variable is missing!");
    return NextResponse.json({ error: "System configuration error: secure keys not set." }, { status: 500 });
  }
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch inquiries from Supabase
    const { data: inquiries, error: inqErr } = await supabase
      .from("ContactSubmission")
      .select("*")
      .order("createdAt", { ascending: false });

    if (inqErr) throw inqErr;

    // Fetch subscribers from Supabase
    const { data: subscribers, error: subErr } = await supabase
      .from("Newsletter")
      .select("*")
      .order("createdAt", { ascending: false });

    if (subErr) throw subErr;

    return NextResponse.json({ inquiries, subscribers }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN-API] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

// ── POST: Authenticate / Login / Logout ──
export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_SECRET_KEY) {
    console.error("[SECURITY] SUPABASE_SECRET_KEY environment variable is missing!");
    return NextResponse.json({ error: "System configuration error: secure keys not set." }, { status: 500 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    const cookieStore = await cookies();

    // Logout
    if (action === "logout") {
      cookieStore.set("admin_session", "", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });
      return NextResponse.json({ success: true, message: "Logged out successfully" });
    }

    const adminEmail = (process.env.SMTP_USER || "stackforge.co@gmail.com").trim().toLowerCase();

    // Trigger recompile to clear turbopack cache
    // Forgot Password (Magic Link request)
    if (action === "forgot_password") {
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

      // Clear old OTPs / Magic tokens for admin
      await supabase
        .from("OtpVerification")
        .delete()
        .eq("email", adminEmail);

      // Save token as the "code" in OtpVerification
      const { error: dbErr } = await supabase
        .from("OtpVerification")
        .insert([
          {
            email: adminEmail,
            code: token,
            expiresAt: expiresAt.toISOString(),
          },
        ]);

      if (dbErr) {
        console.error("[SECURITY] Database failed to store admin magic link token:", dbErr);
        return NextResponse.json({ error: "Database error saving magic link token" }, { status: 500 });
      }

      // Construct magic link
      const requestUrl = new URL(req.url);
      const origin = req.headers.get("origin") || requestUrl.origin || "https://stackforge.co.in";
      const magicLink = `${origin}/admin?token=${token}&email=${encodeURIComponent(adminEmail)}`;

      // Send Email
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"StackForge System Guard" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: "⚠️ SECURITY PROTOCOL: Console Password Reset & Magic Login Link",
          text: `Use the following link to securely log into the StackForge Admin Console: ${magicLink}. This link expires in 15 minutes.`,
          html: `
            <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; max-width:560px; margin:0 auto; border:1px solid #e0e0e0; border-radius:14px; overflow:hidden; background:#ffffff;">
              <div style="background:#0A0A0A; padding:24px 32px; text-align:center; border-bottom:4px solid #FF6A00;">
                <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:800; letter-spacing:2px; font-family:Georgia,serif;">STACKFORGE</h1>
                <p style="color:#FF6A00; margin:4px 0 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; font-family:monospace;">Security Protocol Shield</p>
              </div>
              <div style="padding:32px;">
                <h2 style="color:#FF6A00; margin-top:0; font-size:18px; font-weight:700;">Admin Console Magic Login</h2>
                <p style="font-size:15px; line-height:1.6; color:#333;">A request to reset/bypass the password and securely access the StackForge Console database was received. Click the button below to authorize this session.</p>
                
                <div style="text-align:center; margin:30px 0;">
                  <a href="${magicLink}" target="_blank" style="background-color:#FF6A00; color:#ffffff; padding:14px 28px; text-decoration:none; font-size:14px; font-weight:bold; border-radius:8px; display:inline-block; box-shadow: 0 4px 12px rgba(255, 106, 0, 0.25);">Login to Admin Console</a>
                </div>

                <p style="font-size:12px; color:#666; word-break:break-all;">Or copy and paste this link into your browser:<br/>
                <a href="${magicLink}" style="color:#FF6A00;">${magicLink}</a></p>

                <p style="font-size:13px; line-height:1.6; color:#777; margin-top:20px;">This security link is valid for 15 minutes. If you did not request this link, immediately audit your environment and secure your root keys.</p>
              </div>
              <div style="background:#f5f5f7; padding:16px 32px; text-align:center; color:#86868b; font-size:11px; border-top:1px solid #e0e0e0;">
                StackForge System Guard · Hyderabad, India
              </div>
            </div>
          `,
          headers: {
            "Precedence": "list",
            "X-Auto-Response-Suppress": "All",
          },
        });
        console.log(`[SECURITY] Admin magic link dispatched successfully to ${adminEmail}`);
      } catch (mailErr) {
        console.error("[SECURITY] Failed to send Admin magic link mail:", mailErr);
        return NextResponse.json({ error: "Failed to dispatch magic link. Please check SMTP credentials." }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "A secure magic login link has been sent to your registered admin email." });
    }

    const body = await req.json().catch(() => ({}));
    const { password, email, mfaCode, token: magicToken, email: magicEmail } = body;

    // Magic Login Authorization
    if (action === "magic_login") {
      if (!magicToken || !magicEmail) {
        return NextResponse.json({ error: "Missing authentication parameters" }, { status: 400 });
      }

      if (magicEmail.trim().toLowerCase() !== adminEmail) {
        return NextResponse.json({ error: "Access Denied: Invalid email parameter" }, { status: 403 });
      }

      const { data: record, error: dbErr } = await supabase
        .from("OtpVerification")
        .select("*")
        .eq("email", adminEmail)
        .single();

      if (dbErr || !record) {
        return NextResponse.json({ error: "Magic link expired or already used. Please request a new one." }, { status: 400 });
      }

      const now = new Date();
      if (now > new Date(record.expiresAt)) {
        return NextResponse.json({ error: "Magic link has expired. Please request a new one." }, { status: 400 });
      }

      if (record.code !== magicToken.trim()) {
        return NextResponse.json({ error: "Invalid magic token." }, { status: 400 });
      }

      // Delete token after successful verify
      await supabase
        .from("OtpVerification")
        .delete()
        .eq("email", adminEmail);

      // Sign JWT session
      const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(getJwtSecret());

      cookieStore.set("admin_session", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
      });

      return NextResponse.json({ success: true, message: "Authenticated via magic link successfully" });
    }



    // Resend MFA Code
    if (action === "resend_mfa") {
      const { email: requestEmail } = body;
      if (!requestEmail || requestEmail.trim().toLowerCase() !== adminEmail) {
        return NextResponse.json({ error: "Access Denied: Invalid email parameter" }, { status: 403 });
      }

      // Check if an OTP was recently generated
      const { data: record, error: dbErr } = await supabase
        .from("OtpVerification")
        .select("*")
        .eq("email", adminEmail)
        .single();

      if (dbErr || !record) {
        return NextResponse.json({ error: "No active verification session. Please log in again." }, { status: 400 });
      }

      // Generate secure 6-digit numeric OTP
      const otpCode = randomInt(100000, 1000000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // Save to database (updating active code)
      await supabase
        .from("OtpVerification")
        .delete()
        .eq("email", adminEmail);

      const { error: insertErr } = await supabase
        .from("OtpVerification")
        .insert([
          {
            email: adminEmail,
            code: otpCode,
            expiresAt: expiresAt.toISOString(),
          },
        ]);

      if (insertErr) {
        console.error("[SECURITY] Database failed to store resent admin MFA code:", insertErr);
        return NextResponse.json({ error: "Database error saving validation key" }, { status: 500 });
      }

      // Send Email
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"StackForge System Guard" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: "⚠️ SECURITY PROTOCOL: Resent Console Login Verification Code",
          text: `StackForge Console Login verification code: ${otpCode}. It expires in 10 minutes.`,
          html: `
            <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; max-width:560px; margin:0 auto; border:1px solid #e0e0e0; border-radius:14px; overflow:hidden; background:#ffffff;">
              <div style="background:#0A0A0A; padding:24px 32px; text-align:center; border-bottom:4px solid #FF6A00;">
                <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:800; letter-spacing:2px; font-family:Georgia,serif;">STACKFORGE</h1>
                <p style="color:#FF6A00; margin:4px 0 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; font-family:monospace;">Security Protocol Shield</p>
              </div>
              <div style="padding:32px;">
                <h2 style="color:#FF6A00; margin-top:0; font-size:18px; font-weight:700;">Console MFA Verification Code (Resent)</h2>
                <p style="font-size:15px; line-height:1.6; color:#333;">As requested, your verification key has been resent to authorize your StackForge Console session.</p>
                <div style="background:#fcf8f2; border-left:4px solid #FF6A00; padding:16px; margin:20px 0; font-family:monospace; text-align:center;">
                  <span style="font-size:32px; letter-spacing:8px; font-weight:bold; color:#FF6A00;">${otpCode}</span>
                </div>
                <p style="font-size:13px; line-height:1.6; color:#777;">This code is valid for 10 minutes. If you did not request this code, immediately audit your environment and secure your root keys.</p>
              </div>
              <div style="background:#f5f5f7; padding:16px 32px; text-align:center; color:#86868b; font-size:11px; border-top:1px solid #e0e0e0;">
                StackForge System Guard · Hyderabad, India
              </div>
            </div>
          `,
          headers: {
            "Precedence": "list",
            "X-Auto-Response-Suppress": "All",
          },
        });
        console.log(`[SECURITY] Resent Admin MFA mail dispatched successfully to ${adminEmail}`);
      } catch (mailErr) {
        console.error("[SECURITY] Failed to resend Admin MFA mail:", mailErr);
        return NextResponse.json({ error: "Failed to dispatch resentment key. Please check SMTP configuration." }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "A new verification key has been sent to your inbox." });
    }

    // Phase check
    const isMfaSubmission = email && mfaCode;

    if (isMfaSubmission) {
      // ── Phase 2: Verify MFA Code ──
      if (email.trim().toLowerCase() !== adminEmail) {
        console.warn(`[SECURITY] Access Denied: Admin email mismatch for MFA verification`);
        return NextResponse.json({ error: "Access Denied: Invalid authorization request" }, { status: 403 });
      }

      // Fetch OTP record from Supabase
      const { data: record, error: dbErr } = await supabase
        .from("OtpVerification")
        .select("*")
        .eq("email", adminEmail)
        .single();

      if (dbErr || !record) {
        return NextResponse.json({ error: "Verification code expired or not found. Please log in again." }, { status: 400 });
      }

      const now = new Date();
      if (now > new Date(record.expiresAt)) {
        return NextResponse.json({ error: "Verification code has expired. Please log in again." }, { status: 400 });
      }

      if (record.code !== mfaCode.trim()) {
        return NextResponse.json({ error: "Incorrect verification code. Please check your inbox and try again." }, { status: 400 });
      }

      // Delete verified OTP to prevent replay attacks
      await supabase
        .from("OtpVerification")
        .delete()
        .eq("email", adminEmail);

      // Sign JWT session
      const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(getJwtSecret());

      cookieStore.set("admin_session", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
      });

      return NextResponse.json({ success: true, message: "Authenticated successfully" });
    } else {
      // ── Phase 1: Verify Password and Dispatch MFA Code ──
      if (!process.env.ADMIN_PASSWORD) {
        console.error("[SECURITY] ADMIN_PASSWORD environment variable is missing!");
        return NextResponse.json({ error: "System configuration error: secure credentials not set." }, { status: 500 });
      }

      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      // Generate secure 6-digit numeric OTP
      const otpCode = randomInt(100000, 1000000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // Clear old OTPs
      await supabase
        .from("OtpVerification")
        .delete()
        .eq("email", adminEmail);

      // Save to database
      const { error: dbErr } = await supabase
        .from("OtpVerification")
        .insert([
          {
            email: adminEmail,
            code: otpCode,
            expiresAt: expiresAt.toISOString(),
          },
        ]);

      if (dbErr) {
        console.error("[SECURITY] Database failed to store admin MFA code:", dbErr);
        return NextResponse.json({ error: "Database error saving validation key" }, { status: 500 });
      }

      // Dispatch mail
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"StackForge System Guard" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: "⚠️ SECURITY PROTOCOL: Console Login Verification Code",
          text: `StackForge Console Login verification code: ${otpCode}. It expires in 10 minutes.`,
          html: `
            <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; max-width:560px; margin:0 auto; border:1px solid #e0e0e0; border-radius:14px; overflow:hidden; background:#ffffff;">
              <div style="background:#0A0A0A; padding:24px 32px; text-align:center; border-bottom:4px solid #FF6A00;">
                <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:800; letter-spacing:2px; font-family:Georgia,serif;">STACKFORGE</h1>
                <p style="color:#FF6A00; margin:4px 0 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; font-family:monospace;">Security Protocol Shield</p>
              </div>
              <div style="padding:32px;">
                <h2 style="color:#FF6A00; margin-top:0; font-size:18px; font-weight:700;">Console MFA Verification Code</h2>
                <p style="font-size:15px; line-height:1.6; color:#333;">A request to log in to the StackForge Console database was initiated. Verification is required to authorize this session.</p>
                <div style="background:#fcf8f2; border-left:4px solid #FF6A00; padding:16px; margin:20px 0; font-family:monospace; text-align:center;">
                  <span style="font-size:32px; letter-spacing:8px; font-weight:bold; color:#FF6A00;">${otpCode}</span>
                </div>
                <p style="font-size:13px; line-height:1.6; color:#777;">This code is valid for 10 minutes. If you did not request this code, immediately audit your environment and secure your root keys.</p>
              </div>
              <div style="background:#f5f5f7; padding:16px 32px; text-align:center; color:#86868b; font-size:11px; border-top:1px solid #e0e0e0;">
                StackForge System Guard · Hyderabad, India
              </div>
            </div>
          `,
          headers: {
            "Precedence": "list",
            "X-Auto-Response-Suppress": "All",
          },
        });
        console.log(`[SECURITY] Admin MFA mail dispatched successfully to ${adminEmail}`);
      } catch (mailErr) {
        console.error("[SECURITY] Failed to send Admin MFA mail:", mailErr);
        if (process.env.NODE_ENV === "production") {
          return NextResponse.json({ error: "Failed to dispatch MFA verification code. Please try again." }, { status: 500 });
        }
      }

      return NextResponse.json({ success: true, mfaRequired: true, email: adminEmail });
    }
  } catch (error) {
    console.error("[ADMIN-API] POST error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

// ── DELETE: Delete data records ──
export async function DELETE(req: NextRequest) {
  if (!process.env.SUPABASE_SECRET_KEY) {
    console.error("[SECURITY] SUPABASE_SECRET_KEY environment variable is missing!");
    return NextResponse.json({ error: "System configuration error: secure keys not set." }, { status: 500 });
  }
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "inquiry" | "subscriber"
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Missing type or id parameter" }, { status: 400 });
    }

    if (type === "inquiry") {
      const { error: delErr } = await supabase
        .from("ContactSubmission")
        .delete()
        .eq("id", id);

      if (delErr) throw delErr;
      return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
    } else if (type === "subscriber") {
      const { error: delErr } = await supabase
        .from("Newsletter")
        .delete()
        .eq("id", id);

      if (delErr) throw delErr;
      return NextResponse.json({ success: true, message: "Subscriber deleted successfully" });
    } else {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }
  } catch (error) {
    console.error("[ADMIN-API] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}

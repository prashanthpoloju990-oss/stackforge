import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";

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

    const body = await req.json();
    const { password, email, mfaCode } = body;

    // Phase check
    const isMfaSubmission = email && mfaCode;
    const adminEmail = (process.env.SMTP_USER || "stackforge.co@gmail.com").trim().toLowerCase();

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

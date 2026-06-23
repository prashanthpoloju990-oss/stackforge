import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error("SUPABASE_SECRET_KEY is missing");
  }
  return new TextEncoder().encode(secret);
}

export async function POST(req: NextRequest) {
  try {
    const { email, otpCode } = await req.json();

    if (!email || !otpCode) {
      return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    // Fetch code from Supabase
    const { data: record, error: dbErr } = await supabase
      .from("OtpVerification")
      .select("*")
      .eq("email", trimmedEmail)
      .single();

    if (dbErr || !record) {
      return NextResponse.json({ error: "Verification code expired or not found. Please try again." }, { status: 400 });
    }

    const now = new Date();
    if (now > new Date(record.expiresAt)) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    if (record.code !== cleanOtp) {
      return NextResponse.json({ error: "Incorrect verification code. Please check your inbox and try again." }, { status: 400 });
    }

    // Delete verified OTP to prevent replay attacks
    await supabase
      .from("OtpVerification")
      .delete()
      .eq("email", trimmedEmail);

    // Sign JWT token
    const token = await new SignJWT({ role: "client", email: trimmedEmail })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // 7 days session for client convenience
      .sign(getJwtSecret());

    const cookieStore = await cookies();
    cookieStore.set("portal_session", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error("[PORTAL-LOGIN-API] Login verification failure:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET or SUPABASE_SECRET_KEY is missing");
  }
  return new TextEncoder().encode(secret);
}

async function getPortalSession(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("portal_session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload && payload.role === "client" && typeof payload.email === "string") {
      return payload.email;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({ error: "System configuration missing key" }, { status: 500 });
  }

  const clientEmail = await getPortalSession();
  if (!clientEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch inquiries associated with the client's email
    const { data: projects, error: dbErr } = await supabase
      .from("ContactSubmission")
      .select("id, name, contact, businessType, serviceNeed, budget, timeline, details, attachments, pageCount, features, status, progress, figmaLink, stagingLink, clientNotes, createdAt")
      .eq("contact", clientEmail)
      .order("createdAt", { ascending: false });

    if (dbErr) {
      console.error("[PORTAL-DATA-API] Supabase fetch error:", dbErr);
      return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
    }

    return NextResponse.json({ email: clientEmail, projects: projects || [] }, { status: 200 });
  } catch (error) {
    console.error("[PORTAL-DATA-API] Unexpected error:", error);
    return NextResponse.json({ error: "Data retrieval failed" }, { status: 500 });
  }
}

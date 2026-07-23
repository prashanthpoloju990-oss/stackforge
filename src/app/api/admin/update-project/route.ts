import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

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

export async function POST(req: NextRequest) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, progress, figmaLink, stagingLink, clientNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    // Validate progress
    const parsedProgress = parseInt(String(progress), 10);
    if (isNaN(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
      return NextResponse.json({ error: "Progress must be a number between 0 and 100" }, { status: 400 });
    }

    const { data: updatedData, error: updateErr } = await supabase
      .from("ContactSubmission")
      .update({
        status: status || "pending",
        progress: parsedProgress,
        figmaLink: figmaLink || null,
        stagingLink: stagingLink || null,
        clientNotes: clientNotes || null,
      })
      .eq("id", id)
      .select();

    if (updateErr) {
      console.error("[UPDATE-PROJECT-API] Supabase update error:", updateErr);
      return NextResponse.json({ error: "Failed to update project in database" }, { status: 500 });
    }

    if (!updatedData || updatedData.length === 0) {
      return NextResponse.json({ error: "Inquiry record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project updated successfully", data: updatedData[0] });
  } catch (error) {
    console.error("[UPDATE-PROJECT-API] Unexpected error:", error);
    return NextResponse.json({ error: "Update operation failed" }, { status: 500 });
  }
}

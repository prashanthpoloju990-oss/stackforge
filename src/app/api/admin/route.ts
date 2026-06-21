import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "forge-admin-2026";

function authenticate(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-password");
  return authHeader === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const inquiries = await db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    const subscribers = await db.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries, subscribers }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN-API] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!authenticate(req)) {
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
      await db.contactSubmission.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
    } else if (type === "subscriber") {
      await db.newsletter.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: "Subscriber deleted successfully" });
    } else {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }
  } catch (error) {
    console.error("[ADMIN-API] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}

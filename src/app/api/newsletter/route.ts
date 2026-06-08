import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    await db.newsletter.create({ data: { email: trimmed } });

    return Response.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Server error";

    if (message.includes("Unique constraint")) {
      return Response.json(
        { error: "You're already subscribed!" },
        { status: 409 }
      );
    }

    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

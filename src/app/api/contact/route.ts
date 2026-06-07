import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, contact, businessType, serviceNeed, budget, timeline, details } = body;

    if (!name?.trim() || !contact?.trim()) {
      return NextResponse.json(
        { error: "Name and contact information are required." },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "Name is too long." },
        { status: 400 }
      );
    }

    if (contact.trim().length > 200) {
      return NextResponse.json(
        { error: "Contact info is too long." },
        { status: 400 }
      );
    }

    const submission = await db.contactSubmission.create({
      data: {
        name: name.trim(),
        contact: contact.trim(),
        businessType: businessType?.trim() || null,
        serviceNeed: serviceNeed?.trim() || null,
        budget: budget?.trim() || null,
        timeline: timeline?.trim() || null,
        details: details?.trim() || null,
      },
    });

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

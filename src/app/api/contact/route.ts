import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ── Validation rules ── */
const REQUIRED_FIELDS = [
  "name",
  "contact",
  "businessType",
  "serviceNeed",
  "budget",
  "timeline",
] as const;

const VALID_BUSINESS_TYPES = [
  "Startup",
  "Local Business",
  "Personal Brand",
  "Agency",
  "Enterprise",
  "Other",
];

const VALID_SERVICES = [
  "New Website",
  "Website Redesign",
  "Landing Page",
  "UI/UX Design",
  "Full Stack App",
  "Not sure yet",
];

const VALID_BUDGETS = [
  "$100 – $300",
  "$300 – $700",
  "$700 – $1,500",
  "$1,500 – $5,000",
  "$5,000+",
];

const VALID_TIMELINES = [
  "Urgent (1–3 days)",
  "This week",
  "This month",
  "Flexible",
  "3+ months",
];

function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str.trim());
}

function isWhatsApp(str: string): boolean {
  return /^\+?\d[\d\s-]{9,}$/.test(str.replace(/\s/g, ""));
}

function isValidFieldLength(value: string, min: number, max: number): boolean {
  return value.trim().length >= min && value.trim().length <= max;
}

/* Sanitize string — strip HTML tags and trim */
function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, "") // strip HTML
    .replace(/\p{C}/gu, "")   // strip control characters
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      contact,
      businessType,
      serviceNeed,
      budget,
      timeline,
      details,
    } = body;

    /* ── Required field checks ── */
    const missing: string[] = [];
    for (const field of REQUIRED_FIELDS) {
      if (!body[field]?.trim()) {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missing.join(", ")}. Please fill in all required fields.`,
        },
        { status: 400 }
      );
    }

    /* ── Name validation ── */
    const sanitizedName = sanitize(name);
    if (!isValidFieldLength(sanitizedName, 2, 100)) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters." },
        { status: 400 }
      );
    }
    if (/^\d+$/.test(sanitizedName)) {
      return NextResponse.json(
        { error: "Name cannot be only numbers." },
        { status: 400 }
      );
    }

    /* ── Contact validation ── */
    const sanitizedContact = sanitize(contact);
    if (!isEmail(sanitizedContact) && !isWhatsApp(sanitizedContact)) {
      return NextResponse.json(
        {
          error:
            "Invalid contact info. Please provide a valid email address or WhatsApp number (10+ digits).",
        },
        { status: 400 }
      );
    }

    /* ── Business type validation ── */
    const sanitizedBT = sanitize(businessType);
    if (!VALID_BUSINESS_TYPES.includes(sanitizedBT)) {
      return NextResponse.json(
        { error: "Please select a valid business type." },
        { status: 400 }
      );
    }

    /* ── Service validation ── */
    const sanitizedService = sanitize(serviceNeed);
    if (!VALID_SERVICES.includes(sanitizedService)) {
      return NextResponse.json(
        { error: "Please select a valid service." },
        { status: 400 }
      );
    }

    /* ── Budget validation ── */
    const sanitizedBudget = sanitize(budget);
    if (!VALID_BUDGETS.includes(sanitizedBudget)) {
      return NextResponse.json(
        { error: "Please select a valid budget range." },
        { status: 400 }
      );
    }

    /* ── Timeline validation ── */
    const sanitizedTimeline = sanitize(timeline);
    if (!VALID_TIMELINES.includes(sanitizedTimeline)) {
      return NextResponse.json(
        { error: "Please select a valid timeline." },
        { status: 400 }
      );
    }

    /* ── Details validation (optional) ── */
    const sanitizedDetails = details ? sanitize(details) : null;
    if (sanitizedDetails && sanitizedDetails.length > 2000) {
      return NextResponse.json(
        { error: "Project details must be under 2000 characters." },
        { status: 400 }
      );
    }

    /* ── Rate limiting (simple IP-based check) ── */
    const clientIP =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check for recent submissions from same IP (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentCount = await db.contactSubmission.count({
      where: {
        createdAt: { gte: fiveMinutesAgo },
        // Note: We don't store IP, so this is a placeholder for future enhancement
      },
    });

    // Allow max 3 submissions per 5 minutes as a basic safeguard
    if (recentCount >= 3) {
      return NextResponse.json(
        {
          error:
            "Too many submissions. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    /* ── Save to database ── */
    const submission = await db.contactSubmission.create({
      data: {
        name: sanitizedName,
        contact: sanitizedContact,
        businessType: sanitizedBT,
        serviceNeed: sanitizedService,
        budget: sanitizedBudget,
        timeline: sanitizedTimeline,
        details: sanitizedDetails,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: submission.id,
        message: "Your inquiry has been received. We'll get back to you within 12 hours.",
      },
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

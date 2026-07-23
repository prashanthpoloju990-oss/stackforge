import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { callOpenRouterAI, parseJsonFromAiText } from "@/lib/ai-openrouter";

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
    const { inquiryId } = await req.json();

    if (!inquiryId) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    // Fetch the client inquiry details from Supabase
    const { data: inquiry, error: dbErr } = await supabase
      .from("ContactSubmission")
      .select("*")
      .eq("id", inquiryId)
      .single();

    if (dbErr || !inquiry) {
      console.error("[AI-INQUIRY-API] DB error or inquiry not found:", dbErr);
      return NextResponse.json({ error: "Inquiry not found in database" }, { status: 404 });
    }

    const contactMethod = inquiry.contact.includes("@") ? "Email" : "WhatsApp / Phone";

    const systemPrompt = `You are an elite business analyst and sales strategist for StackForge, a premium digital engineering studio based in Hyderabad, India. StackForge builds high-end bespoke web platforms using cutting-edge tech (Next.js, Tailwind CSS, Supabase, React).
    
Your task is to analyze a new client lead and draft a personalized response.
    
CLIENT INQUIRY DETAILS:
- Client Name: ${inquiry.name}
- Contact Method: ${contactMethod} (${inquiry.contact})
- Business Type: ${inquiry.businessType || "N/A"}
- Service Need: ${inquiry.serviceNeed || "N/A"}
- Budget: ${inquiry.budget || "N/A"}
- Timeline: ${inquiry.timeline || "N/A"}
- Selected Features: ${inquiry.features || "None"}
- Project Details: ${inquiry.details || "No details provided"}

Your response MUST be a valid JSON object with the following fields:
{
  "analysis": "A beautiful, professional markdown analysis assessing: (1) Lead Fit Score (0-100%), (2) Budget/Timeline Alignment, (3) Recommended Stack/Architecture, (4) Potential Risks & Key Questions to clarify. Keep the analysis organized with headers, bullet points, and clear ratings.",
  "draftReply": "A highly-converting, professional reply addressing the client's specific requirements. Since the client's contact method is ${contactMethod}, format the message accordingly:
   - For Email: Include a polite subject line at the top, professional greetings, specific appreciation of their project scope, and a clear call-to-action (booking a meeting or booking an onboarding call).
   - For WhatsApp/Phone: A shorter, punchy, conversational chat message that opens the dialogue.
   Do not include placeholder text; write it fully as if ready to transmit."
}

Ensure all JSON strings are properly escaped. Do not output any text before or after the JSON block.`;

    const rawText = await callOpenRouterAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze this client lead and write a high-converting, personalized draft reply." }
      ],
      { maxTokens: 2500 }
    );

    const parsedData = parseJsonFromAiText(rawText);

    if (!parsedData) {
      return NextResponse.json({ error: "Failed to parse structured JSON from AI output" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analysis: parsedData.analysis || rawText,
      draftReply: parsedData.draftReply || ""
    });
  } catch (error: any) {
    console.error("[AI-INQUIRY-API] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze inquiry" }, { status: 502 });
  }
}

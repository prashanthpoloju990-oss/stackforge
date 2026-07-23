import { NextRequest, NextResponse } from "next/server";
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
    const { prompt, tone } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = `You are a world-class senior developer and copywriter for StackForge, a premium digital engineering studio based in Hyderabad, India. StackForge builds bespoke high-performance web applications using React, Next.js, and Supabase.
    
Your task is to write an engaging email newsletter broadcast to our subscribers based on the user's instructions.
The requested newsletter tone/style is: "${tone || "witty"}".

Output MUST be a valid JSON object matching this schema:
{
  "subject": "A compelling, creative, and professional subject line",
  "previewText": "A catchy, short preview snippet (under 80 characters)",
  "bodyHtml": "The newsletter main content in HTML. ONLY output tags like <p>, <strong>, <em>, <a>, <ul>, <li>, <h3 style='color:#FF6A00;'>. Do NOT output a full HTML page document, header, or footer, as this content will be injected into our custom styled template shell. Add style='color:#FF6A00; text-decoration:none; font-weight:bold;' for any link <a> tags. Keep content concise, high-value, and zero-bloat."
}

Ensure all JSON strings are properly escaped. Do not output any text before or after the JSON block.`;

    const rawText = await callOpenRouterAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Draft a newsletter broadcast with the topic: ${prompt}` }
      ],
      { maxTokens: 2000 }
    );

    const parsedData = parseJsonFromAiText(rawText);

    if (!parsedData) {
      return NextResponse.json({ error: "Failed to parse structured JSON from AI output" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      subject: parsedData.subject || "",
      previewText: parsedData.previewText || "",
      bodyHtml: parsedData.bodyHtml || ""
    });
  } catch (error: any) {
    console.error("[AI-NEWSLETTER-API] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate newsletter draft" }, { status: 502 });
  }
}

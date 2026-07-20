import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET or SUPABASE_SECRET_KEY is missing");
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

export async function POST(req: NextRequest) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenRouter API Key is not configured" }, { status: 500 });
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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://stackforge.co.in",
        "X-Title": "StackForge",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Draft a newsletter broadcast with the topic: ${prompt}` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[AI-NEWSLETTER-API] OpenRouter failed response:", errText);
      return NextResponse.json({ error: "OpenRouter service returned an error" }, { status: 502 });
    }

    const completion = await response.json();
    let content = completion.choices?.[0]?.message?.content || "";
    
    // Clean up potential markdown wrappers
    if (content.startsWith("```")) {
      content = content.replace(/^```json\s*/i, "").replace(/```\s*$/g, "").trim();
    }

    try {
      const parsedData = JSON.parse(content);
      return NextResponse.json({
        success: true,
        subject: parsedData.subject || "",
        previewText: parsedData.previewText || "",
        bodyHtml: parsedData.bodyHtml || ""
      });
    } catch (parseError) {
      console.error("[AI-NEWSLETTER-API] JSON parse error on content:", content, parseError);
      return NextResponse.json({ error: "AI response did not follow the required JSON structure" }, { status: 500 });
    }
  } catch (error) {
    console.error("[AI-NEWSLETTER-API] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to generate newsletter draft" }, { status: 500 });
  }
}

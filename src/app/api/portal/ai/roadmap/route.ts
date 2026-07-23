import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

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

export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({ error: "System configuration missing key" }, { status: 500 });
  }

  const clientEmail = await getPortalSession();
  if (!clientEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Fetch the project from Supabase
    const { data: project, error: dbErr } = await supabase
      .from("ContactSubmission")
      .select("*")
      .eq("id", projectId)
      .single();

    if (dbErr || !project) {
      console.error("[PORTAL-ROADMAP-API] DB error or project not found:", dbErr);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Ensure the client owns this project record
    if (project.contact.toLowerCase() !== clientEmail.toLowerCase()) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // If clientNotes contains a generated roadmap, return it directly
    if (project.clientNotes && (project.clientNotes.includes("### AI") || project.clientNotes.includes("Roadmap"))) {
      return NextResponse.json({
        success: true,
        roadmap: project.clientNotes
      });
    }

    // Otherwise, generate the roadmap dynamically using OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API is not configured" }, { status: 500 });
    }

    const systemPrompt = `You are a world-class Agile Project Manager at StackForge. Your job is to draft a premium development roadmap for a client based on their project inquiry specs.
    
PROJECT DETAILS:
- Project Type: ${project.serviceNeed || "Bespoke System"}
- Business Category: ${project.businessType || "General Web Project"}
- Budget Bracket: ${project.budget || "N/A"}
- Requested Timeline: ${project.timeline || "N/A"}
- Target Pages: ${project.pageCount || "Single Page / Landing"}
- Required Integrations: ${project.features || "None"}
- Project Details: ${project.details || "No details provided"}

Write a clean, highly motivating, and premium development roadmap in Markdown format. Use clear headings (## or ###), bullet points, and highlight tech recommendations.
Include:
1. ### Project Architecture & Tech Stack: (recommend a modern premium stack like Next.js App Router, Tailwind CSS, Supabase PostgreSQL, and Framer Motion).
2. ### Expected Development Milestones: (Milestone 1: UI/UX Canvas design, Milestone 2: Core Engineering, Milestone 3: Database & Security Integrations, Milestone 4: Edge deployment & Optimization).
3. ### Actions Required from Client: (what details or assets we need next from them, e.g. brand assets, high-res images, or copywriting drafts).

Output ONLY the Markdown roadmap text. Keep it professional, concise, encouraging, and clear.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://stackforge.co.in",
        "X-Title": "StackForge",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the roadmap for my project." }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[PORTAL-ROADMAP-API] OpenRouter failed response:", errText);
      return NextResponse.json({ error: "OpenRouter service returned an error generating roadmap" }, { status: 502 });
    }

    const completion = await response.json();
    const roadmapText = completion.choices?.[0]?.message?.content || "";

    if (!roadmapText) {
      return NextResponse.json({ error: "Roadmap text was empty" }, { status: 500 });
    }

    // Save the generated roadmap into clientNotes in the database
    const { error: updateErr } = await supabase
      .from("ContactSubmission")
      .update({ clientNotes: roadmapText })
      .eq("id", projectId);

    if (updateErr) {
      console.warn("[PORTAL-ROADMAP-API] Failed to update clientNotes with roadmap in Supabase:", updateErr);
    }

    return NextResponse.json({
      success: true,
      roadmap: roadmapText
    });
  } catch (error) {
    console.error("[PORTAL-ROADMAP-API] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to load project roadmap" }, { status: 500 });
  }
}

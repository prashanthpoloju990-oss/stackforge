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
    const { topic, category, keywords } = await req.json();

    if (!topic || !category) {
      return NextResponse.json({ error: "Topic and Category are required" }, { status: 400 });
    }

    const systemPrompt = `You are a world-class senior developer and technical writer for StackForge, a premium digital engineering studio based in Hyderabad, India. StackForge builds bespoke high-performance web applications using React, Next.js, and Supabase.
    
Your task is to write a comprehensive, engaging, and professional blog post based on the user's instructions.
The post category is: "${category}".
SEO keywords to incorporate naturally: "${keywords || "none"}".

Output MUST be a valid JSON object matching this schema:
{
  "title": "A compelling, high-impact blog post title",
  "slug": "url-friendly-slug-in-lowercase-and-hyphens-only",
  "excerpt": "A short, engaging teaser/meta description for the blog list page (under 140 characters)",
  "content": "The full blog post content in Markdown format. Use clear headings (## or ###), code blocks if code is shown, bold text, lists, and bullet points. Make it detailed, informative, and authoritative.",
  "readTime": "e.g. 5 min read",
  "author": "Anil Kumar, Tech Lead",
  "tags": ["Tag1", "Tag2", "Tag3"]
}

Ensure all JSON strings are properly escaped. Do not output any text before or after the JSON block.`;

    const rawText = await callOpenRouterAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write a blog post about: ${topic}` }
      ],
      { maxTokens: 3000 }
    );

    const parsedBlog = parseJsonFromAiText(rawText);

    if (!parsedBlog) {
      return NextResponse.json({ error: "AI output could not be parsed into JSON" }, { status: 500 });
    }

    const bannerImageUrl = "/download";

    const newPost = {
      title: parsedBlog.title || topic,
      slug: parsedBlog.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: parsedBlog.readTime || "5 min read",
      author: parsedBlog.author || "Anil Kumar, Tech Lead",
      category: parsedBlog.category || category,
      tags: parsedBlog.tags || ["AI", "Web Dev"],
      excerpt: parsedBlog.excerpt || "",
      content: parsedBlog.content || "",
      bannerImage: bannerImageUrl,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      post: newPost
    });
  } catch (error: any) {
    console.error("[AI-BLOG-API] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate blog post" }, { status: 502 });
  }
}

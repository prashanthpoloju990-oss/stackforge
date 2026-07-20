import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

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
    const { topic, category, keywords } = await req.json();

    if (!topic || !category) {
      return NextResponse.json({ error: "Topic and Category are required" }, { status: 400 });
    }

    // Step 1: Generate Blog Post text
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
  "tags": ["Tag1", "Tag2", "Tag3"],
  "bannerImagePrompt": "A highly detailed, professional descriptive prompt for generating a landscape banner image representing this article's topic. This prompt will be sent directly to the Flux image model (e.g. 'A futuristic server rack with glowing neon fibers and code lines floating, 3D render, dark background, cinematic lighting')."
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
          { role: "user", content: `Write a blog post about: ${topic}` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[AI-BLOG-API] OpenRouter failed response:", errText);
      return NextResponse.json({ error: "OpenRouter service returned an error drafting text" }, { status: 502 });
    }

    const completion = await response.json();
    let contentStr = completion.choices?.[0]?.message?.content || "";
    
    // Clean up potential markdown wrappers
    if (contentStr.startsWith("```")) {
      contentStr = contentStr.replace(/^```json\s*/i, "").replace(/```\s*$/g, "").trim();
    }

    let parsedBlog;
    try {
      parsedBlog = JSON.parse(contentStr);
    } catch (parseError) {
      console.error("[AI-BLOG-API] JSON parse error on content:", contentStr, parseError);
      return NextResponse.json({ error: "AI response did not follow the required JSON structure" }, { status: 500 });
    }

    // Step 2: Use default neobrutalist local placeholder as cover image
    const bannerImageUrl = "/download";

    // Step 3: Write new blog post to the dynamic posts JSON database
    const dynamicPostsFilePath = path.join(process.cwd(), "src", "lib", "blog-posts-dynamic.json");
    let dynamicPosts: any[] = [];

    if (fs.existsSync(dynamicPostsFilePath)) {
      try {
        const fileContent = fs.readFileSync(dynamicPostsFilePath, "utf8");
        dynamicPosts = JSON.parse(fileContent || "[]");
      } catch (readErr) {
        console.error("[AI-BLOG-API] Error reading dynamic posts file, resetting to empty array:", readErr);
      }
    }

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

    dynamicPosts.unshift(newPost); // Add to the top of list
    try {
      fs.writeFileSync(dynamicPostsFilePath, JSON.stringify(dynamicPosts, null, 2), "utf8");
    } catch (writeErr) {
      console.warn("[AI-BLOG-API] Warning: Failed to write blog-posts-dynamic.json (expected in serverless environments):", writeErr);
    }

    return NextResponse.json({
      success: true,
      post: newPost
    });
  } catch (error) {
    console.error("[AI-BLOG-API] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to generate blog post" }, { status: 500 });
  }
}

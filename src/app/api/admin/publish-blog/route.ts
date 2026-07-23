import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

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

const dynamicPostsFilePath = path.join(process.cwd(), "src", "lib", "blog-posts-dynamic.json");

function readDynamicPosts() {
  try {
    if (fs.existsSync(dynamicPostsFilePath)) {
      const fileData = fs.readFileSync(dynamicPostsFilePath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error("[PUBLISH-BLOG] Error reading dynamic posts:", err);
  }
  return [];
}

function saveDynamicPosts(posts: any[]) {
  try {
    fs.writeFileSync(dynamicPostsFilePath, JSON.stringify(posts, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[PUBLISH-BLOG] Error writing dynamic posts:", err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = readDynamicPosts();
  return NextResponse.json({ success: true, posts });
}

export async function POST(req: NextRequest) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { post } = await req.json();

    if (!post || !post.title || !post.slug) {
      return NextResponse.json({ error: "Invalid post object" }, { status: 400 });
    }

    const currentPosts = readDynamicPosts();
    // Prepend new post, overwriting existing post with same slug if present
    const filtered = currentPosts.filter((p: any) => p.slug !== post.slug);
    const updated = [post, ...filtered];

    const saved = saveDynamicPosts(updated);
    if (!saved) {
      return NextResponse.json({ error: "Failed to persist blog post file" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Blog post published successfully", post });
  } catch (error) {
    console.error("[PUBLISH-BLOG] Error publishing post:", error);
    return NextResponse.json({ error: "Unexpected error publishing blog post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Missing post slug parameter" }, { status: 400 });
    }

    const currentPosts = readDynamicPosts();
    const updated = currentPosts.filter((p: any) => p.slug !== slug);

    const saved = saveDynamicPosts(updated);
    if (!saved) {
      return NextResponse.json({ error: "Failed to update blog post file" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Dynamic blog post removed" });
  } catch (error) {
    console.error("[PUBLISH-BLOG] Error deleting post:", error);
    return NextResponse.json({ error: "Unexpected error deleting blog post" }, { status: 500 });
  }
}

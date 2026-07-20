import fs from "fs";
import path from "path";
import { BLOG_POSTS, type BlogPost } from "./blog-data";

export function getMergedBlogPosts(): BlogPost[] {
  const dynamicPostsFilePath = path.join(process.cwd(), "src", "lib", "blog-posts-dynamic.json");
  let dynamicPosts: BlogPost[] = [];

  if (fs.existsSync(dynamicPostsFilePath)) {
    try {
      const fileContent = fs.readFileSync(dynamicPostsFilePath, "utf8");
      dynamicPosts = JSON.parse(fileContent || "[]");
    } catch (readErr) {
      console.error("[BLOG-DB] Error reading dynamic posts file:", readErr);
    }
  }

  // Ensure dynamic posts match BlogPost structure
  const formattedDynamicPosts = dynamicPosts.map((post: any) => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
    readTime: post.readTime,
    author: post.author,
    category: post.category,
    tags: post.tags || [],
    excerpt: post.excerpt || "",
    content: post.content || "",
    bannerImage: post.bannerImage || undefined
  }));

  return [...formattedDynamicPosts, ...BLOG_POSTS];
}

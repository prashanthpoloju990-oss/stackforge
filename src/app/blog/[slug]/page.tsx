import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog-data";
import { BlobButton } from "@/components/ui/blob-button";
import { Calendar, Clock, ArrowLeft, ArrowUpRight, Share2, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "Article Not Found | StackForge",
    };
  }
  return {
    title: `${post.title} | StackForge Blog`,
    description: post.excerpt,
  };
}

// A simple local markdown renderer component for rendering blog post content cleanly
function MarkdownRenderer({ content }: { content: string }) {
  const blocks = content.trim().split("\n\n");

  return (
    <div className="space-y-6 text-fluid-body-lg text-forge-text-secondary leading-relaxed font-sans">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        
        // Headers
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="text-fluid-h1 font-bold text-forge-text font-playfair tracking-tight mt-10 mb-6">
              {trimmed.replace("# ", "")}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="text-fluid-h2 font-bold text-forge-text font-syne tracking-tight mt-8 mb-4">
              {trimmed.replace("## ", "")}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="text-fluid-h3 font-bold text-forge-text font-syne tracking-tight mt-6 mb-3">
              {trimmed.replace("### ", "")}
            </h3>
          );
        }

        // Horizontal Rule
        if (trimmed === "---") {
          return <div key={index} className="w-full h-px bg-forge-divider/40 my-8" />;
        }

        // Lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").map(li => li.replace(/^[-*]\s+/, ""));
          return (
            <ul key={index} className="list-disc pl-6 space-y-2 my-4">
              {items.map((item, liIdx) => (
                <li key={liIdx} className="text-forge-text-secondary/80">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        }

        // Blockquotes
        if (trimmed.startsWith("> ")) {
          const quoteText = trimmed.replace(/^>\s+/, "");
          return (
            <div key={index} className="bg-forge-surface border-l-4 border-forge-accent rounded-r-lg p-6 my-6 italic flex gap-3">
              <Quote className="w-6 h-6 text-forge-accent/40 shrink-0" />
              <p className="text-forge-text/80">{quoteText}</p>
            </div>
          );
        }

        // Code blocks
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          // Remove the first line (```typescript) and last line (```)
          const code = lines.slice(1, -1).join("\n");
          return (
            <pre key={index} className="bg-forge-surface border border-forge-divider rounded-lg p-5 my-6 overflow-x-auto font-mono text-xs text-forge-text leading-normal scrollbar-thin">
              <code>{code}</code>
            </pre>
          );
        }

        // Standard Paragraph
        return (
          <p key={index} className="text-forge-text-secondary/70">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Handles simple bold (**text**) and inline code (`code`) matching
function parseInlineFormatting(text: string): React.ReactNode[] {
  // Regex to split on bold or inline code tokens
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={i} className="font-bold text-forge-text">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={i} className="px-1.5 py-0.5 bg-forge-surface border border-forge-divider rounded font-mono text-[13px] text-forge-accent">{token.slice(1, -1)}</code>;
    }
    return token;
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-forge-bg overflow-x-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="max-w-[850px] mx-auto px-6 md:px-12">
          
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-fluid-body text-forge-text-secondary/60 hover:text-forge-accent transition-colors duration-200 group font-mono text-sm"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Insights
            </Link>
          </div>

          {/* Header Metadata */}
          <div className="border-b border-forge-divider/40 pb-8 mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-forge-accent text-white uppercase rounded border border-forge-text shadow-[1px_1px_0px_0px_var(--forge-text)]">
                {post.category}
              </span>
            </div>

            <h1 className="text-fluid-hero md:text-fluid-display font-bold text-forge-text font-playfair mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-forge-text-secondary/60">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
              <div className="flex items-center gap-1 border-l border-forge-divider/40 pl-6">
                <span>By {post.author}</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <MarkdownRenderer content={post.content} />

          {/* Post Footer & Sharing */}
          <div className="border-y border-forge-divider/40 py-8 my-12 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-forge-text-secondary/50">Tags:</span>
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-forge-accent hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 text-forge-text-secondary/60 hover:text-forge-text transition-colors duration-200"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
              Share Article
            </button>
          </div>

          {/* Inline CTA Box */}
          <div className="relative group p-8 rounded-xl border-2 border-forge-text bg-forge-surface/30 overflow-hidden shadow-[4px_4px_0px_0px_var(--forge-accent)] hover:shadow-[6px_6px_0px_0px_var(--forge-accent)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-fluid-h3 font-bold text-forge-text font-syne">
                  Ready to validate your startup MVP?
                </h3>
                <p className="text-fluid-body text-forge-text-secondary/60 max-w-[420px]">
                  We build blazing fast Next.js applications and bespoke design systems optimized for conversions.
                </p>
              </div>

              <BlobButton
                asChild
                className="h-11 px-8 rounded-full border-2 border-forge-text font-bold text-xs uppercase tracking-wider relative shadow-[3px_3px_0px_0px_var(--forge-accent)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--forge-accent)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px] bg-forge-accent text-white shrink-0"
              >
                <Link href="/start-project" className="inline-flex items-center gap-2">
                  Work with Us
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </BlobButton>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

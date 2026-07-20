import Link from "next/link";
import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BlobButton } from "@/components/ui/blob-button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Blog | StackForge High-Performance Dev Studio",
  description: "Read the latest insights from the StackForge team on Next.js performance, custom design systems, web optimization, and startup MVP scaling.",
};

export default function BlogListingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg overflow-x-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-20">
          
          {/* Header */}
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              Insights & Engineering
            </span>
            <h1 className="text-fluid-display font-bold text-forge-text font-playfair mb-6 leading-tight">
              The <span className="text-forge-accent">StackForge</span> Blog
            </h1>
            <p className="text-fluid-body-lg text-forge-text-secondary/70 max-w-[600px] mx-auto leading-relaxed">
              Deep dives on high-performance web engineering, modern UI design systems, conversion optimization, and fast MVP development.
            </p>
          </div>

          {/* Featured Post */}
          {BLOG_POSTS.length > 0 && (
            <div className="mb-14">
              <article
                className={cn(
                  "group relative flex flex-col lg:flex-row bg-forge-surface/30 border-2 border-forge-text rounded-xl overflow-hidden transition-all duration-300",
                  "shadow-[6px_6px_0px_0px_var(--forge-accent)] hover:shadow-[10px_10px_0px_0px_var(--forge-accent)]",
                  "hover:translate-x-[-4px] hover:translate-y-[-4px]"
                )}
              >
                {/* Accent bar */}
                <div className="lg:w-2.5 bg-forge-accent/40 w-full lg:h-auto h-2 group-hover:bg-forge-accent transition-colors duration-300" />
                
                <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Meta info */}
                    <div className="flex items-center gap-2 flex-wrap text-fluid-micro text-forge-text-secondary/50 font-mono">
                      <span className="px-2 py-0.5 border border-forge-text text-forge-text bg-forge-bg uppercase font-bold rounded">
                        {BLOG_POSTS[0].category}
                      </span>
                      <span className="px-2 py-0.5 bg-forge-accent text-white uppercase text-[9px] font-bold tracking-wider rounded font-mono">
                        Featured Post
                      </span>
                      <span className="flex items-center gap-1 ml-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {BLOG_POSTS[0].date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {BLOG_POSTS[0].readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-fluid-h2 font-bold text-forge-text font-syne group-hover:text-forge-accent transition-colors duration-200">
                      <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="focus:outline-none">
                        {BLOG_POSTS[0].title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-fluid-body-lg text-forge-text-secondary/70 leading-relaxed max-w-[800px]">
                      {BLOG_POSTS[0].excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-forge-divider/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {BLOG_POSTS[0].tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide text-forge-text-secondary/40 bg-forge-bg rounded border border-forge-divider/50"
                        >
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                    </div>

                    {/* Read CTA */}
                    <BlobButton
                      asChild
                      className="w-full sm:w-auto px-6 h-10 border-2 border-forge-text font-bold text-xs uppercase tracking-wider relative shadow-[3px_3px_0px_0px_var(--forge-accent)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--forge-accent)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px] bg-forge-accent text-white rounded-md mt-2 sm:mt-0"
                    >
                      <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="inline-flex items-center justify-center gap-1.5">
                        Read Article
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </BlobButton>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* Grid for Remaining Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(1).map((post, index) => (
              <article
                key={post.slug}
                className={cn(
                  "group relative flex flex-col bg-forge-surface/30 border-2 border-forge-text rounded-xl overflow-hidden transition-all duration-300",
                  "shadow-[4px_4px_0px_0px_var(--forge-accent)] hover:shadow-[8px_8px_0px_0px_var(--forge-accent)]",
                  "hover:translate-x-[-3px] hover:translate-y-[-3px]"
                )}
              >
                {/* Visual Top Bar */}
                <div className="h-2 bg-forge-accent/40 w-full group-hover:bg-forge-accent transition-colors duration-300" />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Meta info */}
                    <div className="flex items-center gap-2 flex-wrap text-fluid-micro text-forge-text-secondary/50 font-mono">
                      <span className="px-2 py-0.5 border border-forge-text text-forge-text bg-forge-bg uppercase font-bold rounded">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-fluid-h3 font-bold text-forge-text font-syne group-hover:text-forge-accent transition-colors duration-200">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-fluid-body text-forge-text-secondary/60 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-forge-divider/40 space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide text-forge-text-secondary/40 bg-forge-bg rounded border border-[#E8E7E2]/10"
                        >
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                    </div>

                    {/* Read CTA */}
                    <BlobButton
                      asChild
                      className="w-full h-10 border-2 border-forge-text font-bold text-xs uppercase tracking-wider relative shadow-[3px_3px_0px_0px_var(--forge-accent)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--forge-accent)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px] bg-forge-accent text-white rounded-md mt-2"
                    >
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center justify-center gap-1.5">
                        Read Article
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </BlobButton>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

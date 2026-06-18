"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Clock, ArrowUpRight } from "lucide-react";

const posts = [
  {
    title: "Why Next.js 15 is the Best Framework for Startup MVPs",
    excerpt:
      "Server components, streaming, and built-in optimization make Next.js the obvious choice for shipping fast products.",
    category: "Development",
    date: "Jan 15, 2025",
    readTime: "6 min read",
    color: "#FF6A00",
    slug: "#",
  },
  {
    title: "The $0→$10K Landing Page Playbook",
    excerpt:
      "A step-by-step breakdown of how we design and build landing pages that actually convert visitors into customers.",
    category: "Business",
    date: "Jan 8, 2025",
    readTime: "8 min read",
    color: "#10B981",
    slug: "#",
  },
  {
    title: "Dark Mode Done Right: A Complete Guide",
    excerpt:
      "From CSS variables to component architecture — everything we've learned about implementing seamless theme switching.",
    category: "Design",
    date: "Dec 28, 2024",
    readTime: "10 min read",
    color: "#8B5CF6",
    slug: "#",
  },
  {
    title: "Web Performance in 2025: What Actually Matters",
    excerpt:
      "Forget outdated metrics. Here's what Core Web Vitals, real-user monitoring, and our own benchmarks tell us.",
    category: "Development",
    date: "Dec 20, 2024",
    readTime: "7 min read",
    color: "#FF6A00",
    slug: "#",
  },
  {
    title: "How We Cut Load Times by 73% for a SaaS Client",
    excerpt:
      "A real case study on optimizing a React dashboard — from bundle splitting to edge caching.",
    category: "Case Study",
    date: "Dec 12, 2024",
    readTime: "5 min read",
    color: "#F59E0B",
    slug: "#",
  },
  {
    title: "Designing for Trust: Psychology in Web Interfaces",
    excerpt:
      "Color, spacing, typography, and motion — the subtle design choices that make users feel confident in your product.",
    category: "Design",
    date: "Dec 5, 2024",
    readTime: "9 min read",
    color: "#8B5CF6",
    slug: "#",
  },
];

function categoryColor(category: string): string {
  switch (category) {
    case "Development":
      return "bg-[#FF6A00]/10 text-[#FF6A00] border-[#FF6A00]/20";
    case "Business":
      return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
    case "Design":
      return "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20";
    case "Case Study":
      return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
    default:
      return "bg-forge-surface/60 text-forge-text-secondary/50 border-forge-divider/40";
  }
}

export function Blog() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({
    threshold: 0.03,
  });

  return (
    <section id="blog" className="py-24 md:py-32 lg:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16 transition-all duration-600 ease-out",
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              Blog
            </span>
            <h2 className="text-fluid-h1 font-bold text-forge-text max-w-[500px] font-playfair">
              Insights &amp;{" "}
              <span className="text-forge-accent/70">Resources</span>
            </h2>
          </div>
          <p className="text-fluid-body-lg text-forge-text-secondary/60 max-w-[360px] md:text-right">
            Thoughts on development, design, and building products that
            actually perform.
          </p>
        </div>

        {/* Posts Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {posts.map((post, index) => (
            <a
              key={post.title}
              href={post.slug}
              className={cn(
                "group block rounded-xl border border-forge-divider bg-forge-surface/30 overflow-hidden card-hover transition-all duration-600 ease-out",
                gridVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[20px]"
              )}
              style={{
                transitionDelay: gridVisible ? `${index * 100}ms` : "0ms",
              }}
              aria-label={`Read: ${post.title}`}
            >
              {/* Thumbnail — color placeholder */}
              <div
                className="relative w-full aspect-[16/9] overflow-hidden"
                style={{
                  background: `${post.color}10`,
                }}
              >
                {/* Decorative geometric shapes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-xl border opacity-20 rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                    style={{ borderColor: post.color }}
                  />
                  <div
                    className="absolute w-10 h-10 rounded-lg border opacity-15 -rotate-6 -top-4 -right-2 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110"
                    style={{ borderColor: post.color }}
                  />
                  <div
                    className="absolute w-6 h-6 rounded-full opacity-10 bottom-3 left-6 transition-transform duration-500 group-hover:scale-125"
                    style={{ backgroundColor: post.color }}
                  />
                </div>
                {/* Category badge overlay */}
                <div className="absolute top-3 left-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium tracking-wide border",
                      categoryColor(post.category)
                    )}
                  >
                    {post.category}
                  </span>
                </div>
                {/* Arrow icon on hover */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-forge-divider/40 bg-forge-bg/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <ArrowUpRight className="w-3.5 h-3.5 text-forge-text-secondary/60" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-fluid-h4 font-semibold text-forge-text font-syne leading-snug group-hover:text-forge-accent transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="mt-2.5 text-fluid-body text-forge-text-secondary/60 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta — read time + date */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-forge-divider/40">
                  <div className="flex items-center gap-1.5 text-[12px] text-forge-text-secondary/40">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                  <span className="text-[12px] text-forge-text-secondary/30">
                    {post.date}
                  </span>
                </div>

                {/* Read link */}
                <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-forge-accent/70 group-hover:text-forge-accent transition-all duration-300 group-hover:gap-2.5">
                  Read
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 13L13 1M13 1H5M13 1V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

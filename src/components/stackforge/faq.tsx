"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do you achieve a 100/100 Lighthouse performance score?",
    answer:
      "We write semantic, semantic-compliant HTML and build with Next.js App Router for optimal Server-Side Rendering (SSR). We optimize all assets dynamically via modern formats (WebP/AVIF), split code bundles at the component level, eliminate unused CSS, and defer third-party scripts. The result is a site that loads in milliseconds, directly boosting search rankings and conversion.",
  },
  {
    question: "What technology stack do you specialize in?",
    answer:
      "We are specialists in React, Next.js, and TypeScript for the frontend, styled with Tailwind CSS or custom CSS variables for light/dark mode adaptation. For the backend, we implement Node.js, PostgreSQL, or Supabase, using Prisma ORM for type-safe database queries. Everything is deployed to production-ready platforms like Vercel, Railway, or AWS.",
  },
  {
    question: "Do you build custom CMS integrations for content updates?",
    answer:
      "Yes. We integrate headless CMS platforms like Sanity, Contentful, or Strapi so your marketing team can easily update copy, articles, and media without touch-editing code. We also build custom database-backed dashboards when standard CMS options are too restrictive.",
  },
  {
    question: "How do you handle animations and interactive WebGL elements?",
    answer:
      "We implement GPU-accelerated motion systems using Framer Motion, Three.js, or lightweight libraries like OGL for high-performance canvas effects. Animations are optimized to run at 60 FPS, react dynamically to scroll, and fully respect user preferences like prefers-reduced-motion.",
  },
  {
    question: "How long does a typical custom build take from start to finish?",
    answer:
      "A high-performance landing page or MVP takes about 2 weeks. Custom B2B platforms, SaaS dashboards, or complex web applications range between 4 to 8 weeks. We ship incrementally in weekly sprints so you can test features as we write them.",
  },
  {
    question: "Can you work with our existing Figma designs?",
    answer:
      "Absolutely. We accept design specs from Figma or Sketch and translate them into pixel-perfect, accessible CSS structures. If you don't have designs, we can design your interface from scratch based on your brand identity.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08 });

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Filter FAQ items based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Remap open index to filtered list position
  const activeFilteredIndex = searchQuery
    ? null
    : openIndex;

  // If search is active, use a local state for which filtered item is open
  const [filteredOpenIndex, setFilteredOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    if (searchQuery) {
      setFilteredOpenIndex((prev) => (prev === index ? null : index));
      return;
    }
    toggle(index);
  };

  const isOpen = (index: number) => {
    return searchQuery ? filteredOpenIndex === index : openIndex === index;
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredOpenIndex(null);
  };

  return (
    <section id="faq" className="py-24 md:py-36 lg:py-44">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1200px] px-6 md:px-20 transition-all duration-600 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
        )}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              FAQ
            </span>
            <h2 className="text-fluid-h1 font-bold text-forge-text max-w-[500px] font-playfair">
              Common questions
            </h2>
          </div>
          <p className="text-fluid-body text-forge-text-secondary/40 max-w-[320px] md:text-right">
            Can&apos;t find what you&apos;re looking for? Reach out directly &mdash; we&apos;re happy to help.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-[780px] mb-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forge-text-secondary/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className={cn(
                "w-full h-11 pl-10 pr-10 rounded-lg",
                "bg-forge-surface border border-forge-divider",
                "text-fluid-body text-forge-text placeholder:text-forge-text-secondary/30",
                "outline-none transition-all duration-200",
                "focus:border-forge-accent/40 focus:ring-2 focus:ring-forge-accent/10"
              )}
              aria-label="Search frequently asked questions"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-forge-text-secondary/40 hover:text-forge-text/70 hover:bg-forge-surface transition-colors duration-150 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-[780px]">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-fluid-body text-forge-text-secondary/40">
                No questions found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-3 text-[13px] text-forge-accent font-medium hover:underline cursor-pointer"
                aria-label="Clear search"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const open = isOpen(index);
              const isLast = index === filteredFaqs.length - 1;

              return (
                <div
                  key={`${faq.question}-${index}`}
                  className={cn(
                    "border-b border-forge-divider/60 transition-opacity duration-200",
                    isLast && "border-b-0"
                  )}
                >
                  <button
                    onClick={() => handleToggle(index)}
                    className="w-full flex items-center justify-between py-5 md:py-6 text-left group cursor-pointer"
                    aria-expanded={open}
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-[12px] text-forge-text-secondary/20 font-mono shrink-0 w-5 text-right">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-fluid-body-lg font-medium transition-colors duration-200 pr-4",
                          open
                            ? "text-forge-text"
                            : "text-forge-text-secondary/70 group-hover:text-forge-text/90"
                        )}
                      >
                        {faq.question}
                      </span>
                    </span>

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 18 18"
                      fill="none"
                      className={cn(
                        "shrink-0 text-forge-text-secondary/30 transition-transform duration-300",
                        open && "rotate-180 text-forge-accent/60"
                      )}
                    >
                      <path
                        d="M4.5 6.75L9 11.25L13.5 6.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 md:pb-6 text-fluid-body text-forge-text-secondary/60 pl-9">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

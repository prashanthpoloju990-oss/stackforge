"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects ship in 2–6 weeks. A simple landing page can be ready in 5–7 business days. A full web application typically takes 4–8 weeks depending on scope.",
  },
  {
    question: "What's included in the pricing?",
    answer:
      "Design, development, responsive optimization, basic SEO, and deployment. Post-launch support and maintenance packages are available separately.",
  },
  {
    question: "Do you work with existing designs?",
    answer:
      "Yes. We build from your Figma/Sketch designs, or create everything from scratch based on your brand guidelines and preferences.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "React, Next.js, TypeScript, Tailwind CSS for the frontend. Node.js, Prisma, PostgreSQL, or Supabase for backend and database. Hosted on Vercel.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Monthly maintenance packages covering bug fixes, performance monitoring, content updates, and feature enhancements.",
  },
  {
    question: "How do we get started?",
    answer:
      "Fill out the contact form or email us. We schedule a free 30-minute call to understand your needs and provide a tailored proposal within 48 hours.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08 });

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-24 md:py-32 lg:py-[110px]">
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
            Can&apos;t find what you&apos;re looking for? Reach out directly — we&apos;re happy to help.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-[780px]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const isLast = index === faqs.length - 1;

            return (
              <div
                key={index}
                className={cn(
                  "border-b border-forge-divider/60",
                  isLast && "border-b-0"
                )}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between py-5 md:py-6 text-left group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[12px] text-forge-text-secondary/20 font-mono shrink-0 w-5 text-right">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-fluid-body-lg font-medium transition-colors duration-200 pr-4",
                        isOpen
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
                      isOpen && "rotate-180 text-forge-accent/60"
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
                    isOpen
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
          })}
        </div>
      </div>
    </section>
  );
}

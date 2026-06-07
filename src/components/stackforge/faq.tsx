"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects are delivered in 2–6 weeks depending on scope. A simple landing page can be ready in 5–7 business days, while a full web application typically takes 4–8 weeks.",
  },
  {
    question: "What's included in the pricing?",
    answer:
      "Every project includes design, development, responsive optimization, basic SEO, and deployment. Post-launch support and maintenance are available as add-ons.",
  },
  {
    question: "Do you work with existing designs?",
    answer:
      "Absolutely. We can build from your Figma/Sketch designs or create the design from scratch based on your brand guidelines and preferences.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We primarily work with React, Next.js, TypeScript, and Tailwind CSS. For backend integrations, we use Node.js, Prisma, and PostgreSQL.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. We offer monthly maintenance packages that include bug fixes, performance monitoring, content updates, and feature enhancements.",
  },
  {
    question: "How do we get started?",
    answer:
      "Simply fill out the contact form below or reach out via email. We'll schedule a free 30-minute consultation to understand your needs and provide a tailored proposal.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08 });

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-24 md:py-32 lg:py-[120px]">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1200px] px-6 md:px-20 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Centered Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase block mb-4 font-mono">
            FAQ
          </span>
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold leading-[1.08] tracking-[-0.03em] text-forge-text font-playfair">
            Common Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="max-w-[800px] mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const isLast = index === faqs.length - 1;

            return (
              <div
                key={index}
                className={cn(
                  "border-b border-forge-divider",
                  isLast && "border-b-0"
                )}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between py-5 md:py-6 text-left group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "text-[16px] md:text-[17px] font-medium transition-colors duration-200 pr-4",
                      isOpen
                        ? "text-forge-text"
                        : "text-forge-text group-hover:text-forge-text/90"
                    )}
                  >
                    {faq.question}
                  </span>

                  {/* Chevron */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className={cn(
                      "shrink-0 text-forge-text-secondary transition-transform duration-300",
                      isOpen && "rotate-180"
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

                {/* Collapsible Answer using grid-rows trick */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 md:pb-6 text-[15px] text-forge-text-secondary leading-[1.7]">
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

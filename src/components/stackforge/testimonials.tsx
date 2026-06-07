"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "StackForge delivered our site in record time. The performance is incredible — our Core Web Vitals score jumped to 98.",
    name: "Arjun Mehta",
    role: "Founder at NovaPay",
    stars: 5,
  },
  {
    quote:
      "They understood our vision from day one. Clean design, zero bugs, and the team was responsive throughout.",
    name: "Priya Sharma",
    role: "CTO at ElevateHR",
    stars: 5,
  },
  {
    quote:
      "Our conversion rate increased 2.4x after the redesign. Best investment we made this year.",
    name: "Rahul Verma",
    role: "CEO at DineFine",
    stars: 5,
  },
];

export function Testimonials() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({
    threshold: 0.05,
  });

  return (
    <section className="py-24 md:py-32 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "mb-16 md:mb-20 transition-all duration-700 ease-out text-center",
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
        >
          <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase block mb-4 font-dancing">
            Testimonials
          </span>
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold leading-[1.08] tracking-[-0.03em] text-forge-text font-playfair">
            What Clients Say
          </h2>
          <p className="mt-4 text-[16px] md:text-[17px] text-forge-text-secondary leading-relaxed max-w-[480px] mx-auto">
            Trusted by founders and teams who demand quality, speed, and
            reliability.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                "bg-forge-surface border border-forge-divider rounded-xl p-6 md:p-8 transition-all duration-700 ease-out hover:border-forge-border",
                cardsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              )}
              style={{
                transitionDelay: cardsVisible ? `${index * 120}ms` : "0ms",
              }}
            >
              {/* Large Quote Mark */}
              <span className="text-forge-accent/25 text-7xl leading-none font-curvy block select-none">
                &ldquo;
              </span>

              {/* Quote Text */}
              <p className="mt-3 text-[15px] md:text-[16px] text-forge-text-secondary leading-[1.7] italic">
                {testimonial.quote}
              </p>

              {/* Star Rating */}
              <div className="mt-6 flex items-center gap-1">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                    className="text-forge-accent"
                  >
                    <path d="M7 0.5L8.89 4.78L13.5 5.27L10.08 8.52L10.97 13.08L7 10.97L3.03 13.08L3.92 8.52L0.5 5.27L5.11 4.78L7 0.5Z" />
                  </svg>
                ))}
              </div>

              {/* Author */}
              <div className="mt-4 pt-4 border-t border-forge-divider">
                <p className="text-[15px] text-forge-text font-semibold">
                  {testimonial.name}
                </p>
                <p className="mt-0.5 text-[13px] text-forge-text-secondary">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

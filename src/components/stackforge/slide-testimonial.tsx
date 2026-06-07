"use client";

import { useSlideReveal } from "@/hooks/use-slide-reveal";
import { cn } from "@/lib/utils";

const testimonial = {
  quote:
    "StackForge delivered our site in record time. The performance is incredible — our Core Web Vitals score jumped to 98. They understood our vision from day one and executed flawlessly.",
  name: "Arjun Mehta",
  role: "Founder at NovaPay",
};

export function SlideTestimonial() {
  const { ref, isVisible } = useSlideReveal({ threshold: 0.2 });

  return (
    <section id="testimonial" ref={ref} className="story-slide overflow-hidden">
      <div className="mx-auto max-w-[800px] w-full px-6 md:px-20 text-center">
        {/* Massive quote mark */}
        <div
          className={cn(
            isVisible ? "animate-story-scale-in" : "opacity-0"
          )}
          style={{ animationDelay: "0ms" }}
        >
          <span className="font-dancing text-7xl md:text-8xl lg:text-9xl text-forge-accent/20 leading-none select-none block">
            &ldquo;
          </span>
        </div>

        {/* Quote text */}
        <blockquote
          className={cn(
            "mt-4 md:mt-6 font-playfair italic text-[18px] sm:text-[20px] md:text-[24px] leading-[1.6] text-forge-text max-w-[680px] mx-auto",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "200ms" }}
        >
          {testimonial.quote}
        </blockquote>

        {/* Author */}
        <div
          className={cn(
            "mt-8 md:mt-10 flex flex-col items-center gap-1",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "500ms" }}
        >
          <span className="text-[16px] md:text-[17px] font-semibold text-forge-text font-syne">
            {testimonial.name}
          </span>
          <span className="text-[13px] font-mono text-forge-text-secondary/60">
            {testimonial.role}
          </span>
        </div>

        {/* Star rating */}
        <div
          className={cn(
            "mt-5 flex items-center justify-center gap-1",
            isVisible ? "animate-story-fade-in" : "opacity-0"
          )}
          style={{ animationDelay: "700ms" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="16"
              height="16"
              viewBox="0 0 14 14"
              fill="currentColor"
              className="text-forge-accent"
            >
              <path d="M7 0.5L8.89 4.78L13.5 5.27L10.08 8.52L10.97 13.08L7 10.97L3.03 13.08L3.92 8.52L0.5 5.27L5.11 4.78L7 0.5Z" />
            </svg>
          ))}
        </div>
      </div>
    </section>
  );
}

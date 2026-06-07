"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Prisma",
  "Node.js",
  "PostgreSQL",
  "Framer Motion",
  "Vercel",
  "Stripe",
];

export function TechStack() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  // Duplicate for seamless infinite loop
  const duplicated = [...techStack, ...techStack];

  return (
    <section className="py-16 md:py-20">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1200px] px-6 md:px-20 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        {/* Section Header */}
        <div className="mb-10 md:mb-12">
          <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase block mb-4">
            Tech Stack
          </span>
          <h2 className="text-[32px] md:text-[44px] font-bold leading-[1.08] tracking-[-0.03em] text-forge-text">
            Tools We Work With
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-forge-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-forge-bg to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee-scroll">
            {duplicated.map((tech, index) => (
              <div
                key={`${tech}-${index}`}
                className="flex items-center shrink-0"
              >
                <span className="text-forge-text-secondary/40 text-[14px] font-medium tracking-wide uppercase whitespace-nowrap px-6 md:px-8">
                  {tech}
                </span>
                {/* Separator dot */}
                <span className="text-forge-text-secondary/15 text-[6px] shrink-0">
                  ●
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

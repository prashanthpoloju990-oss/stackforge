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
  "Supabase",
  "Figma",
];

export function TechStack() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const duplicated = [...techStack, ...techStack];

  return (
    <section className="py-16 md:py-20">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1200px] px-6 md:px-20 transition-all duration-600 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
        )}
      >
        {/* Section Header */}
        <div className="mb-8 md:mb-10 flex items-center gap-4">
          <span className="text-[12px] text-forge-text-secondary/30 tracking-[0.16em] uppercase font-mono">
            Tech Stack
          </span>
          <div className="flex-1 h-px bg-forge-divider" />
        </div>

        {/* Marquee */}
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-forge-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-forge-bg to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee-scroll">
            {duplicated.map((tech, index) => (
              <div
                key={`${tech}-${index}`}
                className="flex items-center shrink-0"
              >
                <span className="text-forge-text-secondary/30 text-[13px] font-medium tracking-[0.06em] uppercase whitespace-nowrap px-5 md:px-7 font-mono">
                  {tech}
                </span>
                <span className="text-forge-text-secondary/10 text-[5px] shrink-0">
                  ·
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useSlideReveal } from "@/hooks/use-slide-reveal";
import { cn } from "@/lib/utils";

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Prisma",
  "PostgreSQL",
  "Vercel",
];

export function SlideStatement() {
  const { ref, isVisible } = useSlideReveal({ threshold: 0.2 });

  return (
    <section id="statement" ref={ref} className="story-slide overflow-hidden">
      <div className="mx-auto max-w-[1100px] w-full px-6 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Big statement */}
          <div className="flex flex-col">
            <p
              className={cn(
                "text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-playfair leading-[1.15] tracking-[-0.02em] text-forge-text",
                isVisible ? "animate-story-fade-up" : "opacity-0"
              )}
              style={{ animationDelay: "0ms" }}
            >
              We don&apos;t just
              <br />
              <span className="text-forge-accent">build websites.</span>
            </p>

            {/* Accent line */}
            <div
              className={cn(
                "mt-6 md:mt-8 h-px bg-forge-accent origin-left",
                isVisible ? "animate-line-grow" : "opacity-0"
              )}
              style={{ animationDelay: "200ms" }}
            />
          </div>

          {/* Right — Supporting text */}
          <div className="flex flex-col">
            <p
              className={cn(
                "text-[17px] md:text-[19px] text-forge-text-secondary leading-[1.7] max-w-[480px]",
                isVisible ? "animate-story-slide-left" : "opacity-0"
              )}
              style={{ animationDelay: "150ms" }}
            >
              We engineer digital experiences that convert, scale, and perform —
              with precision engineering and modern design systems.
            </p>

            <p
              className={cn(
                "mt-5 text-[15px] md:text-[16px] text-forge-text-secondary/60 leading-[1.7] max-w-[480px]",
                isVisible ? "animate-story-slide-left" : "opacity-0"
              )}
              style={{ animationDelay: "300ms" }}
            >
              Every line of code is optimized. Every pixel is intentional. Every
              project is built to last — from startups scaling fast to enterprises
              demanding reliability.
            </p>

            {/* Tech stack pills */}
            <div
              className={cn(
                "mt-8 flex flex-wrap gap-2",
                isVisible ? "animate-story-fade-up" : "opacity-0"
              )}
              style={{ animationDelay: "500ms" }}
            >
              {techStack.map((tech, i) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-[12px] font-mono text-forge-text-secondary/70 bg-forge-surface border border-forge-divider"
                  style={{
                    animationDelay: `${500 + i * 60}ms`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

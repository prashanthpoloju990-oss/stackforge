"use client";

import Image from "next/image";
import { useSlideReveal } from "@/hooks/use-slide-reveal";
import { cn } from "@/lib/utils";

const project = {
  title: "Vertex Startup Landing",
  description:
    "A high-performance landing page built to communicate clarity and drive early-stage conversions.",
  tags: ["Landing Page", "Startup", "Conversion"],
  image: "/work/vertex-startup.png",
};

export function SlideWork() {
  const { ref, isVisible } = useSlideReveal({ threshold: 0.15 });

  return (
    <section id="work" ref={ref} className="story-slide overflow-hidden">
      <div className="mx-auto max-w-[1100px] w-full px-6 md:px-20">
        {/* Eyebrow */}
        <span
          className={cn(
            "block text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase mb-6 md:mb-8 font-mono",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "0ms" }}
        >
          Featured Work
        </span>

        {/* Large project showcase */}
        <div className="relative rounded-2xl overflow-hidden border border-forge-divider group">
          {/* Image with clip-path reveal */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <div
              className={cn(
                "absolute inset-0",
                isVisible ? "animate-story-clip-up" : "opacity-0"
              )}
              style={{ animationDelay: "150ms" }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1100px) 100vw, 1100px"
              />
            </div>
          </div>

          {/* Overlay info — slides up from bottom */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-10 pt-16 md:pt-24",
              isVisible ? "animate-story-slide-left" : "opacity-0"
            )}
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h3 className="text-[22px] md:text-[28px] font-semibold text-white tracking-[-0.02em] font-syne">
                  {project.title}
                </h3>
                <p className="mt-2 text-[14px] md:text-[15px] text-white/70 leading-relaxed max-w-[500px]">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-md text-[12px] font-medium tracking-wide text-white/80 bg-white/10 border border-white/10 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View All link */}
        <div
          className={cn(
            "mt-6 flex justify-center",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "600ms" }}
        >
          <span className="inline-flex items-center gap-2 text-[14px] font-medium text-forge-text-secondary/50 hover:text-forge-accent transition-colors duration-200 cursor-pointer font-mono">
            More projects coming soon
          </span>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const projects = [
  {
    title: "Nova Clinic Website",
    description:
      "A modern, responsive website designed to improve patient engagement and appointment conversion.",
    tags: ["UI/UX", "Performance", "Healthcare"],
    image: "/work/nova-clinic.png",
  },
  {
    title: "Vertex Startup Landing",
    description:
      "A high-performance landing page built to communicate clarity and drive early-stage conversions.",
    tags: ["Landing Page", "Startup", "Conversion"],
    image: "/work/vertex-startup.png",
  },
  {
    title: "Elevate Portfolio System",
    description:
      "A personal brand portfolio designed with clarity, speed, and strong visual hierarchy.",
    tags: ["Portfolio", "UI Design", "Personal Brand"],
    image: "/work/elevate-portfolio.png",
  },
  {
    title: "DineFine Restaurant Experience",
    description:
      "A visually rich restaurant website focused on menu experience and customer engagement.",
    tags: ["Restaurant", "UI/UX", "Experience"],
    image: "/work/dinefine-restaurant.png",
  },
];

export function Work() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="work" className="py-24 md:py-32 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase block mb-4 font-mono">
              Selected Work
            </span>
            <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold leading-[1.08] tracking-[-0.03em] text-forge-text max-w-[600px] font-playfair">
              Selected Work
            </h2>
            <p className="mt-4 text-[16px] md:text-[17px] text-forge-text-secondary leading-relaxed max-w-[520px]">
              A look at some of the systems we&apos;ve designed and built.
            </p>
          </div>

        </div>

        {/* Project Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={cn(
                "group block rounded-[14px] border border-forge-divider bg-forge-surface overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:border-forge-accent/20",
                gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: gridVisible ? `${index * 120}ms` : "0ms" }}
            >
              {/* Image */}
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-[18px] md:text-[20px] font-semibold text-forge-text tracking-[-0.01em]">
                  {project.title}
                </h3>

                <p className="mt-2 text-[14px] md:text-[15px] text-forge-text-secondary leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-md text-[12px] font-medium tracking-wide text-forge-text-secondary/80 bg-forge-bg border border-forge-divider/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

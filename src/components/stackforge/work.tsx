"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useCountUp } from "@/hooks/use-count-up";
import { CaseStudyModal, type CaseStudy } from "@/components/ui/case-study-modal";
import { projects } from "@/lib/projects-data";

const STATS = [
  { value: 50, suffix: "+", label: "Projects Shipped" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 3.2, suffix: "\u00d7", label: "Avg. Conversion Lift" },
  { value: 6, suffix: "wks", label: "Avg. Delivery Time" },
];

function StatItem({
  stat,
  isVisible,
}: {
  stat: (typeof STATS)[number];
  isVisible: boolean;
}) {
  const decimals = stat.value % 1 !== 0 ? 1 : 0;
  const count = useCountUp({
    target: stat.value,
    duration: 2000,
    decimals,
    enabled: isVisible,
  });

  return (
    <div className="flex flex-col items-center text-center py-6 md:py-0 px-4 md:px-8">
      <div className="flex items-baseline tabular-nums">
        <span className="text-fluid-h1 font-bold text-forge-text tracking-tight">
          {count}
        </span>
        <span className="text-fluid-h1 font-bold text-forge-accent tracking-tight">
          {stat.suffix}
        </span>
      </div>
      <span className="mt-1 text-fluid-micro text-forge-text-secondary/70 tracking-wide">
        {stat.label}
      </span>
    </div>
  );
}

export function Work() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.03 });

  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  const openStudy = (project: CaseStudy) => {
    setSelectedStudy(project);
  };

  const closeStudy = () => {
    setSelectedStudy(null);
  };

  return (
    <section id="work" className="py-24 md:py-32 lg:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16 transition-all duration-600 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              Selected Work
            </span>
            <h2 className="text-fluid-h1 font-bold text-forge-text max-w-[500px] font-playfair">
              Results, not just
              <br className="hidden md:block" />
              <span className="text-forge-accent/70"> pretty screens.</span>
            </h2>
          </div>
          <p className="text-fluid-body-lg text-forge-text-secondary/60 max-w-[360px] md:text-right">
            Every project is measured by the impact it creates — not just how it looks.
          </p>
        </div>

        {/* Aggregate Stats Bar */}
        <div
          ref={statsRef}
          className={cn(
            "mb-14 md:mb-16 border border-forge-divider rounded-xl bg-forge-surface/20 transition-all duration-700 ease-out",
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="relative">
                {/* Divider — vertical on desktop, horizontal on mobile */}
                {i > 0 && (
                  <>
                    {/* Mobile: horizontal line above */}
                    <div className="md:hidden absolute top-0 left-4 right-4 h-px bg-forge-divider/60" />
                    {/* Desktop: vertical line to the left */}
                    <div className="hidden md:block absolute left-0 top-[25%] bottom-[25%] w-px bg-forge-divider/60" />
                  </>
                )}
                <StatItem stat={stat} isVisible={statsVisible} />
              </div>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={cn(
                "group block rounded-xl border border-forge-divider bg-forge-surface/30 overflow-hidden card-hover",
                gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              )}
              style={{ transitionDelay: gridVisible ? `${index * 100}ms` : "0ms" }}
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqPwfAAzwBfK5z+5nAAAAAElFTkSuQmCC"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                {/* Metric badge */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-baseline gap-1.5 bg-black/60 backdrop-blur-sm rounded-md px-3 py-1.5 border border-white/10">
                    <span className="text-[16px] font-bold text-forge-accent font-tabular-nums">
                      {project.metric}
                    </span>
                    <span className="text-fluid-micro text-white/60">{project.metricLabel}</span>
                  </div>
                </div>
                {/* Arrow icon — top right, opens case study page */}
                <Link
                  href={`/work/${project.slug}`}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full border border-white/20 backdrop-blur-sm bg-white/10 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-forge-accent/80 hover:border-forge-accent/80 cursor-pointer"
                  aria-label={`View ${project.title} case study`}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white">
                    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] text-forge-text-secondary/60 tracking-[0.08em] uppercase font-mono mb-1.5">
                      {project.subtitle}
                    </p>
                    <h3 className="text-fluid-h3 font-semibold text-forge-text font-syne">
                      {project.title}
                    </h3>
                  </div>
                  <Link
                    href={`/work/${project.slug}`}
                    className="shrink-0 w-10 h-10 rounded-full border border-forge-divider flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 group-hover:border-forge-accent/30 mt-1 cursor-pointer hover:bg-forge-accent/10"
                    aria-label={`View ${project.title} case study`}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-forge-accent/70">
                      <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                <p className="mt-2.5 text-fluid-body text-forge-text-secondary/60">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded text-fluid-micro font-medium tracking-wide text-forge-text-secondary/60 bg-forge-bg/80 border border-forge-divider/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Case Study Link — visible on mobile, hover-reveal on desktop */}
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-forge-accent text-[13px] font-medium mt-4 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:gap-2.5 cursor-pointer"
                >
                  View Case Study
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        study={selectedStudy}
        open={selectedStudy !== null}
        onClose={closeStudy}
      />
    </section>
  );
}

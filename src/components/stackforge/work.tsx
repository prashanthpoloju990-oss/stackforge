"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const projects = [
  {
    title: "NovaPay",
    subtitle: "Fintech · SaaS Platform",
    description:
      "End-to-end payment dashboard with real-time analytics, role-based access, and Stripe integration. Built for scale from day one.",
    tags: ["React", "Node.js", "Stripe", "Prisma"],
    image: "/work/nova-clinic.png",
    metric: "3.2×",
    metricLabel: "conversion lift",
  },
  {
    title: "Vertex",
    subtitle: "Startup · Landing & Waitlist",
    description:
      "High-performance launch site with animated waitlist, social proof engine, and A/B tested copy. Shipped in 6 days.",
    tags: ["Next.js", "Tailwind", "Vercel", "Analytics"],
    image: "/work/vertex-startup.png",
    metric: "4,200",
    metricLabel: "waitlist signups",
  },
  {
    title: "ElevateHR",
    subtitle: "B2B SaaS · Management Platform",
    description:
      "Employee management system with custom dashboards, leave tracking, and performance reviews. Complex permissions, clean UX.",
    tags: ["TypeScript", "PostgreSQL", "Auth", "Charts"],
    image: "/work/elevate-portfolio.png",
    metric: "98",
    metricLabel: "performance score",
  },
  {
    title: "DineFine",
    subtitle: "Restaurant · Online Experience",
    description:
      "Visually rich menu system with reservation engine, location finder, and seasonal content management. Mobile-first design.",
    tags: ["Next.js", "CMS", "Maps", "Responsive"],
    image: "/work/dinefine-restaurant.png",
    metric: "2.4×",
    metricLabel: "reservation increase",
  },
];

export function Work() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.03 });

  return (
    <section id="work" className="py-24 md:py-32 lg:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              Selected Work
            </span>
            <h2 className="text-[30px] md:text-[42px] lg:text-[48px] font-bold leading-[1.06] tracking-[-0.035em] text-forge-text max-w-[500px] font-playfair">
              Results, not just
              <br className="hidden md:block" />
              <span className="font-curvy text-forge-accent/70 text-[0.88em]"> pretty screens.</span>
            </h2>
          </div>
          <p className="text-[15px] text-forge-text-secondary/60 leading-relaxed max-w-[360px] md:text-right">
            Every project is measured by the impact it creates — not just how it looks.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={cn(
                "group block rounded-xl border border-forge-divider bg-forge-surface/30 overflow-hidden card-hover",
                gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: gridVisible ? `${index * 100}ms` : "0ms" }}
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                {/* Metric badge */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-baseline gap-1.5 bg-black/60 backdrop-blur-sm rounded-md px-3 py-1.5 border border-white/10">
                    <span className="text-[16px] font-bold text-forge-accent font-tabular-nums">
                      {project.metric}
                    </span>
                    <span className="text-[11px] text-white/60">{project.metricLabel}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] text-forge-text-secondary/40 tracking-[0.08em] uppercase font-mono mb-1.5">
                      {project.subtitle}
                    </p>
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-forge-text tracking-[-0.01em] font-syne">
                      {project.title}
                    </h3>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full border border-forge-divider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-forge-accent/30 mt-1">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-forge-accent/70">
                      <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <p className="mt-2.5 text-[14px] text-forge-text-secondary/60 leading-[1.65]">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium tracking-wide text-forge-text-secondary/40 bg-forge-bg/80 border border-forge-divider/40"
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

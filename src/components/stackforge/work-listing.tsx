"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/projects-data";
import { ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";

export function WorkListing() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Hospitality", "Catering", "Creative", "Local Business"];

  const getCategory = (subtitle: string) => {
    if (subtitle.toLowerCase().includes("hospitality")) return "Hospitality";
    if (subtitle.toLowerCase().includes("catering")) return "Catering";
    if (subtitle.toLowerCase().includes("creative")) return "Creative";
    if (subtitle.toLowerCase().includes("local business")) return "Local Business";
    return "Other";
  };

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((p) => getCategory(p.subtitle) === selectedCategory);

  // Dynamic Bento Spans helper based on index and total filtered count
  const getBentoSpanClass = (index: number, total: number) => {
    if (total === 1) return "col-span-1 md:col-span-12";
    if (total === 2) {
      return index === 0 ? "col-span-1 md:col-span-12 lg:col-span-7" : "col-span-1 md:col-span-12 lg:col-span-5";
    }
    // For full list or 3+ projects, use asymmetric bento distribution:
    switch (index % 5) {
      case 0:
        return "col-span-1 md:col-span-12 lg:col-span-7"; // Wide Hero Card
      case 1:
        return "col-span-1 md:col-span-12 lg:col-span-5"; // Medium Feature Card
      case 2:
        return "col-span-1 md:col-span-6 lg:col-span-4";  // 1/3 Bento Column
      case 3:
        return "col-span-1 md:col-span-6 lg:col-span-4";  // 1/3 Bento Column
      case 4:
        return "col-span-1 md:col-span-12 lg:col-span-4"; // 1/3 Bento Column
      default:
        return "col-span-1 md:col-span-6 lg:col-span-6";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-forge-divider/50 pb-8 mt-8">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer",
                  isActive
                    ? "bg-forge-accent text-white font-bold shadow-[0_0_15px_rgba(255,106,0,0.25)]"
                    : "bg-forge-surface/30 text-forge-text-secondary/60 border border-forge-divider/40 hover:text-forge-text hover:border-forge-accent/30"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Privacy Disclaimer Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forge-surface/40 border border-forge-divider/50 backdrop-blur-md text-[11px] font-mono text-forge-text-secondary/70 shadow-sm w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-forge-accent shrink-0 animate-pulse" />
          <span>For privacy concerns, we show demo data of all clients.</span>
        </div>
      </div>

      {/* Asymmetric Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-12">
        {filteredProjects.map((project, index) => {
          const bentoSpan = getBentoSpanClass(index, filteredProjects.length);
          const isFeaturedHero = (index % 5 === 0) && filteredProjects.length > 2;

          return (
            <div
              key={project.title}
              className={cn(
                "group relative rounded-2xl border border-forge-divider/80 bg-gradient-to-b from-forge-surface/40 to-forge-bg/60 overflow-hidden backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-forge-accent/40 hover:shadow-[0_16px_40px_-15px_rgba(255,106,0,0.15)] flex flex-col justify-between",
                bentoSpan
              )}
            >
              {/* Top Image Preview section */}
              <div className={cn(
                "relative w-full overflow-hidden shrink-0",
                isFeaturedHero ? "aspect-[16/8.5]" : "aspect-[16/9.5]"
              )}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 2}
                />
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-forge-bg via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                
                {/* Metric Badge Callout */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-forge-accent" />
                    <span className="text-xs font-bold text-forge-accent font-mono">
                      {project.metric}
                    </span>
                    <span className="text-[10px] text-white/80 font-sans">{project.metricLabel}</span>
                  </div>
                </div>

                {/* External Case Study Launch Icon Button */}
                <Link
                  href={`/work/${project.slug}`}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-white/20 backdrop-blur-md bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-forge-accent group-hover:border-forge-accent group-hover:scale-110 shadow-lg cursor-pointer"
                  aria-label={`View ${project.title} case study`}
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </Link>
              </div>

              {/* Bento Card Content */}
              <div className="p-6 flex flex-col justify-between flex-1 relative z-10">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] text-forge-accent/80 tracking-[0.14em] uppercase font-mono font-semibold">
                      {project.subtitle}
                    </span>
                    {isFeaturedHero && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forge-accent/15 border border-forge-accent/30 text-forge-accent text-[9px] font-mono font-bold uppercase tracking-wider">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured Case Study
                      </span>
                    )}
                  </div>

                  <h3 className={cn(
                    "font-bold text-forge-text font-syne leading-tight transition-colors duration-300 group-hover:text-forge-accent",
                    isFeaturedHero ? "text-2xl md:text-3xl" : "text-xl md:text-22px"
                  )}>
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-xs md:text-sm text-forge-text-secondary/75 leading-relaxed font-sans line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-forge-divider/40 flex items-center justify-between gap-4">
                  {/* Tech Tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono tracking-wide text-forge-text-secondary/70 bg-forge-surface/60 border border-forge-divider/50 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Case Study CTA */}
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-1 text-forge-accent text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-all duration-300 group-hover:gap-2 cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


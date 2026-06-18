"use client";

import { Award, Star, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const AWARDS = [
  {
    platform: "CSSDA",
    title: "Best UI/UX Design",
    project: "NovaPay Portal",
    year: "2026",
    icon: <Trophy className="w-4 h-4 text-forge-accent" />,
  },
  {
    platform: "Awwwards",
    title: "Mobile Excellence",
    project: "Lustara Hotel",
    year: "2026",
    icon: <Award className="w-4 h-4 text-forge-accent" />,
  },
  {
    platform: "FWA",
    title: "Site of the Day",
    project: "Vertex Analytics",
    year: "2025",
    icon: <Star className="w-4 h-4 text-forge-accent" />,
  },
  {
    platform: "Behance",
    title: "Featured in Web Dev",
    project: "Vijaya Outdoors",
    year: "2025",
    icon: <Sparkles className="w-4 h-4 text-forge-accent" />,
  },
  {
    platform: "CSSDA",
    title: "Special Kudos",
    project: "ElevateHR System",
    year: "2025",
    icon: <Trophy className="w-4 h-4 text-forge-accent" />,
  },
];

export function AwardsStrip() {
  return (
    <section className="bg-forge-surface/40 border-y-2 border-forge-text overflow-hidden py-8 select-none relative z-10">
      {/* Background design elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-forge-accent/5 via-transparent to-forge-accent/5 pointer-events-none" />
      
      {/* Eyebrow Label */}
      <div className="max-w-[1200px] mx-auto px-6 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-forge-accent animate-pulse" />
        <span className="text-[11px] font-mono font-bold tracking-widest text-forge-text-secondary/70 uppercase">
          Industry Recognition & Credentials
        </span>
      </div>

      {/* Scrolling Container */}
      <div className="relative flex overflow-x-hidden w-full">
        {/* Double items for infinite loop marquee */}
        <div className="flex animate-marquee-scroll whitespace-nowrap py-2">
          {[...AWARDS, ...AWARDS, ...AWARDS].map((award, idx) => (
            <div
              key={`${award.platform}-${idx}`}
              className={cn(
                "inline-flex items-center gap-4 px-6 py-3 bg-forge-bg border-2 border-forge-text rounded-md",
                "shadow-[4px_4px_0px_0px_rgba(255,106,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,106,0,1)]",
                "hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-default mx-4",
                idx % 2 === 0 ? "rotate-1" : "-rotate-1"
              )}
            >
              {/* Icon Badge */}
              <div className="w-7 h-7 rounded-full border border-forge-text flex items-center justify-center bg-forge-surface">
                {award.icon}
              </div>

              {/* Award Content */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-forge-accent text-white uppercase border border-forge-text rounded">
                  {award.platform}
                </span>
                <span className="font-syne font-bold text-sm text-forge-text">
                  {award.title}
                </span>
                <span className="text-forge-text-secondary/60 text-xs font-medium font-mono">
                  — {award.project}
                </span>
              </div>

              {/* Year indicator */}
              <span className="font-mono text-[10px] font-bold text-forge-text-secondary/50 border border-forge-divider px-1.5 py-0.5 rounded">
                {award.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

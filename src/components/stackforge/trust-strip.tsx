"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { Gauge, ShieldCheck, Zap } from "lucide-react";

const STANDARDS = [
  {
    icon: <Zap className="w-5 h-5 text-forge-accent" />,
    value: "100/100",
    label: "Lighthouse Speed Score",
    description: "Zero template bloat. Every script and asset optimized for instantaneous load times.",
  },
  {
    icon: <Gauge className="w-5 h-5 text-forge-accent" />,
    value: "<1.2s",
    label: "Largest Contentful Paint",
    description: "Built for speed. LCP optimized to load key content almost instantly on any device.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-forge-accent" />,
    value: "100%",
    label: "SEO & Access Standard",
    description: "Semantic HTML structures and WCAG compliance for maximum search and human usability.",
  },
];

export function TrustStrip() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 border-y border-forge-divider/30 bg-forge-surface/5 overflow-hidden"
    >
      <div
        className={cn(
          "mx-auto max-w-[1200px] px-6 md:px-20 transition-all duration-800 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        {/* Core Value Statement */}
        <div className="text-center max-w-[800px] mx-auto mb-12 md:mb-16">
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
            Our Standard
          </span>
          <h3 className="text-fluid-h2 font-bold text-forge-text font-playfair leading-tight">
            Obsessed with <span className="text-forge-accent/80">PageSpeed</span>,{" "}
            <span className="text-forge-text">Core Web Vitals</span>, and{" "}
            <span className="text-forge-accent/80">conversion rate</span> optimization.
          </h3>
        </div>

        {/* Engineering Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STANDARDS.map((std, i) => (
            <div
              key={std.label}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Wrapper */}
              <div className="w-12 h-12 rounded-full border border-forge-divider bg-forge-surface flex items-center justify-center mb-5 group-hover:border-forge-accent/30 transition-colors duration-300">
                {std.icon}
              </div>
              
              {/* Value */}
              <span className="text-fluid-h2 font-bold text-forge-text tracking-tight font-syne mb-1.5">
                {std.value}
              </span>
              
              {/* Label */}
              <span className="text-[13px] font-semibold text-forge-accent uppercase tracking-wider mb-2 font-mono">
                {std.label}
              </span>
              
              {/* Description */}
              <p className="text-fluid-body text-forge-text-secondary/60 max-w-[280px]">
                {std.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

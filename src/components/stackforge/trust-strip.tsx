"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const TRUST_LOGOS = [
  { name: "Vercel", abbr: "VC" },
  { name: "Stripe", abbr: "ST" },
  { name: "Shopify", abbr: "SH" },
  { name: "Linear", abbr: "LN" },
  { name: "Notion", abbr: "NT" },
  { name: "Figma", abbr: "FG" },
  { name: "Raycast", abbr: "RC" },
  { name: "Arc", abbr: "AR" },
];

export function TrustStrip() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-10 md:py-14 border-y border-forge-divider/30 overflow-hidden"
    >
      <div
        className={cn(
          "transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="flex items-center gap-3 mb-6 md:mb-8 justify-center">
          <span className="text-[11px] text-forge-text-secondary/30 tracking-[0.14em] uppercase font-mono">
            Trusted by teams at
          </span>
        </div>
        {/* Marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-forge-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-forge-bg to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee-scroll">
            {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex items-center gap-2.5 px-8 md:px-12 shrink-0"
              >
                <div className="w-8 h-8 rounded-lg bg-forge-surface/80 border border-forge-divider/40 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-forge-text-secondary/40 font-mono">
                    {logo.abbr}
                  </span>
                </div>
                <span className="text-[14px] font-medium text-forge-text-secondary/25 whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

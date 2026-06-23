"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

/* ─── Animated mini-bar chart (Core Web Vitals) ─── */
function VitalsChart() {
  const bars = [
    { label: "FCP", val: 92, color: "#22c55e" },
    { label: "LCP", val: 97, color: "#22c55e" },
    { label: "TBT", val: 88, color: "#22c55e" },
    { label: "CLS", val: 100, color: "#22c55e" },
    { label: "SI",  val: 95, color: "#22c55e" },
  ];
  return (
    <div className="flex items-end gap-2 h-16 mt-auto">
      {bars.map((b) => (
        <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm transition-all duration-700"
            style={{
              height: `${(b.val / 100) * 52}px`,
              background: b.color,
              boxShadow: `0 0 8px ${b.color}55`,
              opacity: 0.85,
            }}
          />
          <span className="text-[9px] font-mono text-forge-text-secondary/50 tracking-wide">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Radial Speedometer ─── */
function Speedometer({ value, max = 100 }: { value: number; max?: number }) {
  const r = 36;
  const circumference = Math.PI * r; // half-circle arc
  const pct = value / max;
  const dashOffset = circumference * (1 - pct);
  return (
    <svg viewBox="0 0 100 56" className="w-full max-w-[110px]">
      {/* Track */}
      <path
        d={`M 10 50 A ${r} ${r} 0 0 1 90 50`}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className="text-forge-divider/40"
      />
      {/* Progress */}
      <path
        d={`M 10 50 A ${r} ${r} 0 0 1 90 50`}
        fill="none"
        stroke="#22c55e"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ filter: "drop-shadow(0 0 5px #22c55e88)", transition: "stroke-dashoffset 1.2s ease" }}
      />
      {/* Value */}
      <text x="50" y="48" textAnchor="middle" className="fill-forge-text" fontSize="16" fontWeight="bold" fontFamily="var(--font-space-mono, monospace)">
        {value}
      </text>
      <text x="50" y="58" textAnchor="middle" className="fill-forge-text-secondary" fontSize="7" fontFamily="var(--font-space-mono, monospace)">
        /100
      </text>
    </svg>
  );
}

export function TrustStrip() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08 });

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 border-y border-forge-divider/30 overflow-hidden"
    >
      <div
        className={cn(
          "mx-auto max-w-[1200px] px-6 md:px-20 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* ── Section label + heading ── */}
        <div className="mb-12 md:mb-16">
          <span className="text-[11px] font-mono text-forge-accent/60 tracking-[0.18em] uppercase block mb-4">
            Our Standard
          </span>
          <h2 className="text-fluid-h1 font-bold text-forge-text font-syne max-w-[680px] leading-tight">
            Every build ships at{" "}
            <span className="text-forge-accent/90">peak performance</span>
            {" "}— by design.
          </h2>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-min">

          {/* ── Card 1: Lighthouse Score — lg col-span 4 ── */}
          <div
            className={cn(
              "lg:col-span-4 rounded-2xl border border-forge-divider/50 bg-forge-surface/30 p-6 flex flex-col gap-4 hover:border-forge-accent/40 hover:bg-forge-surface/50 transition-all duration-300 group",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: isVisible ? "60ms" : "0ms" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-forge-accent/60 uppercase tracking-[0.14em] block mb-2">
                  Lighthouse Performance
                </span>
                <span className="text-[3.8rem] font-bold leading-none font-mono text-forge-text tracking-tighter">
                  100
                </span>
                <span className="text-[1.2rem] text-forge-text-secondary/40 font-mono">/100</span>
              </div>
              <div className="w-[90px] flex-shrink-0">
                <Speedometer value={100} />
              </div>
            </div>
            <p className="text-[13px] text-forge-text-secondary/70 leading-relaxed mt-auto">
              Zero template bloat. Every script and asset optimized for instantaneous load times — scored perfect on every project we ship.
            </p>
          </div>

          {/* ── Card 2: LCP — lg col-span 3 ── */}
          <div
            className={cn(
              "lg:col-span-3 rounded-2xl border border-forge-divider/50 bg-forge-surface/30 p-6 flex flex-col hover:border-forge-accent/40 hover:bg-forge-surface/50 transition-all duration-300 group",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: isVisible ? "130ms" : "0ms" }}
          >
            <span className="text-[10px] font-mono text-forge-accent/60 uppercase tracking-[0.14em] block mb-3">
              Largest Contentful Paint
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[3.2rem] font-bold leading-none font-mono text-forge-text tracking-tighter">
                &lt;1.2
              </span>
              <span className="text-[1.1rem] text-forge-text-secondary/50 font-mono">s</span>
            </div>
            <VitalsChart />
          </div>

          {/* ── Card 3: SEO — lg col-span 5 ── */}
          <div
            className={cn(
              "lg:col-span-5 rounded-2xl border border-forge-divider/50 bg-forge-surface/30 p-6 flex flex-col gap-4 hover:border-forge-accent/40 hover:bg-forge-surface/50 transition-all duration-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            <span className="text-[10px] font-mono text-forge-accent/60 uppercase tracking-[0.14em] block mb-1">
              SEO &amp; Accessibility Standard
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[3.2rem] font-bold leading-none font-mono text-forge-text tracking-tighter">
                100%
              </span>
            </div>
            <p className="text-[13px] text-forge-text-secondary/70 leading-relaxed">
              Semantic HTML structures, WCAG compliance, proper metadata, and structured data — built into every project.
            </p>
            {/* Checklist */}
            <ul className="mt-auto space-y-2">
              {[
                "Semantic HTML5 structure",
                "Open Graph & Twitter Cards",
                "WCAG 2.1 AA compliant",
                "Schema.org structured data",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[12px] text-forge-text-secondary/80">
                  <span className="w-4 h-4 rounded-full bg-[#22c55e]/15 flex items-center justify-center shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Full-width Accent Banner ── */}
          <div
            className={cn(
              "lg:col-span-12 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-7 border border-forge-accent/20",
              "transition-all duration-700 ease-out delay-[280ms]",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{
              background: "linear-gradient(110deg, color-mix(in srgb, var(--forge-accent) 8%, transparent) 0%, transparent 60%)",
            }}
          >
            {/* Glow blob */}
            <div
              className="absolute -left-12 -top-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, var(--forge-accent) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col gap-1">
              <span className="text-[11px] font-mono text-forge-accent/70 uppercase tracking-[0.15em]">
                Our Promise
              </span>
              <p className="text-fluid-h3 font-bold text-forge-text font-syne max-w-[640px] leading-snug">
                Obsessed with{" "}
                <span className="text-forge-accent/90">PageSpeed</span>, Core Web Vitals,
                and conversion rate optimization — on every single build.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-3 sm:gap-6 shrink-0 flex-wrap justify-center sm:justify-start">
              {[
                { label: "Retention", val: "100%" },
                { label: "Conversion Lift", val: "3.2×" },
                { label: "Projects Shipped", val: "10+" },
              ].map((m) => (
                <div key={m.label} className="text-center min-w-[70px]">
                  <span className="block text-[1.5rem] sm:text-[1.7rem] font-bold font-mono text-forge-text leading-none tracking-tight">
                    {m.val}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] text-forge-text-secondary/50 uppercase tracking-wider mt-1 font-mono">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

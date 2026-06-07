"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { HeroVisual } from "./hero-visual";

function useCountUp(end: number, duration: number = 2000, startOnMount: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, started]);

  useEffect(() => {
    if (startOnMount && !started) {
      const timer = setTimeout(start, 1000);
      return () => clearTimeout(timer);
    }
  }, [startOnMount, start, started]);

  return { count, start };
}

function CounterStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count } = useCountUp(value);

  return (
    <div className="flex flex-col">
      <span className="text-[22px] sm:text-[24px] font-bold text-forge-text tracking-tight font-tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-[11px] sm:text-[12px] text-forge-text-secondary/50 tracking-[0.06em] mt-0.5">
        {label}
      </span>
    </div>
  );
}

/* Trust logos strip */
const TRUST_LOGOS = [
  "NovaPay",
  "ElevateHR",
  "DineFine",
  "Vertex",
  "CloudSync",
];

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-[92dvh] pt-16 md:pt-[72px] overflow-hidden"
    >
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 106, 0, 0.025) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1200px] w-full px-6 md:px-20 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT — Copy */}
          <div className="flex flex-col items-start">
            {/* Eyebrow */}
            <div
              className={`flex items-center gap-2.5 mb-7 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-forge-accent animate-pulse" />
              <span className="text-[13px] text-forge-text-secondary/70 font-medium tracking-[0.14em] uppercase font-mono">
                Web Dev Studio · Hyderabad
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-[34px] sm:text-[42px] md:text-[54px] lg:text-[60px] font-extrabold leading-[1.04] tracking-[-0.035em] text-forge-text font-syne transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              }`}
            >
              We ship websites
              <br />
              <span className="text-forge-accent font-curvy text-[0.82em]">
                that convert.
              </span>
            </h1>

            {/* Subline */}
            <p
              className={`mt-5 text-[16px] md:text-[17px] text-forge-text-secondary/80 leading-[1.75] max-w-[440px] transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              }`}
            >
              React &amp; Next.js specialists. We build fast, scalable, SEO-ready
              digital products for startups and growing brands.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-start gap-3 mt-9 md:mt-10 transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              }`}
            >
              <a
                href="#contact"
                className="btn-primary inline-flex items-center justify-center h-11 px-7 bg-forge-accent text-white text-[13px] font-semibold tracking-[0.06em] uppercase rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Start a Project
              </a>

              <a
                href="#work"
                className="btn-secondary inline-flex items-center justify-center h-11 px-7 border border-forge-border text-forge-text-secondary text-[13px] font-medium tracking-[0.06em] uppercase rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                See Our Work
              </a>
            </div>

            {/* Trust indicators */}
            <div
              className={`flex items-center gap-5 sm:gap-7 mt-11 transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[400ms] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              }`}
            >
              <CounterStat value={50} suffix="+" label="Projects Delivered" />
              <div className="w-px h-9 bg-forge-divider" />
              <CounterStat value={99} suffix=".9%" label="Uptime SLA" />
              <div className="w-px h-9 bg-forge-divider" />
              <CounterStat value={24} suffix="h" label="Avg. Response" />
            </div>
          </div>

          {/* RIGHT — Abstract Visual */}
          <div className="relative hidden md:block">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* Trust logos strip — subtle */}
      <div
        className={`absolute bottom-0 left-0 right-0 border-t border-forge-divider/60 transition-all duration-1000 delay-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-20 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-forge-text-secondary/30 tracking-[0.1em] uppercase font-mono">
            Trusted by
          </span>
          <div className="flex items-center gap-8 sm:gap-10">
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="text-[12px] sm:text-[13px] text-forge-text-secondary/25 tracking-[0.04em] font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

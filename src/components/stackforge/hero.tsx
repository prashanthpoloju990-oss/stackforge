"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { HeroVisual } from "./hero-visual";

function useCountUp(end: number, duration: number = 2000, startOnMount: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, started]);

  useEffect(() => {
    if (startOnMount && !started) {
      const timer = setTimeout(start, 800);
      return () => clearTimeout(timer);
    }
  }, [startOnMount, start, started]);

  return { count, ref, start };
}

function CounterStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);

  return (
    <div className="flex flex-col">
      <span ref={ref} className="text-[20px] sm:text-[22px] font-bold text-forge-text tracking-tight font-tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-[11px] sm:text-[12px] text-forge-text-secondary/60 tracking-wide">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-[90dvh] pt-16 md:pt-[72px] overflow-hidden"
    >
      {/* Subtle radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 60% 50%, rgba(255, 106, 0, 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1200px] w-full px-6 md:px-20 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — Text Content */}
          <div className="flex flex-col items-start">
            {/* Eyebrow */}
            <div
              className={`flex items-center gap-2 mb-6 transition-all duration-700 ease-out ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-forge-accent" />
              <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase font-dancing">
                Web Development Studio — Hyderabad
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-[32px] sm:text-[40px] md:text-[52px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-forge-text font-syne transition-all duration-700 ease-out delay-100 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              High-performance websites
              <br />
              <span className="text-forge-accent font-curvy text-[0.85em]">
                for ambitious brands.
              </span>
            </h1>

            {/* Curvy signature tagline */}
            <p className={`mt-4 text-[20px] md:text-[24px] text-forge-accent/60 font-curvy leading-[1.3] transition-all duration-700 ease-out delay-[180ms] ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}>
              Fast. Scalable. Beautiful.
            </p>

            {/* Subtext */}
            <p
              className={`mt-3 text-[16px] md:text-[17px] text-forge-text-secondary leading-[1.7] max-w-[480px] transition-all duration-700 ease-out delay-[220ms] ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              We engineer conversion-focused websites for startups, agencies, and SaaS brands — built with React and Next.js for speed, scale, and SEO.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-start gap-4 mt-8 md:mt-10 transition-all duration-700 ease-out delay-300 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-12 px-7 bg-forge-accent text-white text-[14px] font-semibold tracking-[0.04em] uppercase rounded-lg transition-all duration-200 hover:bg-[#e55f00] active:scale-[0.98]"
              >
                Start a Project
              </a>

              <a
                href="#work"
                className="inline-flex items-center justify-center h-12 px-7 border border-forge-border text-forge-text text-[14px] font-medium tracking-[0.04em] uppercase rounded-lg transition-all duration-200 hover:border-forge-text-secondary/50 hover:bg-forge-surface/50 active:scale-[0.98]"
              >
                View Work
              </a>
            </div>

            {/* Trust indicators with animated counters */}
            <div
              className={`flex items-center gap-4 sm:gap-6 mt-10 transition-all duration-700 ease-out delay-[350ms] ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <CounterStat value={50} suffix="+" label="Projects Shipped" />
              <div className="w-px h-8 sm:h-10 bg-forge-divider" />
              <CounterStat value={99} suffix=".9%" label="Uptime SLA" />
              <div className="w-px h-8 sm:h-10 bg-forge-divider" />
              <CounterStat value={24} suffix="h" label="Response Time" />
            </div>
          </div>

          {/* RIGHT — Abstract Visual */}
          <div className="relative hidden md:block">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

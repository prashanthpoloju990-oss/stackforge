"use client";

import { useEffect, useState } from "react";
import { HeroVisual } from "./hero-visual";

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
              <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase">
                Engineering Digital Experiences
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-[32px] sm:text-[40px] md:text-[52px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-forge-text transition-all duration-700 ease-out delay-100 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Built for Performance.
              <br />
              <span className="text-forge-text-secondary">
                Designed for Growth.
              </span>
            </h1>

            {/* Subtext */}
            <p
              className={`mt-5 text-[16px] md:text-[17px] text-forge-text-secondary leading-[1.7] max-w-[480px] transition-all duration-700 ease-out delay-200 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              We craft modern, high-performance websites that help businesses
              scale with clarity and confidence.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-start gap-4 mt-8 md:mt-10 transition-all duration-700 ease-out delay-300 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              {/* Primary Button */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-12 px-7 bg-forge-accent text-white text-[14px] font-semibold tracking-[0.04em] uppercase rounded-lg transition-all duration-200 hover:bg-[#e55f00] active:scale-[0.98]"
              >
                Start a Project
              </a>

              {/* Secondary Button */}
              <a
                href="#work"
                className="inline-flex items-center justify-center h-12 px-7 border border-forge-border text-forge-text text-[14px] font-medium tracking-[0.04em] uppercase rounded-lg transition-all duration-200 hover:border-forge-text-secondary/50 hover:bg-forge-surface/50 active:scale-[0.98]"
              >
                View Work
              </a>
            </div>

            {/* Trust indicators */}
            <div
              className={`flex items-center gap-4 sm:gap-6 mt-10 transition-all duration-700 ease-out delay-[350ms] ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[20px] sm:text-[22px] font-bold text-forge-text tracking-tight">
                  50+
                </span>
                <span className="text-[11px] sm:text-[12px] text-forge-text-secondary/60 tracking-wide">
                  Projects Shipped
                </span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-forge-divider" />
              <div className="flex flex-col">
                <span className="text-[20px] sm:text-[22px] font-bold text-forge-text tracking-tight">
                  99.9%
                </span>
                <span className="text-[11px] sm:text-[12px] text-forge-text-secondary/60 tracking-wide">
                  Uptime SLA
                </span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-forge-divider" />
              <div className="flex flex-col">
                <span className="text-[20px] sm:text-[22px] font-bold text-forge-text tracking-tight">
                  24h
                </span>
                <span className="text-[11px] sm:text-[12px] text-forge-text-secondary/60 tracking-wide">
                  Response Time
                </span>
              </div>
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

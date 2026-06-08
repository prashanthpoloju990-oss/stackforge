"use client";

import { useEffect, useState } from "react";
import { useScrollPosition } from "@/hooks/use-scroll-position";

/**
 * HeroVisual
 * ──────────
 * Abstract hero composition with subtle parallax depth.
 * Scroll-driven translateY via the shared RAF-throttled
 * useScrollPosition hook — zero per-frame layout reads,
 * GPU-composited transforms only. Max shift: ±15px.
 */
export function HeroVisual() {
  const [mounted, setMounted] = useState(false);
  const { scrollY, pastHero } = useScrollPosition();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(timer);
  }, []);

  // Clamp parallax factor: 0 at top, 0.15 at 1 viewport scroll, capped
  const factor = pastHero ? 1 : Math.min(scrollY / 800, 1) * 0.15;

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[520px]">
      {/* Subtle dot grid — slowest layer (moves UP on scroll) */}
      <div
        className="hero-dots absolute inset-0"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.02}px, 0)`,
          willChange: "transform",
        }}
      />

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Back panel — largest (moves slower than scroll) */}
        <div
          className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mounted
              ? "opacity-100 translate-y-0 translate-x-0"
              : "opacity-0 translate-y-8 translate-x-4"
          }`}
          style={{
            width: "85%",
            maxWidth: "420px",
            height: "65%",
            top: "14%",
            left: "8%",
            transform: mounted
              ? `translate3d(0, ${-scrollY * factor * 0.6}px, 0)`
              : undefined,
            willChange: mounted ? "transform" : "auto",
            transitionProperty: mounted ? "opacity" : "opacity transform",
          }}
        >
          <div className="w-full h-full rounded-xl border border-forge-divider/60 bg-forge-surface/40 p-5">
            {/* Top bar */}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-forge-divider/60" />
              <span className="w-2 h-2 rounded-full bg-forge-divider/60" />
              <span className="w-2 h-2 rounded-full bg-forge-divider/60" />
            </div>
            {/* Faux content */}
            <div className="space-y-2.5">
              <div className="h-2 rounded-full bg-forge-divider/40 w-3/4" />
              <div className="h-2 rounded-full bg-forge-divider/25 w-1/2" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg bg-forge-bg/60 border border-forge-divider/30" />
                <div className="h-12 rounded-lg bg-forge-bg/60 border border-forge-divider/30" />
                <div className="h-12 rounded-lg bg-forge-bg/60 border border-forge-divider/30" />
              </div>
              <div className="mt-2.5 h-2 rounded-full bg-forge-accent/15 w-2/5" />
              <div className="h-2 rounded-full bg-forge-divider/20 w-3/5" />
            </div>
          </div>
        </div>

        {/* Middle panel — overlapping (moves at different rate) */}
        <div
          className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] delay-150 ${
            mounted
              ? "opacity-100 translate-y-0 translate-x-0"
              : "opacity-0 translate-y-6 translate-x-6"
          }`}
          style={{
            width: "70%",
            maxWidth: "350px",
            height: "52%",
            top: "30%",
            right: "0%",
            left: "auto",
            animation: mounted
              ? "float-slow 6s ease-in-out infinite"
              : "none",
            transform: mounted
              ? `translate3d(0, ${-scrollY * factor * 0.35}px, 0)`
              : undefined,
            willChange: mounted ? "transform" : "auto",
            transitionProperty: mounted ? "opacity" : "opacity transform",
          }}
        >
          <div className="w-full h-full rounded-xl border border-forge-border/40 bg-forge-bg/70 backdrop-blur-sm p-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-forge-accent/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm bg-forge-accent/50" />
                </div>
                <div className="h-2 rounded-full bg-forge-divider/60 w-14" />
              </div>
              <div className="w-5 h-5 rounded-md border border-forge-border/40" />
            </div>

            {/* Chart bars */}
            <div className="flex items-end gap-1.5 h-[42%] mb-4">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor:
                        i === 7
                          ? "rgba(255, 106, 0, 0.3)"
                          : "rgba(26, 26, 26, 0.5)",
                    }}
                  />
                )
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-forge-divider/30">
              <div>
                <div className="text-fluid-micro text-forge-text-secondary/30 mb-0.5">
                  Performance
                </div>
                <div className="text-[13px] text-forge-text font-semibold font-tabular-nums">
                  98.2%
                </div>
              </div>
              <div>
                <div className="text-fluid-micro text-forge-text-secondary/30 mb-0.5">
                  Score
                </div>
                <div className="text-[13px] text-forge-accent/70 font-semibold">
                  A+
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accent line — moves fastest (closest to viewer) */}
        <div
          className={`absolute transition-all duration-1000 ease-out delay-300 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{
            width: "100px",
            height: "1.5px",
            top: "22%",
            right: "15%",
            backgroundColor: "rgba(255, 106, 0, 0.2)",
            animation: mounted
              ? "float-drift 8s ease-in-out infinite"
              : "none",
            transform: mounted
              ? `translate3d(0, ${-scrollY * factor * 0.9}px, 0)`
              : undefined,
            willChange: mounted ? "transform" : "auto",
            transitionProperty: mounted ? "opacity" : "opacity transform",
          }}
        />

        {/* Floating card — top right (moves at medium rate) */}
        <div
          className={`absolute transition-all duration-1000 ease-out ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{
            width: "110px",
            top: "6%",
            right: "6%",
            animation: mounted
              ? "float-drift 9s ease-in-out 0.5s infinite"
              : "none",
            transform: mounted
              ? `translate3d(0, ${-scrollY * factor * 0.7}px, 0)`
              : undefined,
            willChange: mounted ? "transform" : "auto",
            transitionProperty: mounted ? "opacity" : "opacity transform",
          }}
        >
          <div className="rounded-lg border border-forge-accent/10 bg-forge-bg/50 backdrop-blur-sm p-2.5">
            <div className="text-fluid-micro text-forge-accent/50 font-mono mb-0.5">
              v2.0
            </div>
            <div className="text-fluid-micro text-forge-text-secondary/40">
              Latest deploy
            </div>
            <div className="text-fluid-micro text-forge-text/60 font-medium mt-0.5">
              2s ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export function HeroVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to let paint settle before animating
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px]">
      {/* Subtle dot grid background */}
      <div className="hero-dots absolute inset-0" />

      {/* Main composition - layered panels */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Back panel - largest, most recessed */}
        <div
          className={`absolute transition-all duration-1000 ease-out ${
            mounted
              ? "opacity-100 translate-y-0 translate-x-0"
              : "opacity-0 translate-y-8 translate-x-4"
          }`}
          style={{
            width: "85%",
            maxWidth: "420px",
            height: "70%",
            top: "12%",
            left: "8%",
          }}
        >
          <div className="w-full h-full rounded-xl border border-forge-divider/80 bg-forge-surface/60 p-5">
            {/* Top bar with dots */}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-forge-divider" />
              <span className="w-2 h-2 rounded-full bg-forge-divider" />
              <span className="w-2 h-2 rounded-full bg-forge-divider" />
            </div>
            {/* Faux content rows */}
            <div className="space-y-2.5">
              <div className="h-2.5 rounded-full bg-forge-divider/60 w-3/4" />
              <div className="h-2.5 rounded-full bg-forge-divider/40 w-1/2" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg bg-forge-bg/80 border border-forge-divider/50" />
                <div className="h-12 rounded-lg bg-forge-bg/80 border border-forge-divider/50" />
                <div className="h-12 rounded-lg bg-forge-bg/80 border border-forge-divider/50" />
              </div>
              <div className="mt-2.5 h-2 rounded-full bg-forge-accent/20 w-2/5" />
              <div className="h-2 rounded-full bg-forge-divider/30 w-3/5" />
            </div>
          </div>
        </div>

        {/* Middle panel - overlapping right */}
        <div
          className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${
            mounted
              ? "opacity-100 translate-y-0 translate-x-0"
              : "opacity-0 translate-y-6 translate-x-6"
          }`}
          style={{
            width: "72%",
            maxWidth: "360px",
            height: "55%",
            top: "28%",
            right: "0%",
            left: "auto",
            animation: mounted
              ? "hero-float-1 6s ease-in-out infinite"
              : "none",
          }}
        >
          <div className="w-full h-full rounded-xl border border-forge-border/60 bg-forge-bg/80 backdrop-blur-sm p-4 shadow-2xl shadow-black/20">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-forge-accent/15 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-forge-accent/60" />
                </div>
                <div className="h-2 rounded-full bg-forge-divider w-16" />
              </div>
              <div className="w-5 h-5 rounded-md border border-forge-border/60" />
            </div>

            {/* Chart-like visual */}
            <div className="flex items-end gap-1.5 h-[45%] mb-4">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor:
                        i === 7
                          ? "rgba(255, 106, 0, 0.35)"
                          : "rgba(34, 38, 46, 0.7)",
                    }}
                  />
                )
              )}
            </div>

            {/* Bottom stats */}
            <div className="flex items-center justify-between pt-3 border-t border-forge-divider/40">
              <div>
                <div className="text-[10px] text-forge-text-secondary/40 mb-0.5">
                  Performance
                </div>
                <div className="text-[13px] text-forge-text font-semibold">
                  98.2%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-forge-text-secondary/40 mb-0.5">
                  Score
                </div>
                <div className="text-[13px] text-forge-accent/80 font-semibold">
                  A+
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accent line - floating horizontal */}
        <div
          className={`absolute transition-all duration-1000 ease-out delay-300 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{
            width: "120px",
            height: "2px",
            top: "22%",
            right: "15%",
            backgroundColor: "rgba(255, 106, 0, 0.25)",
            animation: mounted
              ? "hero-float-2 8s ease-in-out infinite"
              : "none",
          }}
        />

        {/* Small floating card - bottom left */}
        <div
          className={`absolute transition-all duration-1000 ease-out delay-200 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{
            width: "140px",
            top: "auto",
            bottom: "8%",
            left: "5%",
            animation: mounted
              ? "hero-float-1 7s ease-in-out 1s infinite"
              : "none",
          }}
        >
          <div className="rounded-lg border border-forge-border/40 bg-forge-bg/70 backdrop-blur-sm p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <span className="text-[10px] text-forge-text-secondary/50 font-mono">
                Status
              </span>
            </div>
            <div className="text-[14px] text-forge-text font-semibold tracking-tight">
              Live
            </div>
            <div className="text-[10px] text-forge-text-secondary/40 mt-0.5">
              All systems operational
            </div>
          </div>
        </div>

        {/* Small floating card - top right */}
        <div
          className={`absolute transition-all duration-1000 ease-out ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{
            width: "120px",
            top: "5%",
            right: "5%",
            animation: mounted
              ? "hero-float-2 9s ease-in-out 0.5s infinite"
              : "none",
          }}
        >
          <div className="rounded-lg border border-forge-accent/15 bg-forge-bg/60 backdrop-blur-sm p-3">
            <div className="text-[10px] text-forge-accent/60 font-mono mb-1">
              v2.0
            </div>
            <div className="text-[11px] text-forge-text-secondary/60">
              Latest deploy
            </div>
            <div className="text-[11px] text-forge-text/70 font-medium mt-0.5">
              2s ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

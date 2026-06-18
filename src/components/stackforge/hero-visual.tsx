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
    </div>
  );
}

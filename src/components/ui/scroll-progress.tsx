"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollProgress
 * ─────────────
 * Reads the shared scroll position via a rAF-throttled listener
 * and writes it to a CSS custom property on a fixed bar.
 * Zero React state updates → zero re-renders during scroll.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let rafId = 0;

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const currentBar = barRef.current;
        if (!currentBar) return;
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
        currentBar.style.width = `${progress}%`;
        currentBar.style.opacity = progress > 0 ? "1" : "0";
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full"
        style={{
          width: "0%",
          opacity: 0,
          background: "var(--forge-accent, #FF6A00)",
          transition: "width 50ms linear, opacity 100ms linear",
          willChange: "width",
        }}
      />
    </div>
  );
}

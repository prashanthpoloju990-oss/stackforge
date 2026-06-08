"use client";

import { useEffect, useState, useCallback } from "react";

function getScrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const scrollY = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollY === 0) return 0;
  return Math.min((scrollY / docHeight) * 100, 100);
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(getScrollProgress);

  const handleScroll = useCallback(() => {
    setProgress(getScrollProgress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: "var(--forge-accent, #FF6A00)",
          opacity: progress === 0 ? 0 : 1,
        }}
      />
    </div>
  );
}

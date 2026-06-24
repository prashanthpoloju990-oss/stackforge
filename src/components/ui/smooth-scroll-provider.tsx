"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * SmoothScrollProvider
 * ───────────────────
 * Client component that attaches global hash-link
 * interception for smooth scrolling and Lenis for
 * an ultra smooth, buttery kinetic scroll feel.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  const { setTheme } = useTheme();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setTheme("light");
    }
  }, [setTheme]);

  // Initialize Lenis for buttery smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

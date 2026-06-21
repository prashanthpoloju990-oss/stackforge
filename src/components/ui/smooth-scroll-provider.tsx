"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

/**
 * SmoothScrollProvider
 * ───────────────────
 * Client component that attaches global hash-link
 * interception for smooth scrolling. Place once in
 * the root layout (or page wrapper) so all anchor links
 * benefit from scroll-margin-top aware navigation.
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

  return <>{children}</>;
}

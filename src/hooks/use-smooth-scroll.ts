"use client";

import { useEffect, useCallback } from "react";

/**
 * useSmoothScroll
 * ───────────────
 * Intercepts all anchor hash-link clicks (`a[href^="#"]`)
 * and smooth-scrolls to the target element using
 * `scrollIntoView`. Works with the `scroll-margin-top`
 * CSS set on `[id]` elements to offset for the sticky
 * navbar (80px desktop, 64px mobile).
 *
 * Also exposes a `scrollToId(id)` helper for
 * programmatic navigation.
 */
export function useSmoothScroll() {
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href^=\"#\"]");
      if (!target) return;

      const href = (target as HTMLAnchorElement).getAttribute("href");
      if (!href || href === "#" || href === "#/") return;

      const id = href.startsWith("#") ? href.slice(1) : href;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });

        // Update URL hash without jumping
        history.replaceState(null, "", `#${id}`);
      }
    };

    document.addEventListener("click", handleClick, { passive: false });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return { scrollToId };
}

"use client";

import { useEffect, useCallback } from "react";

/**
 * useSmoothScroll
 * ───────────────
 * Intercepts all anchor hash-link clicks (`a[href^="#"]`)
 * and smooth-scrolls to the target element using a custom
 * easeOutExpo animation loop for a snappier, premium feel.
 */
export function useSmoothScroll() {
  const animateScroll = useCallback((targetY: number) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 650; // Fast 650ms scroll
    let startTime: number | null = null;

    // Easing: easeOutExpo
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutExpo(progress);

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = window.innerWidth >= 768 ? 72 : 64;
      const targetY = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      animateScroll(targetY);
    }
  }, [animateScroll]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      const isHashLink = href.startsWith("#") || href.startsWith("/#");
      const isHomeLink = href === "/" || href === "/#";

      if (!isHashLink && !isHomeLink) return;

      // Handle Home link click on the home page (scroll to top)
      if (isHomeLink) {
        if (window.location.pathname === "/") {
          e.preventDefault();
          animateScroll(0);
          if (window.location.hash) {
            history.replaceState(null, "", "/");
          }
        }
        return;
      }

      // Handle normal hash section clicks on the same page
      const id = href.includes("#") ? href.split("#")[1] : "";
      if (!id) return;

      const el = document.getElementById(id);
      if (el) {
        const pathBeforeHash = href.split("#")[0];
        const isCurrentPage =
          pathBeforeHash === "" || pathBeforeHash === "/" || pathBeforeHash === window.location.pathname;

        if (isCurrentPage) {
          e.preventDefault();
          const navbarHeight = window.innerWidth >= 768 ? 72 : 64;
          const targetY = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
          animateScroll(targetY);

          // Update URL hash without jumping
          history.replaceState(null, "", `#${id}`);
        }
      }
    };

    document.addEventListener("click", handleClick, { passive: false });
    return () => document.removeEventListener("click", handleClick);
  }, [animateScroll]);

  return { scrollToId };
}

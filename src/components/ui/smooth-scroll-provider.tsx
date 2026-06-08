"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

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
  return <>{children}</>;
}

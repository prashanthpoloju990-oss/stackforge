"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.1, once = true, rootMargin = "0px 0px -60px 0px" } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, isVisible };
}

/**
 * Returns a className string that applies scroll-reveal animation.
 * Pass `isVisible` from useScrollReveal.
 */
export function scrollRevealClass(
  isVisible: boolean,
  delay: number = 0
): string {
  const base = "transition-all duration-700 ease-out";
  const delayClass = delay > 0 ? ` delay-[${delay}ms]` : "";
  if (isVisible) {
    return `${base}${delayClass} opacity-100 translate-y-0`;
  }
  return `${base}${delayClass} opacity-0 translate-y-6`;
}

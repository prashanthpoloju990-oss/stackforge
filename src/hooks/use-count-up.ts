"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  target: number;
  duration?: number;
  decimals?: number;
  enabled?: boolean;
}

/**
 * Animated count-up hook using requestAnimationFrame with easeOutCubic easing.
 * Returns the current animated value. Starts counting when `enabled` becomes true.
 * Returns 0 when `enabled` is false.
 */
export function useCountUp({
  target,
  duration = 2000,
  decimals = 0,
  enabled = true,
}: UseCountUpOptions): number {
  const [animatedValue, setAnimatedValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Cancel any running animation without calling setState in the effect body
      startTimeRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startTimeRef.current = null;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      // setState inside rAF callback is allowed (it's a subscription callback)
      setAnimatedValue(parseFloat((eased * target).toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, decimals, enabled]);

  // Return 0 when not enabled, animated value otherwise
  return enabled ? animatedValue : 0;
}

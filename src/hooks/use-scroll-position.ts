"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

/**
 * useScrollPosition
 * ─────────────────
 * A SINGLE scroll listener + RAF loop shared across all consumers.
 * Returns a reactive snapshot of the current scroll position
 * without triggering per-frame React re-renders for every consumer.
 *
 * Consumers subscribe via `useScrollPosition()` and read
 * `.scrollY`, `.progress`, `.pastHero`, `.scrolled` etc.
 *
 * Internally uses a single passive scroll listener + rAF throttle
 * so the main thread stays free even with many subscribers.
 */

interface ScrollState {
  scrollY: number;
  progress: number;   // 0-100
  pastHero: boolean;  // scrollY > innerHeight
  scrolled: boolean;  // scrollY > 20 (navbar backdrop trigger)
  pastSticky: boolean; // scrollY > 600 (sticky CTA trigger)
}

const emptySubscribe = () => () => {};

const INITIAL_STATE: ScrollState = {
  scrollY: 0,
  progress: 0,
  pastHero: false,
  scrolled: false,
  pastSticky: false,
};

const listeners = new Set<() => void>();
let currentState: ScrollState = { ...INITIAL_STATE };
let rafId = 0;
let scrollEventAttached = false;

function computeState(): ScrollState {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
  return {
    scrollY,
    progress,
    pastHero: scrollY > window.innerHeight,
    scrolled: scrollY > 20,
    pastSticky: scrollY > 600,
  };
}

function onScroll() {
  // Throttle to rAF
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    currentState = computeState();
    listeners.forEach((l) => l());
  });
}

function attachScrollListener() {
  if (scrollEventAttached) return;
  scrollEventAttached = true;
  window.addEventListener("scroll", onScroll, { passive: true });
}

function subscribe(listener: () => void) {
  attachScrollListener();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

function getSnapshot(): ScrollState {
  return currentState;
}

function getServerSnapshot(): ScrollState {
  return INITIAL_STATE;
}

/**
 * Hook to read the shared scroll position.
 * Safe for SSR — returns zeros on server.
 */
export function useScrollPosition(): ScrollState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Programmatic helper: scroll to an element by id, or to top.
 */
export function scrollToId(id?: string) {
  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }
}

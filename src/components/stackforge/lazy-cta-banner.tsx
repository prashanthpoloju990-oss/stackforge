"use client";

import dynamic from "next/dynamic";

/**
 * LazyCtaBanner
 * ──────────────
 * Code-split wrapper for the CTA Banner section.
 * Uses AnimatedShaderBackground (Three.js WebGL) which
 * is GPU-heavy — defer until near viewport. Min-height
 * placeholder prevents layout shift.
 */
export const LazyCtaBanner = dynamic(
  () => import("@/components/stackforge/cta-banner").then((m) => m.CtaBanner),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 md:py-32 lg:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-20">
          <div className="animate-pulse flex flex-col items-center text-center">
            <div className="h-4 w-16 bg-forge-divider/30 rounded mb-4" />
            <div className="h-10 w-80 bg-forge-divider/20 rounded mb-4" />
            <div className="h-5 w-64 bg-forge-divider/15 rounded mb-8" />
            <div className="h-12 w-48 bg-forge-divider/20 rounded-lg" />
          </div>
        </div>
      </div>
    ),
  }
);

"use client";

import dynamic from "next/dynamic";

/**
 * LazyPricing
 * ───────────
 * Code-split wrapper for the Pricing section.
 * Pricing uses sparkles.tsx (particle engine) which
 * is heavy — defer loading until the section is near
 * the viewport. The min-height placeholder prevents CLS.
 */
export const LazyPricing = dynamic(
  () => import("@/components/stackforge/pricing").then((m) => m.Pricing),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 md:py-32 lg:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-20">
          <div className="animate-pulse">
            <div className="h-4 w-20 bg-forge-divider/30 rounded mb-4" />
            <div className="h-10 w-64 bg-forge-divider/20 rounded mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[520px] bg-forge-divider/10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

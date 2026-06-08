"use client";

import { cn } from "@/lib/utils";
import { useScrollPosition, scrollToId } from "@/hooks/use-scroll-position";

export function StickyCta() {
  const { pastSticky: visible } = useScrollPosition();

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-none pb-[max(0px,env(safe-area-inset-bottom))] contain-layout",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4"
      )}
    >
      <button
        onClick={() => scrollToId("contact")}
        className={cn(
          "btn-primary inline-flex items-center gap-2 h-fluid-btn-sm px-5 bg-forge-accent text-white text-fluid-btn font-semibold uppercase rounded-full shadow-lg transition-all duration-200 cursor-pointer font-syne",
          "active:scale-[0.98]"
        )}
        aria-label="Start a project — scroll to contact form"
      >
        Start a Project
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path
            d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

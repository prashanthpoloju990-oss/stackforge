"use client";

import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MagneticWrapper } from "@/components/ui/magnetic-button";
import { BlobButton } from "@/components/ui/blob-button";

export function StickyCta() {
  const { scrollY } = useScrollPosition();
  const router = useRouter();
  const pathname = usePathname();
  const [pricingReached, setPricingReached] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const el = document.getElementById("pricing");
      if (!el) return false;

      if (observer) observer.disconnect();

      observer = new IntersectionObserver(
        ([entry]) => {
          // Hide when pricing section is near, in view, or scrolled past
          setPricingReached(
            entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight - 50
          );
        },
        {
          root: null,
          rootMargin: "100px 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      return true;
    };

    if (!setupObserver()) {
      // Retry in case LazyPricing takes a moment to mount
      const timer = setInterval(() => {
        if (setupObserver()) clearInterval(timer);
      }, 300);
      return () => clearInterval(timer);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  // Hide on the start-project page itself
  if (pathname === "/start-project") return null;

  const visible = scrollY > 250 && !pricingReached;

  return (
    <div
      className={cn(
        "fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out pointer-events-none contain-layout",
        visible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-95"
      )}
    >
      <MagneticWrapper>
        <BlobButton
          variant="popular"
          onClick={() => router.push("/start-project")}
          className={cn(
            "btn-primary inline-flex items-center gap-2 h-fluid-btn-sm px-5 bg-forge-accent text-white text-fluid-btn font-semibold uppercase rounded-full shadow-lg transition-all duration-200 cursor-pointer font-syne touch-manipulation",
            "active:scale-[0.98]"
          )}
          aria-label="Start a project — go to project inquiry page"
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
        </BlobButton>
      </MagneticWrapper>
    </div>
  );
}

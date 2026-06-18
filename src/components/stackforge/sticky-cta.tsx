"use client";

import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MagneticWrapper } from "@/components/ui/magnetic-button";
import { BlobButton } from "@/components/ui/blob-button";


export function StickyCta() {
  const { scrollY } = useScrollPosition();
  const router = useRouter();
  const [pricingReached, setPricingReached] = useState(false);


  useEffect(() => {
    const el = document.getElementById("pricing-container");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPricingReached(
          entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight - 100
        );
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visible = scrollY > 150 && !pricingReached;

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-none pb-[max(0px,env(safe-area-inset-bottom))] contain-layout",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4"
      )}
    >
      <MagneticWrapper>
        <BlobButton
          variant="popular"
          onClick={() => router.push("/start-project")}
          className={cn(
            "btn-primary inline-flex items-center gap-2 h-fluid-btn-sm px-5 bg-forge-accent text-white text-fluid-btn font-semibold uppercase rounded-full shadow-lg transition-all duration-200 cursor-pointer font-syne",
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

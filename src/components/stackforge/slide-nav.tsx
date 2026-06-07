"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const slides = [
  { id: "hero", label: "Home" },
  { id: "statement", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "stats", label: "Stats" },
  { id: "testimonial", label: "Review" },
  { id: "cta", label: "Contact" },
];

export function SlideNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(".scroll-snap-container");
      if (!container) return;

      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const index = Math.round(scrollTop / height);
      setActive(Math.min(index, slides.length - 1));
    };

    const container = document.querySelector(".scroll-snap-container");
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollTo = (index: number) => {
    const container = document.querySelector(".scroll-snap-container");
    if (!container) return;
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: "smooth",
    });
  };

  return (
    <nav
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5"
      aria-label="Section navigation"
    >
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          onClick={() => scrollTo(i)}
          aria-label={slide.label}
          className={cn(
            "group relative w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
            active === i
              ? "bg-forge-accent scale-125"
              : "bg-forge-text-secondary/20 hover:bg-forge-text-secondary/40"
          )}
        >
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-[11px] text-forge-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-mono">
            {slide.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

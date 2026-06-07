"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-400 pointer-events-none",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4"
      )}
    >
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 h-10 px-5 bg-forge-accent text-white text-[12px] font-semibold tracking-[0.06em] uppercase rounded-full shadow-lg transition-all duration-200 cursor-pointer font-syne",
          "hover:bg-[#e55f00] hover:scale-[1.03] hover:shadow-forge-accent/15",
          "active:scale-[0.97]"
        )}
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

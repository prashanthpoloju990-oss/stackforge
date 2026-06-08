"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function isScrolledPastHero(): boolean {
  if (typeof window === "undefined") return false;
  return window.scrollY > window.innerHeight;
}

export function BackToTop() {
  const [visible, setVisible] = useState(isScrolledPastHero);

  const handleScroll = useCallback(() => {
    setVisible(isScrolledPastHero);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`
            fixed right-5
            bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px)+3.5rem)]
            z-30
            w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-forge-surface
            border border-forge-divider
            hover:border-forge-accent/40
            shadow-lg
            transition-colors duration-200
            cursor-pointer
            text-forge-text-secondary
            hover:text-forge-accent
          `}
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

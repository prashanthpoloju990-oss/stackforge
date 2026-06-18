"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useScrollPosition, scrollToId } from "@/hooks/use-scroll-position";

export function BackToTop() {
  const { pastHero } = useScrollPosition();

  return (
    <AnimatePresence>
      {pastHero && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => scrollToId()}
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

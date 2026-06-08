"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CaseStudy {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  metric: string;
  metricLabel: string;
  challenge: string;
  solution: string;
  results: string;
  testimonial?: string;
  testimonialAuthor?: string;
}

interface CaseStudyModalProps {
  study: CaseStudy | null;
  open: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 16,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-fluid-h3 font-semibold text-forge-text font-syne mb-3">
      {children}
    </h3>
  );
}

export function CaseStudyModal({ study, open, onClose }: CaseStudyModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && study && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Content Card */}
          <motion.div
            className={cn(
              "relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl",
              "bg-forge-bg border border-forge-divider shadow-2xl",
              "scrollbar-thin scrollbar-thumb-forge-divider/40 scrollbar-track-transparent"
            )}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                "absolute top-4 right-4 z-10 w-10 h-10 rounded-full",
                "bg-forge-surface/80 backdrop-blur-sm border border-forge-divider",
                "flex items-center justify-center",
                "text-forge-text-secondary/60 hover:text-forge-text",
                "transition-colors duration-200",
                "cursor-pointer"
              )}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Image */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl">
              <Image
                src={study.image}
                alt={study.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forge-bg via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="px-6 md:px-10 pb-8 md:pb-10 -mt-12 relative z-[1]">
              {/* Title Block */}
              <div className="mb-6">
                <p className="text-[12px] text-forge-accent/60 tracking-[0.08em] uppercase font-mono mb-2">
                  {study.subtitle}
                </p>
                <h2
                  id="case-study-title"
                  className="text-fluid-h1 font-bold text-forge-text font-playfair tracking-tight mb-3"
                >
                  {study.title}
                </h2>
                <p className="text-fluid-body text-forge-text-secondary/60 leading-relaxed max-w-[600px]">
                  {study.description}
                </p>
              </div>

              {/* Tags + Metric */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded text-[12px] font-medium tracking-wide text-forge-text-secondary/50 bg-forge-surface/60 border border-forge-divider/40"
                  >
                    {tag}
                  </span>
                ))}
                <div className="ml-auto flex items-baseline gap-1.5 bg-forge-accent/10 border border-forge-accent/20 rounded-md px-3 py-1">
                  <span className="text-[16px] font-bold text-forge-accent tabular-nums">
                    {study.metric}
                  </span>
                  <span className="text-[12px] text-forge-accent/60">
                    {study.metricLabel}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-forge-divider/40 mb-8" />

              {/* The Challenge */}
              <div className="mb-8">
                <SectionHeading>The Challenge</SectionHeading>
                <p className="text-fluid-body text-forge-text-secondary/60 leading-relaxed">
                  {study.challenge}
                </p>
              </div>

              {/* Our Approach */}
              <div className="mb-8">
                <SectionHeading>Our Approach</SectionHeading>
                <p className="text-fluid-body text-forge-text-secondary/60 leading-relaxed">
                  {study.solution}
                </p>
              </div>

              {/* The Results */}
              <div className="mb-8">
                <SectionHeading>The Results</SectionHeading>
                <p className="text-fluid-body text-forge-text-secondary/60 leading-relaxed">
                  {study.results}
                </p>
              </div>

              {/* Testimonial */}
              {study.testimonial && study.testimonialAuthor && (
                <div className="mb-8 rounded-xl border border-forge-divider/40 bg-forge-surface/30 p-6">
                  <Quote className="w-5 h-5 text-forge-accent/40 mb-3" />
                  <blockquote className="text-fluid-body-lg text-forge-text/80 italic leading-relaxed mb-3">
                    &ldquo;{study.testimonial}&rdquo;
                  </blockquote>
                  <p className="text-[13px] text-forge-text-secondary/50 font-medium">
                    — {study.testimonialAuthor}
                  </p>
                </div>
              )}

              {/* CTA */}
              <a
                href="#contact"
                onClick={onClose}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                  "bg-forge-accent text-white font-medium text-[14px]",
                  "btn-primary",
                  "transition-all duration-200"
                )}
              >
                Start a Similar Project
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

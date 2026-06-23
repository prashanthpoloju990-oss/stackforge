"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Check, Clock, Package, ArrowRight } from "lucide-react";
import { BorderGlow } from "@/components/ui/border-glow";
import { cn } from "@/lib/utils";
import { BlobButton } from "@/components/ui/blob-button";

export interface ServiceDetail {
  number: string;
  title: string;
  tagline: string;
  description: string;
  price: string;
  priceNote: string;
  features: string[];
  deliverables: string[];
  timeline: string;
  cta: string;
  highlighted: boolean;
}

interface ServiceModalProps {
  service: ServiceDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

/* ── Animation Variants ── */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.97,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const;

/* ── Sub-components ── */

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={cn(
        "text-[13px] font-semibold text-forge-text tracking-wide uppercase mb-4 font-syne",
        className
      )}
    >
      {children}
    </h4>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-fluid-body text-forge-text-secondary/70 leading-snug">
      <Check className="w-4 h-4 text-forge-accent flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}

function DeliverableItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-fluid-body text-forge-text-secondary/70 leading-snug">
      <Package className="w-4 h-4 text-forge-accent/60 flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}

/* ── Main Modal ── */

export function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

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
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleCtaClick = useCallback(() => {
    onClose();
    // Small delay so the scroll happens after the modal closes
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && service && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <BorderGlow animated borderRadius={12} glowIntensity={1.1}>
              <div className="bg-forge-bg rounded-xl overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className={cn(
                    "absolute top-4 right-4 z-10 w-9 h-9 rounded-full",
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

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-forge-divider/40 scrollbar-track-transparent">
                  <div className="px-6 pt-6 pb-8 md:px-10 md:pt-10 md:pb-10">
                    {/* ── Header ── */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[13px] font-mono text-forge-accent/50 tracking-wider">
                          {service.number}
                        </span>
                        <h2
                          id="service-modal-title"
                          className="text-fluid-h2 font-bold text-forge-text font-playfair"
                        >
                          {service.title}
                        </h2>
                      </div>
                      <p className="text-[14px] text-forge-text-secondary/50 tracking-[0.04em]">
                        {service.tagline}
                      </p>
                    </div>

                    {/* ── Description ── */}
                    <p className="text-fluid-body-lg text-forge-text-secondary/80 leading-relaxed mb-8 max-w-[560px]">
                      {service.description}
                    </p>

                    {/* ── Price ── */}
                    <div className="flex items-baseline gap-2 mb-8">
                      <span
                        className={cn(
                          "text-[24px] font-bold tracking-tight font-tabular-nums",
                          service.highlighted
                            ? "text-forge-accent"
                            : "text-forge-text"
                        )}
                      >
                        {service.price}
                      </span>
                      <span className="text-[13px] text-forge-text-secondary/40 tracking-wide">
                        {service.priceNote}
                      </span>
                    </div>

                    {/* ── Divider ── */}
                    <div className="w-full h-px bg-forge-divider/40 mb-8" />

                    {/* ── Deliverables ── */}
                    <div className="mb-8">
                      <SectionLabel>What You Get</SectionLabel>
                      <ul className="space-y-3">
                        {service.deliverables.map((item) => (
                          <DeliverableItem key={item} text={item} />
                        ))}
                      </ul>
                    </div>

                    {/* ── Divider ── */}
                    <div className="w-full h-px bg-forge-divider/40 mb-8" />

                    {/* ── Features ── */}
                    <div className="mb-8">
                      <SectionLabel>Features</SectionLabel>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <CheckItem key={feature} text={feature} />
                        ))}
                      </ul>
                    </div>

                    {/* ── Divider ── */}
                    <div className="w-full h-px bg-forge-divider/40 mb-8" />

                    {/* ── Timeline ── */}
                    <div className="flex items-center gap-2 mb-10">
                      <Clock className="w-4 h-4 text-forge-accent/60" />
                      <span className="text-[14px] text-forge-text-secondary/70">
                        Typical timeline:{" "}
                        <span className="font-medium text-forge-text">
                          {service.timeline}
                        </span>
                      </span>
                    </div>

                    {/* ── CTA ── */}
                    <BlobButton
                      variant="popular"
                      onClick={handleCtaClick}
                      className={cn(
                        "inline-flex items-center gap-2 px-8 py-3 rounded-full",
                        "bg-forge-accent text-white font-medium text-[14px]",
                        "btn-primary",
                        "transition-all duration-200",
                        "cursor-pointer"
                      )}
                    >
                      Start with {service.title}
                      <ArrowRight className="w-4 h-4" />
                    </BlobButton>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function CtaBanner() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="relative py-24 md:py-32 lg:py-[140px] bg-[#0A0A0A]">
      {/* Subtle top edge line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-forge-divider" />
      {/* Subtle bottom edge line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-divider" />

      <div className="mx-auto max-w-[1200px] px-6 md:px-20 relative z-10">
        <div
          ref={ref}
          className={cn(
            "flex flex-col items-center text-center max-w-[680px] mx-auto transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Headline */}
          <h2 className="text-[28px] sm:text-[34px] md:text-[44px] lg:text-[48px] font-bold leading-[1.1] tracking-[-0.03em] text-forge-text">
            Ready to Build Something
            <br className="hidden sm:block" />
            {" "}
            That{" "}
            <span className="text-forge-text-secondary">Actually Works?</span>
          </h2>

          {/* Subtext */}
          <p className="mt-5 md:mt-6 text-[16px] md:text-[17px] text-forge-text-secondary leading-relaxed max-w-[520px]">
            Let&apos;s create a website that not only looks great, but performs,
            converts, and grows your business.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 md:mt-12">
            {/* Primary */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 px-8 bg-forge-accent text-white text-[14px] font-semibold tracking-[0.04em] uppercase rounded-lg transition-all duration-200 hover:bg-[#e55f00] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start Your Project
            </a>

            {/* Secondary */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 px-8 border border-forge-border text-forge-text text-[14px] font-medium tracking-[0.04em] uppercase rounded-lg transition-all duration-200 hover:border-forge-text-secondary/50 hover:bg-forge-surface/40 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Book a Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

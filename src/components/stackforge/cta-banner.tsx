"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function CtaBanner() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="relative py-24 md:py-32 lg:py-[130px] overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255, 106, 0, 0.04) 0%, transparent 70%)",
        }}
      />
      {/* Edge lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-forge-divider" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-divider" />

      <div className="mx-auto max-w-[1200px] px-6 md:px-20 relative z-10">
        <div
          ref={ref}
          className={cn(
            "flex flex-col items-center text-center max-w-[640px] mx-auto transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-[12px] text-forge-accent/50 font-medium tracking-[0.16em] uppercase mb-5 font-mono">
            Ready?
          </span>

          <h2 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] font-bold leading-[1.08] tracking-[-0.035em] text-forge-text font-playfair">
            Your next website should
            <br className="hidden sm:block" />
            {" "}
            <span className="text-forge-accent/80">actually work.</span>
          </h2>

          <p className="mt-5 text-[16px] text-forge-text-secondary/60 leading-[1.7] max-w-[480px]">
            Stop settling for slow, generic websites. Let&apos;s build something
            that performs, converts, and grows with your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-11 px-8 bg-forge-accent text-white text-[13px] font-semibold tracking-[0.06em] uppercase rounded-lg transition-all duration-200 hover:bg-[#e55f00] hover:shadow-lg hover:shadow-forge-accent/10 active:scale-[0.98]"
            >
              Start Your Project
            </a>

            <a
              href="#contact"
              className="inline-flex items-center justify-center h-11 px-8 border border-forge-border text-forge-text-secondary text-[13px] font-medium tracking-[0.06em] uppercase rounded-lg transition-all duration-200 hover:border-forge-text-secondary/40 hover:text-forge-text active:scale-[0.98]"
            >
              Book a Free Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "Understanding your business, goals, and requirements.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Crafting a clean, modern interface with strong user experience.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Developing a fast, scalable, and production-ready system.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "Testing, refining, and deploying your product with confidence.",
  },
];

export function Process() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="process" className="py-24 md:py-32 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header — Center Aligned */}
        <div
          ref={headerRef}
          className={cn(
            "text-center mb-16 md:mb-24 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase block mb-4 font-dancing">
            Process
          </span>
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold leading-[1.08] tracking-[-0.03em] text-forge-text mx-auto max-w-[600px] font-playfair">
            How We Work
          </h2>
          <p className="mt-4 text-[16px] md:text-[17px] text-forge-text-secondary leading-relaxed mx-auto max-w-[480px]">
            A clear and structured process to take your idea from concept to
            launch.
          </p>
        </div>

        {/* Steps — Horizontal Flow */}
        <div ref={stepsRef} className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[38px] left-[12.5%] right-[12.5%] h-px bg-forge-divider" />

          {/* Mobile: vertical line */}
          <div className="lg:hidden absolute top-0 bottom-0 left-[19px] w-px bg-forge-divider" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-0 relative">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={cn(
                  "relative flex flex-col items-center text-center transition-all duration-700 ease-out",
                  stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: stepsVisible ? `${index * 150}ms` : "0ms" }}
              >
                {/* Step number circle — desktop */}
                <div className="hidden lg:flex items-center justify-center w-[76px] h-[76px] rounded-full border-2 border-forge-divider bg-forge-bg relative z-10 transition-all duration-300 hover:border-forge-accent/40 group">
                  <span className="text-[24px] font-bold text-forge-text tracking-tight transition-colors duration-300 group-hover:text-forge-accent font-syne">
                    {step.number}
                  </span>
                </div>

                {/* Step number circle — mobile */}
                <div className="lg:hidden flex items-center justify-center w-[40px] h-[40px] rounded-full border-2 border-forge-divider bg-forge-bg relative z-10 flex-shrink-0 mb-4">
                  <span className="text-[15px] font-bold text-forge-text tracking-tight font-syne">
                    {step.number}
                  </span>
                </div>

                {/* Text content */}
                <div className="lg:mt-6 lg:px-2">
                  {/* Mobile: left-aligned text */}
                  <div className="lg:text-center flex lg:flex-col flex-row items-start lg:items-center gap-4 lg:gap-0 pl-14 lg:pl-0">
                    <div>
                      <h3 className="text-[18px] md:text-[20px] font-semibold text-forge-text tracking-[-0.01em] font-syne">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[14px] md:text-[15px] text-forge-text-secondary leading-relaxed lg:max-w-[220px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

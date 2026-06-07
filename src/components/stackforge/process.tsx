"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We dig into your business, users, and goals. No templates — every project starts with a blank canvas and honest questions.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Clean, purposeful interfaces. We design in Figma, iterate fast, and don't move forward until you love it.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Production-grade code with React, Next.js, and TypeScript. Fast, accessible, SEO-ready from the first commit.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "We test everything, deploy to production, and stick around. Post-launch support is never an afterthought.",
  },
];

export function Process() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="process" className="py-24 md:py-32 lg:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "mb-16 md:mb-20 transition-all duration-600 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          )}
        >
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
            Process
          </span>
          <h2 className="text-fluid-h1 font-bold text-forge-text max-w-[550px] font-playfair">
            Simple process.
            <br />
            <span className="text-forge-accent/70"> Serious results.</span>
          </h2>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-[36px] left-[60px] right-[60px] h-px bg-forge-divider" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-0 relative">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={cn(
                  "relative transition-all duration-600 ease-out",
                  stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
                )}
                style={{ transitionDelay: stepsVisible ? `${index * 100}ms` : "0ms" }}
              >
                {/* Mobile layout */}
                <div className="lg:hidden flex items-start gap-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-forge-divider bg-forge-bg shrink-0 relative z-10">
                    <span className="text-[14px] font-bold text-forge-text tracking-tight font-syne">
                      {step.number}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-10 left-[19px] w-px h-[calc(100%+8px)] bg-forge-divider" />
                  )}
                  <div className="pb-10">
                    <h3 className="text-fluid-h3 font-semibold text-forge-text font-syne">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-fluid-body text-forge-text-secondary/60 max-w-[380px]">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:flex flex-col items-center text-center px-4">
                  <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full border border-forge-divider bg-forge-bg relative z-10 transition-all duration-300 hover:border-forge-accent/30 group">
                    <span className="text-[22px] font-bold text-forge-text tracking-tight transition-colors duration-300 group-hover:text-forge-accent font-syne">
                      {step.number}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-fluid-h3 font-semibold text-forge-text font-syne">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-fluid-body text-forge-text-secondary/60 max-w-[210px]">
                      {step.description}
                    </p>
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

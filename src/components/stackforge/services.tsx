"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const services = [
  {
    title: "Kit",
    description:
      "A fast, clean website to get your business online with confidence and speed.",
    price: "Starting at ₹20K",
    features: [
      "1–5 Page Website",
      "Responsive Design",
      "Clean UI/UX",
      "Fast Performance",
      "Basic SEO Setup",
    ],
    cta: "Get Started →",
    highlighted: false,
  },
  {
    title: "Pack",
    description:
      "A scalable website with powerful features designed for growing businesses.",
    price: "Starting at ₹80K",
    features: [
      "Custom UI/UX Design",
      "Backend Integration",
      "CMS / Dashboard",
      "API Integrations",
      "Performance Optimization",
    ],
    cta: "Start Building →",
    highlighted: true,
  },
  {
    title: "Bag",
    description:
      "End-to-end product development for brands that demand precision and performance.",
    price: "Custom Pricing",
    features: [
      "Full Product Development",
      "Strategy + Design + Development",
      "Advanced Features",
      "Long-Term Support",
      "Priority Delivery",
    ],
    cta: "Let's Talk →",
    highlighted: false,
  },
];

export function Services() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: blocksRef, isVisible: blocksVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="services" className="py-24 md:py-32 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "mb-16 md:mb-24 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase block mb-4 font-mono">
            Services
          </span>
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold leading-[1.08] tracking-[-0.03em] text-forge-text max-w-[700px] font-playfair">
            What We Build
          </h2>
          <p className="mt-4 text-[16px] md:text-[17px] text-forge-text-secondary leading-relaxed max-w-[560px]">
            Structured solutions designed for different stages of business
            growth.
          </p>
        </div>

        {/* Service Blocks */}
        <div ref={blocksRef} className="flex flex-col gap-8">
          {services.map((service, index) => (
            <a
              key={service.title}
              href="#contact"
              className={cn(
                "group block rounded-xl border bg-forge-surface p-6 sm:p-8 md:p-10 transition-all duration-700 ease-out",
                blocksVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                service.highlighted
                  ? "border-forge-accent/30 hover:border-forge-accent/50 hover:-translate-y-1"
                  : "border-forge-divider hover:border-forge-border hover:-translate-y-1"
              )}
              style={{ transitionDelay: blocksVisible ? `${index * 100}ms` : "0ms" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Left Column — Info */}
                <div className="flex flex-col">
                  {/* Accent line for highlighted block */}
                  {service.highlighted && (
                    <div className="w-8 h-0.5 bg-forge-accent/60 mb-5" />
                  )}

                  <h3 className="text-[22px] md:text-[26px] font-semibold text-forge-text tracking-[-0.02em] font-syne">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-[15px] md:text-[16px] text-forge-text-secondary leading-[1.65] max-w-[400px]">
                    {service.description}
                  </p>

                  <div className="mt-6">
                    <span
                      className={cn(
                        "text-[15px] font-semibold tracking-tight font-mono",
                        service.highlighted
                          ? "text-forge-accent"
                          : "text-forge-text"
                      )}
                    >
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* Right Column — Features */}
                <div className="flex flex-col">
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-[15px] text-forge-text-secondary"
                      >
                        <span
                          className={cn(
                            "w-1 h-1 rounded-full flex-shrink-0",
                            service.highlighted
                              ? "bg-forge-accent/60"
                              : "bg-forge-divider"
                          )}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Link */}
                  <div className="mt-8">
                    <span className="inline-flex items-center gap-2 text-[14px] font-medium text-forge-text-secondary tracking-wide transition-colors duration-200 group-hover:text-forge-text">
                      {service.cta}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        <path
                          d="M1 7H13M13 7L8 2M13 7L8 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

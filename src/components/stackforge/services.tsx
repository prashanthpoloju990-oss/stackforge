"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const services = [
  {
    number: "01",
    title: "Kit",
    tagline: "Launch fast, look sharp.",
    description:
      "A fast, clean website to get your business online. Perfect for MVPs, personal brands, and early-stage startups who need credibility without the overhead.",
    price: "₹20K",
    priceNote: "starting at",
    features: [
      "1–5 page responsive site",
      "Mobile-first design",
      "Performance optimized",
      "Basic SEO & analytics",
      "2 rounds of revisions",
    ],
    cta: "Get Started →",
    highlighted: false,
  },
  {
    number: "02",
    title: "Pack",
    tagline: "For brands that are growing.",
    description:
      "A scalable website with custom design, backend integration, and all the features your business needs to convert visitors into customers.",
    price: "₹80K",
    priceNote: "starting at",
    features: [
      "Custom UI/UX design",
      "CMS & dashboard",
      "API integrations",
      "Advanced SEO strategy",
      "3 months post-launch support",
    ],
    cta: "Start Building →",
    highlighted: true,
  },
  {
    number: "03",
    title: "Bag",
    tagline: "Full stack. Zero compromise.",
    description:
      "End-to-end product development. From strategy through design, development, and long-term support — for teams that demand precision.",
    price: "Custom",
    priceNote: "tailored scope",
    features: [
      "Full product development",
      "Strategy + architecture",
      "Advanced features & auth",
      "Dedicated project lead",
      "Priority delivery & SLA",
    ],
    cta: "Let's Talk →",
    highlighted: false,
  },
];

export function Services() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: blocksRef, isVisible: blocksVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="services" className="py-24 md:py-32 lg:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "mb-16 md:mb-20 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
            Services
          </span>
          <h2 className="text-[30px] md:text-[42px] lg:text-[48px] font-bold leading-[1.06] tracking-[-0.035em] text-forge-text max-w-[550px] font-playfair">
            Structured for every
            <br className="hidden md:block" />
            <span className="font-curvy text-forge-accent/70 text-[0.88em]"> stage of growth.</span>
          </h2>
        </div>

        {/* Service Blocks */}
        <div ref={blocksRef} className="flex flex-col gap-4 md:gap-5">
          {services.map((service, index) => (
            <a
              key={service.title}
              href="#contact"
              className={cn(
                "group block rounded-xl border p-6 sm:p-8 md:p-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                blocksVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                service.highlighted
                  ? "border-forge-accent/20 bg-forge-accent/[0.03] hover:border-forge-accent/35 hover:bg-forge-accent/[0.05]"
                  : "border-forge-divider bg-forge-surface/40 hover:border-forge-border hover:bg-forge-surface/70"
              )}
              style={{ transitionDelay: blocksVisible ? `${index * 100}ms` : "0ms" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 items-start">
                {/* Left Column — Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[13px] font-mono text-forge-text-secondary/30 tracking-wider">
                      {service.number}
                    </span>
                    <h3 className="text-[22px] md:text-[26px] font-bold text-forge-text tracking-[-0.02em] font-syne">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-[15px] text-forge-accent/50 font-curvy text-[14px] mb-3">
                    {service.tagline}
                  </p>

                  <p className="text-[15px] text-forge-text-secondary/80 leading-[1.7] max-w-[420px]">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span
                      className={cn(
                        "text-[20px] font-bold tracking-tight font-tabular-nums",
                        service.highlighted ? "text-forge-accent" : "text-forge-text"
                      )}
                    >
                      {service.price}
                    </span>
                    <span className="text-[12px] text-forge-text-secondary/40 tracking-wide">
                      {service.priceNote}
                    </span>
                  </div>
                </div>

                {/* Right Column — Features */}
                <div className="flex flex-col">
                  <ul className="space-y-2.5">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-[14px] text-forge-text-secondary/70"
                      >
                        <span
                          className={cn(
                            "w-1 h-1 rounded-full flex-shrink-0",
                            service.highlighted
                              ? "bg-forge-accent/50"
                              : "bg-forge-text-secondary/20"
                          )}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Link */}
                  <div className="mt-7">
                    <span className="inline-flex items-center gap-2 text-[13px] font-medium text-forge-text-secondary/50 tracking-wide transition-colors duration-300 group-hover:text-forge-accent/80">
                      {service.cta}
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
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

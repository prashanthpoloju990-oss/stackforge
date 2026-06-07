"use client";

import { useSlideReveal } from "@/hooks/use-slide-reveal";
import { cn } from "@/lib/utils";

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
    highlighted: true,
  },
  {
    title: "Bag",
    description:
      "End-to-end product development for brands that demand precision and performance.",
    price: "Custom Pricing",
    features: [
      "Full Product Development",
      "Strategy + Design + Dev",
      "Advanced Features",
      "Long-Term Support",
      "Priority Delivery",
    ],
    highlighted: false,
  },
];

export function SlideServices() {
  const { ref, isVisible } = useSlideReveal({ threshold: 0.15 });

  const scrollToCta = () => {
    const container = document.querySelector(".scroll-snap-container");
    if (!container) return;
    const slides = container.querySelectorAll(".story-slide");
    if (slides.length >= 7) {
      const target = slides[6] as HTMLElement;
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" ref={ref} className="story-slide overflow-hidden">
      <div className="mx-auto max-w-[1100px] w-full px-6 md:px-20">
        {/* Section eyebrow */}
        <span
          className={cn(
            "block text-[13px] text-forge-text-secondary font-medium tracking-[0.12em] uppercase mb-8 md:mb-12 font-mono",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "0ms" }}
        >
          Services
        </span>

        {/* Three tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, index) => (
            <button
              key={service.title}
              onClick={scrollToCta}
              className={cn(
                "group text-left rounded-xl border p-6 md:p-7 transition-all duration-500 ease-out cursor-pointer hover:-translate-y-1",
                isVisible ? "animate-story-fade-up" : "opacity-0",
                service.highlighted
                  ? "border-forge-accent/30 bg-forge-surface hover:border-forge-accent/60"
                  : "border-forge-divider bg-forge-surface/50 hover:border-forge-border"
              )}
              style={{ animationDelay: `${150 + index * 150}ms` }}
            >
              {/* Accent dot for highlighted */}
              {service.highlighted && (
                <div className="w-2 h-2 rounded-full bg-forge-accent mb-4" />
              )}

              {/* Tier name */}
              <h3
                className={cn(
                  "text-[20px] md:text-[22px] font-semibold tracking-[-0.02em] font-syne",
                  service.highlighted ? "text-forge-accent" : "text-forge-text"
                )}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-[14px] text-forge-text-secondary leading-[1.65]">
                {service.description}
              </p>

              {/* Price */}
              <div className="mt-5">
                <span
                  className={cn(
                    "text-[14px] font-semibold tracking-tight font-mono",
                    service.highlighted
                      ? "text-forge-accent"
                      : "text-forge-text"
                  )}
                >
                  {service.price}
                </span>
              </div>

              {/* Features */}
              <ul className="mt-5 space-y-2.5">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-[13px] text-forge-text-secondary"
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

              {/* CTA arrow */}
              <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-forge-text-secondary/60 group-hover:text-forge-text transition-colors duration-200">
                Learn more
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
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

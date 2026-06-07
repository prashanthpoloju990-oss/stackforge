"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "StackForge delivered our fintech platform in 6 weeks flat. The performance is incredible — our Core Web Vitals jumped to 98, and our conversion rate increased 3.2× within the first month.",
    name: "Arjun Mehta",
    role: "Founder, NovaPay",
    featured: true,
  },
  {
    quote:
      "They understood our vision from the first call. Clean code, zero bugs, and they actually hit every deadline. Rare find.",
    name: "Priya Sharma",
    role: "CTO, ElevateHR",
    featured: false,
  },
  {
    quote:
      "After the redesign, our table reservations went up 140%. The ROI was obvious within weeks. Best investment this year.",
    name: "Rahul Verma",
    role: "CEO, DineFine",
    featured: false,
  },
];

export function Testimonials() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({
    threshold: 0.05,
  });

  const featured = testimonials[0];
  const rest = testimonials.slice(1);

  return (
    <section className="py-24 md:py-32 lg:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "mb-14 md:mb-20 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-curvy">
            Client Words
          </span>
          <h2 className="text-[30px] md:text-[42px] lg:text-[48px] font-bold leading-[1.06] tracking-[-0.035em] text-forge-text max-w-[500px] font-playfair">
            Don&apos;t take our word
            <br className="hidden md:block" />
            <span className="font-curvy text-forge-accent/70 text-[0.88em]"> for it.</span>
          </h2>
        </div>

        {/* Featured Testimonial */}
        <div
          ref={cardsRef}
          className={cn(
            "mb-6 md:mb-8 transition-all duration-700 ease-out",
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="border border-forge-accent/15 bg-forge-accent/[0.02] rounded-xl p-8 md:p-12 lg:p-14 relative">
            {/* Large quote */}
            <span className="absolute top-6 left-8 md:left-12 text-forge-accent/10 text-[80px] md:text-[100px] leading-none font-curvy block select-none pointer-events-none">
              &ldquo;
            </span>

            <div className="relative">
              <blockquote className="text-[18px] md:text-[22px] lg:text-[26px] text-forge-text/90 leading-[1.6] font-playfair max-w-[800px]">
                {featured.quote}
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-forge-accent/10 flex items-center justify-center">
                  <span className="text-[14px] font-bold text-forge-accent/80">
                    {featured.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-[15px] text-forge-text font-semibold">
                    {featured.name}
                  </p>
                  <p className="text-[13px] text-forge-text-secondary/50">
                    {featured.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smaller testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {rest.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                "bg-forge-surface/30 border border-forge-divider rounded-xl p-6 md:p-8 card-hover",
                cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{
                transitionDelay: cardsVisible ? `${(index + 1) * 120}ms` : "0ms",
              }}
            >
              <blockquote className="text-[15px] md:text-[16px] text-forge-text-secondary/70 leading-[1.7]">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-5 pt-4 border-t border-forge-divider/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-forge-surface flex items-center justify-center">
                  <span className="text-[12px] font-bold text-forge-text-secondary/40">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] text-forge-text font-medium">
                    {testimonial.name}
                  </p>
                  <p className="text-[12px] text-forge-text-secondary/40">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

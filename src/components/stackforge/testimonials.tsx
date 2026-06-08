"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { BorderGlow } from "@/components/ui/border-glow";

const testimonials = [
  {
    quote:
      "StackForge delivered our fintech platform in 6 weeks flat. The performance is incredible — our Core Web Vitals jumped to 98, and our conversion rate increased 3.2× within the first month.",
    name: "Arjun Mehta",
    role: "Founder, NovaPay",
    avatar: "/avatars/arjun.jpg",
    featured: true,
    rating: 5,
    initials: "NP",
    companyColor: "#FF6A00",
  },
  {
    quote:
      "They understood our vision from the first call. Clean code, zero bugs, and they actually hit every deadline. Rare find.",
    name: "Priya Sharma",
    role: "CTO, ElevateHR",
    avatar: "/avatars/priya.jpg",
    featured: false,
    rating: 5,
    initials: "EH",
    companyColor: "#6366F1",
  },
  {
    quote:
      "After the redesign, our table reservations went up 140%. The ROI was obvious within weeks. Best investment this year.",
    name: "Rahul Verma",
    role: "CEO, DineFine",
    avatar: "/avatars/rahul.jpg",
    featured: false,
    rating: 5,
    initials: "DF",
    companyColor: "#10B981",
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
            "mb-14 md:mb-20 transition-all duration-600 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          )}
        >
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
            Client Words
          </span>
          <h2 className="text-fluid-h1 font-bold text-forge-text max-w-[500px] font-playfair">
            Don&apos;t take our word for it.
          </h2>
        </div>

        {/* Featured Testimonial */}
        <div
          ref={cardsRef}
          className={cn(
            "mb-6 md:mb-8 transition-all duration-600 ease-out",
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          )}
        >
          <BorderGlow
            animated
            backgroundColor="var(--forge-bg)"
            borderRadius={12}
            glowRadius={35}
            glowIntensity={1.2}
            className="rounded-xl"
          >
            <div className="p-8 md:p-12 lg:p-14 relative">
              {/* Large quote */}
              <span className="absolute top-6 left-8 md:left-12 text-forge-accent/8 text-fluid-display font-playfair block select-none pointer-events-none">
                &ldquo;
              </span>

              <div className="relative">
                {/* Star rating */}
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5"
                      fill={i < featured.rating ? "var(--forge-accent)" : "none"}
                      stroke={i < featured.rating ? "var(--forge-accent)" : "var(--forge-divider)"}
                    />
                  ))}
                </div>
                <blockquote className="text-fluid-h2 text-forge-text/90 font-playfair max-w-[800px]">
                  {featured.quote}
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-forge-accent/20 shrink-0">
                    <Image
                      src={featured.avatar}
                      alt={featured.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      backgroundColor: featured.companyColor + "15",
                      color: featured.companyColor,
                    }}
                  >
                    {featured.initials}
                  </div>
                  <div>
                    <p className="text-fluid-body-lg text-forge-text font-semibold">
                      {featured.name}
                    </p>
                    <p className="text-[13px] text-forge-text-secondary/50">
                      {featured.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* Smaller testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {rest.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                "transition-all duration-600 ease-out",
                cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              )}
              style={{
                transitionDelay: cardsVisible ? `${(index + 1) * 100}ms` : "0ms",
              }}
            >
              <BorderGlow
                backgroundColor="var(--forge-bg)"
                borderRadius={12}
                glowRadius={30}
                glowIntensity={1.0}
                className="rounded-xl h-full"
              >
                <div className="p-6 md:p-8">
                  {/* Star rating */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5"
                        fill={i < testimonial.rating ? "var(--forge-accent)" : "none"}
                        stroke={i < testimonial.rating ? "var(--forge-accent)" : "var(--forge-divider)"}
                      />
                    ))}
                  </div>
                  <blockquote className="text-fluid-body-lg text-forge-text-secondary/70">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="mt-5 pt-4 border-t border-forge-divider/50 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-forge-divider/40 shrink-0">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{
                        backgroundColor: testimonial.companyColor + "15",
                        color: testimonial.companyColor,
                      }}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-fluid-body text-forge-text font-medium">
                        {testimonial.name}
                      </p>
                      <p className="text-[12px] text-forge-text-secondary/40">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { BorderGlow } from "@/components/ui/border-glow";
import { useState, useEffect, useCallback, useRef } from "react";

const testimonials = [
  {
    quote:
      "StackForge delivered our fintech platform in 6 weeks flat. The performance is incredible — our Core Web Vitals jumped to 98, and our conversion rate increased 3.2× within the first month.",
    name: "Arjun Mehta",
    role: "Founder, NovaPay",
    avatar: "/avatars/arjun.jpg",
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
    rating: 5,
    initials: "DF",
    companyColor: "#10B981",
  },
];

const SLIDE_INTERVAL = 5000;

export function Testimonials() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({
    threshold: 0.05,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((prev) => {
        // Wrap around
        if (index < 0) return total - 1;
        if (index >= total) return 0;
        return index;
      });
    },
    [total]
  );

  const goNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // Auto-rotation
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, total]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleDotClick = (index: number) => {
    goTo(index);
    // Pause briefly after manual interaction
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const handleArrowClick = (direction: "prev" | "next") => {
    if (direction === "prev") goPrev();
    else goNext();
    // Pause briefly after manual interaction
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  // Touch swipe support
  const touchStartRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleArrowClick("next");
      else handleArrowClick("prev");
    }
    touchStartRef.current = null;
  };

  const current = testimonials[currentIndex];

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

        {/* Carousel */}
        <div
          ref={cardsRef}
          className={cn(
            "transition-all duration-600 ease-out",
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          )}
        >
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Prev Arrow */}
            <button
              onClick={() => handleArrowClick("prev")}
              aria-label="Previous testimonial"
              className="absolute left-2 md:-left-14 lg:-left-16 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full border border-forge-divider/60 bg-forge-bg/80 backdrop-blur-sm flex items-center justify-center text-forge-text-secondary hover:text-forge-text hover:border-forge-accent/40 transition-colors duration-200 hover:scale-105 active:scale-95"
              style={{ transitionProperty: "color, border-color, transform" }}
            >
              <ChevronLeft className="size-4 md:size-5" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={() => handleArrowClick("next")}
              aria-label="Next testimonial"
              className="absolute right-2 md:-right-14 lg:-right-16 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full border border-forge-divider/60 bg-forge-bg/80 backdrop-blur-sm flex items-center justify-center text-forge-text-secondary hover:text-forge-text hover:border-forge-accent/40 transition-colors duration-200 hover:scale-105 active:scale-95"
              style={{ transitionProperty: "color, border-color, transform" }}
            >
              <ChevronRight className="size-4 md:size-5" />
            </button>

            {/* Slide Container */}
            <div
              className="overflow-hidden rounded-xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex will-change-transform"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="w-full shrink-0">
                    <BorderGlow
                      animated={false}
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
                                fill={i < testimonial.rating ? "var(--forge-accent)" : "none"}
                                stroke={i < testimonial.rating ? "var(--forge-accent)" : "var(--forge-divider)"}
                              />
                            ))}
                          </div>
                          <blockquote className="text-fluid-h2 text-forge-text/90 font-playfair max-w-[800px]">
                            {testimonial.quote}
                          </blockquote>
                          <div className="mt-8 flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full overflow-hidden border border-forge-accent/20 shrink-0">
                              <Image
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                width={44}
                                height={44}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                              style={{
                                backgroundColor: testimonial.companyColor + "15",
                                color: testimonial.companyColor,
                              }}
                            >
                              {testimonial.initials}
                            </div>
                            <div>
                              <p className="text-fluid-body-lg text-forge-text font-semibold">
                                {testimonial.name}
                              </p>
                              <p className="text-[13px] text-forge-text-secondary/50">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </BorderGlow>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-2.5 mt-6 md:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={cn(
                    "rounded-full transition-all duration-300 ease-out",
                    index === currentIndex
                      ? "w-8 h-2.5 bg-forge-accent"
                      : "w-2.5 h-2.5 bg-forge-divider/60 hover:bg-forge-text-secondary/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

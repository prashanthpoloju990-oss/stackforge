"use client";

import Image from "next/image";
import { useSlideReveal } from "@/hooks/use-slide-reveal";
import { cn } from "@/lib/utils";

export function SlideHero() {
  const { ref, isVisible } = useSlideReveal({ threshold: 0.1 });

  const scrollToNext = () => {
    const container = document.querySelector(".scroll-snap-container");
    if (!container) return;
    container.scrollTo({
      top: container.clientHeight,
      behavior: "smooth",
    });
  };

  return (
    <section id="hero" ref={ref} className="story-slide relative overflow-hidden">
      {/* Dot grid background */}
      <div className="hero-dots absolute inset-0 pointer-events-none" />

      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 60% 50%, rgba(255, 106, 0, 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[900px] w-full px-6 md:px-20 text-center">
        {/* Logo */}
        <div
          className={cn(
            "flex justify-center mb-8 md:mb-10",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "0ms" }}
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden relative">
            <Image
              src="/logo.jpg"
              alt="StackForge"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Massive Headline */}
        <h1
          className={cn(
            "text-[32px] sm:text-[44px] md:text-[60px] lg:text-[72px] font-bold leading-[1.05] tracking-[-0.03em] text-forge-text font-syne",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "120ms" }}
        >
          High-performance websites
          <br />
          <span className="text-forge-text-secondary">for ambitious brands.</span>
        </h1>

        {/* Dancing Script subtitle */}
        <p
          className={cn(
            "mt-5 md:mt-6 text-[18px] md:text-[22px] text-forge-accent font-dancing",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "280ms" }}
        >
          Web Development Studio — Hyderabad
        </p>

        {/* Tagline */}
        <p
          className={cn(
            "mt-4 text-[15px] md:text-[16px] text-forge-text-secondary/70 leading-relaxed max-w-[520px] mx-auto",
            isVisible ? "animate-story-fade-up" : "opacity-0"
          )}
          style={{ animationDelay: "400ms" }}
        >
          We engineer conversion-focused websites for startups, agencies, and SaaS brands — built with React and Next.js for speed, scale, and SEO.
        </p>

        {/* Scroll indicator */}
        <div
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2",
            isVisible ? "animate-story-fade-in" : "opacity-0"
          )}
          style={{ animationDelay: "800ms" }}
        >
          <span className="text-[11px] text-forge-text-secondary/40 font-mono tracking-widest uppercase">
            Scroll
          </span>
          <button
            onClick={scrollToNext}
            className="animate-scroll-bounce cursor-pointer"
            aria-label="Scroll to next section"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-forge-text-secondary/50"
            >
              <path
                d="M10 4V16M10 16L4 10M10 16L16 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

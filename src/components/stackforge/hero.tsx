"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { HeroVisual } from "./hero-visual";
import { AnimatedShaderBackground } from "@/components/ui/animated-shader-background";
import { MagneticWrapper } from "@/components/ui/magnetic-button";
import { BlobButton } from "@/components/ui/blob-button";

function useCountUp(end: number, duration: number = 2000, startOnMount: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, started]);

  useEffect(() => {
    if (startOnMount && !started) {
      const timer = setTimeout(start, 1000);
      return () => clearTimeout(timer);
    }
  }, [startOnMount, start, started]);

  return { count, start };
}

function CounterStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count } = useCountUp(value);

  return (
    <div className="flex flex-col">
      <span className="text-fluid-h2 font-bold text-forge-text tracking-tight font-tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-fluid-label text-forge-text-secondary/50 tracking-[0.06em] mt-0.5">
        {label}
      </span>
    </div>
  );
}

/* Trust logos strip */
const TRUST_LOGOS = [
  "NovaPay",
  "ElevateHR",
  "DineFine",
  "Vertex",
  "CloudSync",
];

/* Each word gets a unique depth multiplier so they shift at different rates */
const KINETIC_WORDS = [
  { text: "We build.", depth: 1.0, accent: false },
  { text: "You grow.", depth: 1.8, accent: true },
];

function KineticHeadline({ mounted }: { mounted: boolean }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const rafId = useRef<number | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      mouse.current = {
        x: e.clientX / vw,
        y: e.clientY / vh,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const STRENGTH = 14; // max degrees of tilt
    const LIFT = 8;     // max px vertical lift

    const tick = () => {
      const mx = mouse.current.x - 0.5; // -0.5 → 0.5
      const my = mouse.current.y - 0.5;

      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = KINETIC_WORDS[i]?.depth ?? 1;
        const rotY = mx * STRENGTH * d;
        const rotX = -my * STRENGTH * 0.5 * d;
        const ty = -my * LIFT * d;
        el.style.transform = `perspective(600px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(${ty}px)`;
      });

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <h1
      ref={containerRef}
      className={`text-fluid-display font-extrabold text-forge-text font-syne transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 select-none ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Line 1: "We build." */}
      <span className="block">
        <span
          ref={(el) => { wordRefs.current[0] = el; }}
          className="inline-block transition-transform duration-[60ms] ease-out will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          We build.
        </span>
      </span>
      {/* Line 2: "You grow." in accent */}
      <span className="block mt-1">
        <span
          ref={(el) => { wordRefs.current[1] = el; }}
          className="inline-block text-forge-accent font-curvy text-[0.82em] transition-transform duration-[60ms] ease-out will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          You grow.
        </span>
      </span>
    </h1>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-[92dvh] pt-16 md:pt-[72px] overflow-hidden"
    >
      {/* Shader aurora background */}
      <AnimatedShaderBackground
        className="absolute inset-0 shader-bg"
        opacity={0.9}
        mixBlendMode="screen"
      />

      {/* Ambient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(255, 106, 0, 0.04)",
        }}
      />

      <div className="mx-auto max-w-[1200px] w-full px-6 md:px-20 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT — Copy */}
          <div className="flex flex-col items-start">
            {/* Kinetic Headline */}
            <KineticHeadline mounted={mounted} />

            {/* Subline */}
            <p
              className={`mt-5 text-fluid-body-lg text-forge-text-secondary/80 max-w-[440px] transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              }`}
            >
              React &amp; Next.js specialists. We build fast, scalable, SEO-ready
              digital products for startups and growing brands.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-start gap-3 mt-9 md:mt-10 transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              }`}
            >
              <MagneticWrapper>
                <BlobButton
                  asChild
                  variant="popular"
                  className="btn-primary inline-flex items-center justify-center h-fluid-btn px-fluid-btn bg-forge-accent text-white text-fluid-btn font-semibold uppercase rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <a href="/start-project">
                    Start a Project
                  </a>
                </BlobButton>
              </MagneticWrapper>

              <MagneticWrapper>
                <BlobButton
                  asChild
                  variant="normal"
                  className="btn-secondary inline-flex items-center justify-center h-fluid-btn px-fluid-btn border border-forge-border text-forge-text-secondary text-fluid-btn font-medium uppercase rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <a href="#work">
                    See Our Work
                  </a>
                </BlobButton>
              </MagneticWrapper>
            </div>

            {/* Trust indicators */}
            <div
              className={`flex items-center gap-4 sm:gap-7 mt-11 transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[400ms] overflow-x-auto scrollbar-none ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              }`}
            >
              <CounterStat value={10} suffix="+" label="Projects Delivered" />
              <div className="w-px h-9 bg-forge-divider shrink-0" />
              <CounterStat value={99} suffix=".9%" label="Uptime SLA" />
              <div className="w-px h-9 bg-forge-divider shrink-0" />
              <CounterStat value={24} suffix="h" label="Avg. Response" />
            </div>
          </div>

          {/* RIGHT — Abstract Visual */}
          <div className="relative hidden md:block">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* Trust logos strip — subtle */}
      <div
        className={`absolute bottom-0 left-0 right-0 border-t border-forge-divider/60 transition-all duration-1000 delay-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-20 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-fluid-micro text-forge-text-secondary/30 tracking-[0.1em] uppercase font-mono">
            Trusted by
          </span>
          <div className="flex items-center gap-8 sm:gap-10">
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="text-fluid-label text-forge-text-secondary/25 tracking-[0.04em] font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSlideReveal } from "@/hooks/use-slide-reveal";
import { cn } from "@/lib/utils";

function useCountUp(end: number, duration: number = 2000, startOnMount: boolean = false) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, started]);

  return { count, ref, start };
}

const stats = [
  {
    value: 50,
    suffix: "+",
    label: "Projects Delivered",
    description: "Websites, apps, and digital products shipped worldwide",
  },
  {
    value: 99.9,
    suffix: "%",
    label: "Uptime Guaranteed",
    description: "Rock-solid infrastructure and deployment pipelines",
  },
  {
    value: 24,
    suffix: "h",
    label: "Response Time",
    description: "Fast, reliable communication on every project",
  },
];

export function SlideStats() {
  const { ref, isVisible } = useSlideReveal({ threshold: 0.2 });

  const counter1 = useCountUp(50, 2000);
  const counter2 = useCountUp(99.9, 2500);
  const counter3 = useCountUp(24, 1800);

  useEffect(() => {
    if (isVisible) {
      counter1.start();
      counter2.start();
      counter3.start();
    }
  }, [isVisible]);

  return (
    <section id="stats" ref={ref} className="story-slide overflow-hidden">
      <div className="mx-auto max-w-[1100px] w-full px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {stats.map((stat, index) => {
            const counter = [counter1, counter2, counter3][index];
            const isDecimal = stat.value % 1 !== 0;

            return (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col items-center text-center",
                  index > 0 && "md:border-l md:border-forge-divider",
                  index === 1 && "md:px-10",
                  index === 2 && "md:pl-10",
                  isVisible ? "animate-story-fade-up" : "opacity-0"
                )}
                style={{ animationDelay: `${100 + index * 200}ms` }}
              >
                {/* Big number */}
                <span
                  ref={counter.ref}
                  className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[72px] font-bold tracking-[-0.03em] text-forge-text font-syne tabular-nums"
                >
                  {isDecimal ? counter.count.toFixed(1) : counter.count}
                  <span className="text-forge-accent">{stat.suffix}</span>
                </span>

                {/* Label */}
                <span className="mt-2 text-[13px] md:text-[14px] font-mono text-forge-text-secondary tracking-wide uppercase">
                  {stat.label}
                </span>

                {/* Description */}
                <span className="mt-3 text-[13px] text-forge-text-secondary/50 leading-relaxed max-w-[240px]">
                  {stat.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

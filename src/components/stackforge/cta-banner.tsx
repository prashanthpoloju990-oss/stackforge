"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function CtaBanner() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="relative flex min-h-[80vh] md:h-[90vh] w-full items-center justify-center overflow-hidden border-y border-forge-divider bg-black">
      {/* Structural Grid lines - responsive */}
      <div className="absolute inset-0 z-10 size-full pointer-events-none opacity-20 dark:opacity-40">
        <div className="grid w-full h-full grid-cols-6 md:grid-cols-12 divide-x divide-white/10">
          <div className="col-span-1 h-full" />
          <div className="col-span-1 h-full" />
          <div className="col-span-1 h-full" />
          <div className="col-span-1 h-full" />
          <div className="col-span-1 h-full" />
          <div className="col-span-1 h-full" />
          <div className="hidden md:block col-span-1 h-full" />
          <div className="hidden md:block col-span-1 h-full" />
          <div className="hidden md:block col-span-1 h-full" />
          <div className="hidden md:block col-span-1 h-full" />
          <div className="hidden md:block col-span-1 h-full" />
          <div className="hidden md:block col-span-1 h-full" />
        </div>
      </div>

      {/* Immersive background image with parallax and overlay */}
      <div
        className="absolute inset-0 bg-center bg-cover scale-105 transition-transform duration-[10s] ease-out hover:scale-100"
        style={{
          backgroundImage:
            "url(https://images.cnippet.dev/image/upload/v1770400411/img_14002.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-black/60 md:bg-black/50" />
      </div>

      {/* Content */}
      <div
        ref={ref}
        className={cn(
          "relative z-20 max-w-5xl px-6 text-center text-white transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Eyebrow */}
        <span className="text-[12px] text-forge-accent font-medium tracking-[0.16em] uppercase mb-6 block font-mono">
          Ready to Elevate?
        </span>

        {/* Title */}
        <h2 className="text-center font-playfair font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-tight mb-6">
          Your Next Website Should <br />
          <span className="text-[#e1fcad]">Actually Perform.</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mb-10 max-w-2xl text-center font-light text-base md:text-lg text-white/80 leading-relaxed">
          Stop settling for slow, generic templates. Let&apos;s build a custom, speed-optimized 
          Next.js experience designed to capture leads, rank on Google, and grow your brand.
        </p>

        {/* Action Button */}
        <Link href="/start-project" className="inline-block group focus:outline-none">
          <Button className="group not-disabled:inset-shadow-none mx-auto flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent px-0 py-5 font-normal shadow-none hover:bg-transparent [:hover,[data-pressed]]:bg-transparent">
            <span className="rounded-full bg-[#e1fcad] px-6 py-3.5 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors text-sm font-semibold uppercase tracking-wider">
              Start a Project
            </span>
            <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-[#e1fcad] p-5.5 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
              <ArrowUpRight className="absolute h-5 w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
              <ArrowUpRight className="absolute h-5 w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
            </div>
          </Button>
        </Link>
      </div>
    </section>
  );
}

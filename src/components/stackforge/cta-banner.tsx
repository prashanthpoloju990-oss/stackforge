"use client";

import {
  ContainerAnimated,
  ContainerStagger,
  GalleryGrid,
  GalleryGridCell,
} from "@/components/ui/cta-section-with-gallery";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const IMAGES = [
  "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1733680958774-39a0e8a64a54?q=80&w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548783307-f63adc3f200b?q=80&w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1703622377707-29bc9409aaf2?q=80&w=600&auto=format&fit=crop&q=80",
];

export function CtaBanner() {
  return (
    <section className="relative w-full bg-black overflow-hidden py-24 md:py-32 flex items-center justify-center">
      {/* Top smooth gradient fade */}
      <div 
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, var(--forge-bg) 0%, rgba(0,0,0,0) 100%)"
        }}
      />

      {/* Bottom smooth gradient fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, var(--forge-bg) 0%, rgba(0,0,0,0) 100%)"
        }}
      />

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

      <div className="relative z-20 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 md:px-20 md:grid-cols-2">
        <ContainerStagger className="flex flex-col items-start text-left">
          <ContainerAnimated className="mb-4 block text-xs font-semibold text-forge-accent tracking-[0.16em] uppercase font-mono">
            Innovate & Grow
          </ContainerAnimated>
          <ContainerAnimated className="text-3xl sm:text-4xl md:text-[2.4rem] font-bold tracking-tight text-white leading-tight font-playfair">
            Scale Your Business <br className="hidden sm:block" />
            Through <span className="text-forge-accent font-syne font-extrabold">Innovation.</span>
          </ContainerAnimated>
          <ContainerAnimated className="my-6 text-fluid-body-lg text-white/70 leading-relaxed max-w-[480px]">
            Transform your startup&apos;s potential through innovative solutions
            and strategic growth. We help businesses adapt, evolve, and thrive
            in today&apos;s competitive marketplace.
          </ContainerAnimated>
          <ContainerAnimated>
            <Link href="/start-project" passHref>
              <Button className="bg-forge-accent hover:bg-forge-accent/90 text-white font-semibold uppercase tracking-wider text-[12px] h-fluid-btn px-fluid-btn rounded-lg cursor-pointer active:scale-95 transition-all">
                Start Scaling Today
              </Button>
            </Link>
          </ContainerAnimated>
        </ContainerStagger>

        <GalleryGrid className="w-full max-w-[460px] mx-auto md:mr-0">
          {IMAGES.map((imageUrl, index) => (
            <GalleryGridCell index={index} key={index} className="border border-white/10">
              <img
                className="size-full object-cover object-center transition-transform duration-500 hover:scale-105"
                width="100%"
                height="100%"
                src={imageUrl}
                alt={`StackForge Studio Gallery ${index + 1}`}
              />
            </GalleryGridCell>
          ))}
        </GalleryGrid>
      </div>
    </section>
  );
}

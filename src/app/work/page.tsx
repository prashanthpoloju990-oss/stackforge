"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { StickyCta } from "@/components/stackforge/sticky-cta";
import { SignalButton } from "@/components/ui/signal-button";
import { projects } from "@/lib/projects-data";

export default function WorkPage() {

  return (
    <div className="min-h-screen flex flex-col bg-forge-bg">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />
      <ScrollProgress />

      <main id="main-content" className="flex-1 pt-28 md:pt-36 pb-24 md:pb-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-20">
          
          {/* Header */}
          <div className="mb-14 md:mb-16">
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              Portfolio
            </span>
            <h1 className="text-fluid-display font-bold text-forge-text font-playfair mb-6">
              Our <span className="text-forge-accent/70">Projects</span>
            </h1>
            <p className="text-fluid-body-lg text-forge-text-secondary/60 max-w-[600px] leading-relaxed">
              Explore our full collection of speed-optimized, conversion-focused websites and applications. We construct bespoke interfaces tailored for performance.
            </p>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="group block rounded-xl border border-forge-divider bg-forge-surface/30 overflow-hidden card-hover transition-all duration-300 hover:-translate-y-1 hover:border-forge-accent/25 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/9.2] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  
                  {/* Metric badge */}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-baseline gap-1 bg-black/75 backdrop-blur-sm rounded px-2.5 py-1 border border-white/10">
                      <span className="text-[14px] font-bold text-forge-accent font-tabular-nums">
                        {project.metric}
                      </span>
                      <span className="text-[10px] text-white/70">{project.metricLabel}</span>
                    </div>
                  </div>
                  
                  {/* Arrow icon — top right, opens case study page */}
                  <Link
                    href={`/work/${project.slug}`}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/20 backdrop-blur-sm bg-white/10 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-forge-accent/80 hover:border-forge-accent/80 cursor-pointer"
                    aria-label={`View ${project.title} case study`}
                  >
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="text-white">
                      <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-forge-text-secondary/50 tracking-[0.08em] uppercase font-mono mb-1">
                        {project.subtitle}
                      </p>
                      <h3 className="text-[18px] md:text-[20px] font-bold text-forge-text font-syne leading-tight">
                        {project.title}
                      </h3>
                    </div>
                    <Link
                      href={`/work/${project.slug}`}
                      className="shrink-0 w-8 h-8 rounded-full border border-forge-divider flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 group-hover:border-forge-accent/30 mt-0.5 cursor-pointer hover:bg-forge-accent/10"
                      aria-label={`View ${project.title} case study`}
                    >
                      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="text-forge-accent/70">
                        <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>

                  <p className="mt-2 text-[13px] text-forge-text-secondary/60 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap items-center gap-1 mt-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide text-forge-text-secondary/60 bg-forge-bg/80 border border-forge-divider/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Case Study Link */}
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-1 text-forge-accent text-[12px] font-medium mt-3.5 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:gap-2 cursor-pointer"
                  >
                    View Case Study
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <BackToTop />
      <SignalButton />
      <CookieConsent />
      <StickyCta />


    </div>
  );
}

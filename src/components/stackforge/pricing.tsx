"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { CreativePricing } from "@/components/ui/creative-pricing";
import type { PricingTier } from "@/components/ui/creative-pricing";
import { Rocket, Zap, Layers } from "lucide-react";

const tiers: PricingTier[] = [
  {
    name: "Launch Kit",
    icon: <Rocket className="w-6 h-6" />,
    price: "₹15K",
    priceNote: "starting at",
    description: "Fast, clean websites for MVPs and early-stage startups.",
    colorClass: "text-forge-accent/70",
    features: [
      "1–5 responsive pages",
      "Mobile-first design",
      "Performance optimized",
      "Basic SEO & analytics",
      "2 rounds of revisions",
    ],
  },
  {
    name: "Growth Pack",
    icon: <Zap className="w-6 h-6" />,
    price: "₹80K",
    priceNote: "starting at",
    description: "Custom design, backend integration, and scalable features.",
    colorClass: "text-forge-accent",
    popular: true,
    features: [
      "Custom UI/UX design",
      "CMS & admin dashboard",
      "API integrations",
      "Advanced SEO strategy",
      "3 months post-launch support",
    ],
  },
  {
    name: "Enterprise Bag",
    icon: <Layers className="w-6 h-6" />,
    price: "Custom",
    priceNote: "tailored scope",
    description: "End-to-end product dev for teams that demand precision.",
    colorClass: "text-forge-text-secondary",
    features: [
      "Full product development",
      "Strategy & architecture",
      "Advanced auth & security",
      "Dedicated project lead",
      "Priority delivery & SLA",
    ],
  },
];

export function Pricing() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="pricing" className="relative py-24 md:py-32 lg:py-[110px] overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className={cn(
            "mb-16 md:mb-20 transition-all duration-600 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
            Pricing
          </span>
          <h2 className="text-fluid-h1 font-bold text-forge-text font-playfair max-w-[600px]">
            Structured for every
            <br className="hidden md:block" />
            {" "}
            <span className="text-forge-accent/80">stage of growth.</span>
          </h2>
          <p className="text-fluid-body-lg text-forge-text-secondary/60 mt-4 max-w-[480px]">
            No hidden fees. Pick a plan that matches your ambition, or let&apos;s
            build something custom.
          </p>
        </div>

        {/* ── Pricing Cards ── */}
        <div
          ref={cardsRef}
          className={cn(
            "transition-all duration-600 ease-out",
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          )}
        >
          <CreativePricing tiers={tiers} />
        </div>
      </div>
    </section>
  );
}

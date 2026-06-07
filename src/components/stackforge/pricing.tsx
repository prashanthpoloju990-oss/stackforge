"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Launch Kit",
    description:
      "A fast, clean website to get your business online. Perfect for MVPs, personal brands, and early-stage startups.",
    price: 15000,
    retainerPrice: 5000,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    includes: [
      "What's included:",
      "1–5 responsive pages",
      "Mobile-first design",
      "Performance optimized",
      "Basic SEO & analytics",
      "2 rounds of revisions",
    ],
  },
  {
    name: "Growth Pack",
    description:
      "For brands that are growing. Custom design, backend integration, and everything your business needs to convert visitors.",
    price: 65000,
    retainerPrice: 20000,
    buttonText: "Start Building",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Launch, plus:",
      "Custom UI/UX design",
      "CMS & admin dashboard",
      "API integrations",
      "Advanced SEO strategy",
      "3 months post-launch support",
    ],
  },
  {
    name: "Enterprise Bag",
    description:
      "Full-stack product development. Strategy, architecture, advanced features — for teams that demand precision.",
    price: 150000,
    retainerPrice: 45000,
    buttonText: "Let's Talk",
    buttonVariant: "outline" as const,
    includes: [
      "Everything in Growth, plus:",
      "Full product development",
      "Strategy & architecture",
      "Advanced auth & security",
      "Dedicated project lead",
      "Priority delivery & SLA",
    ],
  },
];

const PricingSwitch = ({
  onSwitch,
}: {
  onSwitch: (value: string) => void;
}) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-forge-surface border border-forge-border p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors text-fluid-btn",
            selected === "0"
              ? "text-white"
              : "text-forge-text-secondary"
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-forge-accent/30 border-forge-accent bg-gradient-to-t from-[#e55f00] to-[#FF6A00]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">One-time</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors text-fluid-btn",
            selected === "1"
              ? "text-white"
              : "text-forge-text-secondary"
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-forge-accent/30 border-forge-accent bg-gradient-to-t from-[#e55f00] to-[#FF6A00]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Retainer
          </span>
        </button>
      </div>
    </div>
  );
};

export function Pricing() {
  const [isRetainer, setIsRetainer] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsRetainer(Number.parseInt(value) === 1);

  return (
    <section id="pricing" className="relative py-24 md:py-32 lg:py-[110px] overflow-hidden">
      {/* ── Background effects ── */}
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        {/* Grid pattern */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,var(--forge-divider)_1px,transparent_1px),linear-gradient(to_bottom,var(--forge-divider)_1px,transparent_1px)] bg-[size:70px_80px] opacity-50" />
        {/* Sparkles particles */}
        <Sparkles
          density={1200}
          direction="bottom"
          speed={0.8}
          color="var(--forge-accent)"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      {/* Glow orbs */}
      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0 pointer-events-none"
      >
        <div className="relative w-full h-full">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid rgba(255, 106, 0, 0.35)",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
          />
          <div
            className="absolute left-[-568px] right-[-568px] top-[200px] h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid rgba(255, 106, 0, 0.2)",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
          />
        </div>
      </TimelineContent>

      {/* Radial gradient overlay */}
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255, 106, 0, 0.06) 0%, transparent 70%)",
          opacity: 0.8,
          mixBlendMode: "multiply",
        }}
      />

      {/* ── Content ── */}
      <article
        className="text-center mb-6 pt-8 md:pt-16 max-w-3xl mx-auto space-y-4 relative z-50"
        ref={pricingRef}
      >
        {/* Eyebrow */}
        <TimelineContent
          as="span"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase font-mono block"
        >
          Pricing
        </TimelineContent>

        {/* Heading with text animation */}
        <h2 className="text-fluid-h1 font-bold text-forge-text font-playfair">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.12}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            Plans that fit your ambition.
          </VerticalCutReveal>
        </h2>

        {/* Subtitle */}
        <TimelineContent
          as="p"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-fluid-body-lg text-forge-text-secondary/60 max-w-[480px] mx-auto"
        >
          Transparent pricing. No hidden fees. Choose one-time or retainer —
          whichever works for your team.
        </TimelineContent>

        {/* Toggle */}
        <TimelineContent
          as="div"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      {/* ── Pricing Cards ── */}
      <div className="grid md:grid-cols-3 max-w-[1200px] gap-4 md:gap-5 py-8 mx-auto px-6 md:px-20 relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={3 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={cn(
                "relative border transition-all duration-500",
                plan.popular
                  ? "border-forge-accent/25 bg-forge-accent/[0.04] shadow-[0px_-13px_300px_0px_rgba(255,106,0,0.08)] z-20"
                  : "border-forge-divider bg-forge-surface/60 z-10 hover:border-forge-border"
              )}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between items-start">
                  <h3 className="text-fluid-h4 font-bold text-forge-text font-syne">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="text-fluid-label-sm font-medium text-forge-accent bg-forge-accent/10 border border-forge-accent/20 rounded-full px-3 py-1 uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline mt-2">
                  <span className="text-fluid-label text-forge-text-secondary/40 mr-0.5">
                    ₹
                  </span>
                  <NumberFlow
                    format={{
                      currency: "INR",
                      notation: "compact",
                      compactDisplay: "short",
                      maximumFractionDigits: 1,
                    }}
                    value={isRetainer ? plan.retainerPrice : plan.price}
                    className="text-fluid-hero font-bold text-forge-text font-tabular-nums"
                  />
                  <span className="text-fluid-label text-forge-text-secondary/40 ml-1.5">
                    K /{isRetainer ? "mo" : "project"}
                  </span>
                </div>

                <p className="text-fluid-body text-forge-text-secondary/60 mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <a
                  href="#contact"
                  className={cn(
                    "btn-primary w-full mb-6 flex items-center justify-center h-fluid-btn rounded-xl text-fluid-btn font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.98]",
                    plan.popular
                      ? "bg-forge-accent text-white shadow-lg shadow-forge-accent/20 border border-forge-accent"
                      : "bg-forge-bg border border-forge-border text-forge-text-secondary hover:text-forge-text hover:border-forge-text-secondary/30"
                  )}
                >
                  {plan.buttonText}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M1 7H13M13 7L8 2M13 7L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>

                <div className="space-y-3 pt-4 border-t border-forge-divider">
                  <h4 className="text-fluid-body font-medium text-forge-text/70">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2.5"
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full flex-shrink-0",
                            plan.popular
                              ? "bg-forge-accent/40"
                              : "bg-forge-text-secondary/20"
                          )}
                        />
                        <span className="text-fluid-body text-forge-text-secondary/70">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </section>
  );
}

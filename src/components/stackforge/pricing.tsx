"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { CreativePricing } from "@/components/ui/creative-pricing";
import type { PricingTier } from "@/components/ui/creative-pricing";
import { Rocket, Zap, Layers, Phone, CheckCircle2, ArrowRight, Sparkles, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const tiers: PricingTier[] = [
  {
    name: "Launch Kit",
    icon: <Rocket className="w-6 h-6" />,
    price: "₹1,999",
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
    price: "₹3,999",
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

function BookACallWidget() {
  const [stage, setStage] = useState<"phone" | "confirmed">("phone");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Discovery Call Lead",
          contact: contact.trim(),
          businessType: "Startup",
          serviceNeed: "Book a Discovery Call",
          budget: "Flexible",
          timeline: "Urgent (1–3 days)",
          details: `Client requested an urgent discovery call. Contact phone/email: ${contact}`,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.details ? `${data.error} - ${data.details}` : (data.error || "Invalid verification code.");
        throw new Error(errorMsg);
      }
      
      setStage("confirmed");
    } catch (err: any) {
      setError(err.message || "Failed to request call.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 md:mt-20 w-full max-w-[920px] mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-forge-surface/70 via-forge-surface/30 to-forge-bg border-2 border-forge-accent/30 shadow-[0_12px_40px_-10px_rgba(255,106,0,0.15)] relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-forge-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left max-w-[460px]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-accent/15 border border-forge-accent/30 text-forge-accent text-xs font-mono font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need Guidance?</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-forge-text font-playfair mb-3">
            Can&apos;t decide? <span className="text-forge-accent">Book a call!</span>
          </h3>
          <p className="text-sm md:text-base text-forge-text-secondary/70 leading-relaxed font-sans">
            Not sure which architecture or package fits your roadmap? Leave your phone number or email for a direct 15-minute discovery call with our team.
          </p>
        </div>

        <div className="w-full md:w-[360px] shrink-0 bg-forge-bg/90 border border-forge-divider p-6 rounded-2xl shadow-inner backdrop-blur-md">
          <AnimatePresence mode="wait">
            {stage === "phone" && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-forge-text-secondary/80 font-bold block mb-2">
                    Phone Number or Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forge-text-secondary/50" />
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210 or email"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-forge-surface/50 border border-forge-divider rounded-xl pl-10 pr-4 py-3 text-sm text-forge-text placeholder:text-forge-text-secondary/40 outline-none focus:border-forge-accent focus:ring-1 focus:ring-forge-accent transition-all font-sans"
                    />
                  </div>
                </div>
                {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !contact}
                  className="w-full h-11 bg-forge-accent hover:bg-forge-accent-hover text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-forge-accent/20 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Request Call Back</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}



            {stage === "confirmed" && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-forge-accent/20 border border-forge-accent/40 text-forge-accent flex items-center justify-center mx-auto shadow-lg shadow-forge-accent/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-forge-text font-syne">Callback Requested!</h4>
                <p className="text-xs text-forge-text-secondary/80 leading-relaxed font-sans">
                  We&apos;ll be back with a phone call shortly! Your discovery call request has been dispatched to <strong className="text-forge-accent font-mono">support@stackforge.co.in</strong>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Pricing() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="pricing" className="relative py-24 md:py-36 lg:py-44 overflow-hidden">
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

        {/* ── Can't Decide? Book a Call Widget ── */}
        <BookACallWidget />
      </div>
    </section>
  );
}

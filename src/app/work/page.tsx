import type { Metadata } from "next";
import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { StickyCta } from "@/components/stackforge/sticky-cta";
import { SignalButton } from "@/components/ui/signal-button";
import { WorkListing } from "@/components/stackforge/work-listing";

export const metadata: Metadata = {
  title: "Case Studies & Digital Engineering Portfolio | StackForge",
  description: "Explore our collection of speed-optimized, premium React & Next.js applications, custom APIs, and design systems shipped by StackForge.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Case Studies & Digital Engineering Portfolio | StackForge",
    description: "Explore our collection of speed-optimized, premium React & Next.js applications, custom APIs, and design systems shipped by StackForge.",
    url: "https://stackforge.co.in/work",
  },
  twitter: {
    title: "Case Studies & Digital Engineering Portfolio | StackForge",
    description: "Explore our collection of speed-optimized, premium React & Next.js applications, custom APIs, and design systems shipped by StackForge.",
  }
};

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

          {/* Interactive Work Listing */}
          <WorkListing />

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

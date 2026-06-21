import { Navbar } from "@/components/stackforge/navbar";
import { Hero } from "@/components/stackforge/hero";
import { AwardsStrip } from "@/components/stackforge/awards-strip";
import { TrustStrip } from "@/components/stackforge/trust-strip";
import { SectionDivider } from "@/components/stackforge/section-divider";
import { Work } from "@/components/stackforge/work";
import { Process } from "@/components/stackforge/process";
import { TechStack } from "@/components/stackforge/tech-stack";
import { FAQ } from "@/components/stackforge/faq";
import { LazyPricing } from "@/components/stackforge/lazy-pricing";
import { LazyCtaBanner } from "@/components/stackforge/lazy-cta-banner";

import { About } from "@/components/stackforge/about";
import { Footer } from "@/components/stackforge/footer";
import { StickyCta } from "@/components/stackforge/sticky-cta";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { SignalButton } from "@/components/ui/signal-button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />
      <ScrollProgress />

      {/* Skip to section links — accessibility */}
      <nav aria-label="Skip links" className="skip-links">
        <a href="#pricing">Skip to Pricing</a>
        <a href="#work">Skip to Work</a>
        <a href="#about">Skip to About</a>
        <a href="/start-project">Skip to Contact</a>
      </nav>

      <main id="main-content" className="flex-1">
        <Hero />
        <AwardsStrip />
        <TrustStrip />
        <SectionDivider />
        <div className="section-contained"><Work /></div>
        <SectionDivider />
        <Process />
        <SectionDivider />
        <div className="section-contained"><About /></div>
        <div className="section-contained"><TechStack /></div>
        <SectionDivider />
        <div id="pricing-container" className="section-contained"><LazyPricing /></div>
        <div className="section-contained"><LazyCtaBanner /></div>
        <SectionDivider />
        <div className="section-contained"><FAQ /></div>

      </main>

      <Footer />
      <BackToTop />
      <SignalButton />
      <CookieConsent />
      <StickyCta />
    </div>
  );
}

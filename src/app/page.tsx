import { Navbar } from "@/components/stackforge/navbar";
import { Hero } from "@/components/stackforge/hero";
import { TrustStrip } from "@/components/stackforge/trust-strip";
import { SectionDivider } from "@/components/stackforge/section-divider";
import { Services } from "@/components/stackforge/services";
import { Work } from "@/components/stackforge/work";
import { Process } from "@/components/stackforge/process";
import { Testimonials } from "@/components/stackforge/testimonials";
import { TechStack } from "@/components/stackforge/tech-stack";
import { FAQ } from "@/components/stackforge/faq";
import { LazyPricing } from "@/components/stackforge/lazy-pricing";
import { LazyCtaBanner } from "@/components/stackforge/lazy-cta-banner";
import { Contact } from "@/components/stackforge/contact-lazy";
import { About } from "@/components/stackforge/about";
import { Blog } from "@/components/stackforge/blog";
import { Footer } from "@/components/stackforge/footer";
import { StickyCta } from "@/components/stackforge/sticky-cta";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CookieConsent } from "@/components/ui/cookie-consent";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg overflow-x-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />
      <ScrollProgress />

      {/* Skip to section links — accessibility */}
      <nav aria-label="Skip links" className="skip-links">
        <a href="#services">Skip to Services</a>
        <a href="#work">Skip to Work</a>
        <a href="#about">Skip to About</a>
        <a href="#contact">Skip to Contact</a>
      </nav>

      <main id="main-content" className="flex-1">
        <Hero />
        <TrustStrip />
        <SectionDivider />
        <div className="section-contained"><Services /></div>
        <div className="section-contained"><Work /></div>
        <SectionDivider />
        <div className="section-contained"><Process /></div>
        <div className="section-contained"><Testimonials /></div>
        <SectionDivider />
        <div className="section-contained"><About /></div>
        <SectionDivider />
        <div className="section-contained"><Blog /></div>
        <SectionDivider />
        <div className="section-contained"><TechStack /></div>
        <div className="section-contained"><FAQ /></div>
        <SectionDivider />
        <div className="section-contained"><LazyPricing /></div>
        <div className="section-contained"><LazyCtaBanner /></div>
        <SectionDivider />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
      <CookieConsent />
      <StickyCta />
    </div>
  );
}

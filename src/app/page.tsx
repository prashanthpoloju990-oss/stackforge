import { Navbar } from "@/components/stackforge/navbar";
import { Hero } from "@/components/stackforge/hero";
import { SectionDivider } from "@/components/stackforge/section-divider";
import { Services } from "@/components/stackforge/services";
import { Work } from "@/components/stackforge/work";
import { Process } from "@/components/stackforge/process";
import { Testimonials } from "@/components/stackforge/testimonials";
import { TechStack } from "@/components/stackforge/tech-stack";
import { FAQ } from "@/components/stackforge/faq";
import { CtaBanner } from "@/components/stackforge/cta-banner";
import { Contact } from "@/components/stackforge/contact";
import { Footer } from "@/components/stackforge/footer";
import { StickyCta } from "@/components/stackforge/sticky-cta";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg">
      <Navbar />

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-forge-accent focus:text-white focus:text-[14px] focus:font-medium focus:rounded-lg focus:outline-none"
      >
        Skip to content
      </a>

      <main id="main-content" className="flex-1">
        <Hero />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Work />
        <SectionDivider />
        <Process />
        <Testimonials />
        <TechStack />
        <FAQ />
        <CtaBanner />
        <SectionDivider />
        <Contact />
      </main>

      <Footer />
      <StickyCta />
    </div>
  );
}

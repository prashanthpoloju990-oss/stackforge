import { SlideNav } from "@/components/stackforge/slide-nav";
import { SlideHero } from "@/components/stackforge/slide-hero";
import { SlideStatement } from "@/components/stackforge/slide-statement";
import { SlideServices } from "@/components/stackforge/slide-services";
import { SlideWork } from "@/components/stackforge/slide-work";
import { SlideStats } from "@/components/stackforge/slide-stats";
import { SlideTestimonial } from "@/components/stackforge/slide-testimonial";
import { SlideCta } from "@/components/stackforge/slide-cta";

export default function Home() {
  return (
    <div className="bg-forge-bg">
      {/* Skip to content */}
      <a
        href="#cta"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-forge-accent focus:text-white focus:text-[14px] focus:font-medium focus:rounded-lg focus:outline-none"
      >
        Skip to content
      </a>

      {/* Floating Slide Navigation */}
      <SlideNav />

      {/* Scroll-snap container */}
      <div className="scroll-snap-container">
        <SlideHero />
        <SlideStatement />
        <SlideServices />
        <SlideWork />
        <SlideStats />
        <SlideTestimonial />
        <SlideCta />
      </div>
    </div>
  );
}

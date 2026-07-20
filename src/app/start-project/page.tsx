import type { Metadata } from "next";
import { Contact } from "@/components/stackforge/contact-lazy";
import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { BackToTop } from "@/components/ui/back-to-top";

export const metadata: Metadata = {
  title: "Start a Project | StackForge",
  description:
    "Tell us about your project. StackForge builds fast, scalable React & Next.js web applications for startups and growing brands.",
  alternates: {
    canonical: "/start-project",
  },
};

export default function StartProjectPage() {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg overflow-x-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />

      <main id="main-content" className="flex-1 pt-16 md:pt-[72px]">
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

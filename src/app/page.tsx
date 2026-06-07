import { Navbar } from "@/components/stackforge/navbar";
import { Hero } from "@/components/stackforge/hero";
import { SectionDivider } from "@/components/stackforge/section-divider";
import { Services } from "@/components/stackforge/services";
import { Work } from "@/components/stackforge/work";
import { Process } from "@/components/stackforge/process";
import { Contact } from "@/components/stackforge/contact";
import { Footer } from "@/components/stackforge/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Work />
        <SectionDivider />
        <Process />
        <SectionDivider />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

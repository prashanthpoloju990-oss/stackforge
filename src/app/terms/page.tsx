"use client";

import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { StickyCta } from "@/components/stackforge/sticky-cta";
import { SignalButton } from "@/components/ui/signal-button";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />
      <ScrollProgress />

      <main id="main-content" className="flex-1 pt-28 md:pt-36 pb-24 md:pb-32">
        <div className="mx-auto max-w-[800px] px-6 md:px-12 font-sans text-forge-text-secondary/80 leading-relaxed">
          
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
            Legal Information
          </span>
          <h1 className="text-fluid-display font-bold text-forge-text font-playfair mb-8">
            Terms & <span className="text-forge-accent/70">Conditions</span>
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-[14px] md:text-[15px]">
            <p>
              Last Updated: June 21, 2026
            </p>
            
            <p>
              Welcome to StackForge. By accessing or using our website, services, or tools, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully.
            </p>

            <hr className="border-forge-divider/50 my-6" />

            <section className="space-y-3">
              <h2 className="text-[18px] font-bold text-forge-text font-syne">1. Services Provided</h2>
              <p>
                StackForge operates as a premium digital engineering studio specializing in web development, custom applications, and design systems. All scopes of work, milestones, deliverables, and timelines are governed by individual client service agreements executed in writing.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[18px] font-bold text-forge-text font-syne">2. Intellectual Property Rights</h2>
              <p>
                Unless stated otherwise in a specific contract, all materials, assets, layouts, designs, and code structures published on this website are the intellectual property of StackForge.
              </p>
              <p>
                Upon complete payment of all project fees, ownership rights of custom software developments transfer to the client as stipulated in the project agreement. StackForge retains rights to general libraries, design tokens, and components built prior to or independently of the client project.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[18px] font-bold text-forge-text font-syne">3. User Commitments</h2>
              <p>
                You agree not to use our website or services for any unlawful activities, including transmitting malicious software, attempting unauthorized access to our servers, or scraping content without written permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[18px] font-bold text-forge-text font-syne">4. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, StackForge shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of, or inability to use, our services or materials, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[18px] font-bold text-forge-text font-syne">5. Termination & Policy Updates</h2>
              <p>
                We reserve the right to suspend access to our platforms or terminate service agreements immediately if these Terms are violated. We reserve the right to update these Terms & Conditions at any time. Changes take effect immediately upon publication.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[18px] font-bold text-forge-text font-syne">6. Governing Law</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts of Hyderabad, Telangana.
              </p>
            </section>

            <hr className="border-forge-divider/50 my-6" />

            <p className="text-[12px] text-forge-text-secondary/50 font-mono">
              For legal inquiries or clarifications regarding these terms, contact us at: support@stackforge.co.in
            </p>
          </div>

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

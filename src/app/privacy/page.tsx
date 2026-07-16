"use client";

import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { StickyCta } from "@/components/stackforge/sticky-cta";
import { SignalButton } from "@/components/ui/signal-button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />
      <ScrollProgress />

      <main id="main-content" className="flex-1 pt-28 md:pt-36 pb-24 md:pb-32">
        <div className="mx-auto max-w-[800px] px-6 md:px-12 font-sans text-forge-text-secondary/80 leading-relaxed">
          
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
            Privacy & Trust
          </span>
          <h1 className="text-fluid-display font-bold text-forge-text font-playfair mb-8">
            Privacy <span className="text-forge-accent/70">Policy</span>
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-[14px] md:text-[15px]">
            <p className="text-forge-text-secondary/60 text-xs md:text-sm font-mono">
              Last Updated: July 15, 2026
            </p>
            
            <p className="text-fluid-body-lg font-medium text-forge-text font-syne">
              At StackForge, we build with precision and respect your privacy. This Privacy Policy details how we collect, store, utilize, and protect your personal information, as well as the brand assets, design references, and project credentials you provide during client onboarding.
            </p>

            <hr className="border-forge-divider/30 my-8" />

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">1. Scope and Applicability</h2>
              <p>
                This Privacy Policy applies to all site visitors of StackForge.co.in, prospective clients who inquire about our digital engineering services, and active clients who engage us for design, engineering, or API integration projects.
              </p>
              <p>
                By accessing our website or providing information through our client onboarding portals, you consent to the data collection and usage practices outlined herein.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">2. Client Onboarding Information Collected</h2>
              <p>
                To design and engineer high-performance applications, we collect comprehensive onboarding information from active clients:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li><strong>Brand Assets:</strong> High-resolution logos, brand guidelines, color codes, typography ideas, design inspirations, and layout preferences.</li>
                <li><strong>Strategic Details:</strong> Target audience profiling, competitor website references, business goals, and product requirements.</li>
                <li><strong>Technical Credentials:</strong> Direct developer or admin credentials for web hosting (e.g., Vercel, Netlify), database instances (e.g., Supabase), code repositories (e.g., GitHub), DNS settings, and SMTP gateway API keys.</li>
              </ul>
              <p>
                We do not collect this onboarding data without your consent; all details are submitted securely via our project onboarding forms or separate encrypted communication channels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">3. Usage and Security of Client Assets</h2>
              <p>
                <strong>3.1 Direct Project Use:</strong> Any assets, files, and credentials provided during onboarding are strictly used to execute the agreed Scope of Work. This includes generating UI mockups, programming React and Next.js applications, building database schemas, and setting up cloud deployments.
              </p>
              <p>
                <strong>3.2 NDA & Confidentiality:</strong> All client information, project briefs, and credentials are treated as Strictly Confidential under our mutual NDA rules. We restrict internal access to onboarding assets only to the developers, designers, and project managers directly assigned to your engagement.
              </p>
              <p>
                <strong>3.3 Secure Storage:</strong> Staging credentials and API keys are stored in encrypted environment files and secure password vaults. Codebases and design source files (Figma, PSD, AI) are maintained in secure, private repositories.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">4. Third-Party Service Dependencies</h2>
              <p>
                StackForge configures and integrates applications with leading third-party platforms to deploy and host your product:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li><strong>Hosting & Serverless:</strong> Vercel and Netlify for static and dynamic frontend deployments.</li>
                <li><strong>Database & Backend:</strong> Supabase for Postgres database hosting, storage, and authentication.</li>
                <li><strong>API Operations:</strong> Custom endpoint managers (such as Oqens) and SMTP email dispatch networks.</li>
              </ul>
              <p>
                Please note that while StackForge securely configures these services, your data on these platforms is ultimately subject to their respective terms of service and privacy policies. We encourage you to review their legal documentation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">5. Data Retention, Handover & Termination</h2>
              <p>
                Upon completion of the project and full settlement of invoices, we execute a complete handoff of the codebase and administrative controls.
              </p>
              <p>
                Following our standard fifteen (15) day Quality Assurance window:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li>We remove or rotate development credentials provided to us for third-party platforms (Vercel, Netlify, Supabase, GitHub).</li>
                <li>Clients are advised to update their master administrative passwords for security.</li>
                <li>StackForge maintains repository backups for development references but will purge active developer access to the client&rsquo;s live databases and systems unless a maintenance SLA is signed.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">6. Site Visitor Data, Analytics & Cookies</h2>
              <p>
                For visitors browsing StackForge.co.in, we collect basic, non-personally identifiable analytical data (such as browser type, time spent on pages, and geographic region) to optimize our user experience. We use cookies to remember styling preferences (such as light or dark theme toggle states) and manage cookie consent preferences. You can manage or disable cookies in your browser settings at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">7. Legal Disclosures & Compliance</h2>
              <p>
                We do not sell, trade, or rent client or visitor information to third parties. We may disclose your information only when legally required to do so in compliance with applicable laws of India, or to protect the safety, rights, and property of StackForge, our clients, and the public.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">8. Governing Law</h2>
              <p>
                This Privacy Policy is governed by the laws of India. Any claims, disputes, or legal actions regarding our data privacy practices shall be resolved in accordance with our terms of service, submitting to the exclusive jurisdiction of the courts located in Hyderabad, Telangana, India.
              </p>
            </section>

            <hr className="border-forge-divider/30 my-8" />

            <p className="text-[12px] text-forge-text-secondary/50 font-mono">
              If you have any questions about this Privacy Policy, or want to request deletion of your onboarding files/data, contact us at: support@stackforge.co.in
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

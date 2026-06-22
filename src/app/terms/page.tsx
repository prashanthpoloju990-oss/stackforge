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
            <p className="text-forge-text-secondary/60">
              Last Updated: June 23, 2026
            </p>
            
            <p className="text-fluid-body-lg font-medium text-forge-text">
              Welcome to StackForge. These Terms and Conditions govern your relationship with StackForge, including your access to our website, tools, APIs, and the procurement of our digital design and development services. By browsing this website or engaging us for services, you agree to these terms in full.
            </p>

            <hr className="border-forge-divider/30 my-8" />

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">1. Engagement & Scope of Services</h2>
              <p>
                StackForge operates as a premium digital engineering studio specializing in React, Next.js, and Tailwind-based application development, custom WebGL integrations, database architecture, and design systems.
              </p>
              <p>
                Engagements are officially initiated through the execution of a separate, project-specific Statement of Work (SOW) or Service Level Agreement (SLA) signed by both parties. Any advice, estimations, or timelines provided on this website are for informational purposes only and do not constitute a binding contract.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">2. Client Obligations & Collaboration</h2>
              <p>
                The success of design and development projects depends heavily on active client participation. You agree to provide:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li>Prompt access to relevant accounts, assets, brand guidelines, content, copy, and database credentials required for project progress.</li>
                <li>Consolidated feedback during specified review iterations within five (5) business days of milestone submissions.</li>
                <li>Accuracy and legality of all assets (images, text, fonts, intellectual properties) provided to StackForge for integration.</li>
              </ul>
              <p>
                Failure to provide required feedback or assets within agreed timelines may result in schedule delays, push milestones back, or trigger project restart fees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">3. Financial Terms, Milestones & Scope Creep</h2>
              <p>
                <strong>3.1 Milestone Billing:</strong> Engagement fees are billed in accordance with the milestone schedule defined in the SOW. Work begins only upon receipt of the initial retainer/kickoff payment.
              </p>
              <p>
                <strong>3.2 Invoicing & Delinquency:</strong> All invoices are payable within fourteen (14) calendar days of receipt. Late payments shall accrue interest at a rate of 1.5% per month on the outstanding balance, and StackForge reserves the right to suspend development progress or revoke staging/live server deployments until outstanding payments are cleared.
              </p>
              <p>
                <strong>3.3 Scope Creep:</strong> Any modifications, adjustments, or feature additions requested by the client that fall outside the boundaries of the signed SOW will be billed at our standard hourly developer rate or will require a separate SOW amendment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">4. Intellectual Property & Code Ownership</h2>
              <p>
                <strong>4.1 Code Transfer:</strong> Upon complete and final payment of all outstanding invoices, StackForge assigns all rights, titles, and ownership interests in the custom code, copy, and visuals developed specifically for the client as part of the SOW.
              </p>
              <p>
                <strong>4.2 Proprietary Libraries & Boilerplates:</strong> StackForge retains all rights to its pre-existing materials, core components, standard styling systems, WebGL templates, animation libraries, and general database routines built independently of or prior to the project. StackForge grants the client a non-exclusive, perpetual, royalty-free license to use these embedded components solely within the context of the delivered project.
              </p>
              <p>
                <strong>4.3 Open Source Dependencies:</strong> We utilize standard open-source libraries (e.g., React, Next.js, Framer Motion) which remain governed by their respective MIT, Apache, or BSD licenses.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">5. Confidentiality & Mutual NDA</h2>
              <p>
                Both parties agree to treat all business plans, project briefs, customer data, and technical architectures exchanged during the engagement as Strictly Confidential. Neither party shall disclose this information to third parties without prior written consent, except to employees or contractors bound by similar confidentiality rules.
              </p>
              <p>
                Unless explicitly restricted in the SOW, StackForge retains the right to display screenshots, write-ups, performance metrics, and general descriptions of the completed project on its website, portfolios, and case studies for marketing purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">6. Third-Party Services & SLA Disclaimers</h2>
              <p>
                <strong>6.1 Server & Platform Dependency:</strong> StackForge coordinates integrations with third-party vendors (such as hosting on Netlify/Vercel, databases via Supabase, API services like Oqens, and email servers like SMTP gateways). StackForge is not liable for service outages, data corruption, API deprecations, or security incidents occurring on platforms operated by these third parties.
              </p>
              <p>
                <strong>6.2 Maintenance & Post-Launch Support:</strong> Engagement contracts include a standard fifteen (15) day QA window after launch. Once the QA window closes, any updates, bug fixes, major framework version upgrades, or general technical support will require a separate monthly retainer agreement or will be billed hourly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">7. Warranties & Limitation of Liability</h2>
              <p>
                StackForge delivers custom software on an &ldquo;As Is&rdquo; and &ldquo;As Available&rdquo; basis. While we optimize codebase security, core web vitals, and browser compatibility, we do not warrant that the software will be completely error-free, uninterrupted, or immune to emerging cybersecurity vulnerabilities.
              </p>
              <p>
                To the maximum extent permitted by law, StackForge's total liability for any claim arising out of these terms or the associated services, whether in contract, tort, or otherwise, shall be strictly capped at the total amount actually paid by the client under the specific SOW associated with the dispute.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">8. Governing Law & Dispute Resolution</h2>
              <p>
                These Terms and Conditions shall be governed by, interpreted, and construed in accordance with the laws of India. Any legal actions, claims, or disputes arising from these terms or our services shall be resolved through mutual negotiation. 
              </p>
              <p>
                If a resolution cannot be reached within thirty (30) business days, the dispute shall be referred to arbitration in accordance with the Indian Arbitration and Conciliation Act, and the proceedings shall take place in Hyderabad, Telangana. The parties submit to the exclusive jurisdiction of the courts of Hyderabad, India.
              </p>
            </section>

            <hr className="border-forge-divider/30 my-8" />

            <p className="text-[12px] text-forge-text-secondary/50 font-mono">
              For legal inquiries, NDA updates, or general terms clarification, contact our legal desk at: support@stackforge.co.in
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

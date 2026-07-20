import type { Metadata } from "next";
import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { StickyCta } from "@/components/stackforge/sticky-cta";
import { SignalButton } from "@/components/ui/signal-button";

export const metadata: Metadata = {
  title: "Terms & Conditions | StackForge",
  description: "Read the Terms and Conditions of StackForge regarding our design and development services, advance payment policy, deliverables, and governing law.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | StackForge",
    description: "Read the Terms and Conditions of StackForge regarding our design and development services, advance payment policy, deliverables, and governing law.",
    url: "https://stackforge.co.in/terms",
  },
  twitter: {
    title: "Terms & Conditions | StackForge",
    description: "Read the Terms and Conditions of StackForge regarding our design and development services, advance payment policy, deliverables, and governing law.",
  }
};

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
            <p className="text-forge-text-secondary/60 text-xs md:text-sm font-mono">
              Last Updated: July 15, 2026
            </p>
            
            <p className="text-fluid-body-lg font-medium text-forge-text font-syne">
              Welcome to StackForge. These Terms and Conditions govern your relationship with StackForge, including your access to our website, tools, APIs, and the procurement of our digital design and development services. By browsing this website or engaging us for services, you agree to these terms in full.
            </p>

            <hr className="border-forge-divider/30 my-8" />

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">1. Engagement, Scope of Services & Standard Deliverables</h2>
              <p>
                StackForge operates as a premium digital engineering studio specializing in React, Next.js, and Tailwind-based application development, custom WebGL integrations, database architecture, and design systems.
              </p>
              <p>
                Engagements are officially initiated through the execution of a separate, project-specific Statement of Work (SOW) or Service Level Agreement (SLA) signed by both parties.
              </p>
              <p>
                Unless explicitly customized in the SOW, our standard website development package covers:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li>Homepage + four (4) additional core pages</li>
                <li>Fully responsive layout optimized for mobile and desktop screens</li>
                <li>Contact form integration with validations</li>
                <li>Basic search engine optimization (SEO) configurations</li>
                <li>Social media graphics and assets package</li>
              </ul>
              <p>
                <strong>Scope Creep:</strong> Any features, design revisions, pages, or modifications not explicitly detailed in the signed SOW will be categorized as extra services. These will be billed separately at our standard developer rates or will require an SOW amendment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">2. Client Onboarding Obligations & Collaboration</h2>
              <p>
                The success of design and development projects depends heavily on active client participation. Before development begins, clients must complete onboarding by providing:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li>Complete brand information and high-resolution logo files</li>
                <li>Detailed target audience profiling and business objectives</li>
                <li>Competitor website examples and market analyses</li>
                <li>Design references, inspiration boards, and style preferences</li>
                <li>Color palette preferences and typography ideas</li>
                <li>Prompt access to hosting accounts, domain settings, APIs, and staging server credentials</li>
              </ul>
              <p>
                Clients agree to provide consolidated feedback during specified review milestones within five (5) business days of submission. Onboarding delays or failure to provide assets/feedback in a timely manner may result in schedule delays, push project milestones back, or trigger restart fees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">3. Advance Payment Policy & Billing</h2>
              <p>
                <strong>3.1 Advance Payment:</strong> To secure engineering scheduling and resources, StackForge enforces a strict advance payment policy. By default, fees are structured as:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li><strong>50% Advance retainer payment:</strong> Due before any research, design, or engineering work commences.</li>
                <li><strong>50% Completion payment:</strong> Due upon final approval and prior to live production server deployment or transfer of control.</li>
              </ul>
              <p>
                At our discretion, larger projects may follow an alternative milestone split: <strong>30% Kickoff advance</strong> &rarr; <strong>40% Mid-project milestone</strong> &rarr; <strong>30% Before delivery</strong>. StackForge does not begin work on accounts with overdue advance invoices.
              </p>
              <p>
                <strong>3.2 Invoicing:</strong> All invoices issued by StackForge contain detailed, professional records of billing, including our business details, client credentials, description of project milestones, total amount due, invoice number, and bank transfer / UPI routing details. Payments are due within fourteen (14) calendar days of invoice date.
              </p>
              <p>
                <strong>3.3 Late Payments & Delinquency:</strong> Unpaid balances past the due date shall accrue interest at a rate of 1.5% per month. StackForge reserves the right to suspend development progress, revoke staging server access, or take down active applications until outstanding invoices are settled.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">4. File Delivery, Source Code & Intellectual Property</h2>
              <p>
                <strong>4.1 Standard Deliverables:</strong> Standard project delivery includes the compile-ready codebase or live deployment, along with standard client deliverables:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li>Final static images and graphics (Final PNG & JPG files)</li>
                <li>Final documents and design print-outs (Final PDF formats)</li>
                <li>Website admin/login credentials and host server controls</li>
              </ul>
              <p>
                <strong>4.2 Source Files Excluded:</strong> Standard packages do not include editable master files or source design assets. Raw work files, including Figma source files, Photoshop (PSD) files, or Adobe Illustrator (AI) files, remain the property of StackForge and are billed separately if requested for final handoff.
              </p>
              <p>
                <strong>4.3 Ownership Transfer:</strong> Upon complete and final payment of all outstanding project fees, StackForge assigns all rights, titles, and ownership interests in the custom code, copy, and visual deliverables created specifically for the client. StackForge retains proprietary rights to its pre-existing libraries, WebGL animation templates, boilerplates, and core routines, granting the client a non-exclusive, perpetual, royalty-free license to use them within the project context.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">5. Kill Fee & Project Cancellation Policy</h2>
              <p>
                In the event that a client chooses to cancel, terminate, or postpone an active design or development project midway, the client agrees to pay a <strong>Kill Fee</strong>. The Kill Fee is calculated as a percentage of the total project contract value to compensate for reserved schedule slots, research, and work completed up to that date:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-forge-text-secondary/70">
                <li><strong>30% Kill Fee:</strong> If cancelled during the initial research, wireframing, or Concept Stage.</li>
                <li><strong>50% Kill Fee:</strong> If cancelled Mid-Project (during active interface design or initial frontend development).</li>
                <li><strong>75% Kill Fee:</strong> If cancelled Near Delivery (during final staging, testing, or database integration stages).</li>
              </ul>
              <p>
                Upon cancellation, all work on the project will cease, and any completed custom assets, source code, or designs will not be transferred to the client until outstanding payments (including the applicable Kill Fee) are settled.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">6. Confidentiality & Mutual NDA</h2>
              <p>
                Both parties agree to treat all business plans, project briefs, customer data, and technical architectures exchanged during the engagement as Strictly Confidential. Neither party shall disclose this information to third parties without prior written consent, except to employees or contractors bound by similar confidentiality rules.
              </p>
              <p>
                Unless explicitly restricted in the SOW, StackForge retains the right to display screenshots, write-ups, performance metrics, and general descriptions of the completed project on its website, portfolios, and case studies for marketing purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">7. Third-Party Services & SLA Disclaimers</h2>
              <p>
                <strong>7.1 Server & Platform Dependency:</strong> StackForge coordinates integrations with third-party vendors (such as hosting on Netlify/Vercel, databases via Supabase, API services, and SMTP gateways). StackForge is not liable for service outages, data corruption, API deprecations, or security incidents occurring on platforms operated by these third parties.
              </p>
              <p>
                <strong>7.2 Maintenance & Post-Launch Support:</strong> Engagement contracts include a standard fifteen (15) day QA window after launch. Once the QA window closes, any updates, bug fixes, major framework version upgrades, or general technical support will require a separate monthly retainer agreement or will be billed hourly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">8. Warranties & Limitation of Liability</h2>
              <p>
                StackForge delivers custom software on an &ldquo;As Is&rdquo; and &ldquo;As Available&rdquo; basis. While we optimize codebase security, core web vitals, and browser compatibility, we do not warrant that the software will be completely error-free, uninterrupted, or immune to emerging cybersecurity vulnerabilities.
              </p>
              <p>
                To the maximum extent permitted by law, StackForge's total liability for any claim arising out of these terms or the associated services, whether in contract, tort, or otherwise, shall be strictly capped at the total amount actually paid by the client under the specific SOW associated with the dispute.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-forge-text font-syne">9. Governing Law & Dispute Resolution</h2>
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

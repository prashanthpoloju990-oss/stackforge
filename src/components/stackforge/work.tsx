"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useCountUp } from "@/hooks/use-count-up";
import { CaseStudyModal, type CaseStudy } from "@/components/ui/case-study-modal";

const STATS = [
  { value: 50, suffix: "+", label: "Projects Shipped" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 3.2, suffix: "\u00d7", label: "Avg. Conversion Lift" },
  { value: 6, suffix: "wks", label: "Avg. Delivery Time" },
];

const projects: CaseStudy[] = [
  {
    title: "NovaPay",
    subtitle: "Fintech \u00b7 SaaS Platform",
    description:
      "End-to-end payment dashboard with real-time analytics, role-based access, and Stripe integration. Built for scale from day one.",
    tags: ["React", "Node.js", "Stripe", "Prisma"],
    image: "/work/nova-clinic.png",
    metric: "3.2\u00d7",
    metricLabel: "conversion lift",
    challenge:
      "NovaPay was processing payments through a legacy dashboard that couldn\u2019t keep up with their 40% month-over-month growth. Transaction logs were scattered across five different tools, customer support tickets were piling up, and the finance team was spending 20+ hours a week manually reconciling data. They needed a unified platform that could handle high-volume transactions while giving non-technical stakeholders clear, real-time visibility into revenue flows.",
    solution:
      "We architected a modular dashboard using React and Node.js with real-time WebSocket streaming for live transaction feeds. Role-based access controls were built from the ground up so the finance team, support agents, and admins each saw exactly what they needed. Stripe integration was set up with automatic webhook handling for refunds, disputes, and subscription events. We implemented a Prisma-powered data layer with optimized queries that kept page loads under 200ms even with millions of transaction records.",
    results:
      "Within 60 days of launch, NovaPay saw a 3.2\u00d7 increase in checkout conversion rates. Manual reconciliation time dropped from 20+ hours per week to under 2 hours. Support tickets related to payment confusion fell by 67%, and the finance team gained real-time revenue dashboards that replaced their previous spreadsheet-heavy workflow entirely.",
    testimonial:
      "StackForge completely transformed how we see our business. The dashboard paid for itself in the first month.",
    testimonialAuthor: "Arjun Mehta, CEO of NovaPay",
  },
  {
    title: "Vertex",
    subtitle: "Startup \u00b7 Landing & Waitlist",
    description:
      "High-performance launch site with animated waitlist, social proof engine, and A/B tested copy. Shipped in 6 days.",
    tags: ["Next.js", "Tailwind", "Vercel", "Analytics"],
    image: "/work/vertex-startup.png",
    metric: "4,200",
    metricLabel: "waitlist signups",
    challenge:
      "Vertex had a revolutionary AI product but only 3 weeks before their planned launch at a major tech conference. Their existing landing page was a basic template that failed to communicate the product\u2019s value proposition. They had no waitlist infrastructure, no social proof mechanism, and their marketing team couldn\u2019t make copy changes without a developer. The stakes were high \u2014 the conference audience was their ideal early adopter demographic.",
    solution:
      "We designed and built a performance-optimized Next.js landing page with Vercel Edge deployment for sub-100ms global load times. The waitlist engine was built with real-time counter animations and smart duplicate detection. We implemented an A/B testing framework so the marketing team could swap headlines, CTAs, and hero images without any developer involvement. Social proof was woven in through an animated \u201crecent signups\u201d ticker and dynamic testimonial rotation.",
    results:
      "The page shipped in 6 days, 4 days ahead of the conference deadline. Vertex collected 4,200 waitlist signups during the 3-day event \u2014 a 340% increase over their initial projection of 950 signups. The A/B test data revealed that one specific headline variant outperformed the original by 2.1\u00d7, which became the permanent default post-launch.",
    testimonial:
      "They didn\u2019t just build a page \u2014 they built a growth engine. We hit our Year 1 signups target in a single weekend.",
    testimonialAuthor: "Priya Sharma, Head of Marketing at Vertex",
  },
  {
    title: "ElevateHR",
    subtitle: "B2B SaaS \u00b7 Management Platform",
    description:
      "Employee management system with custom dashboards, leave tracking, and performance reviews. Complex permissions, clean UX.",
    tags: ["TypeScript", "PostgreSQL", "Auth", "Charts"],
    image: "/work/elevate-portfolio.png",
    metric: "98",
    metricLabel: "performance score",
    challenge:
      "ElevateHR was running HR operations across spreadsheets, email chains, and three disconnected SaaS tools. Employee self-service was nonexistent \u2014 every leave request, document upload, or policy change required a manual email to the HR department. With 800+ employees across 12 departments, the team was drowning in administrative overhead. They needed a single platform that could handle complex permission hierarchies while remaining intuitive enough for non-technical staff to use daily.",
    solution:
      "We built a TypeScript-first platform with a PostgreSQL backend optimized for complex relational queries. The permission system uses a hierarchical role model where department heads, team leads, and HR admins each have granular access levels. We designed custom chart dashboards that visualize leave patterns, performance review completion rates, and headcount trends. The UI was built with a progressive disclosure pattern \u2014 simple by default, detailed when needed \u2014 so employees could submit leave requests in under 10 seconds while HR gets full audit trails.",
    results:
      "ElevateHR\u2019s HR team reclaimed 15 hours per week that were previously spent on manual administrative tasks. Leave request processing dropped from an average of 2 days to under 4 hours. The platform scored 98 on Lighthouse performance, making it one of the fastest enterprise HR tools in its class. Employee satisfaction with internal tools rose from 3.1 to 4.6 out of 5 in the first quarterly survey.",
    testimonial:
      "Finally, an HR platform our employees actually enjoy using. The speed and simplicity are unmatched.",
    testimonialAuthor: "Rahul Desai, VP of People at ElevateHR",
  },
  {
    title: "DineFine",
    subtitle: "Restaurant \u00b7 Online Experience",
    description:
      "Visually rich menu system with reservation engine, location finder, and seasonal content management. Mobile-first design.",
    tags: ["Next.js", "CMS", "Maps", "Responsive"],
    image: "/work/dinefine-restaurant.png",
    metric: "2.4\u00d7",
    metricLabel: "reservation increase",
    challenge:
      "DineFine is a premium restaurant chain with 6 locations and a menu that changes seasonally. Their existing website was a static PDF menu and a broken Google Maps integration \u2014 not exactly the experience you\u2019d expect from a brand that charges \u20b93,000 per person. Online reservations were routed through a third-party platform that charged 12% commission per booking. Mobile traffic accounted for 78% of visitors, but the site was barely usable on phones.",
    solution:
      "We built a mobile-first Next.js site with a headless CMS so the restaurant team could update menus, seasonal specials, and location details without touching code. The reservation engine was built in-house, eliminating third-party commission fees entirely. We integrated an interactive location finder with Google Maps that shows real-time availability per location. Photography and food imagery were treated as first-class design elements with lazy-loaded, optimized image delivery. The entire site was designed thumb-friendly with oversized touch targets and swipeable menu sections.",
    results:
      "Online reservations increased 2.4\u00d7 within the first quarter, with 89% of bookings now coming directly through the website instead of the third-party platform. DineFine saves approximately \u20b94.8 lakhs annually in commission fees. Mobile conversion rate improved from 1.2% to 5.8%. The CMS-driven seasonal menu updates now take 15 minutes instead of the previous 2-week developer cycle.",
    testimonial:
      "Our guests notice the difference. The website now matches the experience we deliver at the table.",
    testimonialAuthor: "Sneha Kapoor, Founder of DineFine",
  },
];

function StatItem({
  stat,
  isVisible,
}: {
  stat: (typeof STATS)[number];
  isVisible: boolean;
}) {
  const decimals = stat.value % 1 !== 0 ? 1 : 0;
  const count = useCountUp({
    target: stat.value,
    duration: 2000,
    decimals,
    enabled: isVisible,
  });

  return (
    <div className="flex flex-col items-center text-center py-6 md:py-0 px-4 md:px-8">
      <div className="flex items-baseline tabular-nums">
        <span className="text-fluid-h1 font-bold text-forge-text tracking-tight">
          {count}
        </span>
        <span className="text-fluid-h1 font-bold text-forge-accent tracking-tight">
          {stat.suffix}
        </span>
      </div>
      <span className="mt-1 text-fluid-micro text-forge-text-secondary/50 tracking-wide">
        {stat.label}
      </span>
    </div>
  );
}

export function Work() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.03 });

  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  const openStudy = (project: CaseStudy) => {
    setSelectedStudy(project);
  };

  const closeStudy = () => {
    setSelectedStudy(null);
  };

  return (
    <section id="work" className="py-24 md:py-32 lg:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16 transition-all duration-600 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              Selected Work
            </span>
            <h2 className="text-fluid-h1 font-bold text-forge-text max-w-[500px] font-playfair">
              Results, not just
              <br className="hidden md:block" />
              <span className="text-forge-accent/70"> pretty screens.</span>
            </h2>
          </div>
          <p className="text-fluid-body-lg text-forge-text-secondary/60 max-w-[360px] md:text-right">
            Every project is measured by the impact it creates — not just how it looks.
          </p>
        </div>

        {/* Aggregate Stats Bar */}
        <div
          ref={statsRef}
          className={cn(
            "mb-14 md:mb-16 border border-forge-divider rounded-xl bg-forge-surface/20 transition-all duration-700 ease-out",
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="relative">
                {/* Divider — vertical on desktop, horizontal on mobile */}
                {i > 0 && (
                  <>
                    {/* Mobile: horizontal line above */}
                    <div className="md:hidden absolute top-0 left-4 right-4 h-px bg-forge-divider/60" />
                    {/* Desktop: vertical line to the left */}
                    <div className="hidden md:block absolute left-0 top-[25%] bottom-[25%] w-px bg-forge-divider/60" />
                  </>
                )}
                <StatItem stat={stat} isVisible={statsVisible} />
              </div>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={cn(
                "group block rounded-xl border border-forge-divider bg-forge-surface/30 overflow-hidden card-hover",
                gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
              )}
              style={{ transitionDelay: gridVisible ? `${index * 100}ms` : "0ms" }}
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                {/* Metric badge */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-baseline gap-1.5 bg-black/60 backdrop-blur-sm rounded-md px-3 py-1.5 border border-white/10">
                    <span className="text-[16px] font-bold text-forge-accent font-tabular-nums">
                      {project.metric}
                    </span>
                    <span className="text-fluid-micro text-white/60">{project.metricLabel}</span>
                  </div>
                </div>
                {/* Arrow icon — top right, opens case study modal */}
                <button
                  onClick={() => openStudy(project)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full border border-white/20 backdrop-blur-sm bg-white/10 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-forge-accent/80 hover:border-forge-accent/80 cursor-pointer"
                  aria-label={`View ${project.title} case study`}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white">
                    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] text-forge-text-secondary/40 tracking-[0.08em] uppercase font-mono mb-1.5">
                      {project.subtitle}
                    </p>
                    <h3 className="text-fluid-h3 font-semibold text-forge-text font-syne">
                      {project.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => openStudy(project)}
                    className="shrink-0 w-10 h-10 rounded-full border border-forge-divider flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 group-hover:border-forge-accent/30 mt-1 cursor-pointer hover:bg-forge-accent/10"
                    aria-label={`View ${project.title} case study`}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-forge-accent/70">
                      <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <p className="mt-2.5 text-fluid-body text-forge-text-secondary/60">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded text-fluid-micro font-medium tracking-wide text-forge-text-secondary/40 bg-forge-bg/80 border border-forge-divider/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Case Study Link — visible on mobile, hover-reveal on desktop */}
                <button
                  onClick={() => openStudy(project)}
                  className="inline-flex items-center gap-1.5 text-forge-accent text-[13px] font-medium mt-4 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:gap-2.5 cursor-pointer"
                >
                  View Case Study
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        study={selectedStudy}
        open={selectedStudy !== null}
        onClose={closeStudy}
      />
    </section>
  );
}

"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { BorderGlow } from "@/components/ui/border-glow";

const values = [
  {
    number: "01",
    title: "Zero Bloat, All Signal",
    description:
      "We don't do generic templates or heavy page builders. We build from scratch using React and Next.js, meaning every line of code serves a purpose. No excess dependencies, no compromises.",
  },
  {
    number: "02",
    title: "High-Context Partnerships",
    description:
      "We don't act as a black-box agency. You work directly with the developers building your platform. We ask hard technical questions, align on product goals, and ship iterate-ready systems.",
  },
  {
    number: "03",
    title: "Performance as a Feature",
    description:
      "A beautiful site that drags on mobile is a failure. We target sub-second load times, flawless Lighthouse metrics, and solid SEO scaffolding out of the box because speed directly drives conversions.",
  },
];

const stats = [
  { value: "10+", label: "Projects Shipped" },
  { value: "98", label: "Performance Score" },
  { value: "3.2×", label: "Avg. Conversion Lift" },
  { value: "100%", label: "Client Retention" },
];

const team = [
  {
    name: "Prashanth Poloju",
    role: "CEO, Founder & Front-end Developer",
    bio: "CEO and Founder of StackForge. Specializes in building modern front-end architectures that are lightning-fast and visually stunning.",
    avatar: "/team/prashanth.jpg",
    link: "https://linkedin.com",
  },
  {
    name: "Uttej Jinnaram",
    role: "Co-Founder & Lead Backend Developer",
    bio: "Architects robust and scalable backend systems, ensuring high availability, peak performance, and clean API designs.",
    avatar: "/team/uttej.jpg",
    link: "https://linkedin.com",
  },
  {
    name: "Varshith Paladugula",
    role: "DevOps & Backend Engineer",
    bio: "Manages all hosting, deployment, and cloud infrastructure while contributing to backend services and database optimizations.",
    avatar: "/team/varshith.jpg",
    link: "https://linkedin.com",
  },
  {
    name: "Anil Ganji",
    role: "Social Media Manager & Resource Curator",
    bio: "Handles social media channels, brand outreach, and curates high-quality resources and assets for the development workflows.",
    avatar: "/team/anil.jpg",
    link: "https://linkedin.com",
  },
];

export function About() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal();
  const { ref: teamRef, isVisible: teamVisible } = useScrollReveal({ threshold: 0.03 });

  return (
    <section id="about" className="py-24 md:py-32 lg:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className={cn(
            "mb-16 md:mb-24 transition-all duration-600 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
            About Us
          </span>
          <h2 className="text-fluid-h1 font-bold text-forge-text font-playfair max-w-[600px]">
            We&apos;re a small team
            <br className="hidden md:block" />
            {" "}with big{" "}
            <span className="text-forge-accent/80">ambitions.</span>
          </h2>
        </div>

        {/* ── Our Story ── */}
        <div
          ref={storyRef}
          className={cn(
            "mb-20 md:mb-28 transition-all duration-600 ease-out",
            storyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-20 items-start">
            {/* Left — Narrative */}
            <div className="flex flex-col">
              <h3 className="text-fluid-h2 font-bold text-forge-text font-syne mb-5">
                How it started
              </h3>
              <div className="space-y-4 text-fluid-body-lg text-forge-text-secondary/70">
                <p>
                  StackForge was founded in April 2026 by a group of passionate students 
                  from <span className="text-forge-text font-medium">Malla Reddy University</span>. 
                  It was born out of frustration—we kept seeing businesses burned by agencies 
                  that delivered beautiful mockups but broken products.
                </p>
                <p>
                  Our founder, Prashanth, decided to build a studio that treated{" "}
                  <span className="text-forge-text font-medium">
                    performance as a feature
                  </span>.
                </p>
                <p>
                  What started as a two-person operation working from a cafe table
                  has grown into a tight-knit team of four — shipping production-grade
                  websites, dashboards, and SaaS platforms for businesses across India
                  and beyond.
                </p>
              </div>
            </div>

            {/* Right — Quick Philosophy */}
            <div className="flex flex-col">
              <h3 className="text-fluid-h2 font-bold text-forge-text font-syne mb-5">
                What we believe
              </h3>
              <div className="border border-forge-accent/15 bg-forge-accent/[0.02] rounded-xl p-8 md:p-10">
                <span className="absolute -mt-3 ml-2 text-forge-accent/10 text-6xl font-playfair select-none pointer-events-none">
                  &ldquo;
                </span>
                <blockquote className="text-fluid-h2 text-forge-text/90 font-playfair relative z-10 leading-relaxed">
                  Great websites aren&apos;t just built — they&apos;re engineered. Every
                  millisecond of load time, every pixel of spacing, every interaction
                  has a purpose.
                </blockquote>
                <p className="mt-6 text-fluid-body text-forge-text-secondary/70">
                  That&apos;s the StackForge standard.
                </p>
              </div>

              {/* Mini-stats inside story */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <span className="text-fluid-hero font-bold text-forge-text font-syne block">
                    2026
                  </span>
                  <span className="text-fluid-micro text-forge-text-secondary/60 block mt-1 uppercase tracking-wider">
                    Founded
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-fluid-hero font-bold text-forge-text font-syne block">
                    4
                  </span>
                  <span className="text-fluid-micro text-forge-text-secondary/60 block mt-1 uppercase tracking-wider">
                    Members
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-fluid-hero font-bold text-forge-text font-syne block">
                    HYD
                  </span>
                  <span className="text-fluid-micro text-forge-text-secondary/60 block mt-1 uppercase tracking-wider">
                    Based
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Our Values ── */}
        <div
          ref={valuesRef}
          className={cn(
            "mb-20 md:mb-28 transition-all duration-600 ease-out",
            valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          )}
        >
          <div className="mb-12 md:mb-16">
            <span className="text-[12px] text-forge-text-secondary/50 font-medium tracking-[0.16em] uppercase block mb-3 font-mono">
              Our Principles
            </span>
            <h2 className="text-fluid-h1 font-bold text-forge-text font-playfair max-w-[500px]">
              The rules we
              <br />
              <span className="text-forge-accent/70"> don&apos;t bend.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {values.map((value, index) => (
              <div
                key={value.number}
                className={cn(
                  "transition-all duration-600 ease-out",
                  valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
                )}
                style={{
                  transitionDelay: valuesVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <BorderGlow
                  backgroundColor="var(--forge-bg)"
                  borderRadius={12}
                  glowRadius={28}
                  glowIntensity={0.9}
                  className="rounded-xl h-full"
                >
                  <div className="p-6 md:p-8">
                    <span className="text-[13px] font-mono text-forge-accent/40 tracking-wider block mb-4">
                      {value.number}
                    </span>
                    <h3 className="text-fluid-h3 font-semibold text-forge-text font-syne mb-3">
                      {value.title}
                    </h3>
                    <p className="text-fluid-body text-forge-text-secondary/60">
                      {value.description}
                    </p>
                  </div>
                </BorderGlow>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div
          ref={statsRef}
          className={cn(
            "mb-20 md:mb-28 transition-all duration-600 ease-out",
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          )}
        >
          <div className="border border-forge-divider rounded-xl p-8 md:p-10 bg-forge-surface/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "text-center transition-all duration-600 ease-out",
                    statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{
                    transitionDelay: statsVisible ? `${index * 80}ms` : "0ms",
                  }}
                >
                  <span className="text-fluid-hero font-bold text-forge-accent font-syne block">
                    {stat.value}
                  </span>
                  <span className="text-fluid-label text-forge-text-secondary/60 block mt-2 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Our Team ── */}
        <div ref={teamRef}>
          <div className="mb-12 md:mb-16">
            <span className="text-[12px] text-forge-text-secondary/50 font-medium tracking-[0.16em] uppercase block mb-3 font-mono">
              The Team
            </span>
            <h2 className="text-fluid-h1 font-bold text-forge-text font-playfair max-w-[550px]">
              People behind the
              <br />
              <span className="text-forge-accent/70"> pixels.</span>
            </h2>
          </div>

          {/* Founder — Featured Card */}
          <div
            className={cn(
              "mb-4 md:mb-5 transition-all duration-600 ease-out",
              teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
            )}
          >
            <BorderGlow
              animated
              backgroundColor="var(--forge-bg)"
              borderRadius={12}
              glowRadius={35}
              glowIntensity={1.2}
              className="rounded-xl"
            >
              <div className="p-8 md:p-10 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-forge-accent/20 shrink-0 mx-auto md:mx-0">
                    <Image
                      src={team[0].avatar}
                      alt={team[0].name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqPwfAAzwBfK5z+5nAAAAAElFTkSuQmCC"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                      <h3 className="text-fluid-h3 font-bold text-forge-text font-syne">
                        {team[0].name}
                      </h3>
                      <span className="text-fluid-micro text-forge-accent bg-forge-accent/10 border border-forge-accent/20 rounded-full px-2.5 py-0.5 uppercase tracking-wider font-medium">
                        Founder
                      </span>
                    </div>
                    <p className="text-fluid-label text-forge-accent/60 uppercase tracking-wider mb-3">
                      {team[0].role}
                    </p>
                    <p className="text-fluid-body-lg text-forge-text-secondary/70 max-w-[500px]">
                      {team[0].bio}
                    </p>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </div>

          {/* Rest of the team — Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {team.slice(1).map((member, index) => (
              <div
                key={member.name}
                className={cn(
                  "transition-all duration-600 ease-out",
                  teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
                )}
                style={{
                  transitionDelay: teamVisible ? `${(index + 1) * 100}ms` : "0ms",
                }}
              >
                <BorderGlow
                  backgroundColor="var(--forge-bg)"
                  borderRadius={12}
                  glowRadius={28}
                  glowIntensity={0.9}
                  className="rounded-xl h-full"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 md:w-18 md:h-18 mx-auto rounded-full overflow-hidden border border-forge-divider mb-4">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={72}
                        height={72}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqPwfAAzwBfK5z+5nAAAAAElFTkSuQmCC"
                      />
                    </div>
                    <h3 className="text-fluid-h4 font-bold text-forge-text font-syne">
                      {member.name}
                    </h3>
                    <p className="text-fluid-label text-forge-accent/60 uppercase tracking-wider mt-1 mb-3">
                      {member.role}
                    </p>
                    <p className="text-fluid-body text-forge-text-secondary/60">
                      {member.bio}
                    </p>
                  </div>
                </BorderGlow>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

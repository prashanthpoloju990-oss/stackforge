"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { BorderGlow } from "@/components/ui/border-glow";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { Users, CheckCircle2, ExternalLink } from "lucide-react";

function MockTerminal() {
  return (
    <div className="w-full rounded-lg bg-[#0F141C] border border-[#21262D]/60 shadow-2xl font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-hidden text-slate-300">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161B22] border-b border-[#21262D]/60 select-none">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex gap-3 text-[10px] font-medium text-slate-400 overflow-x-auto scrollbar-none">
          <span className="text-forge-accent border-b border-forge-accent pb-0.5">studio.config.ts</span>
          <span className="opacity-40">package.json</span>
          <span className="opacity-40">app/page.tsx</span>
        </div>
        <div className="w-4" />
      </div>
      {/* Code Editor Window */}
      <div className="p-4 overflow-x-auto whitespace-pre font-mono text-[#E6EDF0] max-w-full">
        <div className="flex"><span className="text-[#8B949E] w-6 select-none">1</span><span className="text-[#FF7B72]">export default</span> <span className="text-[#D2A8FF]">defineConfig</span><span className="text-[#E6EDF0]">({`{`}</span></div>
        <div className="flex"><span className="text-[#8B949E] w-6 select-none">2</span>  <span className="text-[#79C0FF]">engine</span><span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">"next-turbopack"</span><span className="text-[#E6EDF0]">,</span></div>
        <div className="flex"><span className="text-[#8B949E] w-6 select-none">3</span>  <span className="text-[#79C0FF]">minify</span><span className="text-[#FF7B72]">:</span> <span className="text-[#79C0FF]">true</span><span className="text-[#E6EDF0]">,</span></div>
        <div className="flex"><span className="text-[#8B949E] w-6 select-none">4</span>  <span className="text-[#79C0FF]">features</span><span className="text-[#FF7B72]">:</span> <span className="text-[#E6EDF0]">{`[`}</span><span className="text-[#A5D6FF]">"dynamic-imports"</span><span className="text-[#E6EDF0]">, </span><span className="text-[#A5D6FF]">"edge-caching"</span><span className="text-[#E6EDF0]">{`]`}</span></div>
        <div className="flex"><span className="text-[#8B949E] w-6 select-none">5</span><span className="text-[#E6EDF0]">{`});`}</span></div>

        {/* Terminal Output */}
        <div className="mt-3 pt-3 border-t border-[#21262D]/60 font-mono text-[10px]">
          <div className="text-slate-500 mb-1">$ bun run build</div>
          <div className="text-slate-400">bun build v1.3.4 (Next.js Optimization Engine)</div>
          <div className="text-forge-accent mt-0.5">⚡ bundling production build...</div>
          <div className="text-[#238636] flex items-center gap-1 mt-0.5">
            <span>✔</span> <span>compiled 147 modules in 0.18s</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 mt-2 pt-2 border-t border-[#21262D]/40 text-slate-400 font-semibold">
            <div>
              <span className="text-slate-500">Route (app)</span>
              <div className="text-slate-300">/ (Static)</div>
              <div className="text-slate-300">/start-project</div>
            </div>
            <div>
              <span className="text-slate-500">Size (gzip)</span>
              <div className="text-[#2EA043]">1.2 KB (Zero Bloat)</div>
              <div className="text-[#2EA043]">2.4 KB</div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-500 border-t border-[#21262D]/40 pt-1 flex items-center justify-between">
            <span>Lighthouse Performance Score:</span>
            <span className="text-[#2EA043] font-bold">100 / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatThread() {
  return (
    <div className="w-full flex flex-col gap-3 py-2 font-sans">
      {/* Dev bubble */}
      <div className="flex flex-col items-start max-w-[85%] self-start">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] text-forge-accent/80 font-mono font-medium">Dev Studio</span>
        </div>
        <div className="bg-forge-bg border border-forge-divider text-forge-text rounded-2xl rounded-tl-none px-3.5 py-2 text-[12px] leading-relaxed shadow-sm">
          FCP is 0.2s. Booking flow is streamlined. Production build deployed successfully! 🚀
        </div>
      </div>
      {/* Client bubble */}
      <div className="flex flex-col items-end max-w-[85%] self-end">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] text-forge-text-secondary/60 font-mono">You (Partner)</span>
        </div>
        <div className="bg-forge-accent text-white rounded-2xl rounded-tr-none px-3.5 py-2 text-[12px] leading-relaxed shadow-sm">
          Amazing! The direct communication made this so fast. Let's go live tomorrow.
        </div>
      </div>
    </div>
  );
}

function LighthouseDial() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-start gap-6 py-2 w-full">
      {/* Radial score */}
      <div className="relative w-24 h-24 flex items-center justify-center select-none shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="var(--forge-divider)"
            strokeWidth="8"
            fill="transparent"
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#22C55E"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="264"
            strokeDashoffset="5.28" // 98% of 264
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))",
              transition: "stroke-dashoffset 1s ease-in-out"
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-[#22C55E] tracking-tighter drop-shadow-[0_0_12px_rgba(34,197,94,0.3)]">98</span>
          <span className="text-[8px] font-bold text-forge-text-secondary/70 tracking-widest uppercase">Performance</span>
        </div>
      </div>

      {/* Metrics list */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 font-mono text-[11px] text-forge-text-secondary/80 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
          <span>FCP: <strong className="text-forge-text">0.2s</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
          <span>LCP: <strong className="text-forge-text">0.5s</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
          <span>TBT: <strong className="text-forge-text">45ms</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
          <span>CLS: <strong className="text-forge-text">0.00</strong></span>
        </div>
      </div>
    </div>
  );
}

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
    name: "Uttej Jinnaram",
    role: "Co-Founder & Backend Lead",
    bio: "Architects robust and scalable backend systems, ensuring high availability, peak performance, and clean API designs.",
    avatar: "/team/uttej.jpg",
    link: "https://www.linkedin.com/in/jinnaram-uttej-b0877837b/",
    followers: "1.2K",
    verified: true,
  },
  {
    name: "Prashanth Poloju",
    role: "CEO & Founder",
    bio: "CEO and Founder of StackForge. Specializes in building modern front-end architectures that are lightning-fast and visually stunning.",
    avatar: "/team/prashanth.jpg",
    link: "https://www.linkedin.com/in/prashanthpoloju/",
    followers: "1.8K",
    verified: true,
  },
  {
    name: "Anil Ganji",
    role: "Social Media Manager",
    bio: "Handles social media channels, brand outreach, and curates high-quality resources and assets for the development workflows.",
    avatar: "/team/anil-updated.jpg",
    link: "https://www.linkedin.com/in/anil-ganji-84321937b",
    followers: "2.4K",
    verified: false,
  },
  {
    name: "Akshitha",
    role: "UI/UX Developer",
    bio: "Brings a sharp eye for design and hands-on development experience. Specializes in crafting intuitive interfaces and pixel-perfect user experiences.",
    avatar: "/team/akshitha.jpg",
    link: "https://www.linkedin.com/in/akshitha-linga-466aba389",
    followers: "940",
    verified: false,
  },
];

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  link: string;
  followers: string;
  verified: boolean;
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div
      className="profile-card block"
      aria-label={`${member.name} - ${member.role}`}
    >
      <div className="card-image-wrap">
        <Image
          src={member.avatar}
          alt={member.name}
          width={280}
          height={420}
          className={cn(
            "transition-all duration-500",
            member.name.includes("Prashanth") ? "prashanth-avatar" : ""
          )}
          loading="lazy"
        />
      </div>
      <section>
        <div className="flex items-center gap-1 select-none">
          <h2>{member.name}</h2>
          {member.verified && (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] fill-[#22C55E]/10 shrink-0" />
          )}
        </div>
        <p className="role">{member.role}</p>
        <p className="bio">{member.bio}</p>
        {/* Liquid Glass Follow Button — visible when NOT hovered */}
        <a
          href={member.link}
          target="_blank"
          rel="noopener noreferrer"
          className="follow-btn-glass"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <span>Follow</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
        </a>
      </section>
    </div>
  );
}

export function About() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal();
  const { ref: teamRef, isVisible: teamVisible } = useScrollReveal({ threshold: 0.03 });

  return (
    <section id="about" className="pt-24 md:pt-36 lg:pt-44 pb-12 md:pb-16 lg:pb-20">
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

        {/* ── Magic UI Scroll Text Reveal ── */}
        <TextRevealByWord
          text="We design and engineer bespoke, high-performance websites with clean React architecture, sub-second loading speeds, and conversions built directly into the codebase."
          className="my-4 md:my-6"
        />

        {/* ── Our Principles (Editorial Flow & Motion Timeline) ── */}
        <div
          ref={valuesRef}
          className="mb-24 md:mb-36"
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 md:mb-24 max-w-[640px]"
          >
            <span className="text-[11px] font-mono text-forge-accent/60 tracking-[0.2em] uppercase block mb-3">
              Our Principles
            </span>
            <h2 className="text-fluid-h1 font-bold text-forge-text font-playfair leading-tight">
              The rules we
              <br />
              <span className="text-forge-accent/80"> don&apos;t bend.</span>
            </h2>
            <p className="mt-4 text-fluid-body-lg text-forge-text-secondary/70 leading-relaxed">
              We operate on a set of core engineering convictions. No shortcuts, no bloated frameworks, and zero compromise on performance or quality.
            </p>
          </motion.div>

          {/* Editorial Vertical Flow with subtle connecting guide line */}
          <div className="relative border-l border-forge-divider/40 pl-6 md:pl-12 space-y-20 md:space-y-28">
            {values.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative group"
              >
                {/* Laser Node on Timeline */}
                <div className="absolute -left-[31px] md:-left-[55px] top-3.5 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-forge-accent opacity-25" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forge-accent/60 group-hover:bg-forge-accent group-hover:scale-125 group-hover:shadow-[0_0_14px_var(--forge-accent)] transition-all duration-300 ring-4 ring-forge-bg" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 md:gap-14 items-start">
                  {/* Left Column: Number + Title + Description stacked directly together */}
                  <div className="space-y-4 max-w-[540px]">
                    <div className="overflow-hidden inline-block">
                      <motion.span
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.15 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xs font-mono text-forge-accent/80 tracking-[0.2em] uppercase font-bold block"
                      >
                        {"// "}{item.number}
                      </motion.span>
                    </div>

                    <h3 className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-forge-text font-syne tracking-tight leading-snug group-hover:text-forge-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-base md:text-lg text-forge-text-secondary/75 leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Right Column: Minimal Context Visual */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full pt-1 lg:pt-4"
                  >
                    {index === 0 && <MockTerminal />}
                    {index === 1 && <ChatThread />}
                    {index === 2 && <LighthouseDial />}
                  </motion.div>
                </div>
              </motion.div>
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
        <div ref={teamRef} className="mt-16 md:mt-24 w-full">
          <div className="max-w-[1200px] mx-auto">
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
          </div>

          {/* Team Cards — 1 Row of 4 Cards (Wider container for clean spacing) */}
          <div className="max-w-[1280px] mx-auto px-4 md:px-6">
            <div className="team-scroll-container sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 lg:gap-4 sm:justify-center px-1 sm:px-0">
              {team.map((member, index) => (
                <div
                  key={member.name}
                  className={cn(
                    "transition-all duration-600 ease-out w-full flex justify-center",
                    teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
                  )}
                  style={{
                    transitionDelay: teamVisible ? `${(index + 1) * 80}ms` : "0ms",
                  }}
                >
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

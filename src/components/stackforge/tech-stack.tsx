"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Prisma",
  "Node.js",
  "PostgreSQL",
  "Framer Motion",
  "Vercel",
  "Stripe",
  "Supabase",
  "Figma",
];

export function TechStack() {
  const items = [...techStack, ...techStack]; // Double for seamless loop

  return (
    <section className="py-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-[1200px] px-6 md:px-20"
      >
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <span className="text-[12px] text-forge-text-secondary/50 tracking-[0.16em] uppercase font-mono">
            Tech Stack
          </span>
        </div>
      </motion.div>

      {/* Simple smooth marquee */}
      <div className="relative select-none w-full overflow-hidden">
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-forge-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-forge-bg to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee-smooth whitespace-nowrap">
          {items.map((tech, idx) => (
            <span
              key={`${tech}-${idx}`}
              className={cn(
                "inline-flex items-center text-[1.8rem] md:text-[2.4rem] lg:text-[3rem] font-mono font-semibold tracking-[0.04em] text-forge-text-secondary/30 hover:text-forge-accent/60 transition-colors duration-300 px-4 md:px-6 shrink-0",
              )}
            >
              {tech}
              <span className="text-forge-accent/25 mx-4 md:mx-6 text-[0.6em]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

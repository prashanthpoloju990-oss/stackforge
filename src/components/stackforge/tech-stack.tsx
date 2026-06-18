"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import CurvedLoop from "@/components/ui/curved-loop";

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
  const marqueeText = techStack.join(" ✦ ") + " ✦ ";

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-[1200px] px-6 md:px-20"
      >
        {/* Section Header */}
        <div className="mb-4 md:mb-6 flex items-center gap-4">
          <span className="text-[12px] text-forge-text-secondary/50 tracking-[0.16em] uppercase font-mono">
            Tech Stack
          </span>
          <div className="flex-1 h-px bg-forge-divider" />
        </div>

        {/* Curved Loop Marquee */}
        <div className="relative select-none w-full">
          <CurvedLoop
            marqueeText={marqueeText}
            speed={1.5}
            curveAmount={140}
            direction="left"
            interactive={true}
            style={{ minHeight: "auto", height: "180px" }}
            className="fill-forge-text-secondary/35 text-[2.5rem] md:text-[3rem] font-mono tracking-[0.06em] font-semibold"
          />
        </div>
      </motion.div>
    </section>
  );
}

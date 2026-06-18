"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack";

const steps = [
  {
    number: "01",
    title: "Research and Analysis",
    description:
      "With your vision in mind, we enter the Research and Analysis phase. Here, we examine your competitors, industry trends, and user preferences. This informed approach ensures your website stands out and provides an excellent user experience.",
  },
  {
    number: "02",
    title: "Wireframing and Prototyping",
    description:
      "We move on to Wireframing and Prototyping, where we create skeletal representations of your website's pages. These visual blueprints allow us to test and refine the user experience before diving into design.",
  },
  {
    number: "03",
    title: "Design Creation",
    description:
      "Now, it's time for the Design Creation phase. Our talented designers bring your vision to life. We focus on aesthetics, ensuring your website not only looks stunning but also aligns perfectly with your brand identity.",
  },
  {
    number: "04",
    title: "Development and Testing",
    description:
      "In the Development and Testing phase, our skilled developers turn designs into a fully functional website. Rigorous testing ensures everything works seamlessly, providing an exceptional user experience.",
  },
  {
    number: "05",
    title: "Launch and Support",
    description:
      "Our commitment continues beyond launch. We offer post-launch support to address questions, provide assistance, and ensure your website remains updated and optimized. The Website Design Process isn't just about creating a website; it's about crafting a digital experience that resonates, engages, and converts.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 md:py-32 lg:py-[110px] relative bg-forge-bg">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        <div className="grid md:grid-cols-2 md:gap-8 xl:gap-16 items-start relative">
          
          {/* Left Column (Sticky) */}
          <div className="left-0 top-[100px] md:sticky md:h-[calc(100vh-100px)] md:py-12 mb-16 md:mb-0 flex flex-col justify-start">
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              our process
            </span>
            <h2 className="mb-6 mt-4 text-fluid-h1 font-bold text-forge-text font-playfair max-w-[550px]">
              Planning your
              <br />
              <span className="text-forge-accent/70"> project development journey</span>
            </h2>
            <p className="text-fluid-body text-forge-text-secondary/70 max-w-[420px]">
              Our journey begins with a deep dive into your vision. In the Discovery phase, we engage in meaningful conversations to grasp your brand identity, goals, and the essence you want to convey. This phase sets the stage for all that follows.
            </p>
          </div>
          
          {/* Right Column (Scrolling Stack) */}
          <ContainerScroll className="min-h-[300vh] space-y-8 pb-[100px] md:pb-[30vh]">
            {steps.map((step, index) => (
              <CardSticky
                key={step.number}
                index={index + 8}
                incrementY={14}
                className="rounded-2xl border border-forge-divider/50 bg-forge-surface/30 p-8 md:p-10 shadow-2xl shadow-forge-bg/80 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h3 className="text-fluid-h3 font-semibold text-forge-text font-syne">
                    {step.title}
                  </h3>
                  <h4 className="text-3xl font-bold text-forge-accent font-syne">
                    {step.number}
                  </h4>
                </div>
                <p className="text-fluid-body text-forge-text-secondary/70">
                  {step.description}
                </p>
              </CardSticky>
            ))}
          </ContainerScroll>

        </div>
      </div>
    </section>
  );
}


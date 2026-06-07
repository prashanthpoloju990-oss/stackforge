"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface TimelineContentProps {
  children: React.ReactNode;
  animationNum: number;
  timelineRef: React.RefObject<HTMLElement | null>;
  customVariants?: {
    visible: (i: number) => Record<string, unknown>;
    hidden: Record<string, unknown>;
  };
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function TimelineContent({
  children,
  animationNum,
  timelineRef,
  customVariants,
  className,
  as: Component = "div",
}: TimelineContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-80px 0px",
    root: null,
  });

  const defaultVariants: {
    visible: (i: number) => Record<string, unknown>;
    hidden: Record<string, unknown>;
  } = customVariants || {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: 20,
      opacity: 0,
    },
  };

  const MotionComponent = motion.create(Component as string) as React.ComponentType<
    React.ComponentProps<"div"> & { variants?: Variants; custom?: number }
  >;

  return (
    <MotionComponent
      ref={ref}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={defaultVariants as Variants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

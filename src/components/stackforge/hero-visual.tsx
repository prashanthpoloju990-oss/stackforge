"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { motion } from "motion/react";

const emptySubscribe = () => () => {};

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * HeroVisual
 * ──────────
 * High-interaction visual element for the Hero section.
 * Contains a CSS-animated shape-morphing background gradient,
 * a foreground neobrutalist card window with mouse-tilt 3D parallax,
 * and secondary floating shapes that react to coordinates.
 */
export function HeroVisual() {
  const mounted = useHasMounted();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScrollPosition();

  useEffect(() => {
    let rAFId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        // Calculate normalized mouse positions (-0.5 to 0.5) relative to the container
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rAFId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[420px] lg:min-h-[520px] flex items-center justify-center select-none"
    >
      {/* Subtle dot grid in background - shifts opposite to scroll and mouse */}
      <div
        className="hero-dots absolute inset-0"
        style={{
          transform: `translate3d(${mousePos.x * -12}px, ${-scrollY * 0.03 + mousePos.y * -12}px, 0)`,
          willChange: "transform",
        }}
      />

      {/* Morphing Blur Shape Blob */}
      <div className="absolute w-[260px] h-[260px] md:w-[340px] md:h-[340px] filter blur-[45px] opacity-40 dark:opacity-25 pointer-events-none transition-transform duration-[600ms] ease-out">
        <div
          className="w-full h-full bg-gradient-to-tr from-forge-accent via-purple-600 to-blue-500 animate-[morph_14s_ease-in-out_infinite]"
          style={{
            transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 35}px, 0)`,
          }}
        />
      </div>

      {/* Interactive 3D Neobrutalist Container */}
      <motion.div
        className="relative w-[290px] h-[330px] md:w-[340px] md:h-[390px] rounded-2xl border-4 border-forge-text bg-background shadow-[10px_10px_0px_0px_var(--forge-text)] p-5 flex flex-col justify-between overflow-hidden cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          rotateY: mousePos.x * 24, // 3D Perspective rotation
          rotateX: -mousePos.y * 24,
          transform: "perspective(1000px)",
        }}
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        whileHover={{
          scale: 1.02,
          shadow: "14px 14px 0px 0px var(--forge-text)",
          transition: { duration: 0.25, ease: "easeOut" }
        }}
      >
        {/* Card Header (Mac style control buttons) */}
        <div className="flex items-center justify-between border-b-2 border-forge-text pb-3.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-forge-text bg-red-400" />
            <span className="w-3 h-3 rounded-full border-2 border-forge-text bg-yellow-400" />
            <span className="w-3 h-3 rounded-full border-2 border-forge-text bg-green-400" />
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-forge-text-secondary/40">
            forge-interactive.ts
          </span>
        </div>

        {/* Morphing Shape inside the Card */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Inner Accent Shape: Neobrutalist Morpher */}
          <div
            className="w-28 h-28 md:w-36 md:h-36 border-4 border-forge-text bg-forge-accent shadow-[5px_5px_0px_0px_var(--forge-text)] animate-[morph_8s_ease-in-out_infinite] transition-transform duration-[400ms] ease-out"
            style={{
              transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0) rotate(${mousePos.x * 12}deg)`,
            }}
          />

          {/* Floating Circle Shape */}
          <div
            className="absolute w-10 h-10 rounded-full border-4 border-forge-text bg-white shadow-[3px_3px_0px_0px_var(--forge-text)] transition-transform duration-[500ms] ease-out"
            style={{
              top: "22%",
              left: "18%",
              transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`,
            }}
          />

          {/* Floating Triangle Shape */}
          <div
            className="absolute w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[30px] border-b-forge-text transition-transform duration-[450ms] ease-out"
            style={{
              bottom: "22%",
              right: "18%",
              transform: `translate3d(${mousePos.x * -12}px, ${mousePos.y * -12}px, 0) rotate(35deg)`,
            }}
          >
            <div className="absolute w-0 h-0 border-l-[13px] border-l-transparent border-r-[13px] border-r-transparent border-b-[22px] border-b-yellow-400 top-[5px] left-[-13px]" />
          </div>
        </div>

        {/* Card Footer (Mock Status Codes) */}
        <div className="border-t-2 border-forge-text pt-3.5 flex justify-between items-center text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-forge-text">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">Active</span>
          </div>
          <span className="text-forge-text-secondary/50 font-bold">STATE: MORPHING</span>
        </div>
      </motion.div>
    </div>
  );
}

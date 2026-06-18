"use client";

import React from "react";

/**
 * ForgeEmbers — pure CSS animated ember particles.
 * Glowing amber/orange dots that float upward slowly,
 * like embers rising from a forge fire.
 * Zero GPU overhead (no WebGL / canvas).
 */

interface Ember {
  id: number;
  x: number;         // horizontal start % (0–100)
  size: number;      // px diameter (2–6)
  duration: number;  // animation duration in seconds
  delay: number;     // animation delay in seconds
  drift: number;     // horizontal drift px (–30 to 30)
  opacity: number;   // peak opacity (0.35–0.85)
  hue: number;       // slight hue shift 0°–30° around amber
}

/* Deterministic-looking pseudo-random seeded by index */
function seeded(n: number, salt: number): number {
  return ((Math.sin(n * 127.1 + salt * 311.7) * 43758.5453) % 1 + 1) % 1;
}

const EMBER_COUNT = 48;

const embers: Ember[] = Array.from({ length: EMBER_COUNT }, (_, i) => ({
  id: i,
  x: seeded(i, 1) * 100,
  size: 2.5 + seeded(i, 2) * 5,        // 2.5–7.5px
  duration: 5 + seeded(i, 3) * 12,     // 5–17s
  delay: -(seeded(i, 4) * 16),          // stagger: already mid-flight
  drift: (seeded(i, 5) - 0.5) * 80,    // -40 to +40px horizontal
  opacity: 0.5 + seeded(i, 6) * 0.5,   // 0.5–1.0 (much more visible)
  hue: seeded(i, 7) * 35,              // 0–35° — amber to warm yellow
}));

export function ForgeEmbers({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      suppressHydrationWarning
    >
      <style suppressHydrationWarning>{`
        @keyframes ember-rise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          6% {
            opacity: var(--ember-opacity);
          }
          75% {
            opacity: var(--ember-opacity);
          }
          100% {
            transform: translateY(-110vh) translateX(var(--ember-drift)) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes ember-flicker {
          0%, 100% { box-shadow: 0 0 var(--ember-glow-sm) var(--ember-color), 0 0 var(--ember-glow-md) var(--ember-color-dim); }
          33%       { box-shadow: 0 0 var(--ember-glow-md) var(--ember-color), 0 0 var(--ember-glow-lg) var(--ember-color-dim); }
          66%       { box-shadow: 0 0 var(--ember-glow-sm) var(--ember-color), 0 0 var(--ember-glow-md) var(--ember-color-dim); }
        }
      `}</style>

      {embers.map((e) => {
        const color = `hsl(${25 + e.hue}deg 100% 62%)`;
        const colorDim = `hsl(${25 + e.hue}deg 100% 50% / 0.5)`;
        const glowSm = `${e.size * 2}px`;
        const glowMd = `${e.size * 4}px`;
        const glowLg = `${e.size * 7}px`;

        return (
          <span
            key={e.id}
            suppressHydrationWarning
            style={{
              position: "absolute",
              bottom: `-${e.size}px`,
              left: `${e.x}%`,
              width: `${e.size}px`,
              height: `${e.size}px`,
              borderRadius: "50%",
              backgroundColor: color,
              ["--ember-opacity" as string]: e.opacity,
              ["--ember-drift" as string]: `${e.drift}px`,
              ["--ember-color" as string]: color,
              ["--ember-color-dim" as string]: colorDim,
              ["--ember-glow-sm" as string]: glowSm,
              ["--ember-glow-md" as string]: glowMd,
              ["--ember-glow-lg" as string]: glowLg,
              animation: `
                ember-rise   ${e.duration}s ${e.delay}s linear infinite,
                ember-flicker ${(e.duration * 0.28).toFixed(1)}s ${e.delay}s ease-in-out infinite alternate
              `,
              willChange: "transform, opacity",
            }}
          />
        );
      })}

      {/* Warm radial glow at the bottom — like a heat source below the forge */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          height: "180px",
          background:
            "radial-gradient(ellipse at center bottom, rgba(255,106,0,0.2) 0%, rgba(255,80,0,0.08) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Secondary narrower hot-spot glow */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "40%",
          height: "80px",
          background:
            "radial-gradient(ellipse at center bottom, rgba(255,160,0,0.25) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

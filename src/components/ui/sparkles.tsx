"use client";

import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useMemo, useCallback } from "react";

interface SparklesProps {
  className?: string;
  size?: number;
  minSize?: number | null;
  density?: number;
  speed?: number;
  minSpeed?: number | null;
  opacity?: number;
  opacitySpeed?: number;
  minOpacity?: number | null;
  color?: string;
  background?: string;
  options?: Record<string, unknown>;
}

export function Sparkles({
  className,
  size = 1,
  minSize = null,
  density = 800,
  speed = 1,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 3,
  minOpacity = null,
  color = "#FFFFFF",
  background = "transparent",
  options = {},
}: SparklesProps) {
  const init = useCallback(async () => {
    await loadSlim();
  }, []);

  const defaultOptions = useMemo(
    () => ({
      background: {
        color: {
          value: background,
        },
      },
      fullScreen: {
        enable: false,
        zIndex: 1,
      },
      fpsLimit: 120,
      particles: {
        color: {
          value: color,
        },
        move: {
          enable: true,
          direction: "none",
          speed: {
            min: minSpeed || speed / 10,
            max: speed,
          },
          straight: false,
        },
        number: {
          value: density,
        },
        opacity: {
          value: {
            min: minOpacity || opacity / 10,
            max: opacity,
          },
          animation: {
            enable: true,
            sync: false,
            speed: opacitySpeed,
          },
        },
        size: {
          value: {
            min: minSize || size / 2.5,
            max: size,
          },
        },
      },
      detectRetina: true,
    }),
    [background, color, density, minOpacity, minSize, opacity, opacitySpeed, speed, minSpeed, size]
  );

  return (
    <ParticlesProvider init={init}>
      <Particles options={{ ...defaultOptions, ...options }} className={className} />
    </ParticlesProvider>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   Animated Shader Background
   ──────────────────────────────────────────────────
   GPU-driven aurora shader rendered via Three.js.
   Optimized: pauses offscreen, respects reduced-motion,
   uses ResizeObserver for container sizing.
   ═══════════════════════════════════════════════════ */

interface AnimatedShaderBackgroundProps {
  /** Opacity of the shader layer (0-1). Default: 0.35 */
  opacity?: number;
  /** Additional CSS classes for the container */
  className?: string;
  /** Blend mode — default: screen (lightens on dark bg) */
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
}

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float iTime;
  uniform vec2 iResolution;

  #define NUM_OCTAVES 3

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.3;
    vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.4;
    }
    return v;
  }

  void main() {
    vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
    vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
    vec2 v;
    vec4 o = vec4(0.0);

    float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

    for (float i = 0.0; i < 35.0; i++) {
      v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
      float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
      vec4 auroraColors = vec4(
        0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
        0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
        0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
        1.0
      );
      vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
      float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
      o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
    }

    o = tanh(pow(o / 100.0, vec4(1.6)));
    gl_FragColor = o * 1.5;
  }
`;

interface RenderState {
  renderer: THREE.WebGLRenderer;
  material: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  frameId: number;
  isVisible: boolean;
  reducedMotion: boolean;
  startTime: number;
}

export function AnimatedShaderBackground({
  opacity = 0.35,
  className = "",
  mixBlendMode = "screen",
}: AnimatedShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<RenderState | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* Respect reduced motion */
    const reducedMotion = typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

    /* ── Scene setup ── */
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
    });

    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const pr = renderer.getPixelRatio();

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(rect.width * pr, rect.height * pr) },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = performance.now();
    let isVisible = true;

    stateRef.current = {
      renderer,
      material,
      geometry,
      scene,
      camera,
      frameId: 0,
      isVisible: true,
      reducedMotion,
      startTime,
    };

    /* ── Animation loop ── */
    function animate() {
      const state = stateRef.current;
      if (!state || !state.isVisible || state.reducedMotion) return;

      const elapsed = (performance.now() - state.startTime) / 1000;
      state.material.uniforms.iTime.value = elapsed;

      state.renderer.render(state.scene, state.camera);
      state.frameId = requestAnimationFrame(animate);
    }

    if (!reducedMotion) {
      stateRef.current.frameId = requestAnimationFrame(animate);
    }

    /* ── ResizeObserver ── */
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const pixelRatio = renderer.getPixelRatio();
          renderer.setSize(width, height, false);
          stateRef.current?.material.uniforms.iResolution.value.set(
            width * pixelRatio,
            height * pixelRatio
          );
        }
      }
    });
    resizeObserver.observe(container);

    /* ── IntersectionObserver: pause when offscreen ── */
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (stateRef.current) {
          stateRef.current.isVisible = isVisible;
          if (isVisible && !stateRef.current.reducedMotion) {
            /* Recalculate startTime to avoid time jump */
            stateRef.current.startTime =
              performance.now() - stateRef.current.material.uniforms.iTime.value * 1000;
            animate();
          } else {
            cancelAnimationFrame(stateRef.current.frameId);
          }
        }
      },
      { rootMargin: "100px" }
    );
    intersectionObserver.observe(container);

    /* ── Cleanup ── */
    return () => {
      if (stateRef.current) {
        cancelAnimationFrame(stateRef.current.frameId);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      stateRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        opacity,
        mixBlendMode,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}

export default AnimatedShaderBackground;

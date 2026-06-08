"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════
   Cursor Context — shares mouse position across components
   ═══════════════════════════════════════════════════════════════ */

interface CursorContextValue {
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
  isHovering: boolean;
  setIsHovering: (v: boolean) => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

/* ═══════════════════════════════════════════════════════════════
   CursorProvider — tracks mouse position, provides to children
   ═══════════════════════════════════════════════════════════════ */

interface CursorProviderProps {
  children: ReactNode;
  /** If true, listens on `window`; otherwise on `document.documentElement` */
  global?: boolean;
}

export function CursorProvider({ children, global = false }: CursorProviderProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const target = global ? window : document.documentElement;
    target.addEventListener("mousemove", handleMove);
    return () => target.removeEventListener("mousemove", handleMove);
  }, [x, y, global]);

  return (
    <CursorContext.Provider value={{ x, y, isHovering, setIsHovering }}>
      {children}
      {/* Hide custom cursor on touch / coarse-pointer devices */}
      <style>{`@media (pointer: coarse) { .custom-cursor { display: none !important; } }`}</style>
    </CursorContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Cursor — small dot that follows the cursor with slight delay
   ═══════════════════════════════════════════════════════════════ */

interface CursorProps {
  className?: string;
}

/** Inner component — hooks are always called (no conditional return) */
function CursorInner({ ctx, className }: { ctx: CursorContextValue; className?: string }) {
  const springX = useSpring(ctx.x, { stiffness: 500, damping: 28 });
  const springY = useSpring(ctx.y, { stiffness: 500, damping: 28 });

  return (
    <motion.div
      className={cn(
        "custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference",
        className,
      )}
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{
          width: ctx.isHovering ? 12 : 6,
          height: ctx.isHovering ? 12 : 6,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

export function Cursor({ className }: CursorProps) {
  const ctx = useContext(CursorContext);
  if (!ctx) return null;
  return <CursorInner ctx={ctx} className={className} />;
}

/* ═══════════════════════════════════════════════════════════════
   CursorFollow — ring/outline that follows with more delay
   ═══════════════════════════════════════════════════════════════ */

export interface CursorFollowProps {
  children?: ReactNode;
  /** Which side the label appears on relative to the ring */
  side?: "top" | "bottom" | "left" | "right";
  /** Distance in px from the ring edge */
  sideOffset?: number;
  /** Horizontal alignment of the label */
  align?: "start" | "center" | "end";
  /** Fine-tune horizontal offset in px */
  alignOffset?: number;
  className?: string;
}

/** Inner component — hooks are always called (no conditional return) */
function CursorFollowInner({
  ctx,
  children,
  side = "bottom",
  sideOffset = 15,
  align = "end",
  alignOffset = 5,
  className,
}: CursorFollowProps & { ctx: CursorContextValue }) {
  const springX = useSpring(ctx.x, { stiffness: 150, damping: 15 });
  const springY = useSpring(ctx.y, { stiffness: 150, damping: 15 });

  // Direction multipliers for side / align
  const sideSign = side === "top" || side === "left" ? -1 : 1;
  const alignSign = align === "start" ? -1 : align === "center" ? 0 : 1;

  const offsetY = sideSign * sideOffset;
  const offsetX = alignSign * alignOffset;

  return (
    <motion.div
      className={cn(
        "custom-cursor pointer-events-none fixed top-0 left-0 z-[9998]",
        className,
      )}
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="rounded-full border border-white/60 flex items-center justify-center px-2 py-1 backdrop-blur-sm bg-black/20"
        animate={{
          scale: ctx.isHovering ? 1.1 : 1,
          opacity: ctx.isHovering ? 1 : 0.7,
        }}
        transition={{ duration: 0.3 }}
        style={{
          translateX: `calc(-50% + ${offsetX}px)`,
          translateY: `calc(-50% + ${offsetY}px)`,
        }}
      >
        {children && (
          <span className="text-[11px] font-medium text-white whitespace-nowrap tracking-wide">
            {children}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

export function CursorFollow({
  children,
  side = "bottom",
  sideOffset = 15,
  align = "end",
  alignOffset = 5,
  className,
}: CursorFollowProps) {
  const ctx = useContext(CursorContext);
  if (!ctx) return null;
  return (
    <CursorFollowInner
      ctx={ctx}
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      className={className}
    >
      {children}
    </CursorFollowInner>
  );
}

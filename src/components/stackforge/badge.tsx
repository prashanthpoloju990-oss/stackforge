import React from "react";

interface StackForgeBadgeProps {
  variant?: "dark" | "light" | "minimal";
  className?: string;
}

export function StackForgeBadge({ variant = "dark", className = "" }: StackForgeBadgeProps) {
  const isDark = variant === "dark";

  return (
    <a
      href="https://stackforge.co.in?utm_source=client_footer&utm_medium=badge"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[11px] font-medium tracking-wide transition-all duration-300 group cursor-pointer ${
        isDark
          ? "bg-[#0C0C0F] text-neutral-300 border border-neutral-800 hover:border-[#FF6A00]/50 hover:shadow-[0_0_15px_rgba(255,106,0,0.25)]"
          : "bg-white text-neutral-700 border border-neutral-200 hover:border-[#FF6A00]/50 hover:shadow-md"
      } ${className}`}
      title="Engineered by StackForge Studio"
    >
      <span className="flex h-2 w-2 relative shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]" />
      </span>
      <span>
        Built with{" "}
        <strong className="text-white group-hover:text-[#FF6A00] transition-colors font-extrabold tracking-wider">
          STACKFORGE
        </strong>
      </span>
      <svg
        className="w-3 h-3 text-neutral-400 group-hover:text-[#FF6A00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  );
}

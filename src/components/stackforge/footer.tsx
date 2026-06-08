"use client";

import * as React from "react";
import Image from "next/image";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const Lightfall = dynamic(() => import("@/components/ui/lightfall"), {
  ssr: false,
  loading: () => null,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleBlur = () => {
    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setError("Enter a valid email");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Network error");
    }
  };

  return (
    <footer className="relative bg-forge-bg border-t border-forge-divider pb-[env(safe-area-inset-bottom,0px)] overflow-hidden">
      {/* Lightfall shader background */}
      <div className="absolute inset-0 pointer-events-none lightfall-wrap" aria-hidden="true">
        <Lightfall
          colors={["#FF6A00", "#FF9F43", "#FFD93D"]}
          backgroundColor="#09090B"
          speed={0.3}
          streakCount={4}
          streakWidth={0.8}
          streakLength={0.7}
          glow={0.8}
          density={0.4}
          twinkle={0.6}
          zoom={3}
          backgroundGlow={0.3}
          opacity={0.18}
          mouseInteraction={false}
          mixBlendMode="screen"
          className="absolute inset-0"
        />
      </div>

      {/* Ambient gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255, 106, 0, 0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-20 pt-14 sm:pt-16 md:pt-20 pb-6 md:pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16 lg:gap-24">
          {/* Left — Brand */}
          <div>
            <a href="#home" className="inline-block">
              <Image src="/logo.jpg" alt="StackForge" width={120} height={28} className="h-7 w-auto" />
            </a>
            <p className="mt-4 text-[20px] text-forge-accent/50 leading-relaxed max-w-[240px] font-curvy">
              We build. You grow.
            </p>
            <p className="mt-3 text-[13px] text-forge-text-secondary/30 leading-[1.6] max-w-[260px]">
              Premium web development studio based in Hyderabad. We craft fast, beautiful, scalable digital products.
            </p>

            {/* Social links placeholder */}
            <div className="mt-6 flex items-center gap-3">
              {["X", "Li", "Gh"].map((label) => (
                <span
                  key={label}
                  className="w-11 h-11 rounded-md border border-forge-divider flex items-center justify-center text-fluid-micro text-forge-text-secondary/30 hover:text-forge-text/60 hover:border-forge-border transition-all duration-200 cursor-pointer"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Newsletter signup */}
            <div className="mt-8">
              <span className="text-[13px] text-forge-text/40 font-medium block mb-3">
                Stay updated
              </span>
              {status === "success" ? (
                <div className="flex items-center gap-2 text-[13px] text-green-500">
                  <CheckCircle2 className="size-4" />
                  <span>You&apos;re in!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      onBlur={handleBlur}
                      placeholder="you@email.com"
                      disabled={status === "submitting"}
                      className="w-full h-11 rounded-md border border-forge-divider bg-forge-bg/50 px-3 py-1 text-[13px] text-forge-text placeholder:text-forge-text-secondary/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forge-accent/40 focus-visible:border-forge-accent/40 transition-all duration-200 disabled:opacity-50"
                      aria-label="Email for newsletter"
                    />
                    <Mail className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-forge-text-secondary/20" />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="h-11 px-4 rounded-md bg-forge-accent text-white text-[13px] font-medium hover:bg-forge-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>
              )}
              {error && (
                <p className="mt-1.5 text-[11px] text-red-400/80 leading-relaxed">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Right — 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-fluid-micro text-forge-text/40 font-medium tracking-[0.12em] uppercase font-mono">
                Pages
              </span>
              {[
                { label: "Home", href: "#home" },
                { label: "Services", href: "#services" },
                { label: "Work", href: "#work" },
                { label: "Process", href: "#process" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-forge-text-secondary/50 hover:text-forge-text transition-colors duration-200 py-0.5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-fluid-micro text-forge-text/40 font-medium tracking-[0.12em] uppercase font-mono">
                Services
              </span>
              {[
                { label: "Kit", href: "#services" },
                { label: "Pack", href: "#services" },
                { label: "Bag", href: "#services" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-forge-text-secondary/50 hover:text-forge-accent/70 transition-colors duration-200 py-0.5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-fluid-micro text-forge-text/40 font-medium tracking-[0.12em] uppercase font-mono">
                Contact
              </span>
              <a
                href="mailto:hello@stackforge.dev"
                className="text-[13px] text-forge-text-secondary/50 hover:text-forge-text transition-colors duration-200 py-0.5 break-all"
              >
                hello@stackforge.dev
              </a>
              <span className="text-[13px] text-forge-text-secondary/30">
                Hyderabad, India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-14 md:mt-16 pt-5 border-t border-forge-divider/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[12px] text-forge-text-secondary/20">
            © {currentYear} StackForge. All rights reserved.
          </span>
          <span className="text-fluid-micro text-forge-text-secondary/15 font-mono">
            Built with Next.js & Tailwind
          </span>
        </div>
      </div>
    </footer>
  );
}

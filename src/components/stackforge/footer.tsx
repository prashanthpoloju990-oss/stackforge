"use client";

import * as React from "react";
import Image from "next/image";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import Ballpit from "@/components/ui/ballpit";

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
      {/* Interactive Ballpit animation */}
      <div className="absolute inset-0 z-0">
        <Ballpit
          count={100}
          gravity={0.4}
          friction={0.99}
          wallBounce={0.9}
          followCursor={true}
          colors={[0xff5500, 0xffaa00, 0xff2200]}
          ambientColor={0xffffff}
          ambientIntensity={1}
          lightIntensity={200}
        />
      </div>

      {/* Text-readability overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(9,9,11,0.82)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-20 pt-14 sm:pt-16 md:pt-20 pb-6 md:pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16 lg:gap-24">
          {/* Left — Brand */}
          <div>
            <a href="#home" className="inline-block">
              <Image src="/stackforge-logo.jpg" alt="StackForge" width={56} height={56} className="h-12 w-auto object-contain" loading="lazy" />
            </a>
            <p className="mt-4 text-[20px] text-forge-accent/80 leading-relaxed max-w-[240px] font-curvy">
              We build. You grow.
            </p>
            <p className="mt-3 text-[13px] text-forge-text-secondary/70 leading-[1.6] max-w-[260px]">
              Premium web development studio based in Hyderabad. We craft fast, beautiful, scalable digital products.
            </p>

            {/* Social links placeholder */}
            <div className="mt-6 flex items-center gap-3">
              {["X", "Li", "Gh"].map((label) => (
                <span
                  key={label}
                  className="w-11 h-11 rounded-md border border-forge-divider/60 flex items-center justify-center text-fluid-micro text-forge-text-secondary/60 hover:text-forge-text hover:border-forge-border transition-all duration-200 cursor-pointer"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Newsletter signup */}
            <div className="mt-8">
              <span className="text-[13px] text-forge-text/70 font-medium block mb-3">
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
                    aria-label="Subscribe to newsletter"
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
                { label: "Pricing", href: "#pricing" },
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
                Pricing
              </span>
              {[
                { label: "Launch Kit", href: "#pricing" },
                { label: "Growth Pack", href: "#pricing" },
                { label: "Enterprise Bag", href: "#pricing" },
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
                href="mailto:support@stackforge.co.in"
                className="text-[13px] text-forge-text-secondary/50 hover:text-forge-text transition-colors duration-200 py-0.5 break-all"
              >
                support@stackforge.co.in
              </a>
              <span className="text-[13px] text-forge-text-secondary/30">
                Hyderabad, India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-14 md:mt-16 pt-5 border-t border-forge-divider/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[12px] text-forge-text-secondary/50">
            © {currentYear} StackForge. All rights reserved.
          </span>
          <span className="text-fluid-micro text-forge-text-secondary/40 font-mono">
            Built with Next.js & Tailwind
          </span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, CheckCircle2, Loader2, Instagram, Linkedin } from "lucide-react";

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/") {
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      }
      return;
    }
    if (href.includes("#")) {
      const targetId = href.split("#")[1];
      const element = document.getElementById(targetId);
      if (element && typeof window !== "undefined" && window.location.pathname === "/") {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <footer className="relative bg-forge-bg border-t border-forge-divider pb-[env(safe-area-inset-bottom,0px)] overflow-hidden">
      {/* Silhouette Horizon Skyline background */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden opacity-60 dark:opacity-20 flex items-end">
        <svg
          className="w-full h-[140px] md:h-[180px] text-forge-accent/5 dark:text-forge-accent/15"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          {/* City skyline buildings */}
          <path d="M0,180 L20,180 L20,165 L35,165 L35,180 L55,180 L55,145 L80,145 L80,180 L95,180 L95,130 L130,130 L130,180 L145,180 L145,155 L175,155 L175,180 L195,180 L195,110 L235,110 L235,180 L250,180 L250,150 L285,150 L285,180 L305,180 L305,95 L345,95 L345,180 L360,180 L360,135 L395,135 L395,180 L415,180 L415,120 L445,120 L445,180 L465,180 L465,85 L515,85 L515,180 L530,180 L530,140 L565,140 L565,180 L585,180 L585,115 L625,115 L625,180 L640,180 L640,150 L675,150 L675,180 L695,180 L695,100 L735,100 L735,180 L750,180 L750,130 L785,130 L785,180 L805,180 L805,110 L845,110 L845,180 L860,180 L860,145 L895,145 L895,180 L915,180 L915,90 L955,90 L955,180 L970,180 L970,125 L1005,125 L1005,180 L1025,180 L1025,115 L1065,115 L1065,180 L1080,180 L1080,145 L1115,145 L1115,180 L1135,180 L1135,100 L1175,100 L1175,180 L1190,180 L1190,130 L1225,130 L1225,180 L1245,180 L1245,110 L1285,110 L1285,180 L1300,180 L1300,145 L1335,145 L1335,180 L1350,180 L1350,105 L1390,105 L1390,180 L1410,180 L1410,140 L1440,140 L1440,320 L0,320 Z" opacity="0.35" />

          {/* Foreground rolling hills */}
          <path d="M0,230 Q360,200 720,250 T1440,230 L1440,320 L0,320 Z" opacity="0.5" />

          {/* Winding river/road */}
          <path d="M720,320 Q660,280 720,250 T800,185 L780,185 Q760,240 700,270 T660,320 Z" fill="var(--forge-bg)" opacity="0.95" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-20 pt-10 pb-5">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-12">
          {/* Left — Brand */}
          <div>
            <Link href="/" onClick={(e) => handleNavClick(e, "/")} className="inline-block">
              <Image src="/stackforge-logo.jpg" alt="StackForge" width={48} height={48} className="h-10 w-auto object-contain rounded" loading="lazy" />
            </Link>
            <p className="mt-3 text-[18px] text-forge-accent/80 leading-relaxed max-w-[240px] font-curvy">
              We build. You grow.
            </p>
            <p className="mt-2 text-[12px] text-forge-text-secondary/70 leading-[1.5] max-w-[260px]">
              Premium web development studio based in Hyderabad. We craft fast, beautiful, scalable digital products.
            </p>

            {/* Social links */}
            <div className="mt-4 flex items-center gap-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/stackforge.co.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded border border-forge-divider/60 flex items-center justify-center text-forge-text-secondary/60 hover:text-forge-accent hover:border-forge-accent/40 hover:bg-forge-accent/[0.03] transition-all duration-250 cursor-pointer shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/stackforge-co-in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded border border-forge-divider/60 flex items-center justify-center text-forge-text-secondary/60 hover:text-forge-accent hover:border-forge-accent/40 hover:bg-forge-accent/[0.03] transition-all duration-250 cursor-pointer shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/STACKFORGE1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded border border-forge-divider/60 flex items-center justify-center text-forge-text-secondary/60 hover:text-forge-text hover:border-forge-text/40 hover:bg-forge-text/[0.03] transition-all duration-250 cursor-pointer shadow-sm"
                aria-label="X (formerly Twitter)"
              >
                <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Newsletter signup */}
            <div className="mt-6">
              <span className="text-[12px] text-forge-text/75 font-medium block mb-2 px-1">
                Stay updated
              </span>
              {status === "success" ? (
                <div className="flex items-center gap-2 text-[12px] text-green-500 px-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>You&apos;re in!</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="relative flex items-center justify-between border border-forge-divider bg-forge-surface/30 rounded-full pl-3.5 pr-1.5 py-1 w-full max-w-full sm:max-w-[300px] focus-within:border-forge-accent/50 focus-within:ring-2 focus-within:ring-forge-accent/10 transition-all duration-300 group shadow-inner"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                    disabled={status === "submitting"}
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-[12px] text-forge-text placeholder:text-forge-text-secondary/35 h-7 pr-2"
                    aria-label="Email for newsletter"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="h-9 px-4 rounded-full bg-forge-accent text-white text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-forge-accent/95 active:scale-95 transition-all duration-300 shrink-0 shadow-md shadow-forge-accent/15 hover:shadow-forge-accent/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    aria-label="Subscribe to newsletter"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <>
                        <span>Join</span>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 14 14"
                          fill="none"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <path
                            d="M1 7H13M13 7L8 2M13 7L8 12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
              {error && (
                <p className="mt-1.5 px-1 text-[10px] text-red-400/80 leading-relaxed">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Right — 3 Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-4 md:mt-0">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-forge-text/40 font-medium tracking-[0.12em] uppercase font-mono mb-1">
                Pages
              </span>
              {[
                { label: "Home", href: "/" },
                { label: "Work", href: "/#work" },
                { label: "Process", href: "/#process" },
                { label: "Pricing", href: "/#pricing" },
                { label: "FAQ", href: "/#faq" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[12px] text-forge-text-secondary/50 hover:text-forge-text transition-colors duration-200 py-0.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-forge-text/40 font-medium tracking-[0.12em] uppercase font-mono mb-1">
                Pricing
              </span>
              {[
                { label: "Launch Kit", href: "/#pricing" },
                { label: "Growth Pack", href: "/#pricing" },
                { label: "Enterprise", href: "/#pricing" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[12px] text-forge-text-secondary/50 hover:text-forge-accent/70 transition-colors duration-200 py-0.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-forge-text/40 font-medium tracking-[0.12em] uppercase font-mono mb-1">
                Contact
              </span>
              <a
                href="mailto:support@stackforge.co.in?subject=Inquiry%20regarding%20Web%20Development%20Services%20-%20StackForge&body=Hello%20StackForge%20Team%2C%0A%0AI%20would%20like%20to%20inquire%20about%20your%20web%20development%20services.%20%0A%0AHere%20are%20some%20details%20about%20my%20project%3A%0A-%20Project%20Name%3A%20%0A-%20Project%20Type%20(e.g.%20Website%2C%20Web%20App%2C%20E-commerce)%3A%20%0A-%20Target%20Timeline%3A%20%0A-%20Estimated%20Budget%3A%20%0A-%20Any%20specific%20features%20or%20requirements%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D%0A%5BYour%20Company%5D%0A%5BYour%20Phone%20Number%5D"
                className="text-[12px] text-forge-text-secondary/50 hover:text-forge-text transition-colors duration-200 py-0.5 break-all leading-tight"
              >
                support@stackforge.co.in
              </a>
              <span className="text-[12px] text-forge-text-secondary/30 leading-tight">
                Hyderabad, India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-forge-divider/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[11px] text-forge-text-secondary/50">
            <span>© {currentYear} StackForge. All rights reserved.</span>
            <span className="hidden sm:inline text-forge-divider/60">|</span>
            <Link href="/terms" className="hover:text-forge-text transition-colors duration-200">
              Terms & Conditions
            </Link>
            <span className="hidden sm:inline text-forge-divider/60">|</span>
            <Link href="/privacy" className="hover:text-forge-text transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
          <span className="text-[10px] text-forge-text-secondary/40 font-mono">
            Built with passion and love
          </span>
        </div>
      </div>

      {/* Giant Watermark Brand Text */}
      <div className="w-full text-center select-none pointer-events-none mt-6 -mb-2 overflow-hidden pb-4 relative z-0">
        <span className="text-[11vw] sm:text-[9vw] md:text-[8.5vw] lg:text-[8vw] font-extrabold tracking-tighter text-black/[0.12] dark:text-white/[0.08] uppercase block font-syne leading-none transition-colors duration-500">
          STACKFORGE
        </span>
      </div>
    </footer>
  );
}

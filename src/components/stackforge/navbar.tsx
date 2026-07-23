"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { MagneticWrapper } from "@/components/ui/magnetic-button";
import { BlobButton } from "@/components/ui/blob-button";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight, CheckCircle2 } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/start-project" },
];

export function Navbar() {
  const { scrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFormFilling, setIsFormFilling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const pathname = usePathname();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const isFillingInput = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      const tagName = el.tagName;
      if (tagName === "TEXTAREA" || tagName === "SELECT") return true;
      if (tagName === "INPUT") {
        const type = (el as HTMLInputElement).type;
        return !["checkbox", "radio", "button", "submit", "image", "reset", "file"].includes(type);
      }
      return false;
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (isFillingInput(target)) {
        setIsFormFilling(true);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!isFillingInput(active)) {
          setIsFormFilling(false);
        }
      }, 100);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  const hideGetInTouch = pathname === "/start-project" || isFormFilling;

  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  /* ── Body scroll lock when mobile menu is open ── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ── Focus trap and Escape key for mobile menu ── */
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, closeMenu]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/") {
      if (typeof window !== "undefined" && pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      }
      return;
    }
    if (href.includes("#")) {
      const targetId = href.split("#")[1];
      const element = document.getElementById(targetId);
      if (element && typeof window !== "undefined" && pathname === "/") {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  const isFloating = scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none flex justify-center w-full",
        isFloating ? "pt-4 bg-transparent border-b-0" : "pt-0 bg-forge-bg/85 backdrop-blur-md border-b border-forge-divider/40"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between relative z-50 w-full max-w-[1200px] px-6 md:px-20",
          isFloating ? "h-14 pointer-events-none" : "h-16 md:h-[72px]"
        )}
      >
        {/* Logo Capsule */}
        <div
          className={cn(
            "pointer-events-auto flex items-center justify-center transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] absolute top-1/2 -translate-y-1/2 left-6 md:left-20",
            isFloating
              ? "w-[50px] h-[50px] md:w-[54px] md:h-[54px] rounded-full border border-forge-divider/80 bg-forge-bg/75 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/25"
              : "w-10 h-10 md:w-12 md:h-12 rounded-none border-transparent bg-transparent shadow-none"
          )}
        >
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center justify-center"
          >
            <Image
              src="/stackforge-logo.jpg"
              alt="StackForge"
              width={48}
              height={48}
              className={cn(
                "rounded-full object-cover border border-forge-divider transition-all duration-[1000ms]",
                isFloating ? "h-9 w-9 md:h-10 md:w-10" : "h-10 w-10 md:h-12 md:w-12"
              )}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation Capsule */}
        <div
          className={cn(
            "hidden md:flex items-center transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] justify-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-auto",
            isFloating
              ? "h-[54px] rounded-full border border-forge-divider/80 bg-forge-bg/75 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/25 px-8 gap-6"
              : "h-[72px] rounded-none border-transparent bg-transparent shadow-none px-0 gap-8"
          )}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-forge-text-secondary/60 transition-colors duration-200 hover:text-forge-text link-underline font-mono tracking-widest text-[11px] font-semibold uppercase"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions Capsule */}
        <div
          className={cn(
            "hidden md:flex items-center transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] justify-center absolute top-1/2 -translate-y-1/2 right-6 md:right-20 pointer-events-auto",
            isFloating
              ? "h-[54px] rounded-full border border-forge-divider/80 bg-forge-bg/75 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/25 px-5 gap-3"
              : "h-[72px] rounded-none border-transparent bg-transparent shadow-none px-0 gap-2"
          )}
        >
          <ThemeToggle />
          <div
            className={cn(
              "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex items-center justify-center",
              hideGetInTouch
                ? "max-w-0 opacity-0 scale-95 pointer-events-none -mr-2"
                : "max-w-[170px] opacity-100 scale-100"
            )}
          >
            <MagneticWrapper>
              <BlobButton
                asChild
                variant="popular"
                className={cn(
                  "btn-primary inline-flex items-center justify-center bg-forge-accent text-white font-semibold uppercase rounded-md transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap",
                  isFloating
                    ? "h-9 px-4 text-[10px] tracking-wider"
                    : "h-fluid-btn-sm px-5 text-fluid-btn"
                )}
              >
                <Link href="/start-project">
                  Get in Touch
                </Link>
              </BlobButton>
            </MagneticWrapper>
          </div>
        </div>

        {/* Mobile Actions Capsule */}
        <div
          className={cn(
            "md:hidden flex items-center transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] justify-center absolute top-1/2 -translate-y-1/2 right-6 pointer-events-auto",
            isFloating
              ? "h-[50px] rounded-full border border-forge-divider/80 bg-forge-bg/75 backdrop-blur-md shadow-lg px-3 gap-2"
              : "h-10 rounded-none border-transparent bg-transparent shadow-none px-0 gap-2"
          )}
        >
          <ThemeToggle />
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col items-center justify-center w-11 h-11 gap-[5px] text-forge-text transition-all duration-300 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-accent rounded-full"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                "block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center",
                mobileOpen && "rotate-45 translate-y-[3.25px]"
              )}
            />
            <span
              className={cn(
                "block w-5 h-[1.5px] bg-current transition-all duration-300",
                mobileOpen && "opacity-0 scale-0"
              )}
            />
            <span
              className={cn(
                "block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center",
                mobileOpen && "-rotate-45 -translate-y-[3.25px]"
              )}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Portal ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={overlayRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-0 z-[100] bg-forge-bg/95 dark:bg-forge-bg/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Sticky Top Header inside Portal */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-forge-divider/30 bg-forge-bg/90 backdrop-blur-md">
                <Link
                  href="/"
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleNavClick(e, "/");
                  }}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/stackforge-logo.jpg"
                    alt="StackForge"
                    width={36}
                    height={36}
                    className="rounded-full object-cover border border-forge-divider"
                  />
                  <div className="flex flex-col">
                    <span className="font-syne font-bold text-sm tracking-wider text-forge-text uppercase">
                      StackForge
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-500 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available
                    </span>
                  </div>
                </Link>

                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-10 h-10 rounded-full border border-forge-divider/80 bg-forge-surface/50 text-forge-text flex items-center justify-center transition-colors hover:bg-forge-surface hover:border-forge-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-accent"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex flex-col flex-1 px-6 pt-6 pb-8 space-y-8">
                {/* Navigation Links */}
                <div>
                  <span className="text-[10px] font-mono text-forge-accent uppercase tracking-[0.2em] block mb-3 font-semibold">
                    01 // Navigation
                  </span>
                  <div className="flex flex-col space-y-1">
                    {NAV_LINKS.map((link, idx) => {
                      const isActive = pathname === link.href || (pathname === "/" && link.href.startsWith("/#"));
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * idx, duration: 0.3 }}
                        >
                          <Link
                            href={link.href}
                            onClick={(e) => {
                              setMobileOpen(false);
                              handleNavClick(e, link.href);
                            }}
                            className={cn(
                              "group flex items-center justify-between py-3.5 px-3 rounded-xl transition-all duration-200 touch-manipulation",
                              isActive
                                ? "bg-forge-accent/10 text-forge-accent font-semibold"
                                : "text-forge-text/80 hover:text-forge-text hover:bg-forge-surface/50"
                            )}
                          >
                            <div className="flex items-center gap-3.5">
                              <span className="text-xs font-mono text-forge-accent/60 group-hover:text-forge-accent transition-colors">
                                0{idx + 1}
                              </span>
                              <span className="text-2xl font-syne font-medium tracking-wide">
                                {link.label}
                              </span>
                            </div>
                            <ArrowUpRight className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              isActive ? "text-forge-accent opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                            )} />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Agency Highlights & Actions Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  className="border border-forge-divider/60 rounded-2xl bg-forge-surface/30 p-5 space-y-4 relative overflow-hidden backdrop-blur-md"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-forge-accent uppercase tracking-[0.15em] font-semibold">
                      Why StackForge?
                    </span>
                    <p className="text-xs text-forge-text-secondary leading-relaxed font-sans">
                      High-performance, custom digital platforms built for ambitious startups. We don't cut corners.
                    </p>
                  </div>

                  {/* Metrics strip */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-forge-divider/30 text-center">
                    <div>
                      <span className="block text-base font-bold font-mono text-forge-text">100%</span>
                      <span className="block text-[9px] text-forge-text-secondary/70 uppercase font-mono">Lighthouse</span>
                    </div>
                    <div className="border-x border-forge-divider/30">
                      <span className="block text-base font-bold font-mono text-forge-text">10+</span>
                      <span className="block text-[9px] text-forge-text-secondary/70 uppercase font-mono">Shipped</span>
                    </div>
                    <div>
                      <span className="block text-base font-bold font-mono text-forge-text">&lt;24h</span>
                      <span className="block text-[9px] text-forge-text-secondary/70 uppercase font-mono">Response</span>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <Link
                    href="/start-project"
                    onClick={() => setMobileOpen(false)}
                    className="w-full h-12 bg-forge-accent hover:bg-forge-accent-hover text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-forge-accent/20 transition-all active:scale-[0.98] touch-manipulation"
                  >
                    Start a Project
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  {/* Contact & Social Links */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          navigator.clipboard.writeText("hello@stackforge.co.in");
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 2000);
                        }
                      }}
                      className="text-xs font-mono text-forge-text-secondary hover:text-forge-accent transition-colors flex items-center gap-1.5 focus:outline-none"
                    >
                      {copiedEmail ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <span>hello@stackforge.co.in</span>
                      )}
                    </button>

                    <div className="flex items-center gap-2.5 text-xs font-mono text-forge-text-secondary">
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-forge-accent transition-colors">GH</a>
                      <span className="opacity-30">•</span>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-forge-accent transition-colors">LN</a>
                      <span className="opacity-30">•</span>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-forge-accent transition-colors">TW</a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}


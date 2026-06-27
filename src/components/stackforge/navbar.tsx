"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { MagneticWrapper } from "@/components/ui/magnetic-button";
import { BlobButton } from "@/components/ui/blob-button";
import { motion, AnimatePresence } from "motion/react";

const menuVariants = {
  closed: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
} as const;

const linkVariants = {
  closed: {
    opacity: 0,
    y: 15,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
} as const;

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
  const pathname = usePathname();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
        setIsFormFilling(true);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active || !(active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT")) {
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

  /* ── Focus trap for mobile menu ── */
  useEffect(() => {
    if (!mobileOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = Array.from(
        overlay.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>(
          'a[href], button:not([disabled])'
        )
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Auto-focus first nav link when menu opens
    const firstFocusable = overlay.querySelector<HTMLAnchorElement>(
      'a[href], button:not([disabled])'
    );
    if (firstFocusable) {
      // Small delay to allow transition to start
      requestAnimationFrame(() => firstFocusable.focus());
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, closeMenu]);

  const isFloating = scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none flex justify-center contain-layout",
        isFloating ? "pt-4" : "pt-0"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between relative z-50",
          isFloating
            ? "w-full max-w-[1200px] bg-transparent border-none shadow-none px-6 md:px-20 h-14 pointer-events-none"
            : "w-full max-w-[1200px] rounded-none border-b border-forge-divider/30 bg-forge-bg/60 backdrop-blur-sm px-6 md:px-20 h-16 md:h-[72px]"
        )}
      >
        {/* Logo Capsule */}
        <div
          className={cn(
            "pointer-events-auto flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] absolute top-1/2 -translate-y-1/2 left-6 md:left-20",
            isFloating
              ? "w-[50px] h-[50px] md:w-[54px] md:h-[54px] rounded-full border border-forge-divider/80 bg-forge-bg/75 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/25"
              : "w-10 h-10 md:w-12 md:h-12 rounded-none border-transparent bg-transparent shadow-none"
          )}
        >
          <Link
            href="/"
            className="flex items-center justify-center"
          >
            <Image
              src="/stackforge-logo.jpg"
              alt="StackForge"
              width={48}
              height={48}
              className={cn(
                "rounded-full object-cover border border-forge-divider transition-all duration-[1200ms]",
                isFloating ? "h-9 w-9 md:h-10 md:w-10" : "h-10 w-10 md:h-12 md:w-12"
              )}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation Capsule */}
        <div
          className={cn(
            "hidden md:flex items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] justify-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-auto",
            isFloating
              ? "h-[54px] rounded-full border border-forge-divider/80 bg-forge-bg/75 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/25 px-8 gap-6"
              : "h-[72px] rounded-none border-transparent bg-transparent shadow-none px-0 gap-8"
          )}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-forge-text-secondary/60 transition-colors duration-200 hover:text-forge-text link-underline font-mono tracking-widest text-[11px] font-semibold uppercase"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions Capsule */}
        <div
          className={cn(
            "hidden md:flex items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] justify-center absolute top-1/2 -translate-y-1/2 right-6 md:right-20 pointer-events-auto",
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
                  "btn-primary inline-flex items-center justify-center bg-forge-accent text-white font-semibold uppercase rounded-md transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap",
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
            "md:hidden flex items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] justify-center absolute top-1/2 -translate-y-1/2 right-6 pointer-events-auto",
            isFloating
              ? "h-[50px] rounded-full border border-forge-divider/80 bg-forge-bg/75 backdrop-blur-md shadow-lg px-3 gap-2"
              : "h-10 rounded-none border-transparent bg-transparent shadow-none px-0 gap-2"
          )}
        >
          <ThemeToggle />
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col items-center justify-center w-11 h-11 gap-[5px] text-forge-text transition-all duration-300 touch-manipulation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                "block w-[18px] h-[1.5px] bg-current transition-all duration-300 origin-center",
                mobileOpen && "rotate-45 translate-y-[3.25px]"
              )}
            />
            <span
              className={cn(
                "block w-[18px] h-[1.5px] bg-current transition-all duration-300",
                mobileOpen && "opacity-0 scale-0"
              )}
            />
            <span
              className={cn(
                "block w-[18px] h-[1.5px] bg-current transition-all duration-300 origin-center",
                mobileOpen && "-rotate-45 -translate-y-[3.25px]"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden fixed inset-0 z-40 bg-[#040407]/95 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-[max(2rem,env(safe-area-inset-bottom,2rem))] px-6 overflow-y-auto"
          >
            {/* Top section: Staggered navigation links */}
            <div className="flex flex-col gap-4 mt-4">
              <span className="text-[10px] font-mono text-forge-accent/60 uppercase tracking-[0.15em] mb-2 px-1">
                Navigation
              </span>
              {NAV_LINKS.map((link) => (
                <motion.div key={link.href} variants={linkVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-[24px] xs:text-[28px] text-forge-text-secondary/80 font-medium font-syne tracking-wide transition-colors duration-200 hover:text-forge-text block py-2 px-1 border-b border-forge-divider/10 touch-manipulation"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom section: Trust Card & Contact */}
            <motion.div
              variants={linkVariants}
              className="mt-8 border border-forge-divider/60 rounded-xl bg-forge-surface/20 p-5 flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div
                className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--forge-accent) 0%, transparent 70%)" }}
              />
              
              <div>
                <span className="text-[9px] font-mono text-forge-accent/70 uppercase tracking-[0.12em] block mb-1">
                  Why StackForge?
                </span>
                <p className="text-[12px] text-forge-text-secondary/70 leading-relaxed font-sans">
                  Startups choose us to build fast, custom, and highly secure digital platforms. We don't cut corners.
                </p>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-forge-divider/30">
                <div>
                  <span className="block text-[15px] font-bold font-mono text-forge-text">100%</span>
                  <span className="block text-[8px] text-forge-text-secondary/50 uppercase font-mono">Lighthouse</span>
                </div>
                <div>
                  <span className="block text-[15px] font-bold font-mono text-forge-text">10+</span>
                  <span className="block text-[8px] text-forge-text-secondary/50 uppercase font-mono">Shipped</span>
                </div>
                <div>
                  <span className="block text-[15px] font-bold font-mono text-forge-text">&lt;24h</span>
                  <span className="block text-[8px] text-forge-text-secondary/50 uppercase font-mono">Response</span>
                </div>
              </div>

              {/* Action and social links */}
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/start-project"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-12 bg-forge-accent hover:bg-forge-accent-hover text-white text-[12px] font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center transition-all duration-300 touch-manipulation"
                >
                  Start a Project
                </Link>
                <div className="flex justify-between items-center px-1 mt-1">
                  <span className="text-[10px] text-forge-text-secondary/40 font-mono">hello@stackforge.com</span>
                  <div className="flex gap-3">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-forge-text-secondary/50 hover:text-forge-accent font-mono transition-colors">GH</a>
                    <span className="text-forge-text-secondary/20">|</span>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-forge-text-secondary/50 hover:text-forge-accent font-mono transition-colors">LN</a>
                    <span className="text-forge-text-secondary/20">|</span>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-forge-text-secondary/50 hover:text-forge-accent font-mono transition-colors">TW</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

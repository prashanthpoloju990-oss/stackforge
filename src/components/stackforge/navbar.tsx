"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { MagneticWrapper } from "@/components/ui/magnetic-button";
import { BlobButton } from "@/components/ui/blob-button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/#about" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/start-project" },
];

export function Navbar() {
  const { scrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
          "pointer-events-auto transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between relative",
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
          <MagneticWrapper>
            <BlobButton
              asChild
              variant="popular"
              className={cn(
                "btn-primary inline-flex items-center justify-center bg-forge-accent text-white font-semibold uppercase rounded-md transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
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
            className="flex flex-col items-center justify-center w-10 h-10 gap-[5px] text-forge-text transition-all duration-300"
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
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "md:hidden fixed inset-0 top-16 bg-forge-bg/95 backdrop-blur-md transition-all duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-6 pt-12 sm:pt-16">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-fluid-h3 text-forge-text-secondary/60 font-medium tracking-[0.08em] transition-colors duration-200 hover:text-forge-text py-2"
            >
              {link.label}
            </Link>
          ))}
          <MagneticWrapper>
            <BlobButton
              asChild
              variant="popular"
              className="mt-4 inline-flex items-center justify-center h-fluid-btn px-fluid-btn bg-forge-accent text-white text-fluid-btn font-semibold uppercase rounded-lg"
            >
              <Link
                href="/start-project"
                onClick={() => setMobileOpen(false)}
              >
                Start a Project
              </Link>
            </BlobButton>
          </MagneticWrapper>
        </div>
      </div>
    </header>
  );
}

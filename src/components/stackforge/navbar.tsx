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
  { label: "Pricing", href: "/#pricing" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Process", href: "/#process" },
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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 contain-layout",
        scrolled
          ? "bg-forge-bg/90 backdrop-blur-md border-b border-forge-divider/60 shadow-sm"
          : "bg-forge-bg/60 backdrop-blur-sm border-b border-forge-divider/30"
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        <nav className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-forge-text font-semibold text-[18px] tracking-tight"
          >
            <Image src="/stackforge-logo.jpg" alt="StackForge" width={48} height={48} className="h-10 md:h-12 w-auto object-contain" priority />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[13px] text-forge-text-secondary/60 font-medium transition-colors duration-200 hover:text-forge-text link-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop: CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <MagneticWrapper>
              <BlobButton
                asChild
                variant="popular"
                className="btn-primary inline-flex items-center justify-center h-fluid-btn-sm px-5 bg-forge-accent text-white text-fluid-btn font-semibold uppercase rounded-md transition-all duration-200"
              >
                <Link href="/start-project">

                  Get in Touch
                </Link>
              </BlobButton>
            </MagneticWrapper>
          </div>

          {/* Mobile: Theme Toggle + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={hamburgerRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col items-center justify-center w-11 h-11 gap-[5px] text-forge-text -mr-1"
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
        </nav>
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

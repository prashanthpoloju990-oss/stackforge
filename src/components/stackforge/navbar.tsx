"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-forge-bg/80 backdrop-blur-xl border-b border-forge-divider/60"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        <nav className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 text-forge-text font-semibold text-[18px] tracking-tight"
          >
            <Image src="/logo.jpg" alt="StackForge" width={120} height={28} className="h-7 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[13px] text-forge-text-secondary/60 font-medium transition-colors duration-200 hover:text-forge-text link-underline"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop: CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="btn-primary inline-flex items-center justify-center h-fluid-btn-sm px-5 bg-forge-accent text-white text-fluid-btn font-semibold uppercase rounded-md transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile: Theme Toggle + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col items-center justify-center w-11 h-11 gap-[5px] text-forge-text -mr-1"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
        className={cn(
          "md:hidden fixed inset-0 top-16 bg-forge-bg/95 backdrop-blur-xl transition-all duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-6 pt-12 sm:pt-16">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-fluid-h3 text-forge-text-secondary/60 font-medium tracking-[0.08em] transition-colors duration-200 hover:text-forge-text py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-flex items-center justify-center h-fluid-btn px-fluid-btn bg-forge-accent text-white text-fluid-btn font-semibold uppercase rounded-lg"
          >
            Start a Project
          </a>
        </div>
      </div>
    </header>
  );
}

import Image from "next/image";

export function Footer() {
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
  ];

  const serviceLinks = [
    { label: "Kit", href: "#services" },
    { label: "Pack", href: "#services" },
    { label: "Bag", href: "#services" },
  ];

  return (
    <footer className="bg-forge-bg border-t border-forge-divider pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20 pt-14 sm:pt-16 md:pt-20 pb-6 md:pb-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16 lg:gap-24">
          {/* Left — Brand */}
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-forge-text font-semibold text-[18px] tracking-tight"
            >
              <Image src="/logo.jpg" alt="StackForge" width={120} height={28} className="h-7 w-auto" />
            </a>
            <p className="mt-4 text-[18px] text-forge-accent/60 leading-relaxed max-w-[260px] font-curvy">
              We Build. You Grow.
            </p>
            <p className="mt-2 text-[13px] text-forge-text-secondary/40 leading-relaxed max-w-[280px]">
              Premium web development studio crafting high-performance digital
              experiences.
            </p>
          </div>

          {/* Right — 3 Columns */}
          <div className="grid grid-cols-3 gap-8 sm:gap-10">
            {/* Column 1: Navigation */}
            <div className="flex flex-col gap-3">
              <span className="text-[12px] sm:text-[13px] text-forge-text font-medium tracking-[0.1em] uppercase font-mono">
                Navigation
              </span>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] sm:text-[14px] text-forge-text-secondary/70 hover:text-forge-text transition-colors duration-200 py-0.5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Column 2: Services */}
            <div className="flex flex-col gap-3">
              <span className="text-[12px] sm:text-[13px] text-forge-text font-medium tracking-[0.1em] uppercase font-mono">
                Services
              </span>
              {serviceLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] sm:text-[14px] text-forge-text-secondary/70 hover:text-forge-accent transition-colors duration-200 py-0.5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Column 3: Contact */}
            <div className="flex flex-col gap-3">
              <span className="text-[12px] sm:text-[13px] text-forge-text font-medium tracking-[0.1em] uppercase font-mono">
                Contact
              </span>
              <a
                href="mailto:hello@stackforge.dev"
                className="text-[13px] sm:text-[14px] text-forge-text-secondary/70 hover:text-forge-text transition-colors duration-200 py-0.5 break-all"
              >
                hello@stackforge.dev
              </a>
              <span className="text-[13px] sm:text-[14px] text-forge-text-secondary/50">
                Hyderabad, India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-14 md:mt-16 pt-5 border-t border-forge-divider/60">
          <span className="text-[12px] sm:text-[13px] text-forge-text-secondary/30">
            © 2025 StackForge. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

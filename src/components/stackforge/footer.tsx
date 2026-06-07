export function Footer() {
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
  ];

  const serviceLinks = [
    { label: "Launch Kit", href: "#services" },
    { label: "Growth System", href: "#services" },
    { label: "Forge Elite", href: "#services" },
  ];

  return (
    <footer className="bg-forge-bg border-t border-forge-divider">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20 pt-16 pb-8 md:pt-20 md:pb-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-16 lg:gap-24">
          {/* Left — Brand */}
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-forge-text font-semibold text-[18px] tracking-tight"
            >
              <span className="text-forge-accent font-bold text-xl">S</span>
              <span>StackForge</span>
            </a>
            <p className="mt-4 text-[14px] text-forge-text-secondary/70 leading-relaxed max-w-[260px]">
              We Build. You Grow.
            </p>
            <p className="mt-2 text-[13px] text-forge-text-secondary/40 leading-relaxed max-w-[280px]">
              Premium web development studio crafting high-performance digital
              experiences.
            </p>
          </div>

          {/* Right — 3 Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-8">
            {/* Column 1: Navigation */}
            <div className="flex flex-col gap-3.5">
              <span className="text-[13px] text-forge-text font-medium tracking-[0.1em] uppercase">
                Navigation
              </span>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[14px] text-forge-text-secondary/70 hover:text-forge-text transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Column 2: Services */}
            <div className="flex flex-col gap-3.5">
              <span className="text-[13px] text-forge-text font-medium tracking-[0.1em] uppercase">
                Services
              </span>
              {serviceLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[14px] text-forge-text-secondary/70 hover:text-forge-accent transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Column 3: Contact */}
            <div className="flex flex-col gap-3.5">
              <span className="text-[13px] text-forge-text font-medium tracking-[0.1em] uppercase">
                Contact
              </span>
              <a
                href="mailto:hello@stackforge.dev"
                className="text-[14px] text-forge-text-secondary/70 hover:text-forge-text transition-colors duration-200"
              >
                hello@stackforge.dev
              </a>
              <span className="text-[14px] text-forge-text-secondary/50">
                Hyderabad, India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-forge-divider/60">
          <span className="text-[13px] text-forge-text-secondary/30">
            © 2026 StackForge. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

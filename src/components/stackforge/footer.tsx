import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forge-bg border-t border-forge-divider pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20 pt-14 sm:pt-16 md:pt-20 pb-6 md:pb-8">
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
                  className="w-8 h-8 rounded-md border border-forge-divider flex items-center justify-center text-fluid-micro text-forge-text-secondary/30 hover:text-forge-text/60 hover:border-forge-border transition-all duration-200 cursor-pointer"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — 3 Columns */}
          <div className="grid grid-cols-3 gap-8 sm:gap-10">
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

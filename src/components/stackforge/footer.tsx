export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-forge-divider">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <a
              href="#home"
              className="flex items-center gap-2 text-forge-text font-semibold text-[18px] tracking-tight"
            >
              <span className="text-forge-accent font-bold text-xl">S</span>
              <span>StackForge</span>
            </a>
            <p className="mt-3 text-[14px] text-forge-text-secondary leading-relaxed max-w-[280px]">
              Engineering premium digital experiences with precision and craft.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-[13px] text-forge-text-secondary/60 font-medium tracking-[0.1em] uppercase">
              Navigation
            </span>
            {["Home", "Services", "Work", "Process", "Contact"].map(
              (link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-[14px] text-forge-text-secondary hover:text-forge-text transition-colors duration-200"
                >
                  {link}
                </a>
              )
            )}
          </div>

          {/* Social / Legal */}
          <div className="flex flex-col gap-3 md:items-end">
            <span className="text-[13px] text-forge-text-secondary/60 font-medium tracking-[0.1em] uppercase">
              Connect
            </span>
            <div className="flex items-center gap-4">
              {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                <span
                  key={social}
                  className="text-[14px] text-forge-text-secondary hover:text-forge-text transition-colors duration-200 cursor-pointer"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-forge-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="text-[13px] text-forge-text-secondary/40">
            &copy; {currentYear} StackForge. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="text-[13px] text-forge-text-secondary/40 hover:text-forge-text-secondary/60 transition-colors duration-200 cursor-pointer">
              Privacy
            </span>
            <span className="text-[13px] text-forge-text-secondary/40 hover:text-forge-text-secondary/60 transition-colors duration-200 cursor-pointer">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

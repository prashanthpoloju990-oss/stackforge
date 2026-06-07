export function Hero() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-[100dvh] pt-16 md:pt-[72px]"
    >
      <div className="mx-auto max-w-[1200px] w-full px-6 md:px-20 py-24 md:py-32">
        <div className="flex flex-col items-start justify-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-forge-accent" />
            <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.1em] uppercase">
              Engineering Digital Experiences
            </span>
          </div>

          {/* Headline Space */}
          <h1 className="text-[40px] md:text-[72px] lg:text-[88px] font-bold leading-[0.95] tracking-[-0.03em] text-forge-text max-w-[900px]">
            We build products
            <br />
            that{" "}
            <span className="text-forge-text-secondary">scale</span>.
          </h1>

          {/* Subheadline Space */}
          <p className="mt-6 md:mt-8 text-[16px] md:text-[18px] text-forge-text-secondary leading-relaxed max-w-[540px]">
            Premium web development studio specializing in high-performance
            applications with precision engineering and modern design systems.
          </p>

          {/* CTA Space */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mt-10 md:mt-12">
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 px-8 bg-forge-accent text-white text-[14px] font-semibold tracking-wide uppercase transition-colors duration-200 hover:bg-forge-accent/90"
            >
              Start a Project
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center h-12 px-8 border border-forge-border text-forge-text text-[14px] font-medium tracking-wide uppercase transition-colors duration-200 hover:border-forge-text-secondary"
            >
              View Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

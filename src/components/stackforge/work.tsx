export function Work() {
  return (
    <section id="work" className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.1em] uppercase">
            Selected Work
          </span>
        </div>

        <div className="flex items-end justify-between mb-16 md:mb-24">
          <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-forge-text max-w-[600px]">
            Recent projects
          </h2>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-[14px] text-forge-text-secondary font-medium tracking-wide uppercase hover:text-forge-text transition-colors duration-200"
          >
            View All
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="mt-px"
            >
              <path
                d="M1 7H13M13 7L8 2M13 7L8 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Work Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Enterprise SaaS Platform",
              category: "Web Application",
              year: "2024",
            },
            {
              label: "E-Commerce Experience",
              category: "Full Stack",
              year: "2024",
            },
            {
              label: "Fintech Dashboard",
              category: "Design + Dev",
              year: "2024",
            },
            {
              label: "Brand Identity System",
              category: "Design System",
              year: "2023",
            },
          ].map((project, index) => (
            <div
              key={index}
              className="group border border-forge-border bg-forge-surface p-8 md:p-10 transition-colors duration-300 hover:border-forge-text-secondary/30"
            >
              {/* Placeholder Visual Area */}
              <div className="w-full aspect-[16/10] bg-forge-bg mb-8 flex items-center justify-center">
                <span className="text-[13px] text-forge-text-secondary/40 font-mono tracking-wider">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-forge-text tracking-[-0.01em]">
                    {project.label}
                  </h3>
                  <p className="mt-1 text-[14px] text-forge-text-secondary">
                    {project.category}
                  </p>
                </div>
                <span className="text-[13px] text-forge-text-secondary/60 font-mono">
                  {project.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

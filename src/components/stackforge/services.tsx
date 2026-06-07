export function Services() {
  const services = [
    {
      number: "01",
      title: "Web Development",
      description:
        "Full-stack applications built with modern frameworks and scalable architecture patterns.",
    },
    {
      number: "02",
      title: "Design Systems",
      description:
        "Component libraries and design tokens that ensure visual consistency across every touchpoint.",
    },
    {
      number: "03",
      title: "Performance",
      description:
        "Optimization and core web vitals tuning for lightning-fast user experiences at any scale.",
    },
    {
      number: "04",
      title: "Infrastructure",
      description:
        "Cloud architecture, CI/CD pipelines, and deployment strategies for reliable production systems.",
    },
  ];

  return (
    <section id="services" className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.1em] uppercase">
            Services
          </span>
        </div>

        <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-forge-text max-w-[700px] mb-16 md:mb-24">
          What we do best
        </h2>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-forge-divider">
          {services.map((service) => (
            <div
              key={service.number}
              className="bg-forge-bg p-8 md:p-10 lg:p-12 group"
            >
              <span className="text-[13px] text-forge-text-secondary font-mono tracking-wider">
                {service.number}
              </span>
              <h3 className="mt-3 text-[20px] md:text-[24px] font-semibold text-forge-text tracking-[-0.02em]">
                {service.title}
              </h3>
              <p className="mt-3 text-[15px] text-forge-text-secondary leading-relaxed max-w-[320px]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    {
      phase: "Discovery",
      description:
        "Deep-dive into your business goals, user needs, and technical requirements to define a clear project roadmap.",
    },
    {
      phase: "Design",
      description:
        "Wireframes, prototypes, and visual design systems crafted with precision and aligned to your brand identity.",
    },
    {
      phase: "Development",
      description:
        "Clean, scalable code built with modern frameworks. Every component tested, reviewed, and optimized.",
    },
    {
      phase: "Launch",
      description:
        "Performance auditing, deployment, and monitoring. We ensure a smooth, confident launch every time.",
    },
  ];

  return (
    <section id="process" className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.1em] uppercase">
            Process
          </span>
        </div>

        <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-forge-text max-w-[700px] mb-16 md:mb-24">
          How we work
        </h2>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-forge-divider">
          {steps.map((step, index) => (
            <div key={step.phase} className="bg-forge-bg p-8 md:p-10">
              <span className="text-[13px] text-forge-accent font-mono tracking-wider">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[20px] md:text-[22px] font-semibold text-forge-text tracking-[-0.02em]">
                {step.phase}
              </h3>
              <p className="mt-3 text-[15px] text-forge-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

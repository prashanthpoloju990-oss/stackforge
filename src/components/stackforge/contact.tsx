export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[13px] text-forge-text-secondary font-medium tracking-[0.1em] uppercase">
                Contact
              </span>
            </div>

            <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-forge-text max-w-[500px]">
              Let&apos;s build something great
            </h2>

            <p className="mt-6 text-[16px] text-forge-text-secondary leading-relaxed max-w-[420px]">
              Have a project in mind? We&apos;d love to hear about it. Reach out
              and let&apos;s explore how we can work together.
            </p>

            {/* Contact Info */}
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-forge-text-secondary/60 font-mono w-20">
                  Email
                </span>
                <span className="text-[15px] text-forge-text-secondary">
                  hello@stackforge.dev
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-forge-text-secondary/60 font-mono w-20">
                  Location
                </span>
                <span className="text-[15px] text-forge-text-secondary">
                  San Francisco, CA
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Form Placeholder */}
          <div className="border border-forge-border p-8 md:p-10">
            <div className="space-y-6">
              <div>
                <label className="block text-[13px] text-forge-text-secondary font-medium tracking-[0.05em] uppercase mb-2">
                  Name
                </label>
                <div className="h-12 border border-forge-border bg-forge-surface/50 flex items-center px-4">
                  <span className="text-[15px] text-forge-text-secondary/30">
                    Your name
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[13px] text-forge-text-secondary font-medium tracking-[0.05em] uppercase mb-2">
                  Email
                </label>
                <div className="h-12 border border-forge-border bg-forge-surface/50 flex items-center px-4">
                  <span className="text-[15px] text-forge-text-secondary/30">
                    your@email.com
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[13px] text-forge-text-secondary font-medium tracking-[0.05em] uppercase mb-2">
                  Message
                </label>
                <div className="h-32 border border-forge-border bg-forge-surface/50 flex items-start p-4">
                  <span className="text-[15px] text-forge-text-secondary/30">
                    Tell us about your project...
                  </span>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center justify-center h-12 px-8 bg-forge-accent text-white text-[14px] font-semibold tracking-wide uppercase cursor-default opacity-80">
                  Send Message
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { useSlideReveal } from "@/hooks/use-slide-reveal";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  message: "",
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SlideCta() {
  const { ref, isVisible } = useSlideReveal({ threshold: 0.15 });
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  }, [form]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate();
    if (form[field as keyof FormData].trim() && !newErrors[field]) {
      const updated = { ...errors };
      delete updated[field];
      setErrors(updated);
    } else if (form[field as keyof FormData].trim()) {
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    setToast(null);
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToast({ type: "error", message: "Please fix the highlighted errors." });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setForm(INITIAL_FORM);
    setTouched({});
    setErrors({});
    setToast({
      type: "success",
      message: "Message sent! We'll get back to you within 24 hours.",
    });
  };

  const inputBase =
    "w-full h-12 bg-forge-bg border rounded-lg px-4 text-[15px] text-forge-text placeholder:text-forge-text-secondary/25 transition-all duration-200 outline-none focus:ring-1 appearance-none";
  const inputNormal =
    "border-forge-border focus:border-forge-accent/50 focus:ring-forge-accent/20";
  const inputError =
    "border-red-500/70 focus:border-red-500 focus:ring-red-500/20";

  return (
    <section id="cta" ref={ref} className="story-slide overflow-hidden">
      <div className="mx-auto max-w-[1100px] w-full px-6 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left — Heading + contact info */}
          <div className="flex flex-col">
            <h2
              className={cn(
                "text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold leading-[1.08] tracking-[-0.03em] text-forge-text max-w-[480px] font-playfair",
                isVisible ? "animate-story-fade-up" : "opacity-0"
              )}
              style={{ animationDelay: "0ms" }}
            >
              Let&apos;s build
              <br />
              <span className="text-forge-accent">something great.</span>
            </h2>

            <p
              className={cn(
                "mt-5 text-[15px] md:text-[16px] text-forge-text-secondary leading-[1.7] max-w-[420px]",
                isVisible ? "animate-story-fade-up" : "opacity-0"
              )}
              style={{ animationDelay: "150ms" }}
            >
              Have a project in mind? We&apos;d love to hear about it. Reach out
              and let&apos;s explore how we can work together.
            </p>

            {/* Contact details */}
            <div
              className={cn(
                "mt-8 space-y-3",
                isVisible ? "animate-story-fade-up" : "opacity-0"
              )}
              style={{ animationDelay: "300ms" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-forge-text-secondary/50 font-mono w-20 shrink-0">
                  Email
                </span>
                <a
                  href="mailto:hello@stackforge.dev"
                  className="text-[15px] text-forge-text-secondary hover:text-forge-text transition-colors duration-200"
                >
                  hello@stackforge.dev
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-forge-text-secondary/50 font-mono w-20 shrink-0">
                  Location
                </span>
                <span className="text-[15px] text-forge-text-secondary">
                  Hyderabad, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-forge-text-secondary/50 font-mono w-20 shrink-0">
                  Response
                </span>
                <span className="text-[15px] text-forge-text-secondary">
                  Within 24 hours
                </span>
              </div>
            </div>
          </div>

          {/* Right — Inline form */}
          <div
            className={cn(
              "border border-forge-divider bg-forge-surface/50 p-6 sm:p-8 md:p-10 rounded-xl relative",
              isVisible ? "animate-story-slide-right" : "opacity-0"
            )}
            style={{ animationDelay: "200ms" }}
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name + Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="cta-name"
                    className="block text-[13px] text-forge-text-secondary font-medium tracking-[0.05em] uppercase mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="cta-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="Your name"
                    autoComplete="name"
                    className={cn(
                      inputBase,
                      touched.name && errors.name ? inputError : inputNormal
                    )}
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1.5 text-[12px] text-red-400/80">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="cta-email"
                    className="block text-[13px] text-forge-text-secondary font-medium tracking-[0.05em] uppercase mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="cta-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className={cn(
                      inputBase,
                      touched.email && errors.email ? inputError : inputNormal
                    )}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1.5 text-[12px] text-red-400/80">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="cta-message"
                  className="block text-[13px] text-forge-text-secondary font-medium tracking-[0.05em] uppercase mb-2"
                >
                  Message
                </label>
                <textarea
                  id="cta-message"
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  placeholder="Tell us about your project..."
                  rows={4}
                  className={cn(
                    "w-full bg-forge-bg border rounded-lg px-4 py-3 text-[15px] text-forge-text placeholder:text-forge-text-secondary/25 transition-all duration-200 outline-none resize-none focus:ring-1",
                    touched.message && errors.message ? inputError : inputNormal
                  )}
                />
                {touched.message && errors.message && (
                  <p className="mt-1.5 text-[12px] text-red-400/80">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "inline-flex items-center justify-center h-12 px-8 bg-forge-accent text-white text-[14px] font-semibold tracking-[0.04em] uppercase rounded-lg transition-all duration-200",
                    isSubmitting
                      ? "opacity-70 cursor-wait"
                      : "hover:bg-[#e55f00] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Start a Project"
                  )}
                </button>
              </div>
            </form>

            {/* Toast */}
            {toast && (
              <div
                className={cn(
                  "mt-6 flex items-start gap-3 p-4 rounded-lg border transition-all duration-300",
                  toast.type === "success"
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-red-500/5 border-red-500/20"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 w-2 h-2 rounded-full flex-shrink-0",
                    toast.type === "success" ? "bg-green-400" : "bg-red-400"
                  )}
                />
                <p
                  className={cn(
                    "text-[14px] leading-relaxed",
                    toast.type === "success"
                      ? "text-green-300/80"
                      : "text-red-300/80"
                  )}
                >
                  {toast.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom credit line */}
        <div
          className={cn(
            "mt-12 md:mt-16 text-center",
            isVisible ? "animate-story-fade-in" : "opacity-0"
          )}
          style={{ animationDelay: "600ms" }}
        >
          <p className="text-[12px] font-mono text-forge-text-secondary/30">
            © 2026 StackForge. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}

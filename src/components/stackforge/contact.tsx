"use client";

import { useState, useCallback, useEffect } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
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
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Contact() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08 });
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
    "w-full h-11 bg-forge-bg border rounded-lg px-4 text-[14px] text-forge-text placeholder:text-forge-text-secondary/20 transition-all duration-200 outline-none focus:ring-1 appearance-none";
  const inputNormal =
    "border-forge-border focus:border-forge-accent/40 focus:ring-forge-accent/15";
  const inputError =
    "border-red-500/60 focus:border-red-500 focus:ring-red-500/15";
  const selectBase =
    "w-full h-11 bg-forge-bg border rounded-lg px-4 text-[14px] text-forge-text transition-all duration-200 outline-none focus:ring-1 appearance-none cursor-pointer";

  return (
    <section id="contact" className="py-24 md:py-32 lg:py-36">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1200px] px-6 md:px-20 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20">
          {/* Left Column */}
          <div>
            <span className="text-[12px] text-forge-accent/60 font-medium tracking-[0.16em] uppercase block mb-4 font-mono">
              Contact
            </span>

            <h2 className="text-[30px] md:text-[42px] lg:text-[48px] font-bold leading-[1.06] tracking-[-0.035em] text-forge-text max-w-[440px] font-playfair">
              Let&apos;s build something
              <br />
              <span className="text-forge-accent/70"> worth talking about.</span>
            </h2>

            <p className="mt-5 text-[15px] text-forge-text-secondary/60 leading-[1.7] max-w-[380px]">
              Tell us about your project. We respond within 24 hours — no spam,
              no sales funnel, just a real conversation.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-forge-text-secondary/30 font-mono w-[72px] shrink-0 tracking-[0.06em] uppercase">
                  Email
                </span>
                <a
                  href="mailto:hello@stackforge.dev"
                  className="text-[14px] text-forge-text-secondary/70 hover:text-forge-text transition-colors duration-200"
                >
                  hello@stackforge.dev
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-forge-text-secondary/30 font-mono w-[72px] shrink-0 tracking-[0.06em] uppercase">
                  Location
                </span>
                <span className="text-[14px] text-forge-text-secondary/70">
                  Hyderabad, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-forge-text-secondary/30 font-mono w-[72px] shrink-0 tracking-[0.06em] uppercase">
                  Response
                </span>
                <span className="text-[14px] text-forge-text-secondary/70">
                  Within 24 hours
                </span>
              </div>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="border border-forge-divider bg-forge-surface/30 p-6 sm:p-8 md:p-9 rounded-xl">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name + Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-[12px] text-forge-text-secondary/40 font-medium tracking-[0.06em] uppercase mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="Your name"
                    autoComplete="name"
                    className={cn(inputBase, touched.name && errors.name ? inputError : inputNormal)}
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-[11px] text-red-400/70">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-[12px] text-forge-text-secondary/40 font-medium tracking-[0.06em] uppercase mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className={cn(inputBase, touched.email && errors.email ? inputError : inputNormal)}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-[11px] text-red-400/70">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Project Type + Budget Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="projectType" className="block text-[12px] text-forge-text-secondary/40 font-medium tracking-[0.06em] uppercase mb-1.5">
                    Project Type
                  </label>
                  <div className="relative">
                    <select
                      id="projectType"
                      value={form.projectType}
                      onChange={(e) => handleChange("projectType", e.target.value)}
                      className={cn(selectBase, inputNormal)}
                    >
                      <option value="">Select type</option>
                      <option value="website">Website</option>
                      <option value="web-app">Web Application</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="redesign">Redesign</option>
                      <option value="other">Other</option>
                    </select>
                    <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-forge-text-secondary/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-[12px] text-forge-text-secondary/40 font-medium tracking-[0.06em] uppercase mb-1.5">
                    Budget
                  </label>
                  <div className="relative">
                    <select
                      id="budget"
                      value={form.budget}
                      onChange={(e) => handleChange("budget", e.target.value)}
                      className={cn(selectBase, inputNormal)}
                    >
                      <option value="">Select budget</option>
                      <option value="20k-60k">₹20K – ₹60K</option>
                      <option value="60k-1.5l">₹60K – ₹1.5L</option>
                      <option value="1.5l-3l">₹1.5L – ₹3L</option>
                      <option value="3l+">₹3L+</option>
                    </select>
                    <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-forge-text-secondary/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label htmlFor="timeline" className="block text-[12px] text-forge-text-secondary/40 font-medium tracking-[0.06em] uppercase mb-1.5">
                  Timeline
                </label>
                <div className="relative">
                  <select
                    id="timeline"
                    value={form.timeline}
                    onChange={(e) => handleChange("timeline", e.target.value)}
                    className={cn(selectBase, inputNormal)}
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-2-weeks">1–2 Weeks</option>
                    <option value="1-3-months">1–3 Months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                  <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-forge-text-secondary/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-[12px] text-forge-text-secondary/40 font-medium tracking-[0.06em] uppercase mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  placeholder="Tell us about your project..."
                  rows={4}
                  className={cn(
                    "w-full bg-forge-bg border rounded-lg px-4 py-3 text-[14px] text-forge-text placeholder:text-forge-text-secondary/20 transition-all duration-200 outline-none resize-none focus:ring-1",
                    touched.message && errors.message ? inputError : inputNormal
                  )}
                />
                {touched.message && errors.message && (
                  <p className="mt-1 text-[11px] text-red-400/70">{errors.message}</p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "inline-flex items-center justify-center h-11 px-7 bg-forge-accent text-white text-[13px] font-semibold tracking-[0.06em] uppercase rounded-lg transition-all duration-200",
                    isSubmitting
                      ? "opacity-60 cursor-wait"
                      : "hover:bg-[#e55f00] hover:shadow-lg hover:shadow-forge-accent/10 active:scale-[0.98] cursor-pointer"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>

            {toast && (
              <div className={cn(
                "mt-5 flex items-start gap-3 p-3.5 rounded-lg border transition-all duration-300",
                toast.type === "success" ? "bg-green-500/5 border-green-500/15" : "bg-red-500/5 border-red-500/15"
              )}>
                <div className={cn("mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0", toast.type === "success" ? "bg-green-400/70" : "bg-red-400/70")} />
                <p className={cn("text-[13px] leading-relaxed", toast.type === "success" ? "text-green-300/70" : "text-red-300/70")}>
                  {toast.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

/* ── Types ── */
interface FormData {
  name: string;
  contact: string;
  businessType: string;
  serviceNeed: string;
  budget: string;
  timeline: string;
  details: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
}

/* ── Constants ── */
const INITIAL_FORM: FormData = {
  name: "",
  contact: "",
  businessType: "",
  serviceNeed: "",
  budget: "",
  timeline: "",
  details: "",
};

const BUSINESS_OPTIONS = [
  "Startup",
  "Local Business",
  "Personal Brand",
  "Agency",
  "Other",
];

const SERVICE_OPTIONS = [
  "New Website",
  "Website Redesign",
  "Landing Page",
  "UI/UX Design",
  "Not sure yet",
];

const BUDGET_OPTIONS = [
  "$100 – $300",
  "$300 – $700",
  "$700 – $1,500",
  "$1,500+",
];

const TIMELINE_OPTIONS = [
  "Urgent (1–3 days)",
  "This week",
  "This month",
  "Flexible",
];

const SELECT_OPTIONS = ["", ...BUSINESS_OPTIONS] as const;
const SERVICE_SELECT_OPTIONS = ["", ...SERVICE_OPTIONS] as const;
const BUDGET_SELECT_OPTIONS = ["", ...BUDGET_OPTIONS] as const;
const TIMELINE_SELECT_OPTIONS = ["", ...TIMELINE_OPTIONS] as const;

/* ── Helpers ── */
function isEmailLike(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function isWhatsAppLike(str: string): boolean {
  return /^\+?\d[\d\s-]{6,}$/.test(str.replace(/\s/g, ""));
}

export function Contact() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* Autofocus first field when section scrolls into view */
  useEffect(() => {
    if (isVisible && nameRef.current && !isSuccess) {
      const timer = setTimeout(() => nameRef.current?.focus(), 600);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isSuccess]);

  /* Clear submit error after 6s */
  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => setSubmitError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  /* ── Validation ── */
  const isValid = useMemo(() => {
    return form.name.trim().length >= 2 && form.contact.trim().length >= 5;
  }, [form.name, form.contact]);

  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Please enter your name";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!form.contact.trim()) {
      newErrors.contact = "Please enter your email or WhatsApp";
    } else if (!isEmailLike(form.contact) && !isWhatsAppLike(form.contact)) {
      newErrors.contact = "Enter a valid email or WhatsApp number";
    }
    return newErrors;
  }, [form]);

  /* ── Handlers ── */
  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    /* Clear error on change */
    if (touched[field] && errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    /* Only validate the touched field for inline feedback */
    const fieldErrors = validate();
    const fieldError = fieldErrors[field as keyof FormErrors];
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[field as keyof FormErrors] = fieldError;
      } else {
        delete next[field as keyof FormErrors];
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    /* Touch all required fields */
    setTouched({ name: true, contact: true });
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setIsSuccess(true);
      setForm(INITIAL_FORM);
      setTouched({});
      setErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Select option builder ── */
  const buildOptions = (
    items: readonly string[],
    defaultLabel: string
  ) => {
    return items.map((item) => (
      <option key={item} value={item} disabled={item === ""}>
        {item === "" ? defaultLabel : item}
      </option>
    ));
  };

  return (
    <section id="contact" className="py-24 md:py-32 lg:py-36">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[560px] px-6 md:px-8 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
        )}
      >
        {/* ── Section Header ── */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-[32px] md:text-[40px] lg:text-[44px] font-bold leading-[1.1] tracking-[-0.035em] text-forge-text font-playfair">
            Start Your Project
          </h2>
          <p className="mt-4 text-[15px] md:text-[16px] text-forge-text-secondary leading-[1.65] max-w-[400px] mx-auto">
            Tell us what you need — we&apos;ll handle the rest.
          </p>
        </div>

        {/* ── Form / Success ── */}
        {isSuccess ? (
          <SuccessState />
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="form-field-stagger space-y-5"
          >
            {/* Row 1: Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-[11px] text-forge-text-secondary/50 font-medium tracking-[0.08em] uppercase mb-2 pl-1"
              >
                Full Name
              </label>
              <input
                ref={nameRef}
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="John Doe"
                autoComplete="name"
                className={cn(
                  "form-input",
                  touched.name && errors.name && "has-error"
                )}
              />
              {touched.name && errors.name && (
                <p className="mt-1.5 pl-1 text-[12px] text-red-400/80 leading-none">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Row 2: Email or WhatsApp */}
            <div>
              <label
                htmlFor="contact"
                className="block text-[11px] text-forge-text-secondary/50 font-medium tracking-[0.08em] uppercase mb-2 pl-1"
              >
                Contact
              </label>
              <input
                id="contact"
                type="text"
                value={form.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                onBlur={() => handleBlur("contact")}
                placeholder="Email or WhatsApp number"
                autoComplete="email"
                className={cn(
                  "form-input",
                  touched.contact && errors.contact && "has-error"
                )}
              />
              {touched.contact && errors.contact && (
                <p className="mt-1.5 pl-1 text-[12px] text-red-400/80 leading-none">
                  {errors.contact}
                </p>
              )}
            </div>

            {/* Row 3: Business Type */}
            <div>
              <label
                htmlFor="businessType"
                className="block text-[11px] text-forge-text-secondary/50 font-medium tracking-[0.08em] uppercase mb-2 pl-1"
              >
                Business Type
              </label>
              <select
                id="businessType"
                value={form.businessType}
                onChange={(e) => handleChange("businessType", e.target.value)}
                className="form-input form-select"
              >
                {buildOptions(SELECT_OPTIONS, "Select business type")}
              </select>
            </div>

            {/* Row 4: What do you need? */}
            <div>
              <label
                htmlFor="serviceNeed"
                className="block text-[11px] text-forge-text-secondary/50 font-medium tracking-[0.08em] uppercase mb-2 pl-1"
              >
                What do you need?
              </label>
              <select
                id="serviceNeed"
                value={form.serviceNeed}
                onChange={(e) => handleChange("serviceNeed", e.target.value)}
                className="form-input form-select"
              >
                {buildOptions(SERVICE_SELECT_OPTIONS, "Select a service")}
              </select>
            </div>

            {/* Row 5: Budget Range */}
            <div>
              <label
                htmlFor="budget"
                className="block text-[11px] text-forge-text-secondary/50 font-medium tracking-[0.08em] uppercase mb-2 pl-1"
              >
                Budget Range
              </label>
              <select
                id="budget"
                value={form.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                className="form-input form-select"
              >
                {buildOptions(BUDGET_SELECT_OPTIONS, "Select budget")}
              </select>
            </div>

            {/* Row 6: Timeline */}
            <div>
              <label
                htmlFor="timeline"
                className="block text-[11px] text-forge-text-secondary/50 font-medium tracking-[0.08em] uppercase mb-2 pl-1"
              >
                Timeline
              </label>
              <select
                id="timeline"
                value={form.timeline}
                onChange={(e) => handleChange("timeline", e.target.value)}
                className="form-input form-select"
              >
                {buildOptions(TIMELINE_SELECT_OPTIONS, "Select timeline")}
              </select>
            </div>

            {/* Row 7: Project Details */}
            <div>
              <label
                htmlFor="details"
                className="block text-[11px] text-forge-text-secondary/50 font-medium tracking-[0.08em] uppercase mb-2 pl-1"
              >
                Project Details{" "}
                <span className="text-forge-text-secondary/30 normal-case tracking-normal font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                id="details"
                value={form.details}
                onChange={(e) => handleChange("details", e.target.value)}
                placeholder="Briefly describe what you're looking for..."
                rows={4}
                className="form-input form-textarea"
              />
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  "btn-primary w-full h-[52px] rounded-xl text-[14px] font-semibold tracking-[0.04em] uppercase transition-all duration-[250ms]",
                  isValid
                    ? "bg-forge-accent text-white cursor-pointer hover:bg-[#e55f00]"
                    : "bg-forge-accent/30 text-white/40 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <svg
                      className="animate-spin h-[18px] w-[18px]"
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
                  "Get My Website"
                )}
              </button>
            </div>

            {/* Trust Text */}
            <div className="pt-1 flex items-center justify-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-forge-accent/50 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                />
              </svg>
              <p className="text-[12px] text-forge-text-secondary/40 leading-relaxed">
                No spam. We&apos;ll contact you within 12 hours.
              </p>
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/5 border border-red-500/10 mt-2">
                <svg
                  className="w-4 h-4 text-red-400/70 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p className="text-[13px] text-red-400/80 leading-relaxed">
                  {submitError}
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Success State ── */
function SuccessState() {
  return (
    <div className="animate-success-enter text-center py-10 md:py-14">
      {/* Checkmark */}
      <div className="flex justify-center mb-8">
        <div className="relative w-20 h-20">
          <div className="animate-check-circle absolute inset-0 rounded-full bg-forge-accent/10 border border-forge-accent/20" />
          <svg
            className="absolute inset-0 w-20 h-20"
            viewBox="0 0 80 80"
            fill="none"
          >
            <path
              className="animate-check-draw"
              d="M24 42 L35 53 L56 28"
              stroke="var(--forge-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h3 className="text-[28px] md:text-[34px] font-bold leading-[1.15] tracking-[-0.03em] text-forge-text font-playfair">
        You&apos;re in.
      </h3>

      <p className="mt-4 text-[15px] text-forge-text-secondary leading-[1.65] max-w-[340px] mx-auto">
        We&apos;ll reach out within 12 hours to discuss your project.
      </p>
    </div>
  );
}

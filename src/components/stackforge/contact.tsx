"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import {
  ChevronUpIcon,
  AtSignIcon,
  UserIcon,
  Sparkles,
  Globe,
  RefreshCw,
  Layout,
  Palette,
  HelpCircle,
  SendIcon,
  ShieldCheck,
} from "lucide-react";

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

const QUICK_SERVICES = [
  { label: "New Website", icon: Globe, value: "New Website" },
  { label: "Redesign", icon: RefreshCw, value: "Website Redesign" },
  { label: "Landing Page", icon: Layout, value: "Landing Page" },
  { label: "UI/UX Design", icon: Palette, value: "UI/UX Design" },
];

/* ── Helpers ── */
function isEmailLike(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function isWhatsAppLike(str: string): boolean {
  return /^\+?\d[\d\s-]{6,}$/.test(str.replace(/\s/g, ""));
}

/* ── Select option builder ── */
function buildOptions(
  items: readonly string[],
  defaultLabel: string
) {
  return items.map((item) => (
    <option key={item} value={item} disabled={item === ""}>
      {item === "" ? defaultLabel : item}
    </option>
  ));
}

/* ── Floating Paths (decorative SVG animation) ── */
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(255, 106, 0, ${0.06 + i * 0.015})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.06 + path.id * 0.015}
            className="text-forge-accent"
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Separator ── */
function AuthSeparator() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-border h-px flex-1" />
      <span className="text-muted-foreground px-3 text-xs uppercase tracking-wider">
        or fill in the form
      </span>
      <div className="bg-border h-px flex-1" />
    </div>
  );
}

/* ── Main Component ── */
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
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickService = (value: string) => {
    handleChange("serviceNeed", value);
    nameRef.current?.focus();
  };

  return (
    <section id="contact">
      <div
        ref={ref}
        className={cn(
          "relative transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[30px]"
        )}
      >
        <div className="relative md:min-h-screen md:overflow-hidden md:grid md:grid-cols-2">
          {/* ═══ LEFT DECORATIVE PANEL (desktop only) ═══ */}
          <div className="bg-forge-surface/60 relative hidden h-full flex-col border-r p-10 lg:flex">
            <div className="from-forge-bg absolute inset-0 z-10 bg-gradient-to-t to-transparent" />

            {/* Branding */}
            <div className="z-10 flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-forge-accent/10 ring-1 ring-forge-accent/20">
                <Sparkles className="size-4 text-forge-accent" />
              </div>
              <p className="text-lg font-semibold text-forge-text tracking-tight font-syne">
                StackForge
              </p>
            </div>

            {/* Testimonial */}
            <div className="z-10 mt-auto pb-4">
              <blockquote className="space-y-3">
                <p className="text-fluid-h2 font-playfair text-forge-text">
                  &ldquo;StackForge delivered our site in 3 days. The quality
                  blew our expectations — best decision we made.&rdquo;
                </p>
                <footer className="font-mono text-sm font-semibold text-forge-text-secondary">
                  ~ Priya Sharma, Hyderabadi Startups
                </footer>
              </blockquote>
              <div className="mt-8 flex items-center gap-6 text-forge-text-secondary/60">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-forge-accent tabular-nums">
                    150+
                  </span>
                  <span className="text-xs uppercase tracking-wider">
                    Projects
                  </span>
                </div>
                <div className="h-8 w-px bg-forge-divider" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-forge-accent tabular-nums">
                    98%
                  </span>
                  <span className="text-xs uppercase tracking-wider">
                    Satisfaction
                  </span>
                </div>
                <div className="h-8 w-px bg-forge-divider" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-forge-accent tabular-nums">
                    3d
                  </span>
                  <span className="text-xs uppercase tracking-wider">
                    Avg. Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Paths */}
            <div className="absolute inset-0">
              <FloatingPaths position={1} />
              <FloatingPaths position={-1} />
            </div>
          </div>

          {/* ═══ RIGHT FORM PANEL ═══ */}
          <div className="relative flex min-h-screen flex-col justify-center p-4 md:p-8 lg:p-10">
            {/* Radial gradient decorations */}
            <div
              aria-hidden
              className="absolute inset-0 isolate contain-strict -z-10 opacity-50"
            >
              <div className="absolute top-0 right-0 h-80 w-56 -translate-y-1/2 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,106,0,0.06)_0,hsla(0,0%,55%,0.02)_50%,rgba(255,106,0,0.01)_80%)]" />
              <div className="absolute top-0 right-0 h-80 w-60 translate-x-[5%] -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,106,0,0.04)_0,rgba(255,106,0,0.01)_80%,transparent_100%)]" />
              <div className="absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 -translate-x-1/4 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,106,0,0.03)_0,transparent_80%)]" />
            </div>

            {/* Back to top */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="absolute top-6 left-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-forge-text"
            >
              <ChevronUpIcon className="size-4" />
              Back to top
            </button>

            <div className="mx-auto w-full max-w-lg space-y-6 sm:space-y-7">
              {/* Mobile branding */}
              <div className="flex items-center gap-2.5 lg:hidden">
                <div className="flex size-8 items-center justify-center rounded-lg bg-forge-accent/10 ring-1 ring-forge-accent/20">
                  <Sparkles className="size-4 text-forge-accent" />
                </div>
                <p className="text-lg font-semibold text-forge-text tracking-tight font-syne">
                  StackForge
                </p>
              </div>

              {/* Section Header */}
              <div className="space-y-1.5">
                <h2 className="text-fluid-hero font-bold text-forge-text font-playfair">
                  Let&apos;s Build Something
                </h2>
                <p className="text-fluid-body-lg text-forge-text-secondary">
                  Pick a quick start or tell us the details below.
                </p>
              </div>

              {isSuccess ? (
                <SuccessState />
              ) : (
                <>
                  {/* Quick Service Buttons */}
                  <div className="space-y-2.5">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
                      Quick Start
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {QUICK_SERVICES.map((service) => (
                        <button
                          key={service.value}
                          type="button"
                          onClick={() =>
                            handleQuickService(service.value)
                          }
                          className={cn(
                            "contact-quick-btn inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                            form.serviceNeed === service.value
                              ? "border-forge-accent bg-forge-accent/5 text-forge-accent shadow-[0_0_12px_rgba(255,106,0,0.08)]"
                              : "border-forge-border bg-forge-bg text-forge-text-secondary hover:border-forge-accent/30 hover:text-forge-text"
                          )}
                        >
                          <service.icon className="size-4" />
                          {service.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AuthSeparator />

                  {/* Form */}
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <p className="text-muted-foreground text-xs">
                      Fill in your details and we&apos;ll get back to you
                      within 12 hours.
                    </p>

                    {/* Row 1: Name + Contact */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium uppercase tracking-wider text-forge-text-secondary/60"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            ref={nameRef}
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                            onBlur={() => handleBlur("name")}
                            placeholder="John Doe"
                            autoComplete="name"
                            className={cn(
                              "contact-input peer ps-9",
                              touched.name &&
                                errors.name &&
                                "has-error"
                            )}
                          />
                          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground peer-disabled:opacity-50">
                            <UserIcon
                              className="size-4"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                        {touched.name && errors.name && (
                          <p className="pl-1 text-[11px] leading-none text-red-400/80">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contactEmail"
                          className="block text-xs font-medium uppercase tracking-wider text-forge-text-secondary/60"
                        >
                          Email / WhatsApp
                        </label>
                        <div className="relative">
                          <input
                            id="contactEmail"
                            type="text"
                            value={form.contact}
                            onChange={(e) =>
                              handleChange("contact", e.target.value)
                            }
                            onBlur={() => handleBlur("contact")}
                            placeholder="Email or WhatsApp"
                            autoComplete="email"
                            className={cn(
                              "contact-input peer ps-9",
                              touched.contact &&
                                errors.contact &&
                                "has-error"
                            )}
                          />
                          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground peer-disabled:opacity-50">
                            <AtSignIcon
                              className="size-4"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                        {touched.contact && errors.contact && (
                          <p className="pl-1 text-[11px] leading-none text-red-400/80">
                            {errors.contact}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Business Type + Service */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="businessType"
                          className="block text-xs font-medium uppercase tracking-wider text-forge-text-secondary/60"
                        >
                          Business Type
                        </label>
                        <select
                          id="businessType"
                          value={form.businessType}
                          onChange={(e) =>
                            handleChange(
                              "businessType",
                              e.target.value
                            )
                          }
                          className="contact-select"
                        >
                          {buildOptions(
                            SELECT_OPTIONS,
                            "Select type"
                          )}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="serviceNeed"
                          className="block text-xs font-medium uppercase tracking-wider text-forge-text-secondary/60"
                        >
                          Service
                        </label>
                        <select
                          id="serviceNeed"
                          value={form.serviceNeed}
                          onChange={(e) =>
                            handleChange(
                              "serviceNeed",
                              e.target.value
                            )
                          }
                          className="contact-select"
                        >
                          {buildOptions(
                            SERVICE_SELECT_OPTIONS,
                            "Select service"
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Budget + Timeline */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="budget"
                          className="block text-xs font-medium uppercase tracking-wider text-forge-text-secondary/60"
                        >
                          Budget Range
                        </label>
                        <select
                          id="budget"
                          value={form.budget}
                          onChange={(e) =>
                            handleChange("budget", e.target.value)
                          }
                          className="contact-select"
                        >
                          {buildOptions(
                            BUDGET_SELECT_OPTIONS,
                            "Select budget"
                          )}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="timeline"
                          className="block text-xs font-medium uppercase tracking-wider text-forge-text-secondary/60"
                        >
                          Timeline
                        </label>
                        <select
                          id="timeline"
                          value={form.timeline}
                          onChange={(e) =>
                            handleChange(
                              "timeline",
                              e.target.value
                            )
                          }
                          className="contact-select"
                        >
                          {buildOptions(
                            TIMELINE_SELECT_OPTIONS,
                            "Select timeline"
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Details */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="details"
                        className="block text-xs font-medium uppercase tracking-wider text-forge-text-secondary/60"
                      >
                        Project Details{" "}
                        <span className="normal-case tracking-normal font-normal opacity-40">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="details"
                        value={form.details}
                        onChange={(e) =>
                          handleChange("details", e.target.value)
                        }
                        placeholder="Briefly describe what you're looking for..."
                        rows={3}
                        className="contact-textarea"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="btn-forge-submit"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2.5">
                          <svg
                            className="h-[18px] w-[18px] animate-spin"
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
                        <span className="flex items-center justify-center gap-2.5">
                          <SendIcon className="size-4" />
                          Get My Website
                        </span>
                      )}
                    </button>

                    {/* Trust badges */}
                    <div className="flex flex-col items-center gap-3 pt-1">
                      <div className="flex items-center gap-2 text-muted-foreground/60">
                        <ShieldCheck className="size-3.5 text-forge-accent/40" />
                        <p className="text-xs leading-relaxed">
                          No spam. We&apos;ll contact you within 12 hours.
                        </p>
                      </div>

                      {/* Submit Error */}
                      {submitError && (
                        <div className="flex w-full items-start gap-2.5 rounded-lg border border-red-500/10 bg-red-500/5 p-3">
                          <HelpCircle className="mt-0.5 size-4 flex-shrink-0 text-red-400/70" />
                          <p className="text-[13px] leading-relaxed text-red-400/80">
                            {submitError}
                          </p>
                        </div>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Success State ── */
function SuccessState() {
  return (
    <div className="animate-success-enter py-8 text-center sm:py-12">
      {/* Checkmark */}
      <div className="mb-8 flex justify-center">
        <div className="relative h-20 w-20">
          <div className="animate-check-circle absolute inset-0 rounded-full border border-forge-accent/20 bg-forge-accent/10" />
          <svg
            className="absolute inset-0 h-20 w-20"
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

      <h3 className="text-fluid-hero font-bold text-forge-text font-playfair">
        You&apos;re in.
      </h3>

      <p className="mx-auto mt-4 max-w-[340px] text-fluid-body-lg text-forge-text-secondary">
        We&apos;ll reach out within 12 hours to discuss your project.
      </p>
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Globe,
  RefreshCw,
  LayoutGrid,
  Palette,
  AtSignIcon,
  UserIcon,
  SendIcon,
  ShieldCheck,
  HelpCircle,
  ChevronUpIcon,
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

const QUICK_SERVICES = [
  { label: "New Website", icon: Globe, value: "New Website" },
  { label: "Website Redesign", icon: RefreshCw, value: "Website Redesign" },
  { label: "Landing Page", icon: LayoutGrid, value: "Landing Page" },
  { label: "UI/UX Design", icon: Palette, value: "UI/UX Design" },
];

/* ── Helpers ── */
function isEmailLike(str: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}
function isWhatsAppLike(str: string) {
  return /^\+?\d[\d\s-]{6,}$/.test(str.replace(/\s/g, ""));
}

/* ══════════════════════════════════════════════════
   Floating Paths — exact AuthPage implementation
   ══════════════════════════════════════════════════ */
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
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-slate-950 dark:text-white"
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
            strokeOpacity={0.1 + path.id * 0.03}
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
const ForgeSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-border h-px w-full" />
      <span className="text-muted-foreground px-2 text-xs">OR</span>
      <div className="bg-border h-px w-full" />
    </div>
  );
};

/* ══════════════════════════════════════════════════
   Main Contact Component
   ══════════════════════════════════════════════════ */
export function Contact() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && nameRef.current && !isSuccess) {
      const t = setTimeout(() => nameRef.current?.focus(), 600);
      return () => clearTimeout(t);
    }
  }, [isVisible, isSuccess]);

  useEffect(() => {
    if (submitError) {
      const t = setTimeout(() => setSubmitError(null), 6000);
      return () => clearTimeout(t);
    }
  }, [submitError]);

  const isValid = useMemo(() => {
    return form.name.trim().length >= 2 && form.contact.trim().length >= 5;
  }, [form.name, form.contact]);

  const validate = useCallback((): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.contact.trim()) e.contact = "Please enter your email or WhatsApp";
    else if (!isEmailLike(form.contact) && !isWhatsAppLike(form.contact))
      e.contact = "Enter a valid email or WhatsApp number";
    return e;
  }, [form]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (touched[field] && errors[field as keyof FormErrors]) {
      setErrors((p) => {
        const n = { ...p };
        delete n[field as keyof FormErrors];
        return n;
      });
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((p) => ({ ...p, [field]: true }));
    const fe = validate();
    const err = fe[field as keyof FormErrors];
    setErrors((p) => {
      const n = { ...p };
      if (err) n[field as keyof FormErrors] = err;
      else delete n[field as keyof FormErrors];
      return n;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setTouched({ name: true, contact: true });
    const ne = validate();
    setErrors(ne);
    if (Object.keys(ne).length > 0) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
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

  const handleQuickService = (value: string) => {
    handleChange("serviceNeed", value);
    nameRef.current?.focus();
  };

  return (
    <section id="contact">
      <div
        ref={ref}
        className={cn(
          "transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
        )}
      >
        {/* ═══════════════════════════════════════════
            EXACT AuthPage structure — split 2-col layout
            ═══════════════════════════════════════════ */}
        <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
          {/* ── LEFT PANEL (decorative) ── */}
          <div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
            <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />

            {/* Brand */}
            <div className="z-10 flex items-center gap-2">
              <Sparkles className="size-6" />
              <p className="text-xl font-semibold">StackForge</p>
            </div>

            {/* Testimonial */}
            <div className="z-10 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-xl font-playfair">
                  &ldquo;StackForge delivered our site in 3 days. The quality
                  blew our expectations — best decision we made.&rdquo;
                </p>
                <footer className="font-mono text-sm font-semibold">
                  ~ Priya Sharma, Hyderabad
                </footer>
              </blockquote>
            </div>

            {/* Floating Paths */}
            <div className="absolute inset-0">
              <FloatingPaths position={1} />
              <FloatingPaths position={-1} />
            </div>
          </div>

          {/* ── RIGHT PANEL (form) ── */}
          <div className="relative flex min-h-screen flex-col justify-center p-4">
            {/* Radial gradient glow decorations — exact AuthPage values */}
            <div
              aria-hidden
              className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
            >
              <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 right-0 h-[320px] w-[560px] -translate-y-[350px] rounded-full" />
              <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-[320px] w-60 [translate:5%_-50%] rounded-full" />
              <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-[320px] w-60 -translate-y-[350px] rounded-full" />
            </div>

            {/* Back to top — exact AuthPage ghost button */}
            <Button variant="ghost" className="absolute top-7 left-5" asChild>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ChevronUpIcon className="size-4 me-2" />
                Home
              </button>
            </Button>

            {/* Form container — sm:w-sm like AuthPage */}
            <div className="mx-auto space-y-4 sm:w-sm">
              {/* Mobile brand */}
              <div className="flex items-center gap-2 lg:hidden">
                <Sparkles className="size-6" />
                <p className="text-xl font-semibold">StackForge</p>
              </div>

              {/* Heading — mirrors AuthPage "Sign In or Join Now!" */}
              <div className="flex flex-col space-y-1">
                <h1 className="text-fluid-hero font-bold font-playfair tracking-wide">
                  Start Your Project
                </h1>
                <p className="text-muted-foreground text-base">
                  Tell us what you need — we&apos;ll get it done.
                </p>
              </div>

              {isSuccess ? (
                <SuccessState />
              ) : (
                <>
                  {/* Quick service buttons — mirrors Google/Apple/GitHub stacked */}
                  <div className="space-y-2">
                    {QUICK_SERVICES.map((service) => (
                      <Button
                        key={service.value}
                        type="button"
                        size="lg"
                        className={cn(
                          "w-full justify-start",
                          form.serviceNeed === service.value &&
                            "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        onClick={() => handleQuickService(service.value)}
                      >
                        <service.icon className="size-4 me-2" />
                        {service.label}
                      </Button>
                    ))}
                  </div>

                  <ForgeSeparator />

                  {/* Form — mirrors AuthPage email section */}
                  <form onSubmit={handleSubmit} noValidate className="space-y-2">
                    <p className="text-muted-foreground text-start text-xs">
                      Enter your details to get a free consultation
                    </p>

                    {/* Name field */}
                    <div className="relative h-max">
                      <Input
                        ref={nameRef}
                        placeholder="Your full name"
                        className="peer ps-9"
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        autoComplete="name"
                      />
                      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <UserIcon className="size-4" aria-hidden="true" />
                      </div>
                      {touched.name && errors.name && (
                        <p className="mt-1 pl-1 text-[11px] leading-none text-red-400/80">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Contact field */}
                    <div className="relative h-max">
                      <Input
                        placeholder="Email or WhatsApp number"
                        className="peer ps-9"
                        type="text"
                        value={form.contact}
                        onChange={(e) => handleChange("contact", e.target.value)}
                        onBlur={() => handleBlur("contact")}
                        autoComplete="email"
                      />
                      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <AtSignIcon className="size-4" aria-hidden="true" />
                      </div>
                      {touched.contact && errors.contact && (
                        <p className="mt-1 pl-1 text-[11px] leading-none text-red-400/80">
                          {errors.contact}
                        </p>
                      )}
                    </div>

                    {/* Submit button — mirrors "Continue With Email" */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!isValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="size-4 animate-spin"
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
                        <span className="flex items-center gap-2">
                          <SendIcon className="size-4" />
                          Get Free Consultation
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Trust — mirrors Terms text */}
                  <p className="text-muted-foreground mt-8 flex items-center gap-2 text-sm">
                    <ShieldCheck className="size-3.5 flex-shrink-0" />
                    No spam. We&apos;ll contact you within 12 hours.
                  </p>

                  {/* Error */}
                  {submitError && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-500/10 bg-red-500/5 p-3">
                      <HelpCircle className="mt-0.5 size-4 flex-shrink-0 text-red-400/70" />
                      <p className="text-[13px] leading-relaxed text-red-400/80">
                        {submitError}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

/* ── Success State ── */
function SuccessState() {
  return (
    <div className="animate-success-enter py-8 text-center sm:py-12">
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
      <h3 className="text-fluid-hero font-bold font-playfair">
        You&apos;re in.
      </h3>
      <p className="text-muted-foreground mx-auto mt-4 max-w-[340px]">
        We&apos;ll reach out within 12 hours to discuss your project.
      </p>
    </div>
  );
}

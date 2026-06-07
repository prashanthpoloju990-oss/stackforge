"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { ImageSlider } from "@/components/ui/image-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const IMAGES = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=60",
];

/* ── Helpers ── */
function isEmailLike(str: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}
function isWhatsAppLike(str: string) {
  return /^\+?\d[\d\s-]{6,}$/.test(str.replace(/\s/g, ""));
}

/* ── Framer variants (exact from demo) ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

/* ══════════════════════════════════════════════════
   Main Contact Component — ImageSlider Login Demo layout
   ══════════════════════════════════════════════════ */
export function Contact() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
  const nameRef = React.useRef<HTMLInputElement>(null);
  const [form, setForm] = React.useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isVisible && nameRef.current && !isSuccess) {
      const t = setTimeout(() => nameRef.current?.focus(), 600);
      return () => clearTimeout(t);
    }
  }, [isVisible, isSuccess]);

  React.useEffect(() => {
    if (submitError) {
      const t = setTimeout(() => setSubmitError(null), 6000);
      return () => clearTimeout(t);
    }
  }, [submitError]);

  const isValid = React.useMemo(() => {
    return form.name.trim().length >= 2 && form.contact.trim().length >= 5;
  }, [form.name, form.contact]);

  const validate = React.useCallback((): FormErrors => {
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
        {/* ═══════════════════════════════════════════════
            EXACT ImageSlider Login Demo layout
            Container: full-width, min-h-screen, centered
            Card: max-w-5xl, h-[700px], 2-col grid, rounded-2xl
            ═══════════════════════════════════════════════ */}
        <div className="w-full min-h-screen min-h-[700px] flex items-center justify-center bg-background p-4">
          <motion.div
            className="w-full max-w-5xl h-[700px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* ── LEFT: Image Slider ── */}
            <div className="hidden lg:block">
              <ImageSlider images={IMAGES} interval={4000} />
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="w-full h-full bg-card text-card-foreground flex flex-col items-center justify-center p-8 md:p-12">
              <motion.div
                className="w-full max-w-sm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Heading — mirrors "Welcome Back" */}
                <motion.h1 variants={itemVariants} className="text-fluid-h1 font-bold tracking-tight mb-2 font-playfair">
                  Start Your Project
                </motion.h1>
                <motion.p variants={itemVariants} className="text-muted-foreground text-base mb-8">
                  Tell us what you need — we&apos;ll get it done.
                </motion.p>

                {/* Quick service buttons — mirrors Google/Apple row */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {QUICK_SERVICES.map((service) => (
                    <Button
                      key={service.value}
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-center",
                        form.serviceNeed === service.value &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                      )}
                      onClick={() => handleQuickService(service.value)}
                    >
                      <service.icon className="mr-2 h-4 w-4" />
                      {service.label}
                    </Button>
                  ))}
                </motion.div>

                {/* OR separator — exact from demo */}
                <motion.div variants={itemVariants} className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or fill in your details
                    </span>
                  </div>
                </motion.div>

                {/* Form — mirrors email + password fields */}
                <motion.form
                  variants={itemVariants}
                  className="space-y-6"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Name field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative h-max">
                      <Input
                        ref={nameRef}
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        className="peer ps-9"
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
                  </div>

                  {/* Contact field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contactEmail">Email / WhatsApp</Label>
                      <span className="text-xs text-muted-foreground">
                        We&apos;ll reply in 12h
                      </span>
                    </div>
                    <div className="relative h-max">
                      <Input
                        id="contactEmail"
                        type="text"
                        placeholder="Email or WhatsApp number"
                        autoComplete="email"
                        value={form.contact}
                        onChange={(e) => handleChange("contact", e.target.value)}
                        onBlur={() => handleBlur("contact")}
                        className="peer ps-9"
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
                  </div>

                  {/* Submit — mirrors "Log In" button */}
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
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                </motion.form>

                {/* Trust — mirrors "Don't have an account?" */}
                <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  No spam. We&apos;ll contact you within 12 hours.
                </motion.p>

                {/* Error */}
                {submitError && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/10 bg-red-500/5 p-3">
                    <HelpCircle className="mt-0.5 size-4 flex-shrink-0 text-red-400/70" />
                    <p className="text-[13px] leading-relaxed text-red-400/80">
                      {submitError}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

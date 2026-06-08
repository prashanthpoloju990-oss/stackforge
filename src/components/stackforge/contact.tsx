"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle2,
  AlertCircle,
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";

/* ══════════════════════════════════════════════════
   Types & Constants
   ══════════════════════════════════════════════════ */

interface FormData {
  name: string;
  contact: string;
  businessType: string;
  serviceNeed: string;
  budget: string;
  timeline: string;
  details: string;
}

type FormFieldKey = keyof FormData;
type FormErrors = Partial<Record<FormFieldKey, string>>;

interface FieldConfig {
  key: FormFieldKey;
  label: string;
  placeholder: string;
  required: boolean;
  icon: React.ElementType;
  type: "text" | "textarea" | "select";
  options?: string[];
  autoComplete?: string;
  validate?: (value: string) => string | undefined;
}

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

/* ── Field configurations ── */
const FIELDS: FieldConfig[] = [
  {
    key: "name",
    label: "Full Name",
    placeholder: "John Doe",
    required: true,
    icon: UserIcon,
    type: "text",
    autoComplete: "name",
    validate: (v) => {
      if (!v.trim()) return "Name is required";
      if (v.trim().length < 2) return "At least 2 characters";
      if (v.trim().length > 100) return "Name is too long";
      if (/^\d+$/.test(v.trim())) return "Name cannot be only numbers";
      return undefined;
    },
  },
  {
    key: "contact",
    label: "Email or WhatsApp",
    placeholder: "Email or WhatsApp number",
    required: true,
    icon: AtSignIcon,
    type: "text",
    autoComplete: "email",
    validate: (v) => {
      if (!v.trim()) return "Contact is required";
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
      const isWA = /^\+?\d[\d\s-]{9,}$/.test(v.replace(/\s/g, ""));
      if (!isEmail && !isWA) return "Enter a valid email or WhatsApp number";
      return undefined;
    },
  },
  {
    key: "businessType",
    label: "Business Type",
    placeholder: "Select your business type",
    required: true,
    icon: Building2,
    type: "select",
    options: ["Startup", "Local Business", "Personal Brand", "Agency", "Enterprise", "Other"],
    validate: (v) => {
      if (!v) return "Please select your business type";
      return undefined;
    },
  },
  {
    key: "serviceNeed",
    label: "What Do You Need?",
    placeholder: "Select a service",
    required: true,
    icon: Briefcase,
    type: "select",
    options: ["New Website", "Website Redesign", "Landing Page", "UI/UX Design", "Full Stack App", "Not sure yet"],
    validate: (v) => {
      if (!v) return "Please select a service";
      return undefined;
    },
  },
  {
    key: "budget",
    label: "Budget Range",
    placeholder: "Select your budget",
    required: true,
    icon: DollarSign,
    type: "select",
    options: ["$100 – $300", "$300 – $700", "$700 – $1,500", "$1,500 – $5,000", "$5,000+"],
    validate: (v) => {
      if (!v) return "Please select a budget range";
      return undefined;
    },
  },
  {
    key: "timeline",
    label: "Timeline",
    placeholder: "Select your timeline",
    required: true,
    icon: Clock,
    type: "select",
    options: ["Urgent (1–3 days)", "This week", "This month", "Flexible", "3+ months"],
    validate: (v) => {
      if (!v) return "Please select a timeline";
      return undefined;
    },
  },
  {
    key: "details",
    label: "Project Details",
    placeholder: "Describe your project, goals, and any specific requirements...",
    required: false,
    icon: FileText,
    type: "textarea",
    validate: (v) => {
      if (v.trim().length > 0 && v.trim().length < 10)
        return "Please provide at least 10 characters";
      if (v.trim().length > 2000) return "Details are too long (max 2000 chars)";
      return undefined;
    },
  },
];

/* ── Framer variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

/* ══════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════ */
export function Contact() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
  const nameRef = React.useRef<HTMLInputElement>(null);
  const [form, setForm] = React.useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Partial<Record<FormFieldKey, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  /* Autofocus first field */
  React.useEffect(() => {
    if (isVisible && nameRef.current && !isSuccess) {
      const t = setTimeout(() => nameRef.current?.focus(), 600);
      return () => clearTimeout(t);
    }
  }, [isVisible, isSuccess]);

  /* Auto-clear submit error */
  React.useEffect(() => {
    if (submitError) {
      const t = setTimeout(() => setSubmitError(null), 6000);
      return () => clearTimeout(t);
    }
  }, [submitError]);

  /* ── Per-field validation ── */
  const validateField = React.useCallback(
    (key: FormFieldKey): string | undefined => {
      const field = FIELDS.find((f) => f.key === key);
      if (!field) return undefined;
      if (field.validate) return field.validate(form[key]);
      return undefined;
    },
    [form]
  );

  /* ── Full form validation ── */
  const validateAll = React.useCallback((): FormErrors => {
    const errs: FormErrors = {};
    for (const field of FIELDS) {
      if (field.required || form[field.key].trim().length > 0) {
        const err = field.validate?.(form[field.key]);
        if (err) errs[field.key] = err;
      }
    }
    return errs;
  }, [form]);

  /* ── Form completeness (for submit button) ── */
  const requiredFields = FIELDS.filter((f) => f.required);
  const isValid = React.useMemo(() => {
    return requiredFields.every((f) => validateField(f.key) === undefined);
  }, [requiredFields, validateField]);

  /* ── Completion progress (filled required / total required) ── */
  const filledCount = React.useMemo(() => {
    return requiredFields.filter((f) => validateField(f.key) === undefined).length;
  }, [requiredFields, validateField]);

  const progressPercent = React.useMemo(() => {
    return Math.round((filledCount / requiredFields.length) * 100);
  }, [filledCount, requiredFields]);

  /* ── Handlers ── */
  const handleChange = (field: FormFieldKey, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    /* Clear error on type */
    if (touched[field] && errors[field]) {
      const err = FIELDS.find((f) => f.key === field)?.validate?.(value);
      setErrors((p) => {
        const n = { ...p };
        if (!err) delete n[field];
        else n[field] = err;
        return n;
      });
    }
  };

  const handleBlur = (field: FormFieldKey) => {
    setTouched((p) => ({ ...p, [field]: true }));
    const err = validateField(field);
    setErrors((p) => {
      const n = { ...p };
      if (err) n[field] = err;
      else delete n[field];
      return n;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    /* Touch all required fields */
    const newTouched: Partial<Record<FormFieldKey, boolean>> = {};
    requiredFields.forEach((f) => { newTouched[f.key] = true; });
    setTouched(newTouched);

    const ne = validateAll();
    setErrors(ne);

    if (Object.keys(ne).length > 0) {
      /* Focus first error field */
      const firstError = requiredFields.find((f) => ne[f.key]);
      if (firstError) {
        const el = document.getElementById(firstError.key);
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

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

  /* ── Render field ── */
  const renderField = (field: FieldConfig, index: number) => {
    const hasError = touched[field.key] && errors[field.key];
    const isValidField = touched[field.key] && !errors[field.key] && form[field.key].trim().length > 0;
    const isRequired = field.required;

    return (
      <motion.div key={field.key} variants={itemVariants} className="space-y-1.5">
        {/* Label row */}
        <div className="flex items-center justify-between">
          <Label
            htmlFor={field.key}
            className={cn(
              "text-sm font-medium",
              hasError && "text-red-400"
            )}
          >
            {field.label}
            {isRequired && (
              <span className="ml-0.5 text-red-400/70">*</span>
            )}
          </Label>
          {field.key === "details" && (
            <span className="text-xs text-muted-foreground">
              {form.details.trim().length} / 2000
            </span>
          )}
        </div>

        {/* Input / Select / Textarea */}
        {field.type === "select" ? (
          <div className="relative">
            <select
              id={field.key}
              value={form[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              onBlur={() => handleBlur(field.key)}
              className={cn(
                "flex h-9 w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-colors appearance-none cursor-pointer",
                "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
                hasError
                  ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100"
                  : isValidField
                    ? "border-green-500/50"
                    : "border-input",
                !form[field.key] && "text-muted-foreground"
              )}
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {/* Status icon */}
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
              {hasError ? (
                <AlertCircle className="size-3.5 text-red-400" />
              ) : isValidField ? (
                <CheckCircle2 className="size-3.5 text-green-500" />
              ) : null}
            </div>
          </div>
        ) : field.type === "textarea" ? (
          <div className="relative">
            <textarea
              id={field.key}
              value={form[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              onBlur={() => handleBlur(field.key)}
              placeholder={field.placeholder}
              rows={3}
              maxLength={2000}
              className={cn(
                "flex w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-colors resize-none",
                "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
                hasError
                  ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100"
                  : isValidField
                    ? "border-green-500/50"
                    : "border-input",
                "min-h-[80px]"
              )}
            />
          </div>
        ) : (
          <div className="relative h-max">
            <Input
              ref={field.key === "name" ? nameRef : undefined}
              id={field.key}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              value={form[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              onBlur={() => handleBlur(field.key)}
              className={cn(
                "peer ps-9",
                hasError
                  ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100"
                  : isValidField
                    ? "border-green-500/50"
                    : ""
              )}
            />
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <field.icon className="size-4" aria-hidden="true" />
            </div>
            {/* Status icon */}
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
              {hasError ? (
                <AlertCircle className="size-3.5 text-red-400" />
              ) : isValidField ? (
                <CheckCircle2 className="size-3.5 text-green-500" />
              ) : null}
            </div>
          </div>
        )}

        {/* Error message */}
        <AnimatePresence mode="wait">
          {hasError && errors[field.key] && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 pl-0.5 text-[11px] leading-relaxed text-red-400/90"
            >
              <AlertCircle className="size-3 flex-shrink-0" />
              {errors[field.key]}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  /* Input fields only (not selects/textareas — rendered differently) */
  const inputFields = FIELDS.filter((f) => f.type === "text");
  const selectFields = FIELDS.filter((f) => f.type === "select");
  const textareaFields = FIELDS.filter((f) => f.type === "textarea");

  return (
    <section id="contact">
      <div
        ref={ref}
        className={cn(
          "transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
        )}
      >
        <div className="w-full min-h-screen flex items-center justify-center bg-background p-4 py-12">
          <motion.div
            className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* ── LEFT: Image Slider ── */}
            <div className="hidden lg:block min-h-[600px] lg:min-h-0">
              <ImageSlider images={IMAGES} interval={4000} />
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="w-full bg-card text-card-foreground flex flex-col items-center justify-start p-6 md:p-10 lg:p-12 max-h-screen lg:max-h-screen lg:overflow-y-auto">
              <motion.div
                className="w-full max-w-md py-8 lg:py-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Heading */}
                <motion.h1 variants={itemVariants} className="text-fluid-h1 font-bold tracking-tight mb-1 font-playfair">
                  Start Your Project
                </motion.h1>
                <motion.p variants={itemVariants} className="text-muted-foreground text-sm mb-6">
                  Tell us what you need — we&apos;ll get it done.
                </motion.p>

                {/* Progress bar */}
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">
                      {filledCount}/{requiredFields.length} required fields
                    </span>
                    <span className="text-xs font-medium tabular-nums" style={{ color: progressPercent === 100 ? "#22c55e" : "var(--foreground)" }}>
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{
                        width: `${progressPercent}%`,
                        backgroundColor: progressPercent === 100 ? "#22c55e" : "var(--forge-accent, #FF6A00)",
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>

                {isSuccess ? (
                  <SuccessState />
                ) : (
                  <>
                    {/* Quick service buttons */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-5">
                      {QUICK_SERVICES.map((service) => (
                        <Button
                          key={service.value}
                          type="button"
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-full justify-center text-xs",
                            form.serviceNeed === service.value &&
                              "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                          )}
                          onClick={() => handleQuickService(service.value)}
                        >
                          <service.icon className="mr-1.5 h-3.5 w-3.5" />
                          {service.label}
                        </Button>
                      ))}
                    </motion.div>

                    {/* OR separator */}
                    <motion.div variants={itemVariants} className="relative mb-5">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or fill in the form
                        </span>
                      </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                      variants={itemVariants}
                      className="space-y-4"
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      {/* Text inputs: Name + Contact side by side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {inputFields.map((field) => renderField(field, 0))}
                      </div>

                      {/* Select fields: 2x2 grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectFields.map((field) => renderField(field, 0))}
                      </div>

                      {/* Textarea */}
                      {textareaFields.map((field) => renderField(field, 0))}

                      {/* Submit */}
                      <div className="pt-2">
                        <Button
                          type="submit"
                          className={cn(
                            "w-full transition-all",
                            !isValid && !isSubmitting && "opacity-70"
                          )}
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              {isValid ? (
                                <CheckCircle2 className="size-4" />
                              ) : (
                                <SendIcon className="size-4" />
                              )}
                              {isValid ? "Submit Project Inquiry" : "Get Free Consultation"}
                            </span>
                          )}
                        </Button>
                      </div>
                    </motion.form>

                    {/* Trust */}
                    <motion.p variants={itemVariants} className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="size-3" />
                      No spam. We&apos;ll contact you within 12 hours.
                    </motion.p>

                    {/* Error */}
                    <AnimatePresence>
                      {submitError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/10 bg-red-500/5 p-3"
                        >
                          <HelpCircle className="mt-0.5 size-4 flex-shrink-0 text-red-400/70" />
                          <p className="text-[13px] leading-relaxed text-red-400/80">
                            {submitError}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Success State ── */
function SuccessState() {
  return (
    <div className="animate-success-enter py-10 text-center">
      <div className="mb-6 flex justify-center">
        <div className="relative h-16 w-16">
          <div className="animate-check-circle absolute inset-0 rounded-full border border-green-500/30 bg-green-500/10" />
          <svg className="absolute inset-0 h-16 w-16" viewBox="0 0 64 64" fill="none">
            <path
              className="animate-check-draw"
              d="M20 33 L28 41 L44 24"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-fluid-h2 font-bold font-playfair">
        You&apos;re all set!
      </h3>
      <p className="text-muted-foreground mx-auto mt-3 max-w-[300px] text-sm">
        We&apos;ve received your inquiry and will get back to you within 12 hours.
      </p>
    </div>
  );
}

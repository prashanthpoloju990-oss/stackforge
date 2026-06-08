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
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Upload,
  X,
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
    placeholder: "you@example.com or +91 98765 43210",
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
    placeholder: "When do you need it?",
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
    placeholder: "Describe your project, goals, and any specific requirements…",
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

/* Step 1 fields: name, contact + quick service buttons */
const STEP_1_KEYS: FormFieldKey[] = ["name", "contact"];
const STEP_2_KEYS: FormFieldKey[] = ["businessType", "serviceNeed", "budget", "timeline", "details"];

const STEP_1_FIELDS = FIELDS.filter((f) => STEP_1_KEYS.includes(f.key));
const STEP_2_FIELDS = FIELDS.filter((f) => STEP_2_KEYS.includes(f.key));

/* ── Framer variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const slideInRight = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: -60, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

const slideInLeft = {
  initial: { x: -60, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: 60, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

/* ══════════════════════════════════════════════════
   Step Indicator
   ══════════════════════════════════════════════════ */
function StepIndicator({
  step,
  direction,
}: {
  step: 1 | 2;
  direction: number;
}) {
  const steps = [
    { num: 1, label: "Your Details" },
    { num: 2, label: "Your Project" },
  ] as const;

  return (
    <div className="flex items-center gap-3 mb-7">
      {steps.map((s, i) => {
        const isActive = step === s.num;
        const isDone = step > s.num;

        return (
          <React.Fragment key={s.num}>
            {i > 0 && (
              <motion.div
                className="h-px flex-1"
                animate={{ backgroundColor: isDone ? "var(--forge-accent, #FF6A00)" : "var(--border)" }}
                transition={{ duration: 0.4 }}
              />
            )}
            <motion.div
              className="flex items-center gap-2"
              key={`${s.num}-${direction}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                  isActive
                    ? "bg-forge-accent text-white shadow-sm shadow-orange-500/20"
                    : isDone
                      ? "bg-forge-accent/15 text-forge-accent"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  s.num
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300 hidden sm:block",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

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
  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);
  const [slideDirection, setSlideDirection] = React.useState<number>(1);
  const [files, setFiles] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: File[]) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = newFiles.filter((f) => f.size <= maxSize);
    setFiles((prev) => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* Autofocus first field on step 1 */
  React.useEffect(() => {
    if (isVisible && currentStep === 1 && nameRef.current && !isSuccess) {
      const t = setTimeout(() => nameRef.current?.focus(), 600);
      return () => clearTimeout(t);
    }
  }, [isVisible, currentStep, isSuccess]);

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

  /* ── Validate a set of fields ── */
  const validateStep = React.useCallback(
    (keys: FormFieldKey[]): boolean => {
      const errs: FormErrors = {};
      const newTouched: Partial<Record<FormFieldKey, boolean>> = {};

      keys.forEach((key) => {
        newTouched[key] = true;
        const field = FIELDS.find((f) => f.key === key);
        if (field?.required || form[key].trim().length > 0) {
          const err = field?.validate?.(form[key]);
          if (err) errs[key] = err;
        }
      });

      setTouched((p) => ({ ...p, ...newTouched }));
      setErrors((p) => ({ ...p, ...errs }));

      if (Object.keys(errs).length > 0) {
        const firstErr = keys.find((k) => errs[k]);
        if (firstErr) {
          const el = document.getElementById(firstErr);
          el?.focus();
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return false;
      }
      return true;
    },
    [form]
  );

  /* ── Completion per step ── */
  const step1Valid = React.useMemo(() => {
    return STEP_1_KEYS.every((k) => validateField(k) === undefined);
  }, [STEP_1_KEYS, validateField]);

  const step2Valid = React.useMemo(() => {
    const required = STEP_2_FIELDS.filter((f) => f.required);
    return required.every((f) => validateField(f.key) === undefined);
  }, [STEP_2_FIELDS, validateField]);

  /* Overall progress */
  const allRequiredFields = FIELDS.filter((f) => f.required);
  const filledCount = React.useMemo(() => {
    return allRequiredFields.filter((f) => validateField(f.key) === undefined).length;
  }, [allRequiredFields, validateField]);
  const progressPercent = React.useMemo(() => {
    return Math.round((filledCount / allRequiredFields.length) * 100);
  }, [filledCount, allRequiredFields]);

  /* ── Handlers ── */
  const handleChange = (field: FormFieldKey, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
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

  const handleNext = () => {
    if (validateStep(STEP_1_KEYS)) {
      setSlideDirection(1);
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setSlideDirection(-1);
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateStep(STEP_2_KEYS)) return;

    /* Also double-check step 1 fields */
    const step1Errs: FormErrors = {};
    STEP_1_KEYS.forEach((key) => {
      const err = validateField(key);
      if (err) step1Errs[key] = err;
    });
    if (Object.keys(step1Errs).length > 0) {
      setErrors((p) => ({ ...p, ...step1Errs }));
      setSlideDirection(-1);
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      /* Convert files to base64 for submission */
      const fileData = await Promise.all(
        files.map(async (f) => {
          const buffer = await f.arrayBuffer();
          return {
            name: f.name,
            type: f.type,
            size: f.size,
            data: Buffer.from(buffer).toString("base64"),
          };
        })
      );

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, files: fileData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setIsSuccess(true);
      setForm(INITIAL_FORM);
      setFiles([]);
      setTouched({});
      setErrors({});
      setCurrentStep(1);
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
  const renderField = (field: FieldConfig) => {
    const hasError = touched[field.key] && errors[field.key];
    const isValidField = touched[field.key] && !errors[field.key] && form[field.key].trim().length > 0;
    const isRequired = field.required;

    return (
      <div key={field.key} className="space-y-2">
        {/* Label row */}
        <div className="flex items-center justify-between">
          <Label
            htmlFor={field.key}
            className={cn(
              "text-sm font-medium leading-none",
              hasError ? "text-red-400" : "text-foreground/80"
            )}
          >
            {field.label}
            {isRequired && <span className="ml-1 text-red-400/60">*</span>}
          </Label>
          {field.key === "details" && (
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {form.details.trim().length}/2000
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
                "flex h-11 w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-all duration-200 appearance-none cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring",
                "hover:border-border/80",
                "disabled:cursor-not-allowed disabled:opacity-50",
                hasError
                  ? "border-red-300/80 focus-visible:ring-red-200"
                  : isValidField
                    ? "border-green-500/40 focus-visible:ring-green-200"
                    : "border-input",
                !form[field.key] && "text-muted-foreground"
              )}
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
              {hasError ? (
                <AlertCircle className="size-3.5 text-red-400" />
              ) : isValidField ? (
                <CheckCircle2 className="size-3.5 text-green-500" />
              ) : (
                <ChevronRight className="size-3.5 text-muted-foreground -rotate-90" />
              )}
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
              rows={4}
              maxLength={2000}
              className={cn(
                "flex w-full rounded-lg border bg-background px-3 py-2.5 text-sm shadow-sm shadow-black/5 transition-all duration-200 resize-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring",
                "hover:border-border/80",
                "min-h-[100px]",
                hasError
                  ? "border-red-300/80 focus-visible:ring-red-200"
                  : isValidField
                    ? "border-green-500/40 focus-visible:ring-green-200"
                    : "border-input"
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
                "peer ps-10 h-11",
                hasError
                  ? "border-red-300/80 focus-visible:ring-red-200"
                  : isValidField
                    ? "border-green-500/40 focus-visible:ring-green-200"
                    : ""
              )}
            />
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <field.icon className="size-4" aria-hidden="true" />
            </div>
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 overflow-hidden pl-0.5 text-[11px] leading-relaxed text-red-400/90"
            >
              <AlertCircle className="size-3 flex-shrink-0" />
              {errors[field.key]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /* ── Step 1 content ── */
  const renderStep1 = () => (
    <motion.div
      key="step-1"
      {...slideInRight}
      className="space-y-5"
    >
      {/* Quick service buttons */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          What do you need?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_SERVICES.map((service) => (
            <motion.button
              type="button"
              key={service.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-xs font-medium transition-all duration-200 min-h-[44px]",
                form.serviceNeed === service.value
                  ? "bg-forge-accent text-white border-forge-accent shadow-sm shadow-orange-500/15"
                  : "bg-background text-foreground/70 border-input hover:border-forge-accent/40 hover:text-foreground"
              )}
              onClick={() => handleQuickService(service.value)}
            >
              <service.icon className="size-3.5" />
              {service.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Or fill your details</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Name */}
      {STEP_1_FIELDS.map((field) => renderField(field))}

      {/* Continue button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleNext}
          className={cn(
            "w-full h-11 text-sm font-semibold transition-all duration-300",
            step1Valid
              ? "bg-forge-accent hover:bg-forge-accent/90 text-white shadow-sm shadow-orange-500/15"
              : "opacity-50 cursor-not-allowed"
          )}
          disabled={!step1Valid}
        >
          <span className="flex items-center gap-2">
            Continue
            <ArrowRight className="size-4" />
          </span>
        </Button>
      </div>
    </motion.div>
  );

  /* ── Step 2 content ── */
  const renderStep2 = (dir: number) => (
    <motion.div
      key="step-2"
      {...(dir > 0 ? slideInRight : slideInLeft)}
      className="space-y-5"
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        Project specifics
      </p>

      {/* Select fields in 2-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {STEP_2_FIELDS.filter((f) => f.type === "select").map((field) => renderField(field))}
      </div>

      {/* Textarea */}
      {STEP_2_FIELDS.filter((f) => f.type === "textarea").map((field) => renderField(field))}

      {/* File Upload Area */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground/80">
          Attachments
          <span className="ml-1 text-forge-text-secondary/40 text-xs">(optional)</span>
        </Label>
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
            "hover:border-forge-accent/40 hover:bg-forge-accent/5",
            isDragging
              ? "border-forge-accent bg-forge-accent/10"
              : "border-forge-divider"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(Array.from(e.dataTransfer.files));
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.svg,.doc,.docx,.txt,.zip"
            className="hidden"
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          />
          <Upload className="mx-auto size-5 text-forge-text-secondary/30 mb-2" />
          <p className="text-xs text-forge-text-secondary/50">
            Drop files here or <span className="text-forge-accent/70">browse</span>
          </p>
          <p className="text-[11px] text-forge-text-secondary/30 mt-1">
            PDF, PNG, JPG, GIF up to 10MB each
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-1.5">
            {files.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-forge-surface/50 border border-forge-divider/40 text-xs"
              >
                <span className="truncate text-forge-text-secondary/70">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-forge-text-secondary/40 hover:text-red-400 shrink-0"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="h-11 px-5 text-sm font-medium"
        >
          <span className="flex items-center gap-1.5">
            <ArrowLeft className="size-3.5" />
            Back
          </span>
        </Button>
        <Button
          type="submit"
          className={cn(
            "flex-1 h-11 text-sm font-semibold transition-all duration-300",
            step2Valid
              ? "bg-forge-accent hover:bg-forge-accent/90 text-white shadow-sm shadow-orange-500/15"
              : "opacity-50 cursor-not-allowed"
          )}
          disabled={isSubmitting || !step2Valid}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <SendIcon className="size-4" />
              Submit Project Inquiry
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );

  /* ══════════════════════════════════════════════════
     Render
     ══════════════════════════════════════════════════ */
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
            <div className="w-full bg-card text-card-foreground flex flex-col items-center justify-start p-6 md:p-10 lg:p-12">
              <div className="w-full max-w-md py-6 lg:py-4">
                {/* Heading — always visible */}
                <div className="mb-6">
                  <h1 className="text-fluid-h1 font-bold tracking-tight mb-1 font-playfair">
                    Start Your Project
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {currentStep === 1
                      ? "Tell us who you are — we'll handle the rest."
                      : "Almost there! Describe your dream project."}
                  </p>
                </div>

                {/* Step Indicator */}
                <StepIndicator step={currentStep} direction={slideDirection} />

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-muted-foreground">
                      {filledCount}/{allRequiredFields.length} required
                    </span>
                    <span
                      className="text-[11px] font-medium tabular-nums"
                      style={{ color: progressPercent === 100 ? "#22c55e" : "var(--foreground)" }}
                    >
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{
                        width: `${progressPercent}%`,
                        backgroundColor:
                          progressPercent === 100
                            ? "#22c55e"
                            : "var(--forge-accent, #FF6A00)",
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {isSuccess ? (
                  <SuccessState />
                ) : (
                  <>
                    <form onSubmit={handleSubmit} noValidate>
                      <AnimatePresence mode="wait">
                        {currentStep === 1
                          ? renderStep1()
                          : renderStep2(slideDirection)}
                      </AnimatePresence>
                    </form>

                    {/* Trust text */}
                    <p className="text-center text-[11px] text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="size-3" />
                      No spam. We&apos;ll contact you within 12 hours.
                    </p>

                    {/* Submit error */}
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
              </div>
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="py-10 text-center"
    >
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
    </motion.div>
  );
}

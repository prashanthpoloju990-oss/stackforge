"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Check,
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
  pageCount: number;
  features: string[];
  website: string;
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
  pageCount: 1,
  features: [],
  website: "",
};

const QUICK_SERVICES = [
  { label: "New Website", icon: Globe, value: "New Website" },
  { label: "Website Redesign", icon: RefreshCw, value: "Website Redesign" },
  { label: "Landing Page", icon: LayoutGrid, value: "Landing Page" },
  { label: "UI/UX Design", icon: Palette, value: "UI/UX Design" },
];

const IMAGES = [
  "/images/team_handshake.png",
  "/images/client_meeting.png",
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
      if (v.includes("@") || isEmail) {
        if (!isEmail) return "Enter a valid email address";
        return undefined;
      } else {
        const digits = v.replace(/\D/g, "");
        if (digits.length === 0) {
          return "Enter a valid email or 10-digit phone number";
        }
        if (digits.length !== 10) {
          return `Phone number must be exactly 10 digits (you entered ${digits.length})`;
        }
        return undefined;
      }
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
    options: ["Under ₹2,500", "₹2,500 – ₹5,000", "₹5,000 – ₹15,000", "₹15,000 – ₹50,000", "₹50,000+"],
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

/* ── Scope & Cost Estimator Types & Logic ── */
interface EstimateResult {
  complexityScore: number; // 0 to 100
  priceMin: number;
  priceMax: number;
  timelineMin: number; // in days
  timelineMax: number; // in days
  timelineUnit: "days" | "weeks";
  recommendedPlan: string;
  budgetOption: string;
  timelineOption: string;
}

const FEATURE_VALUES: Record<string, { price: number; complexity: number; days: number; name: string }> = {
  db: { price: 15000, complexity: 25, days: 10, name: "Database & CMS" },
  auth: { price: 10000, complexity: 15, days: 5, name: "User Auth" },
  stripe: { price: 12000, complexity: 15, days: 5, name: "Stripe Payments" },
  motion: { price: 8000, complexity: 10, days: 4, name: "Bespoke Animations" },
  seo: { price: 5000, complexity: 8, days: 3, name: "SEO & Audit" },
};

function calculateEstimate(serviceNeed: string, pageCount: number, features: string[]): EstimateResult {
  let basePrice = 1200;
  let baseComplexity = 10;
  let baseDays = 2;
  
  switch (serviceNeed) {
    case "Landing Page":
      basePrice = 1800;
      baseComplexity = 15;
      baseDays = 3;
      break;
    case "New Website":
      basePrice = 2200;
      baseComplexity = 20;
      baseDays = 5;
      break;
    case "Website Redesign":
      basePrice = 2000;
      baseComplexity = 15;
      baseDays = 4;
      break;
    case "UI/UX Design":
      basePrice = 1500;
      baseComplexity = 12;
      baseDays = 4;
      break;
    case "Full Stack App":
      basePrice = 8000;
      baseComplexity = 40;
      baseDays = 14;
      break;
    default:
      basePrice = 1500;
      baseComplexity = 15;
      baseDays = 5;
  }

  const pageMultiplier = Math.max(1, pageCount);
  const pagePriceFactor = pageMultiplier * 800;
  const pageComplexityFactor = pageMultiplier * 2.5;
  const pageDaysFactor = pageMultiplier * 1; 

  let featuresPrice = 0;
  let featuresComplexity = 0;
  let featuresDays = 0;

  features.forEach(feat => {
    const val = FEATURE_VALUES[feat];
    if (val) {
      featuresPrice += val.price;
      featuresComplexity += val.complexity;
      featuresDays += val.days;
    }
  });

  const totalPrice = basePrice + pagePriceFactor + featuresPrice;
  const totalComplexity = Math.min(100, Math.round(baseComplexity + pageComplexityFactor + featuresComplexity));
  const totalDays = baseDays + pageDaysFactor + featuresDays;

  let recommendedPlan = "Launch Kit";
  if (totalComplexity > 65 || totalPrice >= 50000) {
    recommendedPlan = "Enterprise Bag";
  } else if (totalComplexity > 30 || totalPrice >= 5000) {
    recommendedPlan = "Growth Pack";
  }

  let budgetOption = "Under ₹2,500";
  if (totalPrice >= 50000) {
    budgetOption = "₹50,000+";
  } else if (totalPrice >= 15000) {
    budgetOption = "₹15,000 – ₹50,000";
  } else if (totalPrice >= 5000) {
    budgetOption = "₹5,000 – ₹15,000";
  } else if (totalPrice >= 2500) {
    budgetOption = "₹2,500 – ₹5,000";
  }

  let timelineOption = "Flexible";
  if (totalDays <= 3) {
    timelineOption = "Urgent (1–3 days)";
  } else if (totalDays <= 7) {
    timelineOption = "This week";
  } else if (totalDays <= 30) {
    timelineOption = "This month";
  } else if (totalDays > 30 && totalDays <= 90) {
    timelineOption = "Flexible";
  } else {
    timelineOption = "3+ months";
  }

  return {
    complexityScore: totalComplexity,
    priceMin: Math.round(totalPrice * 0.9),
    priceMax: Math.round(totalPrice * 1.1),
    timelineMin: Math.max(1, Math.round(totalDays * 0.85)),
    timelineMax: Math.round(totalDays * 1.15),
    timelineUnit: totalDays > 14 ? "weeks" : "days",
    recommendedPlan,
    budgetOption,
    timelineOption
  };
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

  // OTP Verification States
  const [showOtpView, setShowOtpView] = React.useState(false);
  const [otpEmail, setOtpEmail] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpLoading, setOtpLoading] = React.useState(false);
  const [otpError, setOtpError] = React.useState<string | null>(null);

  const handleFiles = (newFiles: File[]) => {
    const maxSize = 3 * 1024 * 1024; // 3MB (Vercel payload limit is 4.5MB)
    const totalLimit = 3.5 * 1024 * 1024; // 3.5MB total combined size
    
    setFiles((prev) => {
      const combined = [...prev];
      for (const f of newFiles) {
        if (f.size <= maxSize) {
          const currentTotal = combined.reduce((acc, file) => acc + file.size, 0);
          if (currentTotal + f.size <= totalLimit && combined.length < 3) {
            combined.push(f);
          }
        }
      }
      return combined;
    });
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

  /* Auto-fill package and price based on URL query parameter */
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");
      if (plan) {
        const t = setTimeout(() => {
          if (plan === "launch-kit") {
            setForm((p) => {
              const next = {
                ...p,
                serviceNeed: "New Website",
              };
              const est = calculateEstimate(next.serviceNeed, next.pageCount, next.features);
              next.budget = est.budgetOption;
              next.timeline = est.timelineOption;
              return next;
            });
          } else if (plan === "growth-pack") {
            setForm((p) => {
              const next = {
                ...p,
                serviceNeed: "New Website",
                pageCount: 5,
              };
              const est = calculateEstimate(next.serviceNeed, next.pageCount, next.features);
              next.budget = est.budgetOption;
              next.timeline = est.timelineOption;
              return next;
            });
          } else if (plan === "enterprise-bag" || plan === "enterprise") {
            setForm((p) => {
              const next = {
                ...p,
                serviceNeed: "Full Stack App",
              };
              const est = calculateEstimate(next.serviceNeed, next.pageCount, next.features);
              next.budget = est.budgetOption;
              next.timeline = est.timelineOption;
              return next;
            });
          }
        }, 0);
        return () => clearTimeout(t);
      }
    }
  }, []);

  /* Auto-clear submit error */
  React.useEffect(() => {
    if (submitError) {
      const t = setTimeout(() => setSubmitError(null), 6000);
      return () => clearTimeout(t);
    }
  }, [submitError]);

  // Budget and timeline are automatically synchronized in state update handlers.

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
  const handleChange = (field: FormFieldKey, value: any) => {
    let formattedValue = value;
    if (field === "contact") {
      if (!value.includes("@") && /^[0-9+\s\-()]*$/.test(value)) {
        const digits = value.replace(/\D/g, "");
        if (digits.length > 10) {
          const truncated = digits.slice(0, 10);
          const hasPlus = value.startsWith("+");
          formattedValue = (hasPlus ? "+" : "") + truncated;
        }
      }
    }

    setForm((p) => {
      const next = { ...p, [field]: formattedValue };
      if (field === "serviceNeed" || field === "pageCount" || field === "features") {
        const est = calculateEstimate(next.serviceNeed, next.pageCount, next.features);
        next.budget = est.budgetOption;
        next.timeline = est.timelineOption;
      }
      return next;
    });

    if (touched[field] && errors[field]) {
      const err = FIELDS.find((f) => f.key === field)?.validate?.(String(formattedValue));
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

  const sendOtp = async (email: string) => {
    setOtpLoading(true);
    setOtpError(null);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      setOtpSent(true);
      setOtpEmail(email);
      setShowOtpView(true);
    } catch (err: any) {
      setOtpError(err.message || "Failed to send verification code");
      setShowOtpView(true);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleTriggerOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateStep(STEP_2_KEYS)) return;

    /* Double-check step 1 */
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

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.contact.trim());
    if (isEmail) {
      await sendOtp(form.contact.trim());
    } else {
      // If WhatsApp number was entered, trigger OTP view to ask for email
      setShowOtpView(true);
      setOtpSent(false);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (otpCode.trim().length !== 4) {
      setOtpError("Please enter a valid 4-digit code");
      return;
    }

    setIsSubmitting(true);
    try {
      /* Convert files to base64 for submission */
      const fileData = await Promise.all(
        files.map(async (f) => {
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = (err) => reject(err);
          });
          return {
            name: f.name,
            type: f.type,
            size: f.size,
            data: base64Data,
          };
        })
      );

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          files: fileData,
          otpCode: otpCode.trim(),
          otpEmail: otpEmail.trim().toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setIsSuccess(true);
      setForm(INITIAL_FORM);
      setFiles([]);
      setTouched({});
      setErrors({});
      setCurrentStep(1);
      setShowOtpView(false);
      setOtpSent(false);
      setOtpCode("");
      setOtpEmail("");
    } catch (err: any) {
      setOtpError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickService = React.useCallback((value: string) => {
    handleChange( "serviceNeed", value);
    requestAnimationFrame(() => {
      nameRef.current?.focus();
    });
  }, [handleChange]);

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
      className="space-y-4"
    >
      {/* Quick service buttons */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          What do you need?
        </p>
        <div className="grid grid-cols-2 gap-3.5">
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
      <div className="pt-1">
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
      className="space-y-4"
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        Project specifics
      </p>

      {/* Core selects: Business Type & Service Needed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField(FIELDS.find((f) => f.key === "businessType")!)}
        {renderField(FIELDS.find((f) => f.key === "serviceNeed")!)}
      </div>

      {/* Estimator Inputs: Page Count Slider */}
      <div className="space-y-2 bg-forge-surface/30 border border-forge-divider/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="pageCount" className="text-sm font-semibold text-foreground/90">
            Number of Pages
          </Label>
          <span className="text-xs font-mono font-bold text-white px-2 py-0.5 bg-forge-accent rounded shadow-[1px_1px_0px_0px_var(--forge-text)]">
            {form.pageCount === 20 ? "20+ Pages" : `${form.pageCount} ${form.pageCount === 1 ? 'Page' : 'Pages'}`}
          </span>
        </div>
        <input
          id="pageCount"
          type="range"
          min="1"
          max="20"
          value={form.pageCount}
          onChange={(e) => handleChange("pageCount", parseInt(e.target.value, 10) as any)}
          className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-forge-accent mt-2 focus:outline-none"
        />
      </div>

      {/* Estimator Inputs: Add-on Integrations */}
      <div className="space-y-2 bg-forge-surface/30 border border-forge-divider/50 rounded-xl p-4">
        <Label className="text-sm font-semibold text-foreground/90 block mb-1">
          Add-on Integrations
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: "db", label: "Database / CMS", desc: "Structured data" },
            { id: "auth", label: "User Accounts", desc: "Secure logins" },
            { id: "stripe", label: "Payments", desc: "Stripe checkout" },
            { id: "motion", label: "Animations", desc: "Micro-motion" },
            { id: "seo", label: "SEO & Audit", desc: "100/100 Speed" },
          ].map((feat) => {
            const selected = form.features.includes(feat.id);
            return (
              <button
                type="button"
                key={feat.id}
                onClick={() => {
                  setForm((prev) => {
                    const nextFeatures = prev.features.includes(feat.id)
                      ? prev.features.filter((id) => id !== feat.id)
                      : [...prev.features, feat.id];
                    const est = calculateEstimate(prev.serviceNeed, prev.pageCount, nextFeatures);
                    return {
                      ...prev,
                      features: nextFeatures,
                      budget: est.budgetOption,
                      timeline: est.timelineOption,
                    };
                  });
                }}
                className={cn(
                  "flex flex-col items-start text-left p-2.5 rounded-lg border text-xs transition-all duration-200 cursor-pointer w-full select-none",
                  selected
                    ? "bg-forge-accent/15 border-forge-accent text-forge-text shadow-[2px_2px_0px_0px_var(--forge-accent)]"
                    : "bg-background text-foreground/60 border-input hover:border-forge-accent/40"
                )}
              >
                <span className="font-bold text-[11px] block">{feat.label}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5 leading-none">{feat.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Textarea */}
      {renderField(FIELDS.find((f) => f.key === "details")!)}

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
            PDF, PNG, JPG, GIF up to 3MB each (max 3.5MB total)
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

      {/* Mobile price comparison hint */}
      <div className="block lg:hidden">
        <PriceComparisonCardCompact serviceNeed={form.serviceNeed} />
      </div>

      {/* Sync Outputs: Budget Range & Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-forge-surface/20 border border-forge-divider/50 rounded-xl p-4">
        <div className="relative">
          <span className="absolute -top-2.5 left-3 bg-card px-1.5 text-[9px] font-bold text-forge-accent uppercase font-mono border border-forge-divider rounded z-10">
            Auto-Selected Budget
          </span>
          {renderField(FIELDS.find((f) => f.key === "budget")!)}
        </div>
        <div className="relative">
          <span className="absolute -top-2.5 left-3 bg-card px-1.5 text-[9px] font-bold text-forge-accent uppercase font-mono border border-forge-divider rounded z-10">
            Auto-Selected Timeline
          </span>
          {renderField(FIELDS.find((f) => f.key === "timeline")!)}
        </div>
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
            className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-forge-border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* ── LEFT: Image Slider or Price Comparison Panel ── */}
            <div className="hidden lg:block min-h-[600px] lg:min-h-0 relative border-r border-forge-divider">
              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div
                    key="slider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <ImageSlider images={IMAGES} interval={4000} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="price-compare"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full bg-gradient-to-br from-forge-surface to-background p-8 flex flex-col justify-center"
                  >
                    <PriceComparisonCard serviceNeed={form.serviceNeed} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="w-full bg-card text-card-foreground flex flex-col items-center justify-start p-5 md:p-8 lg:p-10">
              <div className="w-full max-w-xl py-4 lg:py-2">
                {/* Heading — always visible */}
                <div className="mb-5">
                  <h2 className="text-fluid-h1 font-bold tracking-tight mb-1 font-playfair text-forge-text">
                    Start Your Project
                  </h2>
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
                ) : showOtpView ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 py-4"
                  >
                    {!otpSent ? (
                      /* If they entered a WhatsApp number, ask for email to send OTP */
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (otpEmail) sendOtp(otpEmail);
                        }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="otpEmailInput">
                            Verification Email
                            <span className="ml-1 text-red-400/60">*</span>
                          </Label>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                            Since you entered a phone number, please provide an email address where we can transmit your 4-digit verification code.
                          </p>
                          <div className="relative">
                            <Input
                              id="otpEmailInput"
                              type="email"
                              placeholder="you@example.com"
                              value={otpEmail}
                              onChange={(e) => setOtpEmail(e.target.value)}
                              className="ps-10 h-11"
                              required
                            />
                            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                              <AtSignIcon className="size-4" />
                            </div>
                          </div>
                        </div>

                        {otpError && (
                          <p className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="size-3.5" />
                            {otpError}
                          </p>
                        )}

                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowOtpView(false)}
                            className="h-11 px-5"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={otpLoading || !otpEmail}
                            className="flex-1 h-11 bg-forge-accent hover:bg-forge-accent/90 text-white font-semibold"
                          >
                            {otpLoading ? "Sending Code..." : "Send Verification Code"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      /* Enter 4-digit OTP Code view */
                      <form onSubmit={handleVerifyAndSubmit} className="space-y-5">
                        <div className="space-y-2 text-center sm:text-left">
                          <Label className="text-sm font-bold text-foreground">
                            Enter 4-Digit Verification Code
                          </Label>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            A verification code has been dispatched to <strong className="text-white">{otpEmail}</strong>. 
                            Prove you are a carbon-based lifeform and not a smart toaster.
                          </p>

                          <div className="flex justify-center sm:justify-start gap-3 mt-4">
                            <Input
                              type="text"
                              maxLength={4}
                              placeholder="0000"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              className="h-12 text-center text-xl font-bold tracking-[8px] max-w-[140px] focus-visible:ring-forge-accent"
                              autoFocus
                            />
                          </div>
                        </div>

                        {otpError && (
                          <p className="text-xs text-red-400 flex items-center gap-1.5 justify-center sm:justify-start">
                            <AlertCircle className="size-3.5" />
                            {otpError}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                          <span>Didn't receive it?</span>
                          <button
                            type="button"
                            onClick={() => sendOtp(otpEmail)}
                            disabled={otpLoading}
                            className="text-forge-accent hover:underline font-semibold cursor-pointer disabled:opacity-50"
                          >
                            {otpLoading ? "Sending..." : "Resend Code"}
                          </button>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const isOrigEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.contact.trim());
                              if (isOrigEmail) {
                                setShowOtpView(false);
                              } else {
                                setOtpSent(false);
                              }
                            }}
                            className="h-11 px-5"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting || otpCode.length !== 4}
                            className="flex-1 h-11 bg-forge-accent hover:bg-forge-accent/90 text-white font-semibold flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Check className="size-4" />
                                Verify & Submit
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                ) : (
                  <>
                    <form onSubmit={handleTriggerOtpVerify} noValidate>
                      {/* Honeypot field for spam protection */}
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="website"
                          value={form.website}
                          onChange={(e) => handleChange("website", e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
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

/* ── Success State with Particle Confetti ── */
function SuccessState() {
  const [particles] = React.useState<{ id: number; style: React.CSSProperties }[]>(() => {
    const colors = ["#FF6A00", "#FFB347", "#FF9F43", "#10B981", "#6366F1", "#8B5CF6"];
    return Array.from({ length: 60 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 120;
      const duration = 1 + Math.random() * 1.5;
      const size = 6 + Math.random() * 8;
      const delay = Math.random() * 0.2;
      
      const style: React.CSSProperties = {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: Math.random() > 0.5 ? "50%" : "3px",
        transform: "translate(-50%, -50%)",
        animation: `confetti-fall-${i % 4} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`,
        pointerEvents: "none",
        zIndex: 20,
      };

      return { id: i, style };
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="py-10 text-center relative overflow-hidden"
    >
      <style>{`
        @keyframes confetti-fall-0 {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% - 150px), calc(-50% + 200px)) rotate(360deg); opacity: 0; }
        }
        @keyframes confetti-fall-1 {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% + 150px), calc(-50% + 200px)) rotate(-360deg); opacity: 0; }
        }
        @keyframes confetti-fall-2 {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% - 80px), calc(-50% + 250px)) rotate(720deg); opacity: 0; }
        }
        @keyframes confetti-fall-3 {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% + 80px), calc(-50% + 250px)) rotate(-720deg); opacity: 0; }
        }
      `}</style>
      
      {particles.map((p) => (
        <div key={p.id} style={p.style} />
      ))}
      
      <div className="mb-6 flex justify-center relative">
        <div className="relative h-16 w-16 z-10">
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
      <h3 className="text-fluid-h2 font-bold font-playfair text-forge-text">
        You&apos;re all set!
      </h3>
      <p className="text-muted-foreground mx-auto mt-3 max-w-[300px] text-sm">
        We&apos;ve received your inquiry and will get back to you within 12 hours.
      </p>
    </motion.div>
  );
}

/* ── Others vs Our Price comparison data ── */
const PRICE_COMPARISON: Record<string, { others: string; ours: string; savings: string }> = {
  "New Website": { others: "₹25,000 – ₹80,000", ours: "₹2,500 – ₹15,000", savings: "Up to 85%" },
  "Website Redesign": { others: "₹20,000 – ₹60,000", ours: "₹2,000 – ₹12,000", savings: "Up to 80%" },
  "Landing Page": { others: "₹10,000 – ₹30,000", ours: "₹1,800 – ₹5,000", savings: "Up to 83%" },
  "UI/UX Design": { others: "₹15,000 – ₹50,000", ours: "₹1,500 – ₹10,000", savings: "Up to 80%" },
  "Full Stack App": { others: "₹1,00,000 – ₹5,00,000", ours: "₹8,000 – ₹50,000", savings: "Up to 90%" },
  "Not sure yet": { others: "₹20,000 – ₹80,000", ours: "₹2,500 – ₹15,000", savings: "Up to 85%" },
};

/* ── Price Comparison Card (Desktop Left Column) ── */
function PriceComparisonCard({ serviceNeed }: { serviceNeed: string }) {
  const comparison = PRICE_COMPARISON[serviceNeed] || PRICE_COMPARISON["Not sure yet"];
  const service = serviceNeed || "Web Development";

  return (
    <div className="flex flex-col h-full justify-center select-none text-left space-y-8">
      <div>
        <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-forge-accent uppercase block mb-1">
          Price Transparency
        </span>
        <h3 className="text-fluid-h2 font-bold font-playfair text-forge-text leading-tight">
          Why Pay More?
        </h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-[380px]">
          Most agencies charge premium rates for the same stack we use. Here's how <strong className="text-forge-accent">StackForge</strong> compares.
        </p>
      </div>

      {/* Comparison Card */}
      <div className="space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
          For: {service}
        </span>

        {/* Others */}
        <div className="relative border border-red-500/20 bg-red-500/[0.03] rounded-xl p-4 space-y-1">
          <div className="absolute -top-2.5 left-3 bg-card px-2 text-[9px] font-bold text-red-400 uppercase font-mono border border-red-500/20 rounded">
            Other Agencies
          </div>
          <motion.p
            key={`others-${serviceNeed}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-black text-red-400 font-mono line-through decoration-red-400/40"
          >
            {comparison.others}
          </motion.p>
          <p className="text-[10px] text-muted-foreground/60">Average Indian agency pricing for {service.toLowerCase()}</p>
        </div>

        {/* Ours */}
        <div className="relative border border-green-500/30 bg-green-500/[0.04] rounded-xl p-4 space-y-1 shadow-sm shadow-green-500/5">
          <div className="absolute -top-2.5 left-3 bg-card px-2 text-[9px] font-bold text-green-500 uppercase font-mono border border-green-500/25 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            StackForge
          </div>
          <motion.p
            key={`ours-${serviceNeed}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-black text-green-500 font-mono"
          >
            {comparison.ours}
          </motion.p>
          <p className="text-[10px] text-muted-foreground/60">Same quality. Startup-friendly pricing.</p>
        </div>
      </div>

      {/* Savings Badge */}
      <div className="flex items-center gap-3 pt-2">
        <motion.div
          key={`savings-${serviceNeed}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forge-accent/10 border border-forge-accent/25 rounded-full"
        >
          <span className="text-xs font-black text-forge-accent font-mono uppercase">{comparison.savings} Savings</span>
        </motion.div>
        <span className="text-[10px] text-muted-foreground">
          Same stack · Same quality
        </span>
      </div>
    </div>
  );
}

/* ── Price Comparison Card Compact (Mobile) ── */
function PriceComparisonCardCompact({ serviceNeed }: { serviceNeed: string }) {
  const comparison = PRICE_COMPARISON[serviceNeed] || PRICE_COMPARISON["Not sure yet"];

  return (
    <div className="border border-forge-divider bg-forge-surface/30 rounded-xl p-4 space-y-3 shadow-sm select-none text-left">
      <div className="flex items-center justify-between border-b border-forge-divider/40 pb-2">
        <span className="text-xs font-bold text-forge-text font-syne">Others vs Our Price</span>
        <motion.span
          key={`savings-compact-${serviceNeed}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-green-500/15 text-green-500 rounded inline-block"
        >
          {comparison.savings} less
        </motion.span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground block">Others Charge</span>
          <motion.span
            key={`others-compact-${serviceNeed}`}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-red-400 font-mono inline-block line-through decoration-red-400/40"
          >
            {comparison.others}
          </motion.span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground block">We Charge</span>
          <motion.span
            key={`ours-compact-${serviceNeed}`}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-green-500 font-mono inline-block"
          >
            {comparison.ours}
          </motion.span>
        </div>
      </div>
    </div>
  );
}


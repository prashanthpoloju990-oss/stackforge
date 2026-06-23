"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientPortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login stages: "email" -> enter email, "otp" -> verify OTP code
  const [stage, setStage] = useState<"email" | "otp">("email");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      setStage("otp");
    } catch (err: any) {
      setError(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otpCode: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      router.push("/portal/dashboard");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030306] flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-forge-accent/[0.04] blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[140px] pointer-events-none" />

      {/* Grain overlay */}
      <div className="grain-overlay opacity-30" aria-hidden="true" />

      <motion.div 
        initial={{ opacity: 0, y: 35, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 xs:p-8 md:p-10 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] relative z-10"
      >
        {/* Glow light line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-forge-accent/70 to-transparent" />

        <div className="text-center mb-8 select-none">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forge-accent/15 to-transparent border border-forge-accent/30 flex items-center justify-center shadow-lg shadow-forge-accent/10 backdrop-blur-xl">
              <Sparkles className="size-5 text-forge-accent" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest font-syne uppercase">
            StackForge
          </h1>
          <p className="text-[9px] text-forge-accent mt-1.5 font-mono tracking-widest uppercase">
            Client Project Portal
          </p>
        </div>

        <AnimatePresence mode="wait">
          {stage === "email" ? (
            <motion.form 
              key="email-stage"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleRequestOtp} 
              className="space-y-6"
            >
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#a1a1aa] block font-bold mb-2.5 font-mono">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="size-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-[#3e3f4a] outline-none focus:border-forge-accent/50 focus:ring-1 focus:ring-forge-accent/20 transition-all backdrop-blur-sm touch-manipulation"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-mono leading-relaxed">
                  Enter the email address you used when submitting your project inquiry.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-mono">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className={cn(
                  "w-full h-12 rounded-full text-xs font-bold font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation",
                  loading || !email
                    ? "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                    : "bg-forge-accent text-white hover:shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:scale-[1.02] active:scale-100"
                )}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Request Verification Key</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="otp-stage"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-6"
            >
              <div>
                <div className="flex justify-between items-baseline mb-2.5">
                  <label className="text-[10px] uppercase tracking-widest text-forge-accent block font-bold font-mono">
                    6-Digit Verification Key
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStage("email");
                      setOtpCode("");
                      setError(null);
                    }}
                    className="text-[9px] font-mono text-slate-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="size-3" /> Change Email
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="size-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    disabled={loading}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-[#3e3f4a] tracking-[0.2em] font-mono outline-none focus:border-forge-accent/50 focus:ring-1 focus:ring-forge-accent/20 transition-all backdrop-blur-sm touch-manipulation"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-mono leading-relaxed">
                  We sent a 6-digit access key to <strong className="text-slate-300">{email}</strong>.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-mono">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className={cn(
                  "w-full h-12 rounded-full text-xs font-bold font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation",
                  loading || otpCode.length !== 6
                    ? "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                    : "bg-forge-accent text-white hover:shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:scale-[1.02] active:scale-100"
                )}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Enter Portal</span>
                    <CheckCircle2 className="size-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-center gap-2 text-slate-500 select-none">
          <ShieldCheck className="size-4 text-forge-accent/50" />
          <span className="text-[10px] font-mono tracking-wider uppercase">Secure Session Guard</span>
        </div>
      </motion.div>
    </main>
  );
}

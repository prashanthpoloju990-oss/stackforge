"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  Users, 
  FolderGit2, 
  DollarSign, 
  Search, 
  FileDown, 
  Trash2, 
  LogOut, 
  Eye, 
  Mail, 
  Clock, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ClipboardCheck,
  Copy,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Filter,
  Check,
  Flame,
  LineChart,
  Plus,
  Minus,
  Activity,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  MessageSquarePlus
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ContactSubmission {
  id: string;
  name: string;
  contact: string;
  businessType: string | null;
  serviceNeed: string | null;
  budget: string | null;
  timeline: string | null;
  details: string | null;
  attachments: string | null;
  pageCount: number | null;
  features: string | null;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

// ── Relative time formatter ──
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 2) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ── Glass Card component ──
function GlassCard({ 
  children, 
  className = "", 
  hover = true 
}: { 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, scale: 1.005 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-b from-white/[0.06] to-white/[0.02]",
        "backdrop-blur-xl",
        "border border-white/[0.08]",
        "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
        className
      )}
    >
      {/* Glass shimmer highlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      {children}
    </motion.div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true);

  // MFA Login states
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaEmail, setMfaEmail] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  // Data state
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeTab, setActiveTab] = useState<"inquiries" | "subscribers">("inquiries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactSubmission | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Check cookie-based session by trying to fetch on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
        setSubscribers(data.subscribers || []);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setInitialChecking(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mfaRequired) {
      if (!password.trim()) return;
      setLoading(true);
      try {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password.trim() }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Invalid password");
        }

        const data = await res.json();
        if (data.mfaRequired) {
          setMfaRequired(true);
          setMfaEmail(data.email || "");
        } else {
          await fetchDashboardData();
        }
      } catch (err: any) {
        setError(err.message || "Failed to authenticate");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    } else {
      if (!mfaCode.trim()) return;
      setLoading(true);
      try {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: mfaEmail, mfaCode: mfaCode.trim() }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Invalid verification code");
        }

        await fetchDashboardData();
      } catch (err: any) {
        setError(err.message || "MFA validation failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin?action=logout", { method: "POST" });
      setIsAuthenticated(false);
      setInquiries([]);
      setSubscribers([]);
      setPassword("");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: "inquiry" | "subscriber", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type === "inquiry" ? "inquiry" : "subscriber"}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin?type=${type}&id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      if (type === "inquiry") {
        setInquiries(prev => prev.filter(i => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } else {
        setSubscribers(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      alert("Error deleting record: " + err);
    }
  };

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(i => {
      const query = searchQuery.toLowerCase();
      return (
        i.name.toLowerCase().includes(query) ||
        i.contact.toLowerCase().includes(query) ||
        (i.businessType && i.businessType.toLowerCase().includes(query)) ||
        (i.serviceNeed && i.serviceNeed.toLowerCase().includes(query)) ||
        (i.details && i.details.toLowerCase().includes(query)) ||
        (i.features && i.features.toLowerCase().includes(query))
      );
    });
  }, [inquiries, searchQuery]);

  // Filtered Subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s => {
      return s.email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [subscribers, searchQuery]);

  // Analytics/Charts Data (budgets & service demand)
  const analytics = useMemo(() => {
    const servicesMap: Record<string, number> = {};
    const budgetsMap: Record<string, number> = {};

    inquiries.forEach(i => {
      const s = i.serviceNeed || "Other";
      servicesMap[s] = (servicesMap[s] || 0) + 1;

      const b = i.budget || "Other";
      budgetsMap[b] = (budgetsMap[b] || 0) + 1;
    });

    return {
      services: Object.entries(servicesMap).sort((a, b) => b[1] - a[1]),
      budgets: Object.entries(budgetsMap).sort((a, b) => b[1] - a[1]),
    };
  }, [inquiries]);

  // Compute Pipeline stats
  const stats = useMemo(() => {
    let totalInquiriesCount = inquiries.length;
    let totalSubscribersCount = subscribers.length;
    
    let pipelineVal = 0;
    inquiries.forEach(i => {
      const budgetStr = i.budget || "";
      if (budgetStr.includes("50,000+")) {
        pipelineVal += 50000;
      } else if (budgetStr.includes("15,000")) {
        pipelineVal += 15000;
      } else if (budgetStr.includes("5,000")) {
        pipelineVal += 5000;
      } else if (budgetStr.includes("2,500")) {
        pipelineVal += 2500;
      }
    });

    return {
      inquiriesCount: totalInquiriesCount,
      subscribersCount: totalSubscribersCount,
      pipelineValRaw: pipelineVal,
      pipelineBudget: pipelineVal.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }),
      averageDeal: totalInquiriesCount > 0 
        ? Math.round(pipelineVal / totalInquiriesCount).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
          })
        : "₹0",
    };
  }, [inquiries, subscribers]);

  // ── Activity Feed: +1 / -1 changelog ──
  const activityFeed = useMemo(() => {
    type FeedItem = {
      id: string;
      type: "inquiry" | "subscriber";
      action: "+1" | "-1";
      label: string;
      sublabel: string;
      time: string;
      rawDate: Date;
    };

    const items: FeedItem[] = [];

    // All inquiries are "+1" events
    inquiries.forEach(i => {
      items.push({
        id: `inq-${i.id}`,
        type: "inquiry",
        action: "+1",
        label: i.name,
        sublabel: i.serviceNeed || "General Inquiry",
        time: timeAgo(i.createdAt),
        rawDate: new Date(i.createdAt),
      });
    });

    // All subscribers are "+1" events
    subscribers.forEach(s => {
      items.push({
        id: `sub-${s.id}`,
        type: "subscriber",
        action: "+1",
        label: s.email,
        sublabel: "Newsletter Subscriber",
        time: timeAgo(s.createdAt),
        rawDate: new Date(s.createdAt),
      });
    });

    // Sort by most recent first, take top 8
    items.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    return items.slice(0, 8);
  }, [inquiries, subscribers]);

  // Count items from last 24h
  const recentCount = useMemo(() => {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    let count = 0;
    inquiries.forEach(i => { if (new Date(i.createdAt) > dayAgo) count++; });
    subscribers.forEach(s => { if (new Date(s.createdAt) > dayAgo) count++; });
    return count;
  }, [inquiries, subscribers]);

  // Copy Subscribers email list
  const copyEmailsList = () => {
    const list = subscribers.map(s => s.email).join(", ");
    navigator.clipboard.writeText(list);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const parseFeatures = (featuresStr: string | null) => {
    if (!featuresStr) return [];
    return featuresStr.split(",").map(f => f.trim()).filter(Boolean);
  };

  const parseAttachments = (attachmentsStr: string | null) => {
    if (!attachmentsStr) return [];
    try {
      return JSON.parse(attachmentsStr) as Array<{ name: string; url: string }>;
    } catch {
      return [];
    }
  };

  if (initialChecking) {
    return (
      <div className="min-h-screen bg-[#030306] flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-forge-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-[#a1a1aa] uppercase animate-pulse">
            Connecting Console...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#030306] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Dynamic decorative backdrop blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-forge-accent/[0.04] blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[140px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] relative z-10"
        >
          {/* Subtle top card accent light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-forge-accent/60 to-transparent" />

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forge-accent/15 to-transparent border border-forge-accent/30 flex items-center justify-center shadow-lg shadow-forge-accent/10 backdrop-blur-xl">
                <Lock className="size-5 text-forge-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest font-syne uppercase">
              StackForge
            </h1>
            <p className="text-[10px] text-forge-accent mt-1.5 font-mono tracking-widest uppercase">
              CLIENT DATABASE & CONSOLE
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <AnimatePresence mode="wait">
              {!mfaRequired ? (
                <motion.div
                  key="password-field"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="text-[10px] uppercase tracking-widest text-[#a1a1aa] block font-bold mb-2 font-mono">
                    System Security Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3e3f4a] outline-none focus:border-forge-accent/50 focus:ring-1 focus:ring-forge-accent/20 transition-all font-mono backdrop-blur-sm"
                      autoFocus
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="mfa-field"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-[10px] uppercase tracking-widest text-forge-accent block font-bold font-mono">
                      MFA Validation Key
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMfaRequired(false);
                        setMfaCode("");
                        setPassword("");
                        setError(null);
                      }}
                      className="text-[9px] text-[#a1a1aa] hover:text-white uppercase font-mono tracking-widest transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="000000"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      disabled={loading}
                      maxLength={6}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3e3f4a] outline-none focus:border-forge-accent/50 focus:ring-1 focus:ring-forge-accent/20 transition-all font-mono tracking-widest text-center text-lg font-bold backdrop-blur-sm"
                      autoFocus
                    />
                  </div>
                  <p className="text-[9px] text-[#a1a1aa]/60 mt-2 font-mono text-center leading-relaxed">
                    Code sent to {mfaEmail.replace(/^(.)(.*)(@.*)$/, (_, f, m, l) => f + "*".repeat(m.length) + l)}.<br />
                    Expires in 10 minutes.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-red-400 font-mono text-center bg-red-950/15 border border-red-900/30 py-2.5 rounded-lg flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="size-3.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-forge-accent hover:bg-forge-accent/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-forge-accent/20 border border-forge-accent/30 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{!mfaRequired ? "Decrypt System" : "Verify Credentials"}</span>
                  <ChevronRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#040407] text-white flex flex-col font-sans relative pb-16">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-forge-accent/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.02] blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-500/[0.01] blur-[200px] pointer-events-none" />

      {/* ── Top Header ── */}
      <header className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl sticky top-0 z-30 px-6 md:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-forge-accent to-orange-500 flex items-center justify-center shadow-lg shadow-forge-accent/20 backdrop-blur-xl">
            <Flame className="size-4.5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase font-syne flex items-center gap-2">
              <span>StackForge Console</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            </h1>
            <p className="text-[9px] text-emerald-400 font-mono leading-none tracking-wider uppercase">
              Connected · Supabase Cloud
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Recent activity badge */}
          {recentCount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-8 px-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 backdrop-blur-xl flex items-center gap-1.5"
            >
              <Bell className="size-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider">
                +{recentCount} <span className="hidden sm:inline">last 24h</span>
              </span>
            </motion.div>
          )}

          <button
            onClick={handleLogout}
            className="h-8 px-3.5 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl text-[11px] font-bold uppercase tracking-wider hover:border-red-500/40 hover:bg-red-950/15 hover:text-red-400 transition-all flex items-center gap-1.5 cursor-pointer font-mono shadow-sm text-[#a1a1aa]"
          >
            <LogOut className="size-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </header>

      {/* ── Main Container ── */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 mt-8 flex-1 flex flex-col gap-8">
        
        {/* ── Statistics Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Card 1: Pipeline Value */}
          <GlassCard className="p-6 flex items-center justify-between group">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                Est. Pipeline Value
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white mt-2 font-mono">
                {stats.pipelineBudget}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/15 flex items-center justify-center shadow-lg shadow-emerald-500/5 backdrop-blur-sm group-hover:shadow-emerald-500/15 transition-shadow duration-300">
              <DollarSign className="size-5 text-emerald-400" />
            </div>
          </GlassCard>

          {/* Card 2: Average Deal Size */}
          <GlassCard className="p-6 flex items-center justify-between group">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                Avg. Deal Value
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white mt-2 font-mono">
                {stats.averageDeal}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-500/[0.08] border border-orange-500/15 flex items-center justify-center shadow-lg shadow-orange-500/5 backdrop-blur-sm group-hover:shadow-orange-500/15 transition-shadow duration-300">
              <LineChart className="size-5 text-orange-400" />
            </div>
          </GlassCard>

          {/* Card 3: Total Inquiries */}
          <GlassCard className="p-6 flex items-center justify-between group">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                Total Inquiries
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white mt-2 font-mono">
                {stats.inquiriesCount}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-forge-accent/[0.08] border border-forge-accent/15 flex items-center justify-center shadow-lg shadow-forge-accent/5 backdrop-blur-sm group-hover:shadow-forge-accent/15 transition-shadow duration-300">
              <FolderGit2 className="size-5 text-forge-accent" />
            </div>
          </GlassCard>

          {/* Card 4: Newsletter Subscribers */}
          <GlassCard className="p-6 flex items-center justify-between group">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                Audience Subscribers
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white mt-2 font-mono">
                {stats.subscribersCount}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/15 flex items-center justify-center shadow-lg shadow-indigo-500/5 backdrop-blur-sm group-hover:shadow-indigo-500/15 transition-shadow duration-300">
              <Users className="size-5 text-indigo-400" />
            </div>
          </GlassCard>
        </div>

        {/* ── Activity Feed + Analytics Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Activity Feed — +1 / -1 System */}
          <GlassCard className="p-6 lg:col-span-1" hover={false}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs uppercase font-mono tracking-widest text-[#a1a1aa] font-bold flex items-center gap-2">
                <Activity className="size-3.5 text-forge-accent" />
                Live Activity Feed
              </h3>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/15 px-2 py-0.5 rounded-full backdrop-blur-sm">
                LIVE
              </span>
            </div>
            
            {activityFeed.length === 0 ? (
              <div className="text-center py-8 text-[#5e5f6a]">
                <Activity className="size-6 mx-auto mb-2 opacity-30" />
                <p className="text-[10px] font-mono uppercase tracking-wider">No activity yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {activityFeed.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.25 }}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group/feed"
                  >
                    {/* +1 / -1 Badge */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-[11px] font-black border backdrop-blur-sm",
                      item.action === "+1"
                        ? "bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/[0.08] border-red-500/20 text-red-400"
                    )}>
                      {item.action}
                    </div>

                    {/* Icon */}
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border backdrop-blur-sm",
                      item.type === "inquiry"
                        ? "bg-forge-accent/[0.06] border-forge-accent/15"
                        : "bg-indigo-500/[0.06] border-indigo-500/15"
                    )}>
                      {item.type === "inquiry" 
                        ? <MessageSquarePlus className="size-3.5 text-forge-accent" />
                        : <UserPlus className="size-3.5 text-indigo-400" />
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white truncate font-syne leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[9px] text-[#a1a1aa] font-mono truncate mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>

                    {/* Time */}
                    <span className="text-[9px] text-[#5e5f6a] font-mono shrink-0 group-hover/feed:text-[#a1a1aa] transition-colors">
                      {item.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Analytics Charts */}
          {inquiries.length > 0 && (
            <>
              {/* Service demand */}
              <GlassCard className="p-6" hover={false}>
                <h3 className="text-xs uppercase font-mono tracking-widest text-[#a1a1aa] font-bold mb-5 flex items-center gap-2">
                  <Briefcase className="size-3.5 text-forge-accent" />
                  Service Distribution
                </h3>
                <div className="space-y-4">
                  {analytics.services.map(([service, count]) => {
                    const percent = Math.round((count / inquiries.length) * 100);
                    return (
                      <div key={service} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono text-white/90">
                          <span className="text-[11px]">{service}</span>
                          <span className="text-[10px] text-[#a1a1aa]">{count} ({percent}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-forge-accent to-amber-500 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Budget Splits */}
              <GlassCard className="p-6" hover={false}>
                <h3 className="text-xs uppercase font-mono tracking-widest text-[#a1a1aa] font-bold mb-5 flex items-center gap-2">
                  <DollarSign className="size-3.5 text-emerald-400" />
                  Budget Demographics
                </h3>
                <div className="space-y-4">
                  {analytics.budgets.map(([budget, count]) => {
                    const percent = Math.round((count / inquiries.length) * 100);
                    return (
                      <div key={budget} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono text-white/90">
                          <span className="text-[11px]">{budget}</span>
                          <span className="text-[10px] text-[#a1a1aa]">{count} ({percent}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </>
          )}

          {/* If no inquiries, fill 2 columns with empty analytics placeholder */}
          {inquiries.length === 0 && (
            <GlassCard className="p-6 lg:col-span-2 flex flex-col items-center justify-center min-h-[200px]" hover={false}>
              <Briefcase className="size-8 mx-auto mb-3 text-[#5e5f6a] opacity-30" />
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#5e5f6a]">
                Analytics will appear with first inquiries
              </p>
            </GlassCard>
          )}
        </div>

        {/* ── Tab Controls & Filters Row ── */}
        <div className="border-b border-white/[0.06] pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex bg-white/[0.03] backdrop-blur-xl p-1.5 border border-white/[0.06] rounded-2xl gap-1.5">
            <button
              onClick={() => {
                setActiveTab("inquiries");
                setSearchQuery("");
              }}
              className={cn(
                "h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                activeTab === "inquiries"
                  ? "bg-forge-accent text-white shadow-md shadow-forge-accent/20"
                  : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Inquiries ({filteredInquiries.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("subscribers");
                setSearchQuery("");
              }}
              className={cn(
                "h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                activeTab === "subscribers"
                  ? "bg-forge-accent text-white shadow-md shadow-forge-accent/20"
                  : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Subscribers ({filteredSubscribers.length})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === "subscribers" && subscribers.length > 0 && (
              <button
                onClick={copyEmailsList}
                className="h-9 px-3.5 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:border-forge-accent/30 text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-mono shrink-0 shadow-sm"
              >
                {copiedAll ? <ClipboardCheck className="size-3.5 text-green-400 animate-bounce" /> : <Copy className="size-3.5" />}
                <span>{copiedAll ? "Copied List!" : "Copy Email List"}</span>
              </button>
            )}

            <div className="relative w-full sm:w-[260px]">
              <Search className="size-3.5 text-[#5e5f6a] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={activeTab === "inquiries" ? "Search submissions..." : "Search subscriber emails..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl pl-9 pr-4 text-xs text-white placeholder-[#5e5f6a] outline-none focus:border-forge-accent/30 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* ── Tab Contents ── */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "inquiries" ? (
              /* Inquiries Grid */
              filteredInquiries.length === 0 ? (
                <motion.div 
                  key="inquiries-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard className="p-12 text-center border-dashed border-white/[0.06]" hover={false}>
                    <FolderGit2 className="size-8 mx-auto mb-3 opacity-30 text-[#5e5f6a]" />
                    <p className="text-xs font-mono uppercase tracking-wider text-[#5e5f6a]">No client inquiries found.</p>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div 
                  key="inquiries-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredInquiries.map((inquiry, idx) => (
                    <GlassCard
                      key={inquiry.id}
                      className="p-5 flex flex-col justify-between hover:border-forge-accent/20"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-3.5">
                          <div className="max-w-[70%]">
                            <h3 className="font-extrabold text-white font-syne text-[14px] truncate">
                              {inquiry.name}
                            </h3>
                            <span className="text-[10px] text-[#a1a1aa] font-mono block mt-0.5 truncate">
                              {inquiry.contact}
                            </span>
                          </div>
                          <span className="text-[9px] text-[#5e5f6a] font-mono border border-white/[0.06] px-2 py-0.5 rounded-lg bg-white/[0.03] backdrop-blur-sm shrink-0">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Meta Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {inquiry.serviceNeed && (
                            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-lg bg-forge-accent/[0.08] border border-forge-accent/15 text-forge-accent uppercase font-mono tracking-wider backdrop-blur-sm">
                              {inquiry.serviceNeed}
                            </span>
                          )}
                          {inquiry.budget && (
                            <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/15 text-emerald-400 font-mono backdrop-blur-sm">
                              {inquiry.budget}
                            </span>
                          )}
                        </div>

                        {/* Description snippet */}
                        <p className="text-[12px] text-[#a1a1aa]/80 line-clamp-3 leading-relaxed mb-4 min-h-[54px]">
                          {inquiry.details || "No project specification details provided."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between mt-auto">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="h-8 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-forge-accent/30 text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-mono backdrop-blur-sm"
                        >
                          <Eye className="size-3.5" />
                          <span>View Console</span>
                        </button>

                        <button
                          onClick={() => handleDelete("inquiry", inquiry.id)}
                          className="w-8 h-8 rounded-xl bg-red-950/[0.08] border border-red-900/15 hover:border-red-500/40 flex items-center justify-center text-red-400/80 hover:text-red-400 transition-all cursor-pointer shadow-sm backdrop-blur-sm"
                          title="Delete Record"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </motion.div>
              )
            ) : (
              /* Subscribers list */
              filteredSubscribers.length === 0 ? (
                <motion.div 
                  key="subscribers-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard className="p-12 text-center border-dashed border-white/[0.06]" hover={false}>
                    <Users className="size-8 mx-auto mb-3 opacity-30 text-[#5e5f6a]" />
                    <p className="text-xs font-mono uppercase tracking-wider text-[#5e5f6a]">No subscribers found.</p>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div 
                  key="subscribers-table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <GlassCard className="overflow-hidden" hover={false}>
                    <table className="w-full border-collapse text-left text-xs text-[#a1a1aa]">
                      <thead className="bg-white/[0.03] border-b border-white/[0.06] font-mono text-[9px] text-[#a1a1aa] uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4 font-black">Subscriber Email Address</th>
                          <th className="px-6 py-4 font-black">Authentication / Subscribed At</th>
                          <th className="px-6 py-4 font-black text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] font-mono">
                        {filteredSubscribers.map((subscriber, idx) => (
                          <tr key={subscriber.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-3.5 text-white text-sm font-semibold">
                              {subscriber.email}
                            </td>
                            <td className="px-6 py-3.5">
                              {new Date(subscriber.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-3.5 text-right flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(subscriber.email);
                                  setCopiedIndex(idx);
                                  setTimeout(() => setCopiedIndex(null), 2000);
                                }}
                                className="h-7 px-2.5 bg-white/[0.03] border border-white/[0.06] hover:border-forge-accent/30 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1 cursor-pointer shadow-sm backdrop-blur-sm"
                              >
                                {copiedIndex === idx ? <ClipboardCheck className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                                <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                              </button>
                              <button
                                onClick={() => handleDelete("subscriber", subscriber.id)}
                                className="w-7 h-7 bg-red-950/[0.08] border border-red-900/15 hover:border-red-500/40 rounded-lg flex items-center justify-center text-red-400/80 hover:text-red-400 transition-all cursor-pointer shadow-sm backdrop-blur-sm"
                                title="Delete Subscriber"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </GlassCard>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Inquiry Detail Drawer ── */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-end p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setSelectedInquiry(null)}
            />
            
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="w-full sm:max-w-[620px] h-full sm:h-[calc(100vh-2rem)] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border-l sm:border border-white/[0.08] sm:rounded-2xl shadow-[0_8px_60px_-12px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden z-10"
            >
              {/* Drawer Accent Line */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-forge-accent via-orange-500 to-indigo-500" />

              {/* Header */}
              <div className="px-6 py-5 border-b border-white/[0.06] bg-white/[0.03] backdrop-blur-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-forge-accent font-bold">
                    Console / Submission Details
                  </span>
                  <h2 className="text-lg font-black text-white font-syne leading-tight mt-0.5">
                    {selectedInquiry.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="h-8 w-8 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:border-forge-accent/30 text-xs font-semibold text-[#a1a1aa] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm backdrop-blur-sm"
                >
                  ✕
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Meta details grid */}
                <div className="grid grid-cols-2 gap-4 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 rounded-2xl">
                  <div>
                    <span className="text-[9px] text-[#a1a1aa] font-mono block uppercase font-bold">Client Email/WhatsApp</span>
                    <a
                      href={selectedInquiry.contact.includes("@") ? `mailto:${selectedInquiry.contact}` : `https://wa.me/${selectedInquiry.contact.replace(/[^\d+]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white hover:text-forge-accent font-mono inline-flex items-center gap-1 mt-1 break-all transition-colors font-bold"
                    >
                      <span>{selectedInquiry.contact}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#a1a1aa] font-mono block uppercase font-bold">Date Submitted</span>
                    <span className="text-xs text-white font-mono mt-1 block">
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#a1a1aa] font-mono block uppercase font-bold">Business Segment</span>
                    <span className="text-xs text-white font-semibold mt-1 block font-syne">
                      {selectedInquiry.businessType || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#a1a1aa] font-mono block uppercase font-bold">Primary Target</span>
                    <span className="text-xs text-forge-accent font-extrabold mt-1 block uppercase font-mono tracking-wide">
                      {selectedInquiry.serviceNeed || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#a1a1aa] font-mono block uppercase font-bold">Approved Budget</span>
                    <span className="text-xs text-emerald-400 font-extrabold mt-1 block font-mono">
                      {selectedInquiry.budget || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#a1a1aa] font-mono block uppercase font-bold">Timeline</span>
                    <span className="text-xs text-white font-semibold mt-1 block">
                      {selectedInquiry.timeline || "Not specified"}
                    </span>
                  </div>
                  {selectedInquiry.pageCount && (
                    <div>
                      <span className="text-[9px] text-[#a1a1aa] font-mono block uppercase font-bold">Total Pages</span>
                      <span className="text-xs text-white font-bold mt-1 block font-mono">
                        {selectedInquiry.pageCount} pages
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                {selectedInquiry.features && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] font-bold">
                      Requested Technical Integrations
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {parseFeatures(selectedInquiry.features).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-black px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/95 font-mono uppercase tracking-wider shadow-sm backdrop-blur-sm"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* File attachments */}
                {selectedInquiry.attachments && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] font-bold">
                      Asset Uploads
                    </h3>
                    <div className="space-y-1.5">
                      {parseAttachments(selectedInquiry.attachments).map((file, idx) => (
                        <a
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm px-4 py-2.5 rounded-xl text-xs hover:border-forge-accent/30 text-white/95 transition-all shadow-sm"
                        >
                          <span className="truncate pr-4 font-mono">{file.name}</span>
                          <div className="flex items-center gap-1.5 text-forge-accent font-extrabold text-[9px] uppercase font-mono tracking-wider shrink-0">
                            <span>Open Link</span>
                            <FileDown className="size-3.5" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project details */}
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] font-bold">
                    Project Specifications
                  </h3>
                  <div className="border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 text-xs text-white/80 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto font-mono">
                    {selectedInquiry.details || "No additional project details were provided by the client."}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.03] backdrop-blur-xl flex items-center justify-between">
                <a
                  href={selectedInquiry.contact.includes("@") ? `mailto:${selectedInquiry.contact}` : `https://wa.me/${selectedInquiry.contact.replace(/[^\d+]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 bg-forge-accent hover:bg-forge-accent/90 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-forge-accent/20 border border-forge-accent/30 hover:scale-[1.01]"
                >
                  <span>Reply to Inquiry</span>
                  <ExternalLink className="size-3.5" />
                </a>

                <button
                  onClick={() => handleDelete("inquiry", selectedInquiry.id)}
                  className="h-10 px-4 rounded-xl bg-red-950/[0.15] border border-red-900/20 hover:border-red-500/40 text-red-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer font-mono backdrop-blur-sm"
                >
                  <Trash2 className="size-3.5" />
                  <span>Purge</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

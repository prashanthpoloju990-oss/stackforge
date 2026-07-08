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
  MessageSquarePlus,
  History,
  X
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseClient } from "@/lib/supabase-client";

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
  status?: string;
  progress?: number;
  figmaLink?: string | null;
  stagingLink?: string | null;
  clientNotes?: string | null;
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

interface SparklinePoint {
  x: number;
  y: number;
  val: number;
  label: string;
}

function SparklineChart({ 
  data, 
  labels, 
  strokeColor = "#FF6A00", 
  fillColor = "url(#accentGrad)" 
}: { 
  data: number[]; 
  labels: string[]; 
  strokeColor?: string; 
  fillColor?: string; 
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const maxVal = Math.max(...data, 1);
  const width = 500;
  const height = 130;
  const paddingLeft = 30;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const points: SparklinePoint[] = data.map((val, idx) => {
    const x = paddingLeft + (idx * (width - paddingLeft - paddingRight)) / (data.length - 1);
    const y = height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / maxVal;
    return { x, y, val, label: labels[idx] };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : "";

  return (
    <div className="relative w-full">
      <svg className="w-full h-[130px]" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal gridlines */}
        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        
        {/* Y Axis helper labels */}
        <text x={paddingLeft - 8} y={paddingTop + 4} fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="end" className="font-mono">{maxVal}</text>
        <text x={paddingLeft - 8} y={height - paddingBottom + 3} fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="end" className="font-mono">0</text>

        {/* Path Fill */}
        {points.length > 0 && (
          <>
            <path d={areaPath} fill={fillColor} />
            <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {/* X Axis Labels */}
        {points.map((p, idx) => (
          <text 
            key={`lbl-${idx}`} 
            x={p.x} 
            y={height - 6} 
            fill="rgba(255,255,255,0.2)" 
            fontSize="8" 
            textAnchor="middle" 
            className="font-mono select-none"
          >
            {p.label}
          </text>
        ))}

        {/* Hover spots and tooltip circles */}
        {points.map((p, idx) => (
          <g key={idx}>
            {/* Interactive zone */}
            <circle
              cx={p.x}
              cy={p.y}
              r={16}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
            />
            {/* Display active point */}
            {hoverIdx === idx && (
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill="#ffffff"
                stroke={strokeColor}
                strokeWidth={2}
                pointerEvents="none"
              />
            )}
          </g>
        ))}
      </svg>
      {/* Tooltip Overlay */}
      {hoverIdx !== null && (
        <div 
          className="absolute bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-2.5 py-1.5 shadow-xl text-[10px] font-mono pointer-events-none transition-all flex flex-col items-center z-20"
          style={{
            left: `${(points[hoverIdx].x / width) * 100}%`,
            top: `${(points[hoverIdx].y / height) * 100 - 32}%`,
            transform: "translateX(-50%)"
          }}
        >
          <span className="text-[#a1a1aa] leading-none">{points[hoverIdx].label}</span>
          <span className="text-white font-bold mt-1 font-syne leading-none">{points[hoverIdx].val} Volume</span>
        </div>
      )}
    </div>
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
  const [timeLeft, setTimeLeft] = useState(600);

  // Data state
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeTab, setActiveTab] = useState<"inquiries" | "subscribers" | "newsletter">("inquiries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactSubmission | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Newsletter Broadcast states
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastPreview, setBroadcastPreview] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastStatus, setBroadcastStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");

  // Project Progress states for selectedInquiry
  const [projStatus, setProjStatus] = useState("pending");
  const [projProgress, setProjProgress] = useState(0);
  const [projFigma, setProjFigma] = useState("");
  const [projStaging, setProjStaging] = useState("");
  const [projNotes, setProjNotes] = useState("");
  const [projSaving, setProjSaving] = useState(false);

  // Audit Log History states
  const [auditLogModalOpen, setAuditLogModalOpen] = useState(false);
  const [auditLogTab, setAuditLogTab] = useState<"all" | "inquiry" | "subscriber">("all");
  const [auditLogSearch, setAuditLogSearch] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (selectedInquiry) {
      setProjStatus(selectedInquiry.status || "pending");
      setProjProgress(selectedInquiry.progress || 0);
      setProjFigma(selectedInquiry.figmaLink || "");
      setProjStaging(selectedInquiry.stagingLink || "");
      setProjNotes(selectedInquiry.clientNotes || "");
    }
  }, [selectedInquiry]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Forgot Password / Magic Login states
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Load draft from localStorage on mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedSubject = localStorage.getItem("sf_draft_subject");
    const savedPreview = localStorage.getItem("sf_draft_preview");
    const savedBody = localStorage.getItem("sf_draft_body");

    if (savedSubject) setBroadcastSubject(savedSubject);
    if (savedPreview) setBroadcastPreview(savedPreview);
    if (savedBody) setBroadcastBody(savedBody);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Save draft to localStorage as user types
  useEffect(() => {
    if (broadcastSubject) {
      localStorage.setItem("sf_draft_subject", broadcastSubject);
    } else {
      localStorage.removeItem("sf_draft_subject");
    }
  }, [broadcastSubject]);

  useEffect(() => {
    if (broadcastPreview) {
      localStorage.setItem("sf_draft_preview", broadcastPreview);
    } else {
      localStorage.removeItem("sf_draft_preview");
    }
  }, [broadcastPreview]);

  useEffect(() => {
    if (broadcastBody) {
      localStorage.setItem("sf_draft_body", broadcastBody);
    } else {
      localStorage.removeItem("sf_draft_body");
    }
  }, [broadcastBody]);

  // Check cookie-based session or query params (magic link) on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token && email) {
      handleMagicLogin(token, email);
    } else {
      fetchDashboardData();
    }
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabaseClient
      .channel("admin-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ContactSubmission" },
        (payload) => {
          console.log("[REALTIME-ADMIN] ContactSubmission event received:", payload);
          if (payload.eventType === "INSERT") {
            const newInquiry = payload.new as ContactSubmission;
            setInquiries((prev) => {
              if (prev.some((inq) => inq.id === newInquiry.id)) return prev;
              return [newInquiry, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedInquiry = payload.new as ContactSubmission;
            setInquiries((prev) =>
              prev.map((inq) => (inq.id === updatedInquiry.id ? { ...inq, ...updatedInquiry } : inq))
            );
            setSelectedInquiry((prev) => 
              prev && prev.id === updatedInquiry.id ? { ...prev, ...updatedInquiry } : prev
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as any).id;
            setInquiries((prev) => prev.filter((inq) => inq.id !== deletedId));
            setSelectedInquiry((prev) => (prev && prev.id === deletedId ? null : prev));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Newsletter" },
        (payload) => {
          console.log("[REALTIME-ADMIN] Newsletter event received:", payload);
          if (payload.eventType === "INSERT") {
            const newSub = payload.new as Subscriber;
            setSubscribers((prev) => {
              if (prev.some((sub) => sub.id === newSub.id)) return prev;
              return [newSub, ...prev];
            });
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as any).id;
            setSubscribers((prev) => prev.filter((sub) => sub.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [isAuthenticated]);

  async function handleMagicLogin(token: string, email: string) {
    setLoading(true);
    setInitialChecking(true);
    try {
      const res = await fetch("/api/admin?action=magic_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Magic link verification failed");
      }
      // Remove query parameters from URL without page reload
      window.history.replaceState({}, document.title, window.location.pathname);
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate via magic link");
      setIsAuthenticated(false);
      setInitialChecking(false);
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError(null);
    setResetMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin?action=forgot_password", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send magic link");
      }
      setResetMessage(data.message || "A secure magic login link has been sent to your admin email.");
    } catch (err: any) {
      setError(err.message || "Could not request magic login link");
    } finally {
      setLoading(false);
    }
  }

  // Count down timer for MFA expiration
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!mfaRequired) return;
    setTimeLeft(600);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mfaRequired]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleResendMfa() {
    setError(null);
    setResetMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin?action=resend_mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mfaEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend validation key");
      }
      setResetMessage(data.message || "A new code has been sent.");
      setTimeLeft(600); // Reset timer
    } catch (err: any) {
      setError(err.message || "Could not resend code");
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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

  const exportData = (type: "inquiries" | "subscribers", format: "csv" | "json") => {
    const dataToExport = type === "inquiries" ? inquiries : subscribers;
    
    if (format === "json") {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataToExport, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `stackforge_${type}_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      let csvContent = "";
      if (type === "inquiries") {
        const headers = ["ID", "Name", "Contact", "Business Type", "Service Need", "Budget", "Timeline", "Status", "Progress", "Date Submitted"];
        csvContent += headers.join(",") + "\n";
        inquiries.forEach(i => {
          const row = [
            i.id,
            `"${(i.name || "").replace(/"/g, '""')}"`,
            `"${(i.contact || "").replace(/"/g, '""')}"`,
            `"${(i.businessType || "").replace(/"/g, '""')}"`,
            `"${(i.serviceNeed || "").replace(/"/g, '""')}"`,
            `"${(i.budget || "").replace(/"/g, '""')}"`,
            `"${(i.timeline || "").replace(/"/g, '""')}"`,
            `"${(i.status || "pending").replace(/"/g, '""')}"`,
            i.progress || 0,
            new Date(i.createdAt).toLocaleString()
          ];
          csvContent += row.join(",") + "\n";
        });
      } else {
        const headers = ["ID", "Email", "Date Subscribed"];
        csvContent += headers.join(",") + "\n";
        subscribers.forEach(s => {
          const row = [
            s.id,
            `"${(s.email || "").replace(/"/g, '""')}"`,
            new Date(s.createdAt).toLocaleString()
          ];
          csvContent += row.join(",") + "\n";
        });
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", `stackforge_${type}_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastBody || broadcastStatus === "sending") return;

    if (!confirm(`Are you sure you want to send this broadcast to all ${subscribers.length} subscribers?`)) {
      return;
    }

    setBroadcastStatus("sending");
    setBroadcastMessage("");

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: broadcastSubject,
          previewText: broadcastPreview,
          body: broadcastBody,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to broadcast newsletter");
      }

      setBroadcastStatus("success");
      setBroadcastMessage(data.message || "Newsletter broadcast sent successfully!");
      setBroadcastSubject("");
      setBroadcastPreview("");
      setBroadcastBody("");
      localStorage.removeItem("sf_draft_subject");
      localStorage.removeItem("sf_draft_preview");
      localStorage.removeItem("sf_draft_body");
    } catch (err: any) {
      setBroadcastStatus("error");
      setBroadcastMessage(err.message || "Failed to broadcast newsletter");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || projSaving) return;

    setProjSaving(true);
    try {
      const res = await fetch("/api/admin/update-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          status: projStatus,
          progress: projProgress,
          figmaLink: projFigma,
          stagingLink: projStaging,
          clientNotes: projNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update project settings");
      }

      // Update in-memory inquiries state
      setInquiries(prev => prev.map(inq => {
        if (inq.id === selectedInquiry.id) {
          return {
            ...inq,
            status: projStatus,
            progress: projProgress,
            figmaLink: projFigma,
            stagingLink: projStaging,
            clientNotes: projNotes,
          };
        }
        return inq;
      }));

      // Update active selectedInquiry state
      setSelectedInquiry(prev => prev ? {
        ...prev,
        status: projStatus,
        progress: projProgress,
        figmaLink: projFigma,
        stagingLink: projStaging,
        clientNotes: projNotes,
      } : null);

      alert("Project tracking details saved successfully!");
    } catch (err: any) {
      alert("Error saving project: " + err.message);
    } finally {
      setProjSaving(false);
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

  // Weekly data velocity (last 7 days)
  const chartData = useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0]; // YYYY-MM-DD
    });

    const inquiryCounts = new Array(7).fill(0);
    const subscriberCounts = new Array(7).fill(0);

    inquiries.forEach(inq => {
      const dateStr = new Date(inq.createdAt).toISOString().split("T")[0];
      const idx = dates.indexOf(dateStr);
      if (idx !== -1) {
        inquiryCounts[idx]++;
      }
    });

    subscribers.forEach(sub => {
      const dateStr = new Date(sub.createdAt).toISOString().split("T")[0];
      const idx = dates.indexOf(dateStr);
      if (idx !== -1) {
        subscriberCounts[idx]++;
      }
    });

    return {
      labels: dates.map(d => {
        const [, m, day] = d.split("-");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[parseInt(m) - 1]} ${day}`;
      }),
      inquiries: inquiryCounts,
      subscribers: subscriberCounts,
    };
  }, [inquiries, subscribers]);

  // Compute Pipeline stats
  const stats = useMemo(() => {
    let totalInquiriesCount = inquiries.length;
    let totalSubscribersCount = subscribers.length;
    
    let pipelineVal = 0;
    inquiries.forEach(i => {
      const budgetStr = i.budget || "";
      if (budgetStr.includes("50,000+")) {
        pipelineVal += 60000;
      } else if (budgetStr.includes("15,000 – ₹50,000")) {
        pipelineVal += 32500;
      } else if (budgetStr.includes("5,000 – ₹15,000")) {
        pipelineVal += 10000;
      } else if (budgetStr.includes("3,000 – ₹5,000")) {
        pipelineVal += 4000;
      } else if (budgetStr.includes("Under ₹3,000")) {
        pipelineVal += 2000;
      } else if (budgetStr.includes("Flexible")) {
        pipelineVal += 15000;
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
  const activityFeedAll = useMemo(() => {
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

    // Sort by most recent first
    items.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    return items;
  }, [inquiries, subscribers]);

  const activityFeed = useMemo(() => activityFeedAll.slice(0, 8), [activityFeedAll]);

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
                  <div className="flex justify-between items-center mt-2">
                    <span />
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="text-[9px] text-[#a1a1aa]/80 hover:text-forge-accent uppercase font-mono tracking-widest transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none p-0"
                    >
                      Forgot Key? Request Magic Link ↗
                    </button>
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
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-forge-accent block font-bold font-mono">
                        MFA Validation Key
                      </label>
                      <span className={cn(
                        "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border select-none",
                        timeLeft <= 60 
                          ? "bg-red-500/10 text-red-400 animate-pulse border-red-500/20" 
                          : "bg-white/5 text-[#a1a1aa] border-white/10"
                      )}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
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
                      disabled={loading || timeLeft === 0}
                      maxLength={6}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3e3f4a] outline-none focus:border-forge-accent/50 focus:ring-1 focus:ring-forge-accent/20 transition-all font-mono tracking-widest text-center text-lg font-bold backdrop-blur-sm"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[9px] text-[#a1a1aa]/60 font-mono leading-tight">
                      Code sent to {mfaEmail.replace(/^(.)(.*)(@.*)$/, (_, f, m, l) => f + "*".repeat(m.length) + l)}.<br />
                      {timeLeft === 0 ? <span className="text-red-400 font-bold">Code expired. Please resend.</span> : "Expires in 10 minutes."}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendMfa}
                      disabled={loading || timeLeft > 570} // limit to once every 30s
                      className="text-[9px] text-[#a1a1aa] hover:text-forge-accent uppercase font-mono tracking-widest transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none p-0 shrink-0 ml-2"
                    >
                      {timeLeft > 570 ? `Resend in ${timeLeft - 570}s` : "Resend Key ↗"}
                    </button>
                  </div>
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

            {resetMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-emerald-400 font-mono text-center bg-emerald-950/15 border border-emerald-900/30 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="size-3.5 flex-shrink-0" />
                <span>{resetMessage}</span>
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

        {/* ── Interactive Charts Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-6 flex flex-col gap-4" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                  Inbound Inquiries Velocity (Last 7 Days)
                </span>
                <span className="text-[18px] font-black text-white mt-1 block font-mono">
                  {chartData.inquiries.reduce((a, b) => a + b, 0)} Total
                </span>
              </div>
              <div className="text-[9px] font-mono text-forge-accent bg-forge-accent/[0.08] border border-forge-accent/15 px-2.5 py-0.5 rounded-full select-none">
                TREND
              </div>
            </div>
            <SparklineChart data={chartData.inquiries} labels={chartData.labels} strokeColor="#FF6A00" fillColor="url(#accentGrad)" />
          </GlassCard>

          <GlassCard className="p-6 flex flex-col gap-4" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                  Newsletter Subscriptions Velocity (Last 7 Days)
                </span>
                <span className="text-[18px] font-black text-white mt-1 block font-mono">
                  {chartData.subscribers.reduce((a, b) => a + b, 0)} Total
                </span>
              </div>
              <div className="text-[9px] font-mono text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/15 px-2.5 py-0.5 rounded-full select-none">
                TREND
              </div>
            </div>
            <SparklineChart data={chartData.subscribers} labels={chartData.labels} strokeColor="#10B981" fillColor="url(#emeraldGrad)" />
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
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/15 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  LIVE
                </span>
                <button
                  onClick={() => setAuditLogModalOpen(true)}
                  className="text-[9px] font-mono text-[#a1a1aa] hover:text-white uppercase tracking-wider underline decoration-white/20 hover:decoration-white transition-colors cursor-pointer"
                >
                  View Full History
                </button>
              </div>
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
            <button
              onClick={() => {
                setActiveTab("newsletter");
                setSearchQuery("");
              }}
              className={cn(
                "h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                activeTab === "newsletter"
                  ? "bg-forge-accent text-white shadow-md shadow-forge-accent/20"
                  : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Newsletter Tab
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === "inquiries" && inquiries.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => exportData("inquiries", "csv")}
                  className="h-9 px-3 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-[10px] font-bold uppercase tracking-wider rounded-xl hover:border-forge-accent/30 text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1 cursor-pointer font-mono shrink-0 shadow-sm"
                  title="Export to CSV"
                >
                  <FileDown className="size-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportData("inquiries", "json")}
                  className="h-9 px-3 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-[10px] font-bold uppercase tracking-wider rounded-xl hover:border-forge-accent/30 text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1 cursor-pointer font-mono shrink-0 shadow-sm"
                  title="Export to JSON"
                >
                  <FileDown className="size-3.5" />
                  <span>JSON</span>
                </button>
              </>
            )}

            {activeTab === "subscribers" && subscribers.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={copyEmailsList}
                  className="h-9 px-3 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-[10px] font-bold uppercase tracking-wider rounded-xl hover:border-forge-accent/30 text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1 cursor-pointer font-mono shrink-0 shadow-sm"
                >
                  {copiedAll ? <ClipboardCheck className="size-3.5 text-green-400 animate-bounce" /> : <Copy className="size-3.5" />}
                  <span>{copiedAll ? "Copied!" : "Copy List"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportData("subscribers", "csv")}
                  className="h-9 px-3 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-[10px] font-bold uppercase tracking-wider rounded-xl hover:border-forge-accent/30 text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1 cursor-pointer font-mono shrink-0 shadow-sm"
                  title="Export to CSV"
                >
                  <FileDown className="size-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportData("subscribers", "json")}
                  className="h-9 px-3 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-[10px] font-bold uppercase tracking-wider rounded-xl hover:border-forge-accent/30 text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1 cursor-pointer font-mono shrink-0 shadow-sm"
                  title="Export to JSON"
                >
                  <FileDown className="size-3.5" />
                  <span>JSON</span>
                </button>
              </>
            )}

            {activeTab !== "newsletter" && (
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
            )}
          </div>
        </div>

        {/* ── Tab Contents ── */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "inquiries" && (
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
                          {inquiry.status && inquiry.status !== "pending" && (
                            <span className={cn(
                              "text-[9px] font-bold px-2.5 py-0.5 rounded-lg font-mono backdrop-blur-sm border",
                              inquiry.status === "completed" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                              inquiry.status === "development" ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                              inquiry.status === "design" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                              "bg-slate-500/10 border-slate-500/20 text-slate-400"
                            )}>
                              {inquiry.status}
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
            )}

            {activeTab === "subscribers" && (
              /* Subscribers List */
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

            {activeTab === "newsletter" && (
              /* Newsletter Broadcaster */
              <motion.div
                key="newsletter-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Form card */}
                <GlassCard className="p-6 space-y-6" hover={false}>
                  <div>
                    <h3 className="text-xs uppercase font-mono tracking-widest text-[#a1a1aa] font-bold">
                      Compose Broadcast
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Draft a newsletter email to send to all verified subscribers.
                    </p>
                  </div>

                  <form onSubmit={handleSendBroadcast} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. StackForge Studio Update: Shipping 3x Faster!"
                        value={broadcastSubject}
                        onChange={(e) => setBroadcastSubject(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#5e5f6a] outline-none focus:border-forge-accent/30 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                        Preview Text (Sub-header)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Important changes and new visual modules ready"
                        value={broadcastPreview}
                        onChange={(e) => setBroadcastPreview(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#5e5f6a] outline-none focus:border-forge-accent/30 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                        Email Body (HTML allowed)
                      </label>
                      <textarea
                        required
                        rows={10}
                        placeholder="<p>Hello there,</p><p>We have just shipped some major upgrades...</p>"
                        value={broadcastBody}
                        onChange={(e) => setBroadcastBody(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-xs text-white placeholder-[#5e5f6a] outline-none focus:border-forge-accent/30 transition-all font-mono min-h-[220px]"
                      />
                    </div>

                    {broadcastStatus !== "idle" && broadcastMessage && (
                      <div className={cn(
                        "p-3 rounded-xl text-xs font-mono border",
                        broadcastStatus === "success" 
                          ? "bg-emerald-950/15 border-emerald-900/30 text-emerald-400"
                          : broadcastStatus === "error"
                          ? "bg-red-950/15 border-red-900/30 text-red-400"
                          : "bg-white/5 border-white/10 text-[#a1a1aa]"
                      )}>
                        {broadcastMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={broadcastStatus === "sending" || !broadcastSubject || !broadcastBody}
                      className={cn(
                        "w-full h-10 rounded-xl text-xs font-bold font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2",
                        broadcastStatus === "sending" || !broadcastSubject || !broadcastBody
                          ? "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                          : "bg-forge-accent hover:bg-forge-accent/90 text-white shadow-lg shadow-forge-accent/20 border border-forge-accent/30"
                      )}
                    >
                      {broadcastStatus === "sending" ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Broadcast to {subscribers.length} Subscribers</span>
                          <ChevronRight className="size-4" />
                        </>
                      )}
                    </button>
                  </form>
                </GlassCard>

                {/* Preview column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs uppercase font-mono tracking-widest text-[#a1a1aa] font-bold">
                      Live HTML Email Mockup
                    </h3>
                    <div className="flex bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5 gap-1 font-mono text-[9px] font-bold">
                      <button
                        type="button"
                        onClick={() => setPreviewViewport("desktop")}
                        className={cn(
                          "px-2 py-0.5 rounded cursor-pointer transition-colors",
                          previewViewport === "desktop" ? "bg-forge-accent text-white" : "text-[#a1a1aa] hover:text-white"
                        )}
                      >
                        Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewViewport("mobile")}
                        className={cn(
                          "px-2 py-0.5 rounded cursor-pointer transition-colors",
                          previewViewport === "mobile" ? "bg-forge-accent text-white" : "text-[#a1a1aa] hover:text-white"
                        )}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>
                  <div className="border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl bg-[#0a0a0f] text-slate-300 font-sans text-xs flex flex-col items-center">
                    {/* Simulated email header bar */}
                    <div className="w-full bg-[#09090b] px-4 py-2 border-b border-white/[0.05] text-[10px] text-slate-500 font-mono flex items-center justify-between select-none">
                      <span>Sender: no-reply@stackforge.dev</span>
                      <span>Recipient: subscriber@client.com</span>
                    </div>

                    <div className="w-full p-6 bg-[#040407] min-h-[400px] flex items-center justify-center overflow-y-auto">
                      <div 
                        className={cn(
                          "bg-[#0a0a0f] border border-white/[0.08] rounded-xl overflow-hidden transition-all duration-300",
                          previewViewport === "mobile" ? "w-[320px]" : "w-full max-w-[420px]"
                        )}
                      >
                        <div className="bg-[#09090b] p-5 text-center border-b-4 border-forge-accent">
                          <h1 className="text-white text-lg font-black tracking-wider m-0 font-playfair">STACKFORGE</h1>
                          <p className="text-forge-accent text-[9px] font-mono tracking-wider uppercase m-1">Studio Update</p>
                        </div>
                        {broadcastPreview && (
                          <div className="bg-forge-accent/[0.03] p-3 text-center border-b border-white/[0.04]">
                            <p className="text-forge-accent text-[10px] font-mono m-0 uppercase">{broadcastPreview}</p>
                          </div>
                        )}
                        <div className="p-6 leading-relaxed text-[11px] text-slate-400 min-h-[160px]">
                          <div className="font-bold text-white mb-2 text-sm select-text">Subject: {broadcastSubject || "My Subject"}</div>
                          <div 
                            className="space-y-2 select-text font-sans"
                            dangerouslySetInnerHTML={{ __html: broadcastBody || "<p style='color:#52525b; font-style:italic;'>Email body content will render here...</p>" }}
                          />
                        </div>
                        <div className="p-5 border-t border-white/[0.04]">
                          <p className="text-[10px] text-slate-500 m-0">
                            You are receiving this because you subscribed to updates from StackForge.<br/>
                            <strong className="text-white">— The StackForge Team</strong>
                          </p>
                        </div>
                        <div className="bg-[#09090b] p-3 text-center border-t border-white/[0.04] text-[9px] text-slate-600">
                          StackForge Studio · Hyderabad, India
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
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

                {/* Project Progress & Portal Settings Card */}
                <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                  <h3 className="text-[10px] uppercase font-mono tracking-widest text-forge-accent font-bold flex items-center gap-1.5">
                    <Activity className="size-3.5" />
                    Project Tracking (Client Portal settings)
                  </h3>

                  <form onSubmit={handleSaveProject} className="space-y-4 bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Project Status */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                          Tracking Status
                        </label>
                        <select
                          value={projStatus}
                          onChange={(e) => setProjStatus(e.target.value)}
                          className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-forge-accent/30 transition-all font-mono"
                        >
                          <option value="pending">Inquiry Received (Phase 1)</option>
                          <option value="contacted">Consultation (Phase 2)</option>
                          <option value="design">UI/UX Design (Phase 3)</option>
                          <option value="development">Development (Phase 4)</option>
                          <option value="testing">Testing (Phase 4.5)</option>
                          <option value="completed">Live / Shipped (Phase 5)</option>
                          <option value="archived">Archived (Hidden)</option>
                        </select>
                      </div>

                      {/* Progress Percentage */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <label className="text-[9px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                            Progress Weight
                          </label>
                          <span className="text-[10px] font-mono font-bold text-forge-accent">{projProgress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={projProgress}
                          onChange={(e) => setProjProgress(parseInt(e.target.value, 10))}
                          className="w-full h-1 bg-[#0a0a0f] rounded-lg appearance-none cursor-pointer accent-forge-accent mt-3.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Figma Link */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                          Figma File Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://figma.com/file/..."
                          value={projFigma}
                          onChange={(e) => setProjFigma(e.target.value)}
                          className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-forge-accent/30 transition-all font-mono"
                        />
                      </div>

                      {/* Staging Link */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                          Staging Site URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://staging.domain.com"
                          value={projStaging}
                          onChange={(e) => setProjStaging(e.target.value)}
                          className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-forge-accent/30 transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Developer Update Notes */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-widest text-[#a1a1aa] block font-bold">
                        Developer Update Notes (Visible to Client)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe current status: e.g. Finished wireframes. Starting dashboard styling tomorrow."
                        value={projNotes}
                        onChange={(e) => setProjNotes(e.target.value)}
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none focus:border-forge-accent/30 transition-all font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={projSaving}
                      className={cn(
                        "w-full h-9 rounded-xl text-[10px] font-bold font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5",
                        projSaving
                          ? "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                          : "bg-white/[0.04] border border-white/[0.06] hover:border-forge-accent/30 text-white shadow-sm"
                      )}
                    >
                      {projSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ClipboardCheck className="size-3.5 text-forge-accent" />
                          <span>Save Project Tracking Details</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

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

      {/* ── Audit Log History Modal ── */}
      <AnimatePresence>
        {auditLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuditLogModalOpen(false)}
              className="absolute inset-0 bg-[#030306]/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_60px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                    <History className="size-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white font-syne tracking-widest uppercase">Full Audit Log History</h2>
                    <p className="text-[10px] text-[#a1a1aa] font-mono mt-0.5">Chronological system events and records</p>
                  </div>
                </div>
                <button
                  onClick={() => setAuditLogModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] flex items-center justify-center text-[#a1a1aa] hover:text-white transition-all cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Filters & Search */}
              <div className="px-6 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-[#0a0a0f]/40">
                <div className="flex bg-white/[0.03] p-1.5 border border-white/[0.06] rounded-xl gap-1.5 w-full sm:w-auto">
                  {["all", "inquiry", "subscriber"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAuditLogTab(tab as any)}
                      className={cn(
                        "h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex-1 sm:flex-none cursor-pointer",
                        auditLogTab === tab
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                          : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.04] border border-transparent"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 text-[#5e5f6a] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={auditLogSearch}
                    onChange={(e) => setAuditLogSearch(e.target.value)}
                    className="w-full h-9 bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-4 text-[11px] text-white placeholder-[#5e5f6a] outline-none focus:border-indigo-500/30 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Log List */}
              <div className="flex-1 overflow-y-auto p-2">
                <div className="w-full text-left border-collapse">
                  {activityFeedAll
                    .filter(item => auditLogTab === "all" || item.type === auditLogTab)
                    .filter(item => 
                      item.label.toLowerCase().includes(auditLogSearch.toLowerCase()) || 
                      item.sublabel.toLowerCase().includes(auditLogSearch.toLowerCase())
                    )
                    .map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0 group/feed">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-black border backdrop-blur-sm",
                        item.action === "+1"
                          ? "bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400"
                          : "bg-red-500/[0.08] border-red-500/20 text-red-400"
                      )}>
                        {item.action}
                      </div>

                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border backdrop-blur-sm",
                        item.type === "inquiry"
                          ? "bg-forge-accent/[0.06] border-forge-accent/15"
                          : "bg-indigo-500/[0.06] border-indigo-500/15"
                      )}>
                        {item.type === "inquiry" 
                          ? <MessageSquarePlus className="size-4 text-forge-accent" />
                          : <UserPlus className="size-4 text-indigo-400" />
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate font-syne leading-tight group-hover/feed:text-indigo-300 transition-colors">
                          {item.label}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[#a1a1aa] font-mono truncate">
                            {item.sublabel}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="text-[10px] text-[#5e5f6a] font-mono uppercase tracking-wider">
                            {item.type}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-white/70 font-mono">
                          {item.rawDate.toLocaleDateString()}
                        </p>
                        <p className="text-[9px] text-[#5e5f6a] font-mono mt-0.5">
                          {item.rawDate.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activityFeedAll.filter(item => auditLogTab === "all" || item.type === auditLogTab).filter(item => item.label.toLowerCase().includes(auditLogSearch.toLowerCase()) || item.sublabel.toLowerCase().includes(auditLogSearch.toLowerCase())).length === 0 && (
                    <div className="p-12 text-center text-[#5e5f6a]">
                      <History className="size-8 mx-auto mb-3 opacity-30" />
                      <p className="text-xs font-mono uppercase tracking-wider">No logs found.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

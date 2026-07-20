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
  X,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Send,
  Sliders,
  Settings
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
      <svg className="w-full h-[120px]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal gridlines */}
        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="rgba(0,0,0,0.03)" strokeWidth={1} />
        <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="rgba(0,0,0,0.03)" strokeWidth={1} />
        
        {/* Y Axis helper labels */}
        <text x={paddingLeft - 8} y={paddingTop + 4} fill="rgba(0,0,0,0.3)" fontSize="9" textAnchor="end" className="font-mono">{maxVal}</text>
        <text x={paddingLeft - 8} y={height - paddingBottom + 3} fill="rgba(0,0,0,0.3)" fontSize="9" textAnchor="end" className="font-mono">0</text>

        {/* Path Fill */}
        {points.length > 0 && (
          <>
            <path d={areaPath} fill={fillColor} />
            <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {/* X Axis Labels */}
        {points.map((p, idx) => (
          <text 
            key={`lbl-${idx}`} 
            x={p.x} 
            y={height - 6} 
            fill="rgba(0,0,0,0.3)" 
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
                r={3.5}
                fill="#ffffff"
                stroke={strokeColor}
                strokeWidth={1.5}
                pointerEvents="none"
              />
            )}
          </g>
        ))}
      </svg>
      {/* Tooltip Overlay */}
      {hoverIdx !== null && (
        <div 
          className="absolute bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 shadow-md text-[9px] font-mono pointer-events-none transition-all flex flex-col items-center z-20 text-white"
          style={{
            left: `${(points[hoverIdx].x / width) * 100}%`,
            top: `${(points[hoverIdx].y / height) * 100 - 32}%`,
            transform: "translateX(-50%)"
          }}
        >
          <span className="text-neutral-400 leading-none">{points[hoverIdx].label}</span>
          <span className="text-white font-bold mt-0.5 leading-none">{points[hoverIdx].val} inquiries</span>
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
  const [activeTab, setActiveTab] = useState<"overview" | "inquiries" | "subscribers" | "newsletter">("overview");
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

  // Update detail states when inquiry changes
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

  // Save drafts
  useEffect(() => {
    if (broadcastSubject) localStorage.setItem("sf_draft_subject", broadcastSubject);
    else localStorage.removeItem("sf_draft_subject");
  }, [broadcastSubject]);

  useEffect(() => {
    if (broadcastPreview) localStorage.setItem("sf_draft_preview", broadcastPreview);
    else localStorage.removeItem("sf_draft_preview");
  }, [broadcastPreview]);

  useEffect(() => {
    if (broadcastBody) localStorage.setItem("sf_draft_body", broadcastBody);
    else localStorage.removeItem("sf_draft_body");
  }, [broadcastBody]);

  // Check magic login on mount
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

  // Real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabaseClient
      .channel("admin-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ContactSubmission" },
        (payload) => {
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
        throw new Error(data.error || "Magic link failed");
      }
      window.history.replaceState({}, document.title, window.location.pathname);
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message || "Magic login authentication failure");
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
      const res = await fetch("/api/admin?action=forgot_password", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to issue link");
      setResetMessage(data.message || "Magic login link dispatched.");
    } catch (err: any) {
      setError(err.message || "Could not request link");
    } finally {
      setLoading(false);
    }
  }

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
      if (!res.ok) throw new Error(data.error || "MFA dispatch failure");
      setResetMessage(data.message || "New validation code dispatched.");
      setTimeLeft(600);
    } catch (err: any) {
      setError(err.message || "Resend code failure");
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
    } catch (err) {
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
          throw new Error(data.error || "Access denied");
        }

        const data = await res.json();
        if (data.mfaRequired) {
          setMfaRequired(true);
          setMfaEmail(data.email || "");
        } else {
          await fetchDashboardData();
        }
      } catch (err: any) {
        setError(err.message || "System keys invalid");
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
          throw new Error(data.error || "MFA validation failure");
        }

        await fetchDashboardData();
      } catch (err: any) {
        setError(err.message || "Verification code incorrect");
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
      console.error("Logout error:", err);
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
      downloadAnchor.setAttribute("download", `sf_${type}_${new Date().toISOString().split("T")[0]}.json`);
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
      downloadAnchor.setAttribute("download", `sf_${type}_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastBody || broadcastStatus === "sending") return;

    if (!confirm(`Deploy broadcast newsletter to all ${subscribers.length} active contacts?`)) {
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
      if (!res.ok) throw new Error(data.error || "Broadcast delivery failure");

      setBroadcastStatus("success");
      setBroadcastMessage(data.message || "Newsletter broadcast deployed!");
      setBroadcastSubject("");
      setBroadcastPreview("");
      setBroadcastBody("");
      localStorage.removeItem("sf_draft_subject");
      localStorage.removeItem("sf_draft_preview");
      localStorage.removeItem("sf_draft_body");
    } catch (err: any) {
      setBroadcastStatus("error");
      setBroadcastMessage(err.message || "Broadcast pipeline execution error");
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
      if (!res.ok) throw new Error(data.error || "Sync settings failure");

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

      setSelectedInquiry(prev => prev ? {
        ...prev,
        status: projStatus,
        progress: projProgress,
        figmaLink: projFigma,
        stagingLink: projStaging,
        clientNotes: projNotes,
      } : null);

      alert("Client tracking matrices saved successfully.");
    } catch (err: any) {
      alert("Error saving properties: " + err.message);
    } finally {
      setProjSaving(false);
    }
  };

  const handleDelete = async (type: "inquiry" | "subscriber", id: string) => {
    if (!confirm(`Purge this ${type} permanently from databases?`)) return;

    try {
      const res = await fetch(`/api/admin?type=${type}&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete operation rejected by backend");

      if (type === "inquiry") {
        setInquiries(prev => prev.filter(i => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } else {
        setSubscribers(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      alert("Database error: " + err);
    }
  };

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

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s => s.email.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [subscribers, searchQuery]);

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

  const chartData = useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const inquiryCounts = new Array(7).fill(0);
    const subscriberCounts = new Array(7).fill(0);

    inquiries.forEach(inq => {
      const dateStr = new Date(inq.createdAt).toISOString().split("T")[0];
      const idx = dates.indexOf(dateStr);
      if (idx !== -1) inquiryCounts[idx]++;
    });

    subscribers.forEach(sub => {
      const dateStr = new Date(sub.createdAt).toISOString().split("T")[0];
      const idx = dates.indexOf(dateStr);
      if (idx !== -1) subscriberCounts[idx]++;
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

  const stats = useMemo(() => {
    let totalInquiriesCount = inquiries.length;
    let totalSubscribersCount = subscribers.length;
    let pipelineVal = 0;

    inquiries.forEach(i => {
      const budgetStr = i.budget || "";
      if (budgetStr.includes("50,000+")) pipelineVal += 60000;
      else if (budgetStr.includes("15,000 – ₹50,000")) pipelineVal += 32500;
      else if (budgetStr.includes("5,000 – ₹15,000")) pipelineVal += 10000;
      else if (budgetStr.includes("3,000 – ₹5,000")) pipelineVal += 4000;
      else if (budgetStr.includes("Under ₹3,000")) pipelineVal += 2000;
      else if (budgetStr.includes("Flexible")) pipelineVal += 15000;
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

    items.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    return items;
  }, [inquiries, subscribers]);

  const activityFeed = useMemo(() => activityFeedAll.slice(0, 8), [activityFeedAll]);

  const recentCount = useMemo(() => {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    let count = 0;
    inquiries.forEach(i => { if (new Date(i.createdAt) > dayAgo) count++; });
    subscribers.forEach(s => { if (new Date(s.createdAt) > dayAgo) count++; });
    return count;
  }, [inquiries, subscribers]);

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
      <div className="min-h-screen bg-[#0E0E12] flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase animate-pulse">
            Connecting Console...
          </p>
        </div>
      </div>
    );
  }

  // ── CINEMATIC 4K LOGIN SCREEN REDESIGN ──
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#08080A] flex p-0 relative overflow-hidden font-sans w-full text-white">
        {/* Left Side: Editorial Dark Login Pane (40% width on desktop) */}
        <div className="w-full lg:w-[42%] bg-[#0A0A0D]/95 backdrop-blur-3xl border-r border-white/[0.04] p-8 md:p-16 flex flex-col justify-between z-10 relative">
          {/* subtle line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500/80 via-transparent to-transparent" />
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/10">
              <Flame className="size-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-xs font-black tracking-[0.2em] uppercase font-syne text-white leading-none">
                StackForge
              </h1>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest leading-none block mt-1">
                Central Operations
              </span>
            </div>
          </div>

          <div className="max-w-[340px] w-full mx-auto my-auto space-y-7">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white font-syne">
                System decrypt
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Authorized operators credential access gate.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <AnimatePresence mode="wait">
                {!mfaRequired ? (
                  <motion.div
                    key="password-field"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <label className="text-[9px] uppercase tracking-wider text-neutral-400 block font-bold font-mono">
                      System Security Key
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 transition-all font-mono"
                      autoFocus
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="text-[9px] text-neutral-500 hover:text-orange-500 uppercase font-mono tracking-wider transition-colors cursor-pointer bg-transparent border-none p-0"
                      >
                        Request Access Link ↗
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="mfa-field"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] uppercase tracking-wider text-orange-500 block font-bold font-mono">
                        Verification Code
                      </label>
                      <span className={cn(
                        "text-[9px] font-mono px-1.5 py-0.5 rounded border leading-none",
                        timeLeft <= 60 
                          ? "bg-red-500/10 text-red-400 border-red-500/20" 
                          : "bg-white/5 text-neutral-400 border-white/10"
                      )}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="000000"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      disabled={loading || timeLeft === 0}
                      maxLength={6}
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-4 py-3 text-center text-sm tracking-[0.3em] font-bold text-white placeholder-neutral-700 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 transition-all font-mono"
                      autoFocus
                    />
                    <div className="flex justify-between items-center pt-1 font-mono text-[9px]">
                      <button
                        type="button"
                        onClick={() => {
                          setMfaRequired(false);
                          setMfaCode("");
                          setPassword("");
                          setError(null);
                        }}
                        className="text-neutral-500 hover:text-white transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleResendMfa}
                        disabled={loading || timeLeft > 570}
                        className="text-neutral-500 hover:text-orange-500 transition-colors disabled:opacity-50"
                      >
                        Resend Code
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="text-[10px] text-red-400 font-mono bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="size-3 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {resetMessage && (
                <div className="text-[10px] text-emerald-400 font-mono bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="size-3 shrink-0" />
                  <span>{resetMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-600/15"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{!mfaRequired ? "Authenticate Credentials" : "Submit Verification"}</span>
                    <ChevronRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-neutral-600 text-[9px] font-mono flex items-center gap-1.5 select-none justify-center">
            <span>Powered by Supabase Security Guard</span>
            <span>·</span>
            <span>Node v18</span>
          </div>
        </div>

        {/* Right Side: Cinematic Ambient 4K Studio Image (Hidden on mobile) */}
        <div className="hidden lg:block flex-1 relative bg-[#060608]">
          <Image
            src="/admin-bg.jpg"
            alt="StackForge Studio"
            fill
            className="object-cover opacity-65 grayscale-[30%] select-none pointer-events-none"
            priority
          />
          {/* Dark luxury overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-transparent to-black/30" />
          <div className="absolute bottom-16 left-16 max-w-[480px] space-y-2 z-10 select-none">
            <span className="text-xs font-mono text-orange-500 uppercase tracking-widest block font-bold">StackForge Premium Console</span>
            <h3 className="text-3xl font-black text-white font-syne tracking-tight leading-tight">
              A high performance workspace built for high performance engineers.
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Designed with precision, styled for clarity, and integrated securely with SQLite & Supabase core pipelines.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── PREMIUM EDITORIAL SPLIT-PANE REDESIGN ──
  return (
    <main className="min-h-screen bg-[#FDFDFD] text-[#1A1A1E] flex font-sans overflow-hidden">
      
      {/* ── Left Sidebar (Dark Charcoal #0E0E12 Pane) ── */}
      <aside className="w-[240px] bg-[#0C0C0F] text-white flex flex-col justify-between shrink-0 border-r border-white/[0.04] z-20">
        <div>
          {/* Logo Brand Strip */}
          <div className="p-6 border-b border-white/[0.04] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center">
              <Flame className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-[0.25em] uppercase font-syne leading-none text-white">
                StackForge
              </h2>
              <span className="text-[7.5px] font-mono text-neutral-500 tracking-wider uppercase leading-none block mt-1">
                Ops Database v1.0
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "inquiries", label: "Inquiries", icon: FolderGit2, count: inquiries.length },
              { id: "subscribers", label: "Subscribers", icon: Users, count: subscribers.length },
              { id: "newsletter", label: "Broadcast", icon: Mail },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "w-full h-10 px-3.5 rounded-lg text-xs font-medium font-mono uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer",
                    isSelected 
                      ? "bg-white/[0.04] text-white border border-white/[0.06]" 
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("size-3.5", isSelected ? "text-orange-500" : "text-neutral-500")} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-neutral-400">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setAuditLogModalOpen(true)}
              className="w-full h-10 px-3.5 rounded-lg text-xs font-medium font-mono uppercase tracking-wider flex items-center gap-2.5 text-neutral-400 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer mt-4"
            >
              <History className="size-3.5 text-neutral-500" />
              <span>Full Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Panel */}
        <div className="p-4 border-t border-white/[0.04] space-y-4 bg-black/20">
          <div className="flex items-center gap-2 px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="min-w-0">
              <p className="text-[8px] font-mono text-neutral-500 uppercase leading-none tracking-widest">
                Database Node
              </p>
              <p className="text-[10px] font-bold text-neutral-300 font-mono truncate leading-none mt-1">
                Supabase Online
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-9 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:bg-red-950/20 hover:border-red-500/20 hover:text-red-400 text-neutral-400 font-mono text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="size-3" />
            <span>Lock Console</span>
          </button>
        </div>
      </aside>

      {/* ── Right Workspace Workspace Area (Warm Off-White FAF9F6 Vibe) ── */}
      <section className="flex-1 bg-[#FAF9F6] flex flex-col overflow-hidden relative">
        {/* Grain overlay */}
        <div className="grain-overlay opacity-[0.035] pointer-events-none" aria-hidden="true" />
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#E8E7E2] px-8 flex items-center justify-between z-10 shrink-0 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[10px] uppercase font-bold text-neutral-400">console</span>
            <ChevronRight className="size-3 text-neutral-300" />
            <span className="text-[10px] uppercase font-bold text-neutral-900 tracking-wider">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {recentCount > 0 && (
              <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full border border-orange-200">
                {recentCount} updates today
              </span>
            )}
            <div className="h-4 w-px bg-neutral-200" />
            <span className="text-[10px] font-mono text-neutral-500">
              User: <strong className="text-neutral-800">Admin</strong>
            </span>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 relative max-w-[1280px] w-full mx-auto">
          
          <AnimatePresence mode="wait">
            
            {/* ── VIEW: OVERVIEW (Editorial Layout) ── */}
            {activeTab === "overview" && (
              <motion.div
                key="overview-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                {/* Editorial display stat grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#EBEAE6] border-y border-[#EBEAE6] py-8">
                  <div className="py-4 md:py-0 md:pr-8">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                      Pipeline Volume
                    </span>
                    <h3 className="text-3xl font-black font-syne text-neutral-900 mt-2 select-text">
                      {stats.pipelineBudget}
                    </h3>
                    <p className="text-[9px] font-mono text-neutral-400 mt-1">Est. value of active specifications</p>
                  </div>
                  <div className="py-4 md:py-0 md:px-8">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                      Avg Deal Size
                    </span>
                    <h3 className="text-3xl font-black font-syne text-neutral-900 mt-2 select-text">
                      {stats.averageDeal}
                    </h3>
                    <p className="text-[9px] font-mono text-neutral-400 mt-1">Mean inquiry contract matrix</p>
                  </div>
                  <div className="py-4 md:py-0 md:px-8">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                      Client Leads
                    </span>
                    <h3 className="text-3xl font-black font-syne text-neutral-900 mt-2 select-text">
                      {stats.inquiriesCount}
                    </h3>
                    <p className="text-[9px] font-mono text-neutral-400 mt-1">Individual project submissions</p>
                  </div>
                  <div className="py-4 md:py-0 md:pl-8">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                      Audience Size
                    </span>
                    <h3 className="text-3xl font-black font-syne text-neutral-900 mt-2 select-text">
                      {stats.subscribersCount}
                    </h3>
                    <p className="text-[9px] font-mono text-neutral-400 mt-1">Active verified email broadcast list</p>
                  </div>
                </div>

                {/* Graph Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Inquiry chart */}
                  <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                          Inbound Velocity
                        </h4>
                        <p className="text-lg font-bold text-neutral-900 mt-1">
                          {chartData.inquiries.reduce((a, b) => a + b, 0)} leads last 7 days
                        </p>
                      </div>
                      <TrendingUp className="size-4 text-orange-500" />
                    </div>
                    <SparklineChart data={chartData.inquiries} labels={chartData.labels} strokeColor="#FF6A00" fillColor="url(#accentGrad)" />
                  </div>

                  {/* Subscribers chart */}
                  <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                          Audience Subscriptions
                        </h4>
                        <p className="text-lg font-bold text-neutral-900 mt-1">
                          {chartData.subscribers.reduce((a, b) => a + b, 0)} new last 7 days
                        </p>
                      </div>
                      <TrendingUp className="size-4 text-emerald-500" />
                    </div>
                    <SparklineChart data={chartData.subscribers} labels={chartData.labels} strokeColor="#10B981" fillColor="url(#emeraldGrad)" />
                  </div>
                </div>

                {/* Demographics & Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Service Demographics */}
                  <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm space-y-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      Requested Framework Needs
                    </h4>
                    {inquiries.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">No demographics mapped yet.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {analytics.services.slice(0, 5).map(([service, count]) => {
                          const percent = Math.round((count / inquiries.length) * 100);
                          return (
                            <div key={service} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-neutral-700 truncate max-w-[70%]">{service}</span>
                                <span className="text-neutral-400">{count} ({percent}%)</span>
                              </div>
                              <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${percent}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Budgets Mapped */}
                  <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm space-y-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      Budget Distributions
                    </h4>
                    {inquiries.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">No budget statistics.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {analytics.budgets.slice(0, 5).map(([budget, count]) => {
                          const percent = Math.round((count / inquiries.length) * 100);
                          return (
                            <div key={budget} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-neutral-700 truncate max-w-[75%]">{budget}</span>
                                <span className="text-neutral-400">{percent}%</span>
                              </div>
                              <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Realtime Event Log stream */}
                  <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-4">
                        Recent Console Activity
                      </h4>
                      {activityFeed.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">No records in registry.</p>
                      ) : (
                        <div className="space-y-3">
                          {activityFeed.slice(0, 4).map(item => (
                            <div key={item.id} className="flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0",
                                  item.type === "inquiry" ? "bg-orange-500" : "bg-indigo-500"
                                )} />
                                <span className="text-neutral-800 font-semibold truncate leading-none">{item.label}</span>
                              </div>
                              <span className="text-[10px] text-neutral-400 shrink-0 ml-2">{item.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setAuditLogModalOpen(true)}
                      className="text-[9px] font-mono font-bold uppercase text-orange-600 hover:text-orange-500 tracking-wider text-left underline mt-5 block w-fit"
                    >
                      Audit Console Logs →
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ── VIEW: INQUIRIES (Crisp Clean List & Search) ── */}
            {activeTab === "inquiries" && (
              <motion.div
                key="inquiries-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Filters / Search Strip */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E8E7E2] pb-6">
                  <div className="relative w-full sm:w-80">
                    <Search className="size-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter inquiries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 bg-white border border-[#E8E7E2] rounded-lg pl-9 pr-4 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-orange-500/50 transition-all font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto font-mono">
                    <button
                      onClick={() => exportData("inquiries", "csv")}
                      className="h-10 px-4 bg-white border border-[#E8E7E2] text-[10px] font-bold uppercase tracking-wider rounded-lg text-neutral-600 hover:text-neutral-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <FileDown className="size-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => exportData("inquiries", "json")}
                      className="h-10 px-4 bg-white border border-[#E8E7E2] text-[10px] font-bold uppercase tracking-wider rounded-lg text-neutral-600 hover:text-neutral-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <FileDown className="size-3.5" />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>

                {filteredInquiries.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-[#E8E7E2] rounded-xl bg-white/20">
                    <FolderGit2 className="size-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-xs font-mono uppercase text-neutral-400 tracking-wider">No matching inquiries found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/25 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-neutral-900 truncate tracking-tight text-sm font-syne select-text">
                                {inq.name}
                              </h4>
                              <p className="text-[10px] text-neutral-400 font-mono truncate select-text mt-0.5">{inq.contact}</p>
                            </div>
                            <span className="text-[8px] font-mono text-neutral-400 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded leading-none shrink-0">
                              {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 my-3.5 select-none">
                            <span className="text-[8px] font-black font-mono px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-wider">
                              {inq.serviceNeed || "Project Request"}
                            </span>
                            {inq.budget && (
                              <span className="text-[8px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                                {inq.budget}
                              </span>
                            )}
                            {inq.status && inq.status !== "pending" && (
                              <span className={cn(
                                "text-[8px] font-bold font-mono px-2 py-0.5 rounded border capitalize",
                                inq.status === "completed" ? "bg-green-50 text-green-600 border-green-100" :
                                inq.status === "development" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                inq.status === "design" ? "bg-purple-50 text-purple-600 border-purple-100" :
                                "bg-neutral-50 text-neutral-500 border-neutral-100"
                              )}>
                                {inq.status}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 min-h-[54px] select-text">
                            {inq.details || "No specification text provided."}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#F2F1EC] flex items-center justify-between mt-5 font-mono">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="h-8 px-3 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Eye className="size-3" />
                            <span>Workspace Console</span>
                          </button>

                          <button
                            onClick={() => handleDelete("inquiry", inq.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                            title="Delete permanently"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── VIEW: SUBSCRIBERS (Minimal Clean Table) ── */}
            {activeTab === "subscribers" && (
              <motion.div
                key="subscribers-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Search / Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E8E7E2] pb-6">
                  <div className="relative w-full sm:w-80">
                    <Search className="size-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search email list..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 bg-white border border-[#E8E7E2] rounded-lg pl-9 pr-4 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-orange-500/50 transition-all font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto font-mono">
                    <button
                      onClick={copyEmailsList}
                      className="h-10 px-4 bg-white border border-[#E8E7E2] text-[10px] font-bold uppercase tracking-wider rounded-lg text-neutral-600 hover:text-neutral-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {copiedAll ? <ClipboardCheck className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                      <span>{copiedAll ? "Copied list" : "Copy email string"}</span>
                    </button>
                    <button
                      onClick={() => exportData("subscribers", "csv")}
                      className="h-10 px-4 bg-white border border-[#E8E7E2] text-[10px] font-bold uppercase tracking-wider rounded-lg text-neutral-600 hover:text-neutral-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <FileDown className="size-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {filteredSubscribers.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-[#E8E7E2] rounded-xl bg-white/20">
                    <Users className="size-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-xs font-mono uppercase text-neutral-400 tracking-wider">No subscribers matched search query</p>
                  </div>
                ) : (
                  <div className="bg-white border border-[#E8E7E2] rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-left text-xs text-neutral-600">
                      <thead className="bg-[#FAF9F6] border-b border-[#E8E7E2] font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4 font-black">Registered Email Address</th>
                          <th className="px-6 py-4 font-black">Authorized Subscribed Date</th>
                          <th className="px-6 py-4 font-black text-right">Database Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBEAE6] font-mono">
                        {filteredSubscribers.map((subscriber, idx) => (
                          <tr key={subscriber.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                            <td className="px-6 py-4 text-neutral-900 font-bold text-sm select-text">
                              {subscriber.email}
                            </td>
                            <td className="px-6 py-4">
                              {new Date(subscriber.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(subscriber.email);
                                  setCopiedIndex(idx);
                                  setTimeout(() => setCopiedIndex(null), 2000);
                                }}
                                className="h-8 px-3.5 bg-white border border-[#E8E7E2] hover:border-orange-500/30 rounded-lg text-[9px] font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                              >
                                {copiedIndex === idx ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                                <span>{copiedIndex === idx ? "Done" : "Copy"}</span>
                              </button>
                              <button
                                onClick={() => handleDelete("subscriber", subscriber.id)}
                                className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center text-red-500 transition-all cursor-pointer shadow-sm"
                                title="Unregister"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── VIEW: BROADCAST NEWSLETTER (Split view layout) ── */}
            {activeTab === "newsletter" && (
              <motion.div
                key="newsletter-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
              >
                {/* Left Editor */}
                <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-950 font-syne uppercase tracking-wide">
                      Email Newsletter Dispatch
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-mono mt-1">
                      Compose HTML template alerts to transmit directly to verified subscriber databases.
                    </p>
                  </div>

                  <form onSubmit={handleSendBroadcast} className="space-y-4 font-mono">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-neutral-400">Subject Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. StackForge Studio Update: Shipped!"
                        value={broadcastSubject}
                        onChange={(e) => setBroadcastSubject(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-[#E8E7E2] rounded-lg px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-orange-500/50 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-neutral-400">Sub-header Preview Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Important releases and metrics metrics details"
                        value={broadcastPreview}
                        onChange={(e) => setBroadcastPreview(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-[#E8E7E2] rounded-lg px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-orange-500/50 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-neutral-400">Message Body (HTML Allowed)</label>
                      <textarea
                        required
                        rows={11}
                        placeholder="<p>Hello Framework Operators,</p><p>We are excited to share...</p>"
                        value={broadcastBody}
                        onChange={(e) => setBroadcastBody(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-[#E8E7E2] rounded-lg p-4 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-orange-500/50 transition-all min-h-[220px]"
                      />
                    </div>

                    {broadcastStatus !== "idle" && broadcastMessage && (
                      <div className={cn(
                        "p-3 rounded-lg text-xs font-mono border",
                        broadcastStatus === "success" 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : broadcastStatus === "error"
                          ? "bg-red-50 border-red-200 text-red-500"
                          : "bg-neutral-50 border-neutral-200 text-neutral-600"
                      )}>
                        {broadcastMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={broadcastStatus === "sending" || !broadcastSubject || !broadcastBody}
                      className={cn(
                        "w-full h-11 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2",
                        broadcastStatus === "sending" || !broadcastSubject || !broadcastBody
                          ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/15"
                      )}
                    >
                      {broadcastStatus === "sending" ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="size-3.5" />
                          <span>Dispatch Broadcast to {subscribers.length} contacts</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Mockup */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      Rendering Mockup
                    </h4>
                    <div className="flex bg-[#FAF9F6] border border-[#E8E7E2] rounded-lg p-0.5 gap-1 font-mono text-[9px] font-bold shadow-sm">
                      {["desktop", "mobile"].map(vp => (
                        <button
                          key={vp}
                          type="button"
                          onClick={() => setPreviewViewport(vp as any)}
                          className={cn(
                            "px-2 py-0.5 rounded cursor-pointer capitalize transition-all",
                            previewViewport === vp ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                          )}
                        >
                          {vp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border border-[#E8E7E2] rounded-xl overflow-hidden bg-neutral-950 text-neutral-300 font-sans text-xs flex flex-col items-center shadow-md">
                    <div className="w-full bg-neutral-900 px-4 py-2 border-b border-neutral-800 text-[10px] text-neutral-500 font-mono flex items-center justify-between select-none">
                      <span>Sender: ops@stackforge.co</span>
                      <span>Recipient: list@client.com</span>
                    </div>

                    <div className="w-full p-8 bg-neutral-900 min-h-[440px] flex items-center justify-center overflow-y-auto">
                      <div 
                        className={cn(
                          "bg-white border border-neutral-200 rounded-xl overflow-hidden transition-all duration-300 shadow-xl",
                          previewViewport === "mobile" ? "w-[300px]" : "w-full max-w-[390px]"
                        )}
                      >
                        <div className="bg-neutral-950 p-5 text-center border-b-4 border-orange-500 select-none">
                          <h1 className="text-white text-lg font-black tracking-[0.2em] m-0 font-syne uppercase">STACKFORGE</h1>
                          <p className="text-orange-500 text-[9px] font-mono tracking-wider uppercase m-1">Studio update</p>
                        </div>
                        {broadcastPreview && (
                          <div className="bg-orange-50/50 p-2.5 text-center border-b border-orange-100">
                            <p className="text-orange-600 text-[9px] font-mono m-0 uppercase font-bold tracking-wider">{broadcastPreview}</p>
                          </div>
                        )}
                        <div className="p-6 leading-relaxed text-[11px] text-neutral-600 min-h-[160px] select-text">
                          <div className="font-bold text-neutral-900 mb-2 text-xs">Subject: {broadcastSubject || "Untitled Broadcast"}</div>
                          <div 
                            className="space-y-2 font-sans"
                            dangerouslySetInnerHTML={{ __html: broadcastBody || "<p style='color:#a3a3a3; font-style:italic;'>Framework content body placeholder...</p>" }}
                          />
                        </div>
                        <div className="p-5 border-t border-neutral-100 bg-[#FAF9F6] text-[10px] text-neutral-400 select-none leading-relaxed">
                          You received this system alert because you are signed to operations logs from StackForge.<br/>
                          <strong className="text-neutral-600">— Studio Engineering</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* ── INTERACTION: SLIDE-IN DETAIL WORKSPACE DRAWER ── */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setSelectedInquiry(null)}
            />
            
            <motion.div 
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full sm:max-w-[580px] h-full sm:h-[calc(100vh-2rem)] bg-[#FDFDFD] border-l sm:border border-[#E8E7E2] sm:rounded-xl shadow-2xl flex flex-col justify-between relative overflow-hidden z-10 text-[#1A1A1E]"
            >
              {/* Drawer left accent border */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-orange-500 to-amber-500" />

              {/* Header */}
              <div className="px-6 py-5 border-b border-[#E8E7E2] bg-[#FAF9F6]/80 flex items-center justify-between shrink-0 font-mono">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-orange-600 font-black">
                    Inquiry database folder
                  </span>
                  <h2 className="text-md font-black text-neutral-950 font-syne leading-tight mt-0.5 tracking-tight select-text">
                    {selectedInquiry.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="h-8 w-8 rounded-lg border border-[#E8E7E2] hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-all cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Meta details list */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-b border-[#EBEAE6] pb-6">
                  <div>
                    <span className="text-[8px] text-neutral-400 font-mono block uppercase font-bold">Client Contact</span>
                    <a
                      href={selectedInquiry.contact.includes("@") ? `mailto:${selectedInquiry.contact}` : `https://wa.me/${selectedInquiry.contact.replace(/[^\d+]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-900 hover:text-orange-600 font-mono inline-flex items-center gap-1 mt-1 break-all transition-colors font-bold select-text"
                    >
                      <span>{selectedInquiry.contact}</span>
                      <ExternalLink className="size-3 shrink-0 text-neutral-400" />
                    </a>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-400 font-mono block uppercase font-bold">Date Received</span>
                    <span className="text-xs text-neutral-900 font-mono mt-1 block select-text">
                      {new Date(selectedInquiry.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-400 font-mono block uppercase font-bold">Business Segment</span>
                    <span className="text-xs text-neutral-900 font-semibold mt-1 block font-syne select-text">
                      {selectedInquiry.businessType || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-400 font-mono block uppercase font-bold">Target Framework</span>
                    <span className="text-xs text-orange-600 font-black mt-1 block uppercase font-mono tracking-wider select-text">
                      {selectedInquiry.serviceNeed || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-400 font-mono block uppercase font-bold">Allocated Budget</span>
                    <span className="text-xs text-emerald-600 font-extrabold mt-1 block font-mono select-text">
                      {selectedInquiry.budget || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-400 font-mono block uppercase font-bold">Timeline Needed</span>
                    <span className="text-xs text-neutral-900 font-semibold mt-1 block select-text">
                      {selectedInquiry.timeline || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Features list */}
                {selectedInquiry.features && (
                  <div className="space-y-2">
                    <h4 className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 font-bold">
                      Addon Integration Specifications
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {parseFeatures(selectedInquiry.features).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[8px] font-black px-2.5 py-1 rounded bg-[#FAF9F6] border border-[#E8E7E2] text-neutral-700 font-mono uppercase tracking-wider"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* File attachments */}
                {selectedInquiry.attachments && (
                  <div className="space-y-2">
                    <h4 className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 font-bold">
                      Specification Attachments
                    </h4>
                    <div className="space-y-1.5">
                      {parseAttachments(selectedInquiry.attachments).map((file, idx) => (
                        <a
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between border border-[#E8E7E2] bg-white px-4 py-2.5 rounded-lg text-xs hover:border-orange-500/30 text-neutral-800 transition-all shadow-sm"
                        >
                          <span className="truncate pr-4 font-mono">{file.name}</span>
                          <div className="flex items-center gap-1.5 text-orange-600 font-black text-[9px] uppercase font-mono tracking-widest shrink-0">
                            <span>download</span>
                            <FileDown className="size-3.5" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client Portal Progress Controller */}
                <div className="space-y-4 pt-4 border-t border-[#EBEAE6]">
                  <h4 className="text-[9px] uppercase font-mono tracking-wider text-neutral-900 font-bold flex items-center gap-1.5">
                    <Sliders className="size-3.5 text-orange-500" />
                    Portal Synchronizer
                  </h4>

                  <form onSubmit={handleSaveProject} className="space-y-4 bg-[#FAF9F6] border border-[#E8E7E2] p-5 rounded-xl font-mono text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Project Status selector */}
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase font-bold text-neutral-400">Sync Status</label>
                        <select
                          value={projStatus}
                          onChange={(e) => setProjStatus(e.target.value)}
                          className="w-full bg-white border border-[#E8E7E2] rounded-lg px-2 py-1.5 text-xs text-neutral-800 outline-none focus:border-orange-500/50"
                        >
                          <option value="pending">Inquiry Received</option>
                          <option value="contacted">Consultation</option>
                          <option value="design">UI/UX Design</option>
                          <option value="development">Development</option>
                          <option value="testing">Testing</option>
                          <option value="completed">Live / Shipped</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      {/* Progress input */}
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-[8px] uppercase font-bold text-neutral-400">Percentage</label>
                          <span className="text-[10px] font-bold text-orange-600">{projProgress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={projProgress}
                          onChange={(e) => setProjProgress(parseInt(e.target.value, 10))}
                          className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-orange-600 mt-2.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Figma Link */}
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase font-bold text-neutral-400">Figma Canvas</label>
                        <input
                          type="url"
                          placeholder="https://figma.com/file/..."
                          value={projFigma}
                          onChange={(e) => setProjFigma(e.target.value)}
                          className="w-full bg-white border border-[#E8E7E2] rounded-lg px-2.5 py-1.5 text-xs placeholder-neutral-300 outline-none focus:border-orange-500/50"
                        />
                      </div>

                      {/* Staging Link */}
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase font-bold text-neutral-400">Staging URL</label>
                        <input
                          type="url"
                          placeholder="https://staging.site"
                          value={projStaging}
                          onChange={(e) => setProjStaging(e.target.value)}
                          className="w-full bg-white border border-[#E8E7E2] rounded-lg px-2.5 py-1.5 text-xs placeholder-neutral-300 outline-none focus:border-orange-500/50"
                        />
                      </div>
                    </div>

                    {/* Developer notes */}
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-neutral-400">Operational Log Updates</label>
                      <textarea
                        rows={3}
                        placeholder="Current logs details for client to inspect..."
                        value={projNotes}
                        onChange={(e) => setProjNotes(e.target.value)}
                        className="w-full bg-white border border-[#E8E7E2] rounded-lg p-2.5 text-xs placeholder-neutral-300 outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={projSaving}
                      className={cn(
                        "w-full h-9 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5",
                        projSaving
                          ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                          : "bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm"
                      )}
                    >
                      {projSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Commit Synchronization Settings</span>
                      )}
                    </button>
                  </form>
                </div>

                {/* Plain spec info */}
                <div className="space-y-2">
                  <h4 className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 font-bold">
                    Plain Text Specifications
                  </h4>
                  <div className="border border-[#E8E7E2] bg-white rounded-lg p-5 text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto font-mono select-text shadow-inner">
                    {selectedInquiry.details || "No operational specification details registered."}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Controls */}
              <div className="px-6 py-4 border-t border-[#E8E7E2] bg-[#FAF9F6] flex items-center justify-between shrink-0 font-mono">
                <a
                  href={selectedInquiry.contact.includes("@") ? `mailto:${selectedInquiry.contact}` : `https://wa.me/${selectedInquiry.contact.replace(/[^\d+]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Transmit Response</span>
                  <ExternalLink className="size-3.5" />
                </a>

                <button
                  onClick={() => handleDelete("inquiry", selectedInquiry.id)}
                  className="h-10 px-4 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>Purge Record</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── AUDIT LOG LIST DIALOG MODAL ── */}
      <AnimatePresence>
        {auditLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuditLogModalOpen(false)}
              className="absolute inset-0 bg-[#0C0C0F]/65 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.97 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-white border border-[#E8E7E2] shadow-2xl rounded-xl flex flex-col overflow-hidden text-[#1A1A1E]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#E8E7E2] bg-[#FAF9F6] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-200">
                    <History className="size-4.5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-neutral-900 font-syne tracking-wider uppercase">System Audit Log History</h2>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Sequential logging registry records</p>
                  </div>
                </div>
                <button
                  onClick={() => setAuditLogModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-[#E8E7E2] hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-all cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Filters Panel */}
              <div className="px-6 py-4 border-b border-[#E8E7E2] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-[#FAF9F6]/50">
                <div className="flex bg-neutral-100 p-1 border border-neutral-200 rounded-lg gap-1 w-full sm:w-auto font-mono text-[9px] font-bold">
                  {["all", "inquiry", "subscriber"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAuditLogTab(tab as any)}
                      className={cn(
                        "h-7 px-3.5 rounded capitalize transition-all cursor-pointer",
                        auditLogTab === tab
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter audit logs..."
                    value={auditLogSearch}
                    onChange={(e) => setAuditLogSearch(e.target.value)}
                    className="w-full h-9 bg-white border border-[#E8E7E2] rounded-lg pl-9 pr-4 text-[10px] text-neutral-900 placeholder-neutral-400 outline-none focus:border-orange-500/50 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Log List View */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {activityFeedAll
                    .filter(item => auditLogTab === "all" || item.type === auditLogTab)
                    .filter(item => 
                      item.label.toLowerCase().includes(auditLogSearch.toLowerCase()) || 
                      item.sublabel.toLowerCase().includes(auditLogSearch.toLowerCase())
                    )
                    .map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-[#FAF9F6] border-b border-neutral-100 last:border-0 transition-colors">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-[10px] font-black border",
                          item.action === "+1"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : "bg-red-50 border-red-100 text-red-500"
                        )}>
                          {item.action}
                        </div>

                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border",
                          item.type === "inquiry"
                            ? "bg-orange-50 border-orange-100"
                            : "bg-indigo-50 border-indigo-100"
                        )}>
                          {item.type === "inquiry" 
                            ? <MessageSquarePlus className="size-3.5 text-orange-600" />
                            : <UserPlus className="size-3.5 text-indigo-600" />
                          }
                        </div>

                        <div className="flex-1 min-w-0 font-mono text-xs">
                          <p className="font-bold text-neutral-900 truncate leading-none select-text">
                            {item.label}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-[9px] text-neutral-400">
                            <span className="truncate select-text">{item.sublabel}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-200" />
                            <span className="uppercase font-bold tracking-wider">{item.type}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-mono text-[9px] text-neutral-400">
                          <p className="font-bold text-neutral-700">{item.rawDate.toLocaleDateString("en-IN")}</p>
                          <p className="mt-0.5">{item.rawDate.toLocaleTimeString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  
                  {activityFeedAll.filter(item => auditLogTab === "all" || item.type === auditLogTab).filter(item => item.label.toLowerCase().includes(auditLogSearch.toLowerCase()) || item.sublabel.toLowerCase().includes(auditLogSearch.toLowerCase())).length === 0 && (
                    <div className="py-12 text-center text-neutral-400">
                      <History className="size-8 mx-auto mb-2 text-neutral-300" />
                      <p className="text-xs font-mono uppercase tracking-wider">No sequential logs mapped</p>
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

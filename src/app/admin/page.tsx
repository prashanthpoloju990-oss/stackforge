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
  Copy
} from "lucide-react";
import Image from "next/image";

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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Data state
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeTab, setActiveTab] = useState<"inquiries" | "subscribers">("inquiries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactSubmission | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("admin_password");
    if (savedPassword) {
      verifyAndFetch(savedPassword);
    }
  }, []);

  async function verifyAndFetch(passToVerify: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "GET",
        headers: {
          "x-admin-password": passToVerify,
        },
      });

      if (!res.ok) {
        throw new Error("Invalid password");
      }

      const data = await res.json();
      setInquiries(data.inquiries || []);
      setSubscribers(data.subscribers || []);
      sessionStorage.setItem("admin_password", passToVerify);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
      sessionStorage.removeItem("admin_password");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    verifyAndFetch(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_password");
    setIsAuthenticated(false);
    setInquiries([]);
    setSubscribers([]);
    setPassword("");
  };

  const handleDelete = async (type: "inquiry" | "subscriber", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type === "inquiry" ? "inquiry" : "subscriber"}?`)) {
      return;
    }

    const savedPassword = sessionStorage.getItem("admin_password") || "";
    try {
      const res = await fetch(`/api/admin?type=${type}&id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": savedPassword,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      // Refresh local state
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

  // Compute Pipeline stats
  const stats = useMemo(() => {
    let totalInquiriesCount = inquiries.length;
    let totalSubscribersCount = subscribers.length;
    
    // Parse budgets to estimate minimum value
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
      pipelineBudget: pipelineVal.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }),
    };
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

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07080b] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Decorative subtle background gradients */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-forge-accent/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[420px] bg-[#0c0d12]/90 border border-[#1b1c24] rounded-2xl p-8 shadow-2xl backdrop-blur-md relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-forge-accent/10 border border-forge-accent/30 flex items-center justify-center">
                <FolderGit2 className="size-6 text-forge-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-syne uppercase">
              StackForge Studio
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1.5 font-mono">
              CLIENT INQUIRIES & MARKETING DATABASE
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#a1a1aa] block font-semibold mb-2 font-mono">
                Admin Security Key
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-[#111218] border border-[#1b1c24] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4e4f5a] outline-none focus:border-forge-accent/50 focus:ring-1 focus:ring-forge-accent/20 transition-all font-mono"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-mono text-center bg-red-950/20 border border-red-900/30 py-2.5 rounded-lg">
                ❌ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-forge-accent hover:bg-forge-accent/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-forge-accent/15"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Unlock Database</span>
                  <ChevronRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080b] text-white flex flex-col font-sans relative overflow-hidden pb-12">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-forge-accent/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/[0.02] blur-[150px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-[#1b1c24] bg-[#0c0d12]/80 backdrop-blur-md sticky top-0 z-30 px-6 md:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image 
            src="/stackforge-logo.jpg" 
            alt="StackForge Logo" 
            width={32} 
            height={32} 
            className="rounded object-contain border border-[#1b1c24]" 
          />
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase font-syne">
              StackForge Admin
            </h1>
            <p className="text-[9px] text-[#a1a1aa] font-mono leading-none">
              Console v1.0.0
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="h-8 px-3 rounded-lg border border-[#1b1c24] bg-[#111218] text-xs font-semibold hover:border-red-500/50 hover:bg-red-950/15 hover:text-red-400 transition-all flex items-center gap-1.5 cursor-pointer font-mono"
        >
          <LogOut className="size-3.5" />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 mt-8 flex-1 flex flex-col">
        {/* Telemetry Stats Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Widget 1: Project Pipeline */}
          <div className="border border-[#1b1c24] bg-[#0c0d12]/50 p-6 rounded-xl relative overflow-hidden flex items-center justify-between group hover:border-[#2b2c34] transition-all">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#a1a1aa]">
                Est. Pipeline Value
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-mono">
                {stats.pipelineBudget}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <DollarSign className="size-5 text-green-400" />
            </div>
          </div>

          {/* Widget 2: Total Inquiries */}
          <div className="border border-[#1b1c24] bg-[#0c0d12]/50 p-6 rounded-xl relative overflow-hidden flex items-center justify-between group hover:border-[#2b2c34] transition-all">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#a1a1aa]">
                Total Project Inquiries
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-mono">
                {stats.inquiriesCount}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-forge-accent/10 border border-forge-accent/20 flex items-center justify-center">
              <FolderGit2 className="size-5 text-forge-accent" />
            </div>
          </div>

          {/* Widget 3: Newsletter subscribers */}
          <div className="border border-[#1b1c24] bg-[#0c0d12]/50 p-6 rounded-xl relative overflow-hidden flex items-center justify-between group hover:border-[#2b2c34] transition-all">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#a1a1aa]">
                Newsletter Subscribers
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-mono">
                {stats.subscribersCount}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="size-5 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Tab Controls & Filters Row */}
        <div className="border-b border-[#1b1c24] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab("inquiries");
                setSearchQuery("");
              }}
              className={cn(
                "h-9 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border",
                activeTab === "inquiries"
                  ? "bg-forge-accent border-forge-accent text-white shadow-md shadow-forge-accent/15"
                  : "bg-[#111218] border-[#1b1c24] text-[#a1a1aa] hover:text-white"
              )}
            >
              Project Inquiries ({filteredInquiries.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("subscribers");
                setSearchQuery("");
              }}
              className={cn(
                "h-9 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border",
                activeTab === "subscribers"
                  ? "bg-forge-accent border-forge-accent text-white shadow-md shadow-forge-accent/15"
                  : "bg-[#111218] border-[#1b1c24] text-[#a1a1aa] hover:text-white"
              )}
            >
              Subscribers ({filteredSubscribers.length})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === "subscribers" && subscribers.length > 0 && (
              <button
                onClick={copyEmailsList}
                className="h-9 px-3.5 bg-[#111218] border border-[#1b1c24] text-xs font-semibold rounded-lg hover:border-forge-accent/40 text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-mono shrink-0"
              >
                {copiedAll ? <ClipboardCheck className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
                <span>{copiedAll ? "Copied!" : "Copy All Emails"}</span>
              </button>
            )}

            <div className="relative w-full sm:w-[240px]">
              <Search className="size-3.5 text-[#4e4f5a] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={activeTab === "inquiries" ? "Search inquiries..." : "Search emails..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-[#111218] border border-[#1b1c24] rounded-lg pl-9 pr-4 text-xs text-white placeholder-[#4e4f5a] outline-none focus:border-forge-accent/40 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 mt-6">
          {activeTab === "inquiries" ? (
            /* Inquiries List View */
            filteredInquiries.length === 0 ? (
              <div className="border border-dashed border-[#1b1c24] rounded-xl p-12 text-center text-[#4e4f5a]">
                <FolderGit2 className="size-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-mono">No submissions found matching filter query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="border border-[#1b1c24] bg-[#0c0d12]/40 rounded-xl p-5 hover:border-forge-accent/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3.5">
                        <div>
                          <h3 className="font-bold text-white font-syne text-[14px]">
                            {inquiry.name}
                          </h3>
                          <a 
                            href={inquiry.contact.includes("@") ? `mailto:${inquiry.contact}` : `https://wa.me/${inquiry.contact.replace(/[^\d+]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#a1a1aa] hover:text-forge-accent transition-colors font-mono block mt-0.5 break-all"
                          >
                            {inquiry.contact}
                          </a>
                        </div>
                        <span className="text-[9px] text-[#4e4f5a] font-mono border border-[#1b1c24] px-2 py-0.5 rounded">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Meta Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {inquiry.serviceNeed && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-forge-accent/10 border border-forge-accent/20 text-forge-accent uppercase font-mono">
                            {inquiry.serviceNeed}
                          </span>
                        )}
                        {inquiry.businessType && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[#111218] border border-[#1b1c24] text-[#a1a1aa] font-mono">
                            {inquiry.businessType}
                          </span>
                        )}
                        {inquiry.budget && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-mono">
                            {inquiry.budget}
                          </span>
                        )}
                      </div>

                      {/* Short excerpt of details */}
                      <p className="text-[12px] text-[#a1a1aa]/80 line-clamp-3 leading-relaxed mb-4">
                        {inquiry.details || "No project specification details provided."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#1b1c24]/50 flex items-center justify-between mt-auto">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="h-8 px-3 rounded-lg bg-[#111218] border border-[#1b1c24] hover:border-forge-accent/40 text-xs font-semibold text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-mono"
                      >
                        <Eye className="size-3.5" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => handleDelete("inquiry", inquiry.id)}
                        className="w-8 h-8 rounded-lg bg-red-950/10 border border-red-900/20 hover:border-red-500/50 flex items-center justify-center text-red-400/80 hover:text-red-400 transition-all cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Newsletter Subscribers list */
            filteredSubscribers.length === 0 ? (
              <div className="border border-dashed border-[#1b1c24] rounded-xl p-12 text-center text-[#4e4f5a]">
                <Users className="size-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-mono">No subscribers found matching filter query.</p>
              </div>
            ) : (
              <div className="border border-[#1b1c24] bg-[#0c0d12]/40 rounded-xl overflow-hidden">
                <table className="w-full border-collapse text-left text-xs text-[#a1a1aa]">
                  <thead className="bg-[#111218] border-b border-[#1b1c24] font-mono text-[10px] text-white uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Subscriber Email</th>
                      <th className="px-6 py-4 font-semibold">Joined Date</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b1c24]/50 font-mono">
                    {filteredSubscribers.map((subscriber, idx) => (
                      <tr key={subscriber.id} className="hover:bg-[#111218]/40 transition-colors">
                        <td className="px-6 py-4 text-white text-sm">
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
                            className="h-7 px-2.5 bg-[#111218] border border-[#1b1c24] hover:border-forge-accent/40 rounded text-[10px] font-semibold text-[#a1a1aa] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                          >
                            {copiedIndex === idx ? <ClipboardCheck className="size-3 text-green-400" /> : <Copy className="size-3" />}
                            <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                          </button>
                          <button
                            onClick={() => handleDelete("subscriber", subscriber.id)}
                            className="w-7 h-7 bg-red-950/10 border border-red-900/20 hover:border-red-500/50 rounded flex items-center justify-center text-red-400/80 hover:text-red-400 transition-all cursor-pointer"
                            title="Delete Subscriber"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>

      {/* Inquiry Detail Overlay Modal Drawer */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4">
          <div className="w-full sm:max-w-[600px] h-full sm:h-[calc(100vh-2rem)] bg-[#0c0d12] border-l sm:border border-[#1b1c24] sm:rounded-2xl shadow-2xl flex flex-col justify-between relative overflow-hidden animate-in slide-in-from-right duration-350">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#1b1c24] bg-[#111218] flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-forge-accent font-bold">
                  Inquiry Details
                </span>
                <h2 className="text-lg font-bold text-white font-syne leading-tight mt-0.5">
                  {selectedInquiry.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="h-8 w-8 rounded-lg border border-[#1b1c24] bg-[#111218] hover:border-forge-accent/40 text-xs font-semibold text-[#a1a1aa] hover:text-white transition-all flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Primary fields grid */}
              <div className="grid grid-cols-2 gap-4 border border-[#1b1c24] bg-[#111218]/40 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-[#4e4f5a] font-mono block">Contact Details</span>
                  <a
                    href={selectedInquiry.contact.includes("@") ? `mailto:${selectedInquiry.contact}` : `https://wa.me/${selectedInquiry.contact.replace(/[^\d+]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white hover:text-forge-accent font-mono inline-flex items-center gap-1 mt-1 break-all"
                  >
                    <span>{selectedInquiry.contact}</span>
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-[#4e4f5a] font-mono block">Submission Date</span>
                  <span className="text-xs text-white font-mono mt-1 block">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#4e4f5a] font-mono block">Business Type</span>
                  <span className="text-xs text-white font-semibold mt-1 block">
                    {selectedInquiry.businessType || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#4e4f5a] font-mono block">Service Needed</span>
                  <span className="text-xs text-forge-accent font-semibold mt-1 block uppercase">
                    {selectedInquiry.serviceNeed || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#4e4f5a] font-mono block">Budget Range</span>
                  <span className="text-xs text-green-400 font-semibold mt-1 block font-mono">
                    {selectedInquiry.budget || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#4e4f5a] font-mono block">Timeline</span>
                  <span className="text-xs text-white font-semibold mt-1 block">
                    {selectedInquiry.timeline || "Not specified"}
                  </span>
                </div>
                {selectedInquiry.pageCount && (
                  <div>
                    <span className="text-[10px] text-[#4e4f5a] font-mono block">Estimated Pages</span>
                    <span className="text-xs text-white font-semibold mt-1 block font-mono">
                      {selectedInquiry.pageCount} pages
                    </span>
                  </div>
                )}
              </div>

              {/* Selected Features */}
              {selectedInquiry.features && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-mono tracking-wider text-[#a1a1aa] font-semibold">
                    Requested Add-on Features
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {parseFeatures(selectedInquiry.features).map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#111218] border border-[#1b1c24] text-white/90 font-mono uppercase"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              {selectedInquiry.attachments && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-mono tracking-wider text-[#a1a1aa] font-semibold">
                    File Attachments (OQENS Storage)
                  </h3>
                  <div className="space-y-1.5">
                    {parseAttachments(selectedInquiry.attachments).map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between border border-[#1b1c24] bg-[#111218]/60 px-4 py-2.5 rounded-lg text-xs hover:border-forge-accent/40 text-white/95 transition-all"
                      >
                        <span className="truncate pr-4 font-mono">{file.name}</span>
                        <div className="flex items-center gap-1.5 text-forge-accent font-semibold text-[10px] uppercase font-mono shrink-0">
                          <span>Download</span>
                          <FileDown className="size-3.5" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Project details text area */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-mono tracking-wider text-[#a1a1aa] font-semibold">
                  Detailed Project Specification
                </h3>
                <div className="border border-[#1b1c24] bg-[#111218]/30 rounded-xl p-4 text-xs text-white/80 leading-relaxed white-space-pre-wrap max-h-[300px] overflow-y-auto">
                  {selectedInquiry.details || "No additional project details were provided by the client."}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#1b1c24] bg-[#111218] flex items-center justify-between">
              <a
                href={selectedInquiry.contact.includes("@") ? `mailto:${selectedInquiry.contact}` : `https://wa.me/${selectedInquiry.contact.replace(/[^\d+]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-5 bg-forge-accent hover:bg-forge-accent/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-forge-accent/15"
              >
                <span>Reply to Client</span>
                <ExternalLink className="size-3.5" />
              </a>

              <button
                onClick={() => handleDelete("inquiry", selectedInquiry.id)}
                className="h-10 px-4 rounded-lg bg-red-950/20 border border-red-900/30 hover:border-red-500/50 text-red-400 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer font-mono"
              >
                <Trash2 className="size-3.5" />
                <span>Delete inquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

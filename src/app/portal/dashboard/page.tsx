"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  FolderGit2, 
  ExternalLink, 
  LogOut, 
  Calendar, 
  Layers, 
  Activity, 
  FileText,
  Figma,
  Globe,
  MessageSquare,
  Sparkles,
  ClipboardList,
  ChevronRight,
  Flame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseClient } from "@/lib/supabase-client";

interface Project {
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
  status: string; // 'pending' | 'contacted' | 'design' | 'development' | 'testing' | 'completed' | 'archived'
  progress: number;
  figmaLink: string | null;
  stagingLink: string | null;
  clientNotes: string | null;
  createdAt: string;
}

const STATUS_PIPELINE = [
  { key: "pending", label: "Inquiry Received", desc: "We're reviewing your specs" },
  { key: "contacted", label: "Consultation", desc: "Aligning on goals & details" },
  { key: "design", label: "UI/UX Design", desc: "Crafting layouts & mockups" },
  { key: "development", label: "Development", desc: "Engineering clean Next.js code" },
  { key: "completed", label: "Live / Shipped", desc: "Launched & fully optimized" }
];

function getStatusIndex(status: string): number {
  switch (status) {
    case "pending": return 0;
    case "contacted": return 1;
    case "design": return 2;
    case "development": 
    case "testing": return 3;
    case "completed": return 4;
    case "archived": return -1;
    default: return 0;
  }
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [clientEmail, setClientEmail] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/portal/data");
      if (!res.ok) {
        router.push("/portal");
        return;
      }
      const data = await res.json();
      setClientEmail(data.email || "");
      const activeProjects = data.projects || [];
      setProjects(activeProjects);
      
      if (activeProjects.length > 0) {
        setSelectedProjectId(activeProjects[0].id);
      }
    } catch (err) {
      router.push("/portal");
    } finally {
      setLoading(false);
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchDashboardData();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Subscribe to real-time changes
  useEffect(() => {
    if (!clientEmail) return;

    const channel = supabaseClient
      .channel("portal-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ContactSubmission" },
        (payload) => {
          console.log("[REALTIME-PORTAL] ContactSubmission event received:", payload);
          if (payload.eventType === "UPDATE") {
            const updatedProject = payload.new as Project;
            if (updatedProject.contact && updatedProject.contact.toLowerCase() === clientEmail.toLowerCase()) {
              setProjects((prev) =>
                prev.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p))
              );
            }
          } else if (payload.eventType === "INSERT") {
            const newProject = payload.new as Project;
            if (newProject.contact && newProject.contact.toLowerCase() === clientEmail.toLowerCase()) {
              setProjects((prev) => {
                if (prev.some((p) => p.id === newProject.id)) return prev;
                return [...prev, newProject];
              });
              setSelectedProjectId((prev) => prev || newProject.id);
            }
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as any).id;
            setProjects((prev) => prev.filter((p) => p.id !== deletedId));
            setSelectedProjectId((prev) => (prev === deletedId ? null : prev));
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [clientEmail]);

  const handleLogout = async () => {
    try {
      await fetch("/api/portal/logout", { method: "POST" });
      router.push("/portal");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;
  const statusIndex = selectedProject ? getStatusIndex(selectedProject.status || "pending") : -1;

  const parseAttachments = (attachmentsStr: string | null) => {
    if (!attachmentsStr) return [];
    try {
      return JSON.parse(attachmentsStr) as Array<{ name: string; url: string }>;
    } catch {
      return [];
    }
  };

  const parseFeatures = (featuresStr: string | null) => {
    if (!featuresStr) return [];
    return featuresStr.split(",").map(f => f.trim()).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0F] flex flex-col items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase animate-pulse">
            Syncing Portal Data...
          </p>
        </div>
      </div>
    );
  }

  // ── CLIENT PORTAL DASHBOARD REDESIGN (SPLIT-PANE LAYOUT) ──
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1E] font-sans flex overflow-hidden">
      
      {/* ── Left Sidebar (Dark Charcoal #0C0C0F Sidebar) ── */}
      <aside className="w-[260px] bg-[#0C0C0F] text-white flex flex-col justify-between shrink-0 border-r border-white/[0.04] z-20">
        <div>
          {/* Logo brand strip */}
          <div className="p-6 border-b border-white/[0.04] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center">
              <Flame className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-[0.25em] uppercase font-syne leading-none text-white">
                StackForge
              </h2>
              <span className="text-[7.5px] font-mono text-neutral-500 tracking-wider uppercase block mt-1">
                Client Dashboard
              </span>
            </div>
          </div>

          {/* Project List */}
          <div className="p-4 space-y-4">
            <h3 className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold font-mono px-2">
              Your Submissions ({projects.length})
            </h3>
            
            {projects.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 font-mono text-[10px]">
                No projects registered
              </div>
            ) : (
              <div className="space-y-1">
                {projects.map((project) => {
                  const isActive = project.id === selectedProjectId;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={cn(
                        "w-full text-left p-3.5 rounded-lg border transition-all flex flex-col gap-1.5 cursor-pointer font-mono",
                        isActive
                          ? "bg-white/[0.04] border-white/[0.08] text-white"
                          : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                      )}
                    >
                      <div className="flex justify-between items-baseline w-full">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-orange-500 truncate max-w-[65%]">
                          {project.serviceNeed || "General Inquiry"}
                        </span>
                        <span className="text-[8px] text-neutral-500 shrink-0">
                          {new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold truncate">{project.name}</h4>
                      
                      <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 mt-1">
                        <span className={cn(
                          "w-1 h-1 rounded-full",
                          (project.status || "pending") === "completed" ? "bg-green-500" :
                          (project.status || "pending") === "development" ? "bg-orange-500" :
                          (project.status || "pending") === "design" ? "bg-purple-500" : "bg-neutral-500"
                        )} />
                        <span className="capitalize">
                          {(project.status || "pending") === "pending" ? "Received" : project.status}
                        </span>
                        <span>·</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.04] space-y-4 bg-black/20 font-mono">
          <div className="px-2 truncate">
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest block">Client Profile</span>
            <span className="text-[10px] text-neutral-300 font-bold block mt-1 truncate" title={clientEmail}>
              {clientEmail}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-9 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] text-neutral-400 hover:text-white text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="size-3" />
            <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* ── Right Workspace Content Zone ── */}
      <section className="flex-1 bg-[#FAF9F6] flex flex-col overflow-hidden relative">
        <div className="grain-overlay opacity-[0.035] pointer-events-none" aria-hidden="true" />

        {/* Header strip */}
        <header className="h-16 border-b border-[#E8E7E2] px-8 flex items-center justify-between z-10 shrink-0 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[10px] uppercase font-bold text-neutral-400">client portal</span>
            <ChevronRight className="size-3 text-neutral-300" />
            <span className="text-[10px] uppercase font-bold text-neutral-900 tracking-wider">
              workspace
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Real-time channel synced</span>
          </div>
        </header>

        {/* Viewport content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 relative max-w-[1280px] w-full mx-auto">
          {projects.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center border border-dashed border-[#E8E7E2] rounded-xl bg-white/20 p-8">
              <FolderGit2 className="size-10 text-neutral-300 mb-3" />
              <h3 className="text-sm font-extrabold font-syne uppercase tracking-wider text-neutral-800">No Active Inquiries</h3>
              <p className="text-neutral-500 text-xs mt-1.5 text-center max-w-[300px] font-mono leading-relaxed">
                We couldn't locate any inquiries. If you recently sent one, it may take a few minutes to register.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {selectedProject && (
                <>
                  {/* Status Banner Board */}
                  <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 md:p-8 shadow-sm space-y-8 relative">
                    <div className="absolute top-6 right-6 font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                      spec id: {selectedProject.id.split("_")[1] || selectedProject.id.slice(0, 8)}
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-orange-600 uppercase font-black tracking-widest block mb-1">
                        Active Project Specs
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-neutral-950 font-syne tracking-tight leading-tight select-text">
                        {selectedProject.serviceNeed || "Bespoke System"}
                        {selectedProject.businessType && (
                          <span className="text-xs font-mono text-neutral-400 font-normal ml-2">({selectedProject.businessType})</span>
                        )}
                      </h2>
                    </div>

                    {/* Status Pipeline Grid */}
                    {(selectedProject.status || "pending") === "archived" ? (
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-center font-mono text-neutral-500 text-xs">
                        This project record has been archived.
                      </div>
                    ) : (
                      <div className="pt-4">
                        {/* Desktop Pipeline (Horizontal) */}
                        <div className="hidden md:grid grid-cols-5 gap-4 relative">
                          <div className="absolute top-4 left-8 right-8 h-0.5 bg-neutral-100 -z-10" />
                          <div 
                            className="absolute top-4 left-8 h-0.5 bg-orange-500 transition-all duration-700 -z-10 origin-left"
                            style={{ width: `${Math.max(0, Math.min(100, (statusIndex / 4) * 100)) - 10}%` }}
                          />

                          {STATUS_PIPELINE.map((step, idx) => {
                            const isDone = idx < statusIndex;
                            const isCurrent = idx === statusIndex;
                            return (
                              <div key={step.key} className="text-center flex flex-col items-center select-none">
                                <div className={cn(
                                  "w-8.5 h-8.5 rounded-full flex items-center justify-center font-mono font-bold text-xs border transition-all duration-500",
                                  isDone ? "bg-orange-600 border-orange-600 text-white shadow-sm shadow-orange-600/10" :
                                  isCurrent ? "bg-orange-50 border-orange-500 text-orange-600 font-black animate-pulse" :
                                  "bg-white border-neutral-200 text-neutral-400"
                                )}>
                                  {idx + 1}
                                </div>
                                <span className={cn(
                                  "text-[11px] font-bold mt-2.5 block tracking-tight font-syne",
                                  isCurrent ? "text-orange-600" : isDone ? "text-neutral-800" : "text-neutral-400"
                                )}>
                                  {step.label}
                                </span>
                                <span className="text-[8px] text-neutral-400 mt-0.5 block font-mono px-2 leading-tight">
                                  {step.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Mobile Pipeline (Vertical) */}
                        <div className="md:hidden flex flex-col gap-6 relative pl-7 border-l border-neutral-200 select-none">
                          {STATUS_PIPELINE.map((step, idx) => {
                            const isDone = idx < statusIndex;
                            const isCurrent = idx === statusIndex;
                            return (
                              <div key={step.key} className="relative flex flex-col gap-0.5">
                                <div className={cn(
                                  "absolute -left-[35px] top-0.5 w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] border",
                                  isDone ? "bg-orange-600 border-orange-600 text-white" :
                                  isCurrent ? "bg-orange-50 border-orange-500 text-orange-600" :
                                  "bg-white border-neutral-200 text-neutral-400"
                                )}>
                                  {idx + 1}
                                </div>
                                <span className={cn(
                                  "text-xs font-bold tracking-tight font-syne",
                                  isCurrent ? "text-orange-600" : isDone ? "text-neutral-800" : "text-neutral-400"
                                )}>
                                  {step.label}
                                </span>
                                <span className="text-[9px] text-neutral-400 font-mono">
                                  {step.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="pt-6 border-t border-[#F2F1EC] select-none">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono text-neutral-400">Framework Milestone Weight</span>
                        <span className="text-xs font-black font-mono text-orange-600">{selectedProject.progress || 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedProject.progress || 0}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-orange-600 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details Split Column */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Operations Log updates */}
                    <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
                      <div className="flex items-center gap-2 text-orange-600 mb-4 select-none">
                        <MessageSquare className="size-4 shrink-0" />
                        <h4 className="text-[10px] font-mono uppercase tracking-widest font-black">Latest Operational Log</h4>
                      </div>
                      <div className="flex-1 bg-[#FAF9F6] border border-[#EBEAE6] p-5 rounded-xl text-xs leading-relaxed text-neutral-700 font-mono whitespace-pre-wrap select-text min-h-[160px]">
                        {selectedProject.clientNotes || 
                          `Your specification payload has been loaded into database registries.\n\nOur studio engineers are analyzing the design materials. A lead engineer will coordinate a launch roadmap with you shortly.`
                        }
                      </div>
                    </div>

                    {/* Workspace Assets */}
                    <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 shadow-sm space-y-6">
                      <div className="flex items-center gap-2 text-neutral-400 mb-2 select-none">
                        <Layers className="size-4 shrink-0 text-orange-500" />
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-900 font-bold">Workspace Nodes</h4>
                      </div>

                      <div className="space-y-3 font-mono">
                        <h5 className="text-[9px] uppercase tracking-widest text-neutral-400 block font-bold">Live Environments</h5>
                        
                        {/* Figma Link */}
                        <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E8E7E2] bg-[#FAF9F6]/30 hover:bg-[#FAF9F6]/80 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="size-7 rounded bg-pink-50 flex items-center justify-center border border-pink-100">
                              <Figma className="size-3.5 text-pink-500" />
                            </div>
                            <div>
                              <span className="text-[11px] font-bold block text-neutral-900">Design Board</span>
                              <span className="text-[8px] text-neutral-400 leading-none">Figma Layout Proto</span>
                            </div>
                          </div>
                          {selectedProject.figmaLink ? (
                            <a 
                              href={selectedProject.figmaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-orange-600 hover:underline flex items-center gap-1 font-bold"
                            >
                              <span>Open Board</span>
                              <ExternalLink className="size-3" />
                            </a>
                          ) : (
                            <span className="text-[9px] text-neutral-400">Pending Setup</span>
                          )}
                        </div>

                        {/* Staging URL */}
                        <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E8E7E2] bg-[#FAF9F6]/30 hover:bg-[#FAF9F6]/80 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="size-7 rounded bg-emerald-50 flex items-center justify-center border border-emerald-100">
                              <Globe className="size-3.5 text-emerald-600" />
                            </div>
                            <div>
                              <span className="text-[11px] font-bold block text-neutral-900">Staging Server</span>
                              <span className="text-[8px] text-neutral-400 leading-none">Live preview build</span>
                            </div>
                          </div>
                          {selectedProject.stagingLink ? (
                            <a 
                              href={selectedProject.stagingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-orange-600 hover:underline flex items-center gap-1 font-bold"
                            >
                              <span>Visit Staging</span>
                              <ExternalLink className="size-3" />
                            </a>
                          ) : (
                            <span className="text-[9px] text-neutral-400">Pending Deploy</span>
                          )}
                        </div>
                      </div>

                      {/* Attachments list */}
                      <div className="space-y-3 pt-4 border-t border-[#F2F1EC] font-mono">
                        <h5 className="text-[9px] uppercase tracking-widest text-neutral-400 block font-bold">Specs Assets</h5>
                        {parseAttachments(selectedProject.attachments).length === 0 ? (
                          <p className="text-[9px] text-neutral-400 italic">No assets attached to inquiry.</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 max-h-[120px] overflow-y-auto pr-1">
                            {parseAttachments(selectedProject.attachments).map((file, idx) => (
                              <a
                                key={idx}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 rounded border border-[#E8E7E2] hover:border-orange-500/25 bg-white text-neutral-700 hover:text-neutral-900 text-[10px] transition-all shadow-sm"
                              >
                                <div className="flex items-center gap-2 truncate pr-4">
                                  <FileText className="size-3.5 text-orange-500 shrink-0" />
                                  <span className="truncate">{file.name}</span>
                                </div>
                                <ExternalLink className="size-3 text-neutral-400 shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Technical Specs board */}
                  <div className="bg-white border border-[#E8E7E2] rounded-xl p-6 md:p-8 space-y-6 select-text shadow-sm">
                    <div className="flex items-center gap-2 select-none">
                      <ClipboardList className="size-4 text-orange-500 shrink-0" />
                      <h4 className="text-[10px] font-mono uppercase tracking-widest font-black text-neutral-900">
                        Technical Registry Specs
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 font-mono text-xs leading-relaxed border-b border-[#F2F1EC] pb-6">
                      <div className="space-y-1">
                        <span className="text-neutral-400 uppercase text-[8px] block font-bold">Service Category</span>
                        <span className="text-neutral-900 font-bold">{selectedProject.serviceNeed || "N/A"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 uppercase text-[8px] block font-bold">Budget Tier</span>
                        <span className="text-neutral-900 font-bold">{selectedProject.budget || "N/A"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 uppercase text-[8px] block font-bold">Target Timeline</span>
                        <span className="text-neutral-900 font-bold">{selectedProject.timeline || "N/A"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 uppercase text-[8px] block font-bold">Estimated Pages</span>
                        <span className="text-neutral-900 font-bold">{selectedProject.pageCount || "Single Page / Landing"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 uppercase text-[8px] block font-bold">Registered Contact</span>
                        <span className="text-neutral-900 font-bold truncate block">{selectedProject.contact}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 uppercase text-[8px] block font-bold">Registration Date</span>
                        <span className="text-neutral-900 font-bold">
                          {new Date(selectedProject.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </span>
                      </div>
                    </div>

                    {/* Technical add-ons */}
                    <div className="space-y-3 pb-6 border-b border-[#F2F1EC]">
                      <h5 className="text-[9px] uppercase tracking-widest text-neutral-400 block font-mono font-bold select-none">Scope Integrations</h5>
                      {parseFeatures(selectedProject.features).length === 0 ? (
                        <p className="text-[10px] font-mono text-neutral-400 italic">No integrations specified.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2 select-none">
                          {parseFeatures(selectedProject.features).map((feature) => (
                            <span 
                              key={feature} 
                              className="px-2.5 py-1 rounded bg-[#FAF9F6] border border-[#E8E7E2] text-neutral-800 text-[9px] font-bold font-mono uppercase tracking-wider"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Requirements summary */}
                    <div className="space-y-2 font-mono text-xs">
                      <h5 className="text-[9px] uppercase tracking-widest text-neutral-400 block font-bold select-none">Requirements Details</h5>
                      <p className="text-neutral-500 leading-relaxed whitespace-pre-wrap pl-1 font-mono">
                        {selectedProject.details || "No requirements text uploaded."}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <footer className="py-6 border-t border-[#E8E7E2] bg-white/20 text-center select-none text-[9px] font-mono text-neutral-400 shrink-0">
          StackForge Portal Registry · secure encryption TLS 1.3 · session cookie HttpOnly
        </footer>
      </section>

    </div>
  );
}

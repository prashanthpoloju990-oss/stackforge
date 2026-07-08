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
  ClipboardList
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
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, []);

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
      <div className="min-h-screen bg-[#030306] flex flex-col items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-forge-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-[#a1a1aa] uppercase animate-pulse">
            Syncing Portal Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030306] text-white font-sans overflow-x-hidden relative flex flex-col">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-forge-accent/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.02] blur-[150px] pointer-events-none" />

      {/* Grain overlay */}
      <div className="grain-overlay opacity-25" aria-hidden="true" />

      {/* ── Navbar Header ── */}
      <header className="sticky top-0 z-40 bg-[#040407]/75 backdrop-blur-md border-b border-white/[0.05] select-none">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forge-accent/15 border border-forge-accent/30 flex items-center justify-center">
              <Sparkles className="size-4 text-forge-accent" />
            </div>
            <div>
              <span className="text-sm font-black tracking-widest uppercase font-syne">StackForge</span>
              <span className="text-[8px] font-mono text-[#a1a1aa] tracking-widest uppercase block -mt-0.5">Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-xs font-mono text-slate-400 truncate max-w-[140px] sm:max-w-none">
              Client: <span className="text-white font-medium">{clientEmail}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 text-slate-400 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 touch-manipulation shrink-0"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Exit Portal</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ── */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 md:py-12 relative z-10">
        {projects.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-8 bg-white/[0.01]">
            <FolderGit2 className="size-12 text-slate-600 mb-4" />
            <h2 className="text-lg font-bold font-syne">No Active Inquiries</h2>
            <p className="text-slate-500 text-xs mt-1.5 text-center max-w-[320px] font-mono">
              We couldn't locate any inquiries. If you recently sent one, it may take a few minutes to register.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            
            {/* Sidebar — Inquiry Selection List */}
            <aside className="space-y-4">
              <h2 className="text-[10px] uppercase tracking-widest text-[#a1a1aa] font-bold font-mono px-1">
                Your Projects ({projects.length})
              </h2>
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 pb-2 lg:pb-0 scrollbar-none scroll-smooth snap-x snap-mandatory lg:snap-none relative">
                {projects.map((project) => {
                  const isActive = project.id === selectedProjectId;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all shrink-0 flex flex-col gap-2 min-w-[240px] lg:min-w-0 select-none",
                        isActive
                          ? "bg-white/[0.04] border-forge-accent/40 shadow-lg"
                          : "bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.02]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider",
                          isActive ? "bg-forge-accent text-white" : "bg-white/10 text-slate-300"
                        )}>
                          {project.serviceNeed || "Project"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold truncate text-white">{project.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          (project.status || "pending") === "completed" ? "bg-green-500" :
                          (project.status || "pending") === "development" ? "bg-orange-500" :
                          (project.status || "pending") === "design" ? "bg-purple-500" : "bg-slate-500"
                        )} />
                        <span className="capitalize">{(project.status || "pending") === "pending" ? "Inquiry Review" : (project.status || "pending")}</span>
                        <span className="opacity-30">|</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Active Details Workspace */}
            <div className="space-y-8">
              {selectedProject && (
                <>
                  {/* Status Banner Card */}
                  <section className="bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.07] rounded-2xl p-6 md:p-8 relative">
                    <div className="absolute top-0 right-0 p-6 font-mono text-[9px] text-[#a1a1aa] tracking-widest uppercase">
                      Tracker ID: {selectedProject.id.slice(8)}
                    </div>
                    
                    <div className="mb-8">
                      <span className="text-[10px] text-forge-accent uppercase font-mono tracking-widest block mb-2">Project Phase</span>
                      <h2 className="text-xl md:text-2xl font-bold font-syne flex items-baseline gap-2">
                        {selectedProject.serviceNeed || "Bespoke Project"}
                        <span className="text-xs font-mono text-slate-400 font-medium">({selectedProject.businessType})</span>
                      </h2>
                    </div>

                    {/* ── Visual Pipeline ── */}
                    {(selectedProject.status || "pending") === "archived" ? (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center font-mono text-slate-400 text-xs">
                        This project record has been archived by the administrator.
                      </div>
                    ) : (
                      <div className="mt-8 select-none">
                        {/* Pipeline Track (Desktop layout) */}
                        <div className="hidden md:grid grid-cols-5 gap-4 relative mb-12">
                          {/* Connecting background progress line */}
                          <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/[0.06] -z-10" />
                          <div 
                            className="absolute top-5 left-8 h-0.5 bg-forge-accent transition-all duration-700 -z-10 origin-left"
                            style={{ width: `${Math.max(0, Math.min(100, (statusIndex / 4) * 100)) - 12}%` }}
                          />

                          {STATUS_PIPELINE.map((step, idx) => {
                            const isDone = idx < statusIndex;
                            const isCurrent = idx === statusIndex;
                            return (
                              <div key={step.key} className="text-center flex flex-col items-center">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 transition-all duration-500",
                                  isDone ? "bg-forge-accent border-forge-accent text-white shadow-[0_0_12px_rgba(255,106,0,0.4)]" :
                                  isCurrent ? "bg-forge-accent/20 border-forge-accent text-forge-accent animate-pulse" :
                                  "bg-[#0a0a0f] border-white/10 text-slate-500"
                                )}>
                                  {idx + 1}
                                </div>
                                <span className={cn(
                                  "text-xs font-bold mt-3 block",
                                  isCurrent ? "text-forge-accent" : isDone ? "text-white" : "text-slate-500"
                                )}>
                                  {step.label}
                                </span>
                                <span className="text-[9px] text-slate-500 mt-1 block font-mono px-2 leading-tight">
                                  {step.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Pipeline Track (Mobile layout) */}
                        <div className="md:hidden flex flex-col gap-6 relative pl-7 sm:pl-8 border-l border-white/[0.08]">
                          {STATUS_PIPELINE.map((step, idx) => {
                            const isDone = idx < statusIndex;
                            const isCurrent = idx === statusIndex;
                            return (
                              <div key={step.key} className="relative flex flex-col gap-1">
                                <div className={cn(
                                  "absolute -left-[37px] sm:-left-[45px] top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono font-bold text-[10px] sm:text-xs border-2",
                                  isDone ? "bg-forge-accent border-forge-accent text-white" :
                                  isCurrent ? "bg-forge-accent/20 border-forge-accent text-forge-accent" :
                                  "bg-[#0a0a0f] border-white/10 text-slate-500"
                                )}>
                                  {idx + 1}
                                </div>
                                <span className={cn(
                                  "text-xs font-bold",
                                  isCurrent ? "text-forge-accent" : isDone ? "text-white" : "text-slate-500"
                                )}>
                                  {step.label}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {step.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ── Progress Bar ── */}
                    <div className="mt-8 pt-6 border-t border-white/[0.05]">
                      <div className="flex justify-between items-center mb-2 select-none">
                        <span className="text-xs font-mono text-slate-400">Task Completion Weight</span>
                        <span className="text-sm font-black font-mono text-forge-accent">{selectedProject.progress || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06] p-[2px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedProject.progress || 0}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-forge-accent shadow-[0_0_8px_#ff6a00]"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Split Details Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Developer notes / updates */}
                    <section className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-6 flex flex-col h-full gap-5">
                      <div className="flex items-center gap-2 text-forge-accent">
                        <MessageSquare className="size-4" />
                        <h3 className="text-xs font-bold font-mono uppercase tracking-widest">Latest Developer Update</h3>
                      </div>
                      <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-5 rounded-xl text-sm leading-relaxed text-slate-300 font-mono whitespace-pre-wrap select-text">
                        {selectedProject.clientNotes || 
                          `Thank you for submitting your project specs!\n\nOur team is currently evaluating your design assets and business details. We will reach out within 12 hours to schedule our kick-off consultation call.`
                        }
                      </div>
                    </section>

                    {/* Resources & Quick Links */}
                    <section className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-6 space-y-6">
                      <div className="flex items-center gap-2 text-[#a1a1aa]">
                        <Layers className="size-4 text-forge-accent" />
                        <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-white">Project Workspace Assets</h3>
                      </div>

                      {/* Deliverables / URLs */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Live Environments</h4>
                        
                        {/* Figma Link */}
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                              <Figma className="size-4 text-pink-400" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold block">Design Mockups</span>
                              <span className="text-[9px] font-mono text-slate-500">Figma Prototype Board</span>
                            </div>
                          </div>
                          {selectedProject.figmaLink ? (
                            <a 
                              href={selectedProject.figmaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-forge-accent hover:text-white flex items-center gap-1 font-mono"
                            >
                              <span>Open Board</span>
                              <ExternalLink className="size-3" />
                            </a>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-600">Pending Setup</span>
                          )}
                        </div>

                        {/* Staging Link */}
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                              <Globe className="size-4 text-emerald-400" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold block">Staging Preview</span>
                              <span className="text-[9px] font-mono text-slate-500">Live development server</span>
                            </div>
                          </div>
                          {selectedProject.stagingLink ? (
                            <a 
                              href={selectedProject.stagingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-forge-accent hover:text-white flex items-center gap-1 font-mono"
                            >
                              <span>Visit Site</span>
                              <ExternalLink className="size-3" />
                            </a>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-600">Pending Deploy</span>
                          )}
                        </div>
                      </div>

                      {/* Attachments */}
                      <div className="space-y-3 pt-3 border-t border-white/[0.05]">
                        <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Submitted Attachments</h4>
                        {parseAttachments(selectedProject.attachments).length === 0 ? (
                          <p className="text-[10px] font-mono text-slate-600 px-1 py-1">No attachments uploaded.</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto scrollbar-none pr-1">
                            {parseAttachments(selectedProject.attachments).map((file, idx) => (
                              <a
                                key={idx}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] text-slate-300 hover:text-white text-xs font-mono transition-all"
                              >
                                <div className="flex items-center gap-2 truncate pr-4">
                                  <FileText className="size-3.5 text-forge-accent/60 shrink-0" />
                                  <span className="truncate">{file.name}</span>
                                </div>
                                <ExternalLink className="size-3 text-slate-500 group-hover:text-white shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Project Specs Overview */}
                  <section className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-6 md:p-8 space-y-6 select-text">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="size-4 text-forge-accent" />
                      <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-white">Project Inquiry Specification</h3>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 font-mono text-xs leading-relaxed border-b border-white/[0.04] pb-6">
                      <div className="space-y-1">
                        <span className="text-slate-500 uppercase text-[9px] block">Service Type</span>
                        <span className="text-white font-semibold">{selectedProject.serviceNeed || "Not specified"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 uppercase text-[9px] block">Budget Frame</span>
                        <span className="text-white font-semibold">{selectedProject.budget || "Not specified"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 uppercase text-[9px] block">Target Timeline</span>
                        <span className="text-white font-semibold">{selectedProject.timeline || "Not specified"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 uppercase text-[9px] block">Sub-Page Count</span>
                        <span className="text-white font-semibold">{selectedProject.pageCount || "Single Page / Landing"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 uppercase text-[9px] block">Registered Contact</span>
                        <span className="text-white font-semibold truncate block">{selectedProject.contact}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 uppercase text-[9px] block">Date Received</span>
                        <span className="text-white font-semibold">{new Date(selectedProject.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                      </div>
                    </div>

                    {/* Custom Add-ons */}
                    <div className="space-y-3 pb-6 border-b border-white/[0.04]">
                      <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Selected Scope Add-ons</h4>
                      {parseFeatures(selectedProject.features).length === 0 ? (
                        <p className="text-[10px] font-mono text-slate-600">No add-ons selected.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {parseFeatures(selectedProject.features).map((feature) => (
                            <span 
                              key={feature} 
                              className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-forge-accent/10 border border-forge-accent/20 text-forge-accent font-mono uppercase"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Original project description */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Original Requirements Summary</h4>
                      <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap pl-1 font-mono">
                        {selectedProject.details || "No project description was provided at submission."}
                      </p>
                    </div>
                  </section>
                </>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer System Info */}
      <footer className="py-6 border-t border-white/[0.04] bg-[#040407]/40 text-center select-none text-[10px] font-mono text-slate-600 mt-12 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]">
        StackForge Project Portal · secure channel TLS 1.3 · session cookies secure HttpOnly
      </footer>
    </div>
  );
}

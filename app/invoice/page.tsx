"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Upload, ShieldCheck, X, FileText, Globe, Layers, 
  Loader2, Cpu, Activity, Database, CheckCircle2, AlertCircle, Play, File, ChevronDown
} from "lucide-react";
import Image from "next/image";
import Logo from "@/app/img/infinity-logo-164.png";
import Footer from "@/components/layout/Footer";

// 1. Unified API Protocol Configuration
const PROTOCOLS = [
  { id: "invoice", label: "Invoice OCR", endpoint: "/upload/invoice-pages" },

];

const BASE_URL = "https://infyverifyapi.infyshield.com";

export interface OCRTask {
  id: string;
  url: string;         // Local Blob for Preview
  file: File;
  type: "image" | "pdf"; 
  status: "idle" | "uploading" | "analyzing" | "completed" | "failed";
  progress: number;
  extractedData: any;
  errorLog?: string;
}

export default function EnterpriseOCR() {
  const [tasks, setTasks] = useState<OCRTask[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeProtocol, setActiveProtocol] = useState(PROTOCOLS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTask = tasks.find(t => t.id === selectedId) || null;

  // Cleanup effect to prevent memory leaks from Blob URLs
  useEffect(() => {
    return () => tasks.forEach(t => URL.revokeObjectURL(t.url));
  }, [tasks]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: File[] = [];
    if ('files' in e.target && e.target.files) files = Array.from(e.target.files);
    else if ('dataTransfer' in e) {
      e.preventDefault();
      files = Array.from(e.dataTransfer.files);
    }

    if (files.length === 0) return;

    const newTasks: OCRTask[] = files.map(file => ({
      id: `NODE-${Math.random().toString(36).substring(7).toUpperCase()}`,
      url: URL.createObjectURL(file),
      file: file,
      type: file.type.includes("pdf") ? "pdf" : "image", 
      status: "idle",
      progress: 0,
      extractedData: null
    }));

    setTasks(prev => [...prev, ...newTasks]);
    if (!selectedId) setSelectedId(newTasks[0].id);
  };

  const updateTask = (id: string, updates: Partial<OCRTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const executePipeline = async (task: OCRTask) => {
    if (task.status === "uploading" || task.status === "analyzing") return;

    try {
      updateTask(task.id, { status: "uploading", progress: 15, errorLog: "" });
      
      // PHASE 1: Storage on F: Drive
      const storageFormData = new FormData();
      storageFormData.append("file", task.file);
      const storageRes = await fetch("/api/upload", { method: "POST", body: storageFormData });
      const storageData = await storageRes.json();
      if (!storageRes.ok) throw new Error(storageData.error || "UPLD_STORAGE_ERR");
      
      updateTask(task.id, { progress: 45, status: "analyzing" });

      // PHASE 2: Dynamic API Call based on Protocol Dropdown
      const ocrRes = await fetch(`${BASE_URL}${activeProtocol.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: storageData.virtualPath,
          ticketNo: `TKT-${Date.now()}`,
          documentName: activeProtocol.label // Passing selected type name
        }),
      });

      const result = await ocrRes.json();
      if (!ocrRes.ok) throw new Error(result.message || "NEURAL_REJECTION");

      updateTask(task.id, { 
        status: "completed", 
        progress: 100, 
        extractedData: result.data || result 
      });
    } catch (error: any) {
      updateTask(task.id, { status: "failed", progress: 0, errorLog: error.message });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#020202] text-slate-300 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* HUD HEADER */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <div className="bg-white p-1 rounded shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Image src={Logo} alt="logo" width={80} height={18} className="h-4 object-contain" />
          </div>
          <div className="h-6 w-px bg-white/10" />
          
          {/* PROTOCOL SELECTOR */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg group hover:border-blue-500/50 transition-all relative">
            <Cpu size={14} className="text-blue-500" />
            <select 
              className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none pr-6"
              value={activeProtocol.id}
              onChange={(e) => setActiveProtocol(PROTOCOLS.find(p => p.id === e.target.value)!)}
            >
              {PROTOCOLS.map(p => (
                <option key={p.id} value={p.id} className="bg-[#0a0a0a] text-white">{p.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 pointer-events-none text-slate-500" />
          </div>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_20px_30px_-10px_rgba(37,99,235,0.3)] flex items-center gap-2"
        >
          <Upload size={14} /> Ingest Assets
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelection} accept="image/*,application/pdf" />
        </button>
      </header>

      <main className="flex-grow flex p-4 gap-4 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* DOCUMENT QUEUE */}
        <aside className="w-80 rounded-[1.5rem] border border-white/5 bg-[#0a0a0a] flex flex-col overflow-hidden shrink-0 shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Live Queue</span>
                <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{tasks.length}</span>
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-2 scrollbar-hide">
                {tasks.map(t => (
                    <div 
                        key={t.id} 
                        onClick={() => setSelectedId(t.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${selectedId === t.id ? 'bg-blue-600/10 border-blue-500/40 shadow-lg shadow-blue-900/10' : 'bg-white/[0.02] border-transparent hover:border-white/10'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              {t.type === 'pdf' ? <File size={12} className="text-orange-500 shrink-0"/> : <FileText size={12} className="text-blue-500 shrink-0"/>}
                              <span className="text-[9px] font-mono text-slate-400 truncate uppercase">{t.file.name}</span>
                            </div>
                            {t.status === 'completed' ? <CheckCircle2 size={12} className="text-emerald-500" /> : t.status === 'failed' ? <AlertCircle size={12} className="text-red-500" /> : (t.status === 'idle' ? <Play size={10} className="text-slate-600 hover:text-white transition-colors"/> : <Loader2 size={12} className="text-blue-500 animate-spin" />)}
                        </div>
                        <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-700 ${t.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${t.progress}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </aside>

        {/* NEURAL VIEWPORT (PDF/IMAGE SUPPORT) */}
        <div className="flex-grow flex flex-col gap-4 min-w-0">
          <div className="flex-[6] rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm flex flex-col overflow-hidden relative shadow-inner">
            <div className="p-4 border-b border-white/5 flex justify-between items-center px-8 bg-white/[0.01]">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} className="text-blue-500" /> Optical_Viewport
              </span>
              {activeTask && (
                <div className="flex items-center gap-4">
                  <button onClick={() => executePipeline(activeTask)} className="text-[9px] font-black text-emerald-500 hover:bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 rounded-md uppercase tracking-[0.1em] transition-all">Process Sequence</button>
                  <button onClick={() => setTasks(tasks.filter(tk => tk.id !== activeTask.id))} className="text-[9px] font-black text-red-500/70 hover:text-red-500 uppercase">Eject Node</button>
                </div>
              )}
            </div>
            
            <div className="flex-grow flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
              {activeTask ? (
                <div className="relative h-full w-full flex items-center justify-center animate-in zoom-in-95 duration-500">
                  {/* Dynamic Format Rendering Logic */}
                  {activeTask.type === "pdf" ? (
                    <iframe 
                      src={`${activeTask.url}#toolbar=0&navpanes=0`} 
                      className="w-full h-full rounded-xl border border-white/10 bg-white" 
                      title="PDF Source" 
                    />
                  ) : (
                    <img src={activeTask.url} className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10" alt="img-src" />
                  )}

                  {(activeTask.status === "analyzing" || activeTask.status === "uploading") && (
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                       <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute top-0 animate-[scan_2.5s_infinite_linear] shadow-[0_0_30px_#3b82f6]" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center opacity-10 uppercase text-xs tracking-[0.6em] font-black">Ready_For_Ingestion</div>
              )}
            </div>
          </div>

          {/* DATA STREAM TERMINAL */}
          <div className="flex-[4] rounded-[2rem] border border-white/5 bg-black flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 px-8 bg-white/[0.01] flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Database size={14} className="text-emerald-500" /> Raw_Metadata_Buffer
              </span>
            </div>
            <div className="flex-grow p-8 font-mono text-[12px] overflow-y-auto scrollbar-thin">
              {activeTask?.status === "completed" ? (
                <pre className="text-emerald-400/90 leading-relaxed animate-in fade-in duration-700">
                    {JSON.stringify(activeTask.extractedData, null, 2)}
                </pre>
              ) : activeTask?.status === "failed" ? (
                <div className="text-red-500 uppercase text-[10px] font-black p-4 border border-red-500/20 rounded bg-red-500/5">
                   CRITICAL_FAILURE: {activeTask.errorLog}
                </div>
              ) : (
                <div className="opacity-20 flex flex-col items-center justify-center h-full gap-4 grayscale">
                  <Loader2 className={`w-8 h-8 animate-spin text-blue-500 ${!activeTask || activeTask.status === 'idle' ? 'hidden' : ''}`} />
                  <p className="text-[9px] tracking-[0.5em] font-black uppercase">Awaiting_Neural_Sync</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR HUD */}
        <aside className="w-80 rounded-[2rem] border border-white/5 bg-[#0a0a0a] flex flex-col p-8 shrink-0 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full -mr-32 -mt-32" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12 text-center underline underline-offset-8 decoration-blue-500/20">System_Metrics</h3>
          
          <div className="flex flex-col items-center mb-12">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="86" className="stroke-white/5 fill-none" strokeWidth="10" />
                <circle cx="96" cy="96" r="86" className="stroke-blue-600 fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="10" strokeDasharray={540} strokeDashoffset={540 - (540 * (activeTask?.progress || 0)) / 100} strokeLinecap="round" />
              </svg>
              <span className="text-5xl font-black text-white tracking-tighter">{activeTask?.progress || 0}</span>
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl text-[9px] space-y-3 uppercase tracking-[0.1em] font-bold shadow-inner">
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">PROTOCOL</span> <span className="text-blue-500">{activeProtocol.id}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">FORMAT</span> <span className="text-slate-300">{activeTask?.type || 'READY'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">STATUS</span> <span className="text-slate-300">{activeTask?.status || 'STANDBY'}</span></div>
            </div>
          </div>

          <button className="w-full py-4 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] rounded-2xl text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-all">
            SYNC_TO_CLOUD_ERP
          </button>
        </aside>
      </main>

     <Footer/>

      <style jsx global>{`
        @keyframes scan { 
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(70vh); opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        select option { background: #0a0a0a; color: white; }
      `}</style>
    </div>
  );
}
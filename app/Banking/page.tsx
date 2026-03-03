"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle2, AlertCircle, Loader2, Play, Zap, FileJson, Layers } from "lucide-react";
import Image from "next/image";
import Logo from "@/app/img/infinity-logo-164.png";

// Configuration for your specific API routes
const DOC_CONFIG = [
  { id: "cheque", label: "Cheque OCR", endpoint: "/cheque/upload" },
  { id: "payment_proff", label: "Payment Proof", endpoint: "/Payment-Proff/payment-receipt" },
  { id: "passbook", label: "Passbook", endpoint: "/passbook/passbook" },
  { id: "bankstatement", label: "Bank Statement", endpoint: "/passbook/bankstatement" },
  { id: "kioskid", label: "Kiosk ID", endpoint: "/kioskID/kioskid" },
];

const API_BASE = "https://infyverifyapi.infyshield.com";

interface Task {
  id: string;
  file: File;
  preview: string;
  type: string;
  status: "idle" | "uploading" | "processing" | "success" | "error";
  progress: number;
  result?: any;
  vPath?: string;
}

export default function EnterpriseOCR() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("cheque");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTask = tasks.find(t => t.id === activeId) || tasks[tasks.length - 1];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      type: selectedType,
      status: "idle" as const,
      progress: 0,
    }));
    setTasks(prev => [...prev, ...newFiles]);
    newFiles.forEach(processTask);
  };

  const processTask = async (task: Task) => {
    try {
      // 1. Save to F: Drive
      updateStatus(task.id, { status: "uploading", progress: 30 });
      const fData = new FormData();
      fData.append("file", task.file);
      const res = await fetch("/api/upload", { method: "POST", body: fData });
      const { virtualPath } = await res.json();
      
      updateStatus(task.id, { status: "processing", progress: 60, vPath: virtualPath });

      // 2. Hit Document Specific API
      const config = DOC_CONFIG.find(c => c.id === task.type);
      const ocrRes = await fetch(`${API_BASE}${config?.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: virtualPath,
          ticketno: `TKT-${task.id.toUpperCase()}`,
          documentname: task.type,
          UploadedBy: "AI_Enterprise_User",
          servicelocation: "Global_Node"
        }),
      });

      const ocrData = await ocrRes.json();
      if (!ocrRes.ok) throw new Error("OCR Engine Rejected Request");

      updateStatus(task.id, { status: "success", progress: 100, result: ocrData });
    } catch (err: any) {
      updateStatus(task.id, { status: "error", progress: 0, result: err.message });
    }
  };

  const updateStatus = (id: string, patch: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#020202] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* TOP NAVIGATION */}
      <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-8">
          <div className="bg-white p-1 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Image src={Logo} alt="Logo" width={80} height={20} className="h-5 object-contain" />
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            {DOC_CONFIG.map(config => (
              <button
                key={config.id}
                onClick={() => setSelectedType(config.id)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tighter transition-all ${selectedType === config.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all"
        >
          <Upload size={14} /> New Batch
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
        </button>
      </header>

      <main className="flex-grow flex p-6 gap-6 overflow-hidden">
        {/* TASK QUEUE */}
        <aside className="w-80 flex flex-col gap-4 shrink-0">
          <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
            <span>Processing Queue</span>
            <span>{tasks.length} Units</span>
          </div>
          <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            {tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => setActiveId(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeId === task.id ? 'bg-white/5 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-slate-400 truncate w-32 uppercase">{task.name}</span>
                  {task.status === 'success' ? <CheckCircle2 size={14} className="text-emerald-500" /> : task.status === 'error' ? <AlertCircle size={14} className="text-red-500" /> : <Loader2 size={14} className="text-blue-500 animate-spin" />}
                </div>
                <div className="flex justify-between items-end">
                   <span className="text-[9px] font-bold text-blue-500/80 uppercase tracking-widest">{task.type}</span>
                   <span className="text-[10px] font-mono text-slate-500">{task.progress}%</span>
                </div>
                <div className="mt-2 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-700 ${task.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* WORKSPACE */}
        <div className="flex-grow flex flex-col gap-6 overflow-hidden">
          <div className="flex-[6] bg-[#0a0a0a] rounded-[2rem] border border-white/5 overflow-hidden relative group">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
              <Layers size={12} className="text-blue-500" /> Optical Viewport
            </div>
            <div className="flex-grow h-full flex items-center justify-center p-12 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05)_0%,_transparent_70%)]">
              {activeTask ? (
                <div className="relative max-h-full max-w-full">
                  <img src={activeTask.preview} className="max-h-[70vh] rounded-lg shadow-2xl border border-white/10" alt="Preview" />
                  {(activeTask.status === 'uploading' || activeTask.status === 'processing') && (
                    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                      <div className="w-full h-1 bg-blue-500 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_20px_#3b82f6]" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center opacity-20 flex flex-col items-center gap-4">
                  <Zap size={64} strokeWidth={1} />
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">Initialize Hardware</p>
                </div>
              )}
            </div>
          </div>

          {/* TERMINAL */}
          <div className="flex-[4] bg-black rounded-[2rem] border border-white/5 flex flex-col overflow-hidden">
            <div className="px-8 py-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <FileJson size={14} className="text-emerald-500" /> Extracted Metadata
              </div>
              {activeTask?.vPath && <span className="text-[9px] font-mono text-emerald-500/50 truncate max-w-[400px]">SRC: {activeTask.vPath}</span>}
            </div>
            <div className="flex-grow p-8 font-mono text-[13px] text-emerald-400 overflow-y-auto scrollbar-hide">
              {activeTask?.status === 'success' ? (
                <pre className="animate-in fade-in slide-in-from-bottom-2 duration-500">{JSON.stringify(activeTask.result, null, 2)}</pre>
              ) : activeTask?.status === 'error' ? (
                <div className="text-red-500 flex flex-col gap-2">
                  <span className="font-black">[CRITICAL_ERROR]</span>
                  <span>{activeTask.result}</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 opacity-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest">Awaiting system output...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        select option { background: #0a0a0a; color: white; }
      `}</style>
    </div>
  );
}
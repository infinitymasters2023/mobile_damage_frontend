"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload, CheckCircle2, AlertCircle, Loader2,
  Layers, FileJson, Cpu, ChevronDown, FileText, FileSearch, Menu
} from "lucide-react";
import Image from "next/image";
import Logo from "@/public/img/infyeazy_logo.svg";
import Sidebar from "@/components/layout/Sidebar";

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
  mimeType: "image" | "pdf";
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
  
  const activeTask = tasks.find(t => t.id === activeId) || (tasks.length > 0 ? tasks[tasks.length - 1] : null);

  useEffect(() => {
    return () => tasks.forEach(t => t.preview && URL.revokeObjectURL(t.preview));
  }, [tasks]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: Task[] = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      type: selectedType,
      mimeType: file.type.includes("pdf") ? "pdf" : "image",
      status: "idle",
      progress: 0,
    }));
    setTasks(prev => [...prev, ...newFiles]);
    newFiles.forEach(processTask);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processTask = async (task: Task) => {
    try {
      updateStatus(task.id, { status: "uploading", progress: 20 });
      const fData = new FormData();
      fData.append("file", task.file);
      const res = await fetch("/api/upload", { method: "POST", body: fData });
      if (!res.ok) throw new Error("F: Drive Storage Failed");
      const { virtualPath } = await res.json();
      
      updateStatus(task.id, { status: "processing", progress: 50, vPath: virtualPath });
      
      const config = DOC_CONFIG.find(c => c.id === task.type);
      const ocrRes = await fetch(`${API_BASE}${config?.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: virtualPath,
          ticketno: `TKT-${task.id.toUpperCase()}`,
          documentname: task.type,
          UploadedBy: "AI_Enterprise_User",
          servicelocation: "Mumbai_DataNode"
        }),
      });
      
      const ocrData = await ocrRes.json();
      if (!ocrRes.ok) throw new Error(ocrData.message || "OCR Protocol Rejection");
      updateStatus(task.id, { status: "success", progress: 100, result: ocrData });
    } catch (err: any) {
      updateStatus(task.id, { status: "error", progress: 0, result: err.message });
    }
  };

  const updateStatus = (id: string, patch: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  return (
    <div className="flex h-screen w-full bg-[#020202] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      <Sidebar />

      <div className="flex flex-col flex-grow min-w-0">
        
        {/* HUD HEADER */}
        <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 shrink-0 z-50">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="bg-white p-1 px-2 lg:p-1.5 lg:px-3 rounded-lg shadow-xl shrink-0">
              <Image src={Logo} alt="Logo" width={100} height={30} className="object-contain" priority unoptimized />
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
              <div className="px-3 flex items-center gap-2 border-r border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <Cpu size={12} className="text-blue-500" /> Protocol
              </div>
              <div className="relative min-w-[120px]">
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent text-[10px] font-bold text-blue-500 uppercase tracking-tighter outline-none cursor-pointer pr-6 appearance-none w-full"
                >
                  {DOC_CONFIG.map(c => <option key={c.id} value={c.id} className="bg-[#0a0a0a] text-white">{c.label}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
              </div>
            </div>
          </div>

          <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 lg:px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2 shrink-0">
            <Upload size={14} /> <span className="hidden xs:inline">Ingest Assets</span>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} accept="image/*,application/pdf" />
          </button>
        </header>

        {/* MAIN WORKSPACE */}
        <main className="flex-grow flex flex-col lg:flex-row p-3 lg:p-4 gap-4 overflow-y-auto lg:overflow-hidden">

          {/* ASIDE: LIVE TASK QUEUE */}
          <aside className="w-full lg:w-72 rounded-2xl border border-white/5 bg-[#0a0a0a] flex flex-col overflow-hidden shrink-0 shadow-2xl h-auto lg:h-full">
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Live Tasks</span>
              <span className="bg-blue-500/10 text-[10px] text-blue-500 px-2 rounded-md font-mono">{tasks.length}</span>
            </div>
            <div className="flex-grow overflow-x-auto lg:overflow-y-auto p-2 space-y-2 scrollbar-hide lg:block flex flex-row lg:space-x-0 space-x-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => setActiveId(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer min-w-[220px] lg:min-w-0 ${activeId === task.id ? 'bg-blue-600/10 border-blue-500/40 shadow-lg' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {task.mimeType === 'pdf' ? <FileText size={12} className="text-orange-500 shrink-0" /> : <Layers size={12} className="text-blue-500 shrink-0" />}
                      <span className="text-[9px] font-mono text-slate-400 truncate uppercase">{task.file.name}</span>
                    </div>
                    {task.status === 'success' ? <CheckCircle2 size={12} className="text-emerald-500" /> : task.status === 'error' ? <AlertCircle size={12} className="text-red-500" /> : <Loader2 size={12} className="text-blue-500 animate-spin" />}
                  </div>
                  <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${task.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* COLUMN: VIEWPORT & TERMINAL */}
          <div className="flex-grow flex flex-col gap-4 min-w-0 h-full">
            
            {/* NEURAL VIEWPORT */}
            <div className="flex-[3] min-h-[400px] lg:min-h-0 bg-[#070707] rounded-[2rem] border border-white/5 overflow-hidden relative shadow-inner flex flex-col">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileSearch size={14} className="text-blue-500" /> Neural_Viewport
                </span>
                {activeTask && (
                  <span className="text-[9px] font-mono text-blue-500/50 uppercase tracking-tighter">ID: {activeTask.id}</span>
                )}
              </div>

              <div className="flex-grow flex items-center justify-center p-4 lg:p-8 relative">
                {activeTask ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {activeTask.mimeType === 'pdf' ? (
                      <iframe src={`${activeTask.preview}#toolbar=0&navpanes=0`} className="w-full h-full rounded-xl border border-white/10 bg-white" title="PDF View" />
                    ) : (
                      <img src={activeTask.preview} className="max-h-full max-w-full rounded-xl shadow-2xl border border-white/10 object-contain" alt="Preview" />
                    )}
                    {(activeTask.status === 'uploading' || activeTask.status === 'processing') && (
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="w-full h-0.5 bg-blue-500 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_15px_#3b82f6]" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center opacity-10 flex flex-col items-center gap-4">
                    <Layers className="w-16 h-16" strokeWidth={0.5} />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Connection</p>
                  </div>
                )}
              </div>
            </div>

            {/* DECODED TERMINAL */}
            <div className="flex-[2] min-h-[250px] lg:min-h-0 bg-black rounded-[2rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  <FileJson size={14} className="text-emerald-500" /> Decoded_Metadata
                </div>
                {activeTask?.vPath && <span className="text-[8px] font-mono text-emerald-500/30 truncate max-w-[200px]">NODE: {activeTask.vPath}</span>}
              </div>
              <div className="flex-grow p-6 font-mono text-[11px] lg:text-[12px] text-emerald-400/90 overflow-y-auto scrollbar-hide">
                {activeTask?.status === 'success' ? (
                  <pre className="animate-in fade-in slide-in-from-bottom-2 duration-500 whitespace-pre-wrap">{JSON.stringify(activeTask.result, null, 2)}</pre>
                ) : activeTask?.status === 'error' ? (
                  <div className="text-red-500 flex flex-col gap-2 uppercase text-[10px] font-black">
                    <div className="flex items-center gap-2 underline tracking-tighter"><AlertCircle size={14} /> Critical Rejection</div>
                    <div className="bg-red-500/10 p-4 border border-red-500/20 rounded-lg">{activeTask.result}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 opacity-20">
                    <Loader2 className={`animate-spin text-blue-500 ${!activeTask ? 'hidden' : ''}`} />
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black">Awaiting Stream...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes scan { 
          0% { transform: translateY(0); opacity: 0; } 
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(500px); opacity: 0; } 
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        pre { word-break: break-all; }
      `}</style>
    </div>
  );
}
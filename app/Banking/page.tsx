"use client";

<<<<<<< HEAD
import { useState, useRef } from "react";
import { Upload, X, CheckCircle2, AlertCircle, Loader2, Play, Zap, FileJson, Layers } from "lucide-react";
=======
import { useState } from "react";
>>>>>>> a72a5d3cec8aafe6dd197f76e899b11eafbddd49
import Image from "next/image";
import { Bolt, Copy, Upload, ShieldCheck, CheckSquare, Menu, FileText } from "lucide-react";
import Header from "@/components/layout/Header";

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

<<<<<<< HEAD
  const activeTask = tasks.find(t => t.id === activeId) || tasks[tasks.length - 1];
=======
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: File[] = [];
    if ('files' in e.target && e.target.files) {
      files = Array.from(e.target.files);
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      files = Array.from(e.dataTransfer.files);
    }
    if (files.length === 0) return;
>>>>>>> a72a5d3cec8aafe6dd197f76e899b11eafbddd49

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

<<<<<<< HEAD
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
=======
    await new Promise(r => setTimeout(r, 3200));
    setImages(prev => prev.map(img => img.url === imgUrl ? {
      ...img,
      status: "completed",
      progress: 100,
      extractedData: {
        "ACCOUNT NO": "371166548523",
        "IFSC CODE": "CORE0007637",
        "HOLDER NAME": "ADMIN_USER_56",
        "BANK NAME": "CORE GLOBAL SYSTEMS",
        "LATEST TRANSACTION": "-$167.70",
        "TOTAL BALANCE": "$5701.82"
      }
    } : img));
>>>>>>> a72a5d3cec8aafe6dd197f76e899b11eafbddd49
  };

  const updateStatus = (id: string, patch: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans select-none overflow-x-hidden">
      <Header title="Banking" />

      {/* MAIN CONTENT GRID: Column on mobile, Row on LG desktop */}
      <main className="flex-grow flex flex-col mt-[70px] lg:mt-[10px] lg:flex-row p-3 md:p-4 gap-4 lg:h-[calc(100vh-64px-32px)]">

        {/* LEFT COLUMN: SOURCE & TERMINAL */}
        <div className="flex-[7] flex flex-col gap-4 min-w-0">

          {/* SOURCE PANEL: Added min-height for mobile visibility */}
          <div className="flex-[6] min-h-[350px] lg:min-h-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"> <FileText size={14} className="text-blue-500" /> Live Document</span>
              <span className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> SOURCE
              </span>
            </div>

            <div className="flex-grow flex items-center justify-center p-4 md:p-6 bg-black relative overflow-hidden">
              {active ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  <Image src={active.url} width={500} height={500} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-white/5" alt="source" />
                  {active.status === "analyzing" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-0.5 bg-blue-500/40 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_15px_#3b82f6]" />
>>>>>>> a72a5d3cec8aafe6dd197f76e899b11eafbddd49
                    </div>
                  )}
                </div>
              ) : (
<<<<<<< HEAD
                <div className="text-center opacity-20 flex flex-col items-center gap-4">
                  <Zap size={64} strokeWidth={1} />
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">Initialize Hardware</p>
                </div>
=======
                <label onDragOver={e => e.preventDefault()} onDrop={handleUpload} className="group cursor-pointer flex flex-col items-center justify-center text-center w-full max-w-xl p-4 transition-all">
                  <div className="p-4 rounded-2xl bg-blue-600 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-white" size={30} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">Drop device assets here</h3>
                  <p className="text-slate-500 text-sm text-center px-10 max-w-sm">
                    Drag and drop file or <span className="text-blue-500 font-bold underline">browse files</span> for OCR detection.
                  </p>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                  {/* Creative Supported Formats Tag Cloud */}
                  <div className="flex flex-wrap justify-center gap-2 pt-2 opacity-40 mt-2">
                    {['PNG', 'WEBP', 'SVG', 'JPEG', 'PDF'].map((ext) => (
                      <span key={ext} className="px-2 py-0.5 border border-white/20 rounded text-[9px] font-mono text-slate-300">
                        {ext}
                      </span>
                    ))}
                  </div>
                </label>
>>>>>>> a72a5d3cec8aafe6dd197f76e899b11eafbddd49
              )}
            </div>
          </div>

<<<<<<< HEAD
          {/* TERMINAL */}
          <div className="flex-[4] bg-black rounded-[2rem] border border-white/5 flex flex-col overflow-hidden">
            <div className="px-8 py-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <FileJson size={14} className="text-emerald-500" /> Extracted Metadata
=======
          {/* TERMINAL PANEL */}
          <div className="flex-[4] min-h-[250px] lg:min-h-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-4 md:px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Terminal</span>
              <div className="flex items-center gap-3 md:gap-5">
                <button
                  onClick={handleCopyTerminal}
                  disabled={active?.status !== 'completed'}
                  className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400 hover:text-emerald-500 transition-colors disabled:opacity-20"
                >
                  {termCopied ? <CheckSquare size={12} /> : <Copy size={12} />}
                  <span className="hidden xs:inline">{termCopied ? "Copied" : "Copy Data"}</span>
                </button>
                <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-2 tracking-widest border-l border-white/10 pl-3 md:pl-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span className="hidden xs:inline">LIVE FEED</span>
                </span>
>>>>>>> a72a5d3cec8aafe6dd197f76e899b11eafbddd49
              </div>
              {activeTask?.vPath && <span className="text-[9px] font-mono text-emerald-500/50 truncate max-w-[400px]">SRC: {activeTask.vPath}</span>}
            </div>
<<<<<<< HEAD
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
=======
            <div className="flex-grow bg-[#050505] p-4 md:p-6 font-mono text-[12px] text-emerald-500 overflow-y-auto leading-relaxed scrollbar-hide">
              {active?.status === "completed" ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <p className="mb-4 font-black">[SUCCESS] AI Extraction Complete:</p>
                  <div className="space-y-2">
                    {Object.entries(active.extractedData).map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:gap-4 border-b border-white/5 pb-1 sm:border-0">
                        <span className="opacity-50 text-[10px] sm:min-w-[140px] uppercase">{key} :</span>
                        <span className="font-bold text-white break-all">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-30">
                  <p className="animate-pulse tracking-[0.2em] text-[10px] uppercase">{"// Awaiting Engine..."}</p>
>>>>>>> a72a5d3cec8aafe6dd197f76e899b11eafbddd49
                </div>
              )}
            </div>
          </div>
        </div>
<<<<<<< HEAD
      </main>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        select option { background: #0a0a0a; color: white; }
=======

        {/* RIGHT SIDEBAR: Becomes a card on mobile */}
        <aside className="flex-[3] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col p-6 md:p-8 overflow-hidden min-w-full lg:min-w-[340px] shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] -z-10" />
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Analysis</h3>

          {/* CONFIDENCE ORB: Scaled for mobile */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-36 h-36 md:w-48 md:h-48 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle cx="96" cy="96" r="86" className="stroke-white/5 fill-none" strokeWidth="10" />
                <circle cx="96" cy="96" r="86" className="stroke-blue-600 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="10" strokeDasharray={540} strokeDashoffset={540 - (540 * (active?.progress || 0)) / 100} strokeLinecap="round" />
              </svg>
              <div className="flex gap-2 flex-col items-center">
                <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{active ? Math.floor(active.progress) : 0}%</span>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Accuracy</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OCR Profile</label>
              <div className="relative group w-full mt-[5px]">
                <select value={engineProfile} onChange={e => setEngineProfile(e.target.value)} className="w-full bg-[#050505] border border-white/10  rounded-xl px-4 py-3 text-xs font-bold text-white outline-none cursor-pointer appearance-none">
                  <option>OCR to Cheque</option>
                  <option>OCR to Passbook</option>
                  <option>OCR Bank ID</option>
                  <option>OCR IMEI</option>
                </select>
                <Bolt size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <button onClick={() => active && analyzeDocument(active.url)} disabled={!active || active.status === 'analyzing'} className="w-full py-4 bg-blue-600 rounded-xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 active:scale-[0.98] disabled:opacity-30 transition-all shadow-xl">
              <Bolt size={16} className={active?.status === 'analyzing' ? 'animate-spin' : ''} /> Extraction
            </button>
          </div>
        </aside>
      </main>

      {/* FOOTER: Stacked on small screens */}
      <footer className="h-auto md:h-8 py-4 md:py-0 border-t border-white/5 bg-black px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-[9px] font-medium text-slate-500 gap-2">
        <div className="flex items-center gap-3 uppercase tracking-widest text-center">
          <span>&copy; 2026 INFINITY ASSURANCE</span>
          <div className="flex items-center gap-1.5"><ShieldCheck size={10} className="text-emerald-500" /> SECURE</div>
        </div>
        <div className="hidden sm:flex gap-4 uppercase tracking-tighter">
          <span>Latency: 142ms</span>
          <span>AWS-MUM-1</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        ::-webkit-scrollbar { width: 0px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
>>>>>>> a72a5d3cec8aafe6dd197f76e899b11eafbddd49
      `}</style>
    </div>
  );
}
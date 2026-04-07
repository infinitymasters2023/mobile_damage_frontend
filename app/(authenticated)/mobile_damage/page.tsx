"use client";

import { useState } from "react";
import Image from "next/image";
import { Bolt, Copy, Upload, CheckSquare, FileText, Activity, Database, Cpu } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export interface UploadedImage {
  url: string;
  name: string;
  status?: "analyzing" | "completed" | "failed";
  progress: number;
  extractedData: Record<string, string>;
}

export default function EnterpriseOCR() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [termCopied, setTermCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: File[] = [];
    if ("target" in e && "files" in e.target && e.target.files) {
      files = Array.from(e.target.files);
    } else if ("dataTransfer" in e) {
      e.preventDefault();
      files = Array.from(e.dataTransfer.files);
    }
    if (files.length === 0) return;

    const newImg: UploadedImage = {
      url: URL.createObjectURL(files[0]),
      name: files[0].name,
      status: "analyzing",
      progress: 0,
      extractedData: {},
    };

    setImages([newImg]);
    analyzeDocument(newImg.url);
  };

  const analyzeDocument = async (imgUrl: string) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 18;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setImages((prev) =>
        prev.map((img) => (img.url === imgUrl ? { ...img, progress: currentProgress } : img))
      );
    }, 400);

    await new Promise((r) => setTimeout(r, 3200));
    setImages((prev) =>
      prev.map((img) =>
        img.url === imgUrl
          ? {
              ...img,
              status: "completed",
              progress: 100,
              extractedData: {
                "ACCOUNT NO": "371166548523",
                "IFSC CODE": "CORE0007637",
                "HOLDER NAME": "ADMIN_USER_56",
                "BANK NAME": "CORE GLOBAL SYSTEMS",
                "LATEST TRANSACTION": "-$167.70",
                "TOTAL BALANCE": "$5701.82",
              },
            }
          : img
      )
    );
  };

  const handleCopyTerminal = () => {
    if (!active || active.status !== "completed") return;
    const dataString = JSON.stringify(active.extractedData, null, 2);
    navigator.clipboard.writeText(dataString);
    setTermCopied(true);
    setTimeout(() => setTermCopied(false), 2000);
  };

  const active = images[0] || null;

  return (
    <div className="flex h-screen w-full bg-[#020202] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-grow min-w-0">
        <Header title="Neural Extraction Engine" />

        <main className="flex-grow flex flex-col lg:flex-row p-3 lg:p-4 gap-4 overflow-y-auto lg:overflow-hidden">
          
          {/* LEFT COLUMN: SOURCE & TERMINAL */}
          <div className="flex-[7] flex flex-col gap-4 min-w-0 lg:h-full">
            
            {/* SOURCE VIEWPORT */}
            <div className="flex-[6] min-h-[400px] lg:min-h-0 rounded-[2rem] border border-white/5 bg-[#070707] flex flex-col overflow-hidden relative shadow-inner">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> Neural_Viewport
                </span>
                <span className="text-[9px] font-mono text-blue-500/50 uppercase tracking-tighter">
                  Stream_Active: 1080p
                </span>
              </div>

              <div className="flex-grow flex items-center justify-center p-4 lg:p-10 bg-black relative overflow-hidden">
                {active ? (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <Image
                      src={active.url}
                      width={800}
                      height={800}
                      className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10 transition-opacity duration-500"
                      alt="source"
                    />
                    {active.status === "analyzing" && (
                      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                        <div className="w-full h-0.5 bg-blue-500 absolute top-0 animate-[scan_2.5s_infinite_linear] shadow-[0_0_15px_#3b82f6]" />
                        <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleUpload}
                    className="group cursor-pointer flex flex-col items-center justify-center text-center w-full max-w-xl p-8 transition-all border-2 border-dashed border-white/5 rounded-[2rem] hover:border-blue-500/20 hover:bg-blue-500/5"
                  >
                    <div className="p-6 rounded-3xl bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)] mb-6 group-hover:scale-110 transition-all">
                      <Upload className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Ingest Asset</h3>
                    <p className="text-slate-500 text-xs uppercase tracking-tighter opacity-60">
                      Drop file for neural symbology detection
                    </p>
                    <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            {/* DATA TERMINAL */}
            <div className="flex-[3] min-h-[250px] lg:min-h-0 bg-black rounded-[2rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  <Database size={14} className="text-emerald-500" /> Decoded_Metadata
                </div>
                <button
                  onClick={handleCopyTerminal}
                  disabled={active?.status !== "completed"}
                  className="text-[9px] font-black text-emerald-500/50 hover:text-emerald-500 flex items-center gap-2 uppercase transition-all disabled:opacity-10"
                >
                  {termCopied ? <CheckSquare size={12} /> : <Copy size={12} />} {termCopied ? "Copied" : "Copy_JSON"}
                </button>
              </div>
              <div className="flex-grow p-6 font-mono text-[12px] text-emerald-400/90 overflow-y-auto scrollbar-hide">
                {active?.status === "completed" ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <p className="text-[10px] opacity-40 font-black mb-4">
                      {">"} LOG_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                    </p>
                    {Object.entries(active.extractedData).map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:gap-4 border-b border-white/5 pb-2">
                        <span className="opacity-40 text-[10px] sm:min-w-[150px] uppercase tracking-tighter">
                          {key}
                        </span>
                        <span className="font-bold text-slate-100 break-all">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                    {/* <Loader2 className={`w-8 h-8 animate-spin text-blue-500 ${!active ? 'hidden' : ''}`} /> */}
                    <p className="tracking-[0.5em] text-[10px] font-black uppercase italic">
                      {active ? "Processing_Buffer..." : "Awaiting_Input_Stream..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: ANALYSIS */}
          <aside className="lg:w-[360px] shrink-0 rounded-[2rem] border border-white/5 bg-[#0a0a0a] flex flex-col p-6 lg:p-8 shadow-2xl relative lg:h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 text-center underline underline-offset-8 decoration-blue-500/20">
              Inference_Metrics
            </h3>

            {/* CONFIDENCE ORB */}
            <div className="flex flex-col items-center mb-10 shrink-0">
              <div className="relative w-40 h-40 lg:w-48 lg:h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
                  <circle cx="96" cy="96" r="86" className="stroke-white/5 fill-none" strokeWidth="8" />
                  <circle
                    cx="96"
                    cy="96"
                    r="86"
                    className="stroke-blue-600 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={540}
                    strokeDashoffset={540 - (540 * (active?.progress || 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                    {active ? Math.floor(active.progress) : 0}
                  </span>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">
                    Accuracy
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-grow space-y-8 overflow-y-auto scrollbar-hide">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Cpu size={14} className="text-blue-500" /> System_Status
                </p>
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-[9px] space-y-3 uppercase tracking-widest font-bold shadow-inner">
                   <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-600">Engine</span>
                      <span className="text-blue-500">v4.0.2-Stable</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-600">Latency</span>
                      <span className="text-emerald-500">14ms</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-600">Status</span>
                      <span className="text-slate-300">{active?.status || 'Standby'}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-6 shrink-0">
              <button
                onClick={() => active && analyzeDocument(active.url)}
                disabled={!active || active.status === "analyzing"}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] disabled:opacity-20 active:scale-95"
              >
                <Bolt size={18} className={active?.status === "analyzing" ? "animate-spin" : ""} />
                Initialize Extraction
              </button>
            </div>
          </aside>
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
      `}</style>
    </div>
  );
}
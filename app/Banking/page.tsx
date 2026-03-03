"use client";

import { useState } from "react";
import Image from "next/image";
import { Bolt, Copy, Upload, ShieldCheck, CheckSquare, Menu, FileText } from "lucide-react";
import Header from "@/components/layout/Header";

export interface UploadedImage {
  url: string;
  name: string;
  status?: "analyzing" | "completed" | "failed";
  progress: number;
  extractedData: Record<string, string>;
}

export default function EnterpriseOCR() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [engineProfile, setEngineProfile] = useState("Ocr to Cheque");
  const [termCopied, setTermCopied] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: File[] = [];
    if ('files' in e.target && e.target.files) {
      files = Array.from(e.target.files);
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      files = Array.from(e.dataTransfer.files);
    }
    if (files.length === 0) return;

    const newImg: UploadedImage = {
      url: URL.createObjectURL(files[0]),
      name: files[0].name,
      status: "analyzing",
      progress: 0,
      extractedData: {}
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
      setImages(prev => prev.map(img => img.url === imgUrl ? { ...img, progress: currentProgress } : img));
    }, 400);

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
                    </div>
                  )}
                </div>
              ) : (
                <label onDragOver={e => e.preventDefault()} onDrop={handleUpload} className="group cursor-pointer flex flex-col items-center justify-center text-center w-full max-w-xl p-4 transition-all">
                  <div className="p-4 rounded-2xl bg-blue-600 shadow-xl mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">Drop device assets here</h3>
                  <p className="text-slate-500 text-xs px-4">Browse files for detection.</p>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

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
              </div>
            </div>
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
                </div>
              )}
            </div>
          </div>
        </div>

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
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{active ? Math.floor(active.progress) : 0}%</span>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Accuracy</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OCR Profile</label>
              <div className="relative group w-full">
                <select
                  value={engineProfile}
                  onChange={e => setEngineProfile(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none cursor-pointer appearance-none"
                >
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
      `}</style>
    </div>
  );
}
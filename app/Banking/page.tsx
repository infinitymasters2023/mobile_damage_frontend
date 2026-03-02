"use client";

import { useState, useMemo } from "react";
import { Bolt, Copy, Bell, Upload, ShieldCheck, CheckSquare, Maximize2 } from "lucide-react";
import Image from "next/image";
import Logo from "@/app/img/infinity-logo-164.png";

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

  // Handle file injection into pipeline
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

    // Simulated API Latency
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
    <div className="h-screen w-full flex flex-col bg-[#050505] text-white overflow-hidden font-sans select-none">

      {/* HEADER */}
      <header className="h-16 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <div className="bg-white p-1.5 rounded-lg shadow-xl shadow-white/5">
            <Image src={Logo} alt="logo" width={90} height={20} className="h-5 object-contain" />
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <span>CORE INTELLIGENCE</span>
            <span className="text-white/20">/</span>
            <span className="text-blue-500">BANKING PIPELINE</span>
          </nav>
        </div>


      </header>

      {/* MAIN CONTENT GRID */}
      <main className="flex-grow flex p-4 gap-4 overflow-hidden h-[calc(100vh-64px-32px)]">

        {/* LEFT COLUMN: SOURCE & TERMINAL (70%) */}
        <div className="flex-[7] flex flex-col gap-4 min-w-0 h-full">

          {/* SOURCE PANEL */}
          <div className="flex-[6] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Live Document Processing</span>
              <span className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> SOURCE
              </span>
            </div>

            <div className="flex-grow flex items-center justify-center p-6 bg-black relative overflow-hidden">
              {active ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  <img src={active.url} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-white/5" alt="source" />
                  {active.status === "analyzing" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-0.5 bg-blue-500/40 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_15px_#3b82f6]" />
                    </div>
                  )}
                </div>
              ) : (
                <label onDragOver={e => e.preventDefault()} onDrop={handleUpload} className="group cursor-pointer flex flex-col items-center justify-center  rounded-[40px] w-full max-w-xl aspect-video  transition-all">
                  <div className="p-4 rounded-2xl bg-blue-600 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-white" size={30} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight text-white">Drop device assets here</h3>
                  <p className="text-slate-500 text-sm text-center px-10 max-w-sm">Drag and drop photos or <span className="text-blue-500 font-bold">browse files</span> for detection.</p>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* TERMINAL PANEL */}
          <div className="flex-[4] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Extraction Terminal</span>
              <div className="flex items-center gap-5">
                <button
                  onClick={handleCopyTerminal}
                  disabled={active?.status !== 'completed'}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors disabled:opacity-20"
                >
                  {termCopied ? <CheckSquare size={14} /> : <Copy size={14} />}
                  {termCopied ? "Copied" : "Copy Data"}
                </button>
                <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2 tracking-widest border-l border-white/10 pl-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> LIVE FEED
                </span>
              </div>
            </div>
            <div className="flex-grow bg-[#050505] p-6 font-mono text-[13px] text-emerald-500 overflow-y-auto leading-relaxed scrollbar-hide">
              {active?.status === "completed" ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <p className="mb-4 font-black">[SUCCESS] AI Extraction Complete:</p>
                  <div className="space-y-1.5">
                    {Object.entries(active.extractedData).map(([key, val]) => (
                      <p key={key} className="flex gap-4">
                        <span className="opacity-50 min-w-[160px] uppercase tracking-tighter">{key} :</span>
                        <span className="font-bold tracking-tight text-white">{val}</span>
                      </p>
                    ))}
                  </div>
                  <p className="mt-4 font-bold text-emerald-600/60 tracking-widest uppercase">[STATUS] SECURELY LOGGED.</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-30">
                  <p className="animate-pulse tracking-[0.3em] text-[11px] uppercase">{"// Awaiting Engine Execution..."}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (30%) */}
        <aside className="flex-[3] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col p-8 overflow-hidden min-w-[340px] shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] -z-10" />
          <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12 text-center">Analysis & Confidence</h3>

          {/* CONFIDENCE ORB */}
          <div className="flex flex-col items-center mb-5">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="86" className="stroke-white/5 fill-none" strokeWidth="10" />
                <circle cx="96" cy="96" r="86" className="stroke-blue-600 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="10" strokeDasharray={540} strokeDashoffset={540 - (540 * (active?.progress || 0)) / 100} strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-white tracking-tighter">{active ? Math.floor(active.progress) : 0}%</span>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Accuracy</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OCR Engine Profile</label>
              <div className="relative group w-full mt-4">
                <select
                  value={engineProfile}
                  onChange={e => setEngineProfile(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-5 pr-12 py-4 text-xs font-bold text-white outline-none cursor-pointer hover:border-blue-500/50 transition-all appearance-none shadow-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                >
                  <option className="bg-[#0a0a0a]">OCR to Cheque</option>
                  <option className="bg-[#0a0a0a]">OCR to Passbook</option>
                  <option className="bg-[#0a0a0a]">OCR Bank ID</option>
                  <option className="bg-[#0a0a0a]">OCR IMEI</option>
                </select>

                {/* Centered Bolt Icon */}
                <Bolt
                  size={14}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-500 transition-colors pointer-events-none"
                />
              </div>
            </div>

            <button onClick={() => active && analyzeDocument(active.url)} disabled={!active || active.status === 'analyzing'} className="w-full py-4 bg-blue-600 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-blue-500 active:scale-[0.98] disabled:opacity-30 transition-all shadow-xl shadow-blue-900/20">
              <Bolt size={18} className={active?.status === 'analyzing' ? 'animate-spin' : ''} /> Run Extraction
            </button>
          </div>

          <button className="w-full py-4 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center gap-3 text-[11px] font-black text-slate-400 hover:text-white transition-all uppercase mt-auto">
            <Copy size={16} /> Copy Raw Data
          </button>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="h-8 border-t border-white/5 bg-black px-8 flex items-center justify-between text-[10px] font-medium text-slate-500 shrink-0">
        <div className="flex items-center gap-4 uppercase tracking-widest">
          <span>&copy; 2026 INFINITY ASSURANCE</span>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> SECURE NODE ACTIVE</div>
        </div>
        <div className="flex gap-6 uppercase tracking-tighter">
          <span className="hover:text-white cursor-pointer transition-colors">Latency: 142ms</span>
          <span className="hover:text-white cursor-pointer transition-colors">Server: AWS-MUM-1</span>
        </div>
      </footer>

      {/* GLOBAL CSS ANIMATIONS */}
      <style jsx global>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        ::-webkit-scrollbar { width: 0px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
}
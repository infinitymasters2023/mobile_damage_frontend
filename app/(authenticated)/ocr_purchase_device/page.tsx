"use client";

import { useState } from "react";
import Image from "next/image";
import { Bolt, Copy, Upload, CheckSquare, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer"; // Optional: Add if needed
import Sidebar from "@/components/layout/Sidebar";

export interface UploadedImage {
  url: string;
  name: string;
  status?: "analyzing" | "completed" | "failed";
  progress: number;
  extractedData: Record<string, any>;
}

export default function EnterpriseOCR() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [termCopied, setTermCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: File[] = [];
    if ('target' in e && 'files' in e.target && e.target.files) {
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
        "documentname": "purchase_device",
        "brand": "SAMSUNG",
        "model": "SM-A166P/DS",
        "memory": "8GB/128GB",
        "imei": ["352456888710157", "354076818710156"],
        "raw_text": "+ MODEL: SM-A166P/DS AVAILABLE STORAGE CAPACITY IS SUBJECT TO PRELOADED SOFTWARE..."
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

  const active = images[activeIndex] || null;

  return (
    // Added h-screen and overflow-hidden to let children handle their own scrolling
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans select-none overflow-hidden">
      
      <Sidebar />

      {/* Main Content Area: Adjusted to allow scrolling inside main */}
      <div className="flex flex-col flex-grow min-w-0">
        <Header title="OCR Purchase Device" />

        <main className="flex-grow flex flex-col lg:flex-row p-3 md:p-4 gap-4 overflow-y-auto lg:overflow-hidden lg:mt-0">

          {/* LEFT COLUMN: SOURCE & TERMINAL */}
          {/* h-full and overflow-hidden on desktop prevents the whole page from bouncing */}
          <div className="flex-[7] flex flex-col gap-4 min-w-0 lg:h-full">

            {/* LIVE DOCUMENT VIEWPORT */}
            <div className="flex-[6] min-h-[400px] lg:min-h-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl relative">
              <div className="p-3 border-b border-white/10 flex justify-between items-center px-4 md:px-6 bg-white/[0.02] shrink-0">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"> 
                  <FileText size={14} className="text-blue-500" /> Live Document
                </span>
                <span className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> SOURCE
                </span>
              </div>

              <div className="flex-grow flex items-center justify-center p-2 md:p-6 bg-black relative overflow-hidden">
                {active ? (
                  <div className="relative h-full w-full">
                    <Image src={active.url} fill className="object-contain rounded-lg shadow-2xl border border-white/5" alt="source" />
                    {active.status === "analyzing" && (
                      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                        <div className="w-full h-0.5 bg-blue-500 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_15px_#3b82f6]" />
                      </div>
                    )}
                  </div>
                ) : (
                  <label onDragOver={e => e.preventDefault()} onDrop={handleUpload} className="group cursor-pointer flex flex-col items-center justify-center text-center w-full max-w-xl p-4 transition-all">
                    <div className="p-4 rounded-2xl bg-blue-600 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="text-white" size={30} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white">Drop device assets</h3>
                    <p className="text-slate-500 text-sm px-6">
                      Drag and drop or <span className="text-blue-500 font-bold underline">browse</span>
                    </p>
                    <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            {/* TERMINAL PANEL */}
            <div className="flex-[4] min-h-[250px] lg:min-h-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl lg:mb-0">
              <div className="p-3 border-b border-white/10 flex justify-between items-center px-4 md:px-6 bg-white/[0.02] shrink-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Terminal</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyTerminal}
                    disabled={active?.status !== 'completed'}
                    className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400 hover:text-emerald-500 transition-colors disabled:opacity-20"
                  >
                    {termCopied ? <CheckSquare size={12} /> : <Copy size={12} />}
                    <span className="hidden sm:inline">{termCopied ? "Copied" : "Copy Data"}</span>
                  </button>
                  <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-2 tracking-widest border-l border-white/10 pl-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span className="hidden sm:inline">LIVE FEED</span>
                  </span>
                </div>
              </div>
              <div className="flex-grow bg-[#050505] p-4 md:p-6 font-mono text-[11px] md:text-[12px] text-emerald-500 overflow-y-auto leading-relaxed scrollbar-hide">
                {active?.status === "completed" ? (
                  <pre className="text-emerald-400 whitespace-pre-wrap break-all">
                    {JSON.stringify(active.extractedData, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center opacity-30">
                    <p className="animate-pulse tracking-[0.2em] text-[10px] uppercase">{"// Engine Idle..."}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: ANALYSIS */}
          <aside className="lg:w-[350px] shrink-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col p-6 md:p-8 shadow-2xl relative lg:h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] -z-10" />
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center shrink-0">Analysis</h3>

            {/* CHART AREA */}
            <div className="flex flex-col items-center mb-6 shrink-0">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
                  <circle cx="96" cy="96" r="86" className="stroke-white/5 fill-none" strokeWidth="10" />
                  <circle cx="96" cy="96" r="86" className="stroke-blue-600 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="10" strokeDasharray={540} strokeDashoffset={540 - (540 * (active?.progress || 0)) / 100} strokeLinecap="round" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-2xl md:text-4xl font-black text-white">{active ? Math.floor(active.progress) : 0}%</span>
                  <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Confidence</span>
                </div>
              </div>
            </div>

            {/* QUEUE & BUTTONS */}
            <div className="flex-grow overflow-y-auto space-y-6 scrollbar-hide">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Queue
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <div key={img.url} onClick={() => setActiveIndex(idx)} 
                        className={`aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all ${activeIndex === idx
                        ? 'border-blue-500 scale-105 shadow-lg' : 'border-white/5 opacity-40 hover:opacity-100'}`} >
                      <Image src={img.url} fill className="object-cover" alt="thumb" />
                    </div>
                  ))}
                  {images.length === 0 && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg border border-dashed border-white/10 bg-white/[0.01]" />
                  ))}
                </div> 
              </div>
            </div>

            <div className="pt-6 shrink-0">
              <button onClick={() => active && analyzeDocument(active.url)} disabled={!active || active.status === 'analyzing'} className="w-full py-4 bg-blue-600 rounded-xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 active:scale-[0.98] disabled:opacity-30 transition-all shadow-xl">
                <Bolt size={16} className={active?.status === 'analyzing' ? 'animate-spin' : ''} /> Run Extraction
              </button>
            </div>
          </aside>
        </main>
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(350px); opacity: 0; } }
        /* Hide scrollbars but keep functionality */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
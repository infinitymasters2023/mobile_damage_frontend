"use client";

import { useState } from "react";
import Image from "next/image";
import { Bolt, Copy, Upload, ShieldCheck, CheckSquare, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
    <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans select-none overflow-x-hidden">
      <Header title="OCR Purchase Device" />

      <main className="flex-grow flex flex-col mt-[70px] lg:mt-[10px] lg:flex-row p-3 md:p-4 gap-4 lg:h-[calc(100vh-64px-32px)]">

        {/* LEFT COLUMN: SOURCE & TERMINAL */}
        <div className="flex-[7] flex flex-col gap-4 min-w-0">

          <div className="flex-[6] min-h-[350px] lg:min-h-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"> 
                <FileText size={14} className="text-blue-500" /> Live Document
              </span>
              <span className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> SOURCE
              </span>
            </div>

            <div className="flex-grow flex items-center justify-center p-4 md:p-6 bg-black relative overflow-hidden">
              {active ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  <Image src={active.url} width={500} height={500} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-white/5" alt="source" />
                  {active.status === "analyzing" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <div className="w-full h-0.5 bg-blue-500/40 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_15px_#3b82f6]" />
                    </div>
                  )}
                </div>
              ) : (
                <label onDragOver={e => e.preventDefault()} onDrop={handleUpload} className="group cursor-pointer flex flex-col items-center justify-center text-center w-full max-w-xl p-4 transition-all">
                  <div className="p-4 rounded-2xl bg-blue-600 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-white" size={30} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">Drop device assets here</h3>
                  <p className="text-slate-500 text-sm text-center px-10 max-w-sm">
                    Drag and drop file or <span className="text-blue-500 font-bold underline">browse files</span> for OCR detection.
                  </p>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                  <div className="flex flex-wrap justify-center gap-2 pt-2 opacity-40 mt-2">
                    {['PNG', 'WEBP', 'SVG', 'JPEG', 'PDF'].map((ext) => (
                      <span key={ext} className="px-2 py-0.5 border border-white/20 rounded text-[9px] font-mono text-slate-300">
                        {ext}
                      </span>
                    ))}
                  </div>
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
                  <pre className="text-emerald-400 whitespace-pre-wrap">
                    {JSON.stringify(active.extractedData, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-30">
                  <p className="animate-pulse tracking-[0.2em] text-[10px] uppercase">{"// Awaiting Engine..."}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="flex-[3] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col p-6 md:p-8 overflow-hidden min-w-full lg:min-w-[340px] shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] -z-10" />
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Analysis</h3>

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
            <div className="relative p-4 rounded-xl backdrop-blur-sm group mb-6">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Pipeline Queue
              </p>
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, idx) => (
                  <div key={img.url} onClick={() => setActiveIndex(idx)} 
                      className={`aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all duration-300 ${activeIndex === idx
                      ? 'border-blue-500 scale-105 shadow-[0_0_15px_#3b82f666] z-10'
                      : 'border-white/5 opacity-40 hover:opacity-100'
                      }`} >
                    <Image src={img.url} fill className="object-cover" alt="thumb" />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 1 - images.length) }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg border border-dashed border-white/10 bg-white/[0.01] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white/5 rounded-full" />
                  </div>
                ))}
              </div> 
              
              <div className="mt-5">
                <button onClick={() => active && analyzeDocument(active.url)} disabled={!active || active.status === 'analyzing'} className="w-full py-4 bg-blue-600 rounded-xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 active:scale-[0.98] disabled:opacity-30 transition-all shadow-xl">
                  <Bolt size={16} className={active?.status === 'analyzing' ? 'animate-spin' : ''} /> Extraction
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>
      <Footer/>
      <style jsx global>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        ::-webkit-scrollbar { width: 0px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
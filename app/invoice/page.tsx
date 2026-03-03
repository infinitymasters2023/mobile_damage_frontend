"use client";

import { useState } from "react";
import { Bolt, Copy, Upload, ShieldCheck, CheckSquare, FileText, Globe, Layers } from "lucide-react";
import Image from "next/image";
import Logo from "@/app/img/infinity-logo-164.png";
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
  const [engineProfile, setEngineProfile] = useState("Standard Invoice V4");
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
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setImages(prev => prev.map(img => img.url === imgUrl ? { ...img, progress: currentProgress } : img));
    }, 350);

    // Neural Engine Simulation Latency
    await new Promise(r => setTimeout(r, 3800));
    
    setImages(prev => prev.map(img => img.url === imgUrl ? {
      ...img,
      status: "completed",
      progress: 100,
      extractedData: {
        "INVOICE_ID": "INV-882910-X",
        "VENDOR": "QUANTUM SYSTEMS SOLUTIONS",
        "BILLING_DATE": "MARCH 02, 2026",
        "TAX_IDENTIFIER": "VAT-US-99128",
        "SUBTOTAL": "$12,450.00",
        "TAX_RATE": "8.5%",
        "TAX_AMOUNT": "$1,058.25",
        "TOTAL_PAYABLE": "$13,508.25",
        "DUE_DATE": "MARCH 30, 2026",
        "PAYMENT_TERMS": "NET-30"
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
      
   <Header title="Invoice" />

      {/* MAIN CONTENT GRID */}
      <main className=" flex-grow flex flex-col mt-[70px] lg:mt-[10px] lg:flex-row p-3 md:p-4 gap-4 lg:h-[calc(100vh-64px-32px)]">
        
        {/* LEFT COLUMN: SOURCE & TERMINAL */}
        <div className="flex-[7] flex flex-col gap-4 min-w-0 h-full ">
          
          {/* SOURCE PANEL */}
          <div className="flex-[6] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} className="text-blue-500" /> Live Document Processing 
              </span>
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
                       <div className="w-full h-[2px] bg-blue-500/60 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_20px_#3b82f6]" />
                       <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                    </div>
                  )}
                </div>
              ) : (
                <label onDragOver={e => e.preventDefault()} onDrop={handleUpload} className="group cursor-pointer flex flex-col items-center justify-center  w-full max-w-xl aspect-video transition-all">
                  <div className="p-4 rounded-2xl bg-blue-600 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-white" size={30} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight text-white">Ingest Invoice Data</h3>
                  <p className="text-slate-500 text-sm text-center px-10 max-w-sm">
                    Drag and drop file or <span className="text-blue-500 font-bold underline">browse files</span> for OCR detection.
                  </p>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* TERMINAL PANEL */}
          <div className="flex-[4] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Extraction Terminal</span>
              <button 
                onClick={handleCopyTerminal}
                disabled={active?.status !== 'completed'}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors disabled:opacity-20"
              >
                {termCopied ? <CheckSquare size={14} /> : <Copy size={14} />}
                {termCopied ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <div className="flex-grow bg-[#050505] p-6 font-mono text-[13px] overflow-y-auto scrollbar-hide">
              {active?.status === "completed" ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <p className="mb-4 font-black text-emerald-500">[SUCCESS] Document Decoded:</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {Object.entries(active.extractedData).map(([key, val]) => (
                       <div key={key} className="flex flex-col border-l border-white/10 pl-3 py-1">
                         <span className="text-[9px] text-slate-500 uppercase tracking-tighter mb-0.5">{key.replace('_', ' ')}</span> 
                         <span className="font-bold tracking-tight text-white">{val}</span>
                       </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                  <Layers className="animate-bounce text-blue-500" />
                  <p className="animate-pulse tracking-[0.3em] text-[10px] uppercase">
                    {active?.status === 'analyzing' ? '// Executing Neural Scan...' : '// Awaiting Pipeline Input...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="flex-[3] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col p-8 overflow-hidden min-w-[340px] shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] -z-10" />
          <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12 text-center">Confidence Index</h3>
          
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="86" className="stroke-white/5 fill-none" strokeWidth="8" />
                <circle cx="96" cy="96" r="86" className="stroke-blue-600 fill-none transition-all duration-700 ease-out" 
                  strokeWidth="8" strokeDasharray={540} strokeDashoffset={540 - (540 * (active?.progress || 0)) / 100} strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-white tracking-tighter">{active ? Math.floor(active.progress) : 0}%</span>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Consistency</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OCR Profile</label>
              <div className="relative mt-[10px]">
                <select 
                  value={engineProfile} 
                  onChange={e => setEngineProfile(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold text-white outline-none cursor-pointer appearance-none"
                >
                  <option>Standard Invoice V4</option>
                  <option>Tax Receipt Alpha</option>
                  <option>Logistics PO Engine</option>
                </select>
                <Bolt size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <button onClick={() => active && analyzeDocument(active.url)} disabled={!active || active.status === 'analyzing'} className="w-full py-4 bg-blue-600 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-blue-500 active:scale-[0.98] disabled:opacity-30 transition-all shadow-xl shadow-blue-900/20">
              <Bolt size={18} className={active?.status === 'analyzing' ? 'animate-spin' : ''} /> Run Extraction
            </button>
          </div>

          <button className="w-full py-4 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase mt-auto">
            <Globe size={16} /> Export to ERP System
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
      </footer>

      {/* GLOBAL ANIMATIONS */}
      <style jsx global>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}
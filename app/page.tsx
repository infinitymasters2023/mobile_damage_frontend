"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import { Bolt, Upload, ShieldCheck, AlertTriangle, Plus, Menu, FileText } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Logo from "@/app/img/infinity-logo-164.png";
import Header from "@/components/layout/Header";

// Define the shape of our Image object
interface DeviceImage {
  url: string;
  name: string;
  status: "analyzing" | "completed";
  progress: number;
  detectedIssues: number[];
}

const DAMAGE_MAP: Record<number, string> = {
  0: "back_crack",
  1: "back_scratch",
  2: "back_dent",
  3: "back_corner_damage",
  4: "camera_damage",
  5: "screen_crack",
  6: "screen_scratch",
  7: "screen_shatter",
  8: "screen_dead_pixels",
  9: "screen_line_issue",
  10: "screen_burn"
};

export default function MobileDamageAI() {
  const [images, setImages] = useState<DeviceImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const processFiles = (files: File[]) => {
    const newImages: DeviceImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      status: "analyzing",
      progress: 0,
      detectedIssues: []
    }));

    setImages(prev => [...prev, ...newImages]);
    newImages.forEach((img) => analyzeDevice(img.url));
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const analyzeDevice = async (imgUrl: string) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setImages(prev => prev.map(img => 
        img.url === imgUrl ? { ...img, progress: Math.min(currentProgress, 100) } : img
      ));
    }, 400);

    // Simulate AI Processing Delay
    await new Promise(r => setTimeout(r, 3000));

    setImages(prev => prev.map(img => img.url === imgUrl ? {
      ...img,
      status: "completed",
      progress: 100,
      detectedIssues: [0, 4, 7]
    } : img));
  };

  const active = images[activeIndex] || null;
  const visibleImages = images.slice(0, 6);
  const remainingCount = images.length > 6 ? images.length - 6 : 0;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans">

      <Header title="Mobile Damage AI"></Header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col mt-[70px] lg:mt-[10px] lg:flex-row p-3 md:p-4 gap-4 lg:h-[calc(100vh-64px-32px)]">
        
        {/* Visual & Terminal Area */}
        <div className="flex-[7] flex flex-col gap-4 min-w-0">
          <div className="flex-[6] min-h-[400px] lg:min-h-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden relative">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"> <FileText size={14} className="text-blue-500" /> Visual Analysis </span>
              <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">● SOURCE_NODE</span>
            </div>
            
            <div className="flex-grow flex items-center justify-center p-4 bg-black relative">
              {active ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  <Image src={active.url} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" alt="source" fill sizes="(max-width: 1024px) 100vw, 70vw" />
                  {active.status === "analyzing" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-0.5 bg-blue-500/40 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_15px_#3b82f6]" />
                    </div>
                  )}
                </div>
              ) : (
                <label 
                  onDragOver={e => e.preventDefault()} 
                  onDrop={handleDrop} 
                  className="group cursor-pointer flex flex-col items-center justify-center w-full h-full  rounded-3xl hover:border-blue-500/50 transition-colors"
                >
                  <div className="p-4 rounded-2xl bg-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold">Inject Device Assets</h3>
                  <p className="text-slate-500 text-sm mt-2">Drag and drop or <span className="text-blue-500">browse</span></p>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" multiple />
                </label>
              )}
            </div>
          </div>

          <div className="flex-[4] min-h-[200px] lg:min-h-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inference Terminal</span>
              <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">● LIVE</span>
            </div>
            <div className="flex-grow bg-[#050505] p-6 font-mono text-[13px] text-emerald-500 overflow-y-auto">
              {active?.status === "completed" ? (
                <div className="space-y-2">
                  <p className="text-red-400 font-bold flex items-center gap-2"><AlertTriangle size={14}/> ANOMALIES_FOUND:</p>
                  {active.detectedIssues.map(id => (
                    <p key={id} className="pl-4 opacity-90">{`> [ID_${id}] ${DAMAGE_MAP[id]}`}</p>
                  ))}
                </div>
              ) : (
                <p className="opacity-30 text-center mt-4">{"// STANDBY_FOR_INPUT"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Confidence Aside */}
        <aside className="flex-[3] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col p-6 min-w-0 lg:min-w-[340px]">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Confidence Index</h3>
          <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-white/5 fill-none" strokeWidth="6" />
              <circle cx="50" cy="50" r="45" className="stroke-blue-600 fill-none transition-all duration-700"
                strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * (active?.progress || 0)) / 100} strokeLinecap="round" />
            </svg>
            <span className="text-4xl font-black">{active ? Math.floor(active.progress) : 0}%</span>
          </div>

          <div className="flex-grow">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">Pipeline Queue</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {visibleImages.map((img, idx) => (
                <div key={img.url} onClick={() => setActiveIndex(idx)} className={`aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all ${activeIndex === idx ? 'border-blue-500 scale-95' : 'border-transparent opacity-50'}`}>
                  <Image src={img.url} fill className="object-cover" alt="thumb" />
                </div>
              ))}
              {remainingCount > 0 && <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center text-xs">+{remainingCount}</div>}
            </div>
            <button disabled={!active || active.status === 'analyzing'} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all">
              Run Full Assessment
            </button>
          </div>
        </aside>
      </main>

      <footer className="h-10 border-t border-white/5 bg-black px-6 flex items-center justify-between text-[9px] text-slate-600 uppercase">
        <div className="flex items-center gap-4">
          <span>© 2026 INFINITY</span>
          <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-emerald-500" /> Secure Node</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(400px); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
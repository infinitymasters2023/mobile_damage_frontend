"use client";

import { useState } from "react";
import { Bolt, Bell, Upload, ShieldCheck, AlertTriangle, Plus } from "lucide-react";
import Image from "next/image";
import Logo from "@/app/img/infinity-logo-164.png";

// Damage Classification Mapping
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
  const [images, setImages] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleUpload = (e: any) => {
    let files = e.target.files ? Array.from(e.target.files) : Array.from(e.dataTransfer.files);
    const newImages = files.map((file: any) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      status: "analyzing",
      progress: 0,
      detectedIssues: []
    }));

    setImages(prev => [...prev, ...newImages]);
    newImages.forEach((img: any) => analyzeDevice(img.url));
  };

  const analyzeDevice = async (imgUrl: string) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setImages(prev => prev.map(img => img.url === imgUrl ? { ...img, progress: currentProgress } : img));
    }, 400);

    await new Promise(r => setTimeout(r, 3000));

    setImages(prev => prev.map(img => img.url === imgUrl ? {
      ...img,
      status: "completed",
      progress: 100,
      detectedIssues: [0, 4, 7] // Specific detected anomalies
    } : img));
  };

  const active = images[activeIndex] || null;
  const visibleImages = images.slice(0, 6);
  const remainingCount = images.length > 6 ? images.length - 6 : 0;

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] text-white overflow-hidden font-sans">
      <header className="h-16 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <div className="bg-white p-1.5 rounded-lg">
            <Image src={Logo} alt="logo" width={90} height={20} className="h-5 object-contain" />
          </div>
          <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <span>CORE INTELLIGENCE</span>
            <span className="text-white/20">/</span>
            <span className="text-blue-500">DAMAGE ASSESSMENT</span>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex p-4 gap-4 overflow-hidden h-[calc(100vh-64px-32px)]">
        <div className="flex-[7] flex flex-col gap-4 min-w-0 h-full">
          <div className="flex-[6] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Visual Analysis</span>
              <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">● SOURCE_NODE</span>
            </div>
            <div className="flex-grow flex items-center justify-center p-6 bg-black relative overflow-hidden">
              {active ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  <Image src={active.url} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-white/5" alt="source" fill />
                  {active.status === "analyzing" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-0.5 bg-blue-500/40 absolute top-0 animate-[scan_3s_infinite_linear] shadow-[0_0_15px_#3b82f6]" />
                    </div>
                  )}
                </div>
              ) : (
                <label onDragOver={e => e.preventDefault()} onDrop={handleUpload} className="group cursor-pointer flex flex-col items-center justify-center rounded-[40px] w-full max-w-xl aspect-video transition-all">
                  <div className="p-4 rounded-2xl bg-blue-600 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-white" size={30} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight text-white">Drop device assets here</h3>
                  <p className="text-slate-500 text-sm text-center px-10 max-w-sm">Drag and drop photos or <span className="text-blue-500 font-bold">browse files</span> for detection.</p>

                  {/* Updated Input */}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    accept="image/*"
                    multiple
                  />
                </label>
              )}
            </div>
          </div>

          {/* CLEANED INFERENCE TERMINAL */}
          <div className="flex-[4] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-white/10 flex justify-between items-center px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inference Terminal</span>
              <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">● LIVE FEED</span>
            </div>
            <div className="flex-grow bg-[#050505] p-6 font-mono text-[13px] text-emerald-500 overflow-y-auto">
              {active?.status === "completed" ? (
                <div className="animate-in fade-in duration-500">
                  <p className="text-red-400 mb-4 font-black uppercase tracking-tighter flex items-center gap-2">
                    <AlertTriangle size={16} /> Detected Anomalies:
                  </p>
                  <div className="space-y-2 pl-6">
                    {active.detectedIssues.map((id: number) => (
                      <p key={id} className="text-red-400 flex items-center gap-3">
                        <span className="opacity-30">[{id}]</span>
                        <span className="font-bold uppercase tracking-tight">{DAMAGE_MAP[id]}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-30 uppercase tracking-[0.3em] text-[11px]">
                  {"// Waiting for engine injection..."}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="flex-[3] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col p-8 overflow-hidden min-w-[340px]">
          <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 text-center">Confidence Index</h3>
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="86" className="stroke-white/5 fill-none" strokeWidth="10" />
                <circle cx="96" cy="96" r="86" className="stroke-blue-600 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="10" strokeDasharray={540} strokeDashoffset={540 - (540 * (active?.progress || 0)) / 100} strokeLinecap="round" />
              </svg>
              <span className="text-5xl font-black text-white tracking-tighter">{active ? Math.floor(active.progress) : 0}%</span>
            </div>
          </div>
          <div className="space-y-8 flex-grow">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pipeline Queue (Top 6)</label>
              <div className="grid grid-cols-3 gap-2">
                {visibleImages.map((img: any, idx: number) => (
                  <div key={img.url} onClick={() => setActiveIndex(idx)} className={`aspect-square rounded-xl border-2 transition-all cursor-pointer overflow-hidden relative ${activeIndex === idx ? 'border-blue-500' : 'border-white/5 opacity-40 hover:opacity-100'}`}>
                    <Image src={img.url} fill className="object-cover" alt="queue" />
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-blue-500 font-black">
                    <span className="text-xs">+{remainingCount}</span>
                    <Plus size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
            <button disabled={!active || active.status === 'analyzing'} className="w-full py-4 bg-blue-600 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-blue-500 disabled:opacity-30 transition-all mt-auto shadow-xl shadow-blue-900/20">
              <Bolt size={18} /> Run Assessment
            </button>
          </div>
        </aside>
      </main>

      <footer className="h-8 border-t border-white/5 bg-black px-8 flex items-center justify-between text-[10px] font-medium text-slate-500 uppercase tracking-widest shrink-0">
        <div className="flex items-center gap-4">
          <span>&copy; 2026 INFINITY ASSURANCE</span>
          <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> NODE ACTIVE</div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}
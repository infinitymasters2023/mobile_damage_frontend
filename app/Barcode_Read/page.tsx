"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Barcode, Scan, Copy, CheckSquare, Upload, X, Database, Zap, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";

interface ScannedItem {
  id: string;
  data: string;
  type: string;
  timestamp: string;
}

export default function BarcodeReader() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedItem | null>(null);
  const [history, setHistory] = useState<ScannedItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0); // Added missing state

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      runScanner();
    }
  };

  const runScanner = async () => {
    setIsScanning(true);
    setScannedData(null);
    setProgress(0);
    
    // Simulate Progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    // Simulate Neural Decoding
    await new Promise((r) => setTimeout(r, 3000));
    
    const result: ScannedItem = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      data: "8806095784168",
      type: "EAN_13 / BARCODE",
      timestamp: new Date().toLocaleTimeString()
    };

    setScannedData(result);
    setHistory(prev => [result, ...prev]);
    setIsScanning(false);
    setProgress(100);
  };

  const handleCopy = () => {
    if (scannedData) {
      navigator.clipboard.writeText(scannedData.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-x-hidden">
      <Header title="Barcode Read" />

      <main className="flex-grow flex flex-col mt-[80px] lg:mt-[20px] lg:flex-row p-3 md:p-4 gap-4 lg:h-[calc(100vh-100px)]">
        
        {/* LEFT COLUMN: VIEWFINDER & TERMINAL */}
        <div className="flex-[7] flex flex-col gap-4 min-w-0">
          
          {/* SCANNER VIEWFINDER */}
          <div className="flex-[6] min-h-[400px] lg:min-h-0 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden relative shadow-2xl">
            <div className="p-3 border-b border-white/10 px-6 bg-white/[0.02] flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"> 
                <Scan size={14} className="text-blue-500" /> Scanner Viewfinder
              </span>
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Live_Rec</span>
              </div>
            </div>

            <div className="flex-grow flex items-center justify-center p-8 bg-black relative overflow-hidden">
              {image ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  <Image src={image} fill className="object-contain opacity-70" alt="barcode source" />
                  
                  {/* SCANNING LASER ANIMATION */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                      <div className="w-full h-[2px] bg-red-600 absolute animate-[scan_2s_infinite_linear] shadow-[0_0_15px_#dc2626] z-10" />
                      <div className="absolute inset-0 bg-red-900/10 animate-pulse" />
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { setImage(null); setScannedData(null); setProgress(0); }} 
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-red-500/20 text-white transition-all z-20"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="group cursor-pointer flex flex-col items-center justify-center space-y-6">
                  <div className="relative p-10 rounded-3xl border-2 border-dashed border-white/10 group-hover:border-blue-500/50 transition-all">
                    <Barcode size={48} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                    <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-blue-500" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-blue-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold uppercase tracking-tight">Inject Barcode Asset</h3>
                    <p className="text-slate-500 text-sm mt-1 px-8">Upload image for neural symbology detection</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                </label>
              )}
            </div>
          </div>

          {/* DECODER TERMINAL */}
          <div className="flex-[3] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/10 px-6 bg-white/[0.02] flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Symbology Decoder</span>
              {scannedData && (
                <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-400 transition-colors">
                  {copied ? <CheckSquare size={16} /> : <Copy size={16} />}
                </button>
              )}
            </div>
            <div className="flex-grow bg-[#050505] p-6 font-mono text-[13px] text-emerald-500">
              {scannedData ? (
                <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p><span className="opacity-40">STATUS:</span> SUCCESS_DECODE</p>
                  <p><span className="opacity-40">FORMAT:</span> {scannedData.type}</p>
                  <p><span className="opacity-40">STRING:</span> <span className="text-white font-bold">{scannedData.data}</span></p>
                  <p><span className="opacity-40">HASH_ID:</span> {scannedData.id}</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 opacity-20 italic h-full justify-center">
                  {isScanning ? (
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="animate-spin text-blue-500" size={20} />
                       <span className="text-[10px] tracking-widest uppercase">Analyzing...</span>
                    </div>
                  ) : <span>// Awaiting capture...</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: SCAN HISTORY */}
        <aside className="flex-[3] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl lg:min-w-[340px]">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Session History</h3>
            <p className="text-[9px] text-slate-600 font-bold uppercase">Stored in volatile memory</p>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-500">{item.type}</span>
                    <span className="text-[9px] text-slate-600">{item.timestamp}</span>
                  </div>
                  <p className="text-sm font-mono font-bold tracking-wider text-slate-200 truncate">{item.data}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                <Database size={40} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-center px-12">No data packets detected</p>
              </div>
            )}
          </div>

          {/* Corrected Confidence & Progress Area */}
          <div className="p-6 mt-auto border-t border-white/10 bg-white/[0.01] space-y-4">
             <div className="flex justify-between items-end text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>Inference Confidence</span>
                <span className="text-blue-500">{Math.floor(progress)}%</span>
             </div> 
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 ease-out shadow-[0_0_8px_#2563eb]" 
                  style={{ width: `${progress}%` }} 
                />
             </div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
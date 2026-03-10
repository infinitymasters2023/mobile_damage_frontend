"use client";

import { useState } from "react";
import { Languages, Copy, CheckSquare, FileAudio, Loader2, Upload, X, ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Define structure for the uploaded asset
interface AudioAsset {
  name: string;
  size: string;
  url: string;
}

export default function AudioTranslate() {
  const [file, setFile] = useState<AudioAsset | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetLanguage, setTargetLanguage] = useState("es");

  const languages = [
    { code: "es", name: "Spanish (ES)" },
    { code: "fr", name: "French (FR)" },
    { code: "de", name: "German (DE)" },
    { code: "hi", name: "Hindi (HI)" },
    { code: "ja", name: "Japanese (JA)" },
  ];

  // --- AUTOMATIC DETECTION LOGIC ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const asset = {
        name: uploadedFile.name,
        size: (uploadedFile.size / (1024 * 1024)).toFixed(2) + " MB",
        url: URL.createObjectURL(uploadedFile)
      };
      setFile(asset);
      runInference(asset.name);
    }
  };

  const runInference = async (fileName: string) => {
    setIsProcessing(true);
    setTranscript("");
    setTranslation("");
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 300);

    await new Promise((r) => setTimeout(r, 3500));
    
    setTranscript(`Inference complete for ${fileName}. Audio stream identifies critical hardware failure in the primary circuit.`);
    setTranslation(`Translated Output [${targetLanguage.toUpperCase()}]: Analysis identifies critical hardware failure.`);
    setIsProcessing(false);
  };

  const resetEngine = () => {
    setFile(null);
    setTranscript("");
    setTranslation("");
    setProgress(0);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-x-hidden">
      <Header title="Audio Translate" />
      <main className="flex-grow flex flex-col mt-[80px] lg:mt-[0px] lg:flex-row p-3 md:p-4 gap-4">
        
        {/* LEFT COLUMN: AUTO-DETECTION UPLOAD */}
        <div className="flex-[7] flex flex-col gap-4 min-w-0">
          <div className="flex-[6] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden relative shadow-2xl">
            <div className="p-3 border-b border-white/10 px-6 bg-white/[0.02] flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"> 
                <FileAudio size={14} className="text-blue-500" /> Audio Asset Node
              </span>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-black relative">
              {file ? (
                <div className="w-full max-w-md p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center animate-in zoom-in-95 duration-500">
                  <div className="p-5 rounded-2xl bg-blue-600/20 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                    <FileAudio size={48} className="text-blue-500" />
                  </div>
                  <h4 className="font-bold text-center truncate w-full px-4 text-lg">{file.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">{file.size} • DETECTED</p>
                  
                  <button onClick={resetEngine} className="mt-8 flex items-center gap-2 text-[10px] font-black text-red-500/80 hover:text-red-400 transition-all uppercase tracking-tighter">
                    <X size={14} /> Purge Asset
                  </button>
                </div>
              ) : (
                <label className="group cursor-pointer flex flex-col items-center justify-center space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/10 blur-[60px] rounded-full group-hover:bg-blue-600/30 transition-all" />
                    <div className="relative p-8 rounded-full bg-blue-600 group-hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                      <Upload size={36} />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight">Inject Audio Stream</h3>
                    <p className="text-slate-500 text-sm px-12">Automatic detection will initiate upon upload</p>
                  </div>
                  <input type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} />
                </label>
              )}
            </div>
          </div>

          <div className="flex-[4] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/10 px-6 bg-white/[0.02]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inference Transcript</span>
            </div>
            <div className="flex-grow bg-[#050505] p-6 font-mono text-[13px] text-emerald-500/90 leading-relaxed overflow-y-auto">
              {transcript ? (
                <p className="animate-in fade-in duration-700">{transcript}</p>
              ) : (
                <p className="opacity-20 italic">{"// System standing by for asset injection..."}</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MULTI-LANGUAGE SELECT & OUTPUT */}
        <aside className="flex-[4] rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl">
          <div className="p-3 border-b border-white/10 px-6 bg-white/[0.02] flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Languages size={14} className="text-blue-500" /> Neural Output
            </span>
            {translation && (
               <button onClick={() => {navigator.clipboard.writeText(translation); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="text-slate-400 hover:text-white transition-colors">
                {copied ? <CheckSquare size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            )}
          </div>
          
          <div className="flex-grow p-6 flex flex-col gap-8">
            {/* MULTI-LANGUAGE SELECTOR */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Target Language</label>
              <div className="relative group mt-1">
                <select 
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white/5 border border-white/10 font-bold text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/50 transition-all hover:bg-white/[0.08]"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#0a0a0a] text-white">
                      {lang.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-500 transition-colors">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="flex-grow bg-black/50 rounded-2xl p-5 border border-white/5 font-mono text-sm leading-relaxed text-blue-400/90 overflow-y-auto">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 opacity-60">
                  <Loader2 className="animate-spin text-blue-500" size={28} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Processing Audio Packets...</span>
                </div>
              ) : (
                translation || <span className="opacity-20 italic">Awaiting source detection...</span>
              )}
            </div>

            <div className="mt-auto space-y-5">
               <div className="flex justify-between items-end text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Inference Confidence</span>
                  <span className="text-blue-500">{Math.floor(progress)}%</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_10px_#2563eb]" 
                    style={{ width: `${progress}%` }} 
                  />
               </div>
               <button disabled={!translation} className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-200 disabled:opacity-20 transition-all active:scale-95 shadow-xl">
                  Synthesize Result
               </button>
            </div>
          </div>
        </aside>
      </main>
    
    </div>
  );
}
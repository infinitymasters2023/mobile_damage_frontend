"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, FileSearch, Terminal, UploadCloud, FileIcon } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const DOC_CONFIG = [
  { id: "Oppo", label: "Oppo Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Nothing", label: "Nothing Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Vivo", label: "Vivo Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Samsung", label: "Samsung Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Hitachi", label: "Hitachi Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Motorola", label: "Motorola Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Apple", label: "Apple Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Xiaomi", label: "Xiaomi Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Lg", label: "Lg Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Panasonic", label: "Panasonic Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Purchase Bill", label: "Purchase Bill Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Sony", label: "Sony Invoice", endpoint: "/upload/invoice-pages" },
  { id: "Lava", label: "Lava Invoice", endpoint: "/upload/invoice-pages" },
];

const API_BASE = "https://infyverifyapi.infyshield.com";

export default function EnterpriseOCR() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // ✅ SET DEFAULT HERE: Use the 'id' from DOC_CONFIG
  const [selectedType, setSelectedType] = useState("Oppo"); 
  
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTask = tasks.find(t => t.id === activeId) || (tasks.length > 0 ? tasks[tasks.length - 1] : null);

  useEffect(() => {
    return () => tasks.forEach(t => t.preview && URL.revokeObjectURL(t.preview));
  }, [tasks]);

  const handleUpload = (e: any) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((file: any) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      protocol: selectedType,
      mimeType: file.type.includes("pdf") ? "pdf" : "image",
      status: "uploading",
      progress: 0,
    }));

    setTasks(prev => [...prev, ...newFiles]);
    newFiles.forEach((task: any) => processTask(task));
    setIsDragging(false);
  };

  const processTask = async (task: any) => {
    let progressInterval = setInterval(() => {
      setTasks(prev => prev.map(t => (t.id === task.id && t.progress < 90) ? { ...t, progress: t.progress + 5 } : t));
    }, 200);

    try {
      const fData = new FormData();
      fData.append("file", task.file);
      const res = await fetch("/api/upload", { method: "POST", body: fData });
      if (!res.ok) throw new Error("Storage Rejection");
      const { virtualPath } = await res.json();

      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "processing", vPath: virtualPath } : t));

      const config = DOC_CONFIG.find(c => c.id === task.protocol);
      const ocrRes = await fetch(`${API_BASE}${config?.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: virtualPath,
          documentname: task.protocol,
          UploadedBy: "AI_Enterprise_User",
        }),
      });

      const ocrData = await ocrRes.json();
      clearInterval(progressInterval);

      if (!ocrRes.ok) throw new Error(ocrData.message || "OCR Protocol Error");
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "success", progress: 100, result: ocrData } : t));
    } catch (err: unknown) {
    
  };

  return (
    <div className="flex h-screen w-full bg-[#020202] text-slate-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-grow min-w-0">
        <Header
          title="Mobile Damage"
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onUpload={() => fileInputRef.current?.click()}
        />

        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />

        <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">

          {/* QUEUE SIDEBAR */}
          <aside className="w-full lg:w-80 bg-[#0a0a0a] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl shrink-0">
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between font-black text-[10px] uppercase tracking-widest text-slate-500">
              Percentage
              <span className="bg-blue-600/20 text-blue-500 px-2 rounded-md">{tasks.length}</span>
            </div>

            <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {tasks.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 text-center">
                  <FileIcon size={40} strokeWidth={1} className="mb-2" />
                  <p className="text-[10px] uppercase font-black tracking-widest">Awaiting Data</p>
                </div>
              )}
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setActiveId(task.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${activeId === task.id ? 'bg-blue-600/10 border-blue-500/40 shadow-lg' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-slate-400 truncate w-32 uppercase">{task.file.name}</span>
                    <span className={`text-[10px] font-black ${task.status === 'success' ? 'text-emerald-400' : 'text-blue-500'}`}>
                      {task.progress}%
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                    <div className={`h-full transition-all duration-500 ${task.status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }} />
                  </div>
                  <span className="text-[7px] font-black uppercase text-slate-600 tracking-tighter">Node: {task.protocol}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* CENTRAL WORKSPACE */}
          <section className="flex-grow flex flex-col gap-4 min-w-0">

            {/* INGEST & VIEWPORT ZONE */}
            <div
              className={`flex-[3] rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col min-h-[450px]
                ${isDragging ? 'bg-blue-600/10 border-blue-500 border-dashed scale-[0.995]' : 'bg-[#070707] border-white/5'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); handleUpload(e); }}
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md shrink-0 z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileSearch size={14} className="text-blue-500" /> Read Purchase Device
                </span>
              </div>

              <div className="flex-grow relative overflow-hidden bg-[#050505] flex items-center justify-center">
                {activeTask ? (
                  <div className="w-full h-full p-4 lg:p-8 flex items-center justify-center animate-in zoom-in duration-300">
                    <div className="relative w-full h-full max-w-5xl overflow-hidden bg-black flex items-center justify-center rounded-xl border border-white/5">
                      {activeTask.mimeType === 'pdf' ? (
                        <iframe
                          src={activeTask.preview}
                          className="w-full h-full border-none"
                          title="PDF Viewport"
                        />
                      ) : (
                        <img
                          src={activeTask.preview}
                          className="max-w-full max-h-full object-contain"
                          alt="Asset Preview"
                        />
                      )}

                      {activeTask.status !== 'success' && (
                        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                          <div className="w-full h-[3px] bg-blue-500 absolute top-0 animate-scan shadow-[0_0_15px_#3b82f6]" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 lg:p-12 w-full h-full">
                    <div className="w-full h-full  flex flex-col items-center justify-center">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner animate-pulse group hover:bg-blue-600/10 transition-colors">
                        <UploadCloud size={40} className="text-blue-500" />
                      </div>
                      <h3 className="text-sm lg:text-base font-black uppercase tracking-[0.2em] mb-2 text-white">Initialize Data Ingest</h3>
                      <p className="text-[10px] lg:text-xs text-slate-500 max-w-xs leading-relaxed mb-8">
                        Process <span className="text-blue-400 font-bold">{DOC_CONFIG.find(c => c.id === selectedType)?.label}</span> assets.
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95"
                      >
                        Browse System Files
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DECODED DATA TERMINAL */}
            <div className="flex-[2] bg-black rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
              <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-500" /> Decoded_Metadata
                </span>
              </div>
              <div className="flex-grow p-6 font-mono text-emerald-400/80 text-[11px] overflow-y-auto custom-scrollbar leading-relaxed">
                {activeTask?.status === 'success' ? (
                  <pre className="animate-in fade-in duration-500">{JSON.stringify(activeTask.result, null, 2)}</pre>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center opacity-20 gap-4">
                    {activeTask && <Loader2 className="animate-spin text-blue-500" />}
                    <p className="uppercase text-[9px] tracking-[0.3em] font-black">Awaiting Stream Verification...</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
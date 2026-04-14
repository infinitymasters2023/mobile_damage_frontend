"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Loader2,
  FileSearch,
  Terminal,
  FileIcon,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface DocConfig {
  id: string;
  label: string;
  endpoint: string;
}

interface OCRTask {
  id: string;
  file: File;
  preview: string;
  protocol: string;
  mimeType: "pdf" | "image";
  status: "uploading" | "processing" | "success" | "error";
  progress: number;
  result?: any;
  vPath?: string;
}

const DOC_CONFIG: DocConfig[] = [
  { id: "Oppo", label: "Oppo Invoice", endpoint: "/ocr/oppo" },
];

const API_BASE = "https://infyverifyapi.infyshield.com";

export default function EnterpriseOCR() {
  const [tasks, setTasks] = useState<OCRTask[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("Oppo");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTask =
    tasks.find((t) => t.id === activeId) ||
    (tasks.length > 0 ? tasks[tasks.length - 1] : null);

  useEffect(() => {
    return () => {
      tasks.forEach((t) => t.preview && URL.revokeObjectURL(t.preview));
    };
  }, [tasks]);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let files: FileList | null = null;

    if ("dataTransfer" in e) {
      files = e.dataTransfer.files;
    } else if (e.target.files) {
      files = e.target.files;
    }

    if (!files || files.length === 0) return;

    const newFiles: OCRTask[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      protocol: selectedType,
      mimeType: file.type.includes("pdf") ? "pdf" : "image",
      status: "uploading",
      progress: 0,
    }));

    setTasks((prev) => [...prev, ...newFiles]);
    newFiles.forEach((task) => processTask(task));
    setIsDragging(false);
  };

  const processTask = async (task: OCRTask) => {
    let progressInterval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id && t.progress < 90
            ? { ...t, progress: t.progress + 5 }
            : t
        )
      );
    }, 200);

    try {
      const fData = new FormData();
      fData.append("file", task.file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fData,
      });

      if (!res.ok) throw new Error("Storage Rejection");

      const { virtualPath } = await res.json();

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, status: "processing", vPath: virtualPath }
            : t
        )
      );

      const config = DOC_CONFIG.find((c) => c.id === task.protocol);

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

      if (!ocrRes.ok) {
        throw new Error(ocrData.message || "OCR Protocol Error");
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: "success",
                progress: 100,
                result: ocrData,
              }
            : t
        )
      );
    } catch (err: unknown) {
      clearInterval(progressInterval);

      // ✅ FIXED ERROR HANDLING
      const errorMessage =
        err instanceof Error ? err.message : "Unknown Error Occurred";

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: "error",
                progress: 0,
                result: errorMessage,
              }
            : t
        )
      );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020202] text-slate-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-grow min-w-0">
        <Header
          title="COI"
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onUpload={() => fileInputRef.current?.click()}
        />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />

        <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
          <aside className="w-full lg:w-80 bg-[#0a0a0a] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl shrink-0">
            <div className="p-5 border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 flex justify-between">
              Queue
              <span className="text-blue-500">{tasks.length}</span>
            </div>

            <div className="flex-grow overflow-y-auto p-3 space-y-2">
              {tasks.length === 0 && (
                <div className="h-full flex items-center justify-center opacity-20">
                  <FileIcon />
                </div>
              )}

              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setActiveId(task.id)}
                  className="w-full text-left p-3 rounded-xl border border-white/5"
                >
                  <div className="flex justify-between">
                    <span className="text-xs truncate">{task.file.name}</span>
                    <span className="text-xs text-blue-400">
                      {task.progress}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex-grow flex flex-col gap-4">
            <div className="flex-1 bg-[#070707] rounded-3xl border border-white/5 flex items-center justify-center">
              {activeTask ? (
                <div className="text-xs">{activeTask.file.name}</div>
              ) : (
                <div className="opacity-40">Upload Files</div>
              )}
            </div>

            <div className="flex-1 bg-black rounded-3xl border border-white/5 p-4 overflow-auto text-green-400 text-xs">
              {activeTask?.result ? (
                <pre>{JSON.stringify(activeTask.result, null, 2)}</pre>
              ) : (
                <div className="opacity-30 flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Waiting...
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
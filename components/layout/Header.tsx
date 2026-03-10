"use client";

import React from "react";
import Image from "next/image";
import { Cpu, ChevronDown, Upload } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  title: string;
  selectedType: string;
  setSelectedType: (val: string) => void;
  docConfig: { id: string; label: string }[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function Header({
  title,
  selectedType,
  setSelectedType,
  docConfig,
  onUpload,
  fileInputRef,
}: HeaderProps) {
  const pathname = usePathname();

  // Logic to determine if we show the HUD or Standard style
  const isOCRPage = pathname.includes("/banking") || pathname.includes("/invoice");

  return (
    <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-50 sticky top-0">
      <div className="flex items-center gap-8">
        {/* LOGO */}
        <div className="bg-white p-1.5 px-3 rounded-lg shadow-xl">
          <Image 
            src="/img/infyeazy_logo.svg" 
            alt="Logo" 
            width={120} 
            height={150} 
            className="object-cover" 
            priority 
            unoptimized 
          />
        </div>

        {/* PROTOCOL SELECTOR (Only shown on OCR pages) */}
        {isOCRPage && (
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            <div className="px-3 flex items-center gap-2 border-r border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <Cpu size={12} className="text-blue-500" /> Protocol:
            </div>
            <div className="relative group">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent text-[10px] font-bold text-blue-500 uppercase tracking-tighter outline-none cursor-pointer pr-6 appearance-none"
              >
                {docConfig.map((c) => (
                  <option key={c.id} value={c.id} className="bg-black text-white">
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
            </div>
          </div>
        )}
      </div>

      {/* ACTION BUTTON */}
      <div className="flex items-center gap-4">
        {isOCRPage ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2"
          >
            <Upload size={14} /> Ingest Assets
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={onUpload}
              accept="image/*,application/pdf"
            />
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/20 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">System Active</span>
          </div>
        )}
      </div>
    </header>
  );
}
"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Removed useEffect theme observer to stick to Dark Mode only

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) onUpload(Array.from(e.dataTransfer.files));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative group cursor-pointer transition-all duration-500 rounded-[32px] sm:rounded-[40px] border-2 border-dashed 
        /* Permanent Dark Mode Classes */
        ${isDragging 
          ? "border-blue-500 bg-blue-500/10 scale-[0.99] shadow-[0_0_40px_rgba(59,130,246,0.2)]" 
          : "border-white/10 bg-white/5 hover:border-white/20"
        }`}
    >
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
        onChange={(e) => e.target.files && onUpload(Array.from(e.target.files))} 
      />

      <div className="py-10 sm:py-16 flex flex-col items-center text-center px-6">
        {/* Animated Icon Container */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative bg-blue-600 rounded-2xl p-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Upload className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-2 text-white">
          Drop device assets here
        </h2> 
        
        <p className="text-xs sm:text-sm max-w-[280px] mb-8 text-slate-400 leading-relaxed">
          Drag and drop photos or <span className="text-blue-500 font-semibold">browse files</span> for AI-powered detection.
        </p>

        {/* Format Status Pills */}
        <div className="flex gap-2">
          {['PNG', 'JPG', 'WEBP'].map((type) => (
            <span 
              key={type} 
              className="px-3 py-1 rounded-full text-[9px] font-black border bg-white/5 border-white/5 text-slate-500 tracking-widest"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Background Icon */}
      <div className="absolute bottom-4 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
         <ImageIcon className="w-12 h-12 text-blue-500" />
      </div>
    </div>
  );
}
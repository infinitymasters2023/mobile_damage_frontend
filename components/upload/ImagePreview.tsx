"use client";

import Image from "next/image";
import { UploadedImage } from "./upload";


interface ImagePreviewProps {
  files: UploadedImage[];
  selectedImages: UploadedImage[];
  toggleSelect: (image: UploadedImage) => void;
}

export default function ImagePreview({ files, selectedImages, toggleSelect }: ImagePreviewProps) {
  // Enforce the 6-image display limit
  const displayedFiles = files.slice(0, 6);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {displayedFiles.map((file) => {
        const isSelected = selectedImages.some((s) => s.url === file.url);
        
        return (
          <div 
            key={file.url} 
            onClick={() => toggleSelect(file)}
            className="group relative"
          >
            {/* Image Container - Locked to Dark Aesthetic */}
            <div className={`
              aspect-[4/5] rounded-[24px] overflow-hidden transition-all duration-500 cursor-pointer relative
              ${isSelected 
                ? "ring-[4px] ring-blue-500 ring-offset-[6px] ring-offset-[#0A0A0A] scale-[0.9] shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)]" 
                : "border border-white/10 bg-white/5 hover:border-white/30 hover:scale-[1.02] shadow-2xl"
              }
            `}>
              <Image 
                src={file.url} 
                className={`object-cover w-full h-full transition-transform duration-700 ${isSelected ? "scale-110" : "group-hover:scale-110"}`} 
                alt={file.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              
              {/* Overlay Gradient - Dark Optimized */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                isSelected 
                  ? "bg-blue-600/20" 
                  : "bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60"
              }`} />
              
              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-blue-500 text-white rounded-full p-2 shadow-[0_0_20px_rgba(59,130,246,1)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
                    
            {/* Filename Tag */}
            <div className="mt-3 flex items-center gap-2 px-1">
              <div className={`w-1 h-1 rounded-full ${
                isSelected ? "bg-blue-500 animate-pulse" : "bg-white/20"
              }`} />
              <p className={`text-[9px] font-bold uppercase mb-1 tracking-[0.15em] truncate transition-colors duration-300 ${
                isSelected ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
              }`}>
                {file.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
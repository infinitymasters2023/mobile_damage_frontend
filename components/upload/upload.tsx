"use client";

import { useState, useCallback, useEffect } from "react";
import ImageUploader from "@/components/upload/ImageUploader";
import ImagePreview from "@/components/upload/ImagePreview";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export interface UploadedImage {
  url: string;
  name: string;
  size: number;
  status?: "analyzing" | "completed";
  detectedIssues: number[];
}

export default function UploadPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);

  // Cleanup effect: Memory leaks se bachne ke liye URL revoke karna zaroori hai
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const handleUpload = useCallback((files: File[]) => {
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      status: "analyzing" as const,
      detectedIssues: [],
    }));
    setImages(prev => [...prev, ...newImages]);
    // Auto-select is useful for immediate feedback
    setSelectedImages(prev => [...prev, ...newImages]);
  }, []);

  const toggleSelect = useCallback((image: UploadedImage) => {
    setSelectedImages((prev) => {
      const isAlreadySelected = prev.some((i) => i.url === image.url);
      return isAlreadySelected 
        ? prev.filter((i) => i.url !== image.url) 
        : [...prev, image];
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      <Header theme={"dark"} toggleTheme={function (): void {
        throw new Error("Function not implemented.");
      } } />

      {/* Main Container: Responsive padding aur width limits */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1800px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          
          {/* Section 1: Uploader */}
          <div className="col-span-12 lg:col-span-3 order-1">
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Source Input</h3>
            <ImageUploader onUpload={handleUpload} />
          </div>

          {/* Section 2: Thumbnails (Main Gallery) */}
          <div className="col-span-12 lg:col-span-6 order-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h3 className="font-bold text-xl tracking-tight">Diagnostic Gallery</h3>
              
              {/* Neon Badge with responsive margin */}
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse" />
                <div className="relative text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-black/60 px-5 py-2 rounded-full border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                  Mobile Damage Engine
                </div>
              </div>
            </div>
            
            <ImagePreview
              files={images}
              selectedImages={selectedImages}
              toggleSelect={toggleSelect}
            />
          </div>

          {/* Section 3: Metadata (Details Panel) */}
          <div className="col-span-12 lg:col-span-3 order-3">
            <h3 className="mb-6 font-bold text-lg text-slate-400 border-b border-white/5 pb-2">Analysis Data</h3>
            
            <div className="space-y-4 max-h-[400px] lg:max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {selectedImages.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[32px] opacity-30 italic text-sm">
                  Select thumbnails to view deep metadata
                </div>
              ) : (
                selectedImages.map((img) => (
                  <div key={img.url} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <DetailCard label="Asset ID" value={img.name} />
                    <DetailCard label="Size Data" value={`${(img.size / 1024).toFixed(1)} KB`} />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/[0.08] hover:border-blue-500/30 transition-all group mb-3">
      <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 transition-colors group-hover:text-blue-400">
        {label}
      </p>
      <p className="text-slate-200 font-bold truncate text-sm">{value}</p>
    </div>
  );
}
"use client";

import { useState, useCallback } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import ImageUploader from "@/components/upload/ImageUploader";
import ImagePreview from "@/components/upload/ImagePreview";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Logo from "../app/img/infinity-logo-164.png";

const DAMAGE_TYPES = [
  "Back Crack", "Back Scratch", "Back Dent", "Back Corner Damage", 
  "Camera Damage", "Screen Crack", "Screen Scratch", "Screen Shatter", 
  "Screen Dead Pixels", "Screen Line Issue", "Screen Burn"
];

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

  // --- UPLOAD LOGIC ---
  const handleUpload = (files: File[]) => {
    const newImages: UploadedImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      status: "analyzing",
      detectedIssues: []
    }));
    setImages((prev) => [...prev, ...newImages]);
    setSelectedImages((prev) => [...prev, ...newImages]);
    newImages.forEach(img => analyzeImage(img.url));
  };

  const analyzeImage = async (imgUrl: string) => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const randomIssues = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, 
      () => Math.floor(Math.random() * 11)
    );
    setImages(prev => prev.map(img => 
      img.url === imgUrl ? { ...img, status: "completed", detectedIssues: [...new Set(randomIssues)] } : img
    ));
  };

  const toggleSelect = useCallback((image: UploadedImage) => {
    setSelectedImages((prev) => {
      const isAlreadySelected = prev.some((i) => i.url === image.url);
      return isAlreadySelected ? prev.filter((i) => i.url !== image.url) : [...prev, image];
    });
  }, []);

  const activeSelections = selectedImages.map(sel => images.find(img => img.url === sel.url) || sel);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#050505] text-white selection:bg-blue-500/30">     

      {/* --- HEADER --- */}
      <header className="min-h-[5rem] border-b border-white/5 bg-[#050505]/50 backdrop-blur-md sticky top-0 z-40 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <h1 className="bg-white p-2 rounded-xl shrink-0 ml-8">
              <Image
              src={Logo}
              alt="logo"
              width={150}
              height={32}
              className="h-8 object-contain"
            /> 
        </h1>

        <div className="flex items-center gap-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 animate-pulse">
            Mobile Damage 
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="p-4 sm:p-8 max-w-[1600px] w-full mx-auto flex-grow">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Uploader & Results */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <ImageUploader onUpload={handleUpload} />

            <div className="rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-xl transition-all">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-bold">Detection Results</h3>
                {activeSelections.length > 0 && (
                  <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase rounded-xl text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                    Export PDF
                  </button>
                )}
              </div>

              {activeSelections.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {activeSelections.map((img) => <DetailCard key={img.url} image={img} />)}
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[32px] opacity-40 italic text-sm">
                  No assets selected for analysis
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Gallery */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-white/5 bg-[#0A0A0A] min-h-[400px] lg:min-h-[739px]">
              <h3 className="text-sm font-bold mb-8 text-slate-500 uppercase tracking-tight">Asset Gallery</h3>
              <ImagePreview files={images} selectedImages={selectedImages} toggleSelect={toggleSelect} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DetailCard({ image }: { image: UploadedImage }) {
  const isAnalyzing = image.status === "analyzing";

  return (
    <div className="bg-white/5 border border-white/10 px-4 py-4 rounded-3xl transition-all hover:bg-white/[0.08] hover:border-white/20">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
        <div>
          <p className="text-[9px] font-black uppercase mb-1 text-blue-400 break-all">{image.name}</p>
          <p className="text-[9px] text-slate-500">{(image.size / 1024).toFixed(1)} KB</p>
        </div>
        {isAnalyzing ? (
          <div className="flex items-center gap-2">
            <Loader2 size={12} className="text-blue-500 animate-spin" />
            <span className="text-[9px] font-bold uppercase text-blue-500 tracking-widest">Analyzing...</span>
          </div>
        ) : (
          <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${
            image.detectedIssues.length > 0 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
          }`}>
            {image.detectedIssues.length > 0 ? 'Issue Found' : 'Clean'}
          </span>
        )}
      </div>

      {!isAnalyzing && (
        <div className="flex flex-wrap gap-2">
          {image.detectedIssues.length > 0 ? (
            image.detectedIssues.map(index => (
              <span key={index} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-xl flex items-center gap-2">
                <div className="w-1 h-1 bg-red-500 rounded-full" />
                {DAMAGE_TYPES[index]}
              </span>
            ))
          ) : (
            <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 size={10} /> No Damage Detected
            </span>
          )}
        </div>
      )}
    </div>
  );
}
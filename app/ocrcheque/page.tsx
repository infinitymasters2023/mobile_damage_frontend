"use client";

import { useState, useCallback } from "react";
import { Loader2, CheckCircle2, AlertCircle, FileText, Search, Download } from "lucide-react";
import ImageUploader from "@/components/upload/ImageUploader";
import ImagePreview from "@/components/upload/ImagePreview";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Logo from "@/app/img/infinity-logo-164.png";

// Standard banking data points for Cheque OCR
const CHEQUE_FIELDS = [
  "Cheque Number", "MICR Code", "IFSC Code", "Account Number",
  "Bank Name", "Branch", "Date", "Payee Name", "Amount (Digits)", "Amount (Words)"
];

export interface UploadedImage {
  url: string;
  name: string;
  size: number;
  status?: "analyzing" | "completed" | "failed";
  extractedData: Record<string, string>;
}

export default function ChequeOCRPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);

  const handleUpload = (files: File[]) => {
    const newImages: UploadedImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      status: "analyzing",
      extractedData: {}
    }));
    setImages((prev) => [...prev, ...newImages]);
    setSelectedImages((prev) => [...prev, ...newImages]);
    newImages.forEach(img => analyzeCheque(img.url));
  };

  const analyzeCheque = async (imgUrl: string) => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mocking extracted data
    const mockData = {
      "Cheque Number": "001245",
      "MICR Code": "400240021",
      "IFSC Code": "HDFC0001245",
      "Account Number": "501002458799",
      "Bank Name": "HDFC BANK",
    };

    setImages(prev => prev.map(img =>
      img.url === imgUrl ? { ...img, status: "completed", extractedData: mockData } : img
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
      <header className="min-h-[5rem] border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <div className="bg-white p-1.5 rounded-lg shrink-0">
            <Image src={Logo} alt="logo" width={120} height={28} className="h-6 object-contain" />
          </div>
          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 bg-blue-500/5 px-4 py-1.5 rounded-md border border-blue-500/20">
           OCR to Cheque
          </div>
        </div>

        <div className="flex gap-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Search size={18} /></button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Download size={18} /></button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="p-6 sm:p-10 max-w-[1700px] w-full mx-auto flex-grow">
        <div className="grid grid-cols-12 gap-8">

          {/* Left: Uploader and High-Density Table */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <ImageUploader onUpload={handleUpload} />

            <div className="rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-xl transition-all">
              <div className=" flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                    <FileText size={16} className="text-blue-500" /> Data Extraction Stream
                  </h3>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-bold border border-blue-500/20">
                    {activeSelections.length} SELECTED
                  </span>
                </div>
              </div>

              <div className="">
                {activeSelections.length > 0 ? (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar mt-3">
                    {activeSelections.map((img) => <ExtractionRow key={img.url} image={img} />)}
                  </div>
                ) : (
                  <div className="py-32 text-center">
                    <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 text-slate-600">
                      <FileText size={32} />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Awaiting cheque selection for data mapping...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- Right Column: Document Queue (Full Cheque View) --- */}
          <div className="col-span-12 lg:col-span-5 h-full">
            <div className="h-full rounded-3xl border border-white/5 bg-[#080808] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Document Queue
                </h3>
                <span className="text-[10px] font-bold text-slate-600">
                  {images.length} TOTAL
                </span>
              </div>

              {/* Full Cheque List */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#050505]/50">
                {images.length > 0 ? (
                  images.map((img) => (
                    <div
                      key={img.url}
                      onClick={() => toggleSelect(img)}
                      className={`relative cursor-pointer group rounded-xl overflow-hidden border transition-all duration-300
              ${selectedImages.some(s => s.url === img.url)
                          ? "border-blue-500 ring-1 ring-blue-500/50"
                          : "border-white/10 hover:border-white/20"}
            `}
                    >
                      {/* Aspect Ratio Box for Cheque (approx 2.1:1) */}
                      <div className="aspect-[2.1/1] w-full bg-white/5 relative">
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className={`w-full h-full object-cover transition-opacity duration-500 
                  ${img.status === "analyzing" ? "opacity-30 blur-[2px]" : "opacity-100"}
                `}
                        />

                        {/* Status Overlay */}
                        {img.status === "analyzing" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                            <Loader2 size={20} className="text-blue-500 animate-spin" />
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Scanning...</span>
                          </div>
                        )}

                        {/* Selection Badge */}
                        <div className={`absolute top-2 right-2 p-1 rounded-md transition-all
                ${selectedImages.some(s => s.url === img.url) ? "bg-blue-500 text-white" : "bg-black/60 text-white/20"}
              `}>
                          <CheckCircle2 size={12} />
                        </div>
                      </div>

                      {/* Document Footer Info */}
                      <div className="p-3 flex items-center justify-between bg-white/[0.03]">
                        <div className="truncate">
                          <p className="text-[9px] font-bold text-slate-400 truncate uppercase">{img.name}</p>
                          <p className="text-[8px] text-slate-600">{(img.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <div className={`h-1.5 w-1.5 rounded-full ${img.status === "completed" ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <FileText size={40} className="mb-4" />
                    <p className="text-xs italic">Queue is currently empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

function ExtractionRow({ image }: { image: UploadedImage }) {
  const isAnalyzing = image.status === "analyzing";

  return (
    <div className={`group rounded-2xl border transition-all duration-300 ${isAnalyzing ? "border-white/5 bg-transparent" : "border-white/10 bg-white/5 hover:border-blue-500/30"
      }`}>
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-blue-500/50 transition-colors relative">
            <Image src={image.url} alt={image.name} fill className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{image.name}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-tighter">Verified Format: Personal Cheque</p>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10">
            <Loader2 size={12} className="text-blue-500 animate-spin" />
            <span className="text-[9px] font-bold uppercase text-blue-500 tracking-widest">Parsing OCR...</span>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[9px] font-bold text-emerald-500 uppercase">99.2% Accuracy</p>
              <p className="text-[8px] text-slate-600 uppercase">Engine: V4.2-Hybrid</p>
            </div>
            <div className="h-8 w-[1px] bg-white/5" />
            <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all">
              <Download size={14} />
            </button>
          </div>
        )}
      </div>

      {!isAnalyzing && (
        <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(image.extractedData).map(([key, value]) => (
            <div key={key} className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
              <p className="text-[8px] font-bold text-slate-500 uppercase mb-1 tracking-wider">{key}</p>
              <p className="text-[11px] font-mono text-blue-100">{value}</p>
            </div>
          ))}
          {/* Visual indicator for missing fields */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-2.5 flex items-center justify-between">
            <p className="text-[8px] font-bold text-red-400/60 uppercase">Signature</p>
            <AlertCircle size={10} className="text-red-500" />
          </div>
        </div>
      )}
    </div>
  );
}
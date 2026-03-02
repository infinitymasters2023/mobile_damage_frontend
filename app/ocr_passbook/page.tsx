"use client";

import { useState, useCallback } from "react";
import { Loader2, CheckCircle2, AlertCircle, FileText, Search, Download, Table as TableIcon } from "lucide-react";
import ImageUploader from "@/components/upload/ImageUploader";
import ImagePreview from "@/components/upload/ImagePreview";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Logo from "@/app/img/infinity-logo-164.png";

// Passbook specific fields for data mapping
const PASSBOOK_FIELDS = [
  "Account Holder", "Account No", "IFSC", "Opening Balance", "Transactions Found"
];

export interface UploadedImage {
  url: string;
  name: string;
  size: number;
  status?: "analyzing" | "completed" | "failed";
  extractedData: {
    header: Record<string, string>;
    transactions: Array<{ date: string; remark: string; amount: string; type: "CR" | "DR" }>;
  };
}

export default function PassbookOCRPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);

  const handleUpload = (files: File[]) => {
    const newImages: UploadedImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      status: "analyzing",
      extractedData: { header: {}, transactions: [] }
    }));
    setImages((prev) => [...prev, ...newImages]);
    setSelectedImages((prev) => [...prev, ...newImages]);
    newImages.forEach(img => analyzePassbook(img.url));
  };

  const analyzePassbook = async (imgUrl: string) => {
    await new Promise(resolve => setTimeout(resolve, 3500));

    const mockData = {
      header: {
        "Account Holder": "John Doe",
        "Account No": "30221055487",
        "IFSC": "SBIN000412",
        "Bank": "State Bank of India"
      },
      transactions: [
        { date: "12/02/24", remark: "UPI/Payment", amount: "500.00", type: "DR" as const },
        { date: "14/02/24", remark: "NEFT/Salary", amount: "45,000.00", type: "CR" as const },
      ]
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
            OCR to Passbook
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                  <TableIcon size={16} className="text-blue-500" /> Ledger Extraction
                </h3>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-bold border border-blue-500/20">
                  {activeSelections.length} PAGES READY
                </span>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
                {activeSelections.length > 0 ? (
                  activeSelections.map((img) => <PassbookRow key={img.url} image={img} />)
                ) : (
                  <div className="py-32 text-center opacity-30">
                    <FileText size={48} className="mx-auto mb-4" />
                    <p className="text-sm font-medium tracking-wide">Upload passbook pages to begin OCR sequence</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- Right Column: Document Queue --- */}
          <div className="col-span-12 lg:col-span-5 h-full">
            <div className="h-full rounded-3xl border border-white/5 bg-[#080808] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page Queue</h3>
                <span className="text-[10px] font-bold text-slate-600">{images.length} TOTAL</span>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#050505]/50">
                {images.map((img) => (
                  <div
                    key={img.url}
                    onClick={() => toggleSelect(img)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border transition-all duration-300
                      ${selectedImages.some(s => s.url === img.url) ? "border-blue-500" : "border-white/10"}`}
                  >
                    <div className="aspect-[1.4/1] w-full bg-white/5">
                      <img src={img.url} className={`w-full h-full object-cover ${img.status === "analyzing" ? "opacity-30 blur-sm" : "opacity-100"}`} />
                      {img.status === "analyzing" && (
                         <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
                      )}
                    </div>
                    <div className="p-3 bg-white/[0.03] flex justify-between items-center">
                      <p className="text-[9px] font-bold text-slate-400">{img.name}</p>
                      <div className={`w-2 h-2 rounded-full ${img.status === "completed" ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

function PassbookRow({ image }: { image: any }) {
  const isAnalyzing = image.status === "analyzing";

  return (
    <div className={`rounded-2xl border p-5 transition-all ${isAnalyzing ? "border-white/5" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
            <FileText size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase">{image.name}</p>
            <p className="text-[8px] text-slate-500 uppercase">Scan Confidence: 98.4%</p>
          </div>
        </div>
        {isAnalyzing ? (
          <div className="flex items-center gap-2 text-blue-500"><Loader2 size={12} className="animate-spin" /><span className="text-[9px] font-bold uppercase tracking-widest">Parsing Ledger...</span></div>
        ) : (
          <CheckCircle2 size={16} className="text-emerald-500" />
        )}
      </div>

      {!isAnalyzing && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Header Info */}
          <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-4">
            {Object.entries(image.extractedData.header).map(([key, val]: any) => (
              <div key={key} className="p-2 rounded-lg bg-white/[0.03]">
                <p className="text-[7px] font-black text-slate-500 uppercase">{key}</p>
                <p className="text-[10px] font-mono text-blue-100 truncate">{val}</p>
              </div>
            ))}
          </div>

          {/* Mini Transaction Table */}
          <div className="rounded-xl overflow-hidden border border-white/5">
            <table className="w-full text-[10px] text-left">
              <thead className="bg-white/5 text-slate-500 uppercase">
                <tr>
                  <th className="p-2 font-bold">Date</th>
                  <th className="p-2 font-bold">Remark</th>
                  <th className="p-2 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {image.extractedData.transactions.map((tx: any, i: number) => (
                  <tr key={i} className="border-t border-white/5 text-slate-300">
                    <td className="p-2 font-mono">{tx.date}</td>
                    <td className="p-2 truncate max-w-[150px]">{tx.remark}</td>
                    <td className={`p-2 text-right font-bold ${tx.type === "CR" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type === "CR" ? "+" : "-"}{tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
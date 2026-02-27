"use client";

import { useState } from "react";

import ImageUploader from "@/components/upload/ImageUploader";
import ImagePreview from "@/components/upload/ImagePreview";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

interface UploadedImage {
  url: string;
  name: string;
  size: number;
}

export default function UploadPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);

  // handle upload
  const handleUpload = (files: File[]) => {
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const toggleSelect = (image: UploadedImage) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(prev => prev.filter(i => i !== image));
    } else {
      setSelectedImages(prev => [...prev, image]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-slate-900">
      <Header />

      <main className="flex-1 px-6 py-6">
        <div className="flex gap-6">
          {/* Left: Upload */}
          <div className="w-1/4">
            <ImageUploader onUpload={handleUpload} />
          </div>

          {/* Center: Thumbnails */}
          <div className="w-1/2">
            <h3 className="mb-4 font-bold text-lg">Uploaded Images</h3>
            <ImagePreview
              files={images}
              selectedImages={selectedImages}
              toggleSelect={toggleSelect}
            />
          </div>

          {/* Right: Image info */}
          <div className="w-1/4">
            <h3 className="mb-4 font-bold text-lg">Selected Image Info</h3>
            {selectedImages.length === 0 ? (
              <p className="text-gray-500">Select an image to see details</p>
            ) : (
              selectedImages.map((img, idx) => (
                <DetailCard key={idx} label="File Name" value={img.name} />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// DetailCard component
function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm mb-4">
      <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-gray-800 font-bold truncate">{value}</p>
    </div>
  );
}
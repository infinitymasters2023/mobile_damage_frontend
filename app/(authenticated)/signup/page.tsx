// Example for app/signup/page.tsx
"use client";
import SignupComponent from "@/components/login/SignupComponent";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full flex justify-center px-4">
        <SignupComponent />
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // 1. Added this import
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

// 2. Removed the broken "import {Logo}..." line completely

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/mobile_damage"); 
  };

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center relative overflow-hidden text-slate-300 font-sans w-full">
      
      {/* Background HUD Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md p-8 bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50" />

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white border border-blue-500/20 mb-4">
              
              {/* 3. Using the direct path string for the logo */}
              <Image 
                src="/img/infyeazy_logo.svg" 
                alt="logo" 
                width={120} 
                height={40} // Adjusted height for better aspect ratio
                className="object-contain" 
                priority 
              />
            </div>
            
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              Enterprise Document Intelligence
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <input 
                type="text" 
                required
                disabled={isLoading}
                className="w-full px-4 py-3.5 bg-black border border-white/5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-white placeholder-slate-700 font-mono text-sm"
                placeholder="USERNAME_ROOT"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[9px] font-bold text-blue-500 hover:underline uppercase tracking-tighter opacity-50">Forget Password</Link>
              </div>
              <input 
                type="password" 
                required
                disabled={isLoading}
                className="w-full px-4 py-3.5 bg-black border border-white/5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-white placeholder-slate-700 font-mono text-sm"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Login...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              New registered ? <Link href="/signup" className="text-blue-500 hover:text-blue-400">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
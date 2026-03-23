"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Added missing import
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, UserPlus } from "lucide-react"; // Added UserPlus for signup vibe

export function SignupComponent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration logic
    await new Promise((r) => setTimeout(r, 1500));
    
    // After signup, take them to the tool (Banking)
    router.push("/Banking"); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full max-w-md p-8 bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50" />

      <div className="text-center mb-0">
        <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white border border-blue-500/20 mb-4">
          <Image 
            src="/img/infyeazy_logo.svg" 
            alt="logo" 
            width={120} 
            height={40} 
            className="object-contain" 
            priority 
          />
        </div>

      </div>

      <form onSubmit={handleSignup} className="space-y-2">
        {/* USERNAME */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
          <input 
            type="text" 
            required
            disabled={isLoading}
            className="w-full px-4 py-3.5 bg-black border border-white/5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-white placeholder-slate-700 font-mono text-sm"
            placeholder="OPERATOR_NAME"
          />
        </div>

        {/* EMAIL (Added for Signup) */}
       <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
          Email Address
        </label>
        <input 
          type="email" 
          required
          disabled={isLoading}
          /* CHANGE: 
            - bg-black/40: Semi-transparent dark background
            - border-white/10: Subtle border
            - focus:ring-blue-500/30: Soft glow effect when typing
          */
          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl 
             focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 
             transition-all text-slate-900 placeholder-slate-400 font-mono text-sm"
          placeholder="admin@infyeazy.io"
        />
      </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access_Cipher</label>
          <input 
            type="password" 
            required
            disabled={isLoading}
            className="w-full px-4 py-3.5 mt-1 bg-black border border-white/5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-white placeholder-slate-700 font-mono text-sm"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full mt-5 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Create Account...
            </>
          ) : (
            <>
              <UserPlus size={14} />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Already registered? <Link href="/" className="text-blue-500 hover:text-blue-400">Log in</Link>
        </p>
      </div>
    </motion.div>
  );
}
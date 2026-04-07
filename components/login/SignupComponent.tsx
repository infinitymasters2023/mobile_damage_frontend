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

      <div className="text-center">
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

      <form onSubmit={handleSignup} className="space-y-5">
        {/* 1. USERNAME - COMMAND INPUT */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 group-focus-within:text-blue-500 transition-colors">
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              required
              disabled={isLoading}
              className="w-full px-4 py-4 bg-black backdrop-blur-md border border-white/9 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-white placeholder-slate-800 font-mono text-xs uppercase tracking-tighter"
              placeholder="ENTER_UID"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-500/20 group-focus-within:bg-blue-500 animate-pulse" />
          </div>
        </div>

        {/* 2. EMAIL - NEURAL NODE */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 group-focus-within:text-blue-500 transition-colors">
            Email Address
          </label>
          <input
            type="email"
            required
            disabled={isLoading}
            className="w-full px-4 py-4 bg-black backdrop-blur-md border border-white/9 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-white placeholder-slate-800 font-mono text-xs uppercase tracking-tighter"
            placeholder="admin@infyeazy.io"
          />
        </div>

        {/* 3. PASSWORD - ACCESS CIPHER */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 group-focus-within:text-blue-500 transition-colors">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              disabled={isLoading}
              className="w-full px-4 py-4 bg-black backdrop-blur-md border border-white/9 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-white placeholder-slate-800 font-mono text-xs uppercase tracking-tighter"
              placeholder="••••••••"
            />
            {/* HUD-style decorative corner inside input */}
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/10" />
          </div>
        </div>

        {/* SIGNUP ACTION */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:text-blue-300/50 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="animate-pulse">sign in...</span>
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Sign in
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Already registered? <Link href="/login" className="text-blue-500 hover:text-blue-400">Log in</Link>
        </p>
      </div>
    </motion.div>
  );
}
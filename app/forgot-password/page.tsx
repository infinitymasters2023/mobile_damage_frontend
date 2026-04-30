"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Key, User, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getUser, saveUser } from "@/utils/auth";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", newPassword: "" });

const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Get the current user from localStorage
    const existingUser = getUser();

    if (step === 1) {
      // Identity Verification Step
      if (existingUser && existingUser.name.toLowerCase() === form.name.toLowerCase()) {
        setStep(2);
      } else {
        alert("TERMINAL ERROR: IDENTITY NOT FOUND");
      }
    } else {
      // Password Reset Step
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1200)); // Simulate processing

      if (existingUser) {
        saveUser({ ...existingUser, password: form.newPassword });
        alert("PROTOCOL SUCCESS: MASTER KEY REWRITTEN");
        router.push("/login");
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-[450px] p-8 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem]">
        <Link href="/login" className="text-slate-500 mb-6 flex items-center gap-2 text-xs uppercase font-bold tracking-widest hover:text-white transition-all">
          <ArrowLeft size={16} /> Return to Login
        </Link>
        
        <h2 className="text-white text-center mb-2 uppercase font-mono tracking-widest text-lg">Reset Protocol</h2>
        <p className="text-center text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-8">Identity Verification Required</p>

        <form onSubmit={handleProcess} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#0066FF]" size={18} />
            <input
              type="text"
              placeholder="CONFIRM_USER_ALIAS"
              disabled={step === 2}
              required
              className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm focus:border-[#0066FF]/50 outline-none transition-all disabled:opacity-50"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#0066FF]" size={18} />
              <input
                type="password"
                placeholder="NEW_MASTER_KEY"
                required
                className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm focus:border-[#0066FF]/50 outline-none transition-all"
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />
            </motion.div>
          )}

          <button className="w-full py-4 bg-[#0066FF] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : step === 1 ? "Verify Identity" : "Update Key"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
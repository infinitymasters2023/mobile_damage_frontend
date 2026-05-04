// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { getUser } from "../../utils/auth";

export default function LoginComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const storedUser = getUser();

    if (!storedUser) {
      alert("NO ACCOUNT DETECTED");
      router.push("/signup");
    } else if (storedUser.name === form.name && storedUser.password === form.password) {
      alert("ACCESS GRANTED 🚀");
      router.push("/Banking");
    } else {
      alert("INVALID CREDENTIALS");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[450px] p-8 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_40px_-10px_rgba(0,102,255,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF] shadow-[0_0_15px_#0066FF]" />

        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white mb-4">
            <Image src="/img/infyeazy_logo.svg" alt="logo" width={120} height={40} priority />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Enterprise Document Intelligence</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#0066FF]" size={18} />
            <input
              type="text" placeholder="Username" required
              className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm focus:border-[#0066FF]/50 outline-none transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#0066FF]" size={18} />
            <input
              type={show ? "text" : "password"} placeholder="Password" required
              className="w-full pl-12 pr-12 py-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm focus:border-[#0066FF]/50 outline-none transition-all"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>

          <div className="flex justify-end px-2">
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold text-slate-500 hover:text-[#0066FF] transition-colors uppercase tracking-widest"
            >
              Forgot Master password?
            </Link>
          </div>


          <button disabled={loading} className="w-full py-4 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
            {loading ? <><Loader2 size={16} className="animate-spin" /> VERIFYING...</> : "Log in"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          New Node? <Link href="/signup" className="text-[#0066FF] ml-1 underline underline-offset-4">SIGN UP</Link>
        </p>
      </motion.div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { saveUser, User as UserType } from "@/utils/auth";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignupComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<UserType>({ name: "", email: "", password: "" });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); 
    
    saveUser(form);
    alert("REGISTRATION SUCCESSFUL");
    router.push("/login"); 
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-[450px] p-8 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_40px_-10px_rgba(0,102,255,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF] shadow-[0_0_15px_#0066FF]" />
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white mb-4">
            <Image src="/img/infyeazy_logo.svg" alt="logo" width={120} height={40} priority />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Enterprise Document Intelligence</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#0066FF]" size={18} />
            <input 
              type="text" placeholder="USER_ALIAS" required
              className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm focus:border-[#0066FF]/50 outline-none transition-all"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#0066FF]" size={18} />
            <input 
              type="email" placeholder="EMAIL_ADDR" required
              className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm focus:border-[#0066FF]/50 outline-none transition-all"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#0066FF]" size={18} />
            <input 
              type={showPassword ? "text" : "password"} placeholder="MASTER_KEY" required
              className="w-full pl-12 pr-12 py-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm focus:border-[#0066FF]/50 outline-none transition-all"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button disabled={loading} className="w-full py-4 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
            {loading ? <><Loader2 size={16} className="animate-spin" /> INITIALIZING...</> : "REGISTER IDENTITY"}
          </button>
        </form>

        <div className="relative my-6 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">OR</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        <button 
            onClick={() => signIn("google", { callbackUrl: "/mobile_damage" })}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3"
        >
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" width={16} height={16} />
            Sign up with Google
        </button>

        <p className="mt-8 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Sync existing? <Link href="/login" className="text-[#0066FF] ml-1 underline underline-offset-4">LOGIN</Link>
        </p>
      </motion.div>
    </div>
  );
}
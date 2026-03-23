"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function SignupComponent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration logic
    await new Promise((r) => setTimeout(r, 1500));
    
    // Redirect to login or dashboard
    router.push("/"); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-10 relative m-4"
    >
      <div className="text-center mb-8 mt-2">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
          Create Account
        </h2>
        <p className="text-zinc-400">Join InfyEazy to start securing data</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        {/* FULL NAME FIELD */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Full Name</label>
          <input 
            type="text" 
            required
            className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-zinc-600"
            placeholder="John Doe"
          />
        </div>

        {/* EMAIL FIELD */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-zinc-600"
            placeholder="name@company.com"
          />
        </div>

        {/* PASSWORD FIELD */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Password</label>
          <input 
            type="password" 
            required
            className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-zinc-600"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
        >
          {isLoading ? "Processing..." : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-zinc-500 text-sm">
        Already have an account?{" "}
        <Link href="/" className="text-blue-500 hover:text-blue-400 font-medium">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}
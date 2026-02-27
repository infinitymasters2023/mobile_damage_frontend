"use client";
import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: HeaderProps) {
  return (
    <header className={`h-20 border-b flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-40 transition-colors ${
      theme === "dark" ? "border-white/5 bg-[#050505]/50" : "border-slate-200 bg-white/70"
    }`}>
      <h1 className="bg-white p-2 rounded-xl">
        <img src="https://infinityassurance.com/wp-content/uploads/2022/02/infinity-logo-164.png" alt="logo" className="h-8 object-contain" /> 
      </h1>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border transition-all ${
            theme === "dark" 
            ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" 
            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 animate-pulse">
          System Active
        </div>
      </div>
    </header>
  );
}
"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/public/img/infyeazy_logo.svg";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="hidden lg:flex h-16 border-b border-white/5 bg-[#0a0a0a] items-center justify-between px-8 shrink-0 z-50 sticky top-0 backdrop-blur-md">
      <div className="flex items-center gap-6">
        {/* Logo Container */}
        <div className="bg-white p-1.5 px-3 rounded-lg shadow-xl">
          <Image 
            src={Logo} 
            alt="logo" 
            width={120} 
            height={150} 
            className="object-cover" 
            priority 
            unoptimized
          />
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-white/10" />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <span>CORE INTELLIGENCE</span>
          <span className="text-white/20">/</span>
          <span className="text-blue-500">{title}</span>
        </nav>
      </div>

      {/* Optional: Right side status indicator */}
      <div className="flex items-center gap-3 bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
        <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">
          System Active
        </span>
      </div>
    </header>
  );
}
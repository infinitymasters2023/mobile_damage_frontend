"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for redirection
import Logo from "@/public/img/infyeazy_logo.svg";
import { LogOut, User, ChevronDown, Settings } from "lucide-react";

interface HeaderProps {
  title: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export default function Header({
  title,
  user = { 
    name: "Alex Rivera", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
  },
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize router

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    try {
      // 1. If using an API/Auth provider, call it here:
      // await signOut(); 

      // 2. Clear local storage/cookies if necessary
      localStorage.clear();
      
      // 3. Redirect to login page
      router.push("/login"); 
      
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-white/[0.08] bg-[#0d0d0d] flex items-center justify-between px-6 lg:px-10 shrink-0">
      
      {/* LEFT: Logo Highlight */}
      <div className="flex items-center gap-6">
        <Link href="/" className="block group">
          <div className="bg-white px-4 py-1.5 rounded-md shadow-lg group-hover:bg-slate-100 transition-colors">
            <Image
              src={Logo}
              alt="InfyEazy"
              width={100}
              height={28}
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />
        <h1 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hidden md:block">
          {title}
        </h1>
      </div>

      {/* RIGHT: User Profile & Logout */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all focus:outline-none"
        >
          <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden bg-[#1a1a1a]">
            <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col items-start hidden sm:flex leading-none">
            <span className="text-[12px] font-bold text-white tracking-tight">{user.name}</span>
            <span className="text-[9px] text-blue-500 font-bold uppercase mt-0.5">Pro User</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-44 bg-[#121212] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] py-1.5 z-[60] overflow-hidden">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-colors">
              <User className="w-4 h-4 text-white/40" />
              Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-colors">
              <Settings className="w-4 h-4 text-white/40" />
              Settings
            </button>

            <div className="h-px bg-white/5 my-1.5 mx-2" />

            {/* FIXED LOGOUT BUTTON */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
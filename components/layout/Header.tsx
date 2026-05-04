"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Logo from "@/public/img/infyeazy_logo.svg";
import { LogOut, User, ChevronDown, Settings } from "lucide-react";

interface HeaderProps {
  title: string;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  onUpload?: () => void;
}

export default function Header({ title }: HeaderProps) {
  const { data: session } = useSession(); // ✅ GET SESSION
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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



  // ✅ Fallback if session not loaded
  const userName = session?.user?.name || "Guest User";
  const userAvatar =
    session?.user?.image ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };;
  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-white/[0.08] bg-[#0d0d0d] flex items-center justify-between px-6 lg:px-10 shrink-0">

      {/* LEFT */}
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

      {/* RIGHT */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all"
        >
          <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden bg-[#1a1a1a]">
            <img src={userAvatar} alt="User" className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-col items-start hidden sm:flex leading-none">
            <span className="text-[12px] font-bold text-white tracking-tight">
              {userName}
            </span>

          </div>

          <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-44 bg-[#121212] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] py-1.5 z-[60] overflow-hidden">

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/70 hover:bg-white/5 hover:text-white">
              <User className="w-4 h-4 text-white/40" />
              Profile
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/70 hover:bg-white/5 hover:text-white">
              <Settings className="w-4 h-4 text-white/40" />
              Settings
            </button>

            <div className="h-px bg-white/5 my-1.5 mx-2" />

            {/* ✅ Proper Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-red-400 hover:bg-red-500/10 font-semibold"
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
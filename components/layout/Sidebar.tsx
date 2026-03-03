"use client";

import React, { useState, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "@/app/img/infinity-logo-164.png"; 
import { 
  LayoutDashboard, CreditCard, Barcode, ShoppingBag, 
  FileText, Languages, ChevronLeft, ChevronRight, Menu, X, Smartphone 
} from 'lucide-react';

const navItems = [
   { icon: <Smartphone size={20} />, label: "Mobile Damage", href: "/" },
   { icon: <CreditCard size={20} />, label: "Banking", href: "/Banking" },
   { icon: <FileText size={20} />, label: "Invoices", href: "/invoice" }, 
   { icon: <Barcode size={20} />, label: "Barcode Read", href: "/Barcode_Read" },
   { icon: <ShoppingBag size={20} />, label: "OCR Purchase Device", href: "/Ocr_purchase_device" },
   { icon: <Languages size={20} />, label: "Audio Translate", href: "/Translate" },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebar-collapsed");
      return savedState !== null ? JSON.parse(savedState) : false;
    }
    return false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Persist collapse state & Handle initial mount
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  useLayoutEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent Hydration mismatch
  if (!isMounted) return <div className="hidden lg:flex lg:w-64 h-screen bg-[#050505] border-r border-white/5" />;

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505] border-b border-white/5 flex items-center justify-between px-4 z-[50]">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-white bg-white/5 rounded-lg border border-white/10">
            <Menu size={20} />
          </button>
          <div className="bg-white p-1 rounded-md shrink-0">
            <Image src={Logo} alt="logo" width={100} height={24} className="h-5 w-auto object-contain" />
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/5 px-3 py-1 rounded border border-blue-500/20">
          Engine v4 
        </div>
      </div>

      {/* OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* SIDEBAR ASIDE */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-[70] transition-all duration-300 ease-in-out border-r border-white/5 bg-[#050505] flex flex-col py-6
        ${isCollapsed ? "lg:w-20" : "lg:w-64"} 
        ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* HEADER */}
        <div className={`flex items-center mb-8 px-4 ${isCollapsed && !isMobileOpen ? "lg:justify-center" : "justify-between"}`}>
          {(!isCollapsed || isMobileOpen) && (
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 ml-2 animate-in fade-in">
                Navigation
              </span>
          )}
          <button 
            onClick={handleToggleCollapse} 
            className="hidden lg:flex p-2 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={20} /></button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-grow overflow-y-auto px-3 space-y-1.5 scrollbar-hide">
          {navItems.map((item) => (
            <SidebarLink 
              key={item.href} 
              {...item} 
              active={pathname === item.href} 
              isCollapsed={isMobileOpen ? false : isCollapsed} 
            />
          ))}
        </nav>

        {/* SYSTEM STATUS */}
        <div className="px-3 mt-4">
          <div className={`flex items-center bg-[#0C0C0C] border border-white/5 rounded-2xl transition-all duration-300 ${isCollapsed && !isMobileOpen ? "justify-center p-3" : "p-4"}`}>
             <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0 shadow-[0_0_8px_#10B981]" />
             {(!isCollapsed || isMobileOpen) && (
                <span className="ml-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                   System Active
                </span>
             )}
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ icon, label, href, active, isCollapsed }: any) {
  return (
    <Link 
      href={href} 
      title={isCollapsed ? label : ""}
      className={`flex items-center transition-all duration-200 group relative
        ${active ? "bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(37,99,235,0.05)]" : "text-slate-500 hover:text-white hover:bg-white/5 border border-transparent"} 
        ${isCollapsed ? "justify-center h-12 w-12 mx-auto rounded-xl" : "px-4 py-3 gap-4 w-full rounded-2xl"}`}
    >
      <span className={`shrink-0 ${active ? "text-blue-500" : "group-hover:text-blue-400"}`}>{icon}</span>
      {!isCollapsed && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{label}</span>}
      {active && <div className={`absolute bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] ${isCollapsed ? "right-1 top-1 w-1.5 h-1.5" : "right-3 w-1.5 h-1.5"}`} />}
    </Link>
  );
}
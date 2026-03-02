"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, CreditCard, BookOpen, Barcode, Receipt, 
  Contact2, Cpu, ShoppingBag, FileText, UserCheck, 
  Languages, ChevronLeft, ChevronRight, Menu, X 
} from 'lucide-react';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/" },
  { icon: <CreditCard size={20} />, label: "Ocr to Cheque", href: "/diagnostics" },
  { icon: <BookOpen size={20} />, label: "Ocr to Passbook", href: "/Ocr_Passbook" },
  { icon: <Barcode size={20} />, label: "Barcode Read", href: "/Ocr_Barcode_read" },
  { icon: <Receipt size={20} />, label: "Payment Proof", href: "/Ocr_Payment_Proof"},
  { icon: <Contact2 size={20} />, label: "Ocr Bank ID", href: "/Ocr_Bank-ID"},
  { icon: <Cpu size={20} />, label: "Ocr IMEI", href: "/Ocr_Imei"},
  { icon: <ShoppingBag size={20} />, label: "Ocr Purchase Device", href: "/Ocr_Purchase_Device"},
  { icon: <FileText size={20} />, label: "Invoice", href: "/Invoice_Oppo"},  
  { icon: <UserCheck size={20} />, label: "Ocr Kyc", href: "/Kyc"},
  { icon: <Languages size={20} />, label: "Audio Translate", href: "/Translate"},
];

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  isCollapsed: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Auto-close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* --- MOBILE TRIGGER --- */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] lg:hidden p-3 rounded-xl bg-[#050505] border border-white/10 text-white shadow-2xl active:scale-95 transition-transform"
      >
        <Menu size={20} />
      </button>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR ASIDE --- */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen z-[70] transition-all duration-300 ease-in-out border-r flex flex-col py-6 bg-[#050505] border-white/5
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} 
          ${isMobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header Section */}
        <div className={`flex items-center mb-8 px-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {(!isCollapsed || isMobileOpen) && (
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 select-none ml-2">
                Navigation
             </span>
          )}
          
          <button 
            onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl border transition-all bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
          >
            {isMobileOpen ? <X size={18} /> : isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Links Section */}
        <nav className="flex-grow overflow-y-auto px-3 space-y-2 scrollbar-hide">
          {navItems.map((item) => (
            <SidebarLink 
              key={item.href}
              {...item}
              active={pathname === item.href}
              // Force "expanded" look on mobile drawer
              isCollapsed={isMobileOpen ? false : isCollapsed}
            />
          ))}
        </nav>

        {/* System Status Section */}
        <div className="px-3 mt-4">
          <div className={`flex items-center bg-white/5 border border-white/5 rounded-2xl transition-all duration-300
            ${isCollapsed && !isMobileOpen ? "justify-center p-3" : "p-4"}
          `}>
             <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
             </div>
             {(!isCollapsed || isMobileOpen) && (
               <span className="ml-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                 Engine Online
               </span>
             )}
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ icon, label, href, active, isCollapsed }: SidebarLinkProps) {
  return (
    <Link 
      href={href}
      title={isCollapsed ? label : ""} // Show tooltip text on hover when collapsed
      className={`flex items-center transition-all duration-200 group relative
        ${active 
          ? "bg-blue-600/10 text-blue-500 border border-blue-500/20" 
          : "text-slate-500 hover:text-white hover:bg-white/5 border border-transparent" 
        } 
        ${isCollapsed 
          ? "justify-center h-12 w-12 mx-auto rounded-xl" // Centered Square
          : "px-4 py-3 gap-4 w-full rounded-2xl"          // Full Row
        }`}
    >
      <span className={`shrink-0 transition-colors ${active ? "text-blue-500" : "group-hover:text-blue-400"}`}>
        {icon}
      </span>
      
      {/* Label logic: completely removed from DOM when collapsed to ensure centering */}
      {!isCollapsed && (
        <span className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-1">
          {label}
        </span>
      )}

      {/* Indicator Dot */}
      {active && (
        <div className={`absolute bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] transition-all
          ${isCollapsed 
            ? "right-1 top-1 w-1.5 h-1.5" 
            : "right-3 w-1.5 h-1.5"
          }`} 
        />
      )}
    </Link>
  );
}
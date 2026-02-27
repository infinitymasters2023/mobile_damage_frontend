"use client";

import React, { useState, useEffect } from "react";
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
  { icon: <Barcode size={20} />, label: "Barcode Read", href: "/Ocr_Barcode read" },
  { icon: <Receipt size={20} />, label: "Payment Proof", href: "/Ocr_Payment Proof"},
  { icon: <Contact2 size={20} />, label: "Ocr Bank ID", href: "/Ocr_Bank-ID"},
  { icon: <Cpu size={20} />, label: "Ocr IMEI", href: "/Ocr_Imei"},
  { icon: <ShoppingBag size={20} />, label: "Ocr Purchase Device", href: "/Ocr_Purchase_Device"},
  { icon: <FileText size={20} />, label: "Invoice Oppo", href: "/Invoice_Oppo"},
  { icon: <FileText size={20} />, label: "Invoice Samsung", href: "/Invoice_Samsung"},
  { icon: <FileText size={20} />, label: "Invoice Vivo", href: "/Invoice_Vivo"},
  { icon: <UserCheck size={20} />, label: "Ocr Kyc", href: "/Kyc"},
  { icon: <Languages size={20} />, label: "Audio Translate", href: "/Translate"},
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* --- MOBILE TRIGGER --- */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] lg:hidden p-3 rounded-2xl border shadow-xl transition-all bg-[#050505] border-white/10 text-white"
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
        className={`fixed lg:sticky top-0 left-0 h-screen z-[70] transition-all duration-500 ease-in-out border-r flex flex-col py-6 bg-[#050505] border-white/5
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} 
          ${isMobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header/Toggle Section */}
        <div className="flex items-center justify-between px-4 mb-8">
          {!isCollapsed && (
             <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
               Navigation
             </span>
          )}
          
          <button 
            onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl border transition-all bg-white/5 border-white/10 text-slate-400 hover:text-white"
          >
            {isMobileOpen ? <X size={18} /> : isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Links Section */}
        <nav className="space-y-1.5 flex-grow overflow-y-auto custom-scrollbar px-3">
          {navItems.map((item) => (
            <SidebarLink 
              key={item.href}
              {...item}
              active={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({ icon, label, href, active, isCollapsed }: any) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative
        ${active 
          ? "bg-blue-600/10 text-blue-500 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]" 
          : "text-slate-500 hover:text-white hover:bg-white/5" 
        } ${isCollapsed ? "lg:justify-center lg:px-0" : "w-full"}`}
    >
      <span className={`shrink-0 transition-colors ${active ? "text-blue-500" : "group-hover:text-blue-400"}`}>
        {icon}
      </span>
      
      <span className={`text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-300
        ${isCollapsed ? "lg:hidden" : "block"}
      `}>
        {label}
      </span>

      {active && (
        <div className={`absolute right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] 
          ${isCollapsed ? "lg:hidden" : "block"}`} 
        />
      )}
    </Link>
  );
}
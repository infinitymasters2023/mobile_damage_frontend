"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-between px-6 py-6 border-t transition-all duration-500 ease-in-out
      /* Light Mode Styles */
      bg-white border-slate-200 
      /* Dark Mode Styles */
      dark:bg-[#050505] dark:border-white/10">
      <div className="flex flex-col sm:flex-row justify-between w-full max-w-[1600px] mx-auto items-center gap-4">
        <p className="text-sm transition-colors duration-500 text-slate-500 dark:text-gray-400">
          &copy; 2026 <span className="font-semibold text-blue-600 dark:text-white">Infinity Assurance</span>. All rights reserved.
        </p>
        <div className="flex gap-6 items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            AI Diagnostic Engine v2.0
          </span>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
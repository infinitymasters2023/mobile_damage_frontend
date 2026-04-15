"use client";

import LoginComponent from "@/components/login/LoginComponent";

import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center relative overflow-hidden text-slate-300 font-sans w-full">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="z-10 w-full flex flex-col items-center"
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
         
          </div>

          <LoginComponent />
        </motion.div>
      </div>
    </div>
  );
}
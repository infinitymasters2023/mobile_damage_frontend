"use client";

import React, { useState, useEffect } from 'react';
import {
    Zap, ArrowRight, Smartphone, Barcode, Play,
    Monitor, CreditCard, Layers, Shield, Landmark,
    ChevronLeft, ChevronRight, Activity, Box,
    Menu, X, Cpu, Globe, Terminal,
    Volume2 // <--- ADD THIS LINE
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from "next/navigation";

// Use a simple string path to avoid module resolution errors with SVGs
const LOGO_PATH = "/img/infyeazy_logo.svg";

const NexusFullLanding = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const slides = [
        {
            title: "InfyEazy Banking.",
            subtitle: "Unified Financial Intelligence",
            desc: "99.9% accuracy in MICR and cheque extraction for modern banking kiosks and secure document audit trails.",
            color: "from-blue-600/20",
            tag: "CORE_BANKING",
            btn: "EXPLORE OCR"
        },
        {
            title: "Visual AI Triage.",
            subtitle: "Insurance-Grade Assessment",
            desc: "NPU-powered real-time screen crack detection and hardware integrity scoring for automated claims.",
            color: "from-red-600/20",
            tag: "COMPUTER_VISION",
            btn: "START INSPECTION"
        },
        {
            title: "Nexus Hardware.",
            subtitle: "Physical Kiosk Integration",
            desc: "Series-9 hardware built for low-latency local data extraction, POS handhelds, and audit tablets.",
            color: "from-emerald-600/20",
            tag: "HARDWARE_SERIES_9",
            btn: "VIEW DEVICES"
        }
    ];

    // Auto-cycle timer
useEffect(() => {
    // 8000ms is the sweet spot for slow, readable enterprise banners
    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); 

    return () => clearInterval(timer);
}, [slides.length]);

    // Scroll listener
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Placeholder for form submission
    const handleAction = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Action triggered");
    };

    const SectionHeader = ({ tag, title, desc, centered = false }: any) => (
        <div className={`mb-16 ${centered ? 'text-center mx-auto' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <Zap size={12} fill="currentColor" /> {tag}
            </div>
            <h2 className="text-4xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
                {title}
            </h2>
            <p className={`text-slate-400 text-lg leading-relaxed ${centered ? 'max-w-3xl mx-auto' : 'max-w-2xl'}`}>
                {desc}
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-blue-600/30 overflow-x-hidden scroll-smooth">

            {/* --- NAVIGATION --- */}
            <nav className={`fixed top-0 bg-dark left-0 right-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-dark backdrop-blur-xl py-4 shadow-2xl' : 'py-5'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="bg-white p-1.5 px-4 rounded-lg flex items-center shadow-lg transition-transform active:scale-95">
                        <Image src={LOGO_PATH} alt="logo" width={110} height={35} priority unoptimized />
                    </Link>

                    <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
                        {['Banking', 'Visual AI', 'Hardware', 'Audio'].map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-blue-500 transition-colors">{item}</a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/" className="hidden md:block bg-blue-600 hover:bg-blue-500 px-8 py-2.5 rounded-full text-xs font-black text-white transition-all shadow-lg shadow-blue-600/20">
                            LOGIN
                        </Link>
                        <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO BANNER SLIDER --- */}
            <header className="relative h-screen min-h-[900px] w-full flex items-center justify-center overflow-hidden">
                {/* Background Gradient Transition */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`bg-${currentSlide}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        // 3 seconds for the background to fully blend into the next color
                        transition={{ duration: 3, ease: "linear" }} 
                        className={`absolute inset-0 bg-gradient-to-b ${slides[currentSlide].color} to-transparent`}
                    />
                </AnimatePresence>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* LEFT SIDE: TEXT CONTENT */}
                        <AnimatePresence mode="wait">
                            <motion.div
                               key={currentSlide}
                                initial={{ y: 40, opacity: 0 }} 
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -40, opacity: 0 }}
                                /* ADJUST DURATION HERE */
                                transition={{ 
                                    duration: 0.8, // Increase for a slower, cinematic feel (e.g., 1.2)
                                    ease: [0.22, 1, 0.36, 1] // This "cubic-bezier" creates a smooth deceleration
                                }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                    <Activity size={14} className="animate-pulse" /> {slides[currentSlide].tag}
                                </div>
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.85]">
                                    {slides[currentSlide].title.split('.')[0]}<span className="text-blue-600 italic">.</span>
                                </h1>
                                <h2 className="text-xl md:text-2xl font-bold text-blue-500 mb-8 uppercase tracking-[0.2em]">
                                    {slides[currentSlide].subtitle}
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed italic">
                                    &quot;{slides[currentSlide].desc}&quot;
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-600/30 active:scale-95">
                                        {slides[currentSlide].btn} <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* RIGHT SIDE: ANIMATED OCR GRAPHIC */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`graphic-${currentSlide}`}
                                initial={{ scale: 0.8, opacity: 0, rotateY: 25 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                exit={{ scale: 1.2, opacity: 0, rotateY: -25 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative flex justify-center lg:justify-end perspective-1000"
                            >
                                {/* Main OCR Card Container */}
                                <div className="relative group w-full max-w-[420px] aspect-square bg-[#030816]/80 backdrop-blur-sm border border-blue-500/20 rounded-[4rem] flex flex-col items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(37,99,235,0.15)]">

                                    {/* 1. Animated Scanning Line */}
                                    <motion.div
                                        animate={{ top: ["-10%", "110%", "-10%"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20 shadow-[0_0_20px_rgba(37,99,235,1)] opacity-80"
                                    />

                                    {/* 2. HUD Grid Overlay */}
                                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e40af_1px,transparent_1px),linear-gradient(to_bottom,#1e40af_1px,transparent_1px)] bg-[size:30px_30px]"></div>

                                    {/* 3. Dynamic Center Icon */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <motion.div
                                            animate={{
                                                y: [0, -15, 0],
                                                filter: ["drop-shadow(0 0 0px rgba(59,130,246,0))", "drop-shadow(0 0 20px rgba(59,130,246,0.5))", "drop-shadow(0 0 0px rgba(59,130,246,0))"]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            {currentSlide === 0 && <CreditCard size={140} strokeWidth={0.5} className="text-blue-500/60" />}
                                            {currentSlide === 1 && <Smartphone size={140} strokeWidth={0.5} className="text-red-500/60" />}
                                            {currentSlide === 2 && <Box size={140} strokeWidth={0.5} className="text-emerald-500/60" />}
                                        </motion.div>

                                        {/* 4. "Verified" Badge inside graphic */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className={`mt-10 px-8 py-2.5 rounded-full text-white text-[10px] font-black tracking-[0.4em] shadow-2xl border border-white/10
                                    ${currentSlide === 0 ? 'bg-blue-600' : currentSlide === 1 ? 'bg-red-600' : 'bg-emerald-600'}`}
                                        >
                                            {slides[currentSlide].tag}_DEPLOYED
                                        </motion.div>
                                    </div>

                                    {/* 5. Animated Pulse Rings */}
                                    <div className="absolute w-[80%] h-[80%] border border-blue-500/5 rounded-full animate-[ping_3s_linear_infinite]" />
                                    <div className="absolute w-[60%] h-[60%] border border-blue-500/10 rounded-full animate-[pulse_2s_linear_infinite]" />

                                    {/* Decorative Corner Brackets */}
                                    <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-blue-500/30 rounded-tl-xl" />
                                    <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-blue-500/30 rounded-tr-xl" />
                                    <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-blue-500/30 rounded-bl-xl" />
                                    <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-blue-500/30 rounded-br-xl" />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Slider Controls (Bottom Right) */}
                <div className="absolute bottom-12 right-6 md:right-12 flex gap-4 z-20">
                    <button onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))} className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-all"><ChevronLeft size={24} /></button>
                    <button onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)} className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-all"><ChevronRight size={24} /></button>
                </div>

                {/* Progress Bars (Bottom Left) */}
                <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-3 z-20">
                    {slides.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-20 bg-blue-600' : 'w-8 bg-white/10'}`} />
                    ))}
                </div>
            </header>

            {/* --- BANKING SECTION --- */}
            <section id="banking" className="py-40 px-6 bg-gradient-to-b from-transparent to-blue-900/5">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <SectionHeader
                            tag="Banking Core"
                            title="Financial Asset Intelligence"
                            desc="Deep-scan extraction for cheques, passbooks, and secure banking records with 99.9% accuracy."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: <CreditCard />, t: "Cheque OCR", d: "MICR Verification" },
                                { icon: <Layers />, t: "Passbook", d: "Digitalization" },
                                { icon: <Shield />, t: "Proof Audit", d: "Anti-Fraud" },
                                { icon: <Landmark />, t: "Kiosk ID", d: "Auto Onboarding" }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                                    <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <h4 className="text-white font-bold text-sm mb-1">{item.t}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#0b1426] p-12 rounded-[4rem] border border-blue-900/30 shadow-3xl font-mono text-sm relative group overflow-hidden">
                        <div className="absolute top-6 right-8 text-blue-500/20 group-hover:text-blue-500 transition-colors"><Terminal size={40} /></div>
                        <div className="space-y-4">
                            <p className="text-blue-400">{"{"}</p>
                            <p className="pl-6 text-slate-400">&quot;doc&quot;: <span className="text-emerald-400">&quot;CHEQUE_SCAN&quot;</span>,</p>
                            <p className="pl-6 text-slate-400">&quot;micr&quot;: &quot;021000021&quot;,</p>
                            <p className="pl-6 text-slate-400">&quot;status&quot;: <span className="text-blue-500">&quot;VERIFIED&quot;</span></p>
                            <p className="text-blue-400">{"}"}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- HARDWARE SECTION --- */}
            <section id="hardware" className="py-40 px-6 bg-[#01040a]">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 flex justify-center">
                        <div className="relative group w-full max-w-md aspect-square bg-slate-950 border border-white/5 rounded-[5rem] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] group-hover:bg-blue-600/20 transition-all" />
                            <Smartphone size={200} strokeWidth={0.5} className="text-blue-500/30 group-hover:scale-110 group-hover:text-blue-500/50 transition-all duration-700" />
                            <div className="absolute bottom-12 bg-blue-600 px-8 py-2.5 rounded-full text-white text-[10px] font-black tracking-[0.4em] shadow-2xl">HARDWARE_VERIFIED</div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl"><Box className="text-blue-500" /></div>
                            <div>
                                <h4 className="text-white font-black text-xs uppercase">Series-9 Hardware</h4>
                                <p className="text-blue-500 text-[9px] font-bold tracking-widest mt-1">NEXUS_SYSTEMS</p>
                            </div>
                        </div>
                        <h2 className="text-5xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                            OCR Purchase <br /> <span className="text-blue-600 italic">Devices.</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">Physical hardware integration for ground-level retail and banking kiosks. NPU-powered local extraction.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {['Kiosk Terminals', 'POS Handhelds', 'Audit Tablets', 'Scanners'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-5 bg-white/5 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all text-xs font-bold text-white">
                                    <Monitor size={16} className="text-blue-500" /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* --- AUDIO TRANSLATION SECTION --- */}
            <section id="audio" className="py-40 px-6 bg-[#020202] relative overflow-hidden">
                {/* Background Glow - Matches Hero Section */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Side: Information */}
                    <div className="space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Volume2 size={14} /> MULTIMODAL_SIGNAL
                        </div>

                        <h2 className="text-5xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                            Audio <br /> <span className="text-blue-500 italic">Translate.</span>
                        </h2>

                        <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                            Global communication nodes with sub-second latency. Real-time neural translation
                            for banking kiosks and enterprise-level voice command interfaces.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {['Neural TTS', 'Auto-Lang', 'Whisper_V3'].map((item, i) => (
                                <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:border-blue-500/30 transition-colors">
                                    {item}
                                </div>
                            ))}
                        </div>

                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                            <Play size={18} fill="currentColor" /> INITIALIZE AUDIO_FEED
                        </button>
                    </div>

                    {/* Right Side: Animated Blue Waveform */}
                    <div className="relative w-full h-64 flex items-center justify-center gap-1.5 group">
                        {[...Array(24)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [
                                        `${Math.random() * 20 + 15}%`,
                                        `${Math.random() * 60 + 40}%`,
                                        `${Math.random() * 20 + 15}%`
                                    ],
                                    opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{
                                    duration: 1.2 + Math.random(),
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-2 md:w-2.5 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                style={{
                                    // Gradual brightness shift across the bars
                                    filter: `brightness(${0.6 + (i / 40)})`
                                }}
                            />
                        ))}

                        {/* HUD Status Badge */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-xl shadow-2xl">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                                Signal: <span className="text-white">Active_Stream</span>
                            </span>
                        </div>

                        {/* Decorative Corner Brackets for HUD look */}
                        <div className="absolute -top-4 -left-4 w-4 h-4 border-t border-l border-white/10" />
                        <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b border-r border-white/10" />
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-10 border-t border-white/5 bg-black px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="bg-white p-1 px-3 rounded-lg shadow-lg">
                        <Image src={LOGO_PATH} alt="logo" width={100} height={35} unoptimized />
                    </div>
                    <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                        <a href="#" className="hover:text-blue-500">Privacy</a>
                        <a href="#" className="hover:text-blue-500">Docs</a>
                        <a href="#" className="hover:text-blue-500">Security</a>
                    </div>
                    <p className="text-slate-800 text-[10px] font-bold tracking-widest uppercase italic">© 2026 NEXUS SYSTEMS GLOBAL.</p>
                </div>
            </footer>
        </div>
    );
};

export default NexusFullLanding;
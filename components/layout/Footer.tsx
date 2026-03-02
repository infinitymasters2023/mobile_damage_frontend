// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-8 border-t border-white/5 bg-[#050505]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-slate-500 font-medium">
          © 2026 <span className="text-blue-500 font-bold hover:underline cursor-pointer">Infinity Assurance.</span> All rights reserved.
        </p>
        <div className="flex gap-6">
          <span className="text-[11px] text-slate-600 hover:text-white cursor-pointer transition-colors uppercase tracking-widest font-bold">Privacy Policy</span>
          <span className="text-[11px] text-slate-600 hover:text-white cursor-pointer transition-colors uppercase tracking-widest font-bold">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
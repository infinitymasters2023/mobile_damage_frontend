// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-6xl font-black text-blue-500 mb-4">404</h2>
      <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm font-bold">
        Asset Path Not Recognized
      </p>
      <Link 
        href="/" 
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
// Inside SidebarItem.tsx
"use client";

export default function SidebarItem({ icon , label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void } ) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
        active 
          ? "bg-white/10 text-white" 
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="hidden lg:block text-sm font-medium">{label}</span>
    </button>
  );
}
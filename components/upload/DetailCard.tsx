"use client";

type Props = {
  label: string;
  value: string;
};

export default function DetailCard({ label, value }: Props) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-4">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-gray-800 font-bold truncate">
        {value}
      </p>
    </div>
  );
}
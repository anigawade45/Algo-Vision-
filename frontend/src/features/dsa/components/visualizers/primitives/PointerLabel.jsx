import React from 'react';

export function PointerLabel({ label, color = 'blue', position = 'top' }) {
  if (!label) return null;

  const colorStyles = {
    blue: 'bg-blue-600 text-white border-blue-700 shadow-blue-500/20',
    emerald: 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-500/20',
    amber: 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20',
    rose: 'bg-rose-600 text-white border-rose-700 shadow-rose-500/20',
    purple: 'bg-purple-600 text-white border-purple-700 shadow-purple-500/20',
    indigo: 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-500/20',
  };

  const selectedColor = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`flex flex-col items-center transition-all duration-200 ${
        position === 'bottom' ? 'flex-col-reverse' : 'flex-col'
      }`}
    >
      <span
        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold shadow-xs border transition-all duration-200 ${selectedColor}`}
      >
        {label}
      </span>
      <span className="text-xs font-bold leading-none text-slate-400 dark:text-slate-500 -my-0.5">
        {position === 'bottom' ? '↑' : '↓'}
      </span>
    </div>
  );
}

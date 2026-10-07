import React from 'react';

export function VisualizationLegend({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-3 border-t border-slate-100 dark:border-[#162032]">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Legend:</span>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${item.badgeClass || 'bg-blue-500'}`} />
          <span className="text-slate-600 dark:text-slate-400 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

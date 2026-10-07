import React from 'react';

/**
 * ResourcePrimitive — Reusable Primitive for Algorithmic Resource Tracking
 * Renders resource counters (e.g. Bricks: 2/5, Ladders: 1/2, Coins, Energy, Capacity).
 * Presentational, deterministic, and algorithm-agnostic.
 */
export function ResourcePrimitive({
  label = 'Resource',
  value = 0,
  max = null,
  icon = null,
  unit = '',
  color = 'blue', // 'blue' | 'amber' | 'emerald' | 'rose' | 'purple' | 'indigo'
  className = '',
}) {
  const percent = max !== null && max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : null;

  const colorStyles = {
    blue: {
      border: 'border-blue-200 dark:border-blue-900/40',
      text: 'text-blue-600 dark:text-blue-400',
      fill: 'bg-blue-500',
      badge: 'text-blue-500',
    },
    amber: {
      border: 'border-amber-200 dark:border-amber-900/40',
      text: 'text-amber-600 dark:text-amber-400',
      fill: 'bg-amber-500',
      badge: 'text-amber-500',
    },
    emerald: {
      border: 'border-emerald-200 dark:border-emerald-900/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      fill: 'bg-emerald-500',
      badge: 'text-emerald-500',
    },
    rose: {
      border: 'border-rose-200 dark:border-rose-900/40',
      text: 'text-rose-600 dark:text-rose-400',
      fill: 'bg-rose-500',
      badge: 'text-rose-500',
    },
    purple: {
      border: 'border-purple-200 dark:border-purple-900/40',
      text: 'text-purple-600 dark:text-purple-400',
      fill: 'bg-purple-500',
      badge: 'text-purple-500',
    },
    indigo: {
      border: 'border-indigo-200 dark:border-indigo-900/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      fill: 'bg-indigo-500',
      badge: 'text-indigo-500',
    },
  }[color] || colorStyles.blue;

  return (
    <div
      aria-label={`${label} ${value}${max !== null ? ` of ${max}` : ''} ${unit}`}
      className={`bg-white dark:bg-[#0B101D] border ${colorStyles.border} rounded-2xl p-3.5 shadow-xs flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${colorStyles.badge} flex items-center gap-1.5`}>
          {icon && <span className="text-sm">{icon}</span>}
          {label}
        </span>
        {max !== null && (
          <span className="text-[10px] font-mono font-semibold text-slate-400">
            Max: {max}
          </span>
        )}
      </div>

      <div className="my-1.5 flex items-baseline gap-1.5 font-mono">
        <span className={`text-xl font-bold ${colorStyles.text}`}>
          {value}
        </span>
        {max !== null && <span className="text-xs text-slate-400">/ {max}</span>}
        {unit && <span className="text-xs text-slate-400 ml-1">{unit}</span>}
      </div>

      {percent !== null && (
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full ${colorStyles.fill} transition-all duration-300 rounded-full`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

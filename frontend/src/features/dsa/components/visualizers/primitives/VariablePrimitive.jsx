import React from 'react';

/**
 * VariablePrimitive — Reusable Primitive Component for Execution Variables
 * Renders compact variable cards showing name, current value, mutation status, and previous values.
 * Presentational, deterministic, and algorithm-agnostic.
 */
export function VariablePrimitive({
  name = 'var',
  value = null,
  isMutated = false,
  previousValue = null,
  className = '',
}) {
  const renderValue = (val) => {
    if (val === null || val === undefined) {
      return <span className="text-slate-400 dark:text-slate-500 font-mono text-xs italic">null</span>;
    }

    if (typeof val === 'boolean') {
      return (
        <span
          className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
            val
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
          }`}
        >
          {val ? 'true' : 'false'}
        </span>
      );
    }

    if (typeof val === 'number' || typeof val === 'string') {
      return (
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/40">
          {val}
        </span>
      );
    }

    if (Array.isArray(val)) {
      return (
        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
          [{val.map((item) => (typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item))).join(', ')}]
        </span>
      );
    }

    if (typeof val === 'object') {
      return (
        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
          {JSON.stringify(val)}
        </span>
      );
    }

    return <span className="font-mono text-xs font-semibold">{String(val)}</span>;
  };

  return (
    <div
      aria-label={`Variable ${name} equal to ${value}`}
      className={`p-3 rounded-xl transition-all border ${
        isMutated
          ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/60 shadow-xs ring-1 ring-amber-400/30'
          : 'bg-white dark:bg-[#111726]/60 border-slate-200 dark:border-[#1E2638]'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200">
          {name}
        </span>

        {isMutated && (
          <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-200 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 uppercase tracking-wider">
            MUTATED
          </span>
        )}
      </div>

      <div className="mt-0.5 flex items-center justify-between gap-2">
        {renderValue(value)}
        {previousValue !== null && previousValue !== undefined && (
          <span className="text-[10px] font-mono text-slate-400">
            (was {String(previousValue)})
          </span>
        )}
      </div>
    </div>
  );
}

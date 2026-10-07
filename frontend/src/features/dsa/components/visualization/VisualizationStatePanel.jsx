import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, Zap } from 'lucide-react';

export function VisualizationStatePanel({ state, changed = [] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!state || typeof state !== 'object' || Object.keys(state).length === 0) {
    return null;
  }

  const changedSet = new Set(changed);
  const stateKeys = Object.keys(state);

  // Helper to render individual property values generically
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
      if (val.length === 0) {
        return <span className="text-slate-400 font-mono text-xs italic">[ empty ]</span>;
      }

      // Check if 2D matrix array
      const is2DMatrix = val.every((item) => Array.isArray(item));
      if (is2DMatrix) {
        return (
          <div className="inline-block p-1.5 rounded-lg bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45] max-h-32 overflow-auto">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${val[0]?.length || 1}, minmax(0, 1fr))` }}>
              {val.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="w-6 h-6 rounded bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 flex items-center justify-center font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200"
                  >
                    {cell === '.' ? <span className="text-slate-300 dark:text-slate-600">•</span> : cell}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-lg bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45] max-h-24 overflow-y-auto">
          {val.map((item, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              {typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item)}
            </span>
          ))}
        </div>
      );
    }

    if (typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) {
        return <span className="text-slate-400 font-mono text-xs italic">{'{ }'} (empty)</span>;
      }

      return (
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45] space-y-1 max-h-28 overflow-y-auto">
          {keys.map((k) => (
            <div
              key={k}
              className="flex items-center justify-between gap-2 text-xs font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#0B101D]"
            >
              <span className="font-semibold text-slate-600 dark:text-slate-400">{k}</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {typeof val[k] === 'object' && val[k] !== null ? JSON.stringify(val[k]) : String(val[k])}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="font-mono text-xs font-semibold">{String(val)}</span>;
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-3">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full text-left cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              STATE INSPECTOR
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Current Step Variables ({stateKeys.length})
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
          <span>{isOpen ? 'Collapse' : 'Expand Inspector'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Grid List of State Properties */}
      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-[#162032] animate-in fade-in duration-200">
          {stateKeys.map((keyName) => {
            const isChanged = changedSet.has(keyName);
            const val = state[keyName];

            return (
              <div
                key={keyName}
                className={`p-2.5 rounded-xl transition-all border ${
                  isChanged
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/60 shadow-xs ring-1 ring-amber-400/30'
                    : 'bg-white dark:bg-[#111726]/60 border-slate-200 dark:border-[#1E2638]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200">
                    {keyName}
                  </span>

                  {isChanged && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-200 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                      MUTATED
                    </span>
                  )}
                </div>

                <div className="mt-0.5">{renderValue(val)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

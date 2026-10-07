import React from 'react';
import { Database, Search, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export function HashSetVisualizer({
  seen = [],
  currentRow = null,
  currentCol = null,
  currentValue = null,
  rowKey = null,
  colKey = null,
  boxKey = null,
  isValid = true,
  result = null,
  title = 'HashSet Seen Entries',
}) {
  const seenSet = new Set(seen || []);

  // Parse Sudoku keys: "r0-5" -> row 0, val 5; "c1-3" -> col 1, val 3; "b0,0-5" -> box 0,0, val 5
  const rowEntries = [];
  const colEntries = [];
  const boxEntries = [];
  const genericEntries = [];

  seen.forEach((k) => {
    if (k.startsWith('r')) rowEntries.push(k);
    else if (k.startsWith('c')) colEntries.push(k);
    else if (k.startsWith('b')) boxEntries.push(k);
    else genericEntries.push(k);
  });

  const isDuplicateDetected = isValid === false || result === false;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-2.5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{title}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#162032] text-slate-500 font-semibold">
          {seen.length} Keys Seen
        </span>
      </div>

      {/* Active Cell Key Verification Inspector */}
      {currentValue && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Active Cell Verification:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              Cell [{currentRow}, {currentCol}] = "{currentValue}"
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span
              className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                seenSet.has(rowKey)
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              Row Key: {rowKey}
            </span>

            <span
              className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                seenSet.has(colKey)
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              Col Key: {colKey}
            </span>

            <span
              className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                seenSet.has(boxKey)
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              Box Key: {boxKey}
            </span>
          </div>
        </div>
      )}

      {/* Grouped Seen Sets */}
      <div className="space-y-2 text-xs font-mono">
        {rowEntries.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase w-16">Row Set:</span>
            {rowEntries.map((k) => (
              <span
                key={k}
                className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 font-semibold"
              >
                {k}
              </span>
            ))}
          </div>
        )}

        {colEntries.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase w-16">Col Set:</span>
            {colEntries.map((k) => (
              <span
                key={k}
                className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/40 font-semibold"
              >
                {k}
              </span>
            ))}
          </div>
        )}

        {boxEntries.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase w-16">Box Set:</span>
            {boxEntries.map((k) => (
              <span
                key={k}
                className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/40 font-semibold"
              >
                {k}
              </span>
            ))}
          </div>
        )}

        {genericEntries.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase w-16">Entries:</span>
            {genericEntries.map((k) => (
              <span
                key={k}
                className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 font-semibold"
              >
                {k}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Duplicate Alert Banner */}
      {isDuplicateDetected && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-mono text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="font-bold">
            DUPLICATE DETECTED! Key already exists in HashSet. Sudoku board validation failed (Result: false).
          </span>
        </div>
      )}
    </div>
  );
}

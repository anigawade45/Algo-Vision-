import React from 'react';
import { Hash, ArrowRight, Check, Search, PlusCircle } from 'lucide-react';

export function HashMapVisualizer({
  hashMap = {},
  activeKey = null,
  insertedKey = null,
  matchedKey = null,
  title = 'HashMap Entries (Key → Value)',
  isSet = false,
}) {
  const entries = Object.entries(hashMap || {});

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-2.5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Hash className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{title}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#162032] text-slate-500 font-semibold">
          {entries.length} {isSet ? 'Elements' : 'Entries'}
        </span>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="p-4 text-center text-xs font-mono text-slate-400 italic bg-slate-50 dark:bg-[#070A12] rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          {isSet ? 'Hash Set is currently empty { }' : 'HashMap is currently empty { }'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
          {entries.map(([key, val]) => {
            const isMatch = String(key) === String(matchedKey);
            const isInsert = String(key) === String(insertedKey);
            const isActive = String(key) === String(activeKey);
            const isBoolSetVal = val === true || isSet;

            let badgeStyle =
              'bg-slate-50 dark:bg-[#111726] border-slate-200 dark:border-[#222D45] text-slate-700 dark:text-slate-200';

            if (isMatch) {
              badgeStyle =
                'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold ring-1 ring-emerald-400';
            } else if (isInsert) {
              badgeStyle =
                'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-200 font-bold ring-1 ring-amber-400';
            } else if (isActive) {
              badgeStyle =
                'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-800 dark:text-blue-200 font-bold ring-1 ring-blue-400';
            }

            return (
              <div
                key={key}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-200 ${badgeStyle}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{isBoolSetVal ? 'Value' : 'Key'}</span>
                  <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
                    {key}
                  </span>
                </div>

                {isBoolSetVal ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-200 dark:border-emerald-900/50">
                    <Check className="w-3 h-3" />
                    <span>In Set</span>
                  </div>
                ) : (
                  <>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Index</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
                        {String(val)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

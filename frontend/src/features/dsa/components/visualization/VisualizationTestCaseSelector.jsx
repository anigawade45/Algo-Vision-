import React from 'react';
import { Check, CheckCircle2, ChevronRight, FileCode, PlayCircle } from 'lucide-react';

/**
 * VisualizationTestCaseSelector — Component for switching between authoritative problem test cases
 * in Stage 09 Direct Test-Case Visualization.
 */
export function VisualizationTestCaseSelector({
  testCases = [],
  selectedTestCaseId = 1,
  onSelectTestCase,
  hasLiveTrace = false,
  isTraceLoading = false,
}) {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    return null;
  }

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-500" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Authoritative Problem Test Cases ({testCases.length})
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          {isTraceLoading ? (
            <span className="text-blue-500 animate-pulse">Checking execution trace...</span>
          ) : hasLiveTrace ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40">
              <Check className="w-3 h-3" />
              <span>Trace Available for Replay</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40">
              <span>Direct Input Rendered • Dry Run Inactive</span>
            </span>
          )}
        </div>
      </div>

      {/* Test Case Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Test Cases">
        {testCases.map((tc, idx) => {
          const tcId = tc.id !== undefined ? tc.id : idx + 1;
          const isSelected = tcId === selectedTestCaseId;
          const inputPreview = tc.inputRaw
            ? tc.inputRaw.length > 32
              ? `${tc.inputRaw.slice(0, 32)}...`
              : tc.inputRaw
            : `Case #${tcId}`;

          return (
            <button
              key={tcId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectTestCase(tcId)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#111726] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#222D45] hover:bg-slate-100 dark:hover:bg-[#1A2338]'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {idx + 1}
              </span>
              <span>Case {tcId}</span>
              <span className={`text-[10px] hidden md:inline opacity-80 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                ({inputPreview})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

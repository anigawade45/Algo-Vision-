import React, { useState } from 'react';

/**
 * SECTION 05 — CONNECT THE PATTERN TO SOLUTION FAMILIES
 * Teaches the learner which DSA solution families and tools come to mind
 * when recognizing a structural pattern, establishing a clear handoff to Stage 05 (Algorithm).
 */
export function PatternSolutionFamilies({ patternName, solutionFamilies, sectionNo = '05' }) {
  if (!solutionFamilies || !solutionFamilies.families) return null;

  const [selectedFamilyIds, setSelectedFamilyIds] = useState(
    new Set(solutionFamilies.families.map((f) => f.id))
  );

  const toggleFamily = (id) => {
    const next = new Set(selectedFamilyIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedFamilyIds(next);
  };

  return (
    <section className="space-y-4 font-sans" aria-labelledby="pattern-solution-families-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-cyan-600 dark:text-cyan-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>SOLUTION FAMILIES</span>
      </div>

      <h2 id="pattern-solution-families-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        What approaches should come to mind?
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Pattern recognition identifies which families of tools and approaches are relevant.
      </p>

      {/* Main Solution Families Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-5 shadow-xs transition-colors">
        {/* Pattern to Family Tree Header */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05070E] border border-slate-200/60 dark:border-[#162032] space-y-1 transition-colors">
          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            RECOGNIZED STRUCTURAL PATTERN
          </span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono block">
            {patternName || 'RECOGNIZED PATTERN'}
          </span>
        </div>

        {/* Interactive Solution Families List */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            RELEVANT SOLUTION FAMILIES & TOOLS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {solutionFamilies.families.map((fam) => {
              const isSelected = selectedFamilyIds.has(fam.id);
              return (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => toggleFamily(fam.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-slate-900 dark:text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-[#05070E] border-slate-200/60 dark:border-[#162032] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0F172A]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                      • {fam.name}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                  {fam.detail && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {fam.detail}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Boundary Note */}
        <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-sans flex items-start gap-2.5">
          <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">💡</span>
          <span>
            {solutionFamilies.note ||
              'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.'}
          </span>
        </div>
      </div>
    </section>
  );
}

export default PatternSolutionFamilies;

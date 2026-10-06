import React, { useState } from 'react';

/**
 * SECTION 05 — CONNECT THE PATTERN TO SOLUTION FAMILIES
 * Teaches the learner which DSA solution families and tools come to mind
 * when recognizing a structural pattern, establishing a clear handoff to Stage 05 (Algorithm).
 */
export function PatternSolutionFamilies({ patternName, solutionFamilies, sectionNo = '05', selectedApproachId, onSelectApproach }) {
  if (!solutionFamilies || !solutionFamilies.families) return null;

  // Initialize selectedApproachId in parent if it's not set and families exist
  React.useEffect(() => {
    if (!selectedApproachId && solutionFamilies.families.length > 0 && onSelectApproach) {
      onSelectApproach(solutionFamilies.families[0].id);
    }
  }, [selectedApproachId, solutionFamilies, onSelectApproach]);

  const toggleFamily = (id) => {
    if (onSelectApproach) {
      onSelectApproach(id);
    }
  };

  return (
    <section className="space-y-4 font-sans" aria-labelledby="pattern-solution-families-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-cyan-600 dark:text-cyan-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>SOLUTION FAMILIES</span>
      </div>

      <h2 id="pattern-solution-families-heading" className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
        What approaches should come to mind?
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Pattern recognition identifies which families of tools and approaches are relevant.
      </p>

      {/* Interactive Solution Families List */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
          RELEVANT SOLUTION FAMILIES & TOOLS
        </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {solutionFamilies.families.map((fam) => {
              const isSelected = selectedApproachId === fam.id;
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

    </section>
  );
}

export default PatternSolutionFamilies;

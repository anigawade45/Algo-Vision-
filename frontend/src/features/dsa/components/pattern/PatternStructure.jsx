import React from 'react';

function renderPatternVisual(inputLabel, inputVisual) {
  if (!inputVisual || !Array.isArray(inputVisual)) return null;

  const labelLower = (inputLabel || '').toLowerCase();

  // CASE 1: 2D Grid Matrix
  if (labelLower.includes('grid') || labelLower.includes('matrix')) {
    return (
      <div className="flex flex-col gap-1.5 py-1">
        {inputVisual.map((rowStr, rIdx) => {
          const cells = rowStr.trim().split(/\s+/);
          return (
            <div key={rIdx} className="flex items-center gap-1.5">
              {cells.map((rawCell, cIdx) => {
                const cell = rawCell.replace(/\[|\]/g, '').trim();
                if (!cell) return null;
                const isLandOrChar = cell === '1' || /[A-Za-z]/.test(cell);
                return (
                  <div
                    key={cIdx}
                    className={`w-8 h-8 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-colors ${
                      isLandOrChar
                        ? 'bg-blue-500/10 dark:bg-blue-950/40 border-blue-500/40 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'bg-slate-100/80 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // CASE 2: Hierarchical Tree
  if (labelLower.includes('tree')) {
    return (
      <div className="flex flex-col items-center gap-1 py-1">
        <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono text-xs font-extrabold shadow-xs">
          Root Node
        </div>
        <svg width="64" height="22" viewBox="0 0 64 22" className="text-slate-400 dark:text-slate-600">
          <line x1="32" y1="2" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="2" x2="52" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
            Left Subtree
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
            Right Subtree
          </div>
        </div>
      </div>
    );
  }

  // CASE 3: Linked List / Sequential Pointer
  if (labelLower.includes('link') || labelLower.includes('pointer')) {
    return (
      <div className="flex flex-wrap items-center gap-2 py-1">
        {inputVisual.map((item, idx) => {
          const cleanText = item.replace('➔', '').trim();
          const isNull = cleanText.toLowerCase().includes('null');
          return (
            <React.Fragment key={idx}>
              <div
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${
                  isNull
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-[#05070E] border-slate-200/60 dark:border-[#162032] text-slate-800 dark:text-slate-200'
                }`}
              >
                {cleanText}
              </div>
              {!isNull && idx < inputVisual.length - 1 && (
                <span className="text-slate-400 font-bold text-xs">➔</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // CASE 4: Graph Adjacency
  if (labelLower.includes('graph')) {
    return (
      <div className="flex flex-col gap-1.5 py-1">
        {inputVisual.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900/60 font-bold text-indigo-700 dark:text-indigo-300">
              {item.split('➔')[0]?.trim()}
            </span>
            <span className="text-slate-400 font-bold">➔</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
              {item.split('➔')[1]?.trim()}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // CASE 5: Generic Default (Arrays, Sequences, Substrings, Intervals)
  return (
    <div className="flex flex-wrap items-center gap-2 py-1">
      {inputVisual.map((item, idx) => (
        <div
          key={idx}
          className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#05070E] border border-slate-200/60 dark:border-[#162032] font-mono font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export function PatternStructure({ structure, abstraction: propAbstraction, sectionNo = '01' }) {
  if (!structure) return null;

  const abstraction = propAbstraction || structure.abstraction;
  const abstractFormula = abstraction?.abstractFormula;
  const statement = abstraction?.statement;

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="pattern-structure-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>LOOK AT WHAT THE PROBLEM IS ASKING</span>
      </div>

      <h2 id="pattern-structure-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        {structure.title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {structure.subtitle}
      </p>

      {/* Visual Representation of Input & Target */}
      <div className="space-y-5 py-2">
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-6 sm:gap-10">
          {/* Input Visualization */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {structure.inputLabel}
            </span>
            {renderPatternVisual(structure.inputLabel, structure.inputVisual)}
          </div>

          {/* Target / Condition */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {structure.targetLabel}
            </span>
            <div className="px-4 py-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 font-mono font-extrabold text-xs sm:text-sm text-blue-700 dark:text-blue-300 inline-block w-fit">
              {structure.targetValue}
            </div>
          </div>
        </div>

        {/* Structural Relationship Flow */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {structure.coreRelationship?.map((rel, idx) => (
              <div
                key={idx}
                className="space-y-1 sm:pl-3 sm:border-l border-slate-200 dark:border-slate-800 first:pl-0 first:border-l-0"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {rel.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block pl-5">
                  {rel.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Abstract Structural Formula & Insight (Merged Step 03) */}
        {abstractFormula && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
              <span className="text-xs sm:text-[13px] font-mono font-extrabold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                GENERAL STRUCTURAL FORMULA
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 font-mono font-extrabold text-xs sm:text-sm py-1">
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 shadow-xs">
                {abstractFormula.varA}
              </span>
              <span className="text-blue-500 font-bold">{abstractFormula.operator}</span>
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 shadow-xs">
                {abstractFormula.varB}
              </span>
              <span className="text-blue-500 font-bold">{abstractFormula.equals}</span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 shadow-xs">
                {abstractFormula.result}
              </span>
            </div>

            {statement && (
              <div className="pl-3.5 border-l-2 border-amber-500 py-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                <span className="font-bold text-amber-600 dark:text-amber-400 mr-1.5">💡 Insight:</span>
                <span>{statement}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PatternStructure;

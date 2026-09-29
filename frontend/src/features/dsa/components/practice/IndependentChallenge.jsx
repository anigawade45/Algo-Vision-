import React, { useState, useEffect } from 'react';
import { Target, Grid, Workflow, Brain, Code2, CheckCircle2, XCircle, Send } from 'lucide-react';

/**
 * INDEPENDENT CHALLENGE
 * Learner provides four distinct decisions independently without walkthrough assistance:
 * 01 Pattern Selection (selectable options)
 * 02 Approach Selection (selectable options)
 * 03 Core Reasoning (selectable options)
 * 04 Implementation Code Editor (editable input area — NO prefilled solution code)
 */
export function IndependentChallenge({ challenge, selections, onSelectField, sectionNo = '05' }) {
  if (!challenge) return null;
  const {
    title,
    description,
    inputVisual,
    expectedOutput,
    patternOptions,
    correctPattern,
    approachOptions,
    correctApproach,
    reasoningOptions,
    correctReasoning,
    starterTemplate,
  } = challenge;

  const initialCode = selections.code || starterTemplate || '// Write your solution logic here...';
  const [codeText, setCodeText] = useState(initialCode);
  const [submitted, setSubmitted] = useState(selections.code !== undefined);

  useEffect(() => {
    setCodeText(selections.code || starterTemplate || '// Write your solution logic here...');
    setSubmitted(selections.code !== undefined);
  }, [challenge?.title, selections.code, starterTemplate]);

  const handleSubmitCode = () => {
    setSubmitted(true);
    onSelectField('code', codeText);
  };

  return (
    <section aria-labelledby="independent-challenge-heading" className="space-y-4 font-sans">
      {/* Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-cyan-600 dark:text-cyan-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <h2 id="independent-challenge-heading" className="inline text-[11px] sm:text-xs font-mono font-bold">
          INDEPENDENT CHALLENGE
        </h2>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-6">
        {/* Challenge Spec Banner */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Target className="w-4 h-4" aria-hidden="true" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              UNASSISTED APPLICATION
            </span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {inputVisual && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 font-mono text-xs">
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Input Data</span>
                <span className="text-slate-900 dark:text-white font-bold">{inputVisual}</span>
              </div>
            )}
            {expectedOutput && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 font-mono text-xs">
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Target Output</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{expectedOutput}</span>
              </div>
            )}
          </div>
        </div>

        {/* Four Decision Blocks */}
        <div className="space-y-5 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
          {/* 01 PATTERN SELECTION */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-[11px] flex items-center justify-center">01</span>
              <Grid className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
              <span>PATTERN SELECTION</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {patternOptions.map((opt) => {
                const isSelected = selections.pattern === opt.value;
                const isCorrect = opt.value === correctPattern;
                const isEvaluated = selections.pattern !== undefined;

                let btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070A13] text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-800';
                if (isEvaluated) {
                  if (isSelected && isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
                  else if (isSelected && !isCorrect) btnStyle = 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
                }

                return (
                  <button
                    type="button"
                    key={opt.value}
                    aria-pressed={isSelected}
                    onClick={() => onSelectField('pattern', opt.value)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 motion-reduce:transition-none min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${btnStyle}`}
                  >
                    <span>{opt.label}</span>
                    {isEvaluated && isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />}
                    {isEvaluated && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 02 APPROACH SELECTION */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400 text-[11px] flex items-center justify-center">02</span>
              <Workflow className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
              <span>APPROACH SELECTION</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {approachOptions.map((opt) => {
                const isSelected = selections.approach === opt.value;
                const isCorrect = opt.value === correctApproach;
                const isEvaluated = selections.approach !== undefined;

                let btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070A13] text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-800';
                if (isEvaluated) {
                  if (isSelected && isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
                  else if (isSelected && !isCorrect) btnStyle = 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
                }

                return (
                  <button
                    type="button"
                    key={opt.value}
                    aria-pressed={isSelected}
                    onClick={() => onSelectField('approach', opt.value)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 motion-reduce:transition-none min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${btnStyle}`}
                  >
                    <span>{opt.label}</span>
                    {isEvaluated && isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />}
                    {isEvaluated && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 03 CORE REASONING */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 text-[11px] flex items-center justify-center">03</span>
              <Brain className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>CORE REASONING</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {reasoningOptions.map((opt) => {
                const isSelected = selections.reasoning === opt.value;
                const isCorrect = opt.value === correctReasoning;
                const isEvaluated = selections.reasoning !== undefined;

                let btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070A13] text-slate-700 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-800';
                if (isEvaluated) {
                  if (isSelected && isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
                  else if (isSelected && !isCorrect) btnStyle = 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
                }

                return (
                  <button
                    type="button"
                    key={opt.value}
                    aria-pressed={isSelected}
                    onClick={() => onSelectField('reasoning', opt.value)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 motion-reduce:transition-none min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${btnStyle}`}
                  >
                    <span>{opt.label}</span>
                    {isEvaluated && isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />}
                    {isEvaluated && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 04 IMPLEMENTATION EDITOR (EMPTY/EDITABLE — NO SOLUTION CODE PREFILLED) */}
          <div className="space-y-2">
            <label id="independent-code-label" className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center justify-center">04</span>
              <Code2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span>IMPLEMENTATION CODE</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Write your implementation logic below to test independent application.
            </p>

            <div className="relative space-y-2">
              <textarea
                aria-labelledby="independent-code-label"
                value={codeText}
                onChange={(e) => {
                  setCodeText(e.target.value);
                  setSubmitted(false);
                }}
                rows={6}
                placeholder="Write your solution here..."
                className="w-full p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400" aria-live="polite">
                  {submitted ? '✓ Implementation Submitted' : 'Unsubmitted Draft'}
                </span>
                <button
                  type="button"
                  onClick={handleSubmitCode}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold transition-all duration-150 motion-reduce:transition-none flex items-center gap-1.5 cursor-pointer min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Check Solution</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IndependentChallenge;

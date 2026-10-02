import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InputDataRenderer } from './InputDataRenderer';
import { OutputDataRenderer } from './OutputDataRenderer';

/**
 * Generic Example Explorer Component.
 * Delegates output rendering to OutputDataRenderer and provides clean
 * data-driven example exploration & reasoning across all 10 DSA problem types.
 * Isolates Two Sum interaction cleanly behind `interaction.type === "pair_sum"`.
 */
export function GenericExampleExplorer({ testCases = [], testCaseExplanations = [], problemType, category }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [showReasoning, setShowReasoning] = useState(false);

  // Clean state reset whenever testCases prop changes (e.g., switching test problems)
  useEffect(() => {
    setActiveIdx(0);
    setSelectedIndices([]);
    setShowReasoning(false);
  }, [testCases]);

  if (!testCases || testCases.length === 0) return null;

  const currentTestCase = testCases[activeIdx] || testCases[0];
  const { inputStructured, outputStructured, reasoning, interaction, inputRaw, outputRaw } = currentTestCase;
  const activeTestCaseId = currentTestCase.id || activeIdx + 1;

  const aiExplanationObj = (testCaseExplanations || []).find(
    (item) => Number(item.testCaseId) === Number(activeTestCaseId)
  );
  const aiExplanationText = aiExplanationObj?.explanation;

  const hasExplanation = (reasoning && reasoning.length > 0) || Boolean(aiExplanationText);

  const handleExampleChange = (idx) => {
    setActiveIdx(idx);
    setSelectedIndices([]);
    setShowReasoning(false);
  };

  const handleSelectElement = (idx) => {
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== idx));
    } else {
      if (selectedIndices.length >= 2) {
        setSelectedIndices([idx]);
      } else {
        setSelectedIndices([...selectedIndices, idx]);
      }
    }
  };

  // Two Sum Pair Selection interaction derivation
  const isPairSumInteraction = interaction?.type === 'pair_sum';
  const array = isPairSumInteraction ? interaction.array || [] : [];
  const target = isPairSumInteraction ? interaction.target : null;

  const hasTwoSelected = selectedIndices.length === 2;
  const val1 = hasTwoSelected ? array[selectedIndices[0]] : null;
  const val2 = hasTwoSelected ? array[selectedIndices[1]] : null;
  const currentSum = hasTwoSelected ? val1 + val2 : null;
  const isCorrectPair = hasTwoSelected && currentSum === target;

  return (
    <section className="space-y-5 font-sans" aria-labelledby="example-explorer-heading">
      {/* Header & Example Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block">
            INTERACTIVE EXPLORER
          </span>
          <h2 id="example-explorer-heading" className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Sample Case Analysis
          </h2>
        </div>

        {testCases.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Sample Case Selector">
            {testCases.map((tc, idx) => (
              <button
                key={tc.id || idx}
                type="button"
                role="tab"
                aria-selected={activeIdx === idx}
                onClick={() => handleExampleChange(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer min-h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  activeIdx === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#161F33] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E2638]'
                }`}
              >
                Example #{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Surface */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-6 shadow-xs transition-colors">
        
        {/* OPTION 1: Interactive Two Sum Pair Selection */}
        {isPairSumInteraction ? (
          <div className="space-y-6">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Select <strong className="text-slate-800 dark:text-slate-200 font-semibold">two numbers</strong> below to test if their sum equals target <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{target}</strong>:
            </div>

            {/* Capsules */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Array Elements & Indices
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {array.map((val, idx) => {
                  const isSelected = selectedIndices.includes(idx);
                  const selectionOrder = selectedIndices.indexOf(idx);

                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`Select array element ${val} at index ${idx}`}
                      onClick={() => handleSelectElement(idx)}
                      className={`relative group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border font-mono transition-all duration-150 motion-reduce:transition-none cursor-pointer min-w-16 min-h-[64px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isSelected
                          ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-slate-50 dark:bg-[#070A13] border-slate-200 dark:border-[#1E2638] text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                          {selectionOrder + 1}
                        </span>
                      )}
                      <span className="text-lg font-bold">[{val}]</span>
                      <span className="text-[10px] text-slate-400 font-normal mt-1">idx: {idx}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Feedback */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05070E] border border-slate-200/80 dark:border-[#162032] space-y-3 transition-colors" aria-live="polite">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-[#162032] pb-2 text-xs font-mono">
                <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                  Target: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{target}</span>
                </span>

                {selectedIndices.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedIndices([])}
                    className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded px-1"
                  >
                    <RotateCcw className="w-3 h-3 shrink-0" aria-hidden="true" /> Reset
                  </button>
                )}
              </div>

              {selectedIndices.length === 0 && (
                <div className="text-xs text-slate-400 italic py-1">
                  Click two array element capsules above to test their sum.
                </div>
              )}

              {selectedIndices.length === 1 && (
                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  Selected 1st number: <span className="font-bold text-blue-600 dark:text-blue-400">{val1}</span> at index {selectedIndices[0]}. Select a 2nd number.
                </div>
              )}

              {hasTwoSelected && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 font-mono text-sm sm:text-base font-bold">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {val1}
                    </span>
                    <span className="text-slate-400">+</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {val2}
                    </span>
                    <span className="text-slate-400">=</span>
                    <span className={`px-2 py-0.5 rounded ${isCorrectPair ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                      {currentSum}
                    </span>
                  </div>

                  {isCorrectPair ? (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-xs font-mono text-emerald-700 dark:text-emerald-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                        Target Sum Achieved ({val1} + {val2} = {target})!
                      </div>
                      <div>Revealed Expected Output: <span className="font-bold text-emerald-800 dark:text-emerald-200">[{selectedIndices.join(', ')}]</span></div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 text-xs font-mono text-amber-700 dark:text-amber-300">
                      These two values do not produce the target sum ({currentSum} ≠ {target}). Try another pair!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* OPTION 2: Generic Clean Input ➔ Output Transformation View */
          <div className="space-y-4">
            <InputDataRenderer
              inputData={inputStructured || (inputRaw !== undefined ? { value: inputRaw, type: problemType, category } : null)}
              label="GIVEN INPUT"
            />

            {/* Delegate output rendering cleanly to OutputDataRenderer */}
            <OutputDataRenderer
              outputData={outputStructured}
              rawOutput={outputRaw}
              problemType={problemType}
              category={category}
              label="EXPECTED OUTPUT"
            />
          </div>
        )}

        {/* Reasoning Dropdown */}
        {hasExplanation && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              aria-expanded={showReasoning}
              aria-controls="reasoning-explanation-panel"
              onClick={() => setShowReasoning(!showReasoning)}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{showReasoning ? 'Hide example explanation' : 'Why is this the expected output?'}</span>
              {showReasoning ? <ChevronUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            </button>

            {showReasoning && (
              <div
                id="reasoning-explanation-panel"
                className="mt-3 border-l-2 border-blue-500 pl-4 py-1 text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300 transition-all duration-200 motion-reduce:transition-none"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Example Analysis:
                </div>

                {aiExplanationText && (
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-xs sm:text-sm bg-blue-50/50 dark:bg-blue-950/30 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                    {aiExplanationText}
                  </p>
                )}

                {reasoning && reasoning.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {reasoning.map((item, idx) => (
                      <li key={idx} className="text-slate-600 dark:text-slate-400">
                        • {typeof item === 'object' ? `${item.label}: ${item.value}` : String(item)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

export default GenericExampleExplorer;

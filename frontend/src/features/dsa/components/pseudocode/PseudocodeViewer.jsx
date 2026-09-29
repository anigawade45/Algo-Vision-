import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, RotateCcw, Copy, Check } from 'lucide-react';

/**
 * SECTION 04 — PSEUDOCODE VIEWER & INTERACTIVE STEP MODE
 * Renders language-independent pseudocode with line numbers, monospace formatting,
 * active line highlighting, auto-scroll capability, and step-by-step explanations.
 */
export function PseudocodeViewer({ lines, sectionNo = '04' }) {
  if (!lines || !lines.length) return null;

  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  // Reset active line index when lines prop changes (e.g. switching problem or approach)
  useEffect(() => {
    setActiveLineIdx(0);
  }, [lines]);

  // Ensure safe bounded index
  const safeActiveLineIdx = Math.min(Math.max(0, activeLineIdx), lines.length - 1);
  const activeLine = lines[safeActiveLineIdx] || lines[0];

  // Auto-scroll active line into view smoothly
  useEffect(() => {
    const el = lineRefs.current[safeActiveLineIdx];
    if (el) {
      el.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [safeActiveLineIdx]);

  const handleNextLine = useCallback(() => {
    setActiveLineIdx((prev) => Math.min(prev + 1, lines.length - 1));
  }, [lines.length]);

  const handlePrevLine = useCallback(() => {
    setActiveLineIdx((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setActiveLineIdx(0);
  }, []);

  // Global arrow navigation inside viewer container
  const handleKeyDownContainer = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleNextLine();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handlePrevLine();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveLineIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveLineIdx(lines.length - 1);
    }
  };

  const handleCopyCode = () => {
    const fullText = lines.map((l) => `${'  '.repeat(l.indentLevel || 0)}${l.text}`).join('\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section
      className="space-y-3.5 font-sans focus-visible:outline-none"
      aria-labelledby="pseudocode-viewer-heading"
      onKeyDown={handleKeyDownContainer}
      tabIndex={-1}
    >
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-purple-600 dark:text-purple-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>PSEUDOCODE VIEWER</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="pseudocode-viewer-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
            Language-Independent Logic
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Step through each line to understand control flow and state logic. Use ↑/↓ keys to navigate.
          </p>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handlePrevLine}
            disabled={safeActiveLineIdx === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#161F33] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E2638] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Previous line (Up arrow)"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Prev</span>
          </button>

          <span className="text-xs text-slate-600 dark:text-slate-400 font-bold px-1 select-none">
            Line {safeActiveLineIdx + 1} / {lines.length}
          </span>

          <button
            type="button"
            onClick={handleNextLine}
            disabled={safeActiveLineIdx === lines.length - 1}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Next line (Down arrow)"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161F33] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            title="Reset to Line 1"
            aria-label="Reset to Line 1"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main Pseudocode Box */}
      <div className="rounded-2xl bg-[#070A13] border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm overflow-hidden shadow-lg transition-colors">
        {/* Editor Top Bar */}
        <div className="px-4 py-2 bg-[#0B101D] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-bold uppercase tracking-wider text-slate-300">
              algorithm_pseudocode.logic
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] text-slate-500 font-sans">
              Press ↑/↓ to step
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded px-1.5 py-0.5"
              aria-label="Copy pseudocode logic"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Container */}
        <div
          ref={containerRef}
          className="p-3 sm:p-4 space-y-1 overflow-x-auto max-h-[460px]"
          role="region"
          aria-label="Pseudocode editor line view"
        >
          {lines.map((item, idx) => {
            const isActive = idx === safeActiveLineIdx;
            const lineNo = item.line < 10 ? `0${item.line}` : `${item.line}`;

            let indentPadding = '';
            if (item.indentLevel === 1 || (item.indent && !item.indentLevel)) {
              indentPadding = 'pl-6 sm:pl-8';
            } else if (item.indentLevel === 2) {
              indentPadding = 'pl-10 sm:pl-16';
            } else if (item.indentLevel === 3) {
              indentPadding = 'pl-14 sm:pl-24';
            }

            let textHighlight = 'text-slate-300';
            if (item.type === 'start' || item.type === 'end') {
              textHighlight = 'text-indigo-400 font-bold';
            } else if (item.type === 'loop' || item.type === 'condition') {
              textHighlight = 'text-amber-300 font-bold';
            } else if (item.type === 'return') {
              textHighlight = 'text-emerald-400 font-bold';
            }

            return (
              <div
                key={idx}
                ref={(el) => (lineRefs.current[idx] = el)}
                onClick={() => setActiveLineIdx(idx)}
                className={`flex items-center gap-3 sm:gap-4 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 motion-reduce:transition-none ${
                  isActive
                    ? 'bg-blue-600/30 border border-blue-500/60 text-white font-bold shadow-xs'
                    : 'hover:bg-slate-800/50 border border-transparent'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
                role="button"
                tabIndex={0}
                aria-selected={isActive}
                aria-label={`Line ${item.line}: ${item.text}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveLineIdx(idx);
                  }
                }}
              >
                {/* Line Number */}
                <span
                  className={`w-6 text-right font-mono text-xs select-none shrink-0 ${
                    isActive ? 'text-blue-400 font-bold' : 'text-slate-600'
                  }`}
                >
                  {lineNo}
                </span>

                {/* Code Text with Indentation */}
                <span className={`flex-1 min-w-0 ${indentPadding} ${textHighlight}`}>
                  {item.text}
                </span>

                {/* Active Indicator Badge */}
                {isActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500 text-white font-bold tracking-wider uppercase shrink-0">
                    ACTIVE STEP
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Line Explanation Box */}
      {activeLine && activeLine.explanation && (
        <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-1 font-sans transition-colors">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
            <Play className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true" />
            <span>EXPLANATION FOR LINE {activeLine.line < 10 ? `0${activeLine.line}` : activeLine.line}</span>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
            <span className="text-slate-900 dark:text-white font-extrabold break-all">"{activeLine.text}"</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium pt-1">
            {activeLine.explanation}
          </p>
        </div>
      )}
    </section>
  );
}

export default PseudocodeViewer;

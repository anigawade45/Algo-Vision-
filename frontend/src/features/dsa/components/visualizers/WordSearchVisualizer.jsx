import React from 'react';
import { Grid, Sparkles, CheckCircle2, XCircle, ArrowRight, CornerDownRight, Search, Footprints, Eye } from 'lucide-react';
import { VisualizationLegend } from './primitives/VisualizationLegend';

/**
 * WordSearchVisualizer — Stage 09 Dedicated 2D Backtracking DFS Visualizer for Word Search (LeetCode 79)
 * Visualizes:
 * 1. Target Word Character Ribbon with matched progress and pointer
 * 2. 2D Board Grid with numbered path traversal steps (#1, #2, ...)
 * 3. Head cell pointer and active directional exploration (Up, Down, Left, Right)
 * 4. Backtracking call stack sequence
 * 5. Full winning path emerald glow
 */
export function WordSearchVisualizer({
  problem,
  step,
  state: passedState,
  highlights: passedHighlights,
}) {
  const state =
    passedState ||
    step?.state ||
    problem?.initialState?.primitives ||
    problem?.initialState?.flatState ||
    problem?.initialState ||
    {};
  const highlights = passedHighlights || step?.highlights || {};
  const description = step?.description;

  // Safe extraction helpers
  const extractMatrix = (val) => {
    if (Array.isArray(val) && val.length > 0 && Array.isArray(val[0])) return val;
    if (val && Array.isArray(val.grid)) return val.grid;
    if (val && Array.isArray(val.board)) return val.board;
    if (val && Array.isArray(val.values)) return val.values;
    if (val && Array.isArray(val.value)) return val.value;
    return null;
  };

  const extractString = (val) => {
    if (typeof val === 'string' && val.trim() !== '') return val;
    if (val && typeof val.word === 'string') return val.word;
    if (val && typeof val.value === 'string') return val.value;
    return null;
  };

  const extractArray = (val) => {
    if (Array.isArray(val)) return val;
    if (val && Array.isArray(val.value)) return val.value;
    return null;
  };

  const extractNumber = (val) => {
    if (typeof val === 'number' && !isNaN(val)) return val;
    if (val && typeof val.value === 'number') return val.value;
    return null;
  };

  // 1. Board Grid
  const board =
    extractMatrix(state.board) ||
    extractMatrix(state.grid) ||
    extractMatrix(step?.state?.board) ||
    extractMatrix(step?.state?.grid) ||
    extractMatrix(problem?.input?.board) ||
    extractMatrix(problem?.input?.grid) ||
    extractMatrix(problem?.input?.value?.grid) ||
    extractMatrix(problem?.inputData?.value?.grid) ||
    [
      ['A', 'B', 'C', 'E'],
      ['S', 'F', 'C', 'S'],
      ['A', 'D', 'E', 'E'],
    ];

  // 2. Target Word
  const word =
    extractString(state.word) ||
    extractString(step?.state?.word) ||
    extractString(problem?.input?.word) ||
    extractString(problem?.input?.value?.word) ||
    extractString(problem?.inputData?.value?.word) ||
    'ABCCED';

  // 3. Current Head Cell [r, c]
  const currentCell =
    extractArray(state.currentCell) ||
    extractArray(step?.state?.currentCell) ||
    extractArray(highlights.currentCell) ||
    null;

  // 4. Current Path Array of [r, c]
  const currentPath =
    extractArray(state.path) ||
    extractArray(state.currentPath) ||
    extractArray(step?.state?.path) ||
    extractArray(step?.state?.currentPath) ||
    extractArray(highlights.path) ||
    [];

  // 5. Matched word index (how many characters of word matched)
  const wordIndex =
    extractNumber(state.wordIndex) ??
    extractNumber(step?.state?.wordIndex) ??
    extractNumber(highlights.wordIndex) ??
    currentPath.length;

  // 6. Algorithm Phase & Completion
  const isCompleted =
    step?.operation === 'complete' ||
    state.isComplete ||
    step?.state?.isComplete ||
    state.phase === 'COMPLETE';

  const isFound =
    state.found === true ||
    step?.state?.found === true ||
    state.result === true ||
    step?.state?.result === true ||
    (isCompleted && wordIndex >= word.length);

  const isBacktracking =
    step?.operation === 'backtrack' ||
    state.phase === 'BACKTRACK' ||
    highlights.isBacktracking;

  // Pre-execution detection
  const isPreExecution =
    step?.stepNumber === 0 ||
    step?.operation === 'INITIAL_INPUT' ||
    (currentCell === null && currentPath.length === 0 && wordIndex === 0 && !isCompleted);

  // Set lookup for fast path checks
  const pathMap = new Map();
  currentPath.forEach(([r, c], idx) => {
    pathMap.set(`${r},${c}`, idx + 1);
  });

  const legendItems = [
    { label: 'Path Sequence (#1, #2)', badgeClass: 'bg-indigo-600 text-white' },
    { label: 'Current Search Head', badgeClass: 'bg-blue-500 ring-2 ring-blue-400' },
    { label: 'Winning Target Path', badgeClass: 'bg-emerald-600 text-white' },
    { label: 'Backtracked Cell', badgeClass: 'bg-rose-500 text-white' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Target Word Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Target Word
          </span>
          <div className="my-1 flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
              {word}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Length: {word.length} letters
          </span>
        </div>

        {/* Matched Progress Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Matched Letters
          </span>
          <div className="my-1 flex items-center gap-2 font-mono">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {wordIndex} / {word.length}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((wordIndex / word.length) * 100))}%` }}
            />
          </div>
        </div>

        {/* Current Head Cell Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-blue-200 dark:border-blue-900/40 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            Search Head Cell
          </span>
          <div className="my-1 font-mono text-lg font-bold text-blue-600 dark:text-blue-400 truncate">
            {currentCell ? `[${currentCell[0]}, ${currentCell[1]}] = '${board[currentCell[0]]?.[currentCell[1]] || ''}'` : '—'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {currentCell ? `Depth: ${currentPath.length}` : 'Scanner ready'}
          </span>
        </div>

        {/* Search Status Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-amber-200 dark:border-amber-900/40 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
            Status
          </span>
          <div className="my-1 font-mono text-xs font-bold truncate">
            {isFound ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Word Found!
              </span>
            ) : isBacktracking ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center gap-1 w-fit">
                Backtracking...
              </span>
            ) : isCompleted ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 w-fit">
                Not Found
              </span>
            ) : currentPath.length > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 w-fit">
                Exploring DFS
              </span>
            ) : (
              <span className="text-slate-400">Ready to Start</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            2D DFS Backtrack
          </span>
        </div>
      </div>

      {/* Description Banner */}
      {description && (
        <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#1E2638] text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="leading-relaxed">{description}</span>
        </div>
      )}

      {/* Word Target Character Ribbon */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            Target Word Sequence
          </span>
          <span className="text-[11px] text-slate-400">
            Scanning letter {Math.min(wordIndex + 1, word.length)} of {word.length}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
          {word.split('').map((char, idx) => {
            const isMatched = idx < wordIndex;
            const isCurrentTarget = idx === wordIndex && !isCompleted;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-bold border transition-all duration-200 ${
                    isFound
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400/50'
                      : isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : isCurrentTarget
                      ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-600 dark:text-blue-300 ring-2 ring-blue-400/50 scale-105'
                      : 'bg-slate-50 dark:bg-[#111726] border-slate-200 dark:border-[#222D45] text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {char}
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  #{idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2D Board Grid */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs flex flex-col items-center space-y-4">
        <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Board Grid ({board.length} × {board[0]?.length || 0})
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {currentPath.length > 0 ? `Active Path: ${currentPath.length} cells` : 'Awaiting DFS exploration'}
          </span>
        </div>

        {/* Grid Cells Table */}
        <div className="overflow-x-auto py-2">
          <div className="flex flex-col gap-2">
            {board.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-2">
                {/* Row label */}
                <span className="w-4 text-[10px] font-mono text-slate-400 text-right">
                  {rIdx}
                </span>

                {row.map((cellChar, cIdx) => {
                  const pathStep = pathMap.get(`${rIdx},${cIdx}`);
                  const inPath = pathStep !== undefined;
                  const isHead = currentCell && currentCell[0] === rIdx && currentCell[1] === cIdx;

                  return (
                    <div
                      key={cIdx}
                      className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-lg border transition-all duration-200 ${
                        isFound && inPath
                          ? 'bg-emerald-100 dark:bg-emerald-950/90 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400 shadow-md scale-105'
                          : isHead
                          ? 'bg-blue-50 dark:bg-blue-950/90 border-blue-500 text-blue-600 dark:text-blue-300 ring-2 ring-blue-400/60 scale-105 shadow-sm'
                          : inPath
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-xs'
                          : 'bg-slate-50 dark:bg-[#111726] border-slate-200 dark:border-[#222D45] text-slate-800 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Path step indicator (#1, #2, etc.) */}
                      {inPath && (
                        <span
                          className={`absolute top-1 left-1.5 text-[9px] font-bold px-1 rounded-sm leading-tight ${
                            isFound
                              ? 'bg-emerald-500 text-white'
                              : isHead
                              ? 'bg-blue-600 text-white'
                              : 'bg-indigo-600 text-white'
                          }`}
                        >
                          #{pathStep}
                        </span>
                      )}

                      {/* Character */}
                      <span className="mt-1">{cellChar}</span>

                      {/* Coordinate */}
                      <span className="text-[8px] text-slate-400/80 -mt-0.5">
                        {rIdx},{cIdx}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Path Call Stack Ribbon */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-indigo-500" />
            Current Backtracking Path (Call Stack)
          </span>
          <span className="text-[11px] text-slate-400">
            {currentPath.length} nodes deep
          </span>
        </div>

        {currentPath.length === 0 ? (
          <div className="p-3 text-center text-xs font-mono text-slate-400 italic">
            No active search path on board.
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {currentPath.map(([r, c], idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold shrink-0 ${
                    idx === currentPath.length - 1
                      ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-400 text-blue-700 dark:text-blue-300 ring-1 ring-blue-400'
                      : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-400">#{idx + 1}</span>
                  <span>[{r},{c}]</span>
                  <span className="px-1 py-0.2 rounded bg-white dark:bg-[#0B101D] border text-[11px]">
                    '{board[r]?.[c] || ''}'
                  </span>
                </div>
                {idx < currentPath.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <VisualizationLegend items={legendItems} />
    </div>
  );
}


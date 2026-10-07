import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Keyboard,
} from 'lucide-react';

export function VisualizationControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onPrevStep,
  onNextStep,
  onTogglePlay,
  onReset,
  onChangeSpeed,
}) {
  const currentStepNum = totalSteps > 0 ? currentStepIndex + 1 : 0;
  const progressPercent = totalSteps > 0 ? (currentStepNum / totalSteps) * 100 : 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex >= totalSteps - 1;

  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-3">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Playback Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous Step */}
          <button
            type="button"
            onClick={onPrevStep}
            disabled={isFirstStep}
            title="Previous Step (Left Arrow)"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#222D45] bg-slate-50 dark:bg-[#111726] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A2338] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Primary Play / Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={isLastStep && !isPlaying}
            title={isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'}
            className={`px-5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Simulation</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            type="button"
            onClick={onNextStep}
            disabled={isLastStep}
            title="Next Step (Right Arrow)"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#222D45] bg-slate-50 dark:bg-[#111726] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A2338] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Reset Button (Visually Secondary) */}
          <button
            type="button"
            onClick={onReset}
            title="Reset to Step 1 (R)"
            className="p-2 rounded-xl border border-slate-200 dark:border-[#222D45] bg-slate-50 dark:bg-[#111726] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A2338] cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator & Speed Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
            Step <span className="text-blue-600 dark:text-blue-400">{currentStepNum}</span> / {totalSteps}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#111726] p-1 rounded-xl border border-slate-200 dark:border-[#222D45]">
            <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  playbackSpeed === s
                    ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#151D2F] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Inline Keyboard Shortcut Hints */}
      <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-[#162032]">
        <div className="flex items-center gap-1">
          <Keyboard className="w-3 h-3 text-slate-400" />
          <span className="uppercase tracking-wider">Shortcuts:</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span><kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-slate-700 font-bold">←</kbd> Prev</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-slate-700 font-bold">→</kbd> Next</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-slate-700 font-bold">Space</kbd> Play/Pause</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-slate-700 font-bold">R</kbd> Reset</span>
        </div>
      </div>
    </div>
  );
}

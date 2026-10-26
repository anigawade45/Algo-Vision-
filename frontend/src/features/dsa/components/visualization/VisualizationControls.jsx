import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Keyboard,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { PLAYBACK_STATUS } from '../../data/playbackStatus.js';

export { PLAYBACK_STATUS };

export function VisualizationControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  playbackStatus = PLAYBACK_STATUS.INITIAL_INPUT,
  onPrevStep,
  onNextStep,
  onTogglePlay,
  onReset,
  onChangeSpeed,
  onGenerateAiTrace,
  isGeneratingAiTrace = false,
}) {
  const isReplayable = totalSteps > 1;
  const safeStepIndex = Math.max(0, Math.min(typeof currentStepIndex === 'number' ? currentStepIndex : 0, Math.max(0, totalSteps - 1)));
  const maxStep = isReplayable ? totalSteps - 1 : 0;
  const progressPercent = isReplayable && maxStep > 0 ? (safeStepIndex / maxStep) * 100 : 0;
  const isFirstStep = safeStepIndex === 0;
  const isLastStep = isReplayable && safeStepIndex >= maxStep;

  const speeds = [0.5, 1, 1.5, 2];

  const getPlayButtonConfig = () => {
    switch (playbackStatus) {
      case PLAYBACK_STATUS.PLAYING:
        return {
          icon: <Pause className="w-4 h-4" />,
          label: 'Pause',
          disabled: false,
          className: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm cursor-pointer',
          title: 'Pause Playback (Spacebar)',
        };
      case PLAYBACK_STATUS.PAUSED:
        return {
          icon: <Play className="w-4 h-4 fill-current" />,
          label: 'Resume',
          disabled: false,
          className: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm cursor-pointer',
          title: 'Resume Playback (Spacebar)',
        };
      case PLAYBACK_STATUS.COMPLETED:
        return {
          icon: <RotateCcw className="w-4 h-4" />,
          label: 'Replay',
          disabled: false,
          className: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm cursor-pointer',
          title: 'Restart and Replay Trace (Spacebar)',
        };
      case PLAYBACK_STATUS.READY:
        return {
          icon: <Play className="w-4 h-4 fill-current" />,
          label: 'Play Simulation',
          disabled: false,
          className: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm cursor-pointer',
          title: 'Play Simulation (Spacebar)',
        };
      case PLAYBACK_STATUS.TRACE_UNAVAILABLE:
        if (onGenerateAiTrace) {
          return {
            icon: isGeneratingAiTrace ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4 fill-current text-white" />,
            label: isGeneratingAiTrace ? 'Generating Trace...' : 'Generate with AI',
            disabled: isGeneratingAiTrace,
            className: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-purple-500 shadow-sm cursor-pointer',
            title: 'Generate step-by-step execution animation trace using Gemini AI',
            isAiAction: true,
          };
        }
        return {
          icon: <Play className="w-4 h-4 opacity-40" />,
          label: 'Trace Unavailable',
          disabled: true,
          className: 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed',
          title: 'Execution playback requires a recorded algorithm trace. The initial data structure is rendered above.',
        };
      case PLAYBACK_STATUS.TRACE_ERROR:
        return {
          icon: <AlertCircle className="w-4 h-4 opacity-50 text-rose-500" />,
          label: 'Trace Error',
          disabled: true,
          className: 'bg-rose-50 dark:bg-rose-950/30 text-rose-500 border-rose-200 dark:border-rose-900/40 cursor-not-allowed',
          title: 'Failed to retrieve or validate execution trace.',
        };
      case PLAYBACK_STATUS.INITIAL_INPUT:
      default:
        return {
          icon: <Play className="w-4 h-4 opacity-40" />,
          label: isReplayable ? 'Play Simulation' : 'Initial Input State',
          disabled: !isReplayable,
          className: isReplayable
            ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm cursor-pointer'
            : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed',
          title: isReplayable ? 'Play Simulation (Spacebar)' : 'Direct test-case input loaded. Awaiting execution trace.',
        };
    }
  };

  const playBtn = getPlayButtonConfig();

  // Render Step Counter / Status Badge
  const renderStepIndicator = () => {
    if (playbackStatus === PLAYBACK_STATUS.TRACE_UNAVAILABLE) {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[11px] border border-purple-500/20">
            Initial Input State
          </span>
          <span className="text-slate-400 text-[11px] font-normal">
            {isGeneratingAiTrace ? '(AI Generating...)' : '(AI Generation Available)'}
          </span>
        </div>
      );
    }

    if (playbackStatus === PLAYBACK_STATUS.TRACE_ERROR) {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[11px] border border-rose-500/20">
            Trace Error
          </span>
          <span className="text-slate-400 text-[11px] font-normal">(Input Preserved)</span>
        </div>
      );
    }

    if (isReplayable) {
      return (
        <div className="flex items-center gap-2">
          <span>
            {safeStepIndex === 0 ? (
              <>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Step 0</span> / {maxStep}
                <span className="text-slate-400 font-normal text-[11px] ml-1.5">(Initial Input)</span>
              </>
            ) : (
              <>
                Step <span className="text-blue-600 dark:text-blue-400 font-bold">{safeStepIndex}</span> / {maxStep}
              </>
            )}
          </span>
          {playbackStatus === PLAYBACK_STATUS.PLAYING && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 font-bold animate-pulse">
              Playing
            </span>
          )}
          {playbackStatus === PLAYBACK_STATUS.PAUSED && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 font-bold">
              Paused
            </span>
          )}
          {playbackStatus === PLAYBACK_STATUS.COMPLETED && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold">
              Completed
            </span>
          )}
          {playbackStatus === PLAYBACK_STATUS.READY && safeStepIndex === 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-500/10 text-slate-500 font-bold">
              Ready
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-500/20">
          Initial Input State
        </span>
        <span className="text-slate-400 text-[11px] font-normal">(1 of 1)</span>
      </div>
    );
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-3">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Playback Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous Step */}
          <button
            id="playback-prev-btn"
            type="button"
            onClick={onPrevStep}
            disabled={!isReplayable || isFirstStep}
            title={isReplayable ? 'Previous Step (Left Arrow)' : 'Step controls inactive'}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#222D45] bg-slate-50 dark:bg-[#111726] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A2338] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Primary Play / Pause / Resume / Replay / AI Generate Button */}
          <button
            id="playback-play-btn"
            type="button"
            onClick={playBtn.isAiAction ? onGenerateAiTrace : onTogglePlay}
            disabled={playBtn.disabled}
            title={playBtn.title}
            className={`px-5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${playBtn.className}`}
          >
            {playBtn.icon}
            <span>{playBtn.label}</span>
          </button>

          {/* Next Step */}
          <button
            id="playback-next-btn"
            type="button"
            onClick={onNextStep}
            disabled={!isReplayable || isLastStep}
            title={isReplayable ? 'Next Step (Right Arrow)' : 'Step controls inactive'}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#222D45] bg-slate-50 dark:bg-[#111726] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A2338] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Reset Button */}
          <button
            id="playback-reset-btn"
            type="button"
            onClick={onReset}
            title="Reset to Initial State (R)"
            className="p-2 rounded-xl border border-slate-200 dark:border-[#222D45] bg-slate-50 dark:bg-[#111726] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A2338] cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator & Speed Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
            {renderStepIndicator()}
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

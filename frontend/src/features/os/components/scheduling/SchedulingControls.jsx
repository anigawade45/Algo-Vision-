import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

export default function SchedulingControls({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange
}) {
  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Step Counter */}
      <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
        STEP: <span className="text-blue-500 font-mono text-sm">{currentStep}</span> / <span className="font-mono text-sm">{totalSteps}</span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          title="Reset Simulation"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onPrev}
          disabled={currentStep <= 1}
          title="Previous Event"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={onTogglePlay}
          title={isPlaying ? "Pause Simulation" : "Start Simulation"}
          className={`p-3 rounded-xl text-white transition-all cursor-pointer shadow-md ${
            isPlaying 
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
        <button
          onClick={onNext}
          disabled={currentStep >= totalSteps}
          title="Next Event"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Speed Slider */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Speed:
        </span>
        <input
          type="range"
          min="500"
          max="2500"
          step="250"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 w-28"
        />
        <span className="text-[10px] font-mono font-bold text-slate-500 min-w-[50px] text-right">
          {(speed / 1000).toFixed(2)}s / step
        </span>
      </div>
    </div>
  );
}

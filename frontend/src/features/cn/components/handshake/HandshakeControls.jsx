import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, FastForward, Sliders, RefreshCw } from 'lucide-react';
import { TCP_SCENARIOS } from '../../utils/tcpSimulation';

export function HandshakeControls({
  scenario,
  onSelectScenario,
  currentStepIndex,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBack,
  onReset,
  speed,
  onChangeSpeed,
  clientIsn,
  serverIsn,
  onChangeIsn,
}) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-sm space-y-6 font-sans">
      {/* Top: Scenario Selector Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-emerald-500" />
          <span>Select TCP Simulation Scenario</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {TCP_SCENARIOS.map((sc) => {
            const isSelected = scenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-slate-900 dark:text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-[#111827] border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {sc.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold truncate">
                  {sc.name}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* ISN Sequence Inputs & Speed Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
            Client Initial Seq (ISN_A)
          </label>
          <input
            type="number"
            value={clientIsn}
            onChange={(e) => onChangeIsn('client', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
            Server Initial Seq (ISN_B)
          </label>
          <input
            type="number"
            value={serverIsn}
            onChange={(e) => onChangeIsn('server', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            placeholder="5000"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
            Playback Speed
          </label>
          <div className="flex items-center gap-1.5">
            {[
              { label: '0.5x', value: 1600 },
              { label: '1.0x', value: 1000 },
              { label: '2.0x', value: 500 },
            ].map((spd) => (
              <button
                key={spd.label}
                onClick={() => onChangeSpeed(spd.value)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
                  speed === spd.value
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Playback Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {/* Step Progress Bar & Indicators */}
        <div className="space-y-1.5 flex-1 max-w-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Step Progress</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Buttons: Back, Play/Pause, Forward, Reset */}
        <div className="flex items-center gap-2 self-center sm:self-auto">
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Reset Simulation to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onStepBack}
            disabled={currentStepIndex === 0}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Play Flow'}</span>
              </>
            )}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  Box,
  Clock,
  RefreshCw,
  Sliders,
  AlertTriangle,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import {
  parseReferenceString,
  runSimulation
} from '../../utils/pageReplacementAlgorithms';

const PRESETS = [
  {
    name: 'Classic Example',
    refString: '7 0 1 2 0 3 0 4 2 3 0 3 2',
    frames: 3
  },
  {
    name: 'Short Example',
    refString: '1 2 3 1 4 5',
    frames: 3
  },
  {
    name: "Belady's Anomaly (FIFO)",
    refString: '1 2 3 4 1 2 5 1 2 3 4 5',
    frames: 3
  },
  {
    name: 'LRU Favorite',
    refString: '7 0 1 2 0 3 0 4',
    frames: 3
  },
  {
    name: 'Optimal Benchmark',
    refString: '2 3 2 1 5 2 4 5 3 2 5 2',
    frames: 3
  }
];

const ALGORITHMS = ['FIFO', 'LRU', 'Optimal', 'Second Chance'];

export default function ReplacementSimulator() {
  const [refInput, setRefInput] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2');
  const [frameCount, setFrameCount] = useState(3);
  const [selectedAlgo, setSelectedAlgo] = useState('FIFO');

  const [simulationData, setSimulationData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step
  const [validationError, setValidationError] = useState('');

  const autoPlayTimerRef = useRef(null);

  // Recalculate simulation whenever input, frameCount, or algorithm changes
  useEffect(() => {
    validateAndSimulate(refInput, frameCount, selectedAlgo);
  }, [refInput, frameCount, selectedAlgo]);

  const validateAndSimulate = (rawStr, frames, algo) => {
    setValidationError('');
    const parsed = parseReferenceString(rawStr);

    if (parsed.length === 0) {
      setValidationError('Please enter a valid space or comma separated page reference string (e.g., "7 0 1 2 0 3 0 4").');
      setSimulationData(null);
      return;
    }

    if (frames < 1 || frames > 10 || isNaN(frames)) {
      setValidationError('Frame count must be an integer between 1 and 10.');
      setSimulationData(null);
      return;
    }

    const sim = runSimulation(algo, parsed, frames);
    setSimulationData(sim);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (!simulationData || prev >= simulationData.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, simulationData]);

  const handleNextStep = () => {
    if (!simulationData) return;
    if (currentStepIndex < simulationData.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handlePresetSelect = (preset) => {
    setRefInput(preset.refString);
    setFrameCount(preset.frames);
  };

  const currentStep = simulationData?.steps[currentStepIndex] || null;
  const parsedPages = simulationData ? simulationData.steps.map((s) => s.page) : [];

  // Hit/Fault percentage calculations
  const totalRefs = simulationData ? simulationData.steps.length : 0;
  const hitsSoFar = currentStep ? currentStep.hits : 0;
  const faultsSoFar = currentStep ? currentStep.faults : 0;
  const processedSoFar = currentStepIndex + 1;
  const hitRatio = processedSoFar > 0 ? ((hitsSoFar / processedSoFar) * 100).toFixed(1) : 0;
  const faultRate = processedSoFar > 0 ? ((faultsSoFar / processedSoFar) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      {/* Configuration & Input Controls */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-500" /> Simulator Controls & Configuration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize reference string, frame allocation, and algorithm policy.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-xs font-mono font-semibold text-slate-400 mr-1">Presets:</span>
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetSelect(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-950 transition-colors cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Reference String Input */}
          <div className="md:col-span-6 space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Page Reference String</span>
              <span className="text-[11px] text-slate-400 font-normal">Space or comma separated</span>
            </label>
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="e.g. 7 0 1 2 0 3 0 4 2 3 0 3 2"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Number of Frames Input */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Frames Count
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={frameCount}
              onChange={(e) => setFrameCount(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Algorithm Selector Buttons */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Algorithm Policy
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {ALGORITHMS.map((algo) => (
                <button
                  key={algo}
                  onClick={() => setSelectedAlgo(algo)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedAlgo === algo
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {simulationData && currentStep && (
        <div className="space-y-6">
          {/* Main Visual Laboratory Panel */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-8">
            {/* Top Toolbar & Live Statistics */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              {/* Step Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev Step
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
                      : 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 hover:bg-cyan-700 shadow-sm'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Auto Play
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex >= simulationData.steps.length - 1}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Reset Simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Controller & Step Progress */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Speed:</span>
                  <input
                    type="range"
                    min="300"
                    max="2000"
                    step="100"
                    value={2300 - playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(2300 - parseInt(e.target.value, 10))}
                    className="w-24 accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-bold">
                  Step {currentStepIndex + 1} / {simulationData.steps.length}
                </div>
              </div>
            </div>

            {/* Reference String Visualization Ribbon */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Page Reference String Sequence
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Active Page: <strong className="text-cyan-600 dark:text-cyan-400">#{currentStep.page}</strong>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 min-w-max">
                  {parsedPages.map((pg, idx) => {
                    const isCurrent = idx === currentStepIndex;
                    const isPast = idx < currentStepIndex;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-10 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 ${
                            isCurrent
                              ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 scale-110 shadow-lg ring-4 ring-cyan-500/30'
                              : isPast
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                              : 'bg-white dark:bg-[#0B101D] text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {pg}
                        </div>
                        <span
                          className={`text-[9px] font-mono ${
                            isCurrent
                              ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {isCurrent ? '▲ Active' : `#${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RAM Frames Layout Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Physical Memory Frames Column */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-500" /> Physical Memory Frames ({frameCount} Slots)
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Policy: <strong className="text-slate-700 dark:text-slate-300">{selectedAlgo}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentStep.frames.map((pageVal, fIdx) => {
                    const isOccupied = pageVal !== null;
                    const isReplacedFrame = currentStep.frameIndexReplaced === fIdx;
                    const isHitFrame = currentStep.result === 'HIT' && currentStep.frameIndexReplaced === fIdx;
                    const isSecondChancePointer = selectedAlgo === 'Second Chance' && currentStep.pointer === fIdx;

                    return (
                      <div
                        key={fIdx}
                        className={`p-4 rounded-xl border transition-all duration-300 relative space-y-2 ${
                          isHitFrame
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/20'
                            : isReplacedFrame && currentStep.result === 'FAULT'
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 ring-2 ring-amber-500/20'
                            : isOccupied
                            ? 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-slate-800'
                            : 'bg-white dark:bg-[#0B101D] border-dashed border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-slate-500 dark:text-slate-400">
                            Frame #{fIdx + 1}
                          </span>
                          {isSecondChancePointer && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 animate-pulse">
                              👈 Clock Pointer
                            </span>
                          )}
                        </div>

                        {/* Frame Content */}
                        <div className="flex items-center justify-between py-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-slate-400 block">Loaded Page:</span>
                            <span
                              className={`text-xl font-mono font-bold ${
                                isOccupied
                                  ? 'text-slate-900 dark:text-white'
                                  : 'text-slate-300 dark:text-slate-700 italic'
                              }`}
                            >
                              {isOccupied ? `Page ${pageVal}` : 'EMPTY'}
                            </span>
                          </div>

                          {/* Algorithm specific frame details */}
                          {isOccupied && (
                            <div className="text-right text-[10px] font-mono space-y-0.5">
                              {selectedAlgo === 'FIFO' && currentStep.fifoQueue && (
                                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold block">
                                  FIFO Rank: #{currentStep.fifoQueue.indexOf(pageVal) + 1}
                                </span>
                              )}

                              {selectedAlgo === 'LRU' && currentStep.recencyMap && (
                                <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold block">
                                  Last Used: Step #{currentStep.recencyMap[pageVal] + 1}
                                </span>
                              )}

                              {selectedAlgo === 'Optimal' && currentStep.futureDistances && (
                                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold block">
                                  Next Ref:{' '}
                                  {currentStep.futureDistances[pageVal] === Infinity
                                    ? 'Never'
                                    : `+${currentStep.futureDistances[pageVal]} steps`}
                                </span>
                              )}

                              {selectedAlgo === 'Second Chance' && currentStep.refBits && (
                                <span
                                  className={`px-2 py-0.5 rounded font-bold block ${
                                    currentStep.refBits[fIdx] === 1
                                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  Ref Bit: {currentStep.refBits[fIdx]}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Transition status badge */}
                        {isReplacedFrame && (
                          <div className="pt-1 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono font-bold">
                            {currentStep.result === 'HIT' ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Hit Match
                              </span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                {currentStep.replacedPage !== null ? (
                                  <>Replaced #{currentStep.replacedPage} ➔ #{currentStep.page}</>
                                ) : (
                                  <>Inserted #{currentStep.page}</>
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Action & Reasoning Panel */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-500" /> Action & Step Diagnostics
                </h4>

                <div className="rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  {/* Result Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">Current Reference:</span>
                    {currentStep.result === 'HIT' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PAGE HIT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                        <XCircle className="w-3.5 h-3.5" /> PAGE FAULT
                      </span>
                    )}
                  </div>

                  {/* Replaced victim summary card */}
                  {currentStep.result === 'FAULT' && (
                    <div className="p-3 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                      <div className="text-slate-400">Replacement Action:</div>
                      {currentStep.replacedPage !== null ? (
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="text-rose-500">Victim Page #{currentStep.replacedPage}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-emerald-500">New Page #{currentStep.page}</span>
                        </div>
                      ) : (
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          Loaded Page #{currentStep.page} into empty frame slot.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dynamic Explanation Text */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase">
                      Algorithm Decision Rationale:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-[#0B101D] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      {currentStep.explanation}
                    </p>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 block uppercase">Page Hits</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{hitsSoFar}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 block uppercase">Page Faults</span>
                    <span className="text-base font-bold text-rose-600 dark:text-rose-400">{faultsSoFar}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 block uppercase">Hit Ratio</span>
                    <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">{hitRatio}%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 block uppercase">Fault Rate</span>
                    <span className="text-base font-bold text-amber-600 dark:text-amber-400">{faultRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Trace Matrix Table */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-cyan-500" /> Full Execution Step History Matrix
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                Click any row to jump to step
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-[#070A12] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Step #</th>
                    <th className="px-4 py-3">Ref Page</th>
                    {Array.from({ length: frameCount }).map((_, fIdx) => (
                      <th key={fIdx} className="px-4 py-3">
                        Frame {fIdx + 1}
                      </th>
                    ))}
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Victim Evicted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {simulationData.steps.map((st, sIdx) => {
                    const isActive = sIdx === currentStepIndex;
                    return (
                      <tr
                        key={sIdx}
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentStepIndex(sIdx);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-cyan-50/80 dark:bg-cyan-950/40 text-slate-900 dark:text-white font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <td className="px-4 py-2.5 flex items-center gap-1.5">
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                          #{st.stepNum}
                        </td>
                        <td className="px-4 py-2.5 font-bold">{st.page}</td>
                        {st.frames.map((val, fIdx) => (
                          <td key={fIdx} className="px-4 py-2.5">
                            {val !== null ? (
                              <span
                                className={
                                  st.frameIndexReplaced === fIdx
                                    ? st.result === 'HIT'
                                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                      : 'text-amber-600 dark:text-amber-400 font-bold'
                                    : ''
                                }
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">-</span>
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-2.5">
                          {st.result === 'HIT' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold">
                              HIT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold">
                              FAULT
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          {st.replacedPage !== null ? (
                            <span className="text-rose-500 font-bold">Page {st.replacedPage}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

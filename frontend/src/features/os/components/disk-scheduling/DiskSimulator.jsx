import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Disc,
  ArrowRight,
  Compass,
  Layers,
  Box,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

import {
  parseRequestQueue,
  runDiskSimulation
} from '../../utils/diskSchedulingAlgorithms';
import DiskTrackVisualizer from './DiskTrackVisualizer';

const PRESETS = [
  {
    name: 'Classic Example',
    reqs: '98, 183, 37, 122, 14, 124, 65, 67',
    head: 53,
    min: 0,
    max: 199,
    dir: 'up'
  },
  {
    name: 'Requests Near Head',
    reqs: '50, 55, 48, 60, 45, 58',
    head: 52,
    min: 0,
    max: 199,
    dir: 'up'
  },
  {
    name: 'Across the Disk',
    reqs: '10, 190, 20, 180, 30, 170',
    head: 100,
    min: 0,
    max: 199,
    dir: 'up'
  },
  {
    name: 'Duplicate Requests',
    reqs: '65, 37, 65, 122, 37, 98',
    head: 53,
    min: 0,
    max: 199,
    dir: 'up'
  },
  {
    name: 'Reverse Direction',
    reqs: '98, 183, 37, 122, 14, 124, 65, 67',
    head: 53,
    min: 0,
    max: 199,
    dir: 'down'
  }
];

const ALGORITHMS = ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'];

export default function DiskSimulator() {
  const [reqInput, setReqInput] = useState('98, 183, 37, 122, 14, 124, 65, 67');
  const [headInput, setHeadInput] = useState(53);
  const [diskMin, setDiskMin] = useState(0);
  const [diskMax, setDiskMax] = useState(199);
  const [direction, setDirection] = useState('up');
  const [selectedAlgo, setSelectedAlgo] = useState('SCAN');

  const [simulationData, setSimulationData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [validationError, setValidationError] = useState('');

  const autoPlayTimerRef = useRef(null);

  // Recalculate simulation on configuration change
  useEffect(() => {
    validateAndSimulate(reqInput, headInput, diskMin, diskMax, direction, selectedAlgo);
  }, [reqInput, headInput, diskMin, diskMax, direction, selectedAlgo]);

  const validateAndSimulate = (rawReqs, head, min, max, dir, algo) => {
    setValidationError('');

    if (min < 0 || max <= min || isNaN(min) || isNaN(max)) {
      setValidationError('Invalid track range configuration.');
      setSimulationData(null);
      return;
    }

    if (head < min || head > max || isNaN(head)) {
      setValidationError(`Initial head position must be between ${min} and ${max}.`);
      setSimulationData(null);
      return;
    }

    const { requests, error } = parseRequestQueue(rawReqs, min, max);
    if (error) {
      setValidationError(error);
      setSimulationData(null);
      return;
    }

    if (requests.length === 0) {
      setValidationError('Please enter at least one valid track request.');
      setSimulationData(null);
      return;
    }

    const sim = runDiskSimulation(algo, requests, head, min, max, dir);
    setSimulationData(sim);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Auto Play Timer Loop
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (!simulationData || prev >= simulationData.events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, simulationData]);

  const handleNextStep = () => {
    if (!simulationData) return;
    if (currentStepIndex < simulationData.events.length - 1) {
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
    setReqInput(preset.reqs);
    setHeadInput(preset.head);
    setDiskMin(preset.min);
    setDiskMax(preset.max);
    setDirection(preset.dir);
  };

  const currentEvent = simulationData?.events[currentStepIndex] || null;

  return (
    <div className="space-y-8">
      {/* Controls & Input Panel */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-500" /> Simulator Controls & Configuration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure request queue, initial head position, track range, and scheduling policy.
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Request Queue Input */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Request Queue</span>
              <span className="text-[11px] text-slate-400 font-normal">Comma or space separated</span>
            </label>
            <input
              type="text"
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              placeholder="e.g. 98, 183, 37, 122, 14, 124, 65, 67"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Initial Head Position */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Initial Head
            </label>
            <input
              type="number"
              value={headInput}
              onChange={(e) => setHeadInput(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Track Bounds (Min/Max) */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Track Range
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={diskMin}
                onChange={(e) => setDiskMin(parseInt(e.target.value, 10) || 0)}
                className="w-1/2 px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-xs text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-slate-400 font-mono text-xs">-</span>
              <input
                type="number"
                value={diskMax}
                onChange={(e) => setDiskMax(parseInt(e.target.value, 10) || 199)}
                className="w-1/2 px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-xs text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Initial Direction Switch */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Initial Direction
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setDirection('up')}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                  direction === 'up'
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Upward
              </button>
              <button
                onClick={() => setDirection('down')}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                  direction === 'down'
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" /> Downward
              </button>
            </div>
          </div>
        </div>

        {/* Algorithm Selection Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Disk Scheduling Algorithm Policy
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo}
                onClick={() => setSelectedAlgo(algo)}
                className={`px-3 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedAlgo === algo
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md'
                    : 'bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {simulationData && currentEvent && (
        <div className="space-y-6">
          {/* Main Simulation Laboratory Container */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-6">
            {/* Top Playback Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
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
                  disabled={currentStepIndex >= simulationData.events.length - 1}
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

              {/* Speed Controller & Step Indicator */}
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
                  Step {currentStepIndex + 1} / {simulationData.events.length}
                </div>
              </div>
            </div>

            {/* Embedded Disk Track Visualizer Component */}
            <DiskTrackVisualizer
              diskMin={diskMin}
              diskMax={diskMax}
              initialHead={headInput}
              currentEvent={currentEvent}
              allEvents={simulationData.events}
              currentStepIndex={currentStepIndex}
            />

            {/* Step Action Diagnostics Panel */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
              <div className="md:col-span-7 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-500" /> Active Event Diagnostics & Rationale
                </h4>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Event Type:</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      {currentEvent.eventType}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-400">Head Seek Movement:</div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Track {currentEvent.previousHead}</span>
                      <ArrowRight className="w-4 h-4 text-cyan-500" />
                      <span>Track {currentEvent.currentHead}</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                        (|{currentEvent.currentHead} - {currentEvent.previousHead}| = {currentEvent.movement} tracks)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-[#0B101D] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    {currentEvent.explanation}
                  </p>
                </div>
              </div>

              {/* Cumulative Statistics Panel */}
              <div className="md:col-span-5 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Disc className="w-4 h-4 text-cyan-500" /> Live Simulation Metrics
                </h4>

                <div className="grid grid-cols-2 gap-3 text-center font-mono">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Head Seek</span>
                    <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
                      {currentEvent.cumulativeMovement}
                    </span>
                    <span className="text-[10px] text-slate-500 block">tracks</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Avg Seek / Request</span>
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {currentEvent.servicedRequests.length > 0
                        ? (currentEvent.cumulativeMovement / currentEvent.servicedRequests.length).toFixed(1)
                        : '0'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">tracks/request</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase block">Serviced</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {currentEvent.servicedRequests.length} / {simulationData.servicedSequence.length}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase block">Pending</span>
                    <span className="text-lg font-bold text-amber-500">
                      {currentEvent.pendingRequests.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Step Execution History Matrix Table */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-cyan-500" /> Full Execution Trace Matrix Log
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                Click any row to view step state
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-[#070A12] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Step #</th>
                    <th className="px-4 py-3">Prev Head</th>
                    <th className="px-4 py-3">Event / Track</th>
                    <th className="px-4 py-3">New Position</th>
                    <th className="px-4 py-3">Seek Distance</th>
                    <th className="px-4 py-3">Cumulative Total</th>
                    <th className="px-4 py-3">Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {simulationData.events.map((ev, sIdx) => {
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
                        <td className="px-4 py-2.5 font-bold">#{ev.stepNum}</td>
                        <td className="px-4 py-2.5">{ev.previousHead}</td>
                        <td className="px-4 py-2.5">
                          {ev.requestTrack !== null ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                              Track {ev.requestTrack}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                              {ev.eventType}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-cyan-600 dark:text-cyan-400">
                          {ev.currentHead}
                        </td>
                        <td className="px-4 py-2.5 font-bold">{ev.movement} tracks</td>
                        <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white">
                          {ev.cumulativeMovement} tracks
                        </td>
                        <td className="px-4 py-2.5 text-[11px] truncate max-w-xs">{ev.explanation}</td>
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

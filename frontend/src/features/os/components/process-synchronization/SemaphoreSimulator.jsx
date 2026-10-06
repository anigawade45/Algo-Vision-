import React, { useState, useEffect, useRef } from 'react';
import { Layers, Play, Pause, SkipForward, RotateCcw, Plus, Minus, ShieldCheck, Clock, UserCheck, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const SemaphoreSimulator = () => {
  const [initialS, setInitialS] = useState(2); // Default to Counting Semaphore S = 2
  const [currentS, setCurrentS] = useState(2);
  const [activeProcesses, setActiveProcesses] = useState([]); // Processes inside CS
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const [procStates, setProcStates] = useState({
    P1: 'READY',
    P2: 'READY',
    P3: 'READY',
    P4: 'READY'
  });

  const [logs, setLogs] = useState([]);
  const timerRef = useRef(null);

  // Pre-configured sequence of operations for P1, P2, P3, P4
  const generateSteps = (initVal) => {
    if (initVal === 1) {
      // Binary Semaphore S = 1
      return [
        { proc: 'P1', op: 'wait(S)', desc: 'P1 calls wait(S) -> S becomes 0 -> Permit acquired! P1 enters CS.' },
        { proc: 'P2', op: 'wait(S)', desc: 'P2 calls wait(S) -> S becomes -1 -> No permits left. P2 BLOCKED & Queued.' },
        { proc: 'P3', op: 'wait(S)', desc: 'P3 calls wait(S) -> S becomes -2 -> P3 BLOCKED & Queued.' },
        { proc: 'P1', op: 'signal(S)', desc: 'P1 calls signal(S) -> S becomes -1 -> P1 releases CS. P2 unblocked & enters CS.' },
        { proc: 'P2', op: 'signal(S)', desc: 'P2 calls signal(S) -> S becomes 0 -> P2 releases CS. P3 unblocked & enters CS.' },
        { proc: 'P3', op: 'signal(S)', desc: 'P3 calls signal(S) -> S becomes 1 -> P3 releases CS. All permits returned.' }
      ];
    } else {
      // Counting Semaphore S >= 2
      return [
        { proc: 'P1', op: 'wait(S)', desc: 'P1 calls wait(S) -> S decremented -> Permit granted! P1 enters CS.' },
        { proc: 'P2', op: 'wait(S)', desc: 'P2 calls wait(S) -> S decremented -> Permit granted! P2 enters CS (2 processes in CS).' },
        { proc: 'P3', op: 'wait(S)', desc: 'P3 calls wait(S) -> S = 0 -> All permits allocated! P3 BLOCKED & Queued.' },
        { proc: 'P4', op: 'wait(S)', desc: 'P4 calls wait(S) -> S = -1 -> P4 BLOCKED & Queued behind P3.' },
        { proc: 'P1', op: 'signal(S)', desc: 'P1 calls signal(S) -> S incremented -> P1 exits CS. P3 unblocked & enters CS.' },
        { proc: 'P2', op: 'signal(S)', desc: 'P2 calls signal(S) -> S incremented -> P2 exits CS. P4 unblocked & enters CS.' },
        { proc: 'P3', op: 'signal(S)', desc: 'P3 calls signal(S) -> S incremented -> P3 exits CS.' },
        { proc: 'P4', op: 'signal(S)', desc: 'P4 calls signal(S) -> S = initial -> P4 exits CS. All permits restored.' }
      ];
    }
  };

  const [steps, setSteps] = useState(generateSteps(2));

  const handleInitChange = (val) => {
    const newVal = Math.max(1, Math.min(5, val));
    setInitialS(newVal);
    setCurrentS(newVal);
    setSteps(generateSteps(newVal));
    handleReset(newVal);
  };

  const handleReset = (initVal = initialS) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentS(initVal);
    setActiveProcesses([]);
    setWaitingQueue([]);
    setStepIndex(0);
    setProcStates({ P1: 'READY', P2: 'READY', P3: 'READY', P4: 'READY' });
    setLogs([`Semaphore initialized with S = ${initVal} (${initVal === 1 ? 'Binary Semaphore' : 'Counting Semaphore'}).`]);
  };

  const executeStep = (idx) => {
    if (idx < 0 || idx >= steps.length) return;
    const step = steps[idx];
    const { proc, op, desc } = step;

    if (op === 'wait(S)') {
      setCurrentS(prevS => {
        const nextS = prevS - 1;
        if (prevS > 0) {
          setActiveProcesses(prev => [...prev, proc]);
          setProcStates(prev => ({ ...prev, [proc]: 'CRITICAL SECTION' }));
        } else {
          setWaitingQueue(prev => [...prev, proc]);
          setProcStates(prev => ({ ...prev, [proc]: 'BLOCKED' }));
        }
        return nextS;
      });
    } else if (op === 'signal(S)') {
      setCurrentS(prevS => {
        const nextS = prevS + 1;
        setActiveProcesses(prev => prev.filter(p => p !== proc));
        setProcStates(prev => ({ ...prev, [proc]: 'COMPLETED' }));

        setWaitingQueue(prevQueue => {
          if (prevQueue.length > 0) {
            const [unblockedProc, ...rest] = prevQueue;
            setActiveProcesses(prevActive => [...prevActive, unblockedProc]);
            setProcStates(prevStates => ({ ...prevStates, [unblockedProc]: 'CRITICAL SECTION' }));
            return rest;
          }
          return prevQueue;
        });

        return nextS;
      });
    }

    setLogs(prev => [`[STEP ${idx + 1}] ${proc} executed ${op}: ${desc}`, ...prev]);
  };

  const handleNextStep = () => {
    if (stepIndex < steps.length) {
      executeStep(stepIndex);
      setStepIndex(prev => prev + 1);
    } else {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setStepIndex(prevIdx => {
          if (prevIdx < steps.length) {
            executeStep(prevIdx);
            return prevIdx + 1;
          } else {
            setIsRunning(false);
            return prevIdx;
          }
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, steps, speed]);

  return (
    <div className="space-y-8">
      {/* Header & Configuration Bar */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Semaphore Simulator</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Integer signaling variable with atomic wait(S) / P(S) and signal(S) / V(S) operations</p>
            </div>
          </div>

          {/* Semaphore Config controls */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">Initial S Value:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleInitChange(initialS - 1)}
                className="p-1 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1 font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded">
                S = {initialS}
              </span>
              <button
                onClick={() => handleInitChange(initialS + 1)}
                className="p-1 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/20 font-mono font-semibold">
              {initialS === 1 ? 'Binary Semaphore' : `Counting (${initialS} Permits)`}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={stepIndex >= steps.length}
              className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Auto Run'}</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={isRunning || stepIndex >= steps.length}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <SkipForward className="w-4 h-4" />
              <span>Next Step</span>
            </button>

            <button
              onClick={() => handleReset()}
              className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="font-mono text-xs text-slate-600 dark:text-slate-400">
            Step Progress: <span className="text-blue-600 dark:text-blue-400 font-bold">{stepIndex}</span> / {steps.length}
          </div>
        </div>
      </div>

      {/* Main Visual Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Semaphore Variable & Permits Slots */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Current Semaphore Value</span>
            <div className={`text-4xl font-mono font-extrabold my-2 ${
              currentS > 0 ? 'text-emerald-600 dark:text-emerald-400' : currentS === 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              S = {currentS}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">
              {currentS > 0
                ? `${currentS} permits available`
                : currentS === 0
                ? '0 permits available (CS full)'
                : `${Math.abs(currentS)} process(es) waiting in queue`}
            </p>
          </div>

          {/* Visual Permits Slot Grid */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <span className="text-xs font-mono text-slate-800 dark:text-slate-300 font-bold block mb-3">Available Permit Slots ({initialS} Max)</span>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: initialS }).map((_, idx) => {
                const isOccupied = idx < activeProcesses.length;
                const occupant = isOccupied ? activeProcesses[idx] : null;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isOccupied
                        ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-300 shadow-sm'
                        : 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono block opacity-75">Slot {idx + 1}</span>
                    <span className="font-mono font-bold text-xs mt-0.5 block">
                      {isOccupied ? `Occupied by ${occupant}` : 'PERMIT FREE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Process Queue & Active CS Monitor */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">Process States & CS Occupancy</h3>

          {/* Active inside CS */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-amber-500/30 rounded-xl">
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider block mb-2">
              Processes inside Critical Section ({activeProcesses.length} / {initialS})
            </span>
            <div className="min-h-[50px] border border-dashed border-amber-500/40 bg-amber-500/5 rounded-lg p-2 flex flex-wrap items-center gap-2">
              {activeProcesses.length === 0 ? (
                <span className="text-xs font-mono text-slate-400 dark:text-slate-600 italic">No active processes</span>
              ) : (
                activeProcesses.map(p => (
                  <span key={p} className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 border border-amber-400 text-amber-900 dark:text-amber-300 font-mono text-xs font-bold rounded">
                    Process {p}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Waiting Queue */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-purple-500/30 rounded-xl">
            <span className="text-xs font-mono text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider block mb-2">
              Blocked Waiting Queue ({waitingQueue.length})
            </span>
            <div className="min-h-[50px] border border-dashed border-purple-500/40 bg-purple-500/5 rounded-lg p-2 flex flex-wrap items-center gap-2">
              {waitingQueue.length === 0 ? (
                <span className="text-xs font-mono text-slate-400 dark:text-slate-600 italic">No blocked processes</span>
              ) : (
                waitingQueue.map((p, i) => (
                  <span key={p} className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 border border-purple-400 text-purple-900 dark:text-purple-300 font-mono text-xs font-bold rounded">
                    {i + 1}. Process {p}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Execution Log */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-800 dark:text-slate-300 font-bold mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
            Semaphore Atomic Event Log
          </div>

          <div className="space-y-2 font-mono text-xs max-h-80 overflow-y-auto pr-1 flex-1">
            {logs.map((lg, i) => (
              <div key={i} className={`p-2 rounded-lg border text-[11px] leading-relaxed ${
                lg.includes('wait')
                  ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-900 dark:text-blue-300'
                  : lg.includes('signal')
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
              }`}>
                {lg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

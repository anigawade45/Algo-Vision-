import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Play, Pause, SkipForward, RotateCcw, ShieldCheck, ShieldAlert, ArrowRight, UserCheck, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const MutexSimulator = () => {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per step

  // State derived from step
  const [lockStatus, setLockStatus] = useState('UNLOCKED'); // UNLOCKED, LOCKED
  const [lockOwner, setLockOwner] = useState(null);
  const [csOwner, setCsOwner] = useState([]); // array of process IDs inside CS
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [processStates, setProcessStates] = useState({
    P1: 'READY',
    P2: 'READY',
    P3: 'READY'
  });
  const [logs, setLogs] = useState([]);
  const [sharedCounter, setSharedCounter] = useState(0);

  const autoRunTimerRef = useRef(null);

  // Pre-defined step timelines for Synchronized (Mutex ON) vs Unsynchronized (Mutex OFF)
  const syncSteps = [
    {
      stepNum: 1,
      action: 'P1 calls lock.acquire()',
      lock: 'LOCKED',
      owner: 'P1',
      cs: ['P1'],
      queue: [],
      states: { P1: 'CRITICAL SECTION', P2: 'READY', P3: 'READY' },
      log: 'TIME 01: P1 requested lock -> Lock Granted! P1 entered Critical Section.',
      counterDelta: 0
    },
    {
      stepNum: 2,
      action: 'P2 calls lock.acquire()',
      lock: 'LOCKED',
      owner: 'P1',
      cs: ['P1'],
      queue: ['P2'],
      states: { P1: 'CRITICAL SECTION', P2: 'WAITING', P3: 'READY' },
      log: 'TIME 02: P2 requested lock -> Lock is held by P1. P2 blocked & queued in Waiting Queue.',
      counterDelta: 0
    },
    {
      stepNum: 3,
      action: 'P1 modifies shared resource (Counter + 1)',
      lock: 'LOCKED',
      owner: 'P1',
      cs: ['P1'],
      queue: ['P2'],
      states: { P1: 'CRITICAL SECTION', P2: 'WAITING', P3: 'READY' },
      log: 'TIME 03: P1 safely updated shared resource Counter to 1 inside Critical Section.',
      counterDelta: 1
    },
    {
      stepNum: 4,
      action: 'P3 calls lock.acquire()',
      lock: 'LOCKED',
      owner: 'P1',
      cs: ['P1'],
      queue: ['P2', 'P3'],
      states: { P1: 'CRITICAL SECTION', P2: 'WAITING', P3: 'WAITING' },
      log: 'TIME 04: P3 requested lock -> Lock still held by P1. P3 added to Waiting Queue position 2.',
      counterDelta: 0
    },
    {
      stepNum: 5,
      action: 'P1 calls lock.release()',
      lock: 'UNLOCKED',
      owner: null,
      cs: [],
      queue: ['P2', 'P3'],
      states: { P1: 'COMPLETED', P2: 'WAITING', P3: 'WAITING' },
      log: 'TIME 05: P1 finished CS & released lock. Signal sent to waiting processes.',
      counterDelta: 0
    },
    {
      stepNum: 6,
      action: 'P2 unblocked & acquires lock',
      lock: 'LOCKED',
      owner: 'P2',
      cs: ['P2'],
      queue: ['P3'],
      states: { P1: 'COMPLETED', P2: 'CRITICAL SECTION', P3: 'WAITING' },
      log: 'TIME 06: P2 dequeued from Waiting Queue -> Lock acquired! P2 entered Critical Section.',
      counterDelta: 0
    },
    {
      stepNum: 7,
      action: 'P2 modifies shared resource (Counter + 1)',
      lock: 'LOCKED',
      owner: 'P2',
      cs: ['P2'],
      queue: ['P3'],
      states: { P1: 'COMPLETED', P2: 'CRITICAL SECTION', P3: 'WAITING' },
      log: 'TIME 07: P2 updated shared resource Counter to 2 inside Critical Section.',
      counterDelta: 1
    },
    {
      stepNum: 8,
      action: 'P2 calls lock.release()',
      lock: 'UNLOCKED',
      owner: null,
      cs: [],
      queue: ['P3'],
      states: { P1: 'COMPLETED', P2: 'COMPLETED', P3: 'WAITING' },
      log: 'TIME 08: P2 released lock.',
      counterDelta: 0
    },
    {
      stepNum: 9,
      action: 'P3 unblocked & acquires lock',
      lock: 'LOCKED',
      owner: 'P3',
      cs: ['P3'],
      queue: [],
      states: { P1: 'COMPLETED', P2: 'COMPLETED', P3: 'CRITICAL SECTION' },
      log: 'TIME 09: P3 acquired lock & entered Critical Section.',
      counterDelta: 0
    },
    {
      stepNum: 10,
      action: 'P3 modifies counter & releases lock',
      lock: 'UNLOCKED',
      owner: null,
      cs: [],
      queue: [],
      states: { P1: 'COMPLETED', P2: 'COMPLETED', P3: 'COMPLETED' },
      log: 'TIME 10: P3 updated Counter to 3 & released lock. All processes safely finished!',
      counterDelta: 1
    }
  ];

  const unsyncSteps = [
    {
      stepNum: 1,
      action: 'P1 enters Critical Section without acquiring lock',
      lock: 'UNLOCKED',
      owner: null,
      cs: ['P1'],
      queue: [],
      states: { P1: 'CRITICAL SECTION', P2: 'READY', P3: 'READY' },
      log: 'TIME 01: P1 entered CS directly (No Lock enforced).',
      counterDelta: 0
    },
    {
      stepNum: 2,
      action: 'P2 enters Critical Section simultaneously!',
      lock: 'UNLOCKED',
      owner: null,
      cs: ['P1', 'P2'],
      queue: [],
      states: { P1: 'CRITICAL SECTION', P2: 'CRITICAL SECTION', P3: 'READY' },
      log: 'TIME 02: [VIOLATION] P2 entered CS while P1 is inside! Mutual Exclusion failed!',
      counterDelta: 0
    },
    {
      stepNum: 3,
      action: 'P3 also enters Critical Section!',
      lock: 'UNLOCKED',
      owner: null,
      cs: ['P1', 'P2', 'P3'],
      queue: [],
      states: { P1: 'CRITICAL SECTION', P2: 'CRITICAL SECTION', P3: 'CRITICAL SECTION' },
      log: 'TIME 03: [RACE CONDITION] All 3 processes concurrently reading & modifying shared memory!',
      counterDelta: 1
    },
    {
      stepNum: 4,
      action: 'Overlapping memory write operations complete',
      lock: 'UNLOCKED',
      owner: null,
      cs: [],
      queue: [],
      states: { P1: 'COMPLETED', P2: 'COMPLETED', P3: 'COMPLETED' },
      log: 'TIME 04: Final Counter = 1 (Expected 3). Race condition caused DATA LOSS!',
      counterDelta: 0
    }
  ];

  const steps = syncEnabled ? syncSteps : unsyncSteps;

  const applyStep = (stepIdx) => {
    if (stepIdx < 0 || stepIdx >= steps.length) return;
    const step = steps[stepIdx];
    setLockStatus(step.lock);
    setLockOwner(step.owner);
    setCsOwner(step.cs);
    setWaitingQueue(step.queue);
    setProcessStates(step.states);

    let counterVal = 0;
    for (let i = 0; i <= stepIdx; i++) {
      counterVal += steps[i].counterDelta;
    }
    setSharedCounter(counterVal);

    setLogs(prev => [step.log, ...prev]);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      applyStep(next);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (autoRunTimerRef.current) clearInterval(autoRunTimerRef.current);
    setCurrentStep(0);
    setLockStatus('UNLOCKED');
    setLockOwner(null);
    setCsOwner([]);
    setWaitingQueue([]);
    setProcessStates({ P1: 'READY', P2: 'READY', P3: 'READY' });
    setSharedCounter(0);
    setLogs(['Simulator reset. Ready for step execution.']);
  };

  const handleToggleSync = (enabled) => {
    handleReset();
    setSyncEnabled(enabled);
  };

  useEffect(() => {
    if (isRunning) {
      autoRunTimerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            const next = prev + 1;
            applyStep(next);
            return next;
          } else {
            setIsRunning(false);
            return prev;
          }
        });
      }, speed);
    } else {
      if (autoRunTimerRef.current) clearInterval(autoRunTimerRef.current);
    }

    return () => {
      if (autoRunTimerRef.current) clearInterval(autoRunTimerRef.current);
    };
  }, [isRunning, steps, speed]);

  return (
    <div className="space-y-8">
      {/* Header & Controls Panel */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              lockStatus === 'LOCKED' ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}>
              {lockStatus === 'LOCKED' ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mutex / Lock Simulator</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Mutual Exclusion primitives with explicit lock acquisition and release semantics</p>
            </div>
          </div>

          {/* Sync Mode Toggle Button */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 px-2 font-semibold">Synchronization:</span>
            <button
              onClick={() => handleToggleSync(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !syncEnabled ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              OFF (No Lock)
            </button>
            <button
              onClick={() => handleToggleSync(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                syncEnabled ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              ON (Mutex Lock)
            </button>
          </div>
        </div>

        {/* Playback Controls & Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={currentStep >= steps.length - 1}
              className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Auto Run'}</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={isRunning || currentStep >= steps.length - 1}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <SkipForward className="w-4 h-4" />
              <span>Next Step</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 font-mono text-xs text-slate-600 dark:text-slate-400">
            <div>Step: <span className="text-amber-600 dark:text-amber-400 font-bold">{currentStep + 1}</span> / {steps.length}</div>
            <div>Mode: <span className={syncEnabled ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
              {syncEnabled ? 'MUTEX ACTIVE' : 'UNSYNCHRONIZED'}
            </span></div>
          </div>
        </div>
      </div>

      {/* Main Visual Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lock Hardware State & Queue Display */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
          {/* Prominent Lock Banner */}
          <div className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
            lockStatus === 'LOCKED'
              ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-400 shadow-sm'
              : 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 shadow-sm'
          }`}>
            <div className="p-3 bg-white dark:bg-slate-950/80 rounded-full border border-current mb-2">
              {lockStatus === 'LOCKED' ? <Lock className="w-8 h-8 animate-pulse" /> : <Unlock className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-mono font-extrabold tracking-wider">{lockStatus}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              {lockStatus === 'LOCKED' ? `Held by Process: ${lockOwner || 'Unknown'}` : 'Available for acquisition'}
            </p>
          </div>

          {/* Waiting Queue Visualizer */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-300">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Lock Waiting Queue (FIFO)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-mono">
                {waitingQueue.length} Waiting
              </span>
            </div>

            <div className="space-y-2 min-h-[90px] border border-dashed border-slate-300 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-center">
              {waitingQueue.length === 0 ? (
                <div className="text-xs font-mono text-slate-400 dark:text-slate-600 text-center italic">No blocked processes waiting</div>
              ) : (
                waitingQueue.map((proc, idx) => (
                  <div
                    key={proc}
                    className="flex items-center justify-between px-3 py-2 bg-purple-100 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/30 rounded text-xs font-mono text-purple-800 dark:text-purple-300 animate-fade-in"
                  >
                    <span className="font-bold">Pos {idx + 1}: Process {proc}</span>
                    <span className="text-[10px] bg-purple-200 dark:bg-purple-500/20 text-purple-800 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-300 dark:border-purple-500/40">
                      BLOCKED
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Shared Resource Box */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Shared Resource Counter</div>
            <div className="text-3xl font-mono font-extrabold text-amber-600 dark:text-amber-400 my-1">{sharedCounter}</div>
            <div className="text-[10px] text-slate-500 font-mono">
              Expected at end: 3 | Current: {sharedCounter}
            </div>
          </div>
        </div>

        {/* Process State Cards */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">Process Execution States</h3>

          {['P1', 'P2', 'P3'].map((proc) => {
            const state = processStates[proc];
            const isInsideCS = csOwner.includes(proc);
            const isBlocked = waitingQueue.includes(proc);

            return (
              <div
                key={proc}
                className={`p-4 rounded-xl border transition-all ${
                  isInsideCS
                    ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/50 shadow-sm ring-1 ring-amber-500/30'
                    : isBlocked
                    ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/30'
                    : state === 'COMPLETED'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isInsideCS ? 'bg-amber-500 animate-ping' : isBlocked ? 'bg-purple-500' : 'bg-slate-400'
                    }`}></span>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-200">Process {proc}</span>
                  </div>

                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase border ${
                    isInsideCS
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                      : isBlocked
                      ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40'
                      : state === 'COMPLETED'
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}>
                    {state}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {isInsideCS ? 'Executing lock.acquire() -> Inside CS' : isBlocked ? 'Blocked on lock.acquire()' : `Status: ${state}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Shared Critical Section & Dynamic Execution Log */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          {/* Critical Section Box */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-amber-500/30 rounded-xl p-4 text-center">
            <div className="text-xs font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Critical Section Box</span>
            </div>

            <div className="min-h-[80px] border-2 border-dashed border-amber-500/40 bg-amber-500/5 rounded-lg p-3 flex flex-wrap items-center justify-center gap-2">
              {csOwner.length === 0 ? (
                <span className="text-xs font-mono text-slate-400 dark:text-slate-600 italic">No process inside Critical Section</span>
              ) : (
                csOwner.map((p) => (
                  <div key={p} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 border border-amber-400 text-amber-900 dark:text-amber-300 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm">
                    <UserCheck className="w-4 h-4" />
                    <span>Process {p} Inside CS</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dynamic Execution Log */}
          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex-1 flex flex-col justify-between">
            <div className="text-xs font-mono text-slate-800 dark:text-slate-300 font-bold mb-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span>Dynamic Synchronization Log</span>
              <span className="text-[10px] text-slate-500">Live feed</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto pr-1">
              {logs.map((lg, i) => (
                <div key={i} className={`p-1.5 rounded border text-[11px] leading-relaxed ${
                  lg.includes('VIOLATION') || lg.includes('RACE')
                    ? 'bg-rose-100 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
                    : lg.includes('Granted') || lg.includes('dequeued')
                    ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                }`}>
                  {lg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

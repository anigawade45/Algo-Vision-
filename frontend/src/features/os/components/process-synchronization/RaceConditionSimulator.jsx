import { useState, useEffect } from 'react';
import { Play, Pause, ChevronRight, RotateCcw, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

const STEP_INTERVAL_MS = 1800;

export function RaceConditionSimulator() {
  const [syncMode, setSyncMode] = useState(false); // false = OFF (Unsynchronized), true = ON (Synchronized with Mutex)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timeline steps for Unsynchronized (Race Condition)
  const unsyncSteps = [
    {
      step: 0,
      title: 'Initial State',
      action: 'Shared Counter initialized to 0. Both processes ready.',
      counter: 0,
      p1State: { op: 'IDLE', val: null, status: 'READY' },
      p2State: { op: 'IDLE', val: null, status: 'READY' },
      log: 'Shared Counter = 0.'
    },
    {
      step: 1,
      title: 'P1 Reads Counter',
      action: 'P1 reads shared Counter (0) into local register R1.',
      counter: 0,
      p1State: { op: 'READ', val: 0, status: 'RUNNING' },
      p2State: { op: 'IDLE', val: null, status: 'READY' },
      log: 'P1 READ counter = 0.'
    },
    {
      step: 2,
      title: 'P2 Reads Counter (Interleaved)',
      action: 'Before P1 writes back, P2 reads same Counter (0) into register R2!',
      counter: 0,
      p1State: { op: 'READ', val: 0, status: 'RUNNING' },
      p2State: { op: 'READ', val: 0, status: 'RUNNING' },
      log: 'P2 READ counter = 0 (Interleaved read!).'
    },
    {
      step: 3,
      title: 'P1 Increments Register',
      action: 'P1 modifies local register R1 (0 + 1 = 1).',
      counter: 0,
      p1State: { op: 'MODIFY (+1)', val: 1, status: 'RUNNING' },
      p2State: { op: 'READ', val: 0, status: 'RUNNING' },
      log: 'P1 calculated R1 = 1.'
    },
    {
      step: 4,
      title: 'P2 Increments Register',
      action: 'P2 modifies local register R2 (0 + 1 = 1).',
      counter: 0,
      p1State: { op: 'MODIFY (+1)', val: 1, status: 'RUNNING' },
      p2State: { op: 'MODIFY (+1)', val: 1, status: 'RUNNING' },
      log: 'P2 calculated R2 = 1.'
    },
    {
      step: 5,
      title: 'P1 Writes Counter',
      action: 'P1 writes R1 (1) back to shared Counter memory.',
      counter: 1,
      p1State: { op: 'WRITE', val: 1, status: 'COMPLETED' },
      p2State: { op: 'MODIFY (+1)', val: 1, status: 'RUNNING' },
      log: 'P1 WRITE counter = 1.'
    },
    {
      step: 6,
      title: 'P2 Overwrites Counter (DATA LOSS!)',
      action: 'P2 writes R2 (1) back, overwriting P1 update! Final Counter = 1 (Expected 2).',
      counter: 1,
      p1State: { op: 'WRITE', val: 1, status: 'COMPLETED' },
      p2State: { op: 'WRITE', val: 1, status: 'COMPLETED' },
      log: 'P2 WRITE counter = 1 -> RACE CONDITION DETECTED! Lost update!'
    }
  ];

  // Timeline steps for Synchronized (Mutex ON)
  const syncSteps = [
    {
      step: 0,
      title: 'Initial State (Mutex Active)',
      action: 'Shared Counter initialized to 0. Mutex lock is UNLOCKED.',
      counter: 0,
      p1State: { op: 'IDLE', val: null, status: 'READY' },
      p2State: { op: 'IDLE', val: null, status: 'READY' },
      log: 'Mutex UNLOCKED. Counter = 0.'
    },
    {
      step: 1,
      title: 'P1 Acquires Mutex Lock',
      action: 'P1 calls lock.acquire() -> Lock LOCKED. P1 enters Critical Section.',
      counter: 0,
      p1State: { op: 'ACQUIRE LOCK', val: null, status: 'CRITICAL SECTION' },
      p2State: { op: 'IDLE', val: null, status: 'READY' },
      log: 'P1 acquired Mutex lock.'
    },
    {
      step: 2,
      title: 'P1 Reads, Modifies & Writes Counter',
      action: 'P1 reads 0, increments to 1, and writes 1 back to Counter safely.',
      counter: 1,
      p1State: { op: 'WRITE 1', val: 1, status: 'CRITICAL SECTION' },
      p2State: { op: 'IDLE', val: null, status: 'READY' },
      log: 'P1 updated Counter = 1 inside CS.'
    },
    {
      step: 3,
      title: 'P1 Releases Mutex Lock',
      action: 'P1 calls lock.release() -> Lock UNLOCKED. P1 exits Critical Section.',
      counter: 1,
      p1State: { op: 'RELEASE LOCK', val: 1, status: 'COMPLETED' },
      p2State: { op: 'IDLE', val: null, status: 'READY' },
      log: 'P1 released Mutex lock.'
    },
    {
      step: 4,
      title: 'P2 Acquires Mutex Lock',
      action: 'P2 calls lock.acquire() -> Lock LOCKED. P2 enters Critical Section.',
      counter: 1,
      p1State: { op: 'RELEASE LOCK', val: 1, status: 'COMPLETED' },
      p2State: { op: 'ACQUIRE LOCK', val: null, status: 'CRITICAL SECTION' },
      log: 'P2 acquired Mutex lock.'
    },
    {
      step: 5,
      title: 'P2 Reads Counter (1) & Modifies',
      action: 'P2 reads updated Counter (1) and increments to 2.',
      counter: 1,
      p1State: { op: 'RELEASE LOCK', val: 1, status: 'COMPLETED' },
      p2State: { op: 'MODIFY (+1)', val: 2, status: 'CRITICAL SECTION' },
      log: 'P2 READ counter = 1 and calculated 2.'
    },
    {
      step: 6,
      title: 'P2 Writes Counter & Releases Lock',
      action: 'P2 writes 2 back to Counter and releases lock. Final Counter = 2 (CORRECT!).',
      counter: 2,
      p1State: { op: 'RELEASE LOCK', val: 1, status: 'COMPLETED' },
      p2State: { op: 'WRITE 2', val: 2, status: 'COMPLETED' },
      log: 'P2 WRITE counter = 2 -> MUTUAL EXCLUSION MAINTAINED! Correct result = 2.'
    }
  ];

  const steps = syncMode ? syncSteps : unsyncSteps;
  const currentStep = steps[currentStepIndex] || steps[0];

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleToggleSyncMode = (mode) => {
    setSyncMode(mode);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, STEP_INTERVAL_MS);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="space-y-8">
      {/* Interactive Control Panel Header */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              syncMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
              {syncMode ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Race Condition & Interleaving Simulator</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Observe how unsynchronized process interleaving causes lost updates</p>
            </div>
          </div>

          {/* Sync Mode Toggle Button */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 px-2 font-semibold">Synchronization:</span>
            <button
              onClick={() => handleToggleSyncMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !syncMode ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              OFF (Race Condition)
            </button>
            <button
              onClick={() => handleToggleSyncMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                syncMode ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              ON (Mutex Lock)
            </button>
          </div>
        </div>

        {/* Playback Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStepIndex >= steps.length - 1}
              className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Auto Run' : 'Auto Run Timeline'}</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={isPlaying || currentStepIndex >= steps.length - 1}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 rounded-lg font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
            <div>Step: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentStepIndex + 1}</span> / {steps.length}</div>
            <div>Current Value: <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">{currentStep.counter}</span></div>
          </div>
        </div>
      </div>

      {/* Main Execution Timeline & Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Cards & Shared Memory Box */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shared Resource Counter Display */}
          <div className="bg-white dark:bg-[#0B101D] border border-amber-500/30 rounded-2xl p-6 shadow-sm text-center">
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-1 font-bold">
              Shared Memory Variable
            </span>
            <div className="text-4xl font-mono font-extrabold text-amber-600 dark:text-amber-400 my-2">
              counter = {currentStep.counter}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Expected Value at end of 2 increments: <span className="font-bold text-emerald-600 dark:text-emerald-400">2</span>
            </p>

            {/* Alert Banner when Race Condition occurs at final step */}
            {currentStepIndex === steps.length - 1 && !syncMode && (
              <div className="mt-4 p-3 bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 rounded-xl text-rose-800 dark:text-rose-300 font-mono text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>RACE CONDITION DETECTED! Both processes read counter=0 simultaneously, causing DATA LOSS (Final = 1, Expected = 2).</span>
              </div>
            )}

            {currentStepIndex === steps.length - 1 && syncMode && (
              <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>MUTUAL EXCLUSION SUCCESS! Mutex lock forced sequential execution. Final counter = 2 (Correct!).</span>
              </div>
            )}
          </div>

          {/* Processes Execution Interleaving Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Process P1 Card */}
            <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-200">Process P1</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${
                  currentStep.p1State.status === 'CRITICAL SECTION' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40' :
                  currentStep.p1State.status === 'RUNNING' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/40' :
                  currentStep.p1State.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {currentStep.p1State.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 font-mono text-xs">
                <div className="text-slate-500 dark:text-slate-400">Current Operation:</div>
                <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">{currentStep.p1State.op}</div>
                {currentStep.p1State.val !== null && (
                  <div className="text-slate-600 dark:text-slate-300">Local Register R1 = <span className="text-amber-600 dark:text-amber-400 font-bold">{currentStep.p1State.val}</span></div>
                )}
              </div>
            </div>

            {/* Process P2 Card */}
            <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-200">Process P2</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${
                  currentStep.p2State.status === 'CRITICAL SECTION' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40' :
                  currentStep.p2State.status === 'RUNNING' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40' :
                  currentStep.p2State.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {currentStep.p2State.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 font-mono text-xs">
                <div className="text-slate-500 dark:text-slate-400">Current Operation:</div>
                <div className="font-bold text-purple-600 dark:text-purple-400 text-sm">{currentStep.p2State.op}</div>
                {currentStep.p2State.val !== null && (
                  <div className="text-slate-600 dark:text-slate-300">Local Register R2 = <span className="text-amber-600 dark:text-amber-400 font-bold">{currentStep.p2State.val}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Event Log */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
            Execution Interleaving Log
          </div>

          <div className="space-y-2 font-mono text-xs max-h-80 overflow-y-auto pr-1 flex-1">
            {steps.slice(0, currentStepIndex + 1).map((s, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border text-[11px] leading-relaxed transition-all ${
                  idx === currentStepIndex
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-400 dark:border-indigo-500/50 text-indigo-900 dark:text-indigo-300 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-[10px] opacity-75">Step {idx + 1}: {s.title}</div>
                <div>{s.log}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaceConditionSimulator;

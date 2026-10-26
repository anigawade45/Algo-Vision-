import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Activity, ChevronRight, Info, Plus } from 'lucide-react';

const STEP_INTERVAL_MS = 1500;

export default function ProcessStateDiagram() {
  // Initial processes distributed across states
  const [processes, setProcesses] = useState([
    { id: 1, pid: 101, name: 'Process_A', state: 'RUNNING', cpuTime: 4 },
    { id: 2, pid: 102, name: 'Process_B', state: 'READY', cpuTime: 0 },
    { id: 3, pid: 103, name: 'Process_C', state: 'WAITING', cpuTime: 2 },
    { id: 4, pid: 104, name: 'Process_D', state: 'NEW', cpuTime: 0 },
  ]);

  const [activeTransition, setActiveTransition] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState([
    { text: 'System initialized. Process 101 dispatched to CPU (RUNNING).', time: 'Initial' }
  ]);

  const states = [
    { id: 'NEW', title: '1. NEW', color: 'border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400', desc: 'Process is being created' },
    { id: 'READY', title: '2. READY', color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', desc: 'In RAM waiting for CPU allocation' },
    { id: 'RUNNING', title: '3. RUNNING', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', desc: 'Instructions executing on CPU' },
    { id: 'WAITING', title: '4. WAITING / BLOCKED', color: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400', desc: 'Waiting for I/O event completion' },
    { id: 'TERMINATED', title: '5. TERMINATED', color: 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400', desc: 'Execution finished, resources freed' },
  ];

  // Manual Transition Handlers
  const handleTransition = useCallback((pid, fromState, toState, triggerName) => {
    setActiveTransition({ pid, fromState, toState, triggerName });

    setProcesses(prev =>
      prev.map(p => {
        if (p.pid === pid) {
          return { ...p, state: toState };
        }
        return p;
      })
    );

    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      { text: `PID ${pid} transitioned from [${fromState}] → [${toState}] via trigger: "${triggerName}"`, time: timestamp },
      ...prev.slice(0, 15)
    ]);

    setTimeout(() => {
      setActiveTransition(null);
    }, 1000);
  }, []);

  // Add new process
  const handleCreateProcess = () => {
    const newPid = Math.floor(100 + Math.random() * 900);
    const newProc = {
      id: Date.now(),
      pid: newPid,
      name: `Process_${String.fromCharCode(65 + processes.length % 26)}`,
      state: 'NEW',
      cpuTime: 0
    };
    setProcesses(prev => [...prev, newProc]);
    setLogs(prev => [
      { text: `New process created: PID ${newPid} in [NEW] state`, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  // Step-by-step automatic simulation loop
  const triggerAutoStep = useCallback(() => {
    // Pick candidate for state transition logic
    const runningProc = processes.find(p => p.state === 'RUNNING');
    const readyProc = processes.find(p => p.state === 'READY');
    const waitingProc = processes.find(p => p.state === 'WAITING');
    const newProc = processes.find(p => p.state === 'NEW');

    if (runningProc) {
      // 50% chance I/O wait, 30% interrupt, 20% terminate
      const rand = Math.random();
      if (rand < 0.4) {
        handleTransition(runningProc.pid, 'RUNNING', 'WAITING', 'I/O Request (sys_read)');
      } else if (rand < 0.7) {
        handleTransition(runningProc.pid, 'RUNNING', 'READY', 'Time Quantum Expired (Interrupt)');
      } else {
        handleTransition(runningProc.pid, 'RUNNING', 'TERMINATED', 'Exit / Execution Complete');
      }
    } else if (readyProc) {
      handleTransition(readyProc.pid, 'READY', 'RUNNING', 'Scheduler Dispatch');
    } else if (waitingProc) {
      handleTransition(waitingProc.pid, 'WAITING', 'READY', 'I/O Completion Interrupt');
    } else if (newProc) {
      handleTransition(newProc.pid, 'NEW', 'READY', 'Admitted by Long-Term Scheduler');
    }
  }, [processes, handleTransition]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        triggerAutoStep();
      }, STEP_INTERVAL_MS);
    }
    return () => clearInterval(interval);
  }, [isPlaying, triggerAutoStep]);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Interactive State Machine
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Process State Transition Diagram
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Observe processes transition through New, Ready, Running, Waiting, and Terminated states as OS events occur.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCreateProcess}
            className="px-3 py-1.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Spawn Process</span>
          </button>

          <button
            onClick={triggerAutoStep}
            className="px-3 py-1.5 rounded-xl border border-cyan-300 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold hover:bg-cyan-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Step Next</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isPlaying
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Auto' : 'Auto Play'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setProcesses([
                { id: 1, pid: 101, name: 'Process_A', state: 'RUNNING', cpuTime: 4 },
                { id: 2, pid: 102, name: 'Process_B', state: 'READY', cpuTime: 0 },
                { id: 3, pid: 103, name: 'Process_C', state: 'WAITING', cpuTime: 2 },
                { id: 4, pid: 104, name: 'Process_D', state: 'NEW', cpuTime: 0 },
              ]);
              setLogs([{ text: 'State diagram reset to initial defaults.', time: 'Reset' }]);
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Reset Diagram"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual State Diagram Map */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-6">
        {/* Diagram Flow Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {states.map((st) => {
            const stateProcesses = processes.filter(p => p.state === st.id);
            const isTargetOfTransition = activeTransition?.toState === st.id;

            return (
              <div
                key={st.id}
                className={`rounded-2xl border-2 p-4 transition-all duration-300 min-h-[220px] flex flex-col justify-between ${st.color} ${
                  isTargetOfTransition ? 'ring-4 ring-cyan-400 shadow-xl scale-105' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm">{st.title}</h4>
                    <span className="w-6 h-6 rounded-full bg-slate-900/10 dark:bg-white/10 flex items-center justify-center text-xs font-mono font-bold">
                      {stateProcesses.length}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-1">{st.desc}</p>
                </div>

                {/* Processes currently inside this State Node */}
                <div className="space-y-2 my-3 flex-1 overflow-y-auto max-h-[140px] pr-1">
                  {stateProcesses.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[11px] opacity-50 italic">
                      Empty State
                    </div>
                  ) : (
                    stateProcesses.map((proc) => (
                      <div
                        key={proc.id}
                        className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 p-2.5 shadow-sm text-slate-900 dark:text-white space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span>{proc.name}</span>
                          <span className="text-cyan-600 dark:text-cyan-400">PID: {proc.pid}</span>
                        </div>

                        {/* Interactive Manual Quick Trigger Actions for this process */}
                        <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800/60">
                          {proc.state === 'NEW' && (
                            <button
                              onClick={() => handleTransition(proc.pid, 'NEW', 'READY', 'Admitted')}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold hover:bg-cyan-200 cursor-pointer"
                            >
                              Admit → Ready
                            </button>
                          )}
                          {proc.state === 'READY' && (
                            <button
                              onClick={() => handleTransition(proc.pid, 'READY', 'RUNNING', 'Scheduler Dispatch')}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-200 cursor-pointer"
                            >
                              Dispatch → Running
                            </button>
                          )}
                          {proc.state === 'RUNNING' && (
                            <>
                              <button
                                onClick={() => handleTransition(proc.pid, 'RUNNING', 'WAITING', 'I/O Wait')}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-200 cursor-pointer"
                              >
                                I/O Wait
                              </button>
                              <button
                                onClick={() => handleTransition(proc.pid, 'RUNNING', 'READY', 'Interrupt')}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold hover:bg-cyan-200 cursor-pointer"
                              >
                                Interrupt
                              </button>
                              <button
                                onClick={() => handleTransition(proc.pid, 'RUNNING', 'TERMINATED', 'Exit')}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold hover:bg-rose-200 cursor-pointer"
                              >
                                Exit
                              </button>
                            </>
                          )}
                          {proc.state === 'WAITING' && (
                            <button
                              onClick={() => handleTransition(proc.pid, 'WAITING', 'READY', 'I/O Done')}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold hover:bg-cyan-200 cursor-pointer"
                            >
                              I/O Done → Ready
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition Logic Reference Legend */}
        <div className="rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] p-4 text-xs space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-500" />
            <span>Process State Transition Rules & OS Events:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
            <div>• <strong>Admitted:</strong> Long-term scheduler moves job from disk to Ready queue in RAM.</div>
            <div>• <strong>Scheduler Dispatch:</strong> Short-term scheduler assigns CPU to top process in Ready queue.</div>
            <div>• <strong>Interrupt:</strong> Timer interrupt (time slice quantum expired) forces process back to Ready.</div>
            <div>• <strong>I/O or Event Wait:</strong> Process executes system call (e.g. read file) and blocks in Waiting queue.</div>
            <div>• <strong>I/O Completion:</strong> Device controller signals hardware interrupt, returning process to Ready.</div>
            <div>• <strong>Exit / Terminate:</strong> Process calls exit(), parent retrieves exit code, PCB destroyed.</div>
          </div>
        </div>

        {/* Live Event Log */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            <span>State Transition Event Logs</span>
          </h4>
          <div className="bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl border border-slate-800 max-h-[160px] overflow-y-auto space-y-1.5">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className="text-cyan-400">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

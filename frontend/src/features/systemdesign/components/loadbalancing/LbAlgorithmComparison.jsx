import { useState, useEffect } from 'react';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Server
} from 'lucide-react';

const WORKLOAD_SCENARIO = [
  { id: 1, duration: 4000, type: 'Heavy Analytics Export', color: 'rose' },
  { id: 2, duration: 800, type: 'Quick Cache Query', color: 'emerald' },
  { id: 3, duration: 3500, type: 'Video Transcode Job', color: 'rose' },
  { id: 4, duration: 600, type: 'User Profile GET', color: 'emerald' },
  { id: 5, duration: 3800, type: 'Large CSV Parsing', color: 'rose' },
  { id: 6, duration: 700, type: 'Catalog Search', color: 'emerald' },
  { id: 7, duration: 900, type: 'Cart Checkout', color: 'blue' },
  { id: 8, duration: 500, type: 'Heartbeat Ping', color: 'emerald' },
];

export function LbAlgorithmComparison({ onCompleteStep, isCompleted }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentReqIndex, setCurrentReqIndex] = useState(0);

  // Round Robin Servers State (3 Servers)
  const [rrServers, setRrServers] = useState([
    { id: 'rr-1', name: 'Server A', activeJobs: [], totalHandled: 0 },
    { id: 'rr-2', name: 'Server B', activeJobs: [], totalHandled: 0 },
    { id: 'rr-3', name: 'Server C', activeJobs: [], totalHandled: 0 },
  ]);

  // Least Connections Servers State (3 Servers)
  const [lcServers, setLcServers] = useState([
    { id: 'lc-1', name: 'Server A', activeJobs: [], totalHandled: 0 },
    { id: 'lc-2', name: 'Server B', activeJobs: [], totalHandled: 0 },
    { id: 'lc-3', name: 'Server C', activeJobs: [], totalHandled: 0 },
  ]);

  const handleRunBatchSimulation = () => {
    handleReset();
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentReqIndex(0);
    setRrServers([
      { id: 'rr-1', name: 'Server A', activeJobs: [], totalHandled: 0 },
      { id: 'rr-2', name: 'Server B', activeJobs: [], totalHandled: 0 },
      { id: 'rr-3', name: 'Server C', activeJobs: [], totalHandled: 0 },
    ]);
    setLcServers([
      { id: 'lc-1', name: 'Server A', activeJobs: [], totalHandled: 0 },
      { id: 'lc-2', name: 'Server B', activeJobs: [], totalHandled: 0 },
      { id: 'lc-3', name: 'Server C', activeJobs: [], totalHandled: 0 },
    ]);
  };

  // Dispatch requests step-by-step
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setCurrentReqIndex((prevIdx) => {
        if (prevIdx >= WORKLOAD_SCENARIO.length) {
          setIsRunning(false);
          return prevIdx;
        }

        const currentJob = WORKLOAD_SCENARIO[prevIdx];
        const jobId = `job-${Date.now()}-${prevIdx}`;

        // 1. Dispatch to Round Robin (strict cyclic index)
        const rrTargetIdx = prevIdx % 3;
        setRrServers((prev) =>
          prev.map((s, idx) =>
            idx === rrTargetIdx
              ? {
                  ...s,
                  activeJobs: [...s.activeJobs, { ...currentJob, instanceId: jobId }],
                  totalHandled: s.totalHandled + 1
                }
              : s
          )
        );

        // 2. Dispatch to Least Connections (server with fewest active jobs)
        setLcServers((prev) => {
          const sorted = [...prev].sort((a, b) => a.activeJobs.length - b.activeJobs.length);
          const lcTargetId = sorted[0].id;
          return prev.map((s) =>
            s.id === lcTargetId
              ? {
                  ...s,
                  activeJobs: [...s.activeJobs, { ...currentJob, instanceId: jobId }],
                  totalHandled: s.totalHandled + 1
                }
              : s
          );
        });

        // Schedule job completion for RR
        setTimeout(() => {
          setRrServers((prev) =>
            prev.map((s) => ({
              ...s,
              activeJobs: s.activeJobs.filter((j) => j.instanceId !== jobId)
            }))
          );
        }, currentJob.duration);

        // Schedule job completion for LC
        setTimeout(() => {
          setLcServers((prev) =>
            prev.map((s) => ({
              ...s,
              activeJobs: s.activeJobs.filter((j) => j.instanceId !== jobId)
            }))
          );
        }, currentJob.duration);

        if (prevIdx + 1 >= WORKLOAD_SCENARIO.length) {
          setIsRunning(false);
        }

        return prevIdx + 1;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Round Robin vs. Least Connections Under Heavy Workloads
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Observe how varying request execution times expose the flaws of naive cycling vs. dynamic connection tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isRunning && (
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
                Job {Math.min(currentReqIndex + 1, WORKLOAD_SCENARIO.length)} / {WORKLOAD_SCENARIO.length}
              </span>
            )}

            <button
              onClick={handleRunBatchSimulation}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? 'Simulating Batch...' : 'Run Workload Test'}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When requests have uniform execution times (e.g. 50ms each), <strong>Round Robin</strong> performs well. However, in modern web systems, short read queries (500ms) are mixed with heavy long-running analytics jobs (4000ms). Round Robin blindly piles requests onto busy servers, while <strong>Least Connections</strong> dynamically shifts traffic to idle nodes.
        </p>
      </div>

      {/* 2. Side-by-Side Live Workload Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Round Robin Simulation */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Round Robin (Sequential Index)
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold">
                Cyclic: A ➔ B ➔ C ➔ A
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Blindly assigns requests to the next sequential node without checking if the node is already overwhelmed with active heavy jobs.
            </p>

            {/* Server Nodes Active Jobs */}
            <div className="space-y-3">
              {rrServers.map((srv) => (
                <div
                  key={srv.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    srv.activeJobs.length >= 3
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                      : srv.activeJobs.length > 0
                      ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800'
                      : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-purple-500" />
                      <span>{srv.name}</span>
                    </span>

                    <span className="text-xs font-mono text-slate-500">
                      Active: <strong className={srv.activeJobs.length >= 3 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-900 dark:text-white'}>{srv.activeJobs.length} Conns</strong>
                    </span>
                  </div>

                  {/* Active Job Chips */}
                  <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
                    {srv.activeJobs.length === 0 ? (
                      <span className="text-[10px] font-mono text-slate-400 italic">Idle (0 active connections)</span>
                    ) : (
                      srv.activeJobs.map((job, jIdx) => (
                        <span
                          key={jIdx}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border font-semibold flex items-center gap-1 ${
                            job.color === 'rose'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{job.type} ({job.duration}ms)</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">Round Robin Outcome:</span>
            <p>• Server A accumulated multiple 4000ms heavy jobs simultaneously.</p>
            <p>• Server B sat idle with 0 connections while Server A was queueing.</p>
          </div>
        </div>

        {/* Right: Least Connections Simulation */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Least Connections (Active Load Tracking)
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                Dynamic Min(Active Jobs)
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspects current server connection counts and dynamically routes every new request to whichever node is least loaded.
            </p>

            {/* Server Nodes Active Jobs */}
            <div className="space-y-3">
              {lcServers.map((srv) => (
                <div
                  key={srv.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    srv.activeJobs.length >= 3
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
                      : srv.activeJobs.length > 0
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-500" />
                      <span>{srv.name}</span>
                    </span>

                    <span className="text-xs font-mono text-slate-500">
                      Active: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{srv.activeJobs.length} Conns</strong>
                    </span>
                  </div>

                  {/* Active Job Chips */}
                  <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
                    {srv.activeJobs.length === 0 ? (
                      <span className="text-[10px] font-mono text-slate-400 italic">Idle (0 active connections)</span>
                    ) : (
                      srv.activeJobs.map((job, jIdx) => (
                        <span
                          key={jIdx}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border font-semibold flex items-center gap-1 ${
                            job.color === 'rose'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{job.type} ({job.duration}ms)</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">Least Connections Outcome:</span>
            <p>• Heavy tasks were spread evenly across Server A, Server B, and Server C.</p>
            <p>• Zero server overloading or queue buildup; maximum resource efficiency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LbAlgorithmComparison;

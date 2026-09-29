import React, { useState } from 'react';
import { HardDrive, Cpu, ArrowRight, Layers, RefreshCw, Plus, Play, Pause, CheckCircle2, Sliders, AlertCircle, Wifi, Printer } from 'lucide-react';

export default function ProcessQueuesManager() {
  // State for 4 distinct OS Queues
  const [jobQueue, setJobQueue] = useState([
    { pid: 501, name: 'video_render.exe', memory: '450 MB', priority: 3 },
    { pid: 502, name: 'compilation_job', memory: '120 MB', priority: 5 }
  ]);

  const [readyQueue, setReadyQueue] = useState([
    { pid: 101, name: 'chrome_tab_1', memory: '85 MB', priority: 8 },
    { pid: 102, name: 'vscode_editor', memory: '140 MB', priority: 9 }
  ]);

  const [activeCpuProcess, setActiveCpuProcess] = useState({
    pid: 100, name: 'algo_vision_app', memory: '64 MB', priority: 10
  });

  const [deviceQueues, setDeviceQueues] = useState({
    disk: [{ pid: 201, name: 'db_flush', device: 'NVMe Disk' }],
    network: [{ pid: 202, name: 'fetch_api', device: 'NIC Ethernet' }],
    printer: []
  });

  const [logs, setLogs] = useState([
    { text: 'Queue manager active. Long-term, short-term, and I/O device queues initialized.', time: 'System' }
  ]);

  // Handler 1: Add new Job
  const handleAddJob = () => {
    const newPid = Math.floor(600 + Math.random() * 300);
    const newJob = {
      pid: newPid,
      name: `user_task_${newPid}`,
      memory: `${Math.floor(40 + Math.random() * 200)} MB`,
      priority: Math.floor(1 + Math.random() * 9)
    };
    setJobQueue(prev => [...prev, newJob]);
    setLogs(prev => [
      { text: `New job submitted to Job Queue on Disk: PID ${newPid} (${newJob.name})`, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  // Handler 2: Admit Job -> Ready Queue (Long-Term Scheduler)
  const handleAdmitJob = () => {
    if (jobQueue.length === 0) return;
    const [admitted, ...remaining] = jobQueue;
    setJobQueue(remaining);
    setReadyQueue(prev => [...prev, admitted]);
    setLogs(prev => [
      { text: `Long-Term Scheduler: Admitted PID ${admitted.pid} from Job Queue into Ready Queue in RAM.`, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  // Handler 3: Dispatch Ready -> CPU (Short-Term Scheduler)
  const handleDispatchCpu = () => {
    if (readyQueue.length === 0) return;
    const [nextProc, ...remainingReady] = readyQueue;

    // Move current CPU process back to ready if exists
    if (activeCpuProcess) {
      setReadyQueue([...remainingReady, activeCpuProcess]);
    } else {
      setReadyQueue(remainingReady);
    }

    setActiveCpuProcess(nextProc);
    setLogs(prev => [
      { text: `Short-Term Scheduler: Dispatched PID ${nextProc.pid} (${nextProc.name}) to CPU Core.`, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  // Handler 4: Move CPU process to I/O Device Queue
  const handleIoWait = (targetDevice) => {
    if (!activeCpuProcess) return;

    const procToBlock = { ...activeCpuProcess, device: targetDevice };
    setActiveCpuProcess(null);

    setDeviceQueues(prev => ({
      ...prev,
      [targetDevice]: [...prev[targetDevice], procToBlock]
    }));

    setLogs(prev => [
      { text: `I/O System Call: PID ${procToBlock.pid} blocked waiting on [${targetDevice.toUpperCase()}] Device Queue.`, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  // Handler 5: Complete I/O and return to Ready Queue
  const handleCompleteIo = (targetDevice) => {
    const queue = deviceQueues[targetDevice];
    if (queue.length === 0) return;

    const [unblocked, ...remainingDev] = queue;
    setDeviceQueues(prev => ({
      ...prev,
      [targetDevice]: remainingDev
    }));

    setReadyQueue(prev => [...prev, unblocked]);
    setLogs(prev => [
      { text: `I/O Completion Interrupt: Device [${targetDevice.toUpperCase()}] finished request for PID ${unblocked.pid}. Returned to Ready Queue.`, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner & Global Actions */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              OS Schedulers & Queues
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Process Queues Architecture Manager
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore Job Queue (Secondary Storage), Ready Queue (Main Memory RAM), and Device I/O Blocked Queues.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAddJob}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-cyan-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-500" />
            <span>+ Submit Job to Disk</span>
          </button>

          <button
            onClick={handleAdmitJob}
            disabled={jobQueue.length === 0}
            className="px-3 py-1.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Admit Job → RAM
          </button>

          <button
            onClick={handleDispatchCpu}
            disabled={readyQueue.length === 0}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
          >
            Dispatch → CPU
          </button>
        </div>
      </div>

      {/* Main 4 Queue Panels Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel 1: Job Queue (Disk) - Col 3 */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Job Queue</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
              Disk Storage
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Jobs submitted to OS residing on disk awaiting memory allocation by <strong>Long-Term Scheduler</strong>.
          </p>

          <div className="space-y-2 min-h-[140px]">
            {jobQueue.length === 0 ? (
              <div className="h-28 flex items-center justify-center text-xs text-slate-400 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No jobs in Disk Queue
              </div>
            ) : (
              jobQueue.map(proc => (
                <div key={proc.pid} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{proc.name}</span>
                    <span className="text-purple-600 dark:text-purple-400">PID: {proc.pid}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Memory: {proc.memory}</span>
                    <span>Priority: {proc.priority}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 2: Ready Queue (RAM) - Col 4 */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-cyan-200 dark:border-cyan-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ready Queue</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
              Main Memory (RAM)
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Processes in RAM ready for CPU time. Selected by <strong>Short-Term Scheduler (CPU Scheduler)</strong>.
          </p>

          <div className="space-y-2 min-h-[140px]">
            {readyQueue.length === 0 ? (
              <div className="h-28 flex items-center justify-center text-xs text-slate-400 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                Ready Queue Empty
              </div>
            ) : (
              readyQueue.map((proc, index) => (
                <div key={proc.pid} className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>{index + 1}. {proc.name}</span>
                    <span className="text-cyan-600 dark:text-cyan-400">PID: {proc.pid}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>RAM: {proc.memory}</span>
                    <span>Priority: {proc.priority}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 3: CPU Execution Unit - Col 5 */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Active CPU Execution</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              Executing
            </span>
          </div>

          {activeCpuProcess ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-mono font-bold text-base text-slate-900 dark:text-white">
                    {activeCpuProcess.name}
                  </h5>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    PID: {activeCpuProcess.pid} | Priority: {activeCpuProcess.priority}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-mono font-bold animate-pulse">
                  RUNNING ON CORE 0
                </span>
              </div>

              {/* Action Buttons to trigger I/O Wait */}
              <div className="pt-2 border-t border-emerald-500/20 space-y-1.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">
                  Simulate I/O System Call (Block Process):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleIoWait('disk')}
                    className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold hover:bg-amber-500/30 cursor-pointer"
                  >
                    Block for Disk I/O
                  </button>
                  <button
                    onClick={() => handleIoWait('network')}
                    className="px-2.5 py-1 rounded bg-blue-500/20 border border-blue-500/40 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold hover:bg-blue-500/30 cursor-pointer"
                  >
                    Block for Network
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              CPU Idle - Dispatch a Process
            </div>
          )}

          {/* Panel 4: Device I/O Blocked Queues */}
          <div className="pt-2 space-y-3">
            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              <span>Device / Blocked I/O Queues</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Disk Queue */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                    <HardDrive className="w-3 h-3 text-amber-500" />
                    Disk Queue ({deviceQueues.disk.length})
                  </span>
                  {deviceQueues.disk.length > 0 && (
                    <button
                      onClick={() => handleCompleteIo('disk')}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500 text-white font-bold hover:bg-amber-600 cursor-pointer"
                    >
                      Done → Ready
                    </button>
                  )}
                </div>
                {deviceQueues.disk.map(p => (
                  <div key={p.pid} className="text-[10px] font-mono text-slate-600 dark:text-slate-400 flex justify-between">
                    <span>PID {p.pid}: {p.name}</span>
                  </div>
                ))}
              </div>

              {/* Network Queue */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                    <Wifi className="w-3 h-3 text-blue-500" />
                    Network Queue ({deviceQueues.network.length})
                  </span>
                  {deviceQueues.network.length > 0 && (
                    <button
                      onClick={() => handleCompleteIo('network')}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 cursor-pointer"
                    >
                      Done → Ready
                    </button>
                  )}
                </div>
                {deviceQueues.network.map(p => (
                  <div key={p.pid} className="text-[10px] font-mono text-slate-600 dark:text-slate-400 flex justify-between">
                    <span>PID {p.pid}: {p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live System Log */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Scheduler & Queue Movement Event Log
        </h4>
        <div className="bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl border border-slate-800 max-h-[140px] overflow-y-auto space-y-1">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-cyan-400">[{l.time}]</span>
              <span>{l.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Play,
  Skull,
  CheckCircle2,
  RefreshCw,
  Send,
  Sliders,
  ShieldAlert,
  ArrowRight,
  Clock,
  Layers,
  Zap,
  Sparkles
} from 'lucide-react';

export function DlqRetryLab({ onCompleteStep, isCompleted }) {
  const [maxRetries, setMaxRetries] = useState(3);
  const [backoffType, setBackoffType] = useState('exponential'); // 'immediate', 'linear', 'exponential'
  const [mainQueue, setMainQueue] = useState([
    { id: 'job_201', name: 'Charge Card ($89)', isPoison: false, attempt: 0, status: 'queued', error: null },
    { id: 'job_202', name: 'Corrupt Invoice Payload ☠️', isPoison: true, attempt: 0, status: 'queued', error: null },
    { id: 'job_203', name: 'Send Welcome SMS', isPoison: false, attempt: 0, status: 'queued', error: null },
  ]);

  const [activeProcessingJob, setActiveProcessingJob] = useState(null);
  const [retryBuffer, setRetryBuffer] = useState([]);
  const [deadLetterQueue, setDeadLetterQueue] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [isWorkerRunning, setIsWorkerRunning] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, time: '10:00:00', type: 'system', text: 'Retry & Dead-Letter Queue (DLQ) supervisor initialized.' },
  ]);

  const jobCounterRef = useRef(204);

  const addLog = (type, text) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ id: Date.now() + Math.random(), time, type, text }, ...prev.slice(0, 15)]);
  };

  const getBackoffDelaySec = (attempt) => {
    if (backoffType === 'immediate') return 1;
    if (backoffType === 'linear') return attempt * 2;
    return Math.pow(2, attempt); // 2, 4, 8s
  };

  // Process 1 job cycle
  const processNextJob = () => {
    if (mainQueue.length === 0) {
      if (retryBuffer.length > 0) {
        addLog('retry', `[BUFFER] Waiting for retry backoff timers to expire.`);
      }
      return;
    }

    const currentJob = mainQueue[0];
    setMainQueue((prev) => prev.slice(1));
    setActiveProcessingJob({ ...currentJob, status: 'processing' });
    setIsWorkerRunning(true);

    addLog('dispatch', `[WORKER] Worker claimed ${currentJob.name} (Attempt ${currentJob.attempt + 1}/${maxRetries}).`);

    setTimeout(() => {
      if (currentJob.isPoison) {
        // Job FAILS!
        const nextAttempt = currentJob.attempt + 1;
        const failedJob = {
          ...currentJob,
          attempt: nextAttempt,
          error: 'Uncaught Error: JsonParseException: Invalid token on line 4',
        };

        if (nextAttempt >= maxRetries) {
          // EXCEEDED MAX RETRIES ➔ SEND TO DLQ!
          setActiveProcessingJob(null);
          setIsWorkerRunning(false);
          setDeadLetterQueue((prev) => [...prev, { ...failedJob, status: 'dead_letter', movedAt: new Date().toLocaleTimeString() }]);
          addLog(
            'dlq',
            `☠️ [DLQ MOVED] ${failedJob.name} exhausted all ${maxRetries} retries! Moved to Dead-Letter Queue.`
          );
        } else {
          // SCHEDULE RETRY WITH BACKOFF
          const delaySec = getBackoffDelaySec(nextAttempt);
          setActiveProcessingJob(null);
          setIsWorkerRunning(false);

          setRetryBuffer((prev) => [
            ...prev,
            { ...failedJob, status: 'retry_backoff', delayRemaining: delaySec },
          ]);

          addLog(
            'retry',
            `⚠️ [FAILED] ${failedJob.name} failed! Scheduling attempt ${nextAttempt + 1} in ${delaySec}s (${backoffType} backoff).`
          );

          // Simulate backoff timer returning job to main queue
          setTimeout(() => {
            setRetryBuffer((prev) => prev.filter((j) => j.id !== failedJob.id));
            setMainQueue((prev) => [...prev, { ...failedJob, status: 'queued' }]);
            addLog('retry', `⏱️ [RE-ENQUEUED] Backoff expired for ${failedJob.name}. Returned to main queue.`);
          }, delaySec * 1000);
        }
      } else {
        // Job SUCCEEDS
        setActiveProcessingJob(null);
        setIsWorkerRunning(false);
        setCompletedJobs((prev) => [...prev, { ...currentJob, status: 'completed' }]);
        addLog('success', `✓ [SUCCESS] ${currentJob.name} processed successfully and ACKed.`);
      }
    }, 1100);
  };

  // Add a Poison Pill Job
  const handleAddPoisonJob = () => {
    const newId = `job_${jobCounterRef.current++}`;
    const poisonJob = {
      id: newId,
      name: `Malformed Payload #${newId.slice(-3)} ☠️`,
      isPoison: true,
      attempt: 0,
      status: 'queued',
      error: null,
    };
    setMainQueue((prev) => [...prev, poisonJob]);
    addLog('warn', `🚨 [POISON INGESTED] Ingested ${poisonJob.name}. This job will systematically fail.`);
  };

  // Add a Valid Healthy Job
  const handleAddHealthyJob = () => {
    const newId = `job_${jobCounterRef.current++}`;
    const healthyJob = {
      id: newId,
      name: `Valid Payment #${newId.slice(-3)}`,
      isPoison: false,
      attempt: 0,
      status: 'queued',
      error: null,
    };
    setMainQueue((prev) => [...prev, healthyJob]);
    addLog('enqueue', `[INGESTED] Ingested healthy task: ${healthyJob.name}.`);
  };

  // Redrive DLQ
  const handleRedriveDlq = () => {
    if (deadLetterQueue.length === 0) return;
    const redriven = deadLetterQueue.map((j) => ({ ...j, isPoison: false, attempt: 0, status: 'queued', error: null }));
    setMainQueue((prev) => [...prev, ...redriven]);
    setDeadLetterQueue([]);
    addLog('system', `🔄 [REDRIVE DLQ] Patched bug & re-queued ${redriven.length} messages from DLQ to main queue.`);
  };

  const handleReset = () => {
    setMainQueue([
      { id: 'job_201', name: 'Charge Card ($89)', isPoison: false, attempt: 0, status: 'queued', error: null },
      { id: 'job_202', name: 'Corrupt Invoice Payload ☠️', isPoison: true, attempt: 0, status: 'queued', error: null },
      { id: 'job_203', name: 'Send Welcome SMS', isPoison: false, attempt: 0, status: 'queued', error: null },
    ]);
    setActiveProcessingJob(null);
    setRetryBuffer([]);
    setDeadLetterQueue([]);
    setCompletedJobs([]);
    setIsWorkerRunning(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Interactive Lab • Step 3 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Exponential Backoff Retries &amp; Dead-Letter Queue (DLQ)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Prevent &quot;Poison Pill&quot; messages from blocking entire consumer thread pools in infinite crash loops. Configure retry budgets, exponential delay curves, and route irrecoverable events to a Dead-Letter Queue for investigation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={processNextJob}
              disabled={isWorkerRunning || (mainQueue.length === 0 && retryBuffer.length === 0)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              {isWorkerRunning ? 'Processing Job...' : 'Step / Process Next Job'}
            </button>

            <button
              onClick={handleReset}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* 2. Configuration & Ingestion Controls */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Retry Threshold */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Max Retry Attempts:</span>
              <span className="font-mono text-purple-600 dark:text-purple-400 font-black">{maxRetries} Attempts</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={maxRetries}
              onChange={(e) => setMaxRetries(parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Backoff Strategy */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Backoff Strategy:</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              {[
                { id: 'immediate', label: 'Immediate (1s)' },
                { id: 'linear', label: 'Linear (2s, 4s)' },
                { id: 'exponential', label: 'Exponential (2ⁿs)' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBackoffType(b.id)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    backoffType === b.id
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[11px] truncate">{b.label.split(' ')[0]}</div>
                  <div className="text-[9px] opacity-70 truncate font-mono">{b.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add Sample Messages */}
          <div className="md:col-span-3 flex items-center gap-2 pt-4 md:pt-0">
            <button
              onClick={handleAddHealthyJob}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
            >
              + Healthy Task
            </button>
            <button
              onClick={handleAddPoisonJob}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
            >
              + Poison Pill ☠️
            </button>
          </div>
        </div>
      </div>

      {/* 3. Pipeline Stages: Main Queue ➔ In-Flight ➔ Backoff Buffer ➔ DLQ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stage 1: Main Queue */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                1. Main Queue
              </span>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                {mainQueue.length}
              </span>
            </div>

            <div className="space-y-2 mt-3 max-h-60 overflow-y-auto pr-1 text-xs font-mono custom-scrollbar">
              {mainQueue.map((job) => (
                <div
                  key={job.id}
                  className={`p-2.5 rounded-xl border ${
                    job.isPoison
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                      : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="font-semibold truncate">{job.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between mt-1">
                    <span>{job.id}</span>
                    <span>Retries: {job.attempt}/{maxRetries}</span>
                  </div>
                </div>
              ))}
              {mainQueue.length === 0 && (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#0B101D] text-center text-[11px] text-slate-400">
                  Empty
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage 2: In-Flight Worker */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border-2 border-purple-400/60 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                2. In-Flight Worker
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {activeProcessingJob ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>

            <div className="mt-3 text-xs">
              {activeProcessingJob ? (
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 space-y-2 animate-pulse font-mono">
                  <div className="font-bold text-purple-950 dark:text-purple-100">{activeProcessingJob.name}</div>
                  <div className="text-[11px] text-purple-700 dark:text-purple-300">
                    Executing attempt {activeProcessingJob.attempt + 1} of {maxRetries}...
                  </div>
                  <div className="text-[10px] text-slate-400">Lock: 30s visibility timeout</div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#0B101D] text-center text-[11px] text-slate-400">
                  Worker idle
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage 3: Retry Backoff Buffer */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                3. Backoff Buffer
              </span>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {retryBuffer.length}
              </span>
            </div>

            <div className="space-y-2 mt-3 max-h-60 overflow-y-auto pr-1 text-xs font-mono custom-scrollbar">
              {retryBuffer.map((job) => (
                <div key={job.id} className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 space-y-1">
                  <div className="font-semibold truncate">{job.name}</div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>Backoff: {job.delayRemaining}s remaining</span>
                  </div>
                </div>
              ))}
              {retryBuffer.length === 0 && (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#0B101D] text-center text-[11px] text-slate-400">
                  No pending retries
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage 4: Dead-Letter Queue (DLQ) */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border-2 border-rose-300 dark:border-rose-900/60 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <Skull className="w-4 h-4" />
                4. Dead-Letter Queue
              </span>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                {deadLetterQueue.length}
              </span>
            </div>

            <div className="space-y-2 mt-3 max-h-60 overflow-y-auto pr-1 text-xs font-mono custom-scrollbar">
              {deadLetterQueue.map((job) => (
                <div key={job.id} className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200 space-y-1">
                  <div className="font-bold truncate">{job.name}</div>
                  <div className="text-[10px] text-rose-700 dark:text-rose-400">Exhausted {job.attempt} attempts</div>
                </div>
              ))}
              {deadLetterQueue.length === 0 && (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#0B101D] text-center text-[11px] text-slate-400">
                  Zero dead letters
                </div>
              )}
            </div>
          </div>

          {deadLetterQueue.length > 0 && (
            <button
              onClick={handleRedriveDlq}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Redrive DLQ Messages
            </button>
          )}
        </div>
      </div>

      {/* 4. Live Event Stream */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Retry &amp; DLQ Supervisor Activity Log
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Real-time Stream</span>
        </div>

        <div className="max-h-44 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1 custom-scrollbar">
          {logs.map((log) => {
            let logColor = 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#0B101D]';
            if (log.type === 'dlq') logColor = 'text-rose-700 dark:text-rose-300 bg-rose-50/50 dark:bg-rose-950/20';
            else if (log.type === 'retry') logColor = 'text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20';
            else if (log.type === 'success') logColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20';
            else if (log.type === 'dispatch') logColor = 'text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20';

            return (
              <div key={log.id} className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-start gap-2 ${logColor}`}>
                <span className="text-[10px] opacity-70 shrink-0 font-mono">{log.time}</span>
                <span className="break-all">{log.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DlqRetryLab;

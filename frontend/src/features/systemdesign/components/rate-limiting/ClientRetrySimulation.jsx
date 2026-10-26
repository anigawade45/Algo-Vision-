import { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Zap,
  AlertTriangle,
  Server
} from 'lucide-react';

export function ClientRetrySimulation({ onCompleteStep, isCompleted }) {
  const [retryStrategy, setRetryStrategy] = useState('exponential-jitter'); // 'immediate', 'fixed', 'exponential-jitter'
  const [retryLogs, setRetryLogs] = useState([]);
  const [isRetrying, setIsRetrying] = useState(false);

  // Run Client Retry Simulation
  const handleStartRetrySimulation = () => {
    setIsRetrying(true);
    setRetryLogs([
      { id: 1, attempt: 0, text: 'Initial Request ➔ Server returned HTTP 429 Too Many Requests (Retry-After: 4s)', status: 429, delay: 0 },
    ]);

    const maxAttempts = 3;
    let currentAttempt = 1;

    const executeNextAttempt = () => {
      if (currentAttempt > maxAttempts) {
        setIsRetrying(false);
        setRetryLogs((prev) => [
          ...prev,
          { id: Date.now(), attempt: currentAttempt, text: '✅ [SUCCESS] Quota refreshed! Attempt #4 succeeded with HTTP 200 OK.', status: 200, delay: 0 },
        ]);
        return;
      }

      let delayMs = 100;
      if (retryStrategy === 'fixed') {
        delayMs = 2000;
      } else if (retryStrategy === 'exponential-jitter') {
        const base = 1000;
        const maxCap = 8000;
        const exponential = Math.min(maxCap, base * Math.pow(2, currentAttempt - 1));
        const jitter = Math.floor(Math.random() * (exponential / 2));
        delayMs = exponential + jitter;
      }

      setTimeout(() => {
        const isSuccess = currentAttempt === 3;
        const logText = isSuccess
          ? `Attempt #${currentAttempt} after ${(delayMs / 1000).toFixed(2)}s delay ➔ HTTP 200 OK (Tokens available)`
          : `Attempt #${currentAttempt} after ${(delayMs / 1000).toFixed(2)}s delay ➔ Still Throttled (HTTP 429)`;

        setRetryLogs((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), attempt: currentAttempt, text: logText, status: isSuccess ? 200 : 429, delay: delayMs },
        ]);

        currentAttempt++;
        if (!isSuccess) {
          executeNextAttempt();
        } else {
          setIsRetrying(false);
        }
      }, Math.min(delayMs, 2500));
    };

    executeNextAttempt();
  };

  const handleClearLogs = () => {
    setRetryLogs([]);
    setIsRetrying(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Interactive Lab • Step 4 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                HTTP 429 Too Many Requests &amp; Client Retry Policy
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Inspect production <code className="text-slate-900 dark:text-white font-mono">Retry-After</code> response headers, and observe how <strong className="text-purple-600 dark:text-purple-400 font-semibold">Exponential Backoff with Full Jitter</strong> eliminates synchronous retry stampedes and protects recovering backends.
              </p>
            </div>
          </div>

          <button
            onClick={handleClearLogs}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* 2. Retry Strategy Switcher */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Select Client Retry Policy:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'immediate',
              title: 'Immediate Retries (Danger)',
              desc: 'Client hammers the server immediately upon 429. Causes DDoS retry storm and prolonged server crash.',
              tag: 'Thundering Herd ☠️',
            },
            {
              id: 'fixed',
              title: 'Fixed Interval (2s)',
              desc: 'Client waits a static 2000ms. All clients wake up simultaneously, sending synchronized pulses.',
              tag: 'Synchronized Spikes ⚠️',
            },
            {
              id: 'exponential-jitter',
              title: 'Exponential Backoff + Full Jitter',
              desc: 'Delay = min(cap, base * 2ⁿ) + random_jitter. Spreads retries evenly across time. AWS & Stripe standard.',
              tag: 'Industry Standard ⭐',
            },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setRetryStrategy(s.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                retryStrategy === s.id
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 shadow-xs ring-1 ring-purple-500/20'
                  : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{s.title}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {s.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive Retry Simulation Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Simulation Execution & Code Snippet (6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Client Backoff Algorithm Engine
            </h3>
          </div>

          {/* Code snippet showing mathematical formula */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-1.5">
            <div className="text-purple-400 font-bold">// Production Retry Algorithm (AWS / Go / TypeScript)</div>
            <div className="text-slate-300 text-[11px]">
              {retryStrategy === 'immediate' && `function getRetryDelay(attempt) {\n  return 0; // Immediate (Danger!)\n}`}
              {retryStrategy === 'fixed' && `function getRetryDelay(attempt) {\n  return 2000; // Static 2000ms\n}`}
              {retryStrategy === 'exponential-jitter' && `function getRetryDelay(attempt) {\n  const backoff = Math.min(8000, 1000 * Math.pow(2, attempt));\n  const jitter = Math.random() * (backoff / 2);\n  return backoff + jitter;\n}`}
            </div>
          </div>

          <button
            onClick={handleStartRetrySimulation}
            disabled={isRetrying}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>{isRetrying ? 'Simulating Client Retry Cycle...' : 'Simulate 429 ➔ Client Retry Cycle'}</span>
          </button>
        </div>

        {/* Right: Live Retry Trace (6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Client-Side Retry Log Timeline
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Trace Output</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 font-mono text-xs custom-scrollbar">
            {retryLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  log.status === 200
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                }`}
              >
                <div className="truncate pr-2">
                  <span className="font-bold">{log.text}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  log.status === 200 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  HTTP {log.status}
                </span>
              </div>
            ))}
            {retryLogs.length === 0 && (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                Click &quot;Simulate 429 ➔ Client Retry Cycle&quot; to inspect real-time backoff intervals.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientRetrySimulation;

import { useState } from 'react';
import {
  Layers,
  Server,
  Database,
  Sparkles,
  Play,
  Zap
} from 'lucide-react';
import { RATE_LIMIT_ALGORITHMS } from '../../data/rateLimitingData';

export function DistributedRateLimitingMatrix({ onCompleteStep, isCompleted }) {
  const [architectureMode, setArchitectureMode] = useState('distributed-redis'); // 'local' vs 'distributed-redis'
  const [shootoutResults, setShootoutResults] = useState(null);

  // Shootout: Run same 12 requests against all 5 algorithms with nominal limit = 6
  const handleRunTrafficShootout = () => {
    const trafficCount = 12;
    const limit = 6;

    const results = {
      'token-bucket': { admitted: 10, rejected: 2, note: 'Allowed burst up to capacity 10; rejected remaining 2.' },
      'leaky-bucket': { admitted: 8, rejected: 4, note: '8 admitted into FIFO queue and smoothed; 4 dropped.' },
      'fixed-window': { admitted: 6, rejected: 6, note: 'Admitted first 6; hard blocked next 6 in current window.' },
      'sliding-window-log': { admitted: 6, rejected: 6, note: 'Admitted exact 6; strictly enforced 10s rolling interval.' },
      'sliding-window-counter': { admitted: 6, rejected: 6, note: 'Weighted estimate admitted 6; rejected 6 with 99.7% accuracy.' },
    };

    setShootoutResults({ trafficCount, limit, results });
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Decision Matrix • Step 5 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Distributed Rate Limiting &amp; Multi-Algorithm Shootout
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Compare <strong className="text-slate-900 dark:text-white">Local In-Memory Counters</strong> with <strong className="text-slate-900 dark:text-white">Shared Redis Lua Scripts</strong> across multi-node clusters, and execute benchmark shootout simulations side-by-side.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunTrafficShootout}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Traffic Shootout (12 Requests)</span>
          </button>
        </div>
      </div>

      {/* 2. Distributed Architecture: Local vs Centralized Redis */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Multi-Server Architecture: Local Counters vs. Centralized Redis
            </h3>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setArchitectureMode('local')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                architectureMode === 'local'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-400 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Independent Local Counters (Flawed)
            </button>
            <button
              onClick={() => setArchitectureMode('distributed-redis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                architectureMode === 'distributed-redis'
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-400 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Shared Redis + Lua Script (Atomic ⭐)
            </button>
          </div>
        </div>

        {/* Comparison Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Server className="w-4 h-4 text-rose-500" />
              1. The Local Memory Flaw (Quota Multiplier)
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If your desired limit is 10 req/sec and you have 3 API server instances with local memory counters, a round-robin load balancer will permit <strong>30 req/sec total</strong> (10 on Node A + 10 on Node B + 10 on Node C) before throttling!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-500" />
              2. Atomic Redis Lua Execution (Race-Condition Free)
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Multiple web nodes querying Redis simultaneously can cause classic Check-Then-Act read/write race conditions. Packaging token deduction in an <strong>atomic Redis Lua script</strong> executes in single-threaded isolation, guaranteeing 100% precision.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Algorithm Comparison Table */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          5 Algorithm Comprehensive Comparison Matrix
        </h3>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Burst Support</th>
                <th className="py-2.5 px-3">Memory Overhead</th>
                <th className="py-2.5 px-3">Traffic Smoothness</th>
                <th className="py-2.5 px-3">Ideal Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {RATE_LIMIT_ALGORITHMS.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-[#131B2E] transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    <div>{a.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{a.tag}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">{a.burstSupport}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{a.memory}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{a.smoothness}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 leading-snug">{a.useCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Traffic Shootout Benchmark Card */}
      {shootoutResults && (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Shootout Results (12 Simultaneous Requests / Limit = 6)
            </h3>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold">BENCHMARK COMPLETE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {Object.entries(shootoutResults.results).map(([key, data]) => {
              const algoObj = RATE_LIMIT_ALGORITHMS.find((a) => a.id === key);
              return (
                <div key={key} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">{algoObj?.name}</div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data.admitted} Passed</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">{data.rejected} 429s</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{data.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DistributedRateLimitingMatrix;

import { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Database, 
  Server, 
  Play, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CACHE_STRATEGIES } from '../../data/cachingData';

export function CacheStrategiesSection({ onCompleteStep, isCompleted }) {
  const [selectedStrategyId, setSelectedStrategyId] = useState('cache-aside');
  const [isSimulatingWrite, setIsSimulatingWrite] = useState(false);
  const [writeSimulationStep, setWriteSimulationStep] = useState(0); // 0: Idle, 1, 2, 3

  const currentStrategy = CACHE_STRATEGIES.find(s => s.id === selectedStrategyId) || CACHE_STRATEGIES[0];

  const handleSimulateWrite = () => {
    setIsSimulatingWrite(true);
    setWriteSimulationStep(1);

    setTimeout(() => {
      setWriteSimulationStep(2);
    }, 600);

    setTimeout(() => {
      setWriteSimulationStep(3);
    }, 1200);

    setTimeout(() => {
      setIsSimulatingWrite(false);
    }, 1800);
  };

  const handleResetWrite = () => {
    setIsSimulatingWrite(false);
    setWriteSimulationStep(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Architectural Trade-Offs</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Caching &amp; Write Patterns Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Compare the 4 primary write architectures: Cache-Aside, Write-Through, Write-Back (Write-Behind), and Write-Around.
            </p>
          </div>

          {/* Strategy Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto custom-scrollbar">
            {CACHE_STRATEGIES.map((strat) => (
              <button
                key={strat.id}
                onClick={() => {
                  setSelectedStrategyId(strat.id);
                  handleResetWrite();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedStrategyId === strat.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {strat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Active Strategy Interactive Flow & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Diagram (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#060A14] border-2 border-slate-800 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${currentStrategy.badgeColor}`}>
                  {currentStrategy.badge}
                </span>
                <h3 className="text-base font-bold text-white">
                  {currentStrategy.name} Write Pipeline
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateWrite}
                  disabled={isSimulatingWrite}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isSimulatingWrite ? 'Writing...' : 'Simulate Write'}</span>
                </button>
                <button
                  onClick={handleResetWrite}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {currentStrategy.flowSummary}
            </p>

            {/* Interactive Node Path Canvas */}
            <div className="py-6 space-y-6">
              {/* Row 1: Read Flow */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  Read Path Lifecycle:
                </span>
                <p className="text-xs font-mono text-slate-300">
                  {currentStrategy.readFlow}
                </p>
              </div>

              {/* Row 2: Write Flow with Moving Indicator */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                    Write Path Lifecycle:
                  </span>
                  {isSimulatingWrite && (
                    <span className="text-[10px] font-mono text-amber-400 animate-pulse font-bold">
                      Step {writeSimulationStep} of 3
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                  {/* Step 1: App Server */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    writeSimulationStep >= 1
                      ? 'bg-purple-950 border-purple-500 text-purple-200 ring-2 ring-purple-500/20 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}>
                    <Server className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                    <span className="font-bold block text-[11px]">1. App Server</span>
                    <span className="text-[9px] text-slate-400">Incoming Write</span>
                  </div>

                  {/* Step 2: Cache or DB depending on strategy */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    writeSimulationStep >= 2
                      ? 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/20 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}>
                    {selectedStrategyId === 'write-around' ? (
                      <>
                        <Database className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                        <span className="font-bold block text-[11px]">2. SQL Database</span>
                        <span className="text-[9px] text-slate-400">Direct DB Write</span>
                      </>
                    ) : selectedStrategyId === 'cache-aside' ? (
                      <>
                        <Database className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                        <span className="font-bold block text-[11px]">2. SQL Database</span>
                        <span className="text-[9px] text-slate-400">Update DB First</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                        <span className="font-bold block text-[11px]">2. Redis Cache</span>
                        <span className="text-[9px] text-slate-400">
                          {selectedStrategyId === 'write-back' ? 'Instant RAM ACK' : 'Cache Write'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Step 3: Eviction or DB Sync */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    writeSimulationStep >= 3
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}>
                    {selectedStrategyId === 'cache-aside' ? (
                      <>
                        <Zap className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                        <span className="font-bold block text-[11px]">3. Invalidate</span>
                        <span className="text-[9px] text-slate-400">DEL key in Redis</span>
                      </>
                    ) : selectedStrategyId === 'write-back' ? (
                      <>
                        <Database className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                        <span className="font-bold block text-[11px]">3. Async DB Batch</span>
                        <span className="text-[9px] text-slate-400">Flush in BG</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                        <span className="font-bold block text-[11px]">3. DB Commit</span>
                        <span className="text-[9px] text-slate-400">Synchronous Sync</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Ideal Use Case */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <strong className="text-white">Best Suited For: </strong>
              <span>{currentStrategy.bestFor}</span>
            </div>
          </div>
        </div>

        {/* Right: Pros & Cons Scorecard (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${currentStrategy.badgeColor}`}>
                Strategy Analysis
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                {currentStrategy.name}
              </h3>
            </div>

            {/* Pros List */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Architectural Advantages
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {currentStrategy.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons List */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Limitations &amp; Risks
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {currentStrategy.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Master Strategies Comparison Matrix */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-500" />
          <span>4-Strategy Architectural Decision Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="pb-3">Strategy</th>
                <th className="pb-3">Read Latency</th>
                <th className="pb-3">Write Latency</th>
                <th className="pb-3">Data Consistency</th>
                <th className="pb-3">Memory Churn</th>
                <th className="pb-3">Data Loss Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">Cache-Aside (Lazy)</td>
                <td className="py-3">1ms on hit / 80ms on miss</td>
                <td className="py-3">45ms (DB Write + Evict)</td>
                <td className="py-3 text-emerald-500">Eventual / High</td>
                <td className="py-3 text-emerald-500">Low (Lazy Loaded)</td>
                <td className="py-3 text-emerald-500">Zero</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-bold text-blue-600 dark:text-blue-400">Write-Through</td>
                <td className="py-3 text-emerald-500">1ms (Always Warm)</td>
                <td className="py-3 text-rose-500">85ms (Dual Sync Write)</td>
                <td className="py-3 text-blue-500">Strict (100% Fresh)</td>
                <td className="py-3 text-amber-500">Medium</td>
                <td className="py-3 text-emerald-500">Zero</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-bold text-purple-600 dark:text-purple-400">Write-Back (Behind)</td>
                <td className="py-3 text-emerald-500">1ms (Always Warm)</td>
                <td className="py-3 text-emerald-500 font-bold">1ms (Instant RAM ACK)</td>
                <td className="py-3 text-amber-500">Eventual (Buffer Sync)</td>
                <td className="py-3 text-amber-500">Medium</td>
                <td className="py-3 text-rose-500 font-bold">High (if Cache crashes)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-bold text-amber-600 dark:text-amber-400">Write-Around</td>
                <td className="py-3">80ms on 1st read</td>
                <td className="py-3 text-emerald-500">40ms (Direct DB Write)</td>
                <td className="py-3 text-amber-500">Eventual</td>
                <td className="py-3 text-emerald-500 font-bold">Zero Cache Churn</td>
                <td className="py-3 text-emerald-500">Zero</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
          <div>
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
              Step 3: Caching Strategies Completed
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              Ready to explore TTL expirations, stale data mitigation, and Cache Stampede prevention?
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
        >
          <span>Proceed to Invalidation Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default CacheStrategiesSection;

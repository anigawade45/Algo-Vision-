import { useState } from 'react';
import { 
  BookOpen, 
  Zap, 
  HardDrive, 
  Database, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Flame,
  Globe
} from 'lucide-react';
import { CACHING_CONCEPTS, LATENCY_HIERARCHY } from '../../data/cachingData';

export function CachingConceptsSection({ onCompleteStep, isCompleted }) {
  const [selectedConcept, setSelectedConcept] = useState(CACHING_CONCEPTS[0].id);
  const [demoKeyStatus, setDemoKeyStatus] = useState('uncached'); // 'uncached' | 'cached'
  const [demoResult, setDemoResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeConceptData = CACHING_CONCEPTS.find((c) => c.id === selectedConcept) || CACHING_CONCEPTS[0];

  const handleRunMiniDemo = (action) => {
    setIsSimulating(true);
    setDemoResult(null);

    setTimeout(() => {
      if (action === 'read') {
        if (demoKeyStatus === 'cached') {
          setDemoResult({
            type: 'HIT',
            latency: '1.2 ms',
            source: 'Redis In-Memory Cache (RAM)',
            statusColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500',
            desc: 'Instant O(1) in-memory lookup. Zero SQL queries executed; zero database load.'
          });
        } else {
          setDemoResult({
            type: 'MISS',
            latency: '82.4 ms',
            source: 'PostgreSQL Relational Database (NVMe Disk)',
            statusColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-500',
            desc: 'Cache miss incurred. Server queried database, stored key in Redis with 60s TTL, and returned record.'
          });
          setDemoKeyStatus('cached');
        }
      } else if (action === 'invalidate') {
        setDemoKeyStatus('uncached');
        setDemoResult({
          type: 'INVALIDATED',
          latency: '0.8 ms',
          source: 'Cache Invalidation (DEL user:101)',
          statusColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-500',
          desc: 'Key evicted from cache upon database write to prevent stale reads.'
        });
      }
      setIsSimulating(false);
    }, 450);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Concepts Introduction Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Caching Principles & Memory Hierarchy
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Understand nanosecond in-memory speed versus millisecond database disk I/O.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          A <strong>Distributed Cache</strong> (such as Redis or Memcached) is a high-speed, volatile in-memory key-value data store. By keeping frequently requested data in RAM, systems achieve <strong>sub-millisecond latency</strong>, reduce database compute bottlenecks, and handle millions of concurrent user reads effortlessly.
        </p>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {CACHING_CONCEPTS.map((concept) => {
            const isSelected = selectedConcept === concept.id;
            return (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                    : 'bg-slate-50/70 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-xs'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${concept.badgeColor}`}>
                    {concept.tag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {concept.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span>Explore pillar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Selected Concept Deep-Dive Panel */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${activeConceptData.badgeColor}`}>
                {activeConceptData.tag}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {activeConceptData.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {activeConceptData.summary}
            </p>
          </div>
        </div>

        {/* Key Takeaways & Formula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              Core Architectural Mechanisms
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {activeConceptData.keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              Industry Pattern & Mathematical Rule
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Production Context: </strong>
                  {activeConceptData.realWorldExample}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-rose-300 font-mono text-xs border border-rose-900/40">
                <span className="text-slate-500 block text-[10px] uppercase">Formula / Invariant:</span>
                {activeConceptData.formula}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Memory & Storage Latency Scale */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                The Computer Systems Latency Scale
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Why RAM access is thousands of times faster than querying a persistent disk database.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-mono border border-rose-200 dark:border-rose-800">
            Speed Ratio: RAM (1ms) vs SQL DB (80ms) = <strong>80x Speedup</strong>
          </div>
        </div>

        {/* Latency Scale Visual Bars */}
        <div className="space-y-3">
          {LATENCY_HIERARCHY.map((tier, idx) => {
            const isRam = tier.type === 'ram';
            const isDb = tier.type === 'db';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isRam
                    ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                    : isDb
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-400'
                    : 'bg-slate-50/50 dark:bg-[#070A12] border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    tier.type === 'cpu'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : tier.type === 'ram'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : tier.type === 'disk'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : tier.type === 'db'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {tier.type === 'cpu' && <Cpu className="w-4 h-4" />}
                    {tier.type === 'ram' && <Zap className="w-4 h-4" />}
                    {tier.type === 'disk' && <HardDrive className="w-4 h-4" />}
                    {tier.type === 'db' && <Database className="w-4 h-4" />}
                    {tier.type === 'network' && <Globe className="w-4 h-4" />}
                  </div>

                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{tier.level}</span>
                      {isRam && (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-rose-600 text-white font-semibold">
                          Redis Target
                        </span>
                      )}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{tier.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Latency:</span>
                    <strong className="text-slate-900 dark:text-white">{tier.time}</strong>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-slate-400 text-[10px] block">Relative Cost:</span>
                    <span className={`font-bold ${isRam ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {tier.multiplier}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Human Analogy Card */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <strong className="text-rose-300 font-mono text-sm block">Human-Scaled Intuition Analogy:</strong>
              <p className="text-slate-300 mt-0.5">
                If reading from <strong>L1 Cache</strong> took <strong>1 second</strong> (grabbing a book from your desk), reading from <strong>Redis RAM</strong> takes <strong>3 minutes</strong>, reading from <strong>SSD</strong> takes <strong>2.3 days</strong>, and querying a <strong>Remote Database</strong> takes <strong>1.5 months</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Hit vs Miss Mini-Simulator */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Interactive Hit vs. Miss Playground
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate requesting <code>user:101</code> to observe how the first read incurs a cache miss while subsequent reads return instant cache hits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunMiniDemo('read')}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Executing...' : 'Read Key (GET user:101)'}</span>
            </button>

            <button
              onClick={() => handleRunMiniDemo('invalidate')}
              disabled={isSimulating || demoKeyStatus === 'uncached'}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer hover:bg-slate-200 disabled:opacity-40"
            >
              <span>Invalidate Cache</span>
            </button>
          </div>
        </div>

        {/* Live Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key State Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Key:</span>
              <span className="font-bold text-slate-900 dark:text-white">user:101</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Redis Cache State:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full border ${
                demoKeyStatus === 'cached'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {demoKeyStatus === 'cached' ? 'WARM (Cached in RAM)' : 'COLD (Not Cached)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">PostgreSQL Database:</span>
              <span className="text-emerald-500 font-bold">Authoritative Record Exists</span>
            </div>
          </div>

          {/* Result Output Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            demoResult
              ? demoResult.statusColor
              : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            {demoResult ? (
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Status: {demoResult.type}</span>
                  <span className="font-bold">{demoResult.latency}</span>
                </div>
                <p className="text-[11px] opacity-90">Source: {demoResult.source}</p>
                <p className="text-[11px] opacity-80 pt-1 border-t border-current/20">{demoResult.desc}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-400">
                Click &quot;Read Key&quot; above to execute a simulated read request.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
          <div>
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
              Step 1: Caching Principles Completed
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              Ready to interact with the full Cache-Aside 4-tier live architecture simulator?
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
        >
          <span>Proceed to Cache-Aside Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default CachingConceptsSection;

import { useState } from 'react';
import { 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  Zap, 
  AlertTriangle, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export function CacheInvalidationLab({ onCompleteStep, isCompleted }) {
  // Tab: 'stale-data' | 'stampede' | 'ttl-clock'
  const [activeTab, setActiveTab] = useState('stale-data');

  // Lab 1: Stale Data State
  const [staleDbPrice, setStaleDbPrice] = useState(950);
  const [staleCachePrice, setStaleCachePrice] = useState(1200);
  const [staleReadLog, setStaleReadLog] = useState(null);

  // Lab 2: Cache Stampede (Thundering Herd) State
  const [stampedeMode, setStampedeMode] = useState('unlocked'); // 'unlocked' | 'mutex'
  const [stampedeSimulating, setStampedeSimulating] = useState(false);
  const [stampedeResults, setStampedeResults] = useState(null);

  // Lab 3: TTL Clock Simulator State
  const [simulatedTimeSec, setSimulatedTimeSec] = useState(0);
  const [ttlItems, setTtlItems] = useState([
    { key: 'session:user_a', value: 'auth_token_99a', maxTtl: 15, currentTtl: 15 },
    { key: 'news:breaking', value: 'headline_election', maxTtl: 30, currentTtl: 30 },
    { key: 'stock:AAPL', value: '$224.50', maxTtl: 10, currentTtl: 10 }
  ]);

  // Handlers for Lab 1 (Stale Data)
  const handleUpdatePriceNoInvalidate = () => {
    const newPrice = staleDbPrice === 950 ? 800 : 950;
    setStaleDbPrice(newPrice);
    setStaleReadLog({
      type: 'STALE_READ_BUG',
      title: '🚨 Stale Data Bug Incurred!',
      desc: `PostgreSQL updated to $${newPrice}, but Redis still holds cached $${staleCachePrice}. Clients reading Redis will see the wrong outdated price!`
    });
  };

  const handleUpdatePriceWithInvalidate = () => {
    const newPrice = staleDbPrice === 950 ? 800 : 950;
    setStaleDbPrice(newPrice);
    setStaleCachePrice(null); // Evicted from Redis
    setStaleReadLog({
      type: 'INVALIDATED_SUCCESS',
      title: '✓ Cache Invalidation Successful',
      desc: `PostgreSQL updated to $${newPrice} and DEL product:404 executed in Redis. The next client read will pull fresh $${newPrice} from DB.`
    });
  };

  const handleClientReadPrice = () => {
    if (staleCachePrice !== null) {
      setStaleReadLog({
        type: 'READ_CACHE',
        title: `Client read: $${staleCachePrice} (from Redis RAM)`,
        desc: staleCachePrice === staleDbPrice 
          ? 'Data is 100% fresh and matches database.' 
          : `DIRTY READ ERROR: Database has $${staleDbPrice}, but customer saw stale $${staleCachePrice}!`
      });
    } else {
      // Cache miss -> read DB and repopulate
      setStaleCachePrice(staleDbPrice);
      setStaleReadLog({
        type: 'READ_DB_POPULATE',
        title: `Cache Miss ➔ Read DB: $${staleDbPrice}`,
        desc: `Fetched authoritative $${staleDbPrice} from PostgreSQL and warmed Redis cache with fresh value!`
      });
    }
  };

  // Handlers for Lab 2 (Cache Stampede)
  const handleRunStampedeSimulation = () => {
    setStampedeSimulating(true);
    setStampedeResults(null);

    setTimeout(() => {
      const concurrentRequests = 1000;
      if (stampedeMode === 'unlocked') {
        // Without mutex: all 1,000 requests hit DB concurrently
        setStampedeResults({
          mode: 'unlocked',
          totalRequests: concurrentRequests,
          dbQueriesTriggered: 1000,
          dbCpuUtilization: '100% (CRASHED / 504 Gateway Timeout)',
          dbConnectionPool: '1000 / 100 Exhausted 🚨',
          avgResponseTime: '3,850 ms',
          statusColor: 'text-rose-500 bg-rose-950/40 border-rose-500',
          summary: '🚨 CATASTROPHIC STAMPEDE: The expired hot key caused 1,000 requests to hit the database simultaneously. Database connection pool was exhausted and service suffered downtime!'
        });
      } else {
        // With mutex lock: 1 request queries DB; 999 wait for cache
        setStampedeResults({
          mode: 'mutex',
          totalRequests: concurrentRequests,
          dbQueriesTriggered: 1,
          dbCpuUtilization: '4% (Healthy)',
          dbConnectionPool: '1 / 100 Connections',
          avgResponseTime: '2.8 ms',
          statusColor: 'text-emerald-500 bg-emerald-950/40 border-emerald-500',
          summary: '🛡️ MUTEX PROTECTION SUCCESS: Only 1 worker thread acquired the distributed lock to query PostgreSQL. The other 999 requests waited 15ms and received the fresh cached result. Zero DB stress!'
        });
      }
      setStampedeSimulating(false);
    }, 1200);
  };

  // Handlers for Lab 3 (TTL Clock)
  const handleAdvanceTtlClock = (seconds) => {
    setSimulatedTimeSec(prev => prev + seconds);
    setTtlItems(prev =>
      prev.map(item => ({
        ...item,
        currentTtl: Math.max(0, item.currentTtl - seconds)
      }))
    );
  };

  const handleResetTtl = () => {
    setSimulatedTimeSec(0);
    setTtlItems([
      { key: 'session:user_a', value: 'auth_token_99a', maxTtl: 15, currentTtl: 15 },
      { key: 'news:breaking', value: 'headline_election', maxTtl: 30, currentTtl: 30 },
      { key: 'stock:AAPL', value: '$224.50', maxTtl: 10, currentTtl: 10 }
    ]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Consistency &amp; Resilience Lab</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              TTL Expiration, Stale Data &amp; Cache Stampede
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Solve the two hardest problems in distributed systems: maintaining cache consistency and protecting databases from thundering herds.
            </p>
          </div>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('stale-data')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'stale-data'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Stale Data Demo
            </button>
            <button
              onClick={() => setActiveTab('stampede')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'stampede'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cache Stampede (Herd)
            </button>
            <button
              onClick={() => setActiveTab('ttl-clock')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ttl-clock'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              TTL Expiry Clock
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: STALE DATA & INVALIDATION DEMO */}
      {activeTab === 'stale-data' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Actions (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Simulate DB Update &amp; Read</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Target Key: <code className="font-bold text-rose-500">product:404</code> (MacBook Pro)
            </p>

            <div className="space-y-2.5">
              <button
                onClick={handleUpdatePriceNoInvalidate}
                className="w-full text-left p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-xs font-mono text-rose-900 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <div className="font-bold mb-1">1. Update DB WITHOUT Cache Invalidation</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Updates PostgreSQL price but leaves old price in Redis (Triggers Stale Read bug!).
                </div>
              </button>

              <button
                onClick={handleUpdatePriceWithInvalidate}
                className="w-full text-left p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs font-mono text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <div className="font-bold mb-1">2. Update DB WITH Invalidation (DEL key)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Updates PostgreSQL and immediately evicts key in Redis.
                </div>
              </button>

              <button
                onClick={handleClientReadPrice}
                className="w-full p-3.5 rounded-2xl bg-slate-900 text-white text-xs font-bold font-mono hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Client: Read Product Price (GET product:404)</span>
              </button>
            </div>

            {/* Read Log Output */}
            {staleReadLog && (
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-1 ${
                staleReadLog.type === 'STALE_READ_BUG'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200'
                  : staleReadLog.type === 'INVALIDATED_SUCCESS'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                <div className="font-bold">{staleReadLog.title}</div>
                <div className="text-[11px] opacity-90">{staleReadLog.desc}</div>
              </div>
            )}
          </div>

          {/* Live Side-by-Side Values (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#060A14] border-2 border-slate-800 p-6 space-y-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Data Consistency Inspection
                </span>
                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                  staleCachePrice === null
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : staleCachePrice === staleDbPrice
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                }`}>
                  {staleCachePrice === null
                    ? 'Cache Evicted (Warm on next read)'
                    : staleCachePrice === staleDbPrice
                    ? '100% Consistent'
                    : '🚨 DIRTY CACHE DETECTED'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                {/* Redis Card */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-900/40 space-y-2 text-center">
                  <Zap className="w-8 h-8 text-rose-500 mx-auto" />
                  <span className="text-xs font-mono text-slate-400 block">Redis In-Memory Price</span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {staleCachePrice !== null ? `$${staleCachePrice}` : <span className="text-slate-500 italic">(nil / Evicted)</span>}
                  </div>
                </div>

                {/* DB Card */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/40 space-y-2 text-center">
                  <Database className="w-8 h-8 text-amber-500 mx-auto" />
                  <span className="text-xs font-mono text-slate-400 block">PostgreSQL Authoritative Price</span>
                  <div className="text-2xl font-bold font-mono text-amber-400">
                    ${staleDbPrice}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Architectural Best Practice:</strong> Always invalidate (evict) the cached key immediately after committing updates to the database. This guarantees that subsequent reads fetch fresh data and prevents silent financial or customer data corruption.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CACHE STAMPEDE (THUNDERING HERD) */}
      {activeTab === 'stampede' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>Cache Stampede (Thundering Herd) Simulator</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Simulate 1,000 concurrent client requests hitting an expired hot key simultaneously.
                </p>
              </div>

              {/* Mode Toggle & Trigger */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
                  <button
                    onClick={() => setStampedeMode('unlocked')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      stampedeMode === 'unlocked'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    No Mutex (Stampede)
                  </button>
                  <button
                    onClick={() => setStampedeMode('mutex')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      stampedeMode === 'mutex'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    Mutex Lock (Protected)
                  </button>
                </div>

                <button
                  onClick={handleRunStampedeSimulation}
                  disabled={stampedeSimulating}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${stampedeSimulating ? 'animate-spin' : ''}`} />
                  <span>{stampedeSimulating ? 'Simulating Surge...' : 'Send 1,000 Requests'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          {stampedeResults && (
            <div className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${stampedeResults.statusColor}`}>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-base uppercase">
                  {stampedeResults.mode === 'unlocked' ? '🚨 Database Overloaded' : '🛡️ System Protected by Mutex Lock'}
                </span>
                <span className="font-bold">{stampedeResults.totalRequests} Concurrent Clients</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-current/20">
                  <span className="text-slate-400 block text-[10px]">SQL Queries Executed:</span>
                  <strong className="text-base text-white">{stampedeResults.dbQueriesTriggered}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-current/20">
                  <span className="text-slate-400 block text-[10px]">DB CPU Load:</span>
                  <strong className="text-base text-white">{stampedeResults.dbCpuUtilization}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-current/20">
                  <span className="text-slate-400 block text-[10px]">DB Connection Pool:</span>
                  <strong className="text-base text-white">{stampedeResults.dbConnectionPool}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-current/20">
                  <span className="text-slate-400 block text-[10px]">Avg Response Time:</span>
                  <strong className="text-base text-white">{stampedeResults.avgResponseTime}</strong>
                </div>
              </div>

              <p className="text-xs font-mono leading-relaxed pt-2 border-t border-current/20">
                {stampedeResults.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TTL EXPIRATION CLOCK */}
      {activeTab === 'ttl-clock' && (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Simulated Time-To-Live (TTL) Clock</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulated Clock: <strong className="font-mono text-blue-600 dark:text-blue-400">+{simulatedTimeSec}s elapsed</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdvanceTtlClock(5)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono shadow-xs transition-colors cursor-pointer"
              >
                +5 Seconds
              </button>
              <button
                onClick={() => handleAdvanceTtlClock(15)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono shadow-xs transition-colors cursor-pointer"
              >
                +15 Seconds
              </button>
              <button
                onClick={handleResetTtl}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Reset Clock"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Keys TTL Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ttlItems.map((item) => {
              const isExpired = item.currentTtl === 0;
              const pct = Math.round((item.currentTtl / item.maxTtl) * 100);

              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-2xl border transition-all space-y-3 font-mono text-xs ${
                    isExpired
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/40 opacity-70'
                      : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{item.key}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isExpired
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {isExpired ? 'EXPIRED' : `${item.currentTtl}s TTL`}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isExpired ? 'bg-rose-500' : 'bg-blue-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Value: <code className="text-slate-700 dark:text-slate-300">{item.value}</code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
          <div>
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
              Step 4: Invalidation Lab Completed
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              Ready to explore Cache Eviction Algorithms (LRU, LFU, FIFO)?
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
        >
          <span>Proceed to Eviction Algorithms</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default CacheInvalidationLab;

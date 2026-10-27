import { useState } from 'react';
import { 
  Cpu, 
  RotateCcw, 
  Info, 
  Zap 
} from 'lucide-react';

const MAX_CACHE_CAPACITY = 4;
const CANDIDATE_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function CacheEvictionSection({ onCompleteStep, isCompleted }) {
  const [policy, setPolicy] = useState('lru'); // 'lru' | 'lfu' | 'fifo'
  
  // Cache items: array of { key, insertedAt, lastAccessedAt, accessCount }
  const [cacheItems, setCacheItems] = useState([
    { key: 'A', insertedAt: 1, lastAccessedAt: 1, accessCount: 1 },
    { key: 'B', insertedAt: 2, lastAccessedAt: 2, accessCount: 3 },
    { key: 'C', insertedAt: 3, lastAccessedAt: 3, accessCount: 1 },
    { key: 'D', insertedAt: 4, lastAccessedAt: 4, accessCount: 2 },
  ]);

  const [lastActionLog, setLastActionLog] = useState(null);
  const [clockStep, setClockStep] = useState(5);

  const handleAccessKey = (targetKey) => {
    const nextClock = clockStep + 1;
    setClockStep(nextClock);

    const existingIndex = cacheItems.findIndex(item => item.key === targetKey);

    if (existingIndex !== -1) {
      // CACHE HIT on existing item -> update recency & frequency
      const updated = cacheItems.map((item, idx) =>
        idx === existingIndex
          ? {
              ...item,
              lastAccessedAt: nextClock,
              accessCount: item.accessCount + 1
            }
          : item
      );
      setCacheItems(updated);
      setLastActionLog({
        type: 'HIT',
        key: targetKey,
        desc: `Cache HIT on key [${targetKey}]. Updated last accessed timestamp to t=${nextClock} and access count to ${cacheItems[existingIndex].accessCount + 1}.`
      });
      return;
    }

    // CACHE MISS -> Need to insert new key
    if (cacheItems.length < MAX_CACHE_CAPACITY) {
      // Free slot available
      const newItem = {
        key: targetKey,
        insertedAt: nextClock,
        lastAccessedAt: nextClock,
        accessCount: 1
      };
      setCacheItems([...cacheItems, newItem]);
      setLastActionLog({
        type: 'INSERT',
        key: targetKey,
        desc: `Cache MISS on key [${targetKey}]. Placed into empty slot (${cacheItems.length + 1}/${MAX_CAPACITY_LIMIT}).`
      });
    } else {
      // CACHE IS FULL -> EVICTION REQUIRED!
      let evictedItem;
      let remainingItems;

      if (policy === 'lru') {
        // LRU: Find item with lowest lastAccessedAt
        const sortedByLru = [...cacheItems].sort((a, b) => a.lastAccessedAt - b.lastAccessedAt);
        evictedItem = sortedByLru[0];
        remainingItems = cacheItems.filter(item => item.key !== evictedItem.key);
      } else if (policy === 'lfu') {
        // LFU: Find item with lowest accessCount (tie-breaker: lowest lastAccessedAt)
        const sortedByLfu = [...cacheItems].sort((a, b) => {
          if (a.accessCount === b.accessCount) return a.lastAccessedAt - b.lastAccessedAt;
          return a.accessCount - b.accessCount;
        });
        evictedItem = sortedByLfu[0];
        remainingItems = cacheItems.filter(item => item.key !== evictedItem.key);
      } else {
        // FIFO: Find item with lowest insertedAt
        const sortedByFifo = [...cacheItems].sort((a, b) => a.insertedAt - b.insertedAt);
        evictedItem = sortedByFifo[0];
        remainingItems = cacheItems.filter(item => item.key !== evictedItem.key);
      }

      const newItem = {
        key: targetKey,
        insertedAt: nextClock,
        lastAccessedAt: nextClock,
        accessCount: 1
      };

      setCacheItems([...remainingItems, newItem]);
      setLastActionLog({
        type: 'EVICTION',
        key: targetKey,
        evictedKey: evictedItem.key,
        desc: `Memory Full! Evicted [${evictedItem.key}] under ${policy.toUpperCase()} policy (${
          policy === 'lru'
            ? `least recently used at t=${evictedItem.lastAccessedAt}`
            : policy === 'lfu'
            ? `lowest access count: ${evictedItem.accessCount}`
            : `oldest inserted at t=${evictedItem.insertedAt}`
        }) and inserted new key [${targetKey}].`
      });
    }
  };

  const MAX_CAPACITY_LIMIT = MAX_CACHE_CAPACITY;

  const handleReset = () => {
    setClockStep(5);
    setCacheItems([
      { key: 'A', insertedAt: 1, lastAccessedAt: 1, accessCount: 1 },
      { key: 'B', insertedAt: 2, lastAccessedAt: 2, accessCount: 3 },
      { key: 'C', insertedAt: 3, lastAccessedAt: 3, accessCount: 1 },
      { key: 'D', insertedAt: 4, lastAccessedAt: 4, accessCount: 2 },
    ]);
    setLastActionLog(null);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Memory Bounds &amp; Eviction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Cache Eviction Algorithms: LRU vs. LFU vs. FIFO
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Because RAM is finite and expensive, caching systems must intelligently evict items when memory capacity is reached.
            </p>
          </div>

          {/* Policy Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <button
              onClick={() => setPolicy('lru')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                policy === 'lru'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              LRU (Least Recently Used)
            </button>
            <button
              onClick={() => setPolicy('lfu')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                policy === 'lfu'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              LFU (Least Frequently Used)
            </button>
            <button
              onClick={() => setPolicy('fifo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                policy === 'fifo'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              FIFO (First In First Out)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Memory Buffer Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Access Pad (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-500" />
                <span>Simulate Key Access</span>
              </h3>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Reset Buffer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any key below to simulate an application read request. If the key is missing and the 4-slot buffer is full, the active <strong>{policy.toUpperCase()}</strong> policy will choose which item to evict.
            </p>

            {/* Candidate Key Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {CANDIDATE_KEYS.map((k) => {
                const inCache = cacheItems.some(item => item.key === k);
                return (
                  <button
                    key={k}
                    onClick={() => handleAccessKey(k)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      inCache
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                    }`}
                  >
                    <span className="text-lg font-bold font-mono">{k}</span>
                    <span className="text-[10px] font-mono opacity-80">
                      {inCache ? 'In Cache (HIT)' : 'Uncached (MISS)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Log Banner */}
          {lastActionLog && (
            <div className={`p-4 rounded-2xl border text-xs font-mono space-y-1 ${
              lastActionLog.type === 'EVICTION'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200'
                : lastActionLog.type === 'HIT'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                : 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200'
            }`}>
              <div className="font-bold">
                {lastActionLog.type === 'EVICTION' ? '🚨 EVICTION OCCURRED' : lastActionLog.type}
              </div>
              <div className="text-[11px] opacity-90">{lastActionLog.desc}</div>
            </div>
          )}
        </div>

        {/* Right: Visual 4-Slot Cache Memory Buffer (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#060A14] border-2 border-slate-800 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                Cache Memory Buffer (Capacity: {cacheItems.length} / {MAX_CACHE_CAPACITY} Slots)
              </span>
              <span className="text-xs font-mono text-rose-400 font-bold">
                Policy: {policy.toUpperCase()}
              </span>
            </div>

            {/* 4 Memory Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              {Array.from({ length: MAX_CACHE_CAPACITY }).map((_, slotIdx) => {
                const item = cacheItems[slotIdx];

                return (
                  <div
                    key={slotIdx}
                    className={`p-4 rounded-2xl border-2 transition-all text-center space-y-2 ${
                      item
                        ? 'bg-slate-900/90 border-rose-500 shadow-md shadow-rose-950/40'
                        : 'bg-slate-950/60 border-dashed border-slate-800 text-slate-600'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">
                      Slot #{slotIdx + 1}
                    </span>

                    {item ? (
                      <div className="space-y-1 font-mono">
                        <div className="text-2xl font-extrabold text-white">{item.key}</div>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 space-y-0.5">
                          <div>Last Acc: <strong className="text-rose-400">t={item.lastAccessedAt}</strong></div>
                          <div>Freq: <strong className="text-purple-400">{item.accessCount}x</strong></div>
                          <div>Added: t={item.insertedAt}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-xs font-mono italic text-slate-600">
                        [ Empty Slot ]
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p>
              {policy === 'lru' && (
                <><strong>LRU Mechanism:</strong> Tracks recency using a Doubly-Linked List + Hash Map (O(1) time). Items accessed recently move to the head; items at the tail are evicted first.</>
              )}
              {policy === 'lfu' && (
                <><strong>LFU Mechanism:</strong> Tracks access frequency counters. Protects ultra-popular keys from eviction even if unaccessed for a few seconds.</>
              )}
              {policy === 'fifo' && (
                <><strong>FIFO Mechanism:</strong> Simple queue. Evicts items strictly in insertion order regardless of how hot or frequently read the key is.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CacheEvictionSection;

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Database, 
  Server, 
  Laptop, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { SAMPLE_DATASET } from '../../data/cachingData';

export function CacheAsideVisualizer({ onCompleteStep, isCompleted }) {
  // In-memory simulation state
  const [dbData, setDbData] = useState(() => {
    const initialDb = {};
    SAMPLE_DATASET.forEach(item => {
      initialDb[item.key] = {
        ...item.dbValue,
        _version: 1,
        _updatedAt: 'Just now'
      };
    });
    return initialDb;
  });

  // Redis Cache dictionary: { [key]: { value, ttl, maxTtl, expiresAt, sizeBytes } }
  const [redisCache, setRedisCache] = useState({});

  // Simulation controls
  const [selectedKey, setSelectedKey] = useState(SAMPLE_DATASET[0].key);
  const [cachingEnabled, setCachingEnabled] = useState(true);
  const [customTtl, setCustomTtl] = useState(30);
  const [isAutoStreaming, setIsAutoStreaming] = useState(false);
  const [streamIntervalMs, setStreamIntervalMs] = useState(2000);

  // Active in-flight animation state: null | { id, key, action: 'read'|'write', step: 1|2|3|4|5, isHit: bool, latency: number }
  const [currentFlight, setCurrentFlight] = useState(null);

  // Metrics
  const [totalRequests, setTotalRequests] = useState(0);
  const [cacheHits, setCacheHits] = useState(0);
  const [cacheMisses, setCacheMisses] = useState(0);
  const [dbReads, setDbReads] = useState(0);
  const [dbWrites, setDbWrites] = useState(0);
  const [eventLogs, setEventLogs] = useState([]);

  const flightCounter = useRef(1);
  const autoStreamTimerRef = useRef(null);

  // Active TTL tick countdown timer
  useEffect(() => {
    const ttlTimer = setInterval(() => {
      const now = Date.now();
      setRedisCache(prev => {
        let changed = false;
        const updated = {};
        Object.entries(prev).forEach(([k, item]) => {
          const remaining = Math.max(0, Math.ceil((item.expiresAt - now) / 1000));
          if (remaining > 0) {
            updated[k] = { ...item, ttl: remaining };
          } else {
            changed = true; // Key expired and is automatically evicted
          }
        });
        return changed ? updated : (Object.keys(prev).length > 0 ? updated : prev);
      });
    }, 1000);

    return () => clearInterval(ttlTimer);
  }, []);

  // Compute metrics
  const hitRatio = totalRequests > 0 ? Math.round((cacheHits / totalRequests) * 100) : 0;
  const avgLatency = totalRequests > 0 
    ? ((cacheHits * 1.2 + cacheMisses * 82.5 + (cachingEnabled ? 0 : totalRequests * 80)) / Math.max(1, totalRequests + (!cachingEnabled ? totalRequests : 0))).toFixed(1)
    : '0.0';
  const timeSavedMs = cacheHits * 81.3;

  // Execute a Read (GET) Request
  const handleReadRequest = useCallback(() => {
    if (currentFlight) return; // Wait for active animation

    const reqId = `REQ-${String(flightCounter.current++).padStart(4, '0')}`;
    const timestamp = new Date().toLocaleTimeString();
    const now = Date.now();

    const isHit = cachingEnabled && redisCache[selectedKey] && redisCache[selectedKey].expiresAt > now;

    setTotalRequests(prev => prev + 1);

    if (!cachingEnabled) {
      // Caching disabled: direct DB read
      setDbReads(prev => prev + 1);
      const flight = {
        id: reqId,
        key: selectedKey,
        action: 'read',
        step: 1, // Client -> Server -> DB -> Client
        isHit: false,
        latency: 84.5
      };
      setCurrentFlight(flight);

      setTimeout(() => setCurrentFlight(f => f ? { ...f, step: 2 } : null), 400);
      setTimeout(() => setCurrentFlight(f => f ? { ...f, step: 4 } : null), 900);
      setTimeout(() => {
        setCurrentFlight(null);
        setEventLogs(prev => [
          {
            id: reqId,
            timestamp,
            action: 'GET (Direct DB)',
            key: selectedKey,
            status: '200 OK (DB Read)',
            statusColor: 'text-amber-500',
            latency: '84.5ms',
            source: 'Direct PostgreSQL'
          },
          ...prev.slice(0, 19)
        ]);
      }, 1500);
      return;
    }

    if (isHit) {
      // CACHE HIT LIFECYCLE
      setCacheHits(prev => prev + 1);
      const flight = {
        id: reqId,
        key: selectedKey,
        action: 'read',
        step: 1, // 1: Client->Server, 2: Server->Redis, 3: Redis Hit -> Server -> Client
        isHit: true,
        latency: 1.2
      };
      setCurrentFlight(flight);

      setTimeout(() => setCurrentFlight(f => f ? { ...f, step: 2 } : null), 350);
      setTimeout(() => setCurrentFlight(f => f ? { ...f, step: 3 } : null), 750);
      setTimeout(() => {
        setCurrentFlight(null);
        setEventLogs(prev => [
          {
            id: reqId,
            timestamp,
            action: 'GET',
            key: selectedKey,
            status: '200 OK (CACHE HIT)',
            statusColor: 'text-emerald-500',
            latency: '1.2ms',
            source: 'Redis In-Memory'
          },
          ...prev.slice(0, 19)
        ]);
      }, 1200);
    } else {
      // CACHE MISS LIFECYCLE
      setCacheMisses(prev => prev + 1);
      setDbReads(prev => prev + 1);

      const flight = {
        id: reqId,
        key: selectedKey,
        action: 'read',
        step: 1, // 1: Client->Server, 2: Server->Redis (Miss), 3: Server->DB, 4: DB->Redis (Populate), 5: Server->Client
        isHit: false,
        latency: 82.4
      };
      setCurrentFlight(flight);

      setTimeout(() => setCurrentFlight(f => f ? { ...f, step: 2 } : null), 350);
      setTimeout(() => setCurrentFlight(f => f ? { ...f, step: 3 } : null), 750);
      setTimeout(() => {
        // Populate Redis Cache with DB record
        const record = dbData[selectedKey] || { name: 'Item ' + selectedKey, _version: 1 };
        const expiresAt = Date.now() + customTtl * 1000;
        setRedisCache(prev => ({
          ...prev,
          [selectedKey]: {
            value: record,
            ttl: customTtl,
            maxTtl: customTtl,
            expiresAt,
            sizeBytes: JSON.stringify(record).length
          }
        }));
        setCurrentFlight(f => f ? { ...f, step: 4 } : null);
      }, 1200);

      setTimeout(() => setCurrentFlight(f => f ? { ...f, step: 5 } : null), 1600);
      setTimeout(() => {
        setCurrentFlight(null);
        setEventLogs(prev => [
          {
            id: reqId,
            timestamp,
            action: 'GET',
            key: selectedKey,
            status: '200 OK (CACHE MISS)',
            statusColor: 'text-amber-500',
            latency: '82.4ms',
            source: 'PostgreSQL ➔ Cached in Redis'
          },
          ...prev.slice(0, 19)
        ]);
      }, 2000);
    }
  }, [currentFlight, cachingEnabled, redisCache, selectedKey, customTtl, dbData]);

  // Execute a Write (PUT / Update) Request with Cache Invalidation
  const handleWriteRequest = useCallback((customField, customVal) => {
    if (currentFlight) return;

    const reqId = `WRT-${String(flightCounter.current++).padStart(4, '0')}`;
    const timestamp = new Date().toLocaleTimeString();

    setTotalRequests(prev => prev + 1);
    setDbWrites(prev => prev + 1);

    const flight = {
      id: reqId,
      key: selectedKey,
      action: 'write',
      step: 1, // 1: Client->Server, 2: Server->DB (Update), 3: Server->Redis (Invalidate/DEL)
      isHit: false,
      latency: 45.0
    };
    setCurrentFlight(flight);

    setTimeout(() => setCurrentFlight(f => f ? { ...f, step: 2 } : null), 400);

    setTimeout(() => {
      // 1. Update DB Record
      setDbData(prev => {
        const currentRec = prev[selectedKey] || {};
        return {
          ...prev,
          [selectedKey]: {
            ...currentRec,
            [customField || 'updatedField']: customVal || `Updated @ ${new Date().toLocaleTimeString()}`,
            _version: (currentRec._version || 1) + 1,
            _updatedAt: new Date().toLocaleTimeString()
          }
        };
      });

      // 2. Invalidate / Evict key from Redis
      if (cachingEnabled) {
        setRedisCache(prev => {
          const next = { ...prev };
          delete next[selectedKey];
          return next;
        });
      }

      setCurrentFlight(f => f ? { ...f, step: 3 } : null);
    }, 900);

    setTimeout(() => {
      setCurrentFlight(null);
      setEventLogs(prev => [
        {
          id: reqId,
          timestamp,
          action: 'PUT / WRITE',
          key: selectedKey,
          status: '200 OK (DB Updated & Cache Evicted)',
          statusColor: 'text-purple-500',
          latency: '45.0ms',
          source: 'PostgreSQL DB + Redis DEL'
        },
        ...prev.slice(0, 19)
      ]);
    }, 1500);
  }, [currentFlight, selectedKey, cachingEnabled]);

  // Auto-stream interval
  const readRequestRef = useRef(handleReadRequest);
  useEffect(() => {
    readRequestRef.current = handleReadRequest;
  }, [handleReadRequest]);

  useEffect(() => {
    if (isAutoStreaming) {
      autoStreamTimerRef.current = setInterval(() => {
        if (readRequestRef.current) {
          readRequestRef.current();
        }
      }, streamIntervalMs);
    } else {
      if (autoStreamTimerRef.current) clearInterval(autoStreamTimerRef.current);
    }

    return () => {
      if (autoStreamTimerRef.current) clearInterval(autoStreamTimerRef.current);
    };
  }, [isAutoStreaming, streamIntervalMs]);

  // Manual cache actions
  const handleFlushCache = () => {
    setRedisCache({});
    setEventLogs(prev => [
      {
        id: `SYS-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: 'FLUSHALL',
        key: '*',
        status: 'CACHE FLUSHED (0 Keys)',
        statusColor: 'text-rose-400',
        latency: '0.4ms',
        source: 'Redis Admin'
      },
      ...prev.slice(0, 19)
    ]);
  };

  const handleEvictKey = (k) => {
    setRedisCache(prev => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const handleResetAll = () => {
    setIsAutoStreaming(false);
    setCurrentFlight(null);
    setRedisCache({});
    setTotalRequests(0);
    setCacheHits(0);
    setCacheMisses(0);
    setDbReads(0);
    setDbWrites(0);
    setEventLogs([]);
    const initialDb = {};
    SAMPLE_DATASET.forEach(item => {
      initialDb[item.key] = {
        ...item.dbValue,
        _version: 1,
        _updatedAt: 'Initial'
      };
    });
    setDbData(initialDb);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Interactive Visualizer Control Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Cache-Aside Interactive Flow Simulator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Experience the step-by-step request path between Client, Application Server, Redis Cache, and PostgreSQL Database.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleReadRequest}
              disabled={Boolean(currentFlight)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>Read (GET Request)</span>
            </button>

            <button
              onClick={() => handleWriteRequest('price', '$' + (Math.floor(Math.random() * 500) + 1000))}
              disabled={Boolean(currentFlight)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Edit3 className="w-4 h-4" />
              <span>Write / Update DB (PUT)</span>
            </button>

            <button
              onClick={() => setIsAutoStreaming(!isAutoStreaming)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAutoStreaming
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {isAutoStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAutoStreaming ? 'Pause Stream' : 'Auto Stream'}</span>
            </button>

            <button
              onClick={handleFlushCache}
              className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="Flush Cache (FLUSHALL)"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetAll}
              className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Target Key Selector */}
          <div>
            <label className="text-slate-400 font-mono block mb-1.5">Select Target Key:</label>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-200 font-mono focus:outline-none focus:border-rose-500"
            >
              {SAMPLE_DATASET.map(item => (
                <option key={item.key} value={item.key}>
                  {item.key} ({item.label})
                </option>
              ))}
            </select>
          </div>

          {/* Configurable TTL Slider */}
          <div>
            <div className="flex justify-between font-mono mb-1.5">
              <span className="text-slate-400">Cache TTL (Expiry):</span>
              <strong className="text-rose-600 dark:text-rose-400">{customTtl}s</strong>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={customTtl}
              onChange={(e) => setCustomTtl(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Cache Enabled vs Disabled Toggle */}
          <div>
            <label className="text-slate-400 font-mono block mb-1.5">Caching Layer Status:</label>
            <button
              onClick={() => setCachingEnabled(!cachingEnabled)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border font-mono transition-all cursor-pointer ${
                cachingEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300'
              }`}
            >
              <span>{cachingEnabled ? 'Redis: ENABLED' : 'Redis: BYPASSED'}</span>
              {cachingEnabled ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-rose-500" />}
            </button>
          </div>

          {/* Stream Rate */}
          <div>
            <label className="text-slate-400 font-mono block mb-1.5">Auto-Stream Interval:</label>
            <select
              value={streamIntervalMs}
              onChange={(e) => setStreamIntervalMs(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-200 font-mono focus:outline-none focus:border-rose-500"
            >
              <option value={1000}>Fast (1 req / sec)</option>
              <option value={2000}>Normal (1 req / 2 sec)</option>
              <option value={3500}>Slow (1 req / 3.5 sec)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Live 4-Tier Interactive Architecture Canvas */}
      <div className="rounded-3xl bg-[#060A14] border-2 border-slate-800 p-6 sm:p-8 space-y-8 relative overflow-hidden shadow-2xl">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Top Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-slate-800 pb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target Key:</span>
            <span className="text-white font-bold bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
              {selectedKey}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentFlight ? (
              <span className="inline-flex items-center gap-1.5 text-amber-400 animate-pulse font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                In-Flight: {currentFlight.id} ({currentFlight.action.toUpperCase()})
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cluster Ready • Standing By
              </span>
            )}
          </div>
        </div>

        {/* 4 Nodes Grid: Client ➔ App Server ➔ Redis Cache ➔ PostgreSQL DB */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* Node 1: Client / Browser */}
          <div className={`p-5 rounded-3xl border-2 transition-all space-y-3 text-center ${
            currentFlight && (currentFlight.step === 1 || currentFlight.step === (currentFlight.isHit ? 3 : 5))
              ? 'bg-blue-950/70 border-blue-400 shadow-lg shadow-blue-500/20'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Client User</h4>
              <p className="text-[11px] font-mono text-slate-400">Web / Mobile Client</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              Sends GET / PUT requests
            </div>
          </div>

          {/* Node 2: Application Server */}
          <div className={`p-5 rounded-3xl border-2 transition-all space-y-3 text-center ${
            currentFlight && (currentFlight.step === 1 || currentFlight.step === 2 || currentFlight.step === (currentFlight.isHit ? 3 : 4))
              ? 'bg-purple-950/70 border-purple-400 shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">App Server (Node/Go)</h4>
              <p className="text-[11px] font-mono text-slate-400">Cache-Aside Logic</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-purple-300">
              1. Check Cache ➔ 2. Fallback DB
            </div>
          </div>

          {/* Node 3: In-Memory Redis Cache */}
          <div className={`p-5 rounded-3xl border-2 transition-all space-y-3 text-center ${
            !cachingEnabled
              ? 'bg-slate-950/60 border-slate-800 opacity-50'
              : currentFlight && (currentFlight.step === 2 || currentFlight.step === 3 || currentFlight.step === 4)
              ? currentFlight.isHit
                ? 'bg-emerald-950/70 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                : 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 border-rose-900/60'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-600/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Redis Cache (RAM)</h4>
              <p className="text-[11px] font-mono text-rose-300">
                {cachingEnabled ? `${Object.keys(redisCache).length} Keys in Memory` : 'BYPASSED'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400">
              Sub-Millisecond (~1ms) O(1)
            </div>
          </div>

          {/* Node 4: PostgreSQL Database */}
          <div className={`p-5 rounded-3xl border-2 transition-all space-y-3 text-center ${
            currentFlight && (currentFlight.step === 3 || currentFlight.step === 4)
              ? 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/30'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-600/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">PostgreSQL Database</h4>
              <p className="text-[11px] font-mono text-amber-300">Persistent Disk Store</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              Authoritative (~80ms Disk I/O)
            </div>
          </div>
        </div>

        {/* Step Explanation Banner */}
        {currentFlight && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                {currentFlight.action === 'read' ? (
                  currentFlight.isHit ? (
                    <><strong>Cache HIT Path:</strong> App Server found <code>{currentFlight.key}</code> in Redis. Returning in <strong>1.2ms</strong> without querying Database!</>
                  ) : currentFlight.step <= 2 ? (
                    <><strong>Cache MISS Detected:</strong> Key <code>{currentFlight.key}</code> not found in Redis RAM. Falling back to SQL Database...</>
                  ) : currentFlight.step <= 4 ? (
                    <><strong>Database Query &amp; Populate:</strong> Fetched row from PostgreSQL (~80ms). Writing record into Redis with {customTtl}s TTL...</>
                  ) : (
                    <><strong>Complete:</strong> Returned fresh data to client and cache is now warm!</>
                  )
                ) : (
                  <><strong>Write &amp; Invalidate Path:</strong> Updated PostgreSQL record and evicted <code>{currentFlight.key}</code> from Redis cache to prevent stale reads.</>
                )}
              </span>
            </div>
            <span className="font-bold text-rose-400 px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-800 shrink-0">
              Step {currentFlight.step} / {currentFlight.isHit ? '3' : '5'}
            </span>
          </div>
        )}
      </div>

      {/* 3. Live Metrics Dashboard & Performance Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Total Requests */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Total Requests</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">
            {totalRequests}
          </div>
        </div>

        {/* Metric 2: Cache Hits */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 shadow-sm">
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Cache Hits</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {cacheHits}
          </div>
        </div>

        {/* Metric 3: Cache Misses */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 shadow-sm">
          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase font-semibold">Cache Misses</span>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">
            {cacheMisses}
          </div>
        </div>

        {/* Metric 4: Hit Ratio */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Hit Ratio</span>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">
            {hitRatio}%
          </div>
        </div>

        {/* Metric 5: DB Reads */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 uppercase">DB Reads</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">
            {dbReads}
          </div>
        </div>

        {/* Metric 6: Avg Latency */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Avg Latency</span>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">
            {avgLatency}ms
          </div>
        </div>
      </div>

      {/* Latency Savings Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-bold">✓ {cacheHits} SQL Queries Saved</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 dark:text-slate-300">
            Cumulative Compute Latency Saved: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{timeSavedMs.toFixed(1)} ms</strong>
          </span>
        </div>
        <div className="text-slate-500">
          DB Writes / Invalidations: <strong className="text-purple-600 dark:text-purple-400">{dbWrites}</strong>
        </div>
      </div>

      {/* 4. Side-by-Side Live Data Tier Inspection: Redis vs PostgreSQL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Redis In-Memory Store */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Redis Cache In-Memory Table
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
              {Object.keys(redisCache).length} Active Keys
            </span>
          </div>

          {Object.keys(redisCache).length === 0 ? (
            <div className="py-10 text-center font-mono text-xs text-slate-400 space-y-1">
              <p>Redis memory is currently empty.</p>
              <p className="text-[11px] text-slate-500">Execute a GET read request above to populate keys.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(redisCache).map(([k, item]) => {
                const ttlPct = Math.round((item.ttl / item.maxTtl) * 100);
                return (
                  <div
                    key={k}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-rose-600 dark:text-rose-400">{k}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">TTL: <strong>{item.ttl}s</strong></span>
                        <button
                          onClick={() => handleEvictKey(k)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Evict (DEL key)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* TTL Countdown Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${ttlPct}%` }}
                      />
                    </div>

                    <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto p-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                      {JSON.stringify(item.value, null, 2)}
                    </pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: PostgreSQL Relational Database */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                PostgreSQL Authoritative Storage
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              {Object.keys(dbData).length} Rows Persisted
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(dbData).map(([k, record]) => (
              <div
                key={k}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-amber-600 dark:text-amber-400">{k}</span>
                  <span className="text-[10px] text-slate-400">
                    Version: v{record._version} • {record._updatedAt}
                  </span>
                </div>

                <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto p-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                  {JSON.stringify(record, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Request Event Log Table */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Real-Time Request Event Stream ({eventLogs.length} Events)</span>
          </h3>
          {eventLogs.length > 0 && (
            <button
              onClick={() => setEventLogs([])}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear Logs
            </button>
          )}
        </div>

        {eventLogs.length === 0 ? (
          <p className="text-xs font-mono text-slate-400 py-4 text-center">
            No events recorded yet. Send a Read or Write request to trigger logs.
          </p>
        ) : (
          <div className="overflow-x-auto max-h-60 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-2">Req ID</th>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Action</th>
                  <th className="pb-2">Key</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {eventLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="py-2 text-slate-900 dark:text-slate-100 font-bold">{log.id}</td>
                    <td className="py-2 text-slate-500">{log.timestamp}</td>
                    <td className="py-2 text-rose-600 dark:text-rose-400 font-bold">{log.action}</td>
                    <td className="py-2 text-slate-700 dark:text-slate-300 font-semibold">{log.key}</td>
                    <td className={`py-2 font-bold ${log.statusColor}`}>{log.status}</td>
                    <td className="py-2 text-slate-500">{log.source}</td>
                    <td className="py-2 text-right font-bold text-slate-700 dark:text-slate-300">{log.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CacheAsideVisualizer;

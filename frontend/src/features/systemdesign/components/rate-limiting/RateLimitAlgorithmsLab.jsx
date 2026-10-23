import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sliders,
  Play,
  Pause,
  Plus,
  Zap,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';
import { RATE_LIMIT_ALGORITHMS } from '../../data/rateLimitingData';

export function RateLimitAlgorithmsLab({ onCompleteStep, isCompleted }) {
  const [selectedAlgoId, setSelectedAlgoId] = useState('token-bucket');

  // Simulated Time (seconds)
  const [simTime, setSimTime] = useState(10);
  const [isAutoTraffic, setIsAutoTraffic] = useState(false);

  // --- Algorithm States ---
  // Token Bucket State
  const [tbCapacity, setTbCapacity] = useState(10);
  const [tbRefillRate, setTbRefillRate] = useState(2); // tokens/sec
  const [tbTokens, setTbTokens] = useState(10);

  // Leaky Bucket State
  const [lbCapacity, setLbCapacity] = useState(8);
  const [lbLeakRate, setLbLeakRate] = useState(2); // req/sec
  const [lbQueue, setLbQueue] = useState([]);

  // Fixed Window State
  const [fwWindowSec, setFwWindowSec] = useState(10);
  const [fwLimit, setFwLimit] = useState(6);
  const [fwCount, setFwCount] = useState(0);
  const [fwWindowId, setFwWindowId] = useState(1);

  // Sliding Window Log State
  const [swlWindowSec, setSwlWindowSec] = useState(10);
  const [swlLimit, setSwlLimit] = useState(6);
  const [swlTimestamps, setSwlTimestamps] = useState([]);

  // Sliding Window Counter State
  const [swcWindowSec, setSwcWindowSec] = useState(10);
  const [swcLimit, setSwcLimit] = useState(6);
  const [swcPrevCount, setSwcPrevCount] = useState(3);
  const [swcCurrCount, setSwcCurrCount] = useState(0);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0,
  });

  const [lastDecision, setLastDecision] = useState(null);
  const [eventHistory, setEventHistory] = useState([
    { id: 1, time: '10.0s', type: 'system', text: 'Rate limiter simulator initialized with Token Bucket algorithm.' },
  ]);

  const reqIdRef = useRef(1001);

  const addLog = useCallback((type, text) => {
    setEventHistory((prev) => [
      { id: Date.now() + Math.random(), time: `${simTime.toFixed(1)}s`, type, text },
      ...prev.slice(0, 15),
    ]);
  }, [simTime]);

  // Switch Algorithm
  const handleSelectAlgorithm = (algoId) => {
    setSelectedAlgoId(algoId);
    setLastDecision(null);
    addLog('system', `Switched algorithm to ${algoId.toUpperCase().replace(/-/g, ' ')}.`);
  };

  // Advance Simulated Clock
  const advanceTime = useCallback((deltaSec = 1) => {
    setSimTime((prevTime) => {
      const newTime = prevTime + deltaSec;

      // Update Token Bucket refill
      setTbTokens((prevTokens) => {
        const added = deltaSec * tbRefillRate;
        return Math.min(tbCapacity, prevTokens + added);
      });

      // Update Leaky Bucket leak
      setLbQueue((prevQueue) => {
        const leakCount = Math.round(deltaSec * lbLeakRate);
        if (leakCount > 0 && prevQueue.length > 0) {
          return prevQueue.slice(leakCount);
        }
        return prevQueue;
      });

      // Update Fixed Window boundary
      const currentWinId = Math.floor(newTime / fwWindowSec);
      if (currentWinId !== fwWindowId) {
        setFwWindowId(currentWinId);
        setFwCount(0);
      }

      // Update Sliding Window Log (prune old timestamps)
      const windowStart = newTime - swlWindowSec;
      setSwlTimestamps((prev) => prev.filter((t) => t > windowStart));

      // Update Sliding Window Counter
      const currentSecInWin = newTime % swcWindowSec;
      if (currentSecInWin < deltaSec) {
        setSwcPrevCount(swcCurrCount);
        setSwcCurrCount(0);
      }

      return newTime;
    });
  }, [tbCapacity, tbRefillRate, lbLeakRate, fwWindowSec, fwWindowId, swlWindowSec, swcWindowSec, swcCurrCount]);

  // Timer Tick (every second if active)
  useEffect(() => {
    const interval = setInterval(() => {
      advanceTime(0.5);
    }, 500);
    return () => clearInterval(interval);
  }, [advanceTime]);

  // Handle Incoming Request
  const handleSendRequest = (burstSize = 1) => {
    const reqId = reqIdRef.current++;
    let acceptedCount = 0;
    let rejectedCount = 0;
    let decisionDetail = {};

    for (let i = 0; i < burstSize; i++) {
      let isAllowed = false;

      if (selectedAlgoId === 'token-bucket') {
        if (tbTokens >= 1) {
          isAllowed = true;
          setTbTokens((t) => Math.max(0, t - 1));
        }
      } else if (selectedAlgoId === 'leaky-bucket') {
        if (lbQueue.length < lbCapacity) {
          isAllowed = true;
          setLbQueue((q) => [...q, { id: reqId + i, time: simTime }]);
        }
      } else if (selectedAlgoId === 'fixed-window') {
        if (fwCount < fwLimit) {
          isAllowed = true;
          setFwCount((c) => c + 1);
        }
      } else if (selectedAlgoId === 'sliding-window-log') {
        const windowStart = simTime - swlWindowSec;
        const validLogs = swlTimestamps.filter((t) => t > windowStart);
        if (validLogs.length < swlLimit) {
          isAllowed = true;
          setSwlTimestamps((prev) => [...prev, simTime]);
        }
      } else if (selectedAlgoId === 'sliding-window-counter') {
        const timeIntoCurrentWindow = simTime % swcWindowSec;
        const weight = (swcWindowSec - timeIntoCurrentWindow) / swcWindowSec;
        const estimatedRequests = swcPrevCount * weight + swcCurrCount;
        if (estimatedRequests < swcLimit) {
          isAllowed = true;
          setSwcCurrCount((c) => c + 1);
        }
      }

      if (isAllowed) acceptedCount++;
      else rejectedCount++;
    }

    setMetrics((prev) => ({
      totalRequests: prev.totalRequests + burstSize,
      acceptedRequests: prev.acceptedRequests + acceptedCount,
      rejectedRequests: prev.rejectedRequests + rejectedCount,
    }));

    if (burstSize === 1) {
      const allowed = acceptedCount === 1;
      decisionDetail = {
        allowed,
        status: allowed ? 200 : 429,
        statusText: allowed ? '200 OK (Allowed)' : '429 Too Many Requests (Rate Limited)',
        message: allowed
          ? `✓ Request #${reqId} was admitted within rate limit threshold.`
          : `🛑 Request #${reqId} rejected! Rate limit capacity exceeded. Retry-After: 5s`,
      };
      setLastDecision(decisionDetail);
      addLog(allowed ? 'accept' : 'reject', decisionDetail.message);
    } else {
      decisionDetail = {
        allowed: acceptedCount > 0,
        status: acceptedCount === burstSize ? 200 : 429,
        statusText: `Burst Result: ${acceptedCount} Admitted, ${rejectedCount} Rejected`,
        message: `⚡ Ingested burst of ${burstSize} requests (${acceptedCount} passed, ${rejectedCount} throttled).`,
      };
      setLastDecision(decisionDetail);
      addLog(rejectedCount === 0 ? 'accept' : 'reject', decisionDetail.message);
    }
  };

  // Auto Traffic generator
  useEffect(() => {
    if (!isAutoTraffic) return;
    const interval = setInterval(() => {
      handleSendRequest(1);
    }, 600);
    return () => clearInterval(interval);
  }, [isAutoTraffic]);

  const currentAlgo = RATE_LIMIT_ALGORITHMS.find((a) => a.id === selectedAlgoId) || RATE_LIMIT_ALGORITHMS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Simulator • Step 1 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                5 Core Rate Limiting Algorithms Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Experience how <strong className="text-slate-900 dark:text-white">Token Bucket</strong>, <strong className="text-slate-900 dark:text-white">Leaky Bucket</strong>, <strong className="text-slate-900 dark:text-white">Fixed Window</strong>, <strong className="text-slate-900 dark:text-white">Sliding Window Log</strong>, and <strong className="text-slate-900 dark:text-white">Sliding Window Counter</strong> throttle traffic and handle bursty request spikes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAutoTraffic(!isAutoTraffic)}
              className={`text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isAutoTraffic
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {isAutoTraffic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAutoTraffic ? 'Stop Auto Traffic' : 'Auto Send Requests'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Algorithm Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {RATE_LIMIT_ALGORITHMS.map((algo) => {
          const isSelected = selectedAlgoId === algo.id;

          return (
            <button
              key={algo.id}
              onClick={() => handleSelectAlgorithm(algo.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 shadow-xs ring-1 ring-purple-500/20'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#1E2638] hover:bg-slate-50 dark:hover:bg-[#131B2E]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${algo.badgeColor}`}>
                    {algo.tag.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{algo.name}</div>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                {algo.burstSupport.split(' ')[0]} Burst
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Stage: Request Controls + Live Visualizer + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Request Dispatcher & Algorithm Controls (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Traffic Dispatcher
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Clock: <strong className="text-slate-900 dark:text-white">{simTime.toFixed(1)}s</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleSendRequest(1)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Send 1 Request
            </button>

            <button
              onClick={() => handleSendRequest(5)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Burst (+5 Requests)
            </button>
          </div>

          {/* Algorithm Parameters */}
          <div className="space-y-3 pt-2 text-xs">
            <div className="font-bold text-slate-700 dark:text-slate-300">Live Algorithm Parameters:</div>

            {selectedAlgoId === 'token-bucket' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Bucket Capacity:</span>
                  <span className="font-mono font-bold">{tbCapacity} Tokens</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={tbCapacity}
                  onChange={(e) => setTbCapacity(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Refill Rate:</span>
                  <span className="font-mono font-bold">{tbRefillRate} tokens/sec</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={tbRefillRate}
                  onChange={(e) => setTbRefillRate(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            )}

            {selectedAlgoId === 'leaky-bucket' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Queue Capacity:</span>
                  <span className="font-mono font-bold">{lbCapacity} Requests</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={lbCapacity}
                  onChange={(e) => setLbCapacity(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Leak Egress Rate:</span>
                  <span className="font-mono font-bold">{lbLeakRate} req/sec</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={lbLeakRate}
                  onChange={(e) => setLbLeakRate(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            )}

            {(selectedAlgoId === 'fixed-window' || selectedAlgoId === 'sliding-window-log' || selectedAlgoId === 'sliding-window-counter') && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Window Limit:</span>
                  <span className="font-mono font-bold">{fwLimit} Requests</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={fwLimit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFwLimit(val);
                    setSwlLimit(val);
                    setSwcLimit(val);
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Last Decision Banner */}
          {lastDecision && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 animate-in fade-in ${
                lastDecision.allowed
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{lastDecision.statusText}</span>
                {lastDecision.allowed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <p className="text-[11px] leading-relaxed">{lastDecision.message}</p>
            </div>
          )}
        </div>

        {/* Right: Real-time Algorithm State Visualization (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{currentAlgo.name} Live Visualizer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentAlgo.description}</p>
            </div>
          </div>

          {/* Visualizer Renderer according to active algorithm */}
          {selectedAlgoId === 'token-bucket' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Tokens Available in Bucket:</span>
                <span className="font-mono text-base font-black text-purple-600 dark:text-purple-400">
                  {Math.floor(tbTokens)} / {tbCapacity}
                </span>
              </div>

              {/* Tokens Visual Stack */}
              <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 min-h-[50px] items-center">
                {Array.from({ length: Math.floor(tbTokens) }).map((_, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono font-bold animate-in zoom-in-50"
                  >
                    🪙 Token #{i + 1}
                  </span>
                ))}
                {Math.floor(tbTokens) === 0 && (
                  <span className="text-xs text-rose-500 font-bold">Bucket empty! Next requests will receive HTTP 429.</span>
                )}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Refilling at +{tbRefillRate} tokens per second.</span>
                <span className="font-mono">Max Burst: {tbCapacity} req</span>
              </div>
            </div>
          )}

          {selectedAlgoId === 'leaky-bucket' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Requests in Leaky FIFO Buffer:</span>
                <span className="font-mono text-base font-black text-purple-600 dark:text-purple-400">
                  {lbQueue.length} / {lbCapacity}
                </span>
              </div>

              {/* Leaky Queue Stack */}
              <div className="space-y-1.5 p-3 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 min-h-[70px]">
                {lbQueue.map((req, idx) => (
                  <div key={req.id} className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 flex justify-between text-xs font-mono">
                    <span>Req #{req.id}</span>
                    <span className="text-purple-600 dark:text-purple-400">Position {idx + 1}</span>
                  </div>
                ))}
                {lbQueue.length === 0 && (
                  <span className="text-xs text-slate-400">Queue buffer empty. Ready for new traffic.</span>
                )}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Leaking (executing) at constant rate: {lbLeakRate} req/sec.</span>
                <span className="font-mono">Zero burstiness</span>
              </div>
            </div>
          )}

          {selectedAlgoId === 'fixed-window' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Fixed Window Counter (Window #{fwWindowId}):</span>
                <span className="font-mono text-base font-black text-purple-600 dark:text-purple-400">
                  {fwCount} / {fwLimit} Requests
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    fwCount >= fwLimit ? 'bg-rose-500' : 'bg-purple-600'
                  }`}
                  style={{ width: `${Math.min(100, (fwCount / fwLimit) * 100)}%` }}
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <strong>⚠️ Boundary Burst Vulnerability:</strong> A burst of {fwLimit} requests at the end of Window #{fwWindowId} and another {fwLimit} at the start of Window #{fwWindowId + 1} allows 2x the allowed limit in a narrow window!
              </div>
            </div>
          )}

          {selectedAlgoId === 'sliding-window-log' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Timestamps in 10-Second Sliding Window:</span>
                <span className="font-mono text-base font-black text-purple-600 dark:text-purple-400">
                  {swlTimestamps.length} / {swlLimit}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 p-3 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 min-h-[50px]">
                {swlTimestamps.map((t, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-mono font-bold">
                    {t.toFixed(1)}s
                  </span>
                ))}
                {swlTimestamps.length === 0 && (
                  <span className="text-xs text-slate-400">No active request timestamps.</span>
                )}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                100% accurate, but high Redis memory overhead: stores an array of epoch timestamps for every request.
              </div>
            </div>
          )}

          {selectedAlgoId === 'sliding-window-counter' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Sliding Estimation Formula:</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">Limit: {swcLimit} req</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-slate-500 dark:text-slate-400">
                  Estimated = (PrevWindowCount × Weight) + CurrWindowCount
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  = ({swcPrevCount} × {(((swcWindowSec - (simTime % swcWindowSec)) / swcWindowSec)).toFixed(2)}) + {swcCurrCount} ={' '}
                  <span className="text-purple-600 dark:text-purple-400 font-black text-sm">
                    {((swcPrevCount * ((swcWindowSec - (simTime % swcWindowSec)) / swcWindowSec)) + swcCurrCount).toFixed(1)} Req
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cloudflare recommendation: Combines memory efficiency of Fixed Window with smoothness of Sliding Logs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Live Telemetry & Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Gateway Telemetry Counters
          </h4>

          <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Ingested</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{metrics.totalRequests}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Admitted (200)</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{metrics.acceptedRequests}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Throttled (429)</div>
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">{metrics.rejectedRequests}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Gateway Decision Activity Log
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Live Stream</span>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1 custom-scrollbar">
            {eventHistory.map((log) => {
              let logColor = 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#0B101D]';
              if (log.type === 'accept') logColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20';
              else if (log.type === 'reject') logColor = 'text-rose-700 dark:text-rose-300 bg-rose-50/50 dark:bg-rose-950/20';

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
    </div>
  );
}

export default RateLimitAlgorithmsLab;

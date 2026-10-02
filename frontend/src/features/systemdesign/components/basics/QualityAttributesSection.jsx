import { useState, useMemo } from 'react';
import { 
  Gauge, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  Info
} from 'lucide-react';

export function QualityAttributesSection({ onCompleteStep, isCompleted }) {
  // Simulator inputs
  const [trafficRps, setTrafficRps] = useState(2500); // 100 to 50,000 RPS
  const [serverNodes, setServerNodes] = useState(4); // 1 to 20 nodes (each node handles ~1,200 RPS comfortably)
  const [dbReplicas, setDbReplicas] = useState(2); // 1 to 8 replicas (each replica handles ~3,000 read RPS)
  const [cachingEnabled, setCachingEnabled] = useState(true);
  const [cacheHitRatio, setCacheHitRatio] = useState(80); // 0% to 95%

  // Simulation calculations
  const metrics = useMemo(() => {
    const NODE_CAPACITY = 1200; // RPS per server node
    const DB_REPLICA_CAPACITY = 3000; // RPS per DB replica
    const totalServerCapacity = serverNodes * NODE_CAPACITY;

    // Traffic reaching DB after cache
    const effectiveDbRps = cachingEnabled
      ? trafficRps * (1 - cacheHitRatio / 100)
      : trafficRps;
    const totalDbCapacity = dbReplicas * DB_REPLICA_CAPACITY;

    // Server load utilization %
    const serverUtilization = Math.min(150, Math.round((trafficRps / totalServerCapacity) * 100));
    // DB load utilization %
    const dbUtilization = Math.min(150, Math.round((effectiveDbRps / totalDbCapacity) * 100));

    const maxUtilization = Math.max(serverUtilization, dbUtilization);

    // Latency calculation: baseline 25ms + exponential queueing as utilization approaches/exceeds 100%
    let calculatedLatency;
    if (maxUtilization <= 50) {
      calculatedLatency = Math.round(25 + maxUtilization * 0.2);
    } else if (maxUtilization <= 80) {
      calculatedLatency = Math.round(35 + (maxUtilization - 50) * 1.5);
    } else if (maxUtilization <= 100) {
      calculatedLatency = Math.round(80 + Math.pow(maxUtilization - 80, 2) * 0.8);
    } else {
      calculatedLatency = Math.round(240 + (maxUtilization - 100) * 25);
    }

    // Error rate calculation
    let errorRate = 0;
    if (maxUtilization > 100) {
      errorRate = Math.min(95, Math.round((1 - 100 / maxUtilization) * 100));
    }

    // Availability %
    const availability = (100 - errorRate).toFixed(errorRate > 0 ? 1 : 3);

    // Handled Throughput
    const handledRps = Math.round(trafficRps * (1 - errorRate / 100));
    const droppedRps = trafficRps - handledRps;

    // System Health Status
    let healthStatus = 'healthy';
    let healthLabel = 'Optimal Performance';
    let healthColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800';

    if (maxUtilization > 100 || errorRate > 5) {
      healthStatus = 'critical';
      healthLabel = 'System Overload (Degraded)';
      healthColor = 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800';
    } else if (maxUtilization > 75) {
      healthStatus = 'warning';
      healthLabel = 'Elevated Load (Approaching Saturation)';
      healthColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800';
    }

    return {
      totalServerCapacity,
      serverUtilization,
      dbUtilization,
      maxUtilization,
      calculatedLatency,
      errorRate,
      availability,
      handledRps,
      droppedRps,
      healthStatus,
      healthLabel,
      healthColor,
      effectiveDbRps: Math.round(effectiveDbRps)
    };
  }, [trafficRps, serverNodes, dbReplicas, cachingEnabled, cacheHitRatio]);

  // Traffic Scenario Presets
  const applyPreset = (rps, nodes, replicas, cacheOn, hitRatio) => {
    setTrafficRps(rps);
    setServerNodes(nodes);
    setDbReplicas(replicas);
    setCachingEnabled(cacheOn);
    setCacheHitRatio(hitRatio);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Quality Attributes & Scalability Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Stress test traffic loads against compute capacity, caching layers, and database replicas in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] font-mono text-purple-700 dark:text-purple-300">
            <Info className="w-3.5 h-3.5" />
            <span>Educational Simulation Estimate</span>
          </div>
        </div>

        {/* Preset Scenarios Buttons */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono uppercase font-bold text-slate-400">
            Load Scenario Presets:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset(1200, 2, 1, true, 80)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0B101D] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              🌱 Normal Day (1.2k RPS)
            </button>
            <button
              onClick={() => applyPreset(8000, 6, 2, true, 85)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0B101D] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              🔥 Lunch Hour Spike (8k RPS)
            </button>
            <button
              onClick={() => applyPreset(25000, 16, 4, true, 90)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0B101D] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              🚀 Black Friday Sale (25k RPS)
            </button>
            <button
              onClick={() => applyPreset(15000, 2, 1, false, 0)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-300 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 transition-all cursor-pointer"
            >
              💥 Severe Bottleneck / Underprovisioned
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Sliders (Left) & Real-Time Telemetry Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Tuning Sliders */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-purple-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              System Capacity & Traffic Controls
            </h3>
          </div>

          {/* Slider 1: Traffic Load (RPS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Incoming Traffic Load:
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">
                {trafficRps.toLocaleString()} requests/sec (RPS)
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="40000"
              step="200"
              value={trafficRps}
              onChange={(e) => setTrafficRps(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>200 RPS</span>
              <span>20k RPS</span>
              <span>40k RPS</span>
            </div>
          </div>

          {/* Slider 2: App Server Nodes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                App Server Fleet Size:
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                {serverNodes} Nodes ({metrics.totalServerCapacity.toLocaleString()} RPS total cap)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={serverNodes}
              onChange={(e) => setServerNodes(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1 Node (1.2k RPS)</span>
              <span>12 Nodes</span>
              <span>24 Nodes (28.8k RPS)</span>
            </div>
          </div>

          {/* Slider 3: Database Read Replicas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Database Replicas:
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                {dbReplicas} Replicas ({(dbReplicas * 3000).toLocaleString()} RPS DB cap)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={dbReplicas}
              onChange={(e) => setDbReplicas(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1 Replica</span>
              <span>4 Replicas</span>
              <span>8 Replicas (24k DB RPS)</span>
            </div>
          </div>

          {/* Slider 4: Redis Caching Layer */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Distributed Redis Caching
                </span>
              </div>
              <button
                onClick={() => setCachingEnabled(!cachingEnabled)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  cachingEnabled
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cachingEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {cachingEnabled && (
              <div className="space-y-1.5 pl-6">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Cache Hit Ratio:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{cacheHitRatio}% Hits</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="5"
                  value={cacheHitRatio}
                  onChange={(e) => setCacheHitRatio(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-[11px] font-mono text-slate-400">
                  Offloads {cacheHitRatio}% of read requests from hitting the disk database.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Real-Time Telemetry Dashboard */}
        <div className="lg:col-span-6 space-y-4">
          {/* Health Status Alert Banner */}
          <div className={`p-5 rounded-3xl border flex items-center justify-between shadow-xs ${metrics.healthColor}`}>
            <div className="flex items-center gap-3">
              {metrics.healthStatus === 'healthy' ? (
                <CheckCircle2 className="w-6 h-6 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 shrink-0" />
              )}
              <div>
                <div className="text-sm font-bold">{metrics.healthLabel}</div>
                <div className="text-xs opacity-90">
                  {metrics.healthStatus === 'healthy'
                    ? 'Capacity adequately provisions incoming traffic with minimal queueing.'
                    : metrics.healthStatus === 'warning'
                    ? 'Server/DB CPU utilization is high. Latency is beginning to climb.'
                    : 'System is dropping requests! Connection queues saturated.'}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Telemetry Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Metric 1: Average Latency */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-2 shadow-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Avg Response Time</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                  metrics.calculatedLatency < 80 ? 'text-emerald-500' : metrics.calculatedLatency < 250 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {metrics.calculatedLatency}
                </span>
                <span className="text-xs font-mono text-slate-500">ms</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {metrics.calculatedLatency < 80 ? '⚡ Ultra snappy response' : metrics.calculatedLatency < 250 ? '🐢 Noticeable lag' : '💥 Severe queue delay'}
              </p>
            </div>

            {/* Metric 2: Availability % */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-2 shadow-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase">System Availability</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                  Number(metrics.availability) > 99 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {metrics.availability}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {metrics.errorRate === 0 ? 'Zero dropped packets' : `${metrics.errorRate}% HTTP 504 Timeouts`}
              </p>
            </div>

            {/* Metric 3: Server CPU Load */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-2 shadow-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase">App Server Load</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                  metrics.serverUtilization <= 80 ? 'text-indigo-500' : 'text-rose-500'
                }`}>
                  {metrics.serverUtilization}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${metrics.serverUtilization <= 80 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(100, metrics.serverUtilization)}%` }}
                />
              </div>
            </div>

            {/* Metric 4: Effective DB Load */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-2 shadow-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Database Disk Load</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                  metrics.dbUtilization <= 80 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {metrics.dbUtilization}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${metrics.dbUtilization <= 80 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(100, metrics.dbUtilization)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Architectural Tuning Recommendations */}
          <div className="p-5 rounded-3xl bg-linear-to-br from-white via-purple-50/20 to-indigo-50/20 dark:from-[#111827] dark:via-[#111827] dark:to-purple-950/20 border border-slate-200 dark:border-[#1E2638] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Diagnostic:</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {metrics.healthStatus === 'healthy' && (
                <span>System operates comfortably within SLA limits. Read cache absorbs most DB pressure and server nodes are balanced at healthy utilization.</span>
              )}
              {metrics.healthStatus === 'warning' && (
                <span>High utilization detected. If traffic spikes further, response time will degrade exponentially. Consider enabling horizontal auto-scaling on the server cluster.</span>
              )}
              {metrics.healthStatus === 'critical' && (
                <span>
                  Critical bottleneck! {metrics.serverUtilization > 100 ? 'Server CPU is pegged above 100% capacity. Add more server nodes immediately. ' : ''}
                  {metrics.dbUtilization > 100 ? 'Database disk I/O is saturated. Enable Redis caching or add database read replicas.' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
          <div>
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
              Step 5: Quality Attributes Analysis Completed
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              Ready to take the checkpoint knowledge quiz?
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
        >
          <span>Proceed to Quiz & Review</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

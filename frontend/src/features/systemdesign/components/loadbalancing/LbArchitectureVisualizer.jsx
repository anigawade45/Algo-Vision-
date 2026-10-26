import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GitFork,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Server,
  Database,
  Laptop,
  CheckCircle2,
  ArrowRight,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Power
} from 'lucide-react';
import { INITIAL_SERVERS } from '../../data/loadBalancingData';

export function LbArchitectureVisualizer({ onCompleteStep, isCompleted }) {
  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [algorithm, setAlgorithm] = useState('round-robin'); // 'round-robin' | 'least-connections'
  const [isAutoStreaming, setIsAutoStreaming] = useState(false);
  const [streamRate, setStreamRate] = useState(2); // requests per second (1 - 6)
  const [roundRobinIndex, setRoundRobinIndex] = useState(0);
  const [redundantLbEnabled, setRedundantLbEnabled] = useState(true);
  const [primaryLbFailed, setPrimaryLbFailed] = useState(false);

  // Global simulation metrics
  const [totalRequestsSent, setTotalRequestsSent] = useState(0);
  const [totalRequestsSuccess, setTotalRequestsSuccess] = useState(0);
  const [totalRequestsDropped, setTotalRequestsDropped] = useState(0);

  // Active in-flight requests state: array of { id, step: 1|2|3|4, targetServerId, status: 'ok'|'dropped' }
  const [activeFlights, setActiveFlights] = useState([]);
  const [eventLogs, setEventLogs] = useState([]);

  const autoStreamIntervalRef = useRef(null);
  const flightIdCounter = useRef(1);

  // Helper: Get list of eligible (healthy AND enabled) servers
  const getEligibleServers = useCallback(() => {
    return servers.filter((s) => s.isHealthy && s.isEnabled);
  }, [servers]);

  // Trigger a single request through the load balancer
  const handleSendRequest = useCallback(() => {
    const reqId = `REQ-${String(flightIdCounter.current++).padStart(4, '0')}`;
    const timestamp = new Date().toLocaleTimeString();
    setTotalRequestsSent((prev) => prev + 1);

    // If Primary LB is down and Redundant LB is disabled => Total Network Drop (503)
    if (primaryLbFailed && !redundantLbEnabled) {
      setTotalRequestsDropped((prev) => prev + 1);
      setEventLogs((prev) => [
        {
          id: reqId,
          timestamp,
          algorithm,
          serverName: 'None (LB Offline)',
          status: '503 Dropped',
          statusColor: 'text-rose-500',
          duration: '0ms'
        },
        ...prev.slice(0, 19)
      ]);
      return;
    }

    const eligible = getEligibleServers();

    if (eligible.length === 0) {
      // All servers down / disabled => 503 Service Unavailable
      setTotalRequestsDropped((prev) => prev + 1);
      setEventLogs((prev) => [
        {
          id: reqId,
          timestamp,
          algorithm,
          serverName: 'None (Pool Exhausted)',
          status: '503 Unavailable',
          statusColor: 'text-rose-500',
          duration: '0ms'
        },
        ...prev.slice(0, 19)
      ]);
      return;
    }

    let targetServer;

    if (algorithm === 'round-robin') {
      // Deterministic Round Robin selection
      const nextIdx = roundRobinIndex % eligible.length;
      targetServer = eligible[nextIdx];
      setRoundRobinIndex((prev) => (prev + 1) % eligible.length);
    } else {
      // Least Connections selection (tie-breaker: lowest index)
      targetServer = [...eligible].sort((a, b) => a.activeConnections - b.activeConnections)[0];
    }

    // Check if target server has reached max capacity
    if (targetServer.activeConnections >= targetServer.capacity) {
      // Server full => 504 / rejected
      setServers((prev) =>
        prev.map((s) =>
          s.id === targetServer.id
            ? { ...s, requestsReceived: s.requestsReceived + 1, requestsFailed: s.requestsFailed + 1 }
            : s
        )
      );
      setTotalRequestsDropped((prev) => prev + 1);
      setEventLogs((prev) => [
        {
          id: reqId,
          timestamp,
          algorithm,
          serverName: targetServer.name,
          status: '504 Saturated',
          statusColor: 'text-amber-500',
          duration: '15ms'
        },
        ...prev.slice(0, 19)
      ]);
      return;
    }

    // Allocate connection to target server
    setServers((prev) =>
      prev.map((s) =>
        s.id === targetServer.id
          ? {
            ...s,
            activeConnections: s.activeConnections + 1,
            requestsReceived: s.requestsReceived + 1
          }
          : s
      )
    );

    // Add in-flight animation token
    const newFlight = {
      id: reqId,
      targetServerId: targetServer.id,
      targetServerName: targetServer.name,
      step: 1 // 1: User->LB, 2: LB->Server, 3: Server->DB, 4: Done
    };

    setActiveFlights((prev) => [...prev, newFlight]);

    // Animate stage transitions
    setTimeout(() => {
      setActiveFlights((prev) =>
        prev.map((f) => (f.id === reqId ? { ...f, step: 2 } : f))
      );
    }, 400);

    setTimeout(() => {
      setActiveFlights((prev) =>
        prev.map((f) => (f.id === reqId ? { ...f, step: 3 } : f))
      );
    }, 900);

    // Complete request and release active connection
    setTimeout(() => {
      setActiveFlights((prev) => prev.filter((f) => f.id !== reqId));
      setServers((prev) =>
        prev.map((s) =>
          s.id === targetServer.id
            ? {
              ...s,
              activeConnections: Math.max(0, s.activeConnections - 1),
              requestsCompleted: s.requestsCompleted + 1
            }
            : s
        )
      );
      setTotalRequestsSuccess((prev) => prev + 1);

      setEventLogs((prev) => [
        {
          id: reqId,
          timestamp,
          algorithm: algorithm === 'round-robin' ? 'Round Robin' : 'Least Conns',
          serverName: targetServer.name,
          status: '200 OK',
          statusColor: 'text-emerald-500',
          duration: `${Math.round(45 + Math.random() * 20)}ms`
        },
        ...prev.slice(0, 19)
      ]);
    }, 1800);
  }, [primaryLbFailed, redundantLbEnabled, algorithm, roundRobinIndex, getEligibleServers]);

  const sendRequestRef = useRef(handleSendRequest);

  useEffect(() => {
    sendRequestRef.current = handleSendRequest;
  }, [handleSendRequest]);

  // Auto-stream interval effect
  useEffect(() => {
    if (isAutoStreaming) {
      const intervalMs = Math.round(1000 / streamRate);
      autoStreamIntervalRef.current = setInterval(() => {
        if (sendRequestRef.current) {
          sendRequestRef.current();
        }
      }, intervalMs);
    } else {
      if (autoStreamIntervalRef.current) clearInterval(autoStreamIntervalRef.current);
    }

    return () => {
      if (autoStreamIntervalRef.current) clearInterval(autoStreamIntervalRef.current);
    };
  }, [isAutoStreaming, streamRate]);

  // Server management functions
  const handleToggleServerHealth = (serverId) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? {
            ...s,
            isHealthy: !s.isHealthy,
            // If failing, drop all currently active connections
            activeConnections: s.isHealthy ? 0 : s.activeConnections
          }
          : s
      )
    );
  };

  const handleToggleServerEnabled = (serverId) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId ? { ...s, isEnabled: !s.isEnabled } : s
      )
    );
  };

  const handleCapacityChange = (serverId, delta) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? { ...s, capacity: Math.max(2, Math.min(15, s.capacity + delta)) }
          : s
      )
    );
  };

  const handleAddServer = () => {
    if (servers.length >= 6) return;
    const nextNum = servers.length + 1;
    const alphabet = String.fromCharCode(64 + nextNum);
    const colors = ['purple', 'blue', 'emerald', 'amber', 'rose', 'cyan'];
    const newServer = {
      id: `server-${nextNum}`,
      name: `Server ${alphabet}`,
      ip: `10.0.1.10${nextNum}`,
      port: 8080,
      capacity: 6,
      activeConnections: 0,
      isHealthy: true,
      isEnabled: true,
      requestsReceived: 0,
      requestsCompleted: 0,
      requestsFailed: 0,
      color: colors[(nextNum - 1) % colors.length]
    };
    setServers((prev) => [...prev, newServer]);
  };

  const handleRemoveServer = (serverId) => {
    if (servers.length <= 2) return;
    setServers((prev) => prev.filter((s) => s.id !== serverId));
  };

  const handleReset = () => {
    setIsAutoStreaming(false);
    if (autoStreamIntervalRef.current) clearInterval(autoStreamIntervalRef.current);
    setServers(INITIAL_SERVERS);
    setRoundRobinIndex(0);
    setActiveFlights([]);
    setEventLogs([]);
    setTotalRequestsSent(0);
    setTotalRequestsSuccess(0);
    setTotalRequestsDropped(0);
    setPrimaryLbFailed(false);
  };

  const eligibleCount = getEligibleServers().length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Interactive Control Dashboard */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Live Load Balancer & Server Pool Simulation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Dispatch traffic, switch balancing algorithms, simulate server crashes, and test failover recovery.
              </p>
            </div>
          </div>

          {/* Algorithm Selector Switch */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <button
              onClick={() => setAlgorithm('round-robin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${algorithm === 'round-robin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Round Robin (Cyclic)
            </button>

            <button
              onClick={() => setAlgorithm('least-connections')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${algorithm === 'least-connections'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Least Connections (Dynamic)
            </button>
          </div>
        </div>

        {/* Traffic Generator & Global Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Single Request Button */}
            <button
              onClick={handleSendRequest}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer hover:scale-102"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Send 1 Request</span>
            </button>

            {/* Auto Stream Toggle */}
            <button
              onClick={() => setIsAutoStreaming(!isAutoStreaming)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${isAutoStreaming
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
            >
              {isAutoStreaming ? <Pause className="w-4 h-4" /> : <Activity className="w-4 h-4 text-blue-500" />}
              <span>{isAutoStreaming ? 'Pause Auto Stream' : 'Start Auto Stream'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Rate Slider */}
            {isAutoStreaming && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
                <span className="text-slate-500">Rate:</span>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={streamRate}
                  onChange={(e) => setStreamRate(Number(e.target.value))}
                  className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-bold text-blue-600 dark:text-blue-400">{streamRate} req/s</span>
              </div>
            )}

            {/* Add Server Button */}
            <button
              onClick={handleAddServer}
              disabled={servers.length >= 6}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Node ({servers.length}/6)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Animated Topology Flow Stage */}
      <div className="rounded-3xl bg-linear-to-b from-slate-900 via-slate-950 to-[#0B101D] border border-slate-800 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Top Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${eligibleCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'}`} />
            <div className="text-xs sm:text-sm font-bold text-slate-200 font-mono">
              Active Strategy: <strong className="text-blue-400">{algorithm === 'round-robin' ? 'Round Robin (Deterministic Cyclic)' : 'Least Connections (Dynamic Minimum)'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Healthy Nodes: <strong className="text-emerald-400">{eligibleCount}/{servers.length}</strong></span>
            <span>•</span>
            <span>In-Flight Packets: <strong className="text-blue-400">{activeFlights.length}</strong></span>
          </div>
        </div>

        {/* 4-Tier Topology: Users ➔ Load Balancer ➔ Server Fleet ➔ Database */}
        <div className="py-10 relative z-10 space-y-12">
          {/* Top Row: Users Node & Load Balancer Node */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Node 1: Simulated Client Users */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-slate-800 text-center space-y-2 relative shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/30">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Client Traffic Source</h4>
              <p className="text-[11px] font-mono text-slate-400">Concurrent User Browsers</p>
              <div className="pt-1 flex justify-center gap-3 text-[11px] font-mono">
                <span className="text-blue-400">Sent: <strong>{totalRequestsSent}</strong></span>
                <span className="text-emerald-400">200 OK: <strong>{totalRequestsSuccess}</strong></span>
                <span className="text-rose-400">503: <strong>{totalRequestsDropped}</strong></span>
              </div>
            </div>

            {/* Node 2: Reverse Proxy Load Balancer */}
            <div className={`p-6 rounded-3xl border-2 transition-all space-y-3 relative shadow-lg ${primaryLbFailed && !redundantLbEnabled
              ? 'bg-rose-950/40 border-rose-500 shadow-rose-500/20'
              : 'bg-indigo-950/60 border-indigo-500 shadow-indigo-500/20 ring-2 ring-indigo-500/20'
              }`}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                  <GitFork className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRedundantLbEnabled(!redundantLbEnabled)}
                    className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer ${redundantLbEnabled
                      ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-600'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    title="Toggle Active-Passive Standby LB"
                  >
                    {redundantLbEnabled ? 'Standby VIP: ON' : 'Standby VIP: OFF'}
                  </button>

                  <button
                    onClick={() => setPrimaryLbFailed(!primaryLbFailed)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer ${primaryLbFailed
                      ? 'bg-rose-600 text-white'
                      : 'bg-indigo-900/80 text-indigo-200 border border-indigo-700 hover:bg-rose-600 hover:text-white'
                      }`}
                  >
                    {primaryLbFailed ? 'Primary LB: CRASHED' : 'Simulate Crash'}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">Reverse Proxy Load Balancer</h4>
                <p className="text-[11px] font-mono text-indigo-300">Virtual IP (VIP): 203.0.113.10</p>
              </div>

              {primaryLbFailed && redundantLbEnabled && (
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-600 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Redundant Standby LB took over VIP in 450ms!</span>
                </div>
              )}

              {primaryLbFailed && !redundantLbEnabled && (
                <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-600 text-[11px] font-mono text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>SPOF Hit! No redundant LB available. 100% dropped traffic.</span>
                </div>
              )}
            </div>
          </div>

          {/* Middle Row: Backend Server Fleet Pool */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-400">
                Backend Application Server Pool ({servers.length} Nodes)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Max Concurrent Capacity: {servers.reduce((acc, s) => acc + s.capacity, 0)} Conns
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {servers.map((srv) => {
                const isSelectedForNext = algorithm === 'round-robin' && eligibleCount > 0 && getEligibleServers()[roundRobinIndex % eligibleCount]?.id === srv.id;
                const utilizationPct = Math.round((srv.activeConnections / srv.capacity) * 100);

                return (
                  <div
                    key={srv.id}
                    className={`p-5 rounded-3xl border-2 transition-all duration-200 space-y-3 relative ${!srv.isHealthy
                      ? 'bg-rose-950/30 border-rose-500 opacity-75'
                      : !srv.isEnabled
                        ? 'bg-slate-900/50 border-slate-700 opacity-60'
                        : isSelectedForNext
                          ? 'bg-blue-950/60 border-blue-400 ring-2 ring-blue-500/30 shadow-lg'
                          : 'bg-slate-900/80 border-slate-800'
                      }`}
                  >
                    {/* Top Row: Server Name & Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className={`w-5 h-5 ${srv.isHealthy && srv.isEnabled ? 'text-blue-400' : 'text-slate-500'}`} />
                        <div>
                          <h5 className="text-xs font-bold text-white">{srv.name}</h5>
                          <span className="text-[10px] font-mono text-slate-400">{srv.ip}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Maintenance Enable / Disable */}
                        <button
                          onClick={() => handleToggleServerEnabled(srv.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${srv.isEnabled
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-amber-600 text-white'
                            }`}
                          title={srv.isEnabled ? 'Disable (Maintenance)' : 'Enable Node'}
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>

                        {/* Fail / Recover Button */}
                        <button
                          onClick={() => handleToggleServerHealth(srv.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${srv.isHealthy
                            ? 'bg-slate-800 text-rose-400 hover:bg-rose-950'
                            : 'bg-rose-600 text-white'
                            }`}
                          title={srv.isHealthy ? 'Simulate Crash' : 'Recover Node'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove server button */}
                        {servers.length > 2 && (
                          <button
                            onClick={() => handleRemoveServer(srv.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Remove Node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Status Pill & Next-in-line indicator */}
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className={`px-2 py-0.5 rounded-full border ${!srv.isHealthy
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : !srv.isEnabled
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}>
                        {!srv.isHealthy ? 'FAIL (Unhealthy)' : !srv.isEnabled ? 'DISABLED (Maint.)' : 'HEALTHY (Active)'}
                      </span>

                      {isSelectedForNext && (
                        <span className="text-blue-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                          Next Target
                        </span>
                      )}
                    </div>

                    {/* Active Connections & Capacity Slider */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Load:</span>
                        <span className="font-bold text-white">
                          {srv.activeConnections} / {srv.capacity} Conns ({utilizationPct}%)
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${utilizationPct >= 100
                            ? 'bg-rose-500'
                            : utilizationPct > 70
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                            }`}
                          style={{ width: `${Math.min(100, utilizationPct)}%` }}
                        />
                      </div>

                      {/* Capacity Modifier +/- */}
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
                        <span>Capacity Config:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCapacityChange(srv.id, -1)}
                            disabled={srv.capacity <= 2}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-bold text-white px-1">{srv.capacity}</span>
                          <button
                            onClick={() => handleCapacityChange(srv.id, 1)}
                            disabled={srv.capacity >= 15}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Server Request Counters */}
                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-slate-400">
                      <div>
                        <div>Recv</div>
                        <div className="font-bold text-slate-200">{srv.requestsReceived}</div>
                      </div>
                      <div>
                        <div>Done</div>
                        <div className="font-bold text-emerald-400">{srv.requestsCompleted}</div>
                      </div>
                      <div>
                        <div>Failed</div>
                        <div className="font-bold text-rose-400">{srv.requestsFailed}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Shared Persistent Database */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-slate-800 text-center space-y-2 max-w-md mx-auto shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-600/30">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">Shared Relational Database Cluster</h4>
            <p className="text-[10px] font-mono text-amber-300">PostgreSQL Primary-Replica Pool (Port 5432)</p>
          </div>
        </div>
      </div>

      {/* 3. Live Protocol Request Log Table */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Live Routed Request Event Log</span>
            <span className="text-xs font-mono text-slate-400 font-normal">(Last 20 transactions)</span>
          </h3>

          <span className="text-xs font-mono text-slate-400">
            Total Requests: <strong>{totalRequestsSent}</strong>
          </span>
        </div>

        {eventLogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 font-mono">
            No requests dispatched yet. Click "Send 1 Request" or "Start Auto Stream" to generate live traffic.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="pb-2">Request ID</th>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Algorithm</th>
                  <th className="pb-2">Assigned Node</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {eventLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="py-2 text-slate-900 dark:text-slate-100 font-bold">{log.id}</td>
                    <td className="py-2 text-slate-500">{log.timestamp}</td>
                    <td className="py-2 text-blue-600 dark:text-blue-400">{log.algorithm}</td>
                    <td className="py-2 text-slate-700 dark:text-slate-300 font-semibold">{log.serverName}</td>
                    <td className={`py-2 font-bold ${log.statusColor}`}>{log.status}</td>
                    <td className="py-2 text-right text-slate-500">{log.duration}</td>
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

export default LbArchitectureVisualizer;

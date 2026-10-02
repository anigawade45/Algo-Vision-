import { useState, useRef } from 'react';
import {
  Database,
  GitBranch,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Send,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';

export function ReplicationSimulator({ onCompleteStep, isCompleted }) {
  // Primary State
  const [primaryVersion, setPrimaryVersion] = useState(1);
  const [primaryData, setPrimaryData] = useState({
    user_id: 101,
    name: 'Alice Cooper',
    balance: 500,
    plan: 'Pro Tier',
  });

  // Replicas State
  const [replicas, setReplicas] = useState([
    {
      id: 'rep_1',
      name: 'Replica 1 (US-East)',
      region: 'us-east',
      version: 1,
      status: 'healthy', // healthy, laggy, offline
      readsHandled: 0,
      lagMs: 0,
      data: { user_id: 101, name: 'Alice Cooper', balance: 500, plan: 'Pro Tier' },
    },
    {
      id: 'rep_2',
      name: 'Replica 2 (EU-West)',
      region: 'eu-west',
      version: 1,
      status: 'healthy',
      readsHandled: 0,
      lagMs: 0,
      data: { user_id: 101, name: 'Alice Cooper', balance: 500, plan: 'Pro Tier' },
    },
    {
      id: 'rep_3',
      name: 'Replica 3 (APAC-Tokyo)',
      region: 'apac',
      version: 1,
      status: 'healthy',
      readsHandled: 0,
      lagMs: 0,
      data: { user_id: 101, name: 'Alice Cooper', balance: 500, plan: 'Pro Tier' },
    },
  ]);

  // Replication Lag & Consistency Mode
  const [lagSetting, setLagSetting] = useState('medium'); // sync, low, medium, high
  const [routingStrategy, setRoutingStrategy] = useState('round-robin'); // round-robin, primary-only, lowest-lag
  const [lastReadResult, setLastReadResult] = useState(null);
  const [logs, setLogs] = useState([
    { id: 1, type: 'system', text: 'Cluster initialized. Primary Leader active. 3 Read Replicas attached.', time: '00:00:01' },
  ]);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [metrics, setMetrics] = useState({
    totalWrites: 0,
    totalReads: 0,
    staleReads: 0,
  });

  const nextReplicaIndexRef = useRef(0);

  const addLog = (type, text) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [{ id: Date.now() + Math.random(), type, text, time: timeStr }, ...prev.slice(0, 19)]);
  };

  // Lag time based on preset
  const getLagDurationMs = () => {
    switch (lagSetting) {
      case 'sync': return 0;
      case 'low': return 400 + Math.random() * 300;
      case 'medium': return 1200 + Math.random() * 800;
      case 'high': return 3500 + Math.random() * 1500;
      default: return 1000;
    }
  };

  // Perform a Write to Primary Leader
  const handleWriteRequest = (amountToAdd = 100) => {
    const newVersion = primaryVersion + 1;
    const newBalance = primaryData.balance + amountToAdd;
    const updatedRecord = { ...primaryData, balance: newBalance };

    setPrimaryVersion(newVersion);
    setPrimaryData(updatedRecord);
    setMetrics((prev) => ({ ...prev, totalWrites: prev.totalWrites + 1 }));

    addLog(
      'write',
      `[PRIMARY WRITE] Committed txn v${newVersion}: balance updated to $${newBalance}. Streaming Write-Ahead-Log (WAL) to replicas...`
    );

    // Propagate to healthy replicas
    replicas.forEach((rep) => {
      if (rep.status === 'offline') {
        addLog('error', `WAL stream skipped for ${rep.name} (NODE OFFLINE)`);
        return;
      }

      const lagDuration = getLagDurationMs();

      if (lagDuration === 0) {
        // Synchronous Replication
        setReplicas((prev) =>
          prev.map((r) => (r.id === rep.id ? { ...r, version: newVersion, data: updatedRecord, lagMs: 0 } : r))
        );
      } else {
        // Asynchronous Replication with Lag
        setPendingQueue((prev) => [...prev, { replicaId: rep.id, targetVersion: newVersion }]);
        setReplicas((prev) =>
          prev.map((r) => (r.id === rep.id ? { ...r, lagMs: Math.round(lagDuration) } : r))
        );

        setTimeout(() => {
          setReplicas((prev) =>
            prev.map((r) => {
              if (r.id === rep.id && r.status !== 'offline') {
                return {
                  ...r,
                  version: newVersion,
                  data: updatedRecord,
                  lagMs: 0,
                };
              }
              return r;
            })
          );
          setPendingQueue((prev) => prev.filter((p) => !(p.replicaId === rep.id && p.targetVersion === newVersion)));
          addLog('sync', `[WAL APPLIED] ${rep.name} caught up to v${newVersion} ($${newBalance}).`);
        }, lagDuration);
      }
    });
  };

  // Perform a Read Query
  const handleReadRequest = () => {
    const onlineReplicas = replicas.filter((r) => r.status !== 'offline');

    if (onlineReplicas.length === 0 && routingStrategy !== 'primary-only') {
      addLog('error', 'All read replicas are OFFLINE! Query failed or falling back to primary.');
      return;
    }

    let targetNode = null;

    if (routingStrategy === 'primary-only') {
      targetNode = {
        name: 'Primary Leader',
        version: primaryVersion,
        data: primaryData,
        isPrimary: true,
      };
    } else if (routingStrategy === 'lowest-lag') {
      targetNode = [...onlineReplicas].sort((a, b) => (a.lagMs || 0) - (b.lagMs || 0))[0];
    } else {
      // Round Robin across online replicas
      const idx = nextReplicaIndexRef.current % onlineReplicas.length;
      targetNode = onlineReplicas[idx];
      nextReplicaIndexRef.current = idx + 1;
    }

    if (!targetNode) return;

    if (!targetNode.isPrimary) {
      setReplicas((prev) =>
        prev.map((r) => (r.id === targetNode.id ? { ...r, readsHandled: r.readsHandled + 1 } : r))
      );
    }

    const readValue = targetNode.data.balance;
    const isStale = targetNode.version < primaryVersion;

    setMetrics((prev) => ({
      ...prev,
      totalReads: prev.totalReads + 1,
      staleReads: isStale ? prev.staleReads + 1 : prev.staleReads,
    }));

    const result = {
      success: true,
      nodeName: targetNode.name,
      nodeVersion: targetNode.version,
      primaryVersion: primaryVersion,
      isStale,
      balance: readValue,
      strategy: routingStrategy,
    };

    setLastReadResult(result);

    if (isStale) {
      addLog(
        'stale',
        `⚠️ [STALE READ] Client queried ${targetNode.name} and read balance $${readValue} (v${targetNode.version}) while Primary has $${primaryData.balance} (v${primaryVersion})!`
      );
    } else {
      addLog(
        'read',
        `[READ OK] Client queried ${targetNode.name} and got fresh balance $${readValue} (v${targetNode.version}).`
      );
    }
  };

  // Toggle Replica Offline/Online
  const toggleReplicaStatus = (id) => {
    setReplicas((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          const nextStatus = rep.status === 'offline' ? 'healthy' : 'offline';
          addLog(
            'system',
            `${rep.name} is now ${nextStatus === 'offline' ? 'CRASHED / OFFLINE 🔴' : 'RECOVERED & SYNCING 🟢'}`
          );
          return {
            ...rep,
            status: nextStatus,
            ...(nextStatus === 'healthy' ? { version: primaryVersion, data: primaryData, lagMs: 0 } : {}),
          };
        }
        return rep;
      })
    );
  };

  // Add Replica
  const handleAddReplica = () => {
    if (replicas.length >= 5) return;
    const newId = `rep_${Date.now().toString().slice(-4)}`;
    const newRep = {
      id: newId,
      name: `Replica ${replicas.length + 1} (${['AP-South', 'SA-East', 'EU-North'][replicas.length % 3]})`,
      region: 'cloud-node',
      version: primaryVersion,
      status: 'healthy',
      readsHandled: 0,
      lagMs: 0,
      data: { ...primaryData },
    };
    setReplicas((prev) => [...prev, newRep]);
    addLog('system', `Provisioned new follower node: ${newRep.name}. Snapshot synced to v${primaryVersion}.`);
  };

  // Remove Replica
  const handleRemoveReplica = (id) => {
    if (replicas.length <= 1) return;
    setReplicas((prev) => prev.filter((r) => r.id !== id));
    addLog('system', `Decommissioned replica ${id}.`);
  };

  // Flush all lag
  const handleCatchUpReplicas = () => {
    setReplicas((prev) =>
      prev.map((r) =>
        r.status !== 'offline'
          ? { ...r, version: primaryVersion, data: { ...primaryData }, lagMs: 0, status: 'healthy' }
          : r
      )
    );
    setPendingQueue([]);
    addLog('sync', 'Flushed all WAL replication buffers. All active replicas are 100% consistent.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Interactive Lab • Step 3 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Replication &amp; Read Replica Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Scale read throughput by routing <code className="text-slate-900 dark:text-white font-mono">SELECT</code> queries to Read Replicas while funneled writes modify the Primary leader. Observe asynchronous <strong className="text-purple-600 dark:text-purple-400 font-semibold">Replication Lag</strong> and catch real-time <strong className="text-rose-600 dark:text-rose-400 font-semibold">Stale Reads</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleWriteRequest(100)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Send Write ($+100)
            </button>
            <button
              onClick={handleReadRequest}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              Send Read Query
            </button>
            <button
              onClick={handleCatchUpReplicas}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              title="Catch up lagging replicas immediately"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Catch Up
            </button>
          </div>
        </div>
      </div>

      {/* 2. Control Panel: Replication Mode & Routing Policies */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs">
        {/* Replication Lag Mode */}
        <div className="md:col-span-6 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Replication Lag Simulation Preset:
          </label>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { id: 'sync', label: 'Synchronous', sub: '0ms (No Lag)' },
              { id: 'low', label: 'Low Lag', sub: '~600ms' },
              { id: 'medium', label: 'Normal Async', sub: '~1.5s' },
              { id: 'high', label: 'Congested', sub: '~3.5s (High Lag)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setLagSetting(p.id)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  lagSetting === p.id
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold">{p.label}</div>
                <div className="text-[10px] opacity-80 font-mono">{p.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Read Routing Strategy */}
        <div className="md:col-span-6 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Read Query Routing Policy:
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'round-robin', label: 'Round-Robin', sub: 'Distribute evenly across replicas' },
              { id: 'lowest-lag', label: 'Lowest-Lag Node', sub: 'Route to freshest replica' },
              { id: 'primary-only', label: 'Primary Only', sub: 'Strict monotonic reads' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRoutingStrategy(r.id)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  routingStrategy === r.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold">{r.label}</div>
                <div className="text-[10px] opacity-80">{r.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Live Cluster Topology View (Primary Node + Follower Replicas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Primary Leader Database Node (4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#111827] border-2 border-purple-500/40 p-6 shadow-md space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider font-mono">
            Primary Leader (Read/Write)
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Primary DB Node</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">AWS RDS PostgreSQL Master (US-East)</p>
            </div>
          </div>

          {/* Current Row State */}
          <div className="bg-slate-50 dark:bg-[#0B101D] rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
              <span>Row State (user_id: 101)</span>
              <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
                v{primaryVersion}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-slate-900 dark:text-white">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">User:</span>
                <span className="font-semibold">{primaryData.name}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Account Balance:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  ${primaryData.balance}.00
                </span>
              </div>
            </div>
          </div>

          {/* Primary Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-slate-50 dark:bg-[#0B101D] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Writes Committed</div>
              <div className="text-base font-bold text-purple-600 dark:text-purple-400 font-mono">
                {metrics.totalWrites}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-[#0B101D] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">WAL Stream Status</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {pendingQueue.length > 0 ? `Streaming (${pendingQueue.length})` : 'Idle / In-Sync'}
              </div>
            </div>
          </div>
        </div>

        {/* Read Replicas (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Read Replica Follower Cluster ({replicas.length} Nodes)
              </h3>
            </div>

            <button
              onClick={handleAddReplica}
              disabled={replicas.length >= 5}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Follower Node
            </button>
          </div>

          {/* Replica Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {replicas.map((rep) => {
              const isOffline = rep.status === 'offline';
              const isLagging = rep.version < primaryVersion && !isOffline;
              const isSynchronized = rep.version === primaryVersion && !isOffline;

              let cardBorder = 'border-slate-200 dark:border-slate-800';
              let statusBadge = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300';
              let statusText = 'IN-SYNC';

              if (isOffline) {
                cardBorder = 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20';
                statusBadge = 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300';
                statusText = 'OFFLINE / CRASHED';
              } else if (isLagging) {
                cardBorder = 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20';
                statusBadge = 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 animate-pulse';
                statusText = `LAGGING (~${rep.lagMs}ms)`;
              }

              return (
                <div
                  key={rep.id}
                  className={`rounded-2xl border p-4 transition-all shadow-xs space-y-3 bg-slate-50 dark:bg-[#0B101D] ${cardBorder}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{rep.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">{rep.region}</div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                      {statusText}
                    </span>
                  </div>

                  {/* Replica Internal State */}
                  <div className="bg-white dark:bg-[#111827] rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">Node Version:</span>
                      <span className={`font-bold ${isLagging ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                        v{rep.version} {isLagging && `(Behind by ${primaryVersion - rep.version})`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">Cached Balance:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ${rep.data.balance}.00
                      </span>
                    </div>
                  </div>

                  {/* Footer controls & metrics */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Reads: <strong className="text-slate-900 dark:text-white">{rep.readsHandled}</strong>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleReplicaStatus(rep.id)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isOffline
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
                        }`}
                        title={isOffline ? 'Recover Node' : 'Simulate Crash'}
                      >
                        {isOffline ? <Wifi className="w-3 h-3 inline mr-1" /> : <WifiOff className="w-3 h-3 inline mr-1" />}
                        {isOffline ? 'Recover' : 'Crash'}
                      </button>

                      {replicas.length > 1 && (
                        <button
                          onClick={() => handleRemoveReplica(rep.id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Remove replica"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Live Read Result Alert & Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Last Query Result Card */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Latest Read Query Result
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Routing: {routingStrategy}</span>
          </div>

          {lastReadResult ? (
            <div
              className={`rounded-2xl p-4 border space-y-2 text-xs animate-in fade-in ${
                lastReadResult.isStale
                  ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                  : 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {lastReadResult.isStale ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {lastReadResult.isStale ? 'STALE READ DETECTED!' : 'FRESH READ CONFIRMED'}
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/30 border border-current">
                  Node: {lastReadResult.nodeName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Read Balance:</span>
                  <span className="text-base font-bold">${lastReadResult.balance}.00</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Version Comparison:</span>
                  <span>Node: v{lastReadResult.nodeVersion} vs Primary: v{lastReadResult.primaryVersion}</span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed pt-1">
                {lastReadResult.isStale
                  ? `🚨 Client queried ${lastReadResult.nodeName} while replication was still lagging. The client observed an outdated balance ($${lastReadResult.balance}) instead of the Primary truth ($${primaryData.balance}).`
                  : `✅ Read query successfully retrieved fresh data ($${lastReadResult.balance}) directly from ${lastReadResult.nodeName}.`}
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              Click &quot;Send Read Query&quot; above to trace load distribution and catch replication lag.
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Reads</div>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{metrics.totalReads}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Stale Reads</div>
              <div className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">{metrics.staleReads}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Freshness Rate</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {metrics.totalReads > 0
                  ? `${Math.round(((metrics.totalReads - metrics.staleReads) / metrics.totalReads) * 100)}%`
                  : '100%'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Event Stream & Replication Binlog */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Replication Activity &amp; Event Log
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Live Stream</span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1 custom-scrollbar">
            {logs.map((log) => {
              let logColor = 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#0B101D]';
              if (log.type === 'write') logColor = 'text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20';
              else if (log.type === 'stale') logColor = 'text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20';
              else if (log.type === 'read') logColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20';
              else if (log.type === 'error') logColor = 'text-rose-700 dark:text-rose-300 bg-rose-50/50 dark:bg-rose-950/20';

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

      {/* 5. Critical Architecture Insights */}
      <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-2 text-slate-900 dark:text-white">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4" />
          The Fundamental Rule: Replicas Scale READS, Not WRITES
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Adding 10 read replicas gives you 10x read throughput, but <strong>zero write scaling</strong>. In fact, adding too many replicas increases network and CPU overhead on the Primary leader because it must stream WAL binlogs to all 10 nodes. To scale writes horizontally, you must partition data across independent databases using <strong>Database Sharding</strong> (explored in Step 4).
        </p>
      </div>

      {/* 6. Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
          <div>
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
              Step 3: Replication Simulator Completed
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              Ready to explore horizontal write scaling with Database Sharding?
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
        >
          <span>Proceed to Sharding Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default ReplicationSimulator;

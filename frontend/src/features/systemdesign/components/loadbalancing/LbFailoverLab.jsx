import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Server, 
  GitFork, 
  Power, 
  RotateCcw, 
  CheckCircle2
} from 'lucide-react';

export function LbFailoverLab({ onCompleteStep, isCompleted }) {
  // Server failover lab state
  const [server1Health, setServer1Health] = useState('healthy'); // 'healthy' | 'probing-fail' | 'quarantined'
  const [failedProbeCount, setFailedProbeCount] = useState(0);
  const [trafficRerouted, setTrafficRerouted] = useState(false);

  // Redundant Load Balancer lab state
  const [primaryLbState, setPrimaryLbState] = useState('active'); // 'active' | 'crashed'
  const [standbyLbState, setStandbyLbState] = useState('standby'); // 'standby' | 'promoted-active'
  const [vipOwner, setVipOwner] = useState('Primary LB (Node 1)');
  const [failoverLatencyMs, setFailoverLatencyMs] = useState(null);

  // Health check heartbeat probe effect
  useEffect(() => {
    const probeInterval = setInterval(() => {
      if (server1Health === 'probing-fail') {
        setFailedProbeCount((prev) => {
          if (prev >= 2) {
            setServer1Health('quarantined');
            setTrafficRerouted(true);
            return 3;
          }
          return prev + 1;
        });
      }
    }, 1200);

    return () => clearInterval(probeInterval);
  }, [server1Health]);

  const handleCrashServer1 = () => {
    setServer1Health('probing-fail');
    setFailedProbeCount(1);
    setTrafficRerouted(false);
  };

  const handleRecoverServer1 = () => {
    setServer1Health('healthy');
    setFailedProbeCount(0);
    setTrafficRerouted(false);
  };

  const handleCrashPrimaryLb = () => {
    setPrimaryLbState('crashed');
    // Simulate Keepalived VRRP advertisement loss detection in 450ms
    setTimeout(() => {
      setStandbyLbState('promoted-active');
      setVipOwner('Standby LB (Node 2 - Promoted)');
      setFailoverLatencyMs(450);
    }, 450);
  };

  const handleRecoverPrimaryLb = () => {
    setPrimaryLbState('active');
    setStandbyLbState('standby');
    setVipOwner('Primary LB (Node 1)');
    setFailoverLatencyMs(null);
  };

  const handleResetLab = () => {
    handleRecoverServer1();
    handleRecoverPrimaryLb();
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Health Checks, Quarantine &amp; Failover Redundancy Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Interactive playground to test active heartbeat probes, node quarantine thresholds, and VRRP load balancer failover.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetLab}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Failover Lab</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          High availability requires multi-layered defense. At the <strong>server tier</strong>, periodic health probes isolate failing nodes before users notice errors. At the <strong>load balancer tier</strong>, redundant pairs share a Virtual IP (VIP) to prevent the load balancer itself from becoming a catastrophic Single Point of Failure.
        </p>
      </div>

      {/* 2. Experiment A: Backend Health Check & Automatic Quarantine */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
              Experiment A
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Backend Server Heartbeat &amp; Active Health Probing
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {server1Health === 'healthy' ? (
              <button
                onClick={handleCrashServer1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Simulate Server A Crash</span>
              </button>
            ) : (
              <button
                onClick={handleRecoverServer1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recover &amp; Restart Server A</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Servers Visual Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Server A (Subject of failure) */}
          <div className={`p-5 rounded-3xl border-2 transition-all space-y-3 ${
            server1Health === 'quarantined'
              ? 'bg-rose-950/30 border-rose-500 shadow-lg'
              : server1Health === 'probing-fail'
              ? 'bg-amber-950/30 border-amber-500 animate-pulse'
              : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className={`w-4 h-4 ${server1Health === 'healthy' ? 'text-blue-500' : 'text-rose-500'}`} />
                <span>Server A (Target Node)</span>
              </span>

              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                server1Health === 'quarantined'
                  ? 'bg-rose-900/50 text-rose-300 border-rose-700'
                  : server1Health === 'probing-fail'
                  ? 'bg-amber-900/50 text-amber-300 border-amber-700'
                  : 'bg-emerald-900/50 text-emerald-300 border-emerald-700'
              }`}>
                {server1Health === 'quarantined' ? 'QUARANTINED' : server1Health === 'probing-fail' ? 'PROBING FAILURES' : 'HEALTHY'}
              </span>
            </div>

            {/* Health check status indicator */}
            <div className="p-3 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Probe (`GET /healthz`):</span>
                <span className={`font-bold ${server1Health === 'healthy' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {server1Health === 'healthy' ? '200 OK' : '504 Timeout'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Failed Probes:</span>
                <span className="font-bold text-slate-900 dark:text-white">{failedProbeCount} / 3 threshold</span>
              </div>
            </div>

            {/* Routing state */}
            <div className="text-[11px] font-mono">
              {server1Health === 'healthy' && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✔ Active in Load Balancer Pool</span>
              )}
              {server1Health === 'probing-fail' && (
                <span className="text-amber-500 font-bold">⚠ Suspect flapping; testing probe 2 &amp; 3...</span>
              )}
              {server1Health === 'quarantined' && (
                <span className="text-rose-400 font-bold">⛔ REMOVED FROM POOL — 0 new traffic routed</span>
              )}
            </div>
          </div>

          {/* Server B (Healthy failover target) */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-500" />
                <span>Server B (Healthy)</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                HEALTHY
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Traffic Share:</span>
                <span className="font-bold text-emerald-400">{trafficRerouted ? '50% (+17% surge)' : '33.3%'}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Absorbing traffic seamlessly with sub-100ms response times.
            </p>
          </div>

          {/* Server C (Healthy failover target) */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-500" />
                <span>Server C (Healthy)</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                HEALTHY
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Traffic Share:</span>
                <span className="font-bold text-emerald-400">{trafficRerouted ? '50% (+17% surge)' : '33.3%'}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Absorbing traffic seamlessly with sub-100ms response times.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Experiment B: Redundant Load Balancers & Virtual IP Failover */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
              Experiment B
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Active-Passive Load Balancers (VRRP &amp; Virtual IP Failover)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {primaryLbState === 'active' ? (
              <button
                onClick={handleCrashPrimaryLb}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Kill Primary Load Balancer</span>
              </button>
            ) : (
              <button
                onClick={handleRecoverPrimaryLb}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Restore Primary LB</span>
              </button>
            )}
          </div>
        </div>

        {/* Redundant LB Pair Visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Load Balancer */}
          <div className={`p-6 rounded-3xl border-2 transition-all space-y-3 ${
            primaryLbState === 'crashed'
              ? 'bg-rose-950/30 border-rose-500 opacity-60'
              : 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 shadow-md'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitFork className="w-5 h-5 text-indigo-500" />
                <span>Primary Load Balancer (Node 1)</span>
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                primaryLbState === 'active'
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-rose-950 text-rose-300 border-rose-700'
              }`}>
                {primaryLbState === 'active' ? 'ACTIVE MASTER' : 'OFFLINE (CRASHED)'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              IP: <code>192.168.1.10</code> | Virtual IP: <code>203.0.113.10</code>
            </p>

            <div className="p-3 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              {primaryLbState === 'active' ? (
                <span className="text-indigo-600 dark:text-indigo-300 font-bold">
                  ⚡ Broadcasting VRRP Heartbeats every 100ms
                </span>
              ) : (
                <span className="text-rose-400 font-bold">
                  ❌ Hardware Failure! VRRP Advertisements ceased.
                </span>
              )}
            </div>
          </div>

          {/* Standby Load Balancer */}
          <div className={`p-6 rounded-3xl border-2 transition-all space-y-3 ${
            standbyLbState === 'promoted-active'
              ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-lg ring-2 ring-emerald-500/20'
              : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 opacity-80'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Standby Load Balancer (Node 2)</span>
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                standbyLbState === 'promoted-active'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {standbyLbState === 'promoted-active' ? 'PROMOTED TO MASTER' : 'PASSIVE BACKUP'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              IP: <code>192.168.1.11</code> | Virtual IP: <code>203.0.113.10</code>
            </p>

            <div className="p-3 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              {standbyLbState === 'promoted-active' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✔ Gratuitous ARP sent! Acquired VIP in {failoverLatencyMs}ms.
                </span>
              ) : (
                <span className="text-slate-400">
                  Listening for Primary heartbeats; ready for sub-second takeover.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* VIP Summary Callout */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-slate-400">Current Virtual IP Holder:</span>
            <p className="font-bold text-purple-600 dark:text-purple-400">{vipOwner}</p>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-slate-400">Customer Impact:</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">Zero Dropped TCP Connections</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LbFailoverLab;

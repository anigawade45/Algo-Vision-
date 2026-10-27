import { useState } from 'react';
import { 
  Layers, 
  ArrowUp, 
  Grid, 
  Server, 
  DollarSign, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Info,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { SCALING_COMPARISON_DATA } from '../../data/loadBalancingData';

const VERTICAL_TIERS = [
  { level: 1, name: 'Small VM', cpu: '2 vCPU', ram: '4 GB', rpsCap: 200, cost: 20, maxOut: false },
  { level: 2, name: 'Medium Instance', cpu: '4 vCPU', ram: '16 GB', rpsCap: 600, cost: 70, maxOut: false },
  { level: 3, name: 'Large Dedicated', cpu: '16 vCPU', ram: '64 GB', rpsCap: 2400, cost: 350, maxOut: false },
  { level: 4, name: 'Enterprise Beast', cpu: '64 vCPU', ram: '256 GB', rpsCap: 8000, cost: 1800, maxOut: false },
  { level: 5, name: 'Max Motherboard Ceiling', cpu: '128 vCPU', ram: '1 TB', rpsCap: 15000, cost: 7200, maxOut: true },
];

export default function ScalingComparisonSection() {
  const [activeTab, setActiveTab] = useState('horizontal'); // 'vertical' | 'horizontal' | 'matrix'
  
  // Vertical Scaling State
  const [verticalTierIndex, setVerticalTierIndex] = useState(1);
  const [isVerticalDown, setIsVerticalDown] = useState(false);
  const [verticalUpgrading, setVerticalUpgrading] = useState(false);

  // Horizontal Scaling State
  const [horizontalNodeCount, setHorizontalNodeCount] = useState(3);
  const [deadNodeId, setDeadNodeId] = useState(null);
  const [rollingDeploying, setRollingDeploying] = useState(false);

  const currentVerticalTier = VERTICAL_TIERS[verticalTierIndex];
  const horizontalCostPerNode = 25;
  const horizontalRpsPerNode = 500;
  const totalHorizontalRps = horizontalNodeCount * horizontalRpsPerNode;
  const totalHorizontalCost = horizontalNodeCount * horizontalCostPerNode + 15; // +$15 for LB

  const handleVerticalCrash = () => {
    setIsVerticalDown(prev => !prev);
  };

  const handleVerticalUpgrade = () => {
    if (verticalTierIndex < VERTICAL_TIERS.length - 1) {
      setVerticalUpgrading(true);
      setTimeout(() => {
        setVerticalTierIndex(prev => Math.min(prev + 1, VERTICAL_TIERS.length - 1));
        setVerticalUpgrading(false);
      }, 1200);
    }
  };

  const handleHorizontalCrashNode = (nodeIdx) => {
    if (deadNodeId === nodeIdx) {
      setDeadNodeId(null);
    } else {
      setDeadNodeId(nodeIdx);
    }
  };

  const handleRollingDeploy = () => {
    setRollingDeploying(true);
    setTimeout(() => {
      setRollingDeploying(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#1E2638] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Architectural Strategy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Vertical vs. Horizontal Scaling
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Understand the architectural trade-offs, financial models, hardware ceilings, and single-point-of-failure vulnerabilities when choosing between Scaling Up and Scaling Out.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 shrink-0">
            <button
              onClick={() => setActiveTab('horizontal')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'horizontal'
                  ? 'bg-white dark:bg-[#1E2638] text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Horizontal (Scale Out)</span>
            </button>
            <button
              onClick={() => setActiveTab('vertical')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'vertical'
                  ? 'bg-white dark:bg-[#1E2638] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              <span>Vertical (Scale Up)</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-[#1E2638] text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Trade-off Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: HORIZONTAL SCALING LAB */}
      {activeTab === 'horizontal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Metrics */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Fleet Controls</span>
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  {horizontalNodeCount} Node Fleet
                </span>
              </div>

              {/* Slider for node count */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  <span>Server Nodes:</span>
                  <span className="text-purple-600 dark:text-purple-400">{horizontalNodeCount} Commodity Servers</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={horizontalNodeCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setHorizontalNodeCount(val);
                    if (deadNodeId >= val) setDeadNodeId(null);
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 Node</span>
                  <span>4 Nodes</span>
                  <span>8 Nodes</span>
                </div>
              </div>

              {/* Simulation Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chaos &amp; Deploy Test</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleHorizontalCrashNode(0)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      deadNodeId === 0
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100'
                    }`}
                  >
                    {deadNodeId === 0 ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    <span>{deadNodeId === 0 ? 'Heal Node 1' : 'Crash Node 1'}</span>
                  </button>

                  <button
                    onClick={handleRollingDeploy}
                    disabled={rollingDeploying}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50 hover:bg-purple-100 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${rollingDeploying ? 'animate-spin' : ''}`} />
                    <span>Rolling Deploy</span>
                  </button>
                </div>
              </div>

              {/* Live Cost & Throughput Scorecard */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Linear Monthly Cost:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                    ${totalHorizontalCost}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Combined Capacity:
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 font-mono text-sm">
                    {deadNodeId !== null ? (horizontalNodeCount - 1) * horizontalRpsPerNode : totalHorizontalRps} RPS
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> System Availability:
                  </span>
                  <span className={`font-bold font-mono text-sm ${horizontalNodeCount > 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {horizontalNodeCount > 1 ? '99.999% (N-1 Fault Tolerant)' : '99.0% (Single Point of Failure!)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Educational takeaway */}
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-semibold mb-0.5">Horizontal Elasticity</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Adding servers behind a load balancer scales linearly in price. When any single node crashes, the load balancer quarantines it in seconds, keeping customer uptime uninterrupted.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Architecture Display */}
          <div className="lg:col-span-8 bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-[#1E2638] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Scale-Out Architecture Topology
                </span>
                {rollingDeploying && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Rolling Update Active (0s Downtime)
                  </span>
                )}
              </div>

              {/* Topology Diagram */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
                {/* Layer 1: Client Gateway & Load Balancer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Incoming Traffic</p>
                      <p className="text-sm font-bold text-white">10,000+ Concurrent Users</p>
                    </div>
                  </div>

                  <div className="text-slate-500 font-mono text-xs hidden sm:block">➔ ➔ ➔</div>

                  <div className="flex items-center gap-3 bg-purple-950/60 border border-purple-500/40 px-4 py-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold text-xs">
                      LB
                    </div>
                    <div>
                      <p className="text-xs font-bold text-purple-300">Elastic Load Balancer</p>
                      <p className="text-[11px] text-purple-400 font-mono">Dynamic Least-Conn Route</p>
                    </div>
                  </div>
                </div>

                {/* Layer 2: Server Pool Grid */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                    <span>Commodity Backend Pool ({horizontalNodeCount} standard nodes)</span>
                    <span className="text-[11px] text-slate-500">Each node: 4 vCPU / 8 GB ($25/mo)</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Array.from({ length: horizontalNodeCount }).map((_, idx) => {
                      const isDead = deadNodeId === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleHorizontalCrashNode(idx)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                            isDead
                              ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                              : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-purple-500/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold font-mono">Node #{idx + 1}</span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isDead ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                              }`}
                            />
                          </div>

                          <div className="space-y-1 text-[11px]">
                            <div className="flex justify-between text-slate-400">
                              <span>Status:</span>
                              <span className={`font-semibold ${isDead ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {isDead ? 'ISOLATED (Crash)' : 'HEALTHY'}
                              </span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Capacity:</span>
                              <span className="font-mono text-slate-300">{isDead ? '0 RPS' : '500 RPS'}</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 text-center">
                            {isDead ? 'Click to Recover Node' : 'Click to Simulate Crash'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Insight */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Single Point of Failure (SPOF)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Linear, predictable cloud spending</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Elastic auto-scaling up &amp; down</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERTICAL SCALING LAB */}
      {activeTab === 'vertical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Sliders */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Hardware Scaler</span>
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  Level {verticalTierIndex + 1} / {VERTICAL_TIERS.length}
                </span>
              </div>

              {/* Tier Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  <span>Instance Size:</span>
                  <span className="text-blue-600 dark:text-blue-400">{currentVerticalTier.name}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={VERTICAL_TIERS.length - 1}
                  value={verticalTierIndex}
                  onChange={(e) => setVerticalTierIndex(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Small VM</span>
                  <span>Enterprise</span>
                  <span>1TB Max</span>
                </div>
              </div>

              {/* Hardware Spec Badges */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-slate-800 text-center">
                  <p className="text-[11px] text-slate-500">vCPU Sockets</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{currentVerticalTier.cpu}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-slate-800 text-center">
                  <p className="text-[11px] text-slate-500">ECC RAM</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{currentVerticalTier.ram}</p>
                </div>
              </div>

              {/* Simulation Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Single Node Vulnerabilities</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleVerticalCrash}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isVerticalDown
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isVerticalDown ? 'Reboot Server' : 'Motherboard Crash'}</span>
                  </button>

                  <button
                    onClick={handleVerticalUpgrade}
                    disabled={verticalUpgrading || verticalTierIndex >= VERTICAL_TIERS.length - 1}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${verticalUpgrading ? 'animate-spin' : ''}`} />
                    <span>Upgrade RAM</span>
                  </button>
                </div>
              </div>

              {/* Live Cost & Outage Warning */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-rose-500" /> Exponential Monthly Cost:
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-sm">
                    ${currentVerticalTier.cost}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Single Box Max RPS:
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">
                    {isVerticalDown ? '0 RPS (Down)' : `${currentVerticalTier.rpsCap} RPS`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> SPOF Risk:
                  </span>
                  <span className="font-bold text-rose-600 font-mono text-sm">
                    100% Critical Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Educational Warning */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold mb-0.5">The Hardware Ceiling &amp; SPOF</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Vertical scaling eventually hits physical limits (motherboard sockets). Furthermore, because all traffic routes to this one giant server, a single power supply failure causes a 100% total outage for all clients.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Server Diagram */}
          <div className="lg:col-span-8 bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-[#1E2638] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Scale-Up Monolith Topology (No Load Balancer)
                </span>
                {currentVerticalTier.maxOut && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    <AlertTriangle className="w-3 h-3" /> Hardware Max Reached
                  </span>
                )}
              </div>

              {/* Topology Box */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[340px] space-y-6 text-center">
                {/* Clients */}
                <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-2.5 rounded-xl border border-slate-700">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">All Client Traffic Directed To 1 IP Address</span>
                </div>

                <div className="font-mono text-slate-600 text-sm">↓ Direct TCP Connection (No LB) ↓</div>

                {/* Giant Server Box */}
                <div
                  className={`w-full max-w-md p-6 rounded-2xl border transition-all duration-300 ${
                    isVerticalDown
                      ? 'bg-rose-950/60 border-rose-600 shadow-2xl shadow-rose-900/40 text-rose-200'
                      : verticalUpgrading
                      ? 'bg-amber-950/40 border-amber-500 shadow-xl text-amber-200 animate-pulse'
                      : 'bg-slate-800/90 border-blue-500/60 shadow-xl shadow-blue-950/30 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Server className={`w-8 h-8 ${isVerticalDown ? 'text-rose-400' : 'text-blue-400'}`} />
                    <div className="text-left">
                      <h4 className="text-base font-bold">{currentVerticalTier.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">Single Mega-Host (IP: 198.51.100.24)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-4 text-xs font-mono">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
                      <p className="text-[10px] text-slate-400">CPU</p>
                      <p className="font-bold text-blue-300">{currentVerticalTier.cpu}</p>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
                      <p className="text-[10px] text-slate-400">RAM</p>
                      <p className="font-bold text-purple-300">{currentVerticalTier.ram}</p>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
                      <p className="text-[10px] text-slate-400">Status</p>
                      <p className={`font-bold ${isVerticalDown ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isVerticalDown ? 'CRASHED' : verticalUpgrading ? 'REBOOTING' : 'ONLINE'}
                      </p>
                    </div>
                  </div>

                  {isVerticalDown ? (
                    <div className="p-3 bg-rose-900/50 rounded-xl border border-rose-700/60 text-xs text-rose-200">
                      🚨 <strong>TOTAL SYSTEM OUTAGE:</strong> Because there is no redundant node or load balancer, 100% of user requests are failing with HTTP 503 / Connection Refused!
                    </div>
                  ) : verticalUpgrading ? (
                    <div className="p-3 bg-amber-900/50 rounded-xl border border-amber-700/60 text-xs text-amber-200">
                      ⏳ <strong>MAINTENANCE DOWNTIME:</strong> Server is rebooting to install upgraded hardware modules. Service is temporarily unreachable.
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">
                      Processing traffic fine — but single point of failure risk is persistent.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom comparison */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Zero distributed state complexity</span>
              </span>
              <span className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Exponential cost scaling at high tiers</span>
              </span>
              <span className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Downtime required for hardware upgrades</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETE ARCHITECTURE COMPARISON MATRIX */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vertical Box */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <ArrowUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {SCALING_COMPARISON_DATA.vertical.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {SCALING_COMPARISON_DATA.vertical.subtitle}
                </p>
              </div>
            </div>

            {/* Pros */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Advantages
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {SCALING_COMPARISON_DATA.vertical.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Drawbacks &amp; Limits
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {SCALING_COMPARISON_DATA.vertical.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/30">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Horizontal Box */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {SCALING_COMPARISON_DATA.horizontal.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {SCALING_COMPARISON_DATA.horizontal.subtitle}
                </p>
              </div>
            </div>

            {/* Pros */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Advantages
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {SCALING_COMPARISON_DATA.horizontal.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Drawbacks &amp; Limits
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {SCALING_COMPARISON_DATA.horizontal.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/30">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

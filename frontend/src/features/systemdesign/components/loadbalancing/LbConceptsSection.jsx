import { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  GitFork, 
  Globe
} from 'lucide-react';
import { LB_CONCEPTS } from '../../data/loadBalancingData';

export function LbConceptsSection({ onCompleteStep, isCompleted }) {
  const [selectedConcept, setSelectedConcept] = useState(LB_CONCEPTS[0].id);
  const [l4L7Mode, setL4L7Mode] = useState('l7'); // 'l4' | 'l7'

  const activeConceptData = LB_CONCEPTS.find((c) => c.id === selectedConcept) || LB_CONCEPTS[0];

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
              Load Balancing & Traffic Routing Foundations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore reverse proxies, OSI layer routing, health checking heartbeats, and high-availability failover.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          A <strong>Load Balancer (LB)</strong> sits between clients and backend server fleets. It acts as an authoritative reverse proxy that accepts client connections, applies routing algorithms (e.g. Round Robin, Least Connections), verifies server health, and distributes traffic smoothly across healthy nodes.
        </p>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {LB_CONCEPTS.map((concept) => {
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
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${concept.badgeColor}`}>
                    {concept.tag}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {concept.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {concept.summary}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Deep-Dive Active Concept Card */}
      <div className="rounded-3xl bg-linear-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-[#111827] dark:via-[#111827] dark:to-blue-950/20 border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${activeConceptData.badgeColor}`}>
              {activeConceptData.tag} Concept
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeConceptData.title}
            </h3>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-mono font-semibold text-blue-700 dark:text-blue-300">
            {activeConceptData.formula}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Architectural Insights */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Core Architectural Insights</span>
            </h4>

            <div className="space-y-2.5">
              {activeConceptData.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Case Study */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Production Industry Example</span>
            </h4>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs font-mono uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Real-World Production Pattern</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeConceptData.realWorldExample}
              </p>
            </div>

            {/* Quick architectural comparison badge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-slate-400">Balancing Mode:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">Reverse Proxy + SSL Offload</p>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-slate-400">Health Probe:</span>
                <p className="font-bold text-blue-600 dark:text-blue-400">TCP / HTTP 200 OK (5s)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Layer 4 vs Layer 7 Interactive Comparison Playground */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <GitFork className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Layer 4 (Transport) vs. Layer 7 (Application) Routing Comparison
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understand the trade-offs between raw packet speed and intelligent HTTP header routing.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <button
              onClick={() => setL4L7Mode('l4')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                l4L7Mode === 'l4'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Layer 4 (L4 / TCP)
            </button>
            <button
              onClick={() => setL4L7Mode('l7')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                l4L7Mode === 'l7'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Layer 7 (L7 / HTTP)
            </button>
          </div>
        </div>

        {/* L4 vs L7 Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-5 rounded-3xl border transition-all space-y-3 ${
            l4L7Mode === 'l4'
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
              : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 uppercase">
                Layer 4 (Transport / TCP/UDP)
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                Ultra Fast (~1M+ RPS)
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Routes traffic based strictly on <strong>IP addresses and TCP/UDP ports</strong> without decrypting or inspecting payload data.
            </p>

            <div className="space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
              <p>• <strong>Latency:</strong> &lt; 1ms (zero packet buffering)</p>
              <p>• <strong>CPU Overhead:</strong> Very Low</p>
              <p>• <strong>Routing Granularity:</strong> Coarse (IP:Port only)</p>
              <p>• <strong>Examples:</strong> AWS NLB, Linux IPVS, HAProxy (TCP mode)</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border transition-all space-y-3 ${
            l4L7Mode === 'l7'
              ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
              : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 uppercase">
                Layer 7 (Application / HTTP/HTTPS)
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                Content-Aware Routing
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Terminates TLS, inspects <strong>HTTP headers, URL paths, cookies, and JSON payloads</strong> to make intelligent routing decisions.
            </p>

            <div className="space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
              <p>• <strong>Path Routing:</strong> <code>/api/*</code> ➔ Cluster A, <code>/static/*</code> ➔ CDN</p>
              <p>• <strong>Capabilities:</strong> Cookie stickiness, auth verification, WAF</p>
              <p>• <strong>CPU Overhead:</strong> Moderate (TLS decryption)</p>
              <p>• <strong>Examples:</strong> NGINX, Envoy, Traefik, AWS ALB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
          <div>
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
              Step 1: Load Balancing Concepts Completed
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              Ready to interact with the live architecture flow simulator?
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
        >
          <span>Proceed to Live Architecture</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default LbConceptsSection;

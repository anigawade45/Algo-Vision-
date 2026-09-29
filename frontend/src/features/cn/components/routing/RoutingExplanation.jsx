import React from 'react';
import { BookOpen, Sparkles, Network, Zap, ShieldAlert, CheckCircle } from 'lucide-react';

export function RoutingExplanation() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-xs">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Routing Protocol Algorithms &amp; Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Link-State (OSPF) vs. Distance-Vector (RIP) vs. Path-Vector (BGP)
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          Network Layer (L3) Routing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Link-State Algorithm (OSPF) */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Link-State (OSPF / Dijkstra)
          </h4>
          <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">• Global Knowledge:</span>
              <span>Every router floods Link-State Advertisements (LSAs) and possesses the entire network map.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">• Algorithm:</span>
              <span>Dijkstra calculates Shortest Path Tree with time complexity $O(|E| + |V| \log |V|)$.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">• Fast Convergence:</span>
              <span>No routing loops; immune to count-to-infinity errors.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Distance Vector (RIP / Bellman-Ford) */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Distance-Vector (RIP / Bellman-Ford)
          </h4>
          <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Routers only know neighbor vectors. Formula:
            </p>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] text-slate-900 dark:text-white">
              D<sub>x</sub>(y) = min<sub>v</sub> &#123; c(x,v) + D<sub>v</sub>(y) &#125;
            </div>
            <p className="text-[11px] text-slate-400">
              Exchanges vectors every 30s. Metric limited to 15 hops (16 = Infinity).
            </p>
          </div>
        </div>

        {/* Card 3: Count-to-Infinity & Split Horizon */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Count-to-Infinity &amp; Solutions
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            When a link fails in Distance-Vector routing, adjacent nodes may falsely bounce routes back and forth, slowly counting up to infinity (16 hops).
          </p>
          <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            <div className="font-bold text-slate-900 dark:text-white">Mitigations:</div>
            <div>• <strong>Split Horizon:</strong> Do not advertise a route back to the neighbor it was learned from.</div>
            <div>• <strong>Poison Reverse:</strong> Advertise broken route back with metric $\infty$.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

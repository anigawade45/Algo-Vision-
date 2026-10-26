import React from 'react';
import { Activity, CheckCircle2, Circle } from 'lucide-react';

export function DijkstraStepLog({ nodes, currentStep }) {
  if (!currentStep) return null;

  const distances = currentStep.distances || {};
  const previous = currentStep.previous || {};
  const visitedSet = new Set(currentStep.visited || []);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-sm font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Link-State Tentative Distance Vector
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Step {currentStep.stepIndex + 1}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
        {nodes.map((n) => {
          const isVisited = visitedSet.has(n.id);
          const isCurrent = currentStep.currentNode === n.id;
          const dVal = distances[n.id];
          const prevVal = previous[n.id];

          return (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/20'
                  : isVisited
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-[#111827] border-slate-200/80 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1 text-[11px] font-sans font-bold">
                {isVisited ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Circle className="w-3 h-3 text-slate-400" />
                )}
                <span>Router {n.id}</span>
              </div>

              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {dVal === Infinity ? '∞' : dVal}
              </div>

              <span className="text-[10px] text-slate-400 block mt-0.5">
                prev: {prevVal || '-'}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
        {currentStep.explanation}
      </p>
    </div>
  );
}

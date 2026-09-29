import React, { useState } from 'react';
import { Layers, Database, Cpu, CheckCircle2, ArrowRight, Zap, Info, Binary } from 'lucide-react';

export default function BankerConcepts() {
  const [selectedConcept, setSelectedConcept] = useState('need');

  const concepts = [
    {
      id: 'available',
      title: '1. Available Vector',
      symbol: 'Available[j]',
      dimension: '1 × m vector',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      summary: 'Vector of size m. Indicates the number of currently free, unallocated instances of each resource type Rj.',
      formula: 'Available[j] = Total_System_Resources[j] - Σ Allocation[i][j]',
      example: 'Available = [3, 3, 2] (3 units of R0, 3 of R1, 2 of R2 currently free in system)'
    },
    {
      id: 'max',
      title: '2. Maximum Matrix',
      symbol: 'Max[i][j]',
      dimension: 'n × m matrix',
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400',
      summary: 'Matrix of size n × m. Defines the maximum resource demand declared by process Pi for resource Rj before execution.',
      formula: 'Max[i][j] = Peak instances of Rj process Pi will ever request',
      example: 'Max[P1] = [3, 2, 2] (P1 will at most need 3 of R0, 2 of R1, 2 of R2)'
    },
    {
      id: 'allocation',
      title: '3. Allocation Matrix',
      symbol: 'Allocation[i][j]',
      dimension: 'n × m matrix',
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400',
      summary: 'Matrix of size n × m. Defines the number of resource instances of Rj currently allocated and held by process Pi.',
      formula: 'Allocation[i][j] <= Max[i][j]',
      example: 'Allocation[P1] = [2, 0, 0] (P1 currently holds 2 units of R0)'
    },
    {
      id: 'need',
      title: '4. Need Matrix',
      symbol: 'Need[i][j]',
      dimension: 'n × m matrix',
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      summary: 'Matrix of size n × m. Represents the remaining resources process Pi may need to complete its task.',
      formula: 'Need[i][j] = Max[i][j] - Allocation[i][j]',
      example: 'Max[P1] = [3,2,2] - Alloc[P1] = [2,0,0] => Need[P1] = [1, 2, 2]'
    },
    {
      id: 'work',
      title: '5. Work Vector',
      symbol: 'Work[j]',
      dimension: '1 × m vector',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400',
      summary: 'Temporary working copy of Available initialized at start of safety algorithm. Grows as processes complete and release allocations.',
      formula: 'Work_new = Work_old + Allocation[i] (when Need[i] <= Work)',
      example: 'Initial Work = [3,3,2]. After P1 completes with Alloc [2,0,0], New Work = [5, 3, 2]'
    },
    {
      id: 'safe_seq',
      title: '6. Safe Sequence',
      symbol: '<P1, P3, P4, P0, P2>',
      dimension: 'Ordered list of n processes',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400',
      summary: 'An execution order of all processes where every process can satisfy its Need using currently available Work plus previously freed resources.',
      formula: 'Need[Pi] <= Work for all i in sequence',
      example: '<P1, P3, P4, P0, P2> guarantees zero deadlock risk'
    }
  ];

  const activeData = concepts.find(c => c.id === selectedConcept);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            Algorithm Data Structures
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Core Concepts & Data Structures
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Banker's Algorithm uses 4 primary matrices/vectors (<strong className="text-slate-900 dark:text-white">Available, Max, Allocation, Need</strong>) and 2 simulation tracking variables (<strong className="text-slate-900 dark:text-white">Work, Safe Sequence</strong>). Select any concept to inspect its details.
        </p>
      </div>

      {/* Grid of 6 Concept Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {concepts.map((concept) => {
          const isSelected = selectedConcept === concept.id;
          return (
            <button
              key={concept.id}
              onClick={() => setSelectedConcept(concept.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? `bg-white dark:bg-[#0B101D] ${concept.color} shadow-lg scale-102 ring-2 ring-cyan-500/40`
                  : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {concept.dimension}
                  </span>
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {concept.symbol}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {concept.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {concept.summary}
                </p>
              </div>

              <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>View Calculation</span>
                <Info className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Concept Deep-Dive Inspector */}
      {activeData && (
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-500" />
              <span>{activeData.title} Breakdown</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
              {activeData.dimension}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-slate-900 dark:text-white block font-mono font-bold">
                Formula / Definition Rule:
              </strong>
              <div className="p-2.5 rounded bg-slate-900 text-cyan-400 font-mono text-xs">
                {activeData.formula}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-slate-900 dark:text-white block font-mono font-bold">
                Concrete Numerical Example:
              </strong>
              <div className="p-2.5 rounded bg-slate-900 text-emerald-400 font-mono text-xs">
                {activeData.example}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

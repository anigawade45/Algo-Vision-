import React from 'react';
import { Layers, ArrowDown, ArrowUp, CheckCircle2, ShieldCheck, Binary, Laptop, Server, Radio } from 'lucide-react';
import { OSI_LAYERS } from '../../utils/osiSimulation';

export function LayerStackVisualizer({ currentStep, selectedLayerNum, onSelectLayer }) {
  const currentLayerNum = currentStep?.currentLayer?.layerNum;
  const isDecapsulation = currentStep?.mode === 'decapsulation';

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              OSI Protocol Data Unit (PDU) Nested Stack
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visualizing header encapsulation ({isDecapsulation ? 'Decapsulating L1 → L7' : 'Encapsulating L7 → L1'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {isDecapsulation ? <ArrowUp className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-500" />}
            {isDecapsulation ? 'Receiver Stack (Unpacking)' : 'Sender Stack (Wrapping)'}
          </span>
        </div>
      </div>

      {/* 7-Layer Interactive Stack */}
      <div className="space-y-2.5">
        {OSI_LAYERS.map((layer) => {
          const isCurrent = layer.layerNum === currentLayerNum;
          const isSelected = layer.layerNum === selectedLayerNum;
          const isEncapsulated = currentStep?.activeLayers?.some((l) => l.layerNum === layer.layerNum);

          return (
            <div
              key={layer.layerNum}
              onClick={() => onSelectLayer(layer.layerNum)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'ring-2 ring-blue-500/50 dark:ring-blue-400/40 bg-blue-50/40 dark:bg-blue-950/20'
                  : ''
              } ${
                isCurrent
                  ? 'border-blue-500 shadow-md bg-white dark:bg-[#111827]'
                  : isEncapsulated
                  ? 'bg-slate-50 dark:bg-[#111827] border-slate-200/80 dark:border-slate-800'
                  : 'bg-slate-50/40 dark:bg-[#070A12]/40 border-slate-100 dark:border-slate-800/40 opacity-50'
              }`}
            >
              {/* Left: Layer badge & Name */}
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`w-9 h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-400/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  L{layer.layerNum}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {layer.name}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 animate-pulse">
                        Active Layer
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate">
                    {layer.description}
                  </p>
                </div>
              </div>

              {/* Right: PDU Name & Protocol Tags */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <div className="text-right hidden md:block">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    PDU Unit
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {layer.pdu}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {layer.protocols.slice(0, 3).map((proto) => (
                    <span
                      key={proto}
                      className="text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {proto}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { FileText } from 'lucide-react';
import { OSI_LAYERS } from '../../utils/osiSimulation';

export function PduInspector({ selectedLayerNum }) {
  const layer = OSI_LAYERS.find((l) => l.layerNum === selectedLayerNum) || OSI_LAYERS[0];

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-sm font-sans space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {layer.name} ({layer.shortName}) Header Inspector
          </h3>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          PDU: {layer.pdu}
        </span>
      </div>

      <div className="space-y-4">
        {/* Header Name & Description */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block mb-0.5">
            Appended Protocol Header
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {layer.headerName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {layer.description}
          </p>
        </div>

        {/* Header Field Key-Values */}
        <div className="space-y-2 font-mono text-xs">
          <span className="text-[10.5px] font-sans font-semibold text-slate-400 block">
            Protocol Field Mapping:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(layer.addedFields).map(([key, val]) => (
              <div
                key={key}
                className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
              >
                <span className="text-[10px] text-slate-400 font-sans">{key}</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs truncate mt-0.5">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Protocols Tags */}
        <div className="pt-2">
          <span className="text-[10.5px] font-sans font-semibold text-slate-400 block mb-1.5">
            Key Protocols at Layer {layer.layerNum}:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {layer.protocols.map((proto) => (
              <span
                key={proto}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/40"
              >
                {proto}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

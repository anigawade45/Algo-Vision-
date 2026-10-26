import React from 'react';
import { Binary } from 'lucide-react';

export function BinaryOctetVisualizer({ results }) {
  if (!results || results.error) return null;

  const { ipBinary, maskBinary, netBinary, networkBits } = results;

  const renderBits = (octets, colorType = 'ip') => {
    let globalBitIdx = 0;

    return (
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        {octets.map((oct, octIdx) => (
          <div
            key={octIdx}
            className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800"
          >
            {oct.split('').map((bit, bitIdx) => {
              const currentBit = globalBitIdx++;
              const isNetBit = currentBit < networkBits;

              let bitBg = isNetBit
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-amber-600 dark:text-amber-400 font-bold';

              if (colorType === 'mask') {
                bitBg = bit === '1' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400';
              } else if (colorType === 'net') {
                bitBg = 'text-emerald-600 dark:text-emerald-400 font-bold';
              }

              return (
                <span key={bitIdx} className={`w-3 text-center ${bitBg}`}>
                  {bit}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-sm">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              32-Bit Binary Bitwise AND Visualizer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hardware routing calculation: <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">IP &amp; SubnetMask = NetworkID</code>
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            {networkBits} Network Bits
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            {32 - networkBits} Host Bits
          </span>
        </div>
      </div>

      {/* Bitwise Row Stack */}
      <div className="space-y-4">
        {/* 1. Host IP */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              1. Host IP Address: <span className="font-mono text-slate-900 dark:text-white">{results.ip}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">32 bits (4 octets)</span>
          </div>
          {renderBits(ipBinary, 'ip')}
        </div>

        <div className="flex items-center gap-2 pl-4 text-xs font-mono font-bold text-slate-400">
          <span>&amp; (Bitwise Logical AND)</span>
        </div>

        {/* 2. Subnet Mask */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              2. Subnet Mask (/{networkBits}): <span className="font-mono text-slate-900 dark:text-white">{results.subnetMask}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{networkBits} consecutive 1s</span>
          </div>
          {renderBits(maskBinary, 'mask')}
        </div>

        <div className="flex items-center gap-2 pl-4 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          <span>= (Calculated Network Address)</span>
        </div>

        {/* 3. Resulting Network Address */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-300">
              3. Network ID: <span className="font-mono text-base font-extrabold">{results.networkAddress}</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">Host bits zeroed</span>
          </div>
          {renderBits(netBinary, 'net')}
        </div>
      </div>
    </div>
  );
}

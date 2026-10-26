import React from 'react';
import { Globe, Sliders } from 'lucide-react';

export function SubnetCalculator({
  ipInput,
  onChangeIp,
  cidr,
  onChangeCidr,
  results,
}) {
  const presets = [
    { label: '/8 (16.7M hosts)', cidr: 8 },
    { label: '/16 (65.5K hosts)', cidr: 16 },
    { label: '/24 (254 hosts)', cidr: 24 },
    { label: '/26 (62 hosts)', cidr: 26 },
    { label: '/28 (14 hosts)', cidr: 28 },
    { label: '/30 (2 hosts P2P)', cidr: 30 },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-6">
      {/* Top Input Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        {/* IP Input */}
        <div className="flex-1 max-w-md">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span>Target IPv4 Host Address</span>
          </label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => onChangeIp(e.target.value)}
            placeholder="192.168.1.50"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        {/* CIDR Slider & Prefix */}
        <div className="flex-1 max-w-sm">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-500" />
              <span>CIDR Subnet Prefix</span>
            </label>
            <span className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              /{cidr}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="30"
            value={cidr}
            onChange={(e) => onChangeCidr(Number(e.target.value))}
            className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Quick CIDR Presets */}
        <div className="flex flex-wrap gap-1.5 self-start lg:self-end">
          {presets.map((p) => (
            <button
              key={p.cidr}
              onClick={() => onChangeCidr(p.cidr)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                cidr === p.cidr
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              /{p.cidr}
            </button>
          ))}
        </div>
      </div>

      {/* Calculated Key Metrics Cards */}
      {results && !results.error ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Network Address */}
          <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Network Address (ID)
            </span>
            <div className="text-base sm:text-lg font-mono font-extrabold text-slate-900 dark:text-white">
              {results.networkAddress}
            </div>
            <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 block">
              Mask: {results.subnetMask}
            </span>
          </div>

          {/* Card 2: Broadcast Address */}
          <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Broadcast Address
            </span>
            <div className="text-base sm:text-lg font-mono font-extrabold text-slate-900 dark:text-white">
              {results.broadcastAddress}
            </div>
            <span className="text-[10.5px] font-mono text-amber-600 dark:text-amber-400 block">
              Wildcard: {results.wildcardMask}
            </span>
          </div>

          {/* Card 3: Usable Host IP Range */}
          <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Usable Host Range
            </span>
            <div className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">
              {results.firstUsableHost}
            </div>
            <div className="text-[10.5px] font-mono text-slate-400">
              to <span className="font-bold text-slate-900 dark:text-white">{results.lastUsableHost}</span>
            </div>
          </div>

          {/* Card 4: Usable Host Capacity */}
          <div className="p-4.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block">
              Usable Host Capacity
            </span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-900 dark:text-emerald-300">
              {results.usableHosts.toLocaleString()}
            </div>
            <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 block">
              {results.totalHosts.toLocaleString()} total ({results.networkBits} net / {results.hostBits} host bits)
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          {results?.error || 'Invalid IP address'}
        </div>
      )}

      {/* Class & Type Badges */}
      {results && !results.error && (
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold font-mono">
            {results.ipClass} (Default: {results.defaultMask})
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold font-mono">
            {results.ipType}
          </span>
        </div>
      )}
    </div>
  );
}

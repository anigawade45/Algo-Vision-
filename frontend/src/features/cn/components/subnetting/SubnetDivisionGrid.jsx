import React, { useState } from 'react';
import { Network, Grid, Split, Layers } from 'lucide-react';
import { generateSubnetDivisions } from '../../utils/subnettingLogic';

export function SubnetDivisionGrid({ results }) {
  if (!results || results.error) return null;

  const currentCidr = results.cidr;
  const [subCidr, setSubCidr] = useState(Math.min(30, currentCidr + 2));

  // Ensure subCidr is strictly greater than currentCidr
  const validSubCidr = Math.max(currentCidr + 1, Math.min(30, subCidr));

  const divisions = generateSubnetDivisions(results.networkAddress, currentCidr, validSubCidr);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center shadow-xs">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              VLSM Subnet Slicing & Allocation Table
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Divide parent network <code className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{results.networkAddress}/{currentCidr}</code> into smaller subnets
            </p>
          </div>
        </div>

        {/* Subnet Slicing Selector */}
        {currentCidr < 30 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Slice into:
            </label>
            <select
              value={validSubCidr}
              onChange={(e) => setSubCidr(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              {Array.from({ length: 30 - currentCidr }, (_, i) => currentCidr + 1 + i).map((c) => (
                <option key={c} value={c}>
                  /{c} ({Math.pow(2, c - currentCidr)} Subnets • {Math.max(0, Math.pow(2, 32 - c) - 2)} hosts each)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Subnets Table */}
      {divisions.length > 0 ? (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-[#111827] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Subnet #</th>
                <th className="py-2.5 px-3">Network Address</th>
                <th className="py-2.5 px-3">Usable Host Range</th>
                <th className="py-2.5 px-3">Broadcast</th>
                <th className="py-2.5 px-3">Usable Hosts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {divisions.map((sub) => (
                <tr key={sub.index} className="hover:bg-slate-50 dark:hover:bg-[#1C2638] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    Subnet {sub.index}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-600 dark:text-cyan-400 font-bold">
                    {sub.network}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {sub.range}
                  </td>
                  <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">
                    {sub.broadcast}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {sub.usableHosts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          Cannot further slice a /{currentCidr} network.
        </div>
      )}
    </div>
  );
}

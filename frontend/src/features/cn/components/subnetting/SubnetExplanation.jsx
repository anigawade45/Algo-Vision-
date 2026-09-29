import React from 'react';
import { BookOpen, Sparkles, Binary, CheckCircle, Calculator } from 'lucide-react';

export function SubnetExplanation() {
  const cidrTable = [
    { cidr: '/24', mask: '255.255.255.0', hosts: 254, use: 'Standard LAN' },
    { cidr: '/25', mask: '255.255.255.128', hosts: 126, use: 'Department LAN' },
    { cidr: '/26', mask: '255.255.255.192', hosts: 62, use: 'Medium Branch' },
    { cidr: '/27', mask: '255.255.255.224', hosts: 30, use: 'Small Office' },
    { cidr: '/28', mask: '255.255.255.240', hosts: 14, use: 'Server DMZ' },
    { cidr: '/30', mask: '255.255.255.252', hosts: 2, use: 'Router-to-Router P2P' },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              IPv4 Subnetting Rules &amp; CIDR Cheat Sheet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fundamental formulas for calculating valid hosts, broadcast, and VLSM masks
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          GATE &amp; CCNA Reference
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Key Formulas */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Core Mathematical Formulas
          </h4>
          <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800 font-mono text-[11px]">
              <strong>Total IP Count:</strong> 2<sup>(32 - CIDR)</sup>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800 font-mono text-[11px]">
              <strong>Usable Hosts:</strong> 2<sup>H</sup> - 2
            </div>
            <p className="text-[11px] text-slate-400">
              * -2 subtracts the Network Address (all host bits 0) and Broadcast Address (all host bits 1).
            </p>
          </div>
        </div>

        {/* Card 2: Private RFC 1918 Address Ranges */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Private RFC 1918 Ranges
          </h4>
          <div className="text-xs space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
            <div className="p-2 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
              <span className="font-bold text-blue-600 dark:text-blue-400">10.0.0.0/8:</span> 10.0.0.0 &rarr; 10.255.255.255
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">172.16.0.0/12:</span> 172.16.0.0 &rarr; 172.31.255.255
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">192.168.0.0/16:</span> 192.168.0.0 &rarr; 192.168.255.255
            </div>
          </div>
        </div>

        {/* Card 3: Common CIDR Quick Reference */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            CIDR Cheat Sheet
          </h4>
          <div className="overflow-x-auto text-[11px] font-mono">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                  <th className="pb-1">CIDR</th>
                  <th className="pb-1">Mask</th>
                  <th className="pb-1">Hosts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {cidrTable.map((row) => (
                  <tr key={row.cidr}>
                    <td className="py-1 font-bold text-purple-600 dark:text-purple-400">{row.cidr}</td>
                    <td className="py-1 text-slate-600 dark:text-slate-300">{row.mask}</td>
                    <td className="py-1 font-bold text-emerald-600 dark:text-emerald-400">{row.hosts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

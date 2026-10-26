import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export function OsiExplanation() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              OSI vs. TCP/IP Architecture & Device Hierarchy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reference models, device mappings, and exam/interview mnemonics
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          Core Networking Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: OSI vs TCP/IP mapping */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            OSI vs. TCP/IP Layers
          </h4>
          <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
            <div className="p-2 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
              <strong>L7, L6, L5:</strong> App, Pres, Session &rarr; <span className="text-blue-600 dark:text-blue-400 font-semibold">TCP/IP Application Layer</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
              <strong>L4 Transport:</strong> Segment &rarr; <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Transport (TCP/UDP)</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
              <strong>L3 Network:</strong> Packet &rarr; <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Internet (IPv4/IPv6)</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
              <strong>L2, L1:</strong> Data Link & Physical &rarr; <span className="text-amber-600 dark:text-amber-400 font-semibold">Network Interface / Link</span>
            </div>
          </div>
        </div>

        {/* Card 2: Network Devices by Layer */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Hardware Device Mapping
          </h4>
          <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">Layer 1 (Physical):</span>
              <span>Hubs, Repeaters, Cables, Transceivers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">Layer 2 (Data Link):</span>
              <span>Layer 2 Switches, Bridges, NICs, Wireless APs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">Layer 3 (Network):</span>
              <span>Routers, Layer 3 Multilayer Switches.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">Layer 4-7:</span>
              <span>Firewalls, Load Balancers, Proxies, End Hosts.</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Memory Aid Mnemonic */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Classic Memory Aids
          </h4>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-800/40">
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">Top to Bottom (L7 → L1):</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                <strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/40">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">Bottom to Top (L1 → L7):</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                <strong>P</strong>lease <strong>D</strong>o <strong>N</strong>ot <strong>T</strong>hrow <strong>S</strong>ausage <strong>P</strong>izza <strong>A</strong>way
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

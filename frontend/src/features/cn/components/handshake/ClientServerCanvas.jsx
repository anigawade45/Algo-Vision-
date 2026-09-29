import React from 'react';
import { Laptop, Server, ArrowRight, ArrowLeft, Wifi, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ClientServerCanvas({ currentStep, activePacket, clientState, serverState, wireStatus }) {
  const isClientSource = activePacket?.from === 'client';
  const isDropped = activePacket?.isDropped;

  const getStateColor = (state) => {
    if (!state) return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    if (state.includes('ESTABLISHED')) return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-emerald-500/10';
    if (state.includes('SYN')) return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700';
    if (state.includes('LISTEN')) return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    if (state.includes('FIN') || state.includes('WAIT')) return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
  };

  const getPacketBadgeColor = (type) => {
    switch (type) {
      case 'SYN':
        return 'bg-amber-500 text-white shadow-amber-500/25';
      case 'SYN-ACK':
        return 'bg-cyan-500 text-white shadow-cyan-500/25';
      case 'ACK':
        return 'bg-emerald-600 text-white shadow-emerald-500/25';
      case 'DATA':
        return 'bg-indigo-600 text-white shadow-indigo-500/25';
      case 'FIN':
        return 'bg-rose-500 text-white shadow-rose-500/25';
      default:
        return 'bg-blue-600 text-white shadow-blue-500/25';
    }
  };

  return (
    <div className="relative rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm overflow-hidden font-sans">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Top Topology Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Network Topology: Point-to-Point Full Duplex
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            MTU: 1500 Bytes • TCP MSS: 1460
          </span>
        </div>
      </div>

      {/* Main Canvas Diagram: Client <---> Transit Wire <---> Server */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10 min-h-[260px]">
        {/* CLIENT NODE (Left - 3 cols) */}
        <div className="lg:col-span-3 flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 shadow-xs relative group">
          {/* Node Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3 group-hover:scale-105 transition-transform">
            <Laptop className="w-8 h-8" />
          </div>

          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            Client Host (A)
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            192.168.1.105 : 49152
          </span>

          {/* Current Client FSM State */}
          <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 w-full">
            <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 block mb-1">
              TCP State
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all ${getStateColor(clientState)}`}>
              {clientState || 'CLOSED'}
            </span>
          </div>
        </div>

        {/* TRANSIT WIRE & MOVING PACKET (Center - 6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-8 px-2">
          {/* Wire Container */}
          <div className="w-full relative flex items-center justify-center h-24">
            {/* The physical wire line */}
            <div className="absolute left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  wireStatus === 'established'
                    ? 'bg-emerald-500 dark:bg-emerald-400'
                    : wireStatus === 'transmitting'
                    ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            </div>

            {/* In-Transit Active Packet */}
            {activePacket ? (
              <div
                className={`relative z-20 flex flex-col items-center transition-all duration-700 transform ${
                  isDropped ? 'animate-bounce' : 'animate-in fade-in zoom-in-90'
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-white/20 transition-all ${
                    isDropped
                      ? 'bg-rose-600 text-white ring-4 ring-rose-500/30'
                      : getPacketBadgeColor(activePacket.type)
                  }`}
                >
                  {isClientSource ? (
                    <ArrowRight className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowLeft className="w-4 h-4 text-white" />
                  )}

                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm tracking-wide">
                        {activePacket.type}
                      </span>
                      {isDropped && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-white text-rose-700 font-bold">
                          Lost in transit
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono opacity-90">
                      Seq={activePacket.seq} {activePacket.ack > 0 ? `• Ack=${activePacket.ack}` : ''}
                    </span>
                  </div>
                </div>

                {/* Packet payload chip if present */}
                {activePacket.payload && (
                  <div className="mt-2 px-3 py-1 rounded-lg bg-slate-900/90 text-emerald-300 font-mono text-[11px] border border-slate-700 shadow-md">
                    Payload: {activePacket.payload}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 text-xs font-mono border border-slate-200 dark:border-slate-700">
                <span>Idle Circuit • Ready</span>
              </div>
            )}
          </div>

          {/* Direction Indicator */}
          {activePacket && (
            <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>{isClientSource ? 'Client → Server' : 'Server → Client'}</span>
              <span>•</span>
              <span>Len: {activePacket.length} bytes</span>
              <span>•</span>
              <span>Win: {activePacket.windowSize || 65535}</span>
            </div>
          )}
        </div>

        {/* SERVER NODE (Right - 3 cols) */}
        <div className="lg:col-span-3 flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 shadow-xs relative group">
          {/* Node Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3 group-hover:scale-105 transition-transform">
            <Server className="w-8 h-8" />
          </div>

          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            Web Server (B)
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            93.184.216.34 : 80
          </span>

          {/* Current Server FSM State */}
          <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 w-full">
            <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 block mb-1">
              TCP State
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all ${getStateColor(serverState)}`}>
              {serverState || 'LISTEN'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Step Summary Banner at bottom */}
      <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[11px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400">
            Step {currentStep?.stepIndex + 1} Action
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {currentStep?.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep?.description}
          </p>
        </div>

        {wireStatus === 'established' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono shrink-0 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>ESTABLISHED</span>
          </div>
        )}
      </div>
    </div>
  );
}

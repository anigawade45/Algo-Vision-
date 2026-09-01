import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ZapOff } from 'lucide-react';

export default function CPU({ cpu, currentTime }) {
  const isIdle = !cpu;

  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-3 min-h-[140px] flex flex-col justify-between relative overflow-hidden">
      {/* Header with Clock */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-2 z-10">
        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          CPU Status
        </span>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
          <span className="text-slate-400">TIME:</span>
          <span className="text-blue-500 font-mono">{currentTime}</span>
        </div>
      </div>

      {/* Main CPU Visualization */}
      <div className="flex-1 flex items-center justify-center py-2 z-10">
        <AnimatePresence mode="wait">
          {isIdle ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center text-center space-y-1"
            >
              <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 animate-pulse">
                <ZapOff className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 font-mono block">
                  CPU IDLE
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Waiting for processes...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={cpu.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="w-full flex items-center gap-4 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl relative"
            >
              {/* Spinning / Pulsing Core */}
              <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-500 flex flex-col items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <span className="font-mono font-black text-sm leading-none">{cpu.id}</span>
                <Activity className="w-3.5 h-3.5 animate-pulse mt-0.5" />
              </div>

              {/* Process Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-white font-mono uppercase tracking-wide">
                    RUNNING
                  </span>
                  <span className="text-[9px] font-mono font-bold text-blue-500">
                    AT: {cpu.arrivalTime} &bull; BT: {cpu.burstTime}
                  </span>
                </div>

                {/* Simulated Progress bar */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-[#070A12] border border-slate-200/50 dark:border-[#1E2638] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Glow Ring */}
      {!isIdle && (
        <div className="absolute inset-0 border border-blue-500/30 rounded-2xl pointer-events-none animate-pulse" />
      )}
    </div>
  );
}

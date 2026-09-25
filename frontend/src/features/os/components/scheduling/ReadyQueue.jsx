import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Inbox } from 'lucide-react';

export default function ReadyQueue({ queue }) {
  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-3 min-h-[140px] flex flex-col justify-between">
      <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        Ready Queue
      </span>

      <div className="flex-1 flex items-center justify-start overflow-x-auto py-2">
        <AnimatePresence mode="popLayout">
          {queue.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center py-2 text-slate-400 dark:text-slate-500 text-xs font-mono gap-1"
            >
              <Inbox className="w-5 h-5 text-slate-300 dark:text-slate-700" />
              <span>Queue is empty</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1">
              {queue.map((proc, index) => (
                <React.Fragment key={proc.id}>
                  {/* Process Card */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="w-12 h-14 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 flex flex-col items-center justify-center font-mono font-bold text-xs select-none shrink-0"
                  >
                    <span className="text-blue-600 dark:text-[#3B82F6]">{proc.id}</span>
                    <span className="text-[8px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">
                      BT: {proc.burstTime}
                    </span>
                  </motion.div>

                  {/* Connecting Arrow */}
                  {index < queue.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 0.4, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-slate-400 dark:text-slate-600 shrink-0 mx-0.5"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

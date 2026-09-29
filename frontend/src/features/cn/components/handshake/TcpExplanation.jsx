import React from 'react';
import { BookOpen, Sparkles, AlertCircle, HelpCircle, CheckCircle, Zap } from 'lucide-react';

export function TcpExplanation() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              TCP Protocol Architecture & Deep Dive
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Theoretical foundation, sequence math, and GATE/Interview concepts
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5" />
          Transport Layer (L4)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 3-Way Handshake Steps */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Connection Steps</span>
          </div>

          <ul className="text-xs space-y-2.5 text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">1. SYN:</span>
              <span>Client generates Initial Seq Number (ISN_C) and requests connection.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">2. SYN-ACK:</span>
              <span>Server acknowledges with <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">Ack = ISN_C + 1</code> and its own ISN_S.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-900 dark:text-white shrink-0">3. ACK:</span>
              <span>Client confirms receipt with <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">Ack = ISN_S + 1</code>. Circuit is live.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Sequence Number Mathematics */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Sequence Number Math</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              TCP sequence numbers track <strong>bytes</strong>, not packets:
            </p>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 space-y-1">
              <div>Next_Ack = Received_Seq + Payload_Bytes</div>
              <div className="text-slate-400 text-[10px]">* If SYN or FIN is set, add 1 phantom byte</div>
            </div>
            <p className="text-[11px] text-slate-500">
              SYN and FIN consume 1 logical sequence number space to guarantee reliable acknowledgment.
            </p>
          </div>
        </div>

        {/* Card 3: Why 3-Way Instead of 2-Way? */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Why 3-Way & Not 2-Way?</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            In an unreliable IP network, old duplicate SYN segments can arrive late at the Server. With only a 2-way handshake, the Server would immediately allocate resources and open a half-dead connection without knowing if the Client is actually alive.
          </p>

          <p className="text-[11.5px] font-medium text-emerald-700 dark:text-emerald-400">
            The 3rd ACK verifies bidirectional liveliness before buffers and state are committed.
          </p>
        </div>
      </div>
    </div>
  );
}

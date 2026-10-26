import React from 'react';
import { Sparkles, Cpu, Globe, Layers, Compass } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { icon: Compass, label: "How to use this visualizer?", query: "How do I run the visualizer simulation on this page?" },
  { icon: Cpu, label: "Explain FCFS vs Round Robin", query: "What is the key difference between FCFS and Round Robin scheduling?" },
  { icon: Globe, label: "Explain TCP 3-Way Handshake", query: "Can you explain the TCP 3-Way Handshake step by step?" },
  { icon: Layers, label: "What is CAP Theorem?", query: "What is the CAP theorem in System Design and distributed systems?" },
  { icon: Sparkles, label: "How to use Code Lab sync?", query: "How do I sync live visualizer input into the Code Lab IDE?" }
];

export default function QuickPrompts({ onSelectPrompt }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
        <span>Suggested Topics & Help</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.query)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f172a] hover:bg-cyan-50 dark:hover:bg-cyan-950/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


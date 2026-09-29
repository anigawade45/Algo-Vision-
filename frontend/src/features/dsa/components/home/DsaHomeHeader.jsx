import React from 'react';
import { Terminal, Sparkles } from 'lucide-react';

export function DsaHomeHeader() {
  return (
    <div className="space-y-1.5 font-sans">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <Terminal className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
        <span>DSA / HOME</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
        Your DSA Learning Workspace
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-normal">
        Bring a problem you&apos;re working on, understand the reasoning behind it, and explore the algorithm through visualization.
      </p>
    </div>
  );
}

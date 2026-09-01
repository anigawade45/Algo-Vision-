import React from 'react';
import { History, Play, CheckCircle2, Clock, Trash2, ArrowRight } from 'lucide-react';

export function RecentWorkspaces({ onResumeSession }) {
  const sessions = [
    {
      id: 'session-1',
      title: 'Container With Most Water',
      pattern: 'Two Pointers',
      lastStep: 'Step 6: Dry Run Visualizer',
      progress: '100%',
      complexity: 'Time: O(N) | Space: O(1)',
      updatedAt: '10 mins ago',
      status: 'completed',
    },
    {
      id: 'session-2',
      title: 'Trapping Rain Water',
      pattern: 'Prefix Max & Suffic Max',
      lastStep: 'Step 4: Pattern Detection',
      progress: '66%',
      complexity: 'Time: O(N) | Space: O(N)',
      updatedAt: '2 hours ago',
      status: 'in_progress',
    },
    {
      id: 'session-3',
      title: 'Sliding Window Maximum',
      pattern: 'Monotonic Deque',
      lastStep: 'Step 5: Pseudocode & Code',
      progress: '80%',
      complexity: 'Time: O(N) | Space: O(K)',
      updatedAt: 'Yesterday',
      status: 'in_progress',
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Recent Problem-Solving Workspaces</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pick up right where you left off in your previous dissection sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onResumeSession && onResumeSession(session)}
            className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 rounded-xl space-y-4 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  session.status === 'completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                }`}>
                  {session.status === 'completed' ? 'Fully Analyzed' : `Stage: ${session.progress}`}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{session.updatedAt}</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {session.title}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Pattern: <strong className="text-slate-700 dark:text-slate-300">{session.pattern}</strong>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-[#05070E] p-2.5 rounded-lg border border-slate-200/80 dark:border-[#1E2638] text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <span>Last Location: </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{session.lastStep}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#182030] flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                {session.complexity}
              </span>
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

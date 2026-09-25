import React, { useState } from 'react';
import { Calendar, TrendingUp, Sparkles, Clock, Target } from 'lucide-react';
import { weeklyActivityData } from '../data/mockDashboardData';

export function WeeklyActivityChart() {
  const [hoveredDay, setHoveredDay] = useState(null);

  const maxHours = Math.max(...weeklyActivityData.map((d) => d.hours), 7.0);
  const totalHours = weeklyActivityData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);
  const totalTopics = weeklyActivityData.reduce((acc, curr) => acc + curr.topics, 0);
  const avgHours = (totalHours / 7).toFixed(1);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm font-sans space-y-6">
      {/* Header with Title and Total Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Weekly Learning Activity
            </h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Mon – Sun
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daily study distribution, visualization hours, and session consistency.
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
              {totalHours}h
            </span>
            <span className="text-[11px] text-slate-500 block">Total this week</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {avgHours}h
            </span>
            <span className="text-[11px] text-slate-500 block">Daily Average</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-6 pb-2">
        {/* Target Benchmark Line at 3.0 hrs */}
        <div
          className="absolute left-0 right-0 border-b border-dashed border-slate-300 dark:border-slate-700 pointer-events-none flex items-center justify-end"
          style={{ bottom: `${(3.0 / maxHours) * 180 + 32}px` }}
        >
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-[#111827] px-1.5 -mb-2">
            Daily Goal (3.0h)
          </span>
        </div>

        {/* Bars Container */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pt-4 px-1">
          {weeklyActivityData.map((item, idx) => {
            const heightPercent = (item.hours / maxHours) * 100;
            const isHovered = hoveredDay === idx;

            return (
              <div
                key={item.day}
                className="flex flex-col items-center gap-2 group cursor-pointer relative"
                onMouseEnter={() => setHoveredDay(idx)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-xl border border-slate-700 whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                    <div className="font-bold text-blue-300">{item.date}</div>
                    <div className="text-[11px] text-slate-200">
                      {item.hours} hrs • {item.topics} topics • {item.sessions} sessions
                    </div>
                  </div>
                )}

                {/* Top Hours Label */}
                <span
                  className={`text-[11px] font-mono font-semibold transition-colors ${
                    item.isToday
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : item.peak
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {item.hours}h
                </span>

                {/* The Bar Pillar */}
                <div className="w-full max-w-[48px] h-40 bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-1 flex items-end justify-center transition-all duration-200">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 relative overflow-hidden ${
                      item.isToday
                        ? 'bg-linear-to-t from-blue-600 to-indigo-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40'
                        : item.peak
                        ? 'bg-linear-to-t from-indigo-600 to-purple-500 shadow-xs'
                        : item.hours >= item.target
                        ? 'bg-linear-to-t from-blue-500/80 to-blue-400/80 group-hover:from-blue-600 group-hover:to-indigo-500'
                        : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Peak badge indicator inside bar */}
                    {item.peak && (
                      <div className="absolute top-1 left-0 right-0 text-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Day Name Label */}
                <div className="text-center">
                  <span
                    className={`text-xs font-semibold block ${
                      item.isToday
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                  {item.isToday && (
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">
                      Today
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Met Daily Goal (3h+)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Peak Study Day (Sat • 6.2h)
          </span>
        </div>
        <div className="font-mono text-slate-700 dark:text-slate-300">
          <strong>{totalTopics} Topics</strong> reviewed this week
        </div>
      </div>
    </div>
  );
}

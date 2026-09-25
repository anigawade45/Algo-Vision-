import React from 'react';
import { Clock, CheckCircle2, Trophy, Flame, TrendingUp, ArrowUpRight } from 'lucide-react';
import { learningStats } from '../data/mockDashboardData';

const iconMap = {
  Clock: Clock,
  CheckCircle2: CheckCircle2,
  Trophy: Trophy,
  Flame: Flame,
};

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {learningStats.map((stat) => {
        const Icon = iconMap[stat.icon] || Clock;

        return (
          <div
            key={stat.id}
            className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl ${stat.bgLight} ${stat.color} flex items-center justify-center`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.unit}
                </span>
              )}
            </div>

            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold text-[11px] px-1.5 py-0.2 rounded-md ${
                  stat.trend === 'up'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                }`}
              >
                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {stat.delta}
              </span>
              <span className="text-slate-500 dark:text-slate-400 truncate text-[11.5px]">
                {stat.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

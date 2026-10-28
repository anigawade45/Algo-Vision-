import React from 'react';
import { Clock, CheckCircle2, Code2, Flame } from 'lucide-react';

export function StatsCards({ stats }) {
  const currentStats = stats || {
    problemsSolved: 0,
    topicsCompleted: 0,
    learningStreak: 0,
    learningHours: 0,
  };

  const statItems = [
    {
      id: 'problems',
      label: 'Problems Solved',
      value: currentStats.problemsSolved ?? 0,
      unit: '',
      icon: Code2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      id: 'topics',
      label: 'Stages Completed',
      value: currentStats.topicsCompleted ?? 0,
      unit: '',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 'streak',
      label: 'Learning Streak',
      value: currentStats.learningStreak ?? 0,
      unit: 'Days',
      icon: Flame,
      color: 'text-amber-600 dark:text-amber-400',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      id: 'hours',
      label: 'Study Time',
      value: currentStats.learningHours ?? 0,
      unit: 'hrs',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {statItems.map((stat) => {
        const Icon = stat.icon;

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
          </div>
        );
      })}
    </div>
  );
}

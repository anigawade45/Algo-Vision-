import React from 'react';
import { Flame, Calendar } from 'lucide-react';
import { studentProfile } from '../data/mockDashboardData';

export function WelcomeBanner() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const firstName = studentProfile.name ? studentProfile.name.split(' ')[0] : 'Ritesh';

  return (
    <div className="relative rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs font-sans transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Side: Day Date & Greeting with Name */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{currentDateFormatted}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>{getGreeting()}, {firstName}</span>
            <span className="inline-block animate-bounce">👋</span>
          </h1>
        </div>

        {/* Right Side: Learning Streak */}
        <div className="flex items-center gap-3 self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/30 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-300/40 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-amber-800/80 dark:text-amber-400/80">Learning Streak</div>
            <div className="text-base sm:text-lg font-extrabold text-amber-900 dark:text-amber-300 font-mono">
              {studentProfile.streakDays} Days 🔥
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

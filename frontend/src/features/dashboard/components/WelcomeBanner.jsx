import React from 'react';
import { Flame, CheckCircle2, Award, Calendar } from 'lucide-react';
import { studentProfile } from '../data/mockDashboardData';

export function WelcomeBanner({ onOpenAiMentor }) {
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
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-blue-500/10 font-sans">
      {/* Subtle Background Pattern & Ambient Glow */}
      <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
      
      {/* Decorative Grid Lines */}
      <div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" 
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side: Greeting & Subtitle */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-100 mb-1">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/20">
              <Calendar className="w-3.5 h-3.5" />
              {currentDateFormatted}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/20">
              {studentProfile.role} • {studentProfile.specialization}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {studentProfile.cohortRank}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{getGreeting()}, {firstName}</span>
            <span className="animate-bounce inline-block">👋</span>
          </h1>

          <p className="text-sm sm:text-[15px] text-blue-100/90 leading-relaxed">
            Continue your Computer Science learning journey. 4 core modules and AI tutoring ready for your session.
          </p>
        </div>

        {/* Right Side: Quick Target Pills & AI Prompt Banner */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Daily Streak Card */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-medium text-blue-100">Learning Streak</div>
              <div className="text-base font-extrabold text-white">
                {studentProfile.streakDays} Days 🔥
              </div>
            </div>
          </div>

          {/* Daily Target Card */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-emerald-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-blue-100">Daily Target</div>
              <div className="text-base font-extrabold text-white">
                {studentProfile.dailyTarget.completed}/{studentProfile.dailyTarget.total} Completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

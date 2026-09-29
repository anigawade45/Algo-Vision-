import React from 'react';
import { Sparkles, Network, Cpu, Wifi, ArrowRight, Play, CheckCircle2, Clock } from 'lucide-react';
import { aiRecommendations } from '../data/mockDashboardData';

const iconMap = {
  Network: Network,
  Cpu: Cpu,
  Wifi: Wifi,
};

export function AiRecommendations({ onAction }) {
  const getBadgeStyle = (badgeType) => {
    switch (badgeType) {
      case 'weak':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40';
      case 'continue':
        return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/40';
      case 'next':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';
      default:
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      case 'Medium':
        return 'bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'Hard':
        return 'bg-rose-100/80 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recommended for You</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              <Sparkles className="w-3 h-3 animate-pulse" />
              AI Tailored
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personalized suggestions generated based on your learning activity and interactive simulations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiRecommendations.map((rec) => {
          const Icon = iconMap[rec.icon] || Sparkles;

          return (
            <div
              key={rec.id}
              className="rounded-3xl p-5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400/80 dark:hover:border-blue-500/40 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Module Tag & Context Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                      rec.badgeType
                    )}`}
                  >
                    {rec.badgeLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getDifficultyBadge(
                        rec.difficulty
                      )}`}
                    >
                      {rec.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {rec.time}
                    </span>
                  </div>
                </div>

                {/* Recommendation Title */}
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rec.title}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {rec.module}
                  </span>
                </div>

                {/* Reason Explanation */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#070A12] p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                  {rec.reason}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => onAction && onAction(rec)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs group/btn"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{rec.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Bot, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { quickActions } from '../data/mockDashboardData';

export function QuickActions({ onOpenAiMentor, onOpenVisualizer }) {
  const handleAction = (type) => {
    if (type === 'open-ai') {
      onOpenAiMentor && onOpenAiMentor();
    } else if (type === 'open-visualizer') {
      onOpenVisualizer && onOpenVisualizer('dsa');
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Quick Actions</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.actionType)}
            className="rounded-2xl p-4.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-500/40 text-left shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer relative overflow-hidden"
          >
            {/* Top row: Icon + Badge */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-linear-to-br ${action.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
              >
                {getIcon(action.icon)}
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                {action.badge}
              </span>
            </div>

            {/* Title & Description */}
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>{action.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

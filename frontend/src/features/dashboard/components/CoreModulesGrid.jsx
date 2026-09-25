import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Binary, Cpu, Wifi, Server, ArrowRight, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { coreModules } from '../data/mockDashboardData';

const iconMap = {
  dsa: Binary,
  os: Cpu,
  networks: Wifi,
  sysdesign: Server,
};

export function CoreModulesGrid({ onExploreModule }) {
  const navigate = useNavigate();

  const handleExplore = (moduleId) => {
    if (onExploreModule) {
      onExploreModule(moduleId);
    } else {
      navigate(`/modules/${moduleId}`);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Core Learning Modules</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800">
              4 Disciplines
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive syllabus tracks designed with AI dry runs and algorithm simulations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coreModules.map((module) => {
          const Icon = iconMap[module.id] || Binary;
          const theme = module.colorTheme;

          return (
            <div
              key={module.id}
              onClick={() => handleExplore(module.id)}
              className={`rounded-3xl bg-white dark:bg-[#111827] border ${theme.border} ${theme.hoverBorder} p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden cursor-pointer`}
            >
              {/* Background Glow */}
              <div
                className={`absolute -top-12 -right-12 w-44 h-44 rounded-full ${
                  module.id === 'dsa'
                    ? 'bg-indigo-500/5 dark:bg-indigo-500/10'
                    : module.id === 'os'
                    ? 'bg-cyan-500/5 dark:bg-cyan-500/10'
                    : module.id === 'networks'
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10'
                    : 'bg-purple-500/5 dark:bg-purple-500/10'
                } blur-2xl pointer-events-none`}
              />

              <div className="space-y-4 relative z-10">
                {/* Header: Icon + Badge + Progress */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                        {module.badgeText}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {module.name}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                      {module.progress}%
                    </span>
                    <span className="text-[11px] text-slate-400 block">Mastery</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed min-h-[38px]">
                  {module.description}
                </p>

                {/* Popular Subtopics Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {module.popularTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Progress Bar & Topics Completed */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {module.completedTopics}/{module.totalTopics} Topics Completed
                    </span>
                    <span>{module.totalTopics - module.completedTopics} remaining</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${theme.progressFill} rounded-full transition-all duration-700`}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {module.tagline}
                </span>

                <Link
                  to={`/modules/${module.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${theme.button} shadow-xs hover:scale-102 active:scale-98 transition-all`}
                >
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

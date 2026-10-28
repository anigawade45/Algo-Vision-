import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Binary, Cpu, Wifi, Server, ArrowRight } from 'lucide-react';

const coreModulesList = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    description: 'Learn, practice, and visualize data structures and algorithms interactively.',
    icon: Binary,
    route: '/dsa',
    colorTheme: {
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      border: 'border-slate-200/80 dark:border-slate-800/80',
      hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
  },
  {
    id: 'os',
    name: 'Operating Systems',
    description: 'Understand operating system concepts through interactive simulations.',
    icon: Cpu,
    route: '/os',
    colorTheme: {
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      border: 'border-slate-200/80 dark:border-slate-800/80',
      hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-700',
      button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    },
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    description: 'Explore networking concepts, protocols, and visualizations.',
    icon: Wifi,
    route: '/cn',
    colorTheme: {
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      border: 'border-slate-200/80 dark:border-slate-800/80',
      hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
  },
  {
    id: 'sysdesign',
    name: 'System Design',
    description: 'Learn system design concepts through interactive architecture visualizations.',
    icon: Server,
    route: '/systemdesign',
    colorTheme: {
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      border: 'border-slate-200/80 dark:border-slate-800/80',
      hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  },
];

export function CoreModulesGrid({ onExploreModule, modules = [] }) {
  const navigate = useNavigate();

  const handleExplore = (moduleId, route) => {
    if (onExploreModule) {
      onExploreModule(moduleId);
    } else if (moduleId === 'dsa') {
      navigate('/dsa');
    } else if (moduleId === 'os') {
      navigate('/os');
    } else if (moduleId === 'networks' || moduleId === 'cn') {
      navigate('/cn');
    } else if (moduleId === 'sysdesign' || moduleId === 'systemdesign') {
      navigate('/systemdesign');
    } else {
      navigate(route);
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
            Interactive curriculum tracks designed with AI explanations and step-by-step simulations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coreModulesList.map((module) => {
          const Icon = module.icon;
          const theme = module.colorTheme;
          const modData = Array.isArray(modules) ? modules.find((m) => m.id === module.id) : null;

          return (
            <div
              key={module.id}
              onClick={() => handleExplore(module.id, module.route)}
              className={`rounded-3xl bg-white dark:bg-[#111827] border ${theme.border} ${theme.hoverBorder} p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden cursor-pointer`}
            >
              <div className="space-y-3 relative z-10">
                {/* Header: Icon + Title */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {module.name}
                      </h3>
                      {modData?.total > 0 && (
                        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                          {modData.completed > 0
                            ? `${modData.completed}/${modData.total} Solved • ${modData.progress}%`
                            : `${modData.total} Problems Available`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {module.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                <Link
                  to={module.route}
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

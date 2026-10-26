/**
 * Shared Tab Navigation Bar for Operating Systems module sub-sections.
 */
export default function OsTabs({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`border-b border-slate-200 dark:border-[#1E2638] overflow-x-auto no-scrollbar ${className}`}>
      <nav className="flex space-x-2 sm:space-x-3 min-w-max pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

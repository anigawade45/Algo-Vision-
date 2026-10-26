/**
 * Shared Page Header Banner for Operating Systems module pages.
 */
export default function OsPageHeader({
  badge,
  badgeColor = 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  title,
  description,
  actions = null,
  className = ''
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {badge && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${badgeColor}`}>
                {badge}
              </span>
            )}
            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
            )}
          </div>
          {description && (
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

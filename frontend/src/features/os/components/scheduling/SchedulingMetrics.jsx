import { Clock, Hourglass, Percent, Zap } from 'lucide-react';

export default function SchedulingMetrics({ metrics }) {
  const cards = [
    {
      title: 'Average Waiting Time',
      value: `${metrics.avgWaitingTime} ms`,
      icon: Hourglass,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30'
    },
    {
      title: 'Average Turnaround Time',
      value: `${metrics.avgTurnaroundTime} ms`,
      icon: Clock,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30'
    },
    {
      title: 'Average Response Time',
      value: `${metrics.avgResponseTime} ms`,
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'
    },
    {
      title: 'CPU Utilization',
      value: `${metrics.cpuUtilization} %`,
      icon: Percent,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 relative overflow-hidden"
          >
            <div className="space-y-1.5 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-mono">
                {card.title}
              </span>
              <span className="text-lg font-black text-slate-800 dark:text-white font-mono leading-none truncate block">
                {card.value}
              </span>
            </div>

            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${card.color}`}>
              <IconComponent className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { 
  Database, 
  Search, 
  GitBranch, 
  Grid, 
  Layers, 
  Award,
  Sparkles
} from 'lucide-react';
import { DB_SCALING_STEPS } from '../../data/dbScalingData';

const ICONS_MAP = {
  Database,
  Search,
  GitBranch,
  Grid,
  Layers,
  Award
};

export function DbScalingHero({ activeStep, onSelectStep }) {
  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Module 4 • Data Tier &amp; Storage Track</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Database Scaling, Replication &amp; Sharding
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Master relational vs document storage models (SQL vs NoSQL), B-Tree database indexing, Primary-Replica asynchronous replication lag, and horizontal data sharding.
          </p>
        </div>
      </div>

      {/* Stepwise Navigation Track */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-2 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 custom-scrollbar">
          {DB_SCALING_STEPS.map((step) => {
            const Icon = ICONS_MAP[step.icon] || Database;
            const isActive = activeStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 ring-2 ring-purple-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131B2E] hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">{step.short}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DbScalingHero;

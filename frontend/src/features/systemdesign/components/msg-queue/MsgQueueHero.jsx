import {
  Clock,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Server,
  Award,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { MSG_QUEUE_STEPS } from '../../data/msgQueueData';

const ICONS_MAP = {
  Clock,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Server,
  Award,
};

export function MsgQueueHero({ activeStep, onSelectStep, completedSteps = [] }) {
  const progressPercentage = Math.round(((completedSteps.length) / MSG_QUEUE_STEPS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Module 5 • Event-Driven &amp; Async Systems</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Message Queue &amp; Asynchronous Processing Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Decouple high-velocity producers from downstream workers, absorb traffic spikes with FIFO backpressure buffers, simulate worker pools, master exponential backoff retries, Dead-Letter Queues (DLQ), and idempotent message deduplication.
          </p>
        </div>

        {/* Progress Badge */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shrink-0 min-w-[200px] space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span className="font-bold text-slate-900 dark:text-white">{completedSteps.length} / {MSG_QUEUE_STEPS.length} Steps</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(5, progressPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stepwise Navigation Track */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 custom-scrollbar">
          {MSG_QUEUE_STEPS.map((step) => {
            const Icon = ICONS_MAP[step.icon] || Layers;
            const isActive = activeStep === step.id;
            const isDone = completedSteps.includes(step.id);

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 ring-2 ring-purple-500/20'
                    : isDone
                    ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200/60 dark:border-purple-800/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131B2E] hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-white/20 text-white' : isDone ? 'bg-purple-200/60 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {isDone && !isActive ? (
                    <CheckCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
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

export default MsgQueueHero;

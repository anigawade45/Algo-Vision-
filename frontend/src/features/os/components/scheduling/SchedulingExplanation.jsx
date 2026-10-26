import { HelpCircle, Check, AlertTriangle, Lightbulb } from 'lucide-react';

export default function SchedulingExplanation({ step, selectedAlgorithm = 'FCFS' }) {
  const characteristicsMap = {
    FCFS: {
      title: 'FCFS Characteristics',
      advantages: [
        'Simple and easy to understand',
        'Easy to implement with FIFO queue',
        'Fair in terms of arrival order'
      ],
      disadvantages: [
        'Non-preemptive: Process runs to completion',
        'Convoy Effect: Short jobs wait for long processes ahead'
      ]
    },
    SJF: {
      title: 'SJF Characteristics',
      advantages: [
        'Minimizes overall average waiting time',
        'Optimal for batch processing systems',
        'High system throughput'
      ],
      disadvantages: [
        'Non-preemptive scheduling',
        'Requires prior knowledge of burst times',
        'Starvation risk for processes with long burst times'
      ]
    },
    SRTF: {
      title: 'SRTF Characteristics',
      advantages: [
        'Preemptive version of SJF for interactive systems',
        'Provides shortest average turnaround time',
        'Quick response for newly arriving short jobs'
      ],
      disadvantages: [
        'High context-switching overhead',
        'Burst time estimation required',
        'Severe starvation possibility for long jobs'
      ]
    },
    Priority: {
      title: 'Priority Scheduling Characteristics',
      advantages: [
        'Supports process criticality / importance ranking',
        'Essential for real-time and OS core tasks',
        'Flexible custom policy definition'
      ],
      disadvantages: [
        'Starvation (indefinite blocking) of low-priority jobs',
        'Requires aging mechanisms to prevent starvation',
        'Priority inversion risks'
      ]
    },
    RR: {
      title: 'Round Robin (RR) Characteristics',
      advantages: [
        'Preemptive & time-shared fairness for all jobs',
        'Excellent response time for interactive environments',
        'No starvation occurs'
      ],
      disadvantages: [
        'Performance highly dependent on Time Quantum (Q)',
        'Too small Q leads to frequent context switching',
        'Too large Q degenerates into FCFS'
      ]
    },
    MLQ: {
      title: 'Multilevel Queue (MLQ) Characteristics',
      advantages: [
        'Categorizes processes into separate priority queues',
        'Different algorithms can serve different queues (RR/FCFS)',
        'Efficient background vs foreground scheduling'
      ],
      disadvantages: [
        'Complex queue configuration and maintenance',
        'Processes fixed in assigned queue (no dynamic demotion/promotion)',
        'Risk of starvation for lower priority queues'
      ]
    }
  };

  const currentInfo = characteristicsMap[selectedAlgorithm] || characteristicsMap.FCFS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* Step Commentary & Why Card */}
      <div className="md:col-span-7 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1E2638] pb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Visual Commentary</h3>
        </div>

        {step ? (
          <div className="space-y-4">
            {/* Event Description */}
            <div className="p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <span className="text-[10px] font-bold text-blue-600 dark:text-[#3B82F6] uppercase tracking-wider block font-mono mb-1">
                Event Action
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                {step.explanation}
              </p>
            </div>

            {/* Why Selection Card */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                  Why did {selectedAlgorithm} choose this?
                </span>
              </div>
              <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
                {step.whyReason}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-450 dark:text-slate-555 italic font-mono">
            Start simulation to see live visual walkthrough explanations here.
          </p>
        )}
      </div>

      {/* Educational Characteristics Card */}
      <div className="md:col-span-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1E2638] pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{currentInfo.title}</h3>
          </div>

          <div className="space-y-2.5">
            {/* Advantages */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest block font-mono">
                Advantages
              </span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-450">
                {currentInfo.advantages.map((adv, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disadvantages */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest block font-mono">
                Disadvantages
              </span>
              <ul className="space-y-1 text-xs text-slate-650 dark:text-slate-450">
                {currentInfo.disadvantages.map((dis, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

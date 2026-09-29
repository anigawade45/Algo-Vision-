import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  Clock, 
  Database, 
  ChevronRight, 
  Play, 
  ArrowRight, 
  Code2, 
  Calculator,
  CheckCircle2,
  ListRestart
} from 'lucide-react';
import { getComplexityData } from '../../data/complexity/mockComplexity';

export function ComplexityStage({ problem, onCompleteStage, onNextStage }) {
  const complexityData = getComplexityData(problem.id);
  const [activeSection, setActiveSection] = useState('time');
  const [timeStepIndex, setTimeStepIndex] = useState(0);
  const [spaceStepIndex, setSpaceStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const timeSteps = complexityData.time.steps;
  const spaceSteps = complexityData.space.steps;

  // Reset progress when the problem changes
  useEffect(() => {
    setTimeStepIndex(0);
    setSpaceStepIndex(0);
    setActiveSection('time');
    setIsCompleted(false);
  }, [problem.id]);

  // Mark complete when both sections are fully revealed
  useEffect(() => {
    if (timeStepIndex === timeSteps.length - 1 && spaceStepIndex === spaceSteps.length - 1) {
      setIsCompleted(true);
      if (onCompleteStage) onCompleteStage('complexity');
    }
  }, [timeStepIndex, spaceStepIndex, timeSteps.length, spaceSteps.length, onCompleteStage]);

  const handleNextTimeStep = () => {
    if (timeStepIndex < timeSteps.length - 1) {
      setTimeStepIndex(prev => prev + 1);
    }
  };

  const handleNextSpaceStep = () => {
    if (spaceStepIndex < spaceSteps.length - 1) {
      setSpaceStepIndex(prev => prev + 1);
    }
  };

  const resetProgress = () => {
    setTimeStepIndex(0);
    setSpaceStepIndex(0);
    setActiveSection('time');
  };

  const currentSteps = activeSection === 'time' ? timeSteps : spaceSteps;
  const currentIndex = activeSection === 'time' ? timeStepIndex : spaceStepIndex;
  const handleNext = activeSection === 'time' ? handleNextTimeStep : handleNextSpaceStep;
  const sectionTitle = activeSection === 'time' ? 'TIME COMPLEXITY' : 'SPACE COMPLEXITY';
  const sectionIcon = activeSection === 'time' ? <Clock className="w-5 h-5" /> : <Database className="w-5 h-5" />;
  const sectionColor = activeSection === 'time' ? 'text-blue-500' : 'text-purple-500';
  const sectionBg = activeSection === 'time' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-purple-50 dark:bg-purple-900/20';
  const activeComplexity = activeSection === 'time' ? complexityData.time.complexity : complexityData.space.complexity;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs uppercase tracking-wider">
            <Gauge className="w-4 h-4" />
            <span>Complexity Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            How efficient is this?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Let's break down exactly how we calculate the Time and Space complexity for <strong>{problem.title}</strong> step-by-step. Don't just memorize it, understand why!
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10 shrink-0">
           <button
             onClick={() => setActiveSection('time')}
             className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 transition-all cursor-pointer ${
               activeSection === 'time' 
                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-md' 
                 : 'border-slate-200 dark:border-[#1E2638] bg-transparent text-slate-500 hover:border-blue-300 dark:hover:border-blue-800'
             }`}
           >
             <Clock className="w-8 h-8 mb-2" />
             <span className="text-xs font-mono font-bold">TIME</span>
             {timeStepIndex === timeSteps.length - 1 && <span className="text-[10px] font-bold">{complexityData.time.complexity}</span>}
           </button>

           <button
             onClick={() => setActiveSection('space')}
             className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 transition-all cursor-pointer ${
               activeSection === 'space' 
                 ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shadow-md' 
                 : 'border-slate-200 dark:border-[#1E2638] bg-transparent text-slate-500 hover:border-purple-300 dark:hover:border-purple-800'
             }`}
           >
             <Database className="w-8 h-8 mb-2" />
             <span className="text-xs font-mono font-bold">SPACE</span>
             {spaceStepIndex === spaceSteps.length - 1 && <span className="text-[10px] font-bold">{complexityData.space.complexity}</span>}
           </button>
        </div>
      </div>

      {/* Interactive Step-by-Step UI */}
      <div className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs min-h-[400px] flex flex-col">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-[#1E2638]">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl ${sectionBg} ${sectionColor}`}>
               {sectionIcon}
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                 {sectionTitle}
               </h3>
               <p className="text-xs text-slate-500 font-mono">Step {currentIndex + 1} of {currentSteps.length}</p>
             </div>
          </div>

          <button 
            onClick={resetProgress}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <ListRestart className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Steps History & Current Step */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {currentSteps.map((step, idx) => {
            if (idx > currentIndex) return null;
            
            const isCurrent = idx === currentIndex;
            const isFinal = idx === currentSteps.length - 1;
            
            return (
              <div 
                key={idx} 
                className={`relative pl-6 sm:pl-8 border-l-2 pb-6 last:pb-0 animate-in slide-in-from-left-4 duration-500 ${
                  isCurrent 
                    ? `border-${activeSection === 'time' ? 'blue' : 'purple'}-500` 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white dark:bg-[#0B101D] ${
                  isCurrent 
                    ? `border-${activeSection === 'time' ? 'blue' : 'purple'}-500` 
                    : 'border-slate-300 dark:border-slate-600'
                }`}></div>

                <div className={`space-y-4 ${isCurrent ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
                  
                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                      {step.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Visual Calculation & Code */}
                  {(step.code || step.calculation) && (
                    <div className="flex flex-col xl:flex-row gap-4 mt-4">
                      {step.code && (
                        <div className="flex-1 bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400 shadow-inner">
                          <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <Code2 className="w-3.5 h-3.5" />
                            <span className="uppercase text-[10px] tracking-wider">Algorithm Snippet</span>
                          </div>
                          <pre className="whitespace-pre-wrap">{step.code}</pre>
                        </div>
                      )}
                      
                      {step.calculation && !isFinal && (
                         <div className={`flex-1 rounded-xl p-4 border flex flex-col justify-center ${
                           activeSection === 'time' 
                             ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                             : 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800'
                         }`}>
                           <div className={`flex items-center gap-2 mb-2 ${
                             activeSection === 'time' ? 'text-blue-500' : 'text-purple-500'
                           }`}>
                             <Calculator className="w-3.5 h-3.5" />
                             <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Calculation</span>
                           </div>
                           <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono text-center my-2">
                             {step.calculation}
                           </div>
                         </div>
                      )}

                      {isFinal && (
                        <div className={`flex-1 rounded-xl p-6 border-2 flex flex-col items-center justify-center ${
                           activeSection === 'time' 
                             ? 'bg-blue-600 border-blue-500 shadow-blue-500/20' 
                             : 'bg-purple-600 border-purple-500 shadow-purple-500/20'
                         } shadow-xl transform hover:scale-[1.02] transition-transform`}>
                           <div className="text-white/80 font-mono text-xs font-bold tracking-widest uppercase mb-2">
                             Result
                           </div>
                           <div className="text-4xl font-black text-white font-mono tracking-tight drop-shadow-md">
                             {activeComplexity}
                           </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Button */}
                  {isCurrent && !isFinal && (
                    <div className="pt-2">
                      <button 
                        onClick={handleNext}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold font-mono text-xs transition-all shadow-md active:scale-95 ${
                          activeSection === 'time' 
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' 
                            : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                        }`}
                      >
                        {step.action || 'Next Step'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Section Complete Action */}
                  {isCurrent && isFinal && activeSection === 'time' && (
                    <div className="pt-4">
                      <button 
                        onClick={() => {
                          setActiveSection('space');
                          setSpaceStepIndex(0);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold font-mono text-xs transition-all shadow-md"
                      >
                        Calculate Space Complexity Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-emerald-800 dark:text-emerald-300 font-bold text-lg">Complexity Understood!</h3>
              <p className="text-emerald-600 dark:text-emerald-400/80 text-sm">
                You've successfully calculated the time ({complexityData.time.complexity}) and space ({complexityData.space.complexity}) complexity.
              </p>
            </div>
          </div>
          
          <button
            onClick={onNextStage}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-sm transition-colors shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            Practice Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}

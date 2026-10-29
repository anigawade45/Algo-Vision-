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
  ListRestart,
  Check,
  RefreshCw,
  Loader2
} from 'lucide-react';
import api from '../../../../api/apiClient';

export function ComplexityStage({
  problem,
  selectedApproachId,
  selectedApproachName,
  isCompleted: isCompletedProp = false,
  onCompleteStage,
  onNextStage
}) {
  const [complexityData, setComplexityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [approachId, setApproachId] = useState(selectedApproachId || '');
  const [approachName, setApproachName] = useState(selectedApproachName || '');

  const [activeSection, setActiveSection] = useState('time');
  const [timeStepIndex, setTimeStepIndex] = useState(0);
  const [spaceStepIndex, setSpaceStepIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(Boolean(isCompletedProp));

  useEffect(() => {
    setIsCompleted(Boolean(isCompletedProp));
  }, [isCompletedProp]);

  useEffect(() => {
    if (selectedApproachId) {
      setApproachId(selectedApproachId);
    }
    if (selectedApproachName) {
      setApproachName(selectedApproachName);
    }
  }, [selectedApproachId, selectedApproachName]);

  useEffect(() => {
    fetchComplexityData();
  }, [problem._id, selectedApproachId]);

  const handleCheckpoint = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('complexity');
    }
  };

  const fetchComplexityData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/problems/${problem.problemId}/complexity`);
      const payload = res.data || res;
      if (payload && payload.time && payload.space) {
        setComplexityData(payload);
        setApproachId(res.approachId || approachId);
        setApproachName(res.approachName || approachName);
      } else {
        // Find current approach if complexity not generated
        const pseudoRes = await api.get(`/problems/${problem.problemId}/pseudocode`);
        if (pseudoRes.data?.approach?.approachId) {
          setApproachId(pseudoRes.data.approach.approachId);
          setApproachName(pseudoRes.data.approach.approachName);
        }
      }
    } catch (err) {
      console.error('Failed to fetch complexity data:', err);
      // Don't show error if it just hasn't been generated yet (404/400)
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateComplexity = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.post(`/problems/${problem.problemId}/complexity/generate`, {
        approachId,
        approachName
      });
      const payload = res.data || res;
      if (payload && payload.time && payload.space) {
        setComplexityData(payload);
        resetProgress();
      }
    } catch (err) {
      console.error('Failed to generate complexity:', err);
      setError(err.response?.data?.message || 'Unable to analyze complexity right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const timeSteps = complexityData?.time?.steps || [];
  const spaceSteps = complexityData?.space?.steps || [];

  // Reset progress when the problem changes
  useEffect(() => {
    resetProgress();
    setIsCompleted(false);
  }, [problem.id]);

  // Mark complete when both sections are fully revealed
  useEffect(() => {
    if (timeSteps.length > 0 && spaceSteps.length > 0) {
      if (timeStepIndex === timeSteps.length - 1 && spaceStepIndex === spaceSteps.length - 1) {
        setIsRevealed(true);
      }
    }
  }, [timeStepIndex, spaceStepIndex, timeSteps.length, spaceSteps.length]);

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
    setIsRevealed(false);
  };

  const currentSteps = activeSection === 'time' ? timeSteps : spaceSteps;
  const currentIndex = activeSection === 'time' ? timeStepIndex : spaceStepIndex;
  const handleNext = activeSection === 'time' ? handleNextTimeStep : handleNextSpaceStep;
  const sectionTitle = activeSection === 'time' ? 'TIME COMPLEXITY' : 'SPACE COMPLEXITY';
  const sectionIcon = activeSection === 'time' ? <Clock className="w-5 h-5" /> : <Database className="w-5 h-5" />;
  const sectionColor = activeSection === 'time' ? 'text-blue-500' : 'text-purple-500';
  const sectionBg = activeSection === 'time' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-purple-50 dark:bg-purple-900/20';
  const activeComplexity = activeSection === 'time' ? complexityData?.time?.complexity : complexityData?.space?.complexity;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Loading Complexity Data...</h3>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl min-h-[400px] text-center">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-6" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analyzing your solution...</h3>
        <p className="text-slate-500 max-w-md">Gemini is calculating time and space complexity specifically for the '{approachName}' approach.</p>
      </div>
    );
  }

  if (!complexityData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl min-h-[400px] text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <Gauge className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Complexity Analysis</h3>
        <p className="text-slate-500 max-w-md mb-8">
          Ready to see how efficient the <strong>{approachName}</strong> approach is? Generate a step-by-step mathematical breakdown of Time and Space complexity.
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerateComplexity}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/25"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Generate Analysis with AI</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs uppercase tracking-wider">
            <Gauge className="w-4 h-4" />
            <span>Complexity Analysis • {approachName}</span>
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
             {timeSteps.length > 0 && timeStepIndex === timeSteps.length - 1 && <span className="text-[10px] font-bold">{complexityData?.time?.complexity}</span>}
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
             {spaceSteps.length > 0 && spaceStepIndex === spaceSteps.length - 1 && <span className="text-[10px] font-bold">{complexityData?.space?.complexity}</span>}
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

      {/* Footer Action */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          aria-pressed={isCompleted}
          onClick={handleCheckpoint}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isCompleted ? (
            <>
              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Complexity Mastered ✓</span>
            </>
          ) : (
            <span>I Understand This Complexity</span>
          )}
        </button>

        {onNextStage && (
          <button
            type="button"
            disabled={!isCompleted}
            title={!isCompleted ? "Click 'I Understand This Complexity' above to unlock Stage 11: Practice" : "Proceed to Stage 11: Practice"}
            onClick={onNextStage}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isCompleted
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Next: Stage 11 Practice →</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>

    </div>
  );
}

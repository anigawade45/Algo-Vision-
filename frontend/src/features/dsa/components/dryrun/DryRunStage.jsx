import React, { useState, useEffect } from 'react';
import { getDryRunByProblemAndApproach } from '../../data/dryRun';
import ExecutionInput from './ExecutionInput';
import InitialState from './InitialState';
import ExecutionControls from './ExecutionControls';
import StepExplanation from './StepExplanation';
import ExecutionSummary from './ExecutionSummary';
import DryRunCheckpoint from './DryRunCheckpoint';
import ExecutionTableView from './ExecutionTableView';
import { Minimize2, Maximize2 } from 'lucide-react';

/**
 * DRY RUN STAGE
 * Executes the selected algorithm step by step on actual input data and displays state changes.
 * Supports full screen execution mode (like LeetCode / IDE debuggers).
 */
export function DryRunStage({
  problem,
  problemData,
  selectedApproachId,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
  stageNo = '08',
}) {
  const activeProblem = problem || problemData;
  const activeApproachId = selectedApproachId || 'deque';

  const dryRunData = getDryRunByProblemAndApproach(
    activeProblem?.id,
    activeApproachId
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [understood, setUnderstood] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // NO STATE LEAKAGE: Reset step index & checkpoint whenever problem or approach changes!
  useEffect(() => {
    setCurrentStep(0);
    setUnderstood(false);
    setIsFullscreen(false);
  }, [activeProblem?.id, activeApproachId]);

  // Press Escape to exit full screen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!dryRunData || !dryRunData.steps || !dryRunData.steps.length) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-sans">
        <p className="text-sm">Dry run data unavailable for this problem and approach.</p>
      </div>
    );
  }

  const {
    input,
    approachName,
    initialState,
    steps,
    summary,
  } = dryRunData;

  const safeStepIdx = Math.min(Math.max(0, currentStep), steps.length - 1);
  const currentStepData = steps[safeStepIdx] || steps[0];

  const handleNext = () => {
    if (safeStepIdx < steps.length - 1) {
      setCurrentStep(safeStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (safeStepIdx > 0) {
      setCurrentStep(safeStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleCheckpoint = () => {
    const nextState = !understood;
    setUnderstood(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('dryrun');
    }
  };

  // Dynamic Section Counter helper
  let sectionCounter = 1;
  const getNextSectionNo = () => {
    const num = sectionCounter++;
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <div className="space-y-6 font-sans w-full pb-12">
      {/* FULLSCREEN EXECUTION INSPECTOR OVERLAY */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full Screen Execution Inspector"
          className="fixed inset-0 z-50 bg-[#070A13] text-slate-100 p-4 sm:p-6 overflow-y-auto w-screen h-screen flex flex-col space-y-4 font-sans backdrop-blur-md"
        >
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-blue-600/30 border border-blue-500/50 text-blue-300 font-mono text-xs font-bold uppercase tracking-wider">
                FULLSCREEN EXECUTION INSPECTOR
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-xl">
                {activeProblem?.title || input?.title || 'Dry Run Execution'}
              </h2>
              {approachName && (
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-800 text-blue-400 border border-slate-700 font-mono text-xs font-semibold">
                  Approach: {approachName}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold cursor-pointer border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              title="Exit Full Screen (Esc)"
            >
              <Minimize2 className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>Exit Full Screen (Esc)</span>
            </button>
          </div>

          {/* Fullscreen Step Controls & Dynamic Table */}
          <div className="space-y-4 flex-1">
            <ExecutionControls
              currentStep={safeStepIdx}
              totalSteps={steps.length}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
              sectionNo="03"
              isFullscreen={true}
              onToggleFullscreen={() => setIsFullscreen(false)}
            />

            <ExecutionTableView
              steps={steps}
              currentStep={safeStepIdx}
              onSelectStep={(idx) => setCurrentStep(idx)}
              sectionNo="04"
            />

            {currentStepData?.explanation && (
              <StepExplanation
                explanation={currentStepData.explanation}
                stepNo={currentStepData.stepNo}
                sectionNo="05"
              />
            )}
          </div>
        </div>
      )}

      {/* TOP SECTION / INTRODUCTION HEADER */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-500 dark:text-blue-400/90 tracking-[0.08em] leading-none">
              {stageNo}  ·  Dry Run
            </span>
            {activeProblem?.category && (
              <span className="inline-flex items-center px-2.5 py-0.75 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
                {activeProblem.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Open LeetCode-style Full Screen Inspector"
            >
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Full Screen</span>
            </button>

            {onOpenSpec && (
              <button
                type="button"
                onClick={onOpenSpec}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-mono font-bold cursor-pointer border border-blue-200 dark:border-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors duration-150 motion-reduce:transition-none"
              >
                <span>Problem Spec</span>
              </button>
            )}

            {understood && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span>Dry Run Understood ✓</span>
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          Execute the Algorithm Step by Step
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          Follow the algorithm on actual input and see how its state changes at each step.
        </p>
      </header>

      {/* SETUP SECTIONS: INPUT DATA & INITIAL MEMORY STATE */}
      {input && (
        <ExecutionInput
          inputData={input}
          approachName={approachName}
          sectionNo={getNextSectionNo()}
        />
      )}

      {initialState && (
        <InitialState
          initialState={initialState}
          sectionNo={getNextSectionNo()}
        />
      )}

      {/* STEP CONTROLS BAR */}
      <ExecutionControls
        currentStep={safeStepIdx}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        sectionNo={getNextSectionNo()}
        isFullscreen={false}
        onToggleFullscreen={() => setIsFullscreen(true)}
      />

      {/* DYNAMIC STEP EXECUTION TRACE TABLE */}
      <ExecutionTableView
        steps={steps}
        currentStep={safeStepIdx}
        onSelectStep={(idx) => setCurrentStep(idx)}
        sectionNo={getNextSectionNo()}
      />

      {/* STEP EXPLANATION */}
      {currentStepData?.explanation && (
        <StepExplanation
          explanation={currentStepData.explanation}
          stepNo={currentStepData.stepNo}
          sectionNo={getNextSectionNo()}
        />
      )}

      {/* POST EXECUTION SUMMARY & CHECKPOINT HANDOFF */}
      {summary && (
        <ExecutionSummary
          summary={summary}
          sectionNo={getNextSectionNo()}
        />
      )}

      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />

      {/* SECTION — DRY RUN CHECKPOINT */}
      <DryRunCheckpoint
        understood={understood}
        onCheckpoint={handleCheckpoint}
        onNextStage={onNextStage}
        sectionNo={getNextSectionNo()}
        stageNo={stageNo}
      />
    </div>
  );
}

export default DryRunStage;

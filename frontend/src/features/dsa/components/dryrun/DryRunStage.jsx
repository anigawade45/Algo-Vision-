import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getDryRunByProblemAndApproach } from '../../data/dryRun';
import { getProblemDryRun, generateProblemDryRun, regenerateProblemDryRun } from '@/api/dsa.api';
import ExecutionInput from './ExecutionInput';
import InitialState from './InitialState';
import ExecutionControls from './ExecutionControls';
import StepExplanation from './StepExplanation';
import DryRunCheckpoint from './DryRunCheckpoint';
import ExecutionTableView from './ExecutionTableView';
import { Minimize2, Maximize2, Loader2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * DRY RUN STAGE
 * Executes the selected algorithm step by step on actual input data and displays state changes.
 * Supports full screen execution mode (like LeetCode / IDE debuggers).
 */
export function DryRunStage({
  problem,
  problemData,
  selectedApproachId,
  selectedApproachName,
  isCompleted: isCompletedProp = false,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
  stageNo = '08',
}) {
  const activeProblem = problem || problemData;
  const activeApproachId = selectedApproachId || 'hashTable';
  const targetProblemId = activeProblem?.problemId || activeProblem?._id || activeProblem?.id;

  const [testCaseId, setTestCaseId] = useState(1);
  const [dryRunData, setDryRunData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [understood, setUnderstood] = useState(Boolean(isCompletedProp));

  useEffect(() => {
    setUnderstood(Boolean(isCompletedProp));
  }, [isCompletedProp]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const availableTestCases = useMemo(() => activeProblem?.testCases || [], [activeProblem]);
  const currentTestCaseObj = useMemo(() => {
    if (!availableTestCases.length) return null;
    return availableTestCases.find((tc, idx) => (tc.id || idx + 1) === testCaseId) || availableTestCases[0];
  }, [availableTestCases, testCaseId]);

  const handleGenerate = async (isMountedRef = { current: true }) => {
    setIsGenerating(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateProblemDryRun(targetProblemId, {
        approachId: activeApproachId,
        testCaseId,
      });

      if (isMountedRef.current === false) return;

      const data = response.data?.data || response.data || {};
      const newDryRun = data.dryRun;

      if (newDryRun && newDryRun.steps && newDryRun.steps.length > 0) {
        setDryRunData(newDryRun);
        setIsStale(false);
        setCurrentStep(0);
      } else {
        throw new Error('Server returned an empty Dry Run execution trace.');
      }
    } catch (err) {
      if (isMountedRef.current === false) return;
      console.error('[DryRunStage] Generation error:', err);
      const errMessage = err.response?.data?.message || err.message || 'Unable to generate Dry Run execution trace.';
      setError(errMessage);
    } finally {
      if (isMountedRef.current !== false) {
        setIsGenerating(false);
        setIsLoading(false);
      }
    }
  };

  // Fetch Dry Run data from backend
  const fetchDryRun = useCallback(async (isMountedRef) => {
    if (!targetProblemId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getProblemDryRun(targetProblemId, activeApproachId, testCaseId);

      if (!isMountedRef.current) return;

      const data = response.data?.data || response.data || {};
      const fetchedDryRun = data.dryRun;
      const staleStatus = data.stale || false;

      if (fetchedDryRun && fetchedDryRun.steps && fetchedDryRun.steps.length > 0) {
        setDryRunData(fetchedDryRun);
        setIsStale(staleStatus);
        setIsLoading(false);
      } else {
        // If testCaseId === 1, attempt static mock data if available
        const mockData = getDryRunByProblemAndApproach(targetProblemId, activeApproachId);
        if (testCaseId === 1 && mockData && mockData.steps && mockData.steps.length > 0) {
          setDryRunData(mockData);
          setIsStale(false);
          setIsLoading(false);
        } else {
          // For testCaseId > 1 or missing mock, auto-generate via Gemini AI
          handleGenerate(isMountedRef);
        }
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.warn('[DryRunStage] Failed to fetch saved dry run, falling back to mock or generate:', err.message);

      const mockData = getDryRunByProblemAndApproach(targetProblemId, activeApproachId);
      if (testCaseId === 1 && mockData && mockData.steps && mockData.steps.length > 0) {
        setDryRunData(mockData);
        setIsStale(false);
        setIsLoading(false);
      } else {
        handleGenerate(isMountedRef);
      }
    }
  }, [targetProblemId, activeApproachId, testCaseId]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await regenerateProblemDryRun(targetProblemId, {
        approachId: activeApproachId,
        testCaseId,
      });

      const data = response.data?.data || response.data || {};
      const newDryRun = data.dryRun;

      if (newDryRun && newDryRun.steps && newDryRun.steps.length > 0) {
        setDryRunData(newDryRun);
        setIsStale(false);
        setCurrentStep(0);
      } else {
        throw new Error('Server returned an empty Dry Run execution trace.');
      }
    } catch (err) {
      console.error('[DryRunStage] Regeneration error:', err);
      const errMessage = err.response?.data?.message || err.message || 'Unable to regenerate Dry Run execution trace.';
      setError(errMessage);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  // Reset step index & fetch data whenever problem, approach, or test case changes
  useEffect(() => {
    const isMountedRef = { current: true };
    setCurrentStep(0);
    setUnderstood(false);
    setIsFullscreen(false);

    fetchDryRun(isMountedRef);

    return () => {
      isMountedRef.current = false;
    };
  }, [targetProblemId, activeApproachId, testCaseId, fetchDryRun]);

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

  const steps = dryRunData?.steps || [];
  const safeStepIdx = Math.min(Math.max(0, currentStep), Math.max(0, steps.length - 1));
  const currentStepData = steps[safeStepIdx] || steps[0];
  const approachName = dryRunData?.approachName || selectedApproachName || activeApproachId;

  // Dynamically ensure the input display header matches the selected test case
  const activeInputHeader = useMemo(() => {
    if (!dryRunData?.input) return null;
    if (!currentTestCaseObj) return dryRunData.input;

    const inputVisual = currentTestCaseObj.inputRaw || dryRunData.input.inputVisual;
    const expectedOutput = currentTestCaseObj.outputRaw || dryRunData.input.expectedOutput;

    return {
      title: dryRunData.input.title || activeProblem?.title,
      inputVisual,
      items: [
        {
          label: 'Initial Input / Data',
          value: inputVisual,
        },
        {
          label: 'Expected Output',
          value: expectedOutput,
        },
      ],
      expectedOutput,
    };
  }, [dryRunData, currentTestCaseObj, activeProblem]);

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
                {activeProblem?.title || dryRunData?.input?.title || 'Dry Run Execution'}
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
              isFullscreen={true}
              onToggleFullscreen={() => setIsFullscreen(false)}
            />

            <ExecutionTableView
              steps={steps}
              currentStep={safeStepIdx}
              onSelectStep={(idx) => setCurrentStep(idx)}
              sectionNo="03"
            />

            {currentStepData?.explanation && (
              <StepExplanation
                explanation={currentStepData.explanation}
                stepNo={currentStepData.stepNo}
                sectionNo="04"
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

        {/* Test Case Selector if multiple test cases exist */}
        {availableTestCases.length > 1 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">TEST CASE:</span>
            <div className="flex flex-wrap gap-2">
              {availableTestCases.map((tc, idx) => {
                const tcNum = tc.id || idx + 1;
                const isSelected = testCaseId === tcNum;
                return (
                  <button
                    key={tcNum}
                    type="button"
                    onClick={() => setTestCaseId(tcNum)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Test Case {tcNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* STALE BANNER */}
      {isStale && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-amber-900 dark:text-amber-200 text-sm font-sans">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
            <span>This Dry Run trace was generated for an earlier version of code or pseudocode and may be outdated.</span>
          </div>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Regenerate Trace</span>
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-4 my-6">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" aria-hidden="true" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {isGenerating ? `Generating Dry Run Execution Trace for Test Case ${testCaseId}...` : `Loading Dry Run for Test Case ${testCaseId}...`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Executing algorithm steps line-by-line and generating variable states for Test Case {testCaseId}...
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {!isLoading && error && (
        <div className="p-8 text-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-4 my-6">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" aria-hidden="true" />
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 font-mono">
            Dry Run Trace Unavailable for Test Case {testCaseId}
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => handleGenerate()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold cursor-pointer shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Generate Dry Run for Test Case {testCaseId}</span>
          </button>
        </div>
      )}

      {/* CONTENT WHEN DATA IS READY */}
      {!isLoading && !error && dryRunData && (
        <>
          {/* SETUP SECTIONS: INPUT DATA & INITIAL MEMORY STATE */}
          {activeInputHeader && (
            <ExecutionInput
              inputData={activeInputHeader}
              approachName={approachName}
              sectionNo={getNextSectionNo()}
            />
          )}

          {dryRunData.initialState && (
            <InitialState
              initialState={dryRunData.initialState}
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

          {/* COMPLETION ACTIONS */}
          <DryRunCheckpoint
            understood={understood}
            onCheckpoint={handleCheckpoint}
            onNextStage={onNextStage}
          />
        </>
      )}
    </div>
  );
}

export default DryRunStage;

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ChevronRight,
  CheckCircle2,
  ListRestart,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  getProblemVisualization,
  generateProblemVisualization,
  getProblemVisualizationPlan,
} from '@/api/dsa.api';
import { VISUALIZATION_TYPES, resolveVisualizationType } from '../../data/visualizationTypes';
import {
  MOCK_VISUALIZATIONS,
  mockVisualizations,
  getMockVisualizationByProblemId,
} from '../../data/mockVisualizations';
import { mockProblems, MOCK_PROBLEMS } from '../../data/mockProblems';
import { adaptTestCaseToInitialState } from '../../adapters/testCaseInputAdapter';
import { replayExecutionTrace } from '../../trace/executionTraceReplay';
import { VisualizationHeader } from './VisualizationHeader';
import { VisualizationProblemSelector } from './VisualizationProblemSelector';
import { VisualizationTestCaseSelector } from './VisualizationTestCaseSelector';
import { VisualizationCanvas } from './VisualizationCanvas';
import { VisualizationControls, PLAYBACK_STATUS } from './VisualizationControls';

export function VisualizationStage({
  problem,
  selectedApproachId,
  selectedApproachName,
  onCompleteStage,
  onNextStage,
  onNavigateToStage,
  onOpenSpec,
}) {
  const targetProblemId = problem?.problemId || problem?._id || problem?.id || 'two-sum';

  // Determine initial benchmark problem ID fallback
  const initialDemoProblemId = useMemo(() => {
    if (problem?.id && mockVisualizations[problem.id]) {
      return problem.id;
    }
    return MOCK_VISUALIZATIONS[0].problemId;
  }, [problem?.id]);

  // Integration & Data Source State
  const [sourceMode, setSourceMode] = useState('live'); // 'live' | 'demo'
  const [selectedDemoProblemId, setSelectedDemoProblemId] = useState(initialDemoProblemId);
  const [liveTrace, setLiveTrace] = useState(null);
  const [liveApproachId, setLiveApproachId] = useState(null);
  const [liveApproachName, setLiveApproachName] = useState(null);
  const [isTraceLoading, setIsTraceLoading] = useState(false);
  const [traceError, setTraceError] = useState(null);
  const [isDryRunRequired, setIsDryRunRequired] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // AI Visualization Plan State
  const [visualizationPlan, setVisualizationPlan] = useState(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [planMetadata, setPlanMetadata] = useState(null);

  // Authoritative Test Cases & Selection State
  const testCases = useMemo(() => {
    const rawCases = Array.isArray(problem?.testCases) ? problem.testCases : [];
    if (rawCases.length > 1) return rawCases;
    const normSlug = (problem?.problemId || problem?.id || '').toLowerCase();
    const problemList = MOCK_PROBLEMS || mockProblems || [];
    const mockMatch = problemList.find(
      (p) => (p.id && p.id.toLowerCase() === normSlug) || (p.problemId && p.problemId.toLowerCase() === normSlug)
    );
    if (mockMatch?.testCases?.length > rawCases.length) {
      return mockMatch.testCases;
    }
    return rawCases;
  }, [problem?.testCases, problem?.problemId, problem?.id]);

  const [selectedTestCaseId, setSelectedTestCaseId] = useState(() => {
    return testCases.length > 0 && testCases[0].id !== undefined ? testCases[0].id : 1;
  });

  const prevProblemIdRef = useRef(targetProblemId);

  // Keep selectedTestCaseId synced when targetProblemId changes
  useEffect(() => {
    if (prevProblemIdRef.current !== targetProblemId) {
      prevProblemIdRef.current = targetProblemId;
      const firstId = testCases.length > 0 && testCases[0].id !== undefined ? testCases[0].id : 1;
      setSelectedTestCaseId(firstId);
      setLiveTrace(null);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsDryRunRequired(false);
    }
  }, [targetProblemId, testCases]);

  // Resolve currently active test case object
  const selectedTestCase = useMemo(() => {
    if (!problem) return null;
    if (testCases.length > 0) {
      return (
        testCases.find((tc, idx) => (tc.id !== undefined ? tc.id : idx + 1) === selectedTestCaseId) ||
        testCases[0]
      );
    }
    return {
      id: 1,
      inputStructured: problem.inputData,
      outputStructured: problem.outputData,
      inputRaw: '',
    };
  }, [problem, testCases, selectedTestCaseId]);

  // Direct Test-Case Input Adapter: Immediately derive initial visualization state
  const directInputResult = useMemo(() => {
    if (!selectedTestCase || !problem) return null;
    return adaptTestCaseToInitialState(selectedTestCase, {
      ...problem,
      problemId: targetProblemId,
      testCaseId: selectedTestCaseId,
    });
  }, [selectedTestCase, problem, targetProblemId, selectedTestCaseId]);

  const directInputState = directInputResult?.initialState || null;
  const directInputError = directInputResult?.error || null;

  // Playback & Navigation State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGeneratingAiTrace, setIsGeneratingAiTrace] = useState(false);

  // Monotonically increasing request ID to prevent race conditions
  const latestRequestIdRef = useRef(0);

  // Fetch Live Visualization Trace from Backend (Non-blocking background capability)
  const fetchVisualizationTrace = useCallback(
    async (isMountedRef, reqId, tcId) => {
      if (!targetProblemId) return;

      setIsTraceLoading(true);
      setTraceError(null);
      setIsDryRunRequired(false);

      try {
        const response = await getProblemVisualization(targetProblemId, selectedApproachId, tcId);

        // Protect against asynchronous race conditions
        if (!isMountedRef.current || reqId !== latestRequestIdRef.current) return;

        const resultData = response?.data || response;
        const trace = resultData?.trace;

        if (trace && Array.isArray(trace.steps) && trace.steps.length > 0) {
          setLiveTrace(trace);
          setLiveApproachId(resultData?.approachId || selectedApproachId);
          setLiveApproachName(resultData?.approachName || selectedApproachName);
          setCurrentStepIndex(0);
          setIsPlaying(false);
        } else {
          setLiveTrace(null);
        }
      } catch (err) {
        if (!isMountedRef.current || reqId !== latestRequestIdRef.current) return;

        console.info('[VisualizationStage] Live backend trace query note:', err.message);
        const resData = err.response?.data || {};
        const statusCode = err.status || err.response?.status;
        const isDryRunReq =
          statusCode === 404 &&
          (resData.errors?.some((e) => e.code === 'DRY_RUN_REQUIRED') ||
            resData.message?.includes('Dry Run execution data not found'));

        if (isDryRunReq) {
          setIsDryRunRequired(true);
          setLiveTrace(null);
        } else {
          setTraceError(resData.message || err.message || 'Unable to connect to visualization API.');
        }
      } finally {
        if (isMountedRef.current && reqId === latestRequestIdRef.current) {
          setIsTraceLoading(false);
        }
      }
    },
    [targetProblemId, selectedApproachId, selectedApproachName]
  );

  // Trigger Trace fetch when problem, approach, test case, or retry changes
  useEffect(() => {
    const isMountedRef = { current: true };
    const reqId = ++latestRequestIdRef.current;

    // Reset playback position on selection changes
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsCompleted(false);

    if (sourceMode === 'live') {
      fetchVisualizationTrace(isMountedRef, reqId, selectedTestCaseId);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchVisualizationTrace, sourceMode, targetProblemId, selectedTestCaseId, retryTrigger]);

  // Fetch AI Visualization Plan from Backend
  useEffect(() => {
    let isMounted = true;
    if (!targetProblemId || sourceMode !== 'live') {
      setVisualizationPlan(null);
      setPlanMetadata(null);
      return;
    }

    setIsPlanLoading(true);
    setPlanError(null);

    getProblemVisualizationPlan(targetProblemId)
      .then((res) => {
        if (!isMounted) return;
        const resData = res?.data || res;
        const plan = resData?.plan || null;
        setVisualizationPlan(plan);
        setPlanMetadata({
          cached: resData?.cached || false,
          isFallback: resData?.isFallback || false,
          source: resData?.source || 'gemini',
          isSupported: resData?.isSupported ?? true,
          executionSupported: resData?.executionSupported ?? true,
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('[VisualizationStage] Plan fetch note:', err.message);
        setPlanError(err.response?.data?.message || err.message || 'Visualization plan not available.');
      })
      .finally(() => {
        if (isMounted) setIsPlanLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [targetProblemId, sourceMode]);

  // Test-Case Selection Handler
  const handleSelectTestCase = useCallback((testCaseId) => {
    setSelectedTestCaseId(testCaseId);
    setLiveTrace(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsCompleted(false);
    setIsDryRunRequired(false);
  }, []);

  // Derived Benchmark Problem Object (for Demo Mode)
  const selectedDemoProblem = useMemo(() => {
    return getMockVisualizationByProblemId(selectedDemoProblemId) || MOCK_VISUALIZATIONS[0];
  }, [selectedDemoProblemId]);

  // Derive Active Problem Configuration for Canvas & Visualizers
  const activeProblem = useMemo(() => {
    const resolvedVizType = resolveVisualizationType({
      ...problem,
      problemId: targetProblemId,
      visualizationType: problem?.visualizationType,
    });

    if (sourceMode === 'live') {
      // 1. If live validated execution trace is available from backend
      if (liveTrace) {
        return {
          ...problem,
          id: targetProblemId,
          problemId: targetProblemId,
          title: liveTrace.metadata?.title || problem?.title || 'Execution Trace',
          approachName:
            liveApproachName ||
            selectedApproachName ||
            liveTrace.metadata?.approachName ||
            'Optimal Approach',
          approachId: liveApproachId || selectedApproachId || liveTrace.approachId || 'default',
          visualizationType: resolvedVizType,
          executionTrace: liveTrace,
          visualizationData: {
            steps: liveTrace.steps,
          },
          initialState: liveTrace.initialState,
          category: problem?.category || liveTrace.metadata?.category || 'Algorithm',
          difficulty: problem?.difficulty || liveTrace.metadata?.difficulty || 'Medium',
          input:
            selectedTestCase?.inputStructured ||
            selectedTestCase?.inputRaw ||
            problem?.inputData,
          expectedOutput:
            selectedTestCase?.outputStructured ||
            selectedTestCase?.outputRaw ||
            problem?.outputData,
          isDirectTestCase: false,
          visualizationPlan,
        };
      }

      // 2. Direct Test-Case Initial Visualization (Independent of Stage 08 Dry Run)
      return {
        ...problem,
        id: targetProblemId,
        problemId: targetProblemId,
        title: problem?.title || 'Problem Visualization',
        approachName: selectedApproachName || 'Optimal Approach',
        approachId: selectedApproachId || 'default',
        visualizationType: resolvedVizType,
        executionTrace: liveTrace,
        initialState: directInputState,
        isDirectTestCase: !liveTrace,
        category: problem?.category || 'Algorithm',
        difficulty: problem?.difficulty || 'Medium',
        input:
          selectedTestCase?.inputStructured ||
          selectedTestCase?.inputRaw ||
          problem?.inputData,
        expectedOutput:
          selectedTestCase?.outputStructured ||
          selectedTestCase?.outputRaw ||
          problem?.outputData,
        visualizationPlan,
        visualizationData: {
          steps: liveTrace?.steps || [],
        },
      };
    }

    return {
      ...selectedDemoProblem,
      visualizationType: resolveVisualizationType(selectedDemoProblem),
      visualizationPlan,
    };
  }, [
    sourceMode,
    liveTrace,
    problem,
    targetProblemId,
    liveApproachName,
    selectedApproachName,
    liveApproachId,
    selectedApproachId,
    selectedDemoProblem,
    directInputState,
    selectedTestCase,
    visualizationPlan,
  ]);

  // Resolve active trace from live mode, or fallback immediately to mock visualization steps
  const activeTrace = useMemo(() => {
    if (sourceMode === 'live' && liveTrace && Array.isArray(liveTrace.steps) && liveTrace.steps.length > 0) {
      return liveTrace;
    }

    // High-fidelity fallback: if live trace is still loading or unavailable, retrieve mock execution trace
    const mockProb =
      getMockVisualizationByProblemId(targetProblemId) ||
      selectedDemoProblem ||
      mockVisualizations[targetProblemId];

    if (mockProb?.executionTrace && Array.isArray(mockProb.executionTrace.steps) && mockProb.executionTrace.steps.length > 0) {
      return mockProb.executionTrace;
    }

    if (mockProb?.visualizationData?.steps && Array.isArray(mockProb.visualizationData.steps) && mockProb.visualizationData.steps.length > 0) {
      return {
        problemId: mockProb.problemId || targetProblemId,
        initialState: mockProb.visualizationData.initialState || mockProb.initialState || {},
        steps: mockProb.visualizationData.steps,
        finalState: mockProb.visualizationData.finalState || {},
        result: mockProb.expectedOutput,
        totalSteps: mockProb.visualizationData.steps.length,
        minStep: 1,
        maxStep: mockProb.visualizationData.steps.length,
      };
    }

    return liveTrace || null;
  }, [sourceMode, liveTrace, targetProblemId, selectedDemoProblem]);

  const hasReplay = Boolean(activeTrace && Array.isArray(activeTrace.steps) && activeTrace.steps.length > 0);
  const totalExecutionSteps = hasReplay ? activeTrace.steps.length : 0;
  // Step 0 (genuine initial state before execution) + execution steps 1..N
  const totalStatesCount = hasReplay ? totalExecutionSteps + 1 : 1;

  // Derive Single Authoritative Replay Result for the current position (Safeguard 1 & 3)
  const activeReplay = useMemo(() => {
    if (hasReplay && activeTrace) {
      // currentStepIndex: 0 => Step 0 (original normalized input, no execution events applied)
      // currentStepIndex: k (1..N) => Step k (reduced state after k execution steps)
      return replayExecutionTrace(activeTrace, currentStepIndex);
    }

    // Direct Test-Case Initial Visualization (Pipeline A, no trace required)
    const baseInitialState = directInputState || activeProblem?.initialState || {};
    const basePrims = baseInitialState?.primitives || baseInitialState || {};
    const baseFlat = baseInitialState?.flatState || {};
    const unifiedInitialState = {
      ...baseInitialState,
      ...baseFlat,
      primitives: basePrims,
    };

    return {
      sceneState: unifiedInitialState,
      currentStep: {
        stepIndex: 0,
        stepNumber: 0,
        label: 'Step 0: Initial Input',
        operation: 'INITIAL_INPUT',
        description: `Initial input state for Test Case #${selectedTestCaseId} loaded directly into visual primitives. Algorithm execution not yet recorded.`,
        state: unifiedInitialState,
        highlights: {},
        changed: [],
        events: [],
      },
      currentStepNumber: 0,
      totalSteps: 0,
      isTerminal: true,
      result: null,
      completed: false,
    };
  }, [hasReplay, activeTrace, currentStepIndex, directInputState, activeProblem?.initialState, selectedTestCaseId]);

  // Compute Authoritative Playback State Machine
  const playbackStatus = useMemo(() => {
    if (hasReplay) {
      if (isPlaying) {
        return PLAYBACK_STATUS.PLAYING;
      }
      if (currentStepIndex >= totalStatesCount - 1) {
        return PLAYBACK_STATUS.COMPLETED;
      }
      if (currentStepIndex > 0) {
        return PLAYBACK_STATUS.PAUSED;
      }
      return PLAYBACK_STATUS.READY;
    }

    if (sourceMode === 'live') {
      if (isTraceLoading) {
        return PLAYBACK_STATUS.INITIAL_INPUT;
      }
      if (traceError) {
        return PLAYBACK_STATUS.TRACE_ERROR;
      }
      if (isDryRunRequired) {
        return PLAYBACK_STATUS.TRACE_UNAVAILABLE;
      }
    }

    return PLAYBACK_STATUS.INITIAL_INPUT;
  }, [
    sourceMode,
    isTraceLoading,
    traceError,
    isDryRunRequired,
    hasReplay,
    isPlaying,
    currentStepIndex,
    totalStatesCount,
  ]);

  // Step Navigation Handlers
  const handleNextStep = useCallback(() => {
    if (!hasReplay) return;
    setIsPlaying(false);
    setCurrentStepIndex((prev) => {
      if (prev < totalStatesCount - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [totalStatesCount, hasReplay]);

  const handlePrevStep = useCallback(() => {
    if (!hasReplay) return;
    setIsPlaying(false);
    setCurrentStepIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return 0;
    });
  }, [hasReplay]);

  const handleTogglePlay = useCallback(() => {
    if (!hasReplay) return;
    if (currentStepIndex >= totalStatesCount - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStepIndex, totalStatesCount, hasReplay]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleChangeSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
  }, []);

  const handleRetry = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  // Dedicated Stage 09 AI Trace Generation Handler
  const handleGenerateAiTrace = useCallback(async () => {
    if (!targetProblemId || isGeneratingAiTrace) return;

    setIsGeneratingAiTrace(true);
    setTraceError(null);

    try {
      const response = await generateProblemVisualization(
        targetProblemId,
        selectedApproachId,
        selectedTestCaseId
      );

      const resultData = response?.data || response;
      const trace = resultData?.trace;

      if (trace && Array.isArray(trace.steps) && trace.steps.length > 0) {
        setLiveTrace(trace);
        setLiveApproachId(resultData?.approachId || selectedApproachId);
        setLiveApproachName(resultData?.approachName || selectedApproachName);
        setCurrentStepIndex(0);
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('[VisualizationStage] AI Trace generation error:', err);
      const resData = err.response?.data || {};
      setTraceError(resData.message || err.message || 'Failed to generate AI execution trace.');
    } finally {
      setIsGeneratingAiTrace(false);
    }
  }, [targetProblemId, selectedApproachId, selectedTestCaseId, isGeneratingAiTrace, selectedApproachName]);

  // Demo Benchmark Selector Handler
  const handleSelectDemoProblem = useCallback((demoProblemId) => {
    setIsPlaying(false);
    setSelectedDemoProblemId(demoProblemId);
    setSourceMode('demo');
    setCurrentStepIndex(0);
  }, []);

  // Safe Playback Timer Effect
  useEffect(() => {
    if (!isPlaying || !hasReplay || totalStatesCount <= 1) return;

    const intervalMs = Math.max(200, Math.round(1000 / playbackSpeed));

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalStatesCount - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, hasReplay, playbackSpeed, totalStatesCount]);

  // Trigger stage completion when reaching final step of a replayable trace
  useEffect(() => {
    if (!isCompleted && hasReplay && currentStepIndex === totalStatesCount - 1) {
      setIsCompleted(true);
      if (onCompleteStage) {
        onCompleteStage('visualize');
      }
    }
  }, [currentStepIndex, totalStatesCount, isCompleted, hasReplay, onCompleteStage]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid intercepting input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNextStep, handlePrevStep, handleReset]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Stage Header */}
      <VisualizationHeader problem={problem} onOpenSpec={onOpenSpec} />

      {/* Authoritative Test Case Switcher (Available in Live Mode) */}
      {sourceMode === 'live' && testCases.length > 0 && (
        <VisualizationTestCaseSelector
          testCases={testCases}
          selectedTestCaseId={selectedTestCaseId}
          onSelectTestCase={handleSelectTestCase}
          hasLiveTrace={Boolean(liveTrace)}
          isTraceLoading={isTraceLoading}
        />
      )}

      {/* Benchmark Problem Selector (Available in Demo Mode) */}
      {sourceMode === 'demo' && (
        <VisualizationProblemSelector
          selectedProblemId={selectedDemoProblemId}
          onSelectProblem={handleSelectDemoProblem}
        />
      )}

      {/* ERROR STATE: MALFORMED OR MISSING TEST-CASE INPUT */}
      {sourceMode === 'live' && directInputError && (
        <div className="p-8 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Unable to Initialize Visualization from Test Case
            </h3>
            <p className="text-xs font-mono text-rose-600 dark:text-rose-400">
              {directInputError.message}
            </p>
          </div>

          {testCases.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-xs text-slate-500 font-mono">Try another test case:</span>
              {testCases.map((tc, idx) => (
                <button
                  key={tc.id || idx}
                  type="button"
                  onClick={() => handleSelectTestCase(tc.id || idx + 1)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-all"
                >
                  Case {tc.id || idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MAIN VISUALIZATION WORKSPACE */}
      {(!directInputError || sourceMode === 'demo') && (
        <>
          {/* AI Visualization Plan Loading Status */}
          {sourceMode === 'live' && isPlanLoading && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-mono text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>Analyzing problem architecture & generating visualization plan with Gemini AI...</span>
            </div>
          )}

          {/* AI Visualization Plan Status Badge (when Plan is ready) */}
          {sourceMode === 'live' && !isPlanLoading && visualizationPlan && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E2638] text-xs font-mono shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Visualization Plan:
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-500/20">
                  {visualizationPlan.layout}
                </span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {planMetadata?.isFallback ? 'Registered Plan' : 'AI-Generated'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400">Execution Strategy:</span>
                <span className={`px-2 py-0.5 rounded-md font-semibold border ${
                  planMetadata?.executionSupported
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}>
                  {planMetadata?.executionSupported ? 'Trusted Strategy Ready' : 'Execution Unsupported'}
                </span>
              </div>
            </div>
          )}

          {/* Execution Unsupported Honest Explanation Banner */}
          {sourceMode === 'live' && planMetadata && !planMetadata.executionSupported && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-700 dark:text-amber-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Visual layout plan is available, but no trusted execution strategy is registered for this algorithm yet. AlgoVision only replays genuine traces and never fabricates algorithm events.
              </span>
            </div>
          )}

          {/* Hero Visualization Canvas (Primary Focus) */}
          <VisualizationCanvas
            problem={activeProblem}
            plan={visualizationPlan}
            currentStep={activeReplay.currentStep}
            state={activeReplay.sceneState}
            highlights={activeReplay.currentStep?.highlights || {}}
            stepIndex={currentStepIndex}
            totalSteps={totalStatesCount}
          />

          {/* Direct Input State Informational Notice with AI Generation Action */}
          {sourceMode === 'live' && !liveTrace && !hasReplay && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-xs">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">
                  Initial test-case input state rendered directly. Generate execution animation with AI to watch step-by-step playback.
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleGenerateAiTrace}
                  disabled={isGeneratingAiTrace}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-mono font-bold text-xs shadow-sm cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGeneratingAiTrace ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating AI Trace...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Animation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Centralized Playback & Step Controls Bar */}
          <VisualizationControls
            currentStepIndex={currentStepIndex}
            totalSteps={totalStatesCount}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            playbackStatus={playbackStatus}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            onChangeSpeed={handleChangeSpeed}
            onGenerateAiTrace={handleGenerateAiTrace}
            isGeneratingAiTrace={isGeneratingAiTrace}
          />
        </>
      )}

      {/* Bottom Stage Navigation Footer */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <CheckCircle2
            className={`w-4 h-4 ${isCompleted ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'
              }`}
          />
          <span>
            {isCompleted
              ? 'Stage 09 Visualization execution complete!'
              : hasReplay
                ? 'Step through execution or click Play to complete Stage 09.'
                : 'Initial test-case visualization rendered. Step through or advance to next stage.'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-all flex items-center gap-1.5"
          >
            <ListRestart className="w-3.5 h-3.5" />
            <span>Reset Canvas</span>
          </button>

          {onNextStage && (
            <button
              type="button"
              onClick={onNextStage}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold cursor-pointer shadow-sm transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>Next Stage: Complexity</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

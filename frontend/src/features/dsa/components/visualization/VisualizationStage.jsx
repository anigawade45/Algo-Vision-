import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronRight,
  CheckCircle2,
  ListRestart,
} from 'lucide-react';
import {
  MOCK_VISUALIZATIONS,
  mockVisualizations,
  getMockVisualizationByProblemId,
} from '../../data/mockVisualizations';
import { VisualizationHeader } from './VisualizationHeader';
import { VisualizationProblemSelector } from './VisualizationProblemSelector';
import { VisualizationCanvas } from './VisualizationCanvas';
import { VisualizationControls } from './VisualizationControls';
import { VisualizationStepInfo } from './VisualizationStepInfo';
import { VisualizationStatePanel } from './VisualizationStatePanel';

export function VisualizationStage({
  problem,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
}) {
  // Determine initial mock problem ID based on active problem or fallback to 'two-sum'
  const initialProblemId = useMemo(() => {
    if (problem?.id && mockVisualizations[problem.id]) {
      return problem.id;
    }
    return MOCK_VISUALIZATIONS[0].problemId;
  }, [problem?.id]);

  const [selectedProblemId, setSelectedProblemId] = useState(initialProblemId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // Derive active mock problem object
  const selectedProblem = useMemo(() => {
    return getMockVisualizationByProblemId(selectedProblemId) || MOCK_VISUALIZATIONS[0];
  }, [selectedProblemId]);

  const steps = useMemo(() => {
    return selectedProblem?.visualizationData?.steps || [];
  }, [selectedProblem]);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || null;

  // Reset execution when selecting a new problem
  const handleSelectProblem = useCallback((problemId) => {
    setIsPlaying(false);
    setSelectedProblemId(problemId);
    setCurrentStepIndex(0);
  }, []);

  // Sync initial problem when problem prop changes
  useEffect(() => {
    if (problem?.id && mockVisualizations[problem.id]) {
      setIsPlaying(false);
      setSelectedProblemId(problem.id);
      setCurrentStepIndex(0);
    }
  }, [problem?.id]);

  // Step Navigation Handlers
  const handleNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
  }, [totalSteps]);

  const handlePrevStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return 0;
    });
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStepIndex, totalSteps]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleChangeSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
  }, []);

  // Safe Playback Timer Effect
  useEffect(() => {
    if (!isPlaying || totalSteps === 0) return;

    const intervalMs = Math.max(200, 1000 / playbackSpeed);

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalSteps]);

  // Trigger stage completion when reaching final step
  useEffect(() => {
    if (totalSteps > 0 && currentStepIndex === totalSteps - 1) {
      setIsCompleted(true);
      if (onCompleteStage) {
        onCompleteStage('visualize');
      }
    }
  }, [currentStepIndex, totalSteps, onCompleteStage]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevStep, handleNextStep, handleTogglePlay, handleReset]);

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-8">
      {/* Header Banner & Benchmark Problem Selector */}
      <VisualizationHeader problem={selectedProblem} onOpenSpec={onOpenSpec} />

      <VisualizationProblemSelector
        selectedProblemId={selectedProblemId}
        onSelectProblem={handleSelectProblem}
      />

      {/* Hero Visualization Canvas (Primary Focus) */}
      <VisualizationCanvas
        problem={selectedProblem}
        currentStep={currentStep}
        stepIndex={currentStepIndex}
        totalSteps={totalSteps}
      />

      {/* Operation + Why Explanation (Side-by-side 2-column) */}
      <VisualizationStepInfo
        currentStep={currentStep}
        stepNumber={currentStepIndex + 1}
        totalSteps={totalSteps}
      />

      {/* Centralized Playback & Step Controls Bar */}
      <VisualizationControls
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onChangeSpeed={handleChangeSpeed}
      />

      {/* Collapsible State Inspector */}
      <VisualizationStatePanel
        state={currentStep?.state}
        changed={currentStep?.changed}
      />

      {/* Bottom Stage Navigation Footer */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <CheckCircle2
            className={`w-4 h-4 ${
              isCompleted ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'
            }`}
          />
          <span>
            {isCompleted
              ? 'Stage 09 Visualization execution complete!'
              : 'Step through execution or click Play to complete Stage 09.'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-all flex items-center gap-1.5"
          >
            <ListRestart className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
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

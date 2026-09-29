import React, { useState, useEffect } from 'react';
import { FileText, Check } from 'lucide-react';
import { getPracticeByProblemId } from '../../data/practice';

import PracticeIntro from './PracticeIntro';
import RecallSection from './RecallSection';
import PatternCheck from './PatternCheck';
import GuidedChallenge from './GuidedChallenge';
import IndependentChallenge from './IndependentChallenge';
import VariationChallenge from './VariationChallenge';
import PracticeReview from './PracticeReview';
import RecommendedProblems from './RecommendedProblems';
import PracticeCheckpoint from './PracticeCheckpoint';

/**
 * PRACTICE STAGE
 * Executes independent practice and application challenges.
 */
export function PracticeStage({
  problem,
  problemData,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
  stageNo = '11',
}) {
  const activeProblem = problem || problemData;
  const practiceData = getPracticeByProblemId(activeProblem?.id);

  const [completed, setCompleted] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // User state selections for each section
  const [userRecallAnswers, setUserRecallAnswers] = useState({});
  const [patternCheckOption, setPatternCheckOption] = useState(null);
  const [guidedAnswers, setGuidedAnswers] = useState({});
  const [independentSelections, setIndependentSelections] = useState({});
  const [variationOption, setVariationOption] = useState(null);

  // Reset state when problem changes
  useEffect(() => {
    setCompleted(false);
    setShowIncompleteWarning(false);
    setUserRecallAnswers({});
    setPatternCheckOption(null);
    setGuidedAnswers({});
    setIndependentSelections({});
    setVariationOption(null);
  }, [activeProblem?.id]);

  if (!practiceData) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-sans">
        <p className="text-sm">Practice data unavailable for this problem.</p>
      </div>
    );
  }

  const {
    intro,
    recall,
    patternCheck,
    guidedChallenge,
    independentChallenge,
    variationChallenge,
    hints,
    recommendations,
    takeaway,
  } = practiceData;

  // Handlers for selection updates
  const handleSelectRecall = (qId, optIdx) => {
    setUserRecallAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSelectPatternCheck = (optIdx) => {
    setPatternCheckOption(optIdx);
  };

  const handleSelectGuidedPrompt = (pIdx, optIdx) => {
    setGuidedAnswers((prev) => ({ ...prev, [pIdx]: optIdx }));
  };

  const handleSelectIndependentField = (field, value) => {
    setIndependentSelections((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectVariation = (optIdx) => {
    setVariationOption(optIdx);
  };

  // Activity Completion Verification criteria:
  const recallComplete = !recall || recall.length === 0 || Object.keys(userRecallAnswers).length >= recall.length;
  const patternCheckAttempted = !patternCheck || patternCheckOption !== null;
  const guidedComplete = !guidedChallenge || !guidedChallenge.prompts || Object.keys(guidedAnswers).length >= guidedChallenge.prompts.length;
  const independentAttempted = !independentChallenge || (
    independentSelections.pattern !== undefined &&
    independentSelections.approach !== undefined &&
    independentSelections.reasoning !== undefined &&
    independentSelections.code !== undefined
  );
  const variationAttempted = !variationChallenge || variationOption !== null;

  const attemptedFlags = [recallComplete, patternCheckAttempted, guidedComplete, independentAttempted, variationAttempted];
  const completedCount = attemptedFlags.filter(Boolean).length;
  const totalCount = attemptedFlags.length;

  const canVerifyPractice = recallComplete && patternCheckAttempted && guidedComplete && independentAttempted && variationAttempted;

  const handleCheckpoint = () => {
    if (completed) {
      setCompleted(false);
      setShowIncompleteWarning(false);
      return;
    }

    if (!canVerifyPractice) {
      setShowIncompleteWarning(true);
      return;
    }

    setCompleted(true);
    setShowIncompleteWarning(false);
    if (onCompleteStage) {
      onCompleteStage('practice');
    }
  };

  // Compute 3-State capability evaluation results dynamically ('correct' | 'incorrect' | 'not_attempted')
  const isPatternCorrect =
    patternCheckOption !== null &&
    patternCheck?.options[patternCheckOption]?.isCorrect;

  const patternRecognitionStatus =
    patternCheckOption === null || patternCheckOption === undefined
      ? 'not_attempted'
      : isPatternCorrect
      ? 'correct'
      : 'incorrect';

  const isIndepApproachCorrect =
    independentSelections.approach === independentChallenge?.correctApproach;

  const approachSelectionStatus =
    independentSelections.approach === undefined
      ? 'not_attempted'
      : isIndepApproachCorrect
      ? 'correct'
      : 'incorrect';

  const isIndepReasoningCorrect =
    independentSelections.reasoning === independentChallenge?.correctReasoning;

  const reasoningStatus =
    independentSelections.reasoning === undefined
      ? 'not_attempted'
      : isIndepReasoningCorrect
      ? 'correct'
      : 'incorrect';

  const isIndepPatternCorrect =
    independentSelections.pattern === independentChallenge?.correctPattern;
  const isCodeSubmitted = independentSelections.code !== undefined;

  const independentSolveStatus =
    independentSelections.pattern === undefined &&
    independentSelections.approach === undefined &&
    independentSelections.reasoning === undefined &&
    !isCodeSubmitted
      ? 'not_attempted'
      : isIndepPatternCorrect && isIndepApproachCorrect && isIndepReasoningCorrect && isCodeSubmitted
      ? 'correct'
      : 'incorrect';

  const isVariationCorrect =
    variationOption !== null &&
    variationOption === variationChallenge?.correctAnswer;

  const adaptationStatus =
    variationOption === null || variationOption === undefined
      ? 'not_attempted'
      : isVariationCorrect
      ? 'correct'
      : 'incorrect';

  const evaluationResults = {
    patternRecognition: {
      label: 'Pattern Recognition',
      status: patternRecognitionStatus,
      source: 'Pattern Check (Section 03)',
    },
    approachSelection: {
      label: 'Approach Selection',
      status: approachSelectionStatus,
      source: 'Independent Challenge (Section 05)',
    },
    reasoning: {
      label: 'Reasoning & Logic',
      status: reasoningStatus,
      source: 'Independent Challenge (Section 05)',
    },
    independentSolve: {
      label: 'Independent Solve',
      status: independentSolveStatus,
      source: 'Independent Challenge (Section 05)',
    },
    adaptation: {
      label: 'Constraint Adaptation',
      status: adaptationStatus,
      source: 'Variation Challenge (Section 06)',
    },
  };

  // Dynamically classify mistakes using Mistake Taxonomy
  const mistakes = [];

  if (patternCheckOption !== null && !isPatternCorrect) {
    mistakes.push({
      type: 'PATTERN MISTAKE',
      description:
        'Did not recognize the underlying structural pattern in the new scenario. Focus on how data relationships are queried or traversed.',
    });
  }

  if (
    independentSelections.pattern !== undefined &&
    !isIndepPatternCorrect
  ) {
    mistakes.push({
      type: 'PATTERN MISTAKE',
      description:
        'Selected an incompatible pattern family for the independent challenge problem.',
    });
  }

  if (
    independentSelections.approach !== undefined &&
    !isIndepApproachCorrect
  ) {
    mistakes.push({
      type: 'APPROACH MISTAKE',
      description:
        'Recognized structural signals but selected an inefficient or improper approach strategy.',
    });
  }

  if (
    independentSelections.reasoning !== undefined &&
    !isIndepReasoningCorrect
  ) {
    mistakes.push({
      type: 'REASONING MISTAKE',
      description:
        'The operational approach was valid, but the core invariant or variable movement reasoning was incomplete.',
    });
  }

  if (variationOption !== null && !isVariationCorrect) {
    mistakes.push({
      type: 'EDGE-CASE / VARIATION MISTAKE',
      description:
        'Main concept was recognized, but boundary adaptation for changed constraints was missed.',
    });
  }

  const handleRetry = () => {
    setIndependentSelections({});
    setPatternCheckOption(null);
    setVariationOption(null);
    setShowIncompleteWarning(false);
  };

  // Dynamic Section Counter helper
  let sectionCounter = 1;
  const getNextSectionNo = () => {
    const num = sectionCounter++;
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <div className="space-y-7 font-sans w-full pb-12">
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-500 dark:text-blue-400/90 tracking-[0.08em] uppercase leading-none">
              {stageNo}  ·  PRACTICE
            </span>
            {activeProblem?.category && (
              <span className="inline-flex items-center px-2.5 py-0.75 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
                {activeProblem.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onOpenSpec && (
              <button
                type="button"
                onClick={onOpenSpec}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-mono font-bold cursor-pointer border border-blue-200 dark:border-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors duration-150 motion-reduce:transition-none"
              >
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Problem Spec</span>
              </button>
            )}

            {completed && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Check className="w-3.5 h-3.5" aria-hidden="true" /> Practice Verified
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          {intro?.title || 'Now Solve Without the Walkthrough'}
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          {intro?.subtitle || "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself."}
        </p>
      </header>

      {/* GUIDED SEQUENCE SECTIONS */}
      <div className="space-y-11 sm:space-y-12">

        {/* LEARNED CONCEPT CONTEXT */}
        {intro && <PracticeIntro intro={intro} sectionNo={getNextSectionNo()} />}

        {recall && recall.length > 0 && <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />}

        {/* RECALL MENTAL MODEL */}
        {recall && recall.length > 0 && (
          <RecallSection
            questions={recall}
            userAnswers={userRecallAnswers}
            onSelectAnswer={handleSelectRecall}
            sectionNo={getNextSectionNo()}
          />
        )}

        {patternCheck && <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />}

        {/* PATTERN RECOGNITION CHECK */}
        {patternCheck && (
          <PatternCheck
            patternCheck={patternCheck}
            selectedOption={patternCheckOption}
            onSelectOption={handleSelectPatternCheck}
            sectionNo={getNextSectionNo()}
          />
        )}

        {guidedChallenge && <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />}

        {/* GUIDED CHALLENGE */}
        {guidedChallenge && (
          <GuidedChallenge
            guidedChallenge={guidedChallenge}
            userAnswers={guidedAnswers}
            onSelectPromptAnswer={handleSelectGuidedPrompt}
            sectionNo={getNextSectionNo()}
          />
        )}

        {independentChallenge && <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />}

        {/* INDEPENDENT CHALLENGE */}
        {independentChallenge && (
          <IndependentChallenge
            challenge={independentChallenge}
            selections={independentSelections}
            onSelectField={handleSelectIndependentField}
            sectionNo={getNextSectionNo()}
          />
        )}

        {variationChallenge && <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />}

        {/* CONSTRAINT VARIATION CHALLENGE */}
        {variationChallenge && (
          <VariationChallenge
            variationChallenge={variationChallenge}
            selectedOption={variationOption}
            onSelectOption={handleSelectVariation}
            sectionNo={getNextSectionNo()}
          />
        )}

        <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />

        {/* PRACTICE REVIEW, MISTAKE DIAGNOSIS & HINTS */}
        <PracticeReview
          evaluationResults={evaluationResults}
          mistakes={mistakes}
          hints={hints}
          onRetry={handleRetry}
          sectionNo={getNextSectionNo()}
        />

        {recommendations && recommendations.length > 0 && <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />}

        {/* CONTINUE PRACTICING ON REAL PLATFORMS */}
        {recommendations && recommendations.length > 0 && (
          <RecommendedProblems
            recommendations={recommendations}
            sectionNo={getNextSectionNo()}
          />
        )}

      </div>

      {/* PRACTICE CHECKPOINT */}
      <PracticeCheckpoint
        completed={completed}
        onCheckpoint={handleCheckpoint}
        onNextStage={onNextStage}
        takeaway={takeaway}
        canVerify={canVerifyPractice}
        completedCount={completedCount}
        totalCount={totalCount}
        showIncompleteWarning={showIncompleteWarning}
        evaluationResults={evaluationResults}
        sectionNo={getNextSectionNo()}
        stageNo={stageNo}
      />
    </div>
  );
}

export default PracticeStage;

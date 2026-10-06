import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Check, ArrowRight, RotateCcw, ChevronRight, Loader2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { getQuizByProblemId } from '../../data/quiz';
import { getProblemPractice, generateProblemPractice, regenerateProblemPractice } from '@/api/dsa.api';

/**
 * PRACTICE STAGE
 * A problem-specific and approach-specific 10-question technical quiz to test DSA comprehension.
 */
export function PracticeStage({
  problem,
  problemData,
  selectedApproachId,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
  stageNo = '11',
}) {
  const activeProblem = problem || problemData;
  const activeApproachId = selectedApproachId || 'hashTable';
  const targetProblemId = activeProblem?.problemId || activeProblem?._id || activeProblem?.id;

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // Array of { questionId, selectedOption, isCorrect }
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleGenerate = async (isMountedRef = { current: true }) => {
    setIsGenerating(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateProblemPractice(targetProblemId, activeApproachId);

      if (isMountedRef.current === false) return;

      const data = response.data?.data || response.data || {};
      const practiceDoc = data.practice;

      if (practiceDoc && practiceDoc.questions && practiceDoc.questions.length > 0) {
        setQuizQuestions(practiceDoc.questions);
        setIsStale(false);
        resetQuizState();
      } else {
        throw new Error('Server returned an empty practice quiz.');
      }
    } catch (err) {
      if (isMountedRef.current === false) return;
      console.error('[PracticeStage] Quiz generation error:', err);
      const errMessage = err.response?.data?.message || err.message || 'Unable to generate Knowledge Check quiz.';
      setError(errMessage);
    } finally {
      if (isMountedRef.current !== false) {
        setIsGenerating(false);
        setIsLoading(false);
      }
    }
  };

  const fetchPractice = useCallback(async (isMountedRef) => {
    if (!targetProblemId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getProblemPractice(targetProblemId, activeApproachId);

      if (!isMountedRef.current) return;

      const data = response.data?.data || response.data || {};
      const practiceDoc = data.practice;
      const staleStatus = data.stale || false;

      if (practiceDoc && practiceDoc.questions && practiceDoc.questions.length > 0) {
        setQuizQuestions(practiceDoc.questions);
        setIsStale(staleStatus);
        setIsLoading(false);
      } else {
        // Fallback to static mock data if available
        const mockQuiz = getQuizByProblemId(targetProblemId);
        if (mockQuiz && mockQuiz.questions && mockQuiz.questions.length > 0) {
          setQuizQuestions(mockQuiz.questions);
          setIsStale(false);
          setIsLoading(false);
        } else {
          // Auto-generate via backend Gemini AI
          handleGenerate(isMountedRef);
        }
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.warn('[PracticeStage] Failed to fetch saved practice quiz, falling back to mock or generate:', err.message);

      const mockQuiz = getQuizByProblemId(targetProblemId);
      if (mockQuiz && mockQuiz.questions && mockQuiz.questions.length > 0) {
        setQuizQuestions(mockQuiz.questions);
        setIsStale(false);
        setIsLoading(false);
      } else {
        handleGenerate(isMountedRef);
      }
    }
  }, [targetProblemId, activeApproachId]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await regenerateProblemPractice(targetProblemId, activeApproachId);
      const data = response.data?.data || response.data || {};
      const practiceDoc = data.practice;

      if (practiceDoc && practiceDoc.questions && practiceDoc.questions.length > 0) {
        setQuizQuestions(practiceDoc.questions);
        setIsStale(false);
        resetQuizState();
      } else {
        throw new Error('Server returned an empty practice quiz.');
      }
    } catch (err) {
      console.error('[PracticeStage] Quiz regeneration error:', err);
      const errMessage = err.response?.data?.message || err.message || 'Unable to regenerate Knowledge Check quiz.';
      setError(errMessage);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const resetQuizState = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setUserAnswers([]);
    setIsQuizComplete(false);
    setShowReview(false);
  };

  useEffect(() => {
    const isMountedRef = { current: true };
    resetQuizState();

    fetchPractice(isMountedRef);

    return () => {
      isMountedRef.current = false;
    };
  }, [targetProblemId, activeApproachId, fetchPractice]);

  const questions = quizQuestions;
  const currentQuestion = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === Math.max(0, questions.length - 1);
  const totalCount = questions.length;

  const handleSubmit = () => {
    if (selectedOption === null || !currentQuestion) return;
    
    setHasSubmitted(true);
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIdx] = {
        questionId: currentQuestion.id || currentQuestion.questionNumber || currentQuestionIdx + 1,
        selectedOption,
        isCorrect
      };
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsQuizComplete(true);
      if (onCompleteStage) {
        onCompleteStage('practice');
      }
    } else {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  };

  const handleRetry = () => {
    resetQuizState();
  };

  const handleReview = () => {
    setShowReview(true);
  };

  // Compute Score
  const correctCount = userAnswers.filter((a) => a && a.isCorrect).length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-7 font-sans w-full pb-12">
      {/* HEADER */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-500 dark:text-blue-400/90 tracking-[0.08em] uppercase leading-none">
              {stageNo}  ·  QUIZ
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

            {isQuizComplete && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Check className="w-3.5 h-3.5" aria-hidden="true" /> Quiz Completed
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          Knowledge Check
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          Test your understanding of the {activeProblem?.title || 'problem'} implementation, logic, and complexity.
        </p>
      </header>

      {/* STALE BANNER */}
      {isStale && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-amber-900 dark:text-amber-200 text-sm font-sans">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
            <span>This Knowledge Check quiz was generated for an earlier version of code or algorithm and may be outdated.</span>
          </div>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Regenerate Quiz</span>
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 space-y-4 my-6">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" aria-hidden="true" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {isGenerating ? 'Generating Knowledge Check Quiz...' : 'Loading Knowledge Check Quiz...'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Analyzing problem context, constraints, implementation logic, and complexities to build 10 targeted questions...
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {!isLoading && error && (
        <div className="p-8 text-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-4 my-6">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" aria-hidden="true" />
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 font-mono">
            Knowledge Check Quiz Unavailable
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => handleGenerate()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold cursor-pointer shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Retry AI Quiz Generation</span>
          </button>
        </div>
      )}

      {/* QUIZ CONTENT WHEN READY */}
      {!isLoading && !error && currentQuestion && (
        <>
          {!isQuizComplete ? (
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Question {currentQuestionIdx + 1} of {totalCount}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                    {currentQuestion.type || 'concept'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQuestionIdx + 1) / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 whitespace-pre-wrap">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {(currentQuestion.options || []).map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = currentQuestion.correctAnswer === idx;
                  
                  let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ";
                  
                  if (!hasSubmitted) {
                    btnClass += isSelected 
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500 ring-1 ring-blue-500" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80";
                  } else {
                    if (isCorrectOption) {
                      btnClass += "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-500/50";
                    } else if (isSelected && !isCorrectOption) {
                      btnClass += "bg-rose-50 dark:bg-rose-900/20 border-rose-500 dark:border-rose-500/50";
                    } else {
                      btnClass += "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-50";
                    }
                  }

                  const letters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={btnClass}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold ${
                        hasSubmitted && isCorrectOption ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                        hasSubmitted && isSelected && !isCorrectOption ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400' :
                        isSelected ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' : 
                        'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {letters[idx] || idx + 1}
                      </span>
                      <span className={`flex-1 text-[15px] pt-0.5 ${
                        hasSubmitted && isCorrectOption ? 'text-emerald-900 dark:text-emerald-100 font-medium' :
                        hasSubmitted && isSelected && !isCorrectOption ? 'text-rose-900 dark:text-rose-100' :
                        isSelected ? 'text-blue-900 dark:text-blue-100 font-medium' : 
                        'text-slate-700 dark:text-slate-300'
                      }`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {hasSubmitted && (
                <div className={`mb-8 p-5 rounded-xl border ${
                  selectedOption === currentQuestion.correctAnswer 
                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' 
                    : 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedOption === currentQuestion.correctAnswer ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <Check className="w-5 h-5" /> Correct!
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                        ✗ Incorrect
                      </span>
                    )}
                  </div>
                  
                  {selectedOption !== currentQuestion.correctAnswer && (
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-1">
                      Correct Answer: {['A','B','C','D'][currentQuestion.correctAnswer]}. {currentQuestion.options[currentQuestion.correctAnswer]}
                    </div>
                  )}
                  
                  <div className="text-[14px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Explanation:</span> {currentQuestion.explanation}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end">
                {!hasSubmitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {isLastQuestion ? 'View Results' : 'Next Question'}
                    {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ) : showReview ? (
            /* REVIEW ANSWERS */
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Answers</h2>
                <button
                  onClick={() => setShowReview(false)}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Back to Results
                </button>
              </div>
              
              {questions.map((q, i) => {
                const answer = userAnswers[i];
                const isCorrect = answer?.isCorrect;
                const letters = ['A', 'B', 'C', 'D'];
                
                return (
                  <div key={q.id || i} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 whitespace-pre-wrap">{q.question}</h3>
                        
                        <div className="space-y-3 mb-4 text-[14px]">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-slate-500 w-24">Your Answer:</span>
                            <span className={isCorrect ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-rose-600 dark:text-rose-400 font-medium"}>
                              {answer?.selectedOption !== null && answer?.selectedOption !== undefined ? `${letters[answer.selectedOption]}. ${q.options[answer.selectedOption]}` : 'Skipped'}
                            </span>
                          </div>
                          
                          {!isCorrect && (
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-slate-500 w-24">Correct:</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                {letters[q.correctAnswer]}. {q.options[q.correctAnswer]}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-[14px] text-slate-700 dark:text-slate-300">
                          <span className="font-semibold block mb-1">Explanation:</span>
                          {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry Quiz
                </button>
              </div>
            </div>
          ) : (
            /* QUIZ RESULTS */
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 sm:p-12 shadow-sm text-center">
              <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 mb-6">
                <Check className="w-10 h-10" />
              </div>
              
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">QUIZ COMPLETED</h2>
              
              <div className="flex justify-center items-center gap-8 my-10">
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-900 dark:text-white">{correctCount} <span className="text-xl text-slate-400">/ {totalCount}</span></div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">Score</div>
                </div>
                
                <div className="w-px h-16 bg-slate-200 dark:bg-slate-800"></div>
                
                <div className="text-center">
                  <div className={`text-4xl font-black ${percentage >= 70 ? 'text-emerald-500' : percentage >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {percentage}%
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">Accuracy</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleReview}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Review Answers
                </button>
                <button
                  onClick={handleRetry}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry Quiz
                </button>
                {onNextStage && (
                  <button
                    onClick={onNextStage}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Back to Workspace <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PracticeStage;

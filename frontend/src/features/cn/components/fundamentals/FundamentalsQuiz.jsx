import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Award, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { FUNDAMENTALS_QUIZ } from '../../data/fundamentalsData';

export function FundamentalsQuiz({ onCompleteStep, isCompleted }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const totalQuestions = FUNDAMENTALS_QUIZ.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  
  const score = FUNDAMENTALS_QUIZ.reduce((acc, q) => {
    if (selectedAnswers[q.id] === q.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const isAllAnswered = answeredCount === totalQuestions;
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Quiz Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono font-semibold mb-1">
              <HelpCircle className="w-3 h-3 text-emerald-500" />
              <span>MODULE ASSESSMENT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Fundamentals Knowledge Check
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Verify your comprehension of network topologies, hardware devices, geographical scopes, and architecture models.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Quiz</span>
            </button>
          </div>
        </div>

        {/* Score Card Banner when submitted */}
        {submitted && (
          <div className="p-6 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <Trophy className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  Quiz Completed: {score} / {totalQuestions} Correct ({scorePercentage}%)
                </h3>
                <p className="text-xs text-emerald-100">
                  {score === totalQuestions
                    ? 'Perfect score! You have mastered Computer Network Fundamentals.'
                    : 'Great job! Review the explanations below to solidify your understanding.'}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold">
              Grade: {scorePercentage >= 80 ? 'Mastery (A+)' : scorePercentage >= 60 ? 'Proficient (B)' : 'Needs Review'}
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6 pt-2">
          {FUNDAMENTALS_QUIZ.map((q, qIdx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = submitted && selectedOpt === q.correctAnswer;
            const isWrong = submitted && selectedOpt !== undefined && selectedOpt !== q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                    : 'bg-slate-50 dark:bg-[#111827] border-slate-200/70 dark:border-[#1E2638]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-start gap-2">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">Q{qIdx + 1}.</span>
                    <span>{q.question}</span>
                  </h3>
                  {submitted && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </span>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isCorrectAnswer = submitted && optIdx === q.correctAnswer;

                    let optStyle = 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400';

                    if (submitted) {
                      if (isCorrectAnswer) {
                        optStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
                      } else if (isSelected && !isCorrectAnswer) {
                        optStyle = 'bg-rose-600 text-white font-bold border-rose-600';
                      } else {
                        optStyle = 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${optStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                          isSelected || isCorrectAnswer ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card after submission */}
                {submitted && (
                  <div className="mt-4 p-3.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white block mb-1 font-mono text-[11px] uppercase">
                      Explanation:
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        {!submitted && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                setSubmitted(true);
                if (onCompleteStep) onCompleteStep();
              }}
              disabled={!isAllAnswered}
              className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all ${
                isAllAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:scale-102'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isAllAnswered ? 'Submit & Review Answers' : `Answer all questions (${answeredCount}/${totalQuestions})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

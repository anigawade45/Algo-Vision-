import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RATE_LIMIT_QUIZ_QUESTIONS } from '../../data/rateLimitingData';

export function RateLimitingQuizSection() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    RATE_LIMIT_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = RATE_LIMIT_QUIZ_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);
  const totalQuestions = RATE_LIMIT_QUIZ_QUESTIONS.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Knowledge Assessment • Step 6 of 6</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Rate Limiting &amp; Traffic Control Mastery Quiz
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Validate your knowledge of Token Bucket vs. Leaky Bucket, boundary burst anomalies, HTTP 429 Retry-After headers, full jitter backoff, and distributed Redis rate limiters.
              </p>
            </div>
          </div>

          {submitted && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 text-center shrink-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Final Score</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                {score} / {totalQuestions}
              </p>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {score === totalQuestions ? '🌟 Perfect Score!' : score >= 3 ? '👍 Solid Understanding' : '🔄 Needs Review'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Questions List */}
      <div className="space-y-6">
        {RATE_LIMIT_QUIZ_QUESTIONS.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/10'
                    : 'border-rose-300 dark:border-rose-900/60 bg-rose-50/10'
                  : 'border-slate-200 dark:border-[#1E2638]'
              } shadow-sm`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono">
                  Q{qIndex + 1}
                </div>
                <div className="space-y-3.5 flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {q.options.map((option, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      let optionStyle = 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-400';

                      if (submitted) {
                        if (optIdx === q.correctIndex) {
                          optionStyle = 'bg-emerald-100/70 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'bg-rose-100/70 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                        } else {
                          optionStyle = 'bg-slate-50/40 dark:bg-[#0B101D]/40 border-slate-100 dark:border-slate-800/60 text-slate-400';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-purple-100/60 dark:bg-purple-950/50 border-purple-600 text-purple-900 dark:text-purple-200 font-semibold shadow-sm';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-mono font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{option}</span>
                          </div>

                          {submitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          {submitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation upon submit */}
                  {submitted && (
                    <div
                      className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1 ${
                        isCorrect
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                          : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'
                      }`}
                    >
                      <span className="font-bold block">
                        {isCorrect ? '✓ Correct!' : '✗ Explanation:'}
                      </span>
                      <p className="leading-relaxed opacity-90">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Submit / Score Recap */}
      {!submitted ? (
        <div className="flex items-center justify-between p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Answered {Object.keys(selectedAnswers).length} of {totalQuestions} questions
          </div>
          <button
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit Quiz &amp; View Results</span>
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/60 p-6 sm:p-8 text-white space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-800/60 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-300">
                Module 6 • API Gateways &amp; Traffic Control Complete
              </span>
              <h3 className="text-2xl font-bold mt-1">
                {percentage >= 75 ? '🎉 Outstanding Mastery!' : 'Well Done!'}
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-xl leading-relaxed">
                You have mastered Token Bucket, Leaky Bucket, Sliding Window algorithms, HTTP 429 rate limit header handling, Full Jitter backoff, and distributed Redis rate limiters.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-3xl sm:text-4xl font-black font-mono text-purple-300">
                {score} / {totalQuestions}
              </span>
              <span className="block text-xs font-mono text-purple-300/80 mt-0.5">
                {percentage}% Score
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            <Link
              to="/systemdesign"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              <span>Back to System Design Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default RateLimitingQuizSection;

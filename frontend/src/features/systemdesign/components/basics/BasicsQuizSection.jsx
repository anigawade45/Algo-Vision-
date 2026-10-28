import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Layers,
  Server
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/basicsModuleData';

export function BasicsQuizSection({ onCompleteStep }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId, optionIdx) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleCalculateScore = () => {
    setSubmitted(true);
    if (onCompleteStep) onCompleteStep();
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  ).length;

  const isAllAnswered = QUIZ_QUESTIONS.every((q) => userAnswers[q.id] !== undefined);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Quiz Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Checkpoint Knowledge Quiz
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Validate your understanding of system design fundamentals, client-server data flow, and scalability.
              </p>
            </div>
          </div>

          {submitted && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Score: {correctCount} / {QUIZ_QUESTIONS.length} ({Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, qIndex) => {
          const selectedOption = userAnswers[q.id];
          const isCorrect = submitted && selectedOption === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-6 sm:p-7 rounded-3xl border transition-all space-y-4 ${submitted
                  ? isCorrect
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80 shadow-sm'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#1E2638] shadow-sm'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                    Question {qIndex + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {q.question}
                  </h3>
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isOptSelected = selectedOption === optIdx;
                  const isOptCorrectAnswer = submitted && optIdx === q.correctIndex;

                  let optClass = 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-800';

                  if (isOptSelected && !submitted) {
                    optClass = 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-900 dark:text-purple-100 ring-2 ring-purple-500/20';
                  } else if (submitted) {
                    if (isOptCorrectAnswer) {
                      optClass = 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-semibold ring-2 ring-emerald-500/20';
                    } else if (isOptSelected && !isCorrect) {
                      optClass = 'bg-rose-100/70 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 font-semibold';
                    } else {
                      optClass = 'opacity-50 bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {submitted && isOptCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when submitted */}
              {submitted && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    Explanation:
                  </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm">
        <div>
          {!submitted ? (
            <p className="text-xs text-slate-500 font-mono">
              {Object.keys(userAnswers).length} of {QUIZ_QUESTIONS.length} questions answered
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-mono">
              Quiz completed! You scored {correctCount} of {QUIZ_QUESTIONS.length}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {submitted ? (
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          ) : (
            <button
              onClick={handleCalculateScore}
              disabled={!isAllAnswered}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit &amp; Check Answers</span>
            </button>
          )}
        </div>
      </div>

      {/* Module Mastered Summary Recap */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Module 1 Key Takeaways</span>
            </span>
            <h3 className="text-xl font-bold">System Design Basics Mastered!</h3>
          </div>

          <Link
            to="/systemdesign"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-purple-50 font-bold text-xs shadow-lg transition-all"
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Return to Tracks Directory</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs relative z-10 text-purple-100">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-purple-300" />
              <span>Client-Server Separation</span>
            </h4>
            <p className="leading-relaxed opacity-90">
              Clear abstraction between frontend rendering and backend business logic enables independent scaling and multi-platform support.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Stateless Horizontality</span>
            </h4>
            <p className="leading-relaxed opacity-90">
              Removing local session state from app servers allows adding commodity servers behind load balancers with zero session loss.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-300" />
              <span>Trade-off Driven Design</span>
            </h4>
            <p className="leading-relaxed opacity-90">
              There is no single "best" architecture. Great engineers balance consistency vs. latency, and cost vs. 5-nines availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

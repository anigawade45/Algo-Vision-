import { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';
import { LB_QUIZ_QUESTIONS } from '../../data/loadBalancingData';

export default function LbQuizSection() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    LB_QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = LB_QUIZ_QUESTIONS.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#1E2638] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Knowledge Checkpoint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Load Balancing Mastery Quiz
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Test your understanding of traffic distribution algorithms, L4 vs L7 routing, health checks, SPOF elimination, and vertical vs horizontal scaling trade-offs.
            </p>
          </div>

          {submitted && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 text-center shrink-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Final Score</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                {score} / {LB_QUIZ_QUESTIONS.length}
              </p>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {score === LB_QUIZ_QUESTIONS.length ? '🌟 Perfect Score!' : score >= 2 ? '👍 Solid Understanding' : '🔄 Needs Review'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {LB_QUIZ_QUESTIONS.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-[#111827] rounded-2xl p-6 border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/10'
                    : 'border-rose-300 dark:border-rose-900/60 bg-rose-50/10'
                  : 'border-slate-200 dark:border-[#1E2638]'
              } shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                  Q{qIndex + 1}
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      let optionStyle = 'bg-slate-50 dark:bg-[#161F30] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-400';

                      if (submitted) {
                        if (optIdx === q.correctIndex) {
                          optionStyle = 'bg-emerald-100/70 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'bg-rose-100/70 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                        } else {
                          optionStyle = 'bg-slate-50/40 dark:bg-[#161F30]/40 border-slate-100 dark:border-slate-800/60 text-slate-400';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-purple-100/60 dark:bg-purple-950/50 border-purple-600 text-purple-900 dark:text-purple-200 font-semibold shadow-sm';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">
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

                  {/* Explanation after submission */}
                  {submitted && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Explanation: </span>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1E2638] shadow-sm">
        <div>
          {!submitted ? (
            <p className="text-xs text-slate-500">
              {Object.keys(selectedAnswers).length} of {LB_QUIZ_QUESTIONS.length} questions answered
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Review completed! Check the explanations above to reinforce your architectural mental model.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {submitted ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Submit Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Recap Card */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-purple-800/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-purple-300" />
          <h3 className="text-lg font-bold">Key Architectural Takeaways</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-purple-100">
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-300" /> Algorithm Selection
            </p>
            <p className="text-purple-200 text-xs">
              Use <strong>Round Robin</strong> for uniform lightweight requests. Use <strong>Least Connections</strong> or <strong>Weighted Response Time</strong> for heavy or uneven request durations.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Health Probes &amp; Failover
            </p>
            <p className="text-purple-200 text-xs">
              Health checks must use a 2-3 strike threshold to avoid route thrashing. Pair load balancers with <strong>VRRP (Keepalived)</strong> or <strong>DNS Anycast</strong> to eliminate single points of failure.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-300" /> Horizontal Scalability
            </p>
            <p className="text-purple-200 text-xs">
              Horizontal scaling with stateless application servers provides fault tolerance, linear cloud cost scaling, and zero-downtime rolling updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

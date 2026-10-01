import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  FolderCode,
  ArrowRight,
  Loader2,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  FileCode2,
  CheckCircle2,
} from 'lucide-react';
import { DsaNavbar } from '../components/home/DsaNavbar';
import { getMyProblems } from '@/api/dsa.api';

export default function MyProblems({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyProblems();
      if (res?.success && Array.isArray(res?.data?.problems)) {
        setProblems(res.data.problems);
      } else {
        setProblems([]);
      }
    } catch (err) {
      console.error('Failed to fetch user problems:', err);
      setError('Could not load your submitted problems. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProblems();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
      case 'hard':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60';
      default:
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Shell Navbar */}
      <DsaNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        onNavigateToLanding={() => navigate('/')}
        onNavigateToHome={() => navigate('/dsa')}
        onNavigateToSubmit={() => navigate('/dsa/problem/new')}
      />

      {/* Main Page Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2638] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <FolderCode className="w-3.5 h-3.5" />
              <span>USER PROBLEM REPOSITORY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>My Submitted Problems</span>
              {!loading && (
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {problems.length}
                </span>
              )}
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
              All DSA problems created or submitted by you for breakdown, dry run, and visual analysis.
            </p>
          </div>

          <Link
            to="/dsa/problem/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Problem</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Loading your problem repository...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && problems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 px-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-center max-w-lg mx-auto space-y-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Submitted Problems Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You haven't submitted any custom DSA problems. Click below to add a new problem and analyze it step by step.
              </p>
            </div>

            <Link
              to="/dsa/problem/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Your First Problem</span>
            </Link>
          </motion.div>
        )}

        {/* Problems List / Cards Grid */}
        {!loading && !error && problems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => {
              const problemId = problem.problemId || problem.id || problem._id;
              const dateStr = problem.createdAt
                ? new Date(problem.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <motion.div
                  key={problemId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/50">
                        {problem.category || 'General'}
                      </span>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty || 'Medium'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {problem.title}
                    </h3>

                    {/* Description Snippet */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {problem.description || 'No detailed description provided.'}
                    </p>

                    {/* Meta information */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>{problem.testCases?.length || 1} Test Cases</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#162032]">
                    <button
                      type="button"
                      onClick={() => navigate(`/dsa/workspace/${problemId}`)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-[#070A12] dark:hover:bg-blue-950/40 border border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>Solve in Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

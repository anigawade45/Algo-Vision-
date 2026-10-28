import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  ArrowLeft,
  LayoutDashboard,
  Sun,
  Moon,
  ArrowRight
} from 'lucide-react';
import DbScalingHero from '../components/scaling/DbScalingHero';
import SqlNoSqlExplorer from '../components/scaling/SqlNoSqlExplorer';
import DbIndexingSimulator from '../components/scaling/DbIndexingSimulator';
import ReplicationSimulator from '../components/scaling/ReplicationSimulator';
import DbShardingSimulator from '../components/scaling/DbShardingSimulator';
import ReadWriteScalingMatrix from '../components/scaling/ReadWriteScalingMatrix';
import DbScalingQuizSection from '../components/scaling/DbScalingQuizSection';
import { DB_SCALING_STEPS } from '../data/dbScalingData';

export function Scaling({ theme, toggleTheme }) {
  const [activeStep, setActiveStep] = useState('sql-nosql');

  const currentStepIdx = DB_SCALING_STEPS.findIndex((s) => s.id === activeStep);

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setActiveStep(DB_SCALING_STEPS[currentStepIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < DB_SCALING_STEPS.length - 1) {
      setActiveStep(DB_SCALING_STEPS[currentStepIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-purple-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/systemdesign" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/20">
                <Database className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                AlgoVision SD
              </span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer">
                Dashboard
              </Link>
              <span>/</span>
              <Link to="/systemdesign" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                System Design
              </Link>
              <span>/</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold truncate max-w-[150px] sm:max-w-none">
                Database Scaling &amp; Sharding
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}

            <Link
              to="/systemdesign"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to SD Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stepwise Tracker & Hero */}
        <DbScalingHero
          activeStep={activeStep}
          onSelectStep={(stepId) => {
            setActiveStep(stepId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Dynamic Section Renderer based on Active Step */}
        <div className="pt-2">
          {activeStep === 'sql-nosql' && <SqlNoSqlExplorer />}
          {activeStep === 'indexing' && <DbIndexingSimulator />}
          {activeStep === 'replication' && <ReplicationSimulator />}
          {activeStep === 'sharding' && <DbShardingSimulator />}
          {activeStep === 'matrix' && <ReadWriteScalingMatrix />}
          {activeStep === 'quiz' && <DbScalingQuizSection />}
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIdx === 0}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                : 'border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer'
              }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Step {currentStepIdx + 1} of {DB_SCALING_STEPS.length}
          </span>

          <button
            onClick={handleNextStep}
            disabled={currentStepIdx === DB_SCALING_STEPS.length - 1}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentStepIdx === DB_SCALING_STEPS.length - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 cursor-pointer'
              }`}
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default Scaling;
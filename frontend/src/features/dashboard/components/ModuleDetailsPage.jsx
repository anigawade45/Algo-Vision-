import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Binary,
  Cpu,
  Wifi,
  Server,
  ArrowLeft,
  Sparkles,
  Bot,
  LayoutDashboard,
  Clock,
  Rocket
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { DashboardNavbar } from './DashboardNavbar';
import { FloatingAiMentor } from './FloatingAiMentor';
import { VisualizerModal, QuizModal } from './InteractiveModals';
import { coreModules } from '../data/mockDashboardData';

const iconMap = {
  dsa: Binary,
  os: Cpu,
  networks: Wifi,
  sysdesign: Server,
};

export function ModuleDetailsPage({ theme, toggleTheme }) {
  const { moduleId = 'dsa' } = useParams();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId]);

  const currentModule =
    coreModules.find((m) => m.id === moduleId) || coreModules[0];
  const Icon = iconMap[currentModule.id] || Binary;

  const getAccentGlow = () => {
    switch (currentModule.id) {
      case 'os':
        return 'from-cyan-600/20 via-cyan-500/10 to-transparent';
      case 'networks':
        return 'from-emerald-600/20 via-emerald-500/10 to-transparent';
      case 'sysdesign':
        return 'from-purple-600/20 via-purple-500/10 to-transparent';
      default:
        return 'from-blue-600/20 via-indigo-500/10 to-transparent';
    }
  };

  const getBadgeColor = () => {
    switch (currentModule.id) {
      case 'os':
        return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'networks':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'sysdesign':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200 font-sans">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenAiMentor={() => setIsAiMentorOpen(true)}
        onOpenVisualizer={() => setIsVisualizerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* 2. Main Body Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <DashboardNavbar
          theme={theme}
          toggleTheme={toggleTheme}
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAiMentor={() => setIsAiMentorOpen(true)}
          onSelectTopic={() => setIsVisualizerOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
              to="/dashboard"
              className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              {currentModule.name}
            </span>
          </div>

          {/* Module Header Card */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-96 h-96 bg-linear-to-bl ${getAccentGlow()} rounded-full blur-3xl pointer-events-none`}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${currentModule.colorTheme.iconBg} flex items-center justify-center shadow-md shrink-0`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor()}`}>
                    {currentModule.badgeText}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                    {currentModule.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentModule.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Coming Soon Card */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 p-10 sm:p-14 text-center shadow-xs space-y-6 relative overflow-hidden">
            {/* Ambient Backlight */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            <div className="relative z-10 max-w-md mx-auto space-y-4">
              {/* Icon / Rocket */}
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center mx-auto shadow-md">
                <Rocket className="w-8 h-8 animate-bounce" />
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Under Active Development
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white pt-1">
                  Modules Coming Soon
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  We are actively building interactive visualizer engines, AI dry-run code sandboxes, and comprehensive assessment quizzes for{' '}
                  <strong className="text-slate-900 dark:text-white">{currentModule.name}</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {currentModule.id === 'os' ? (
                  <Link
                    to="/os"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 hover:scale-102 transition-all"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Launch OS Dashboard & Simulators</span>
                  </Link>
                ) : currentModule.id === 'dsa' ? (
                  <Link
                    to="/dsa"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:scale-102 transition-all"
                  >
                    <Binary className="w-4 h-4" />
                    <span>Launch DSA Platform</span>
                  </Link>
                ) : null}

                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:scale-102 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Link>

                <button
                  onClick={() => setIsAiMentorOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-blue-500" />
                  <span>Ask AI Mentor</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating AI Mentor */}
      <FloatingAiMentor isOpen={isAiMentorOpen} setIsOpen={setIsAiMentorOpen} />

      {/* Visualizer Simulation Modal */}
      <VisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        initialModule={currentModule.id}
      />

      {/* Quiz Modal */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}

export default ModuleDetailsPage;

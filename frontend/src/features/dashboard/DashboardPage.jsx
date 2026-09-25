import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DashboardNavbar } from './components/DashboardNavbar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { ContinueLearningCard } from './components/ContinueLearningCard';
import { CoreModulesGrid } from './components/CoreModulesGrid';
import { QuickActions } from './components/QuickActions';
import { StatsCards } from './components/StatsCards';
import { WeeklyActivityChart } from './components/WeeklyActivityChart';
import { AiRecommendations } from './components/AiRecommendations';
import { FloatingAiMentor } from './components/FloatingAiMentor';
import { VisualizerModal, QuizModal } from './components/InteractiveModals';

export default function DashboardPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [visualizerInitialModule, setVisualizerInitialModule] = useState('dsa');
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Sync theme with document class if not provided
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenVisualizer = (moduleId = 'dsa') => {
    setVisualizerInitialModule(moduleId);
    setIsVisualizerOpen(true);
  };

  const handleOpenQuiz = () => {
    setIsQuizOpen(true);
  };

  const handleExploreModule = (moduleId) => {
    navigate(`/modules/${moduleId}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200 font-sans">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenAiMentor={() => setIsAiMentorOpen(true)}
        onOpenVisualizer={handleOpenVisualizer}
        onOpenQuiz={handleOpenQuiz}
      />

      {/* 2. Main Body Container (Pushed right by sidebar width on desktop) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <DashboardNavbar
          theme={theme}
          toggleTheme={toggleTheme}
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAiMentor={() => setIsAiMentorOpen(true)}
          onSelectTopic={(topic) => {
            const mod = topic.module.toLowerCase().includes('os')
              ? 'os'
              : topic.module.toLowerCase().includes('network')
              ? 'networks'
              : topic.module.toLowerCase().includes('design')
              ? 'sysdesign'
              : 'dsa';
            handleOpenVisualizer(mod);
          }}
        />

        {/* Dashboard Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Section 1: Welcome Banner */}
          <WelcomeBanner onOpenAiMentor={() => setIsAiMentorOpen(true)} />

          {/* Section 2: Continue Learning Card */}
          <ContinueLearningCard
            onContinue={() => navigate('/modules/dsa')}
          />

          {/* Section 3: Four Core Module Cards */}
          <CoreModulesGrid onExploreModule={handleExploreModule} />

          {/* Section 4: Quick Actions */}
          <QuickActions
            onOpenAiMentor={() => setIsAiMentorOpen(true)}
            onOpenVisualizer={() => handleOpenVisualizer('dsa')}
            onOpenQuiz={handleOpenQuiz}
          />

          {/* Section 5: AI Tailored Recommendations */}
          <AiRecommendations
            onAction={(rec) => {
              if (rec.actionType === 'visualize') {
                const mod = rec.module.toLowerCase().includes('os')
                  ? 'os'
                  : rec.module.toLowerCase().includes('network')
                  ? 'networks'
                  : rec.module.toLowerCase().includes('design')
                  ? 'sysdesign'
                  : 'dsa';
                handleOpenVisualizer(mod);
              } else {
                navigate('/modules/networks');
              }
            }}
          />

          {/* Section 6: Learning Statistics (4 Cards) */}
          <StatsCards />

          {/* Section 7: Weekly Activity Chart */}
          <WeeklyActivityChart />
        </main>
      </div>

      {/* 3. Floating AI Mentor Trigger & Chat Panel */}
      <FloatingAiMentor
        isOpen={isAiMentorOpen}
        setIsOpen={setIsAiMentorOpen}
      />

      {/* 4. Interactive Simulation Visualizer Modal */}
      <VisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        initialModule={visualizerInitialModule}
      />

      {/* 5. Interactive Practice Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </div>
  );
}

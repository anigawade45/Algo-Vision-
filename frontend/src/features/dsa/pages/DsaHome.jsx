import React from 'react';
import {
  DsaNavbar,
  DsaHeroSection,
  ContinueLearning,
  RecentProblemsTable,
  PatternProgressList,
} from '../components/home';

export default function DsaHome({ onNavigateToWorkspace, onNavigateToLanding, theme, toggleTheme }) {
  const handleLaunchWorkspace = (problemData) => {
    if (onNavigateToWorkspace) {
      onNavigateToWorkspace(problemData);
    } else {
      console.log('Launching workspace with problem:', problemData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* 3. Common Application Shell Navbar (Dashboard / DSA) */}
      <DsaNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        onNavigateToLanding={onNavigateToLanding}
      />

      {/* 2. Home Page Layout Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Section 1: Hero Input */}
        <DsaHeroSection onAnalyze={handleLaunchWorkspace} />

        {/* Section 2: Continue Learning */}
        <ContinueLearning onContinue={handleLaunchWorkspace} />

        {/* Section 3: Recent Problems Table */}
        <RecentProblemsTable onSelectProblem={handleLaunchWorkspace} />

        {/* Section 4: Pattern Progress */}
        <PatternProgressList />

      </main>

    </div>
  );
}

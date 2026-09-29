import React from 'react';
import { DsaNavbar } from '../components/home/DsaNavbar';
import ProblemSubmitForm from '../components/problem/ProblemSubmitForm';

export default function ProblemSubmit({
  theme,
  toggleTheme,
  onNavigateToLanding,
  onNavigateToHome,
  onNavigateToWorkspace,
}) {
  const handleAnalyzeSuccess = (problemData) => {
    if (onNavigateToWorkspace) {
      onNavigateToWorkspace(problemData);
    } else {
      console.log('Problem submitted for analysis:', problemData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Shared Application Shell Navbar */}
      <DsaNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        onNavigateToLanding={onNavigateToLanding}
        onNavigateToHome={onNavigateToHome}
      />

      {/* Main Page Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProblemSubmitForm
          onAnalyzeSuccess={handleAnalyzeSuccess}
          onCancel={onNavigateToHome}
        />
      </main>
    </div>
  );
}

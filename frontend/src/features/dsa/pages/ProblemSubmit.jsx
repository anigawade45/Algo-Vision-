
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
    if (!problemData || typeof problemData !== 'object') {
      console.error('Invalid canonical problem data:', problemData);
      return;
    }

    const problemId =
      problemData.slug ||
      problemData.problemId ||
      problemData.id ||
      problemData._id;

    if (!problemId) {
      console.error(
        'Canonical problem is missing a supported identifier:',
        problemData
      );
      return;
    }

    if (typeof onNavigateToWorkspace !== 'function') {
      console.error('Workspace navigation callback is missing.');
      return;
    }

    onNavigateToWorkspace({
      ...problemData,
      slug: problemData.slug || problemId,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <DsaNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        onNavigateToLanding={onNavigateToLanding}
        onNavigateToHome={onNavigateToHome}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProblemSubmitForm
          onAnalyzeSuccess={handleAnalyzeSuccess}
          onCancel={onNavigateToHome}
        />
      </main>
    </div>
  );
}

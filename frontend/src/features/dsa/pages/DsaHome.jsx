import React from 'react';
import { MotionConfig, motion } from 'framer-motion';
import {
  DsaNavbar,
  DsaModuleHero,
  D3LearningPipelineFlow,
  ContinueLearningStrip,
} from '../components/home';

export default function DsaHome({
  onNavigateToWorkspace,
  onNavigateToLanding,
  onNavigateToSubmit,
  theme,
  toggleTheme,
}) {
  const handleAnalyzeProblem = (problemData) => {
    if (onNavigateToWorkspace) {
      onNavigateToWorkspace(problemData);
    } else {
      console.log('Analyzing problem:', problemData);
    }
  };

  const handleScrollToEngine = () => {
    const elem = document.getElementById('d3-learning-pipeline');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white">
        
        {/* Shell Navbar */}
        <DsaNavbar
          theme={theme}
          toggleTheme={toggleTheme}
          onNavigateToLanding={onNavigateToLanding}
          onNavigateToHome={() => {}}
          onNavigateToSubmit={onNavigateToSubmit}
        />

        {/* Main Learning Workspace Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-12">

          {/* 1. FIRST VIEWPORT: DSA Product Entry Hero (Fills 100vh) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DsaModuleHero
              onScrollToInput={onNavigateToSubmit}
              onScrollToEngine={handleScrollToEngine}
            />
          </motion.div>

          {/* 2. ALGOVISION LEARNING ENGINE (D3 Spatial Pipeline - Below the fold) */}
          <motion.div
            id="d3-learning-pipeline"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
          >
            <D3LearningPipelineFlow />
          </motion.div>


          {/* 3. CONTINUE LEARNING & LIBRARY NAV DESTINATIONS */}
          <motion.div
            id="continue-learning-strip"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
          >
            <ContinueLearningStrip
              onContinueSession={() => handleAnalyzeProblem({ title: 'Two Sum' })}
              onNavigateToSaved={onNavigateToSubmit}
              onNavigateToHistory={onNavigateToSubmit}
              onNavigateToPractice={onNavigateToSubmit}
            />
          </motion.div>

        </main>

      </div>
    </MotionConfig>
  );
}

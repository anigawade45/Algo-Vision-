import { useState } from 'react';
import {
  Sliders,
  BookOpen,
  RefreshCw,
  Code
} from 'lucide-react';

import {
  ReplacementIntro,
  ReplacementSimulator,
  AlgorithmComparison
} from '../components/page-replacement';
import { CodeLab } from '../components/code-lab';
import { OsNavbar, OsTabs, OsPageHeader } from '../components/shared';

export default function PageReplacement({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('simulator');

  const navTabs = [
    { id: 'intro', label: '1. Overview & Concepts', icon: BookOpen },
    { id: 'simulator', label: '2. Interactive Simulator Laboratory', icon: RefreshCw },
    { id: 'comparison', label: '3. Multi-Algorithm Comparison Matrix', icon: Sliders },
    { id: 'codelab', label: '4. Code Lab & Execution Terminal', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Header Navbar */}
      <OsNavbar
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'OS', path: '/os' },
          { label: 'Page Replacement Algorithms' }
        ]}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <OsPageHeader
          badge="Virtual Memory & Page Swapping"
          title="Page Replacement Algorithms"
          description="Step through virtual memory frame allocation and victim page eviction policies. Compare FIFO, LRU, Optimal, and Second Chance (Clock) algorithms in real-time."
        />

        {/* Navigation Tabs Bar */}
        <OsTabs
          tabs={navTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Active Tab Content */}
        <div className="space-y-8">
          {activeTab === 'intro' && <ReplacementIntro />}
          {activeTab === 'simulator' && <ReplacementSimulator />}
          {activeTab === 'comparison' && <AlgorithmComparison />}
          {activeTab === 'codelab' && <CodeLab module="page-replacement" />}
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import {
  Sliders,
  BookOpen,
  Compass,
  Code
} from 'lucide-react';

import {
  DiskIntro,
  DiskSimulator,
  DiskComparison
} from '../components/disk-scheduling';
import { CodeLab } from '../components/code-lab';
import { OsNavbar, OsTabs, OsPageHeader } from '../components/shared';

export default function DiskScheduling({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('simulator');

  const navTabs = [
    { id: 'intro', label: '1. Overview & Concepts', icon: BookOpen },
    { id: 'simulator', label: '2. Interactive Disk Simulator', icon: Compass },
    { id: 'comparison', label: '3. Multi-Algorithm Benchmark', icon: Sliders },
    { id: 'codelab', label: '4. Code Lab & Execution Terminal', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Header Navbar */}
      <OsNavbar
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'OS', path: '/os' },
          { label: 'Disk Scheduling Algorithms' }
        ]}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <OsPageHeader
          badge="Secondary Storage & I/O"
          title="Disk Scheduling Algorithms"
          description="Step through read/write head movement across disk tracks. Compare FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK seek policies in real-time."
        />

        {/* Navigation Tabs Bar */}
        <OsTabs
          tabs={navTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Active Tab Content */}
        <div className="space-y-8">
          {activeTab === 'intro' && <DiskIntro />}
          {activeTab === 'simulator' && <DiskSimulator />}
          {activeTab === 'comparison' && <DiskComparison />}
          {activeTab === 'codelab' && <CodeLab module="disk-scheduling" />}
        </div>
      </main>
    </div>
  );
}

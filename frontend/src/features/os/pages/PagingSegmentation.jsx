import { useState } from 'react';
import {
  Layers,
  Box,
  BookOpen,
  Sliders,
  Code
} from 'lucide-react';

import {
  PagingIntro,
  PagingSimulator,
  SegmentationSimulator,
  PagingVsSegmentation
} from '../components/paging-segmentation';
import { CodeLab } from '../components/code-lab';
import { OsNavbar, OsTabs, OsPageHeader } from '../components/shared';

export default function PagingSegmentation({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('paging');

  const navTabs = [
    { id: 'intro', label: '1. Overview', icon: BookOpen },
    { id: 'paging', label: '2. Paging & Page Table', icon: Layers },
    { id: 'segmentation', label: '3. Segmentation & Segment Table', icon: Box },
    { id: 'comparison', label: '4. Dual Lab & Comparison Matrix', icon: Sliders },
    { id: 'codelab', label: '5. Code Lab & Terminal', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Header */}
      <OsNavbar
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'OS', path: '/os' },
          { label: 'Paging & Segmentation' }
        ]}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <OsPageHeader
          badge="Virtual & Physical Mapping"
          title="Paging & Segmentation"
          description="Interactively explore non-contiguous memory management. Step through Paging address translation (Page p, Offset d → Frame f), Segmentation limit checks (⟨Segment s, Offset d⟩ → Base + Offset), and test segmentation fault trapping."
        />

        {/* Navigation Tabs Bar */}
        <OsTabs
          tabs={navTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Active Tab Content */}
        <div className="space-y-8">
          {activeTab === 'intro' && <PagingIntro />}
          {activeTab === 'paging' && <PagingSimulator />}
          {activeTab === 'segmentation' && <SegmentationSimulator />}
          {activeTab === 'comparison' && <PagingVsSegmentation />}
          {activeTab === 'codelab' && <CodeLab module="paging-segmentation" />}
        </div>
      </main>
    </div>
  );
}

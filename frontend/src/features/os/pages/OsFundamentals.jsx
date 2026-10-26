import { useState } from 'react';
import OsArchitectureViewer from '../components/fundamentals/OsArchitectureViewer';
import ModeTransitionSimulator from '../components/fundamentals/ModeTransitionSimulator';
import BootProcessVisualizer from '../components/fundamentals/BootProcessVisualizer';
import KernelComparisonTable from '../components/fundamentals/KernelComparisonTable';
import SystemCallExplorer from '../components/fundamentals/SystemCallExplorer';
import OsTypesGrid from '../components/fundamentals/OsTypesGrid';
import { OsNavbar, OsTabs, OsPageHeader } from '../components/shared';
import {
  Cpu,
  Layers,
  Shield,
  Power,
  FileCode,
  Grid
} from 'lucide-react';

export default function OsFundamentals({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture', label: '1. OS Architecture (5-Layer Stack)', icon: Layers },
    { id: 'dualmode', label: '2. Dual Mode & System Calls', icon: Shield },
    { id: 'boot', label: '3. Bootloader & Boot Process', icon: Power },
    { id: 'kernel', label: '4. Kernel Architecture', icon: Cpu },
    { id: 'syscalls', label: '5. System Call Explorer', icon: FileCode },
    { id: 'ostypes', label: '6. Types of OS', icon: Grid }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Navbar */}
      <OsNavbar
        badge="OS Fundamentals"
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <OsPageHeader
          badge="CORE CONCEPT TRACK"
          title="Operating System Fundamentals"
          description="Master the core foundations of operating systems: OS goals & functions, 5-layer system architecture, dual-mode execution (User Mode vs Kernel Mode), system call transitions, kernel design trade-offs, and step-by-step bootloader mechanics."
        />

        {/* Tab Navigation Bar */}
        <OsTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content Display */}
        <div className="space-y-6">
          {activeTab === 'architecture' && <OsArchitectureViewer />}
          {activeTab === 'dualmode' && <ModeTransitionSimulator />}
          {activeTab === 'boot' && <BootProcessVisualizer />}
          {activeTab === 'kernel' && <KernelComparisonTable />}
          {activeTab === 'syscalls' && <SystemCallExplorer />}
          {activeTab === 'ostypes' && <OsTypesGrid />}
        </div>
      </main>
    </div>
  );
}

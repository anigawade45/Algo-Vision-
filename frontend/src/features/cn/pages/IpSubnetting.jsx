import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Sun,
  Moon,
  Calculator,
  Layers,
  Code2,
  BookOpen,
  Terminal
} from 'lucide-react';
import { calculateSubnetDetails } from '../utils/subnettingLogic';
import { SubnetCalculator } from '../components/subnetting/SubnetCalculator';
import { BinaryOctetVisualizer } from '../components/subnetting/BinaryOctetVisualizer';
import { SubnetDivisionGrid } from '../components/subnetting/SubnetDivisionGrid';
import { IpRangeTester } from '../components/subnetting/IpRangeTester';
import { SubnetExplanation } from '../components/subnetting/SubnetExplanation';
import { SubnetCodeViewer } from '../components/subnetting/SubnetCodeViewer';

const SUBNET_TABS = [
  { id: 'calculator', label: '1. Subnet Calculator & Octets', icon: Calculator },
  { id: 'slicing', label: '2. VLSM Slicing & Range Tester', icon: Layers },
  { id: 'code', label: '3. Subnet Code Lab (C++, Java, Python)', icon: Code2 },
  { id: 'theory', label: '4. Formulas & CIDR Cheat Sheet', icon: BookOpen },
];

export default function IpSubnetting({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator', 'slicing', 'code', 'theory'
  const [ipInput, setIpInput] = useState('192.168.10.50');
  const [cidr, setCidr] = useState(26);

  const results = calculateSubnetDetails(ipInput, cidr);

  const currentTabIdx = SUBNET_TABS.findIndex((tab) => tab.id === activeTab);

  const handleNextStep = () => {
    if (currentTabIdx < SUBNET_TABS.length - 1) {
      setActiveTab(SUBNET_TABS[currentTabIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentTabIdx > 0) {
      setActiveTab(SUBNET_TABS[currentTabIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link to="/cn" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Wifi className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                AlgoVision CN
              </span>
            </Link>

            <span className="hidden md:inline text-slate-300 dark:text-slate-700">/</span>

            <nav className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link to="/cn" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Computer Networks
              </Link>
              <span>/</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                IPv4 Subnetting &amp; CIDR
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <Link
              to="/cn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to </span><span>CN Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Subnetting &amp; CIDR Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              IPv4 Subnet Calculator &amp; CIDR Mask Visualizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Calculate network IDs, usable host ranges, broadcast addresses, 32-bit binary octet ANDing, VLSM allocations, and run code in Python 3, C++, and Java.
            </p>
          </div>

          {activeTab !== 'code' && (
            <button
              onClick={() => setActiveTab('code')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer self-start md:self-center"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
              <span>Open in Code Lab (3 Languages)</span>
            </button>
          )}
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {SUBNET_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'calculator' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Main Interactive Subnet Calculator */}
            <SubnetCalculator
              ipInput={ipInput}
              onChangeIp={setIpInput}
              cidr={cidr}
              onChangeCidr={setCidr}
              results={results}
            />

            {/* 2. 32-Bit Binary Octet Visualizer */}
            <BinaryOctetVisualizer results={results} />

            {/* Quick Link Card to Code Lab */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Looking for the Bitwise Subnet Algorithm Implementation?
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Inspect production-grade bitwise operations and VLSM allocation routines in Python 3, C++, and Java with an interactive execution terminal.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('code')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                <span>Launch Code Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'slicing' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 3. VLSM Subnet Slicing Grid & IP Range Tester */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <SubnetDivisionGrid results={results} />
              </div>
              <div className="lg:col-span-5">
                <IpRangeTester sourceIp={ipInput} cidr={cidr} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="animate-fadeIn">
            <SubnetCodeViewer
              initialIp={ipInput}
              initialCidr={cidr}
              onSwitchToCalculator={() => setActiveTab('calculator')}
            />
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="animate-fadeIn">
            {/* 4. Formulas & CIDR Cheat Sheet */}
            <SubnetExplanation />
          </div>
        )}

        {/* Bottom Step Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePrevStep}
            disabled={currentTabIdx === 0}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              currentTabIdx === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                : 'border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Step {currentTabIdx + 1} of {SUBNET_TABS.length}
          </span>

          <button
            onClick={handleNextStep}
            disabled={currentTabIdx === SUBNET_TABS.length - 1}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentTabIdx === SUBNET_TABS.length - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 cursor-pointer'
            }`}
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wifi, ArrowLeft, LayoutDashboard, Sparkles, Sun, Moon, Calculator } from 'lucide-react';
import { calculateSubnetDetails } from '../utils/subnettingLogic';
import { SubnetCalculator } from '../components/subnetting/SubnetCalculator';
import { BinaryOctetVisualizer } from '../components/subnetting/BinaryOctetVisualizer';
import { SubnetDivisionGrid } from '../components/subnetting/SubnetDivisionGrid';
import { IpRangeTester } from '../components/subnetting/IpRangeTester';
import { SubnetExplanation } from '../components/subnetting/SubnetExplanation';

export default function IpSubnetting({ theme, toggleTheme }) {
  const [ipInput, setIpInput] = useState('192.168.10.50');
  const [cidr, setCidr] = useState(26);

  const results = calculateSubnetDetails(ipInput, cidr);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/cn" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Wifi className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                AlgoVision CN
              </span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link to="/cn" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Computer Networks
              </Link>
              <span>/</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                IPv4 Subnetting
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <Link
              to="/cn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CN Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Subnetting &amp; CIDR Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            IPv4 Subnet Calculator &amp; CIDR Mask Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Calculate network IDs, usable host ranges, broadcast addresses, 32-bit binary octet ANDing, and VLSM subnet slicing.
          </p>
        </div>

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

        {/* 3. VLSM Subnet Slicing Grid & IP Range Tester */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <SubnetDivisionGrid results={results} />
          </div>
          <div className="lg:col-span-5">
            <IpRangeTester sourceIp={ipInput} cidr={cidr} />
          </div>
        </div>

        {/* 4. Formulas & CIDR Cheat Sheet */}
        <SubnetExplanation />
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Terminal,
  LayoutDashboard,
  Layers,
  Shield,
  ShieldCheck,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Zap,
  RotateCcw,
  Code
} from 'lucide-react';

import {
  BankerIntro,
  BankerConcepts,
  MatrixConfigurator,
  AlgorithmVisualizer,
  RequestSimulator
} from '../components/banker';
import { CodeLab } from '../components/code-lab';

export default function BankersAlgorithm({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('simulator');

  // Matrix State (Classic 5P x 3R Safe Preset by default)
  const [processCount, setProcessCount] = useState(5);
  const [resourceCount, setResourceCount] = useState(3);

  const [available, setAvailable] = useState([3, 3, 2]);

  const [allocation, setAllocation] = useState([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
  ]);

  const [maximum, setMaximum] = useState([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
  ]);

  const [need, setNeed] = useState([]);
  const [validationError, setValidationError] = useState(null);

  // Recalculate Need Matrix whenever Maximum or Allocation changes
  useEffect(() => {
    let hasError = false;
    let newNeed = [];

    for (let i = 0; i < processCount; i++) {
      let row = [];
      for (let j = 0; j < resourceCount; j++) {
        const allocVal = allocation[i]?.[j] !== undefined ? allocation[i][j] : 0;
        const maxVal = maximum[i]?.[j] !== undefined ? maximum[i][j] : 0;

        if (allocVal > maxVal) {
          hasError = true;
        }

        row.push(Math.max(0, maxVal - allocVal));
      }
      newNeed.push(row);
    }

    setNeed(newNeed);

    if (hasError) {
      setValidationError('Validation Error: Allocation cannot be greater than Maximum for any process resource!');
    } else {
      setValidationError(null);
    }
  }, [processCount, resourceCount, allocation, maximum]);

  // Dimension Change Handlers
  const handleProcessCountChange = (newCount) => {
    setProcessCount(newCount);
    setAllocation(prev => {
      let newMat = [];
      for (let i = 0; i < newCount; i++) {
        newMat.push(prev[i] ? [...prev[i]] : Array(resourceCount).fill(0));
      }
      return newMat;
    });
    setMaximum(prev => {
      let newMat = [];
      for (let i = 0; i < newCount; i++) {
        newMat.push(prev[i] ? [...prev[i]] : Array(resourceCount).fill(0));
      }
      return newMat;
    });
  };

  const handleResourceCountChange = (newCount) => {
    setResourceCount(newCount);
    setAvailable(prev => {
      let newVec = [];
      for (let j = 0; j < newCount; j++) {
        newVec.push(prev[j] !== undefined ? prev[j] : 0);
      }
      return newVec;
    });
    setAllocation(prev =>
      prev.map(row => {
        let newRow = [];
        for (let j = 0; j < newCount; j++) {
          newRow.push(row[j] !== undefined ? row[j] : 0);
        }
        return newRow;
      })
    );
    setMaximum(prev =>
      prev.map(row => {
        let newRow = [];
        for (let j = 0; j < newCount; j++) {
          newRow.push(row[j] !== undefined ? row[j] : 0);
        }
        return newRow;
      })
    );
  };

  // Input Change Handlers
  const handleAllocationChange = (pIdx, rIdx, val) => {
    const updated = allocation.map((row, i) =>
      i === pIdx
        ? row.map((cell, j) => (j === rIdx ? Math.max(0, val) : cell))
        : row
    );
    setAllocation(updated);
  };

  const handleMaximumChange = (pIdx, rIdx, val) => {
    const updated = maximum.map((row, i) =>
      i === pIdx
        ? row.map((cell, j) => (j === rIdx ? Math.max(0, val) : cell))
        : row
    );
    setMaximum(updated);
  };

  const handleAvailableChange = (rIdx, val) => {
    const updated = [...available];
    updated[rIdx] = Math.max(0, val);
    setAvailable(updated);
  };

  // Load Preset Examples
  const handleLoadExample = (type) => {
    if (type === 'classic') {
      setProcessCount(5);
      setResourceCount(3);
      setAvailable([3, 3, 2]);
      setAllocation([
        [0, 1, 0],
        [2, 0, 0],
        [3, 0, 2],
        [2, 1, 1],
        [0, 0, 2]
      ]);
      setMaximum([
        [7, 5, 3],
        [3, 2, 2],
        [9, 0, 2],
        [2, 2, 2],
        [4, 3, 3]
      ]);
    } else if (type === 'unsafe') {
      setProcessCount(3);
      setResourceCount(3);
      setAvailable([1, 0, 1]);
      setAllocation([
        [2, 1, 0],
        [1, 2, 2],
        [3, 0, 1]
      ]);
      setMaximum([
        [4, 2, 2],
        [4, 4, 4],
        [7, 1, 3]
      ]);
    }
  };

  const handleReset = () => {
    handleLoadExample('classic');
  };

  const handleGrantRequest = (pIdx, reqVector) => {
    const newAvail = available.map((val, j) => val - reqVector[j]);
    const newAlloc = allocation.map((row, i) =>
      i === pIdx ? row.map((val, j) => val + reqVector[j]) : [...row]
    );

    setAvailable(newAvail);
    setAllocation(newAlloc);
    setActiveTab('simulator');
  };

  const tabs = [
    { id: 'intro', label: '1. What is Banker\'s Algorithm?', icon: ShieldCheck },
    { id: 'concepts', label: '2. Core Concepts & Formulas', icon: Layers },
    { id: 'matrices', label: '3. Matrix Configurator & Need', icon: Activity },
    { id: 'simulator', label: '4. Step-by-Step Safety Simulator', icon: Zap },
    { id: 'request-sim', label: '5. Resource Request Test Bench', icon: Cpu },
    { id: 'codelab', label: '6. Code Lab & Execution Terminal', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                AlgoVision
              </span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
              Banker's Algorithm
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/os"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors min-h-[38px]"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-500" />
              <span>OS Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors min-h-[38px]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Student Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer"
                title="Toggle theme mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  Deadlock Avoidance Engine
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Banker's Algorithm Simulator
                </h1>
              </div>
              <p className="text-slate-550 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
                Configure Allocation, Maximum, and Available resource vectors, inspect automatically calculated Need matrices, and step through Dijkstra's safety algorithm to compute safe sequences or detect unsafe states.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-b border-slate-200 dark:border-[#1E2638] overflow-x-auto no-scrollbar">
          <nav className="flex space-x-2 sm:space-x-4 min-w-max pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Sub-module Component Content */}
        <div className="pt-2">
          {activeTab === 'intro' && <BankerIntro />}
          {activeTab === 'concepts' && <BankerConcepts />}

          {activeTab === 'matrices' && (
            <MatrixConfigurator
              processCount={processCount}
              resourceCount={resourceCount}
              allocation={allocation}
              maximum={maximum}
              available={available}
              need={need}
              validationError={validationError}
              onProcessCountChange={handleProcessCountChange}
              onResourceCountChange={handleResourceCountChange}
              onAllocationChange={handleAllocationChange}
              onMaximumChange={handleMaximumChange}
              onAvailableChange={handleAvailableChange}
              onLoadExample={handleLoadExample}
              onReset={handleReset}
            />
          )}

          {activeTab === 'simulator' && (
            <AlgorithmVisualizer
              processCount={processCount}
              resourceCount={resourceCount}
              allocation={allocation}
              maximum={maximum}
              need={need}
              available={available}
            />
          )}

          {activeTab === 'request-sim' && (
            <RequestSimulator
              processCount={processCount}
              resourceCount={resourceCount}
              allocation={allocation}
              maximum={maximum}
              need={need}
              available={available}
              onGrantRequest={handleGrantRequest}
            />
          )}

          {activeTab === 'codelab' && (
            <CodeLab
              module="bankers-algorithm"
              currentInput={{
                processes: processCount,
                resources: resourceCount,
                available,
                allocation,
                maximum
              }}
            />
          )}
        </div>

        {/* Key Takeaways & Summary Section */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-500" />
            <span>Banker's Algorithm Summary & Key Takeaways</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">1. Need Matrix Equation</strong>
              <p className="leading-relaxed">
                Need[i][j] = Maximum[i][j] - Allocation[i][j]. Represents remaining peak resources Pi may request.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">2. Work Vector Release</strong>
              <p className="leading-relaxed">
                When Pi satisfies Need[i] ≤ Work, it executes and releases its allocation: Work = Work + Allocation[i].
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">3. Safe Sequence Guarantee</strong>
              <p className="leading-relaxed">
                Finding a Safe Sequence guarantees that all processes can finish without deadlock. Unsafe state indicates potential risk, not immediate deadlock.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

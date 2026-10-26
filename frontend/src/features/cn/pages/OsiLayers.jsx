import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Sun,
  Moon,
  Layers,
  BookOpen
} from 'lucide-react';
import { generateEncapsulationSteps } from '../utils/osiSimulation';
import { LayerStackVisualizer } from '../components/osi/LayerStackVisualizer';
import { EncapsulationStepper } from '../components/osi/EncapsulationStepper';
import { PduInspector } from '../components/osi/PduInspector';
import { OsiExplanation } from '../components/osi/OsiExplanation';

const OSI_TABS = [
  { id: 'simulator', label: '1. Encapsulation & PDU Simulator' },
  { id: 'theory', label: '2. OSI 7-Layer Architecture Guide' }
];

export default function OsiLayers({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('simulator');
  const [userMessage, setUserMessage] = useState('GET /index.html HTTP/1.1');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayerNum, setSelectedLayerNum] = useState(7);

  const currentTabIdx = OSI_TABS.findIndex((t) => t.id === activeTab);

  const handlePrevTab = () => {
    if (currentTabIdx > 0) {
      setActiveTab(OSI_TABS[currentTabIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextTab = () => {
    if (currentTabIdx < OSI_TABS.length - 1) {
      setActiveTab(OSI_TABS[currentTabIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate steps on user message change
  useEffect(() => {
    const generated = generateEncapsulationSteps(userMessage);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [userMessage]);

  const currentStep = steps[currentStepIndex] || null;

  // Sync selected layer with current step
  useEffect(() => {
    if (currentStep?.currentLayer?.layerNum) {
      setSelectedLayerNum(currentStep.currentLayer.layerNum);
    }
  }, [currentStepIndex, currentStep]);

  // Interval hook for simulation playback
  useEffect(() => {
    let timer = null;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps]);

  const handleTogglePlay = () => {
    if (steps.length === 0) return;
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setIsPlaying(false);
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setIsPlaying(false);
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
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
                OSI 7-Layer Model
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
        {/* Title & Badge */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Protocol Encapsulation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            OSI 7-Layer Architecture &amp; Packet Encapsulation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Step through how application data is framed from Layer 7 (Application) down to Layer 1 (Physical Bits), and decapsulated back at the destination host.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E2638] pb-1 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Encapsulation &amp; PDU Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. OSI 7-Layer Architecture Guide</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            {/* 1. Stepper & Playback Controls */}
            <EncapsulationStepper
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length || 1}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onReset={handleReset}
              userMessage={userMessage}
              onChangeMessage={setUserMessage}
              currentStep={currentStep}
            />

            {/* 2. Visual Nested Layer Stack + Header Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <LayerStackVisualizer
                  currentStep={currentStep}
                  selectedLayerNum={selectedLayerNum}
                  onSelectLayer={setSelectedLayerNum}
                />
              </div>

              <div className="lg:col-span-5">
                <PduInspector selectedLayerNum={selectedLayerNum} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && <OsiExplanation />}

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePrevTab}
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
            Step {currentTabIdx + 1} of {OSI_TABS.length}
          </span>

          <button
            onClick={handleNextTab}
            disabled={currentTabIdx === OSI_TABS.length - 1}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentTabIdx === OSI_TABS.length - 1
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wifi, ArrowLeft, LayoutDashboard, Sparkles, Sun, Moon, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { runTcpSimulation } from '../utils/tcpSimulation';
import { ClientServerCanvas } from '../components/handshake/ClientServerCanvas';
import { HandshakeControls } from '../components/handshake/HandshakeControls';
import { PacketInspector } from '../components/handshake/PacketInspector';
import { TcpExplanation } from '../components/handshake/TcpExplanation';

export default function TcpHandshake({ theme, toggleTheme }) {
  const [scenario, setScenario] = useState('handshake');
  const [clientIsn, setClientIsn] = useState(1000);
  const [serverIsn, setServerIsn] = useState(5000);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // 1000ms per step

  const [simulationResult, setSimulationResult] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Recalculate simulation on scenario / ISN change
  useEffect(() => {
    const res = runTcpSimulation({
      scenario,
      clientIsn,
      serverIsn,
    });
    setSimulationResult(res);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [scenario, clientIsn, serverIsn]);

  // Interval hook for simulation playback
  useEffect(() => {
    let timer = null;
    if (isPlaying && simulationResult && simulationResult.steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= simulationResult.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, simulationSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, simulationResult, simulationSpeed]);

  const currentStep = simulationResult?.steps?.[currentStepIndex] || null;

  const handleTogglePlay = () => {
    if (!simulationResult || simulationResult.steps.length === 0) return;
    if (currentStepIndex >= simulationResult.steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (simulationResult && currentStepIndex < simulationResult.steps.length - 1) {
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

  const handleChangeIsn = (type, val) => {
    if (type === 'client') setClientIsn(val);
    if (type === 'server') setServerIsn(val);
  };

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
                TCP 3-Way Handshake
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Module Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Protocol Visualizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              TCP 3-Way Handshake & Session Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Visualize reliable transport connection setup, sequence number synchronization, packet payloads, and 4-way teardown.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs text-xs font-mono">
              <span className="text-slate-400 block text-[10.5px]">Simulation Mode</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                {scenario.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Interactive Client-Server Network Topology Canvas */}
        <ClientServerCanvas
          currentStep={currentStep}
          activePacket={currentStep?.activePacket}
          clientState={currentStep?.clientState}
          serverState={currentStep?.serverState}
          wireStatus={currentStep?.wireStatus}
        />

        {/* 2. Handshake Controls, Scenario Selector, and Speed Adjuster */}
        <HandshakeControls
          scenario={scenario}
          onSelectScenario={setScenario}
          currentStepIndex={currentStepIndex}
          totalSteps={simulationResult?.totalSteps || 1}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onStepForward={handleStepForward}
          onStepBack={handleStepBack}
          onReset={handleReset}
          speed={simulationSpeed}
          onChangeSpeed={setSimulationSpeed}
          clientIsn={clientIsn}
          serverIsn={serverIsn}
          onChangeIsn={handleChangeIsn}
        />

        {/* 3. Live Wireshark Packet Stream + 20-Byte TCP Header Inspector */}
        <PacketInspector
          loggedPackets={currentStep?.loggedPackets || []}
          activePacketIndex={currentStepIndex}
        />

        {/* 4. Educational Deep Dive & Theory Formulas */}
        <TcpExplanation />
      </main>
    </div>
  );
}

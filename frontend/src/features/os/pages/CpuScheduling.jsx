import React, { useState, useEffect } from 'react';
import { runFcfsSimulation } from '../utils/fcfsSimulation';
import SchedulingAlgorithmSelector from '../components/scheduling/SchedulingAlgorithmSelector';
import SchedulingInput from '../components/scheduling/SchedulingInput';
import SchedulingControls from '../components/scheduling/SchedulingControls';
import ReadyQueue from '../components/scheduling/ReadyQueue';
import CPU from '../components/scheduling/CPU';
import GanttChart from '../components/scheduling/GanttChart';
import ProcessTable from '../components/scheduling/ProcessTable';
import SchedulingMetrics from '../components/scheduling/SchedulingMetrics';
import SchedulingExplanation from '../components/scheduling/SchedulingExplanation';
import { Layers, HelpCircle } from 'lucide-react';

export default function CpuScheduling({ theme }) {
  // Default process inputs
  const defaultProcesses = [
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 0 },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 0 },
    { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 0 },
    { id: 'P4', arrivalTime: 4, burstTime: 4, priority: 0 }
  ];

  const [processes, setProcesses] = useState(defaultProcesses);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FCFS');
  
  // Simulation execution state
  const [simulationResult, setSimulationResult] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // 1000ms per step

  // Run simulation whenever process list or algorithm changes
  const handleSimulate = () => {
    const result = runFcfsSimulation(processes);
    setSimulationResult(result);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Run simulation once on initial mount
  useEffect(() => {
    handleSimulate();
  }, []);

  // Recalculate simulation result immediately on process changes (delightful UX)
  useEffect(() => {
    const result = runFcfsSimulation(processes);
    setSimulationResult(result);
    // Reset to start step
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [processes, selectedAlgorithm]);

  // Interval hook for simulation playback
  useEffect(() => {
    let timer = null;
    if (isPlaying && simulationResult && simulationResult.steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (prevIndex >= simulationResult.steps.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, simulationSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, simulationResult, simulationSpeed]);

  const handleTogglePlay = () => {
    if (!simulationResult || simulationResult.steps.length === 0) return;
    
    // If we're at the end, restart from step 1 on play click
    if (currentStepIndex >= simulationResult.steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (!simulationResult) return;
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, simulationResult.steps.length - 1));
  };

  const handlePrev = () => {
    if (!simulationResult) return;
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Extract current step state
  const currentStep = simulationResult?.steps?.[currentStepIndex] || null;
  const metrics = simulationResult?.metrics || {
    avgWaitingTime: 0,
    avgTurnaroundTime: 0,
    avgResponseTime: 0,
    cpuUtilization: 0,
    totalTime: 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header and Breadcrumbs */}
      <div className="space-y-2.5">
        {/* <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <span>Operating Systems</span>
          <span>/</span>
          <span className="text-blue-500">CPU Scheduling</span>
        </div> */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              CPU Scheduling Simulator
            </h1>
            <p className="text-slate-550 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
              Visualize how CPU scheduling algorithms execute processes step-by-step. Toggle play/pause, advance single events, and examine ready queue transitions.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-[#3B82F6] text-xs font-mono font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>ALGOVISION WORKSPACE</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Column */}
        <div className="lg:col-span-4 space-y-6">
          <SchedulingAlgorithmSelector
            selected={selectedAlgorithm}
            onChange={setSelectedAlgorithm}
          />
          <SchedulingInput
            processes={processes}
            setProcesses={setProcesses}
            onSimulate={handleSimulate}
            selectedAlgorithm={selectedAlgorithm}
          />
        </div>

        {/* Right Simulation Dashboard */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls */}
          <SchedulingControls
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
            currentStep={currentStepIndex + 1}
            totalSteps={simulationResult?.steps?.length || 1}
            speed={simulationSpeed}
            onSpeedChange={setSimulationSpeed}
          />

          {/* CPU & Ready Queue Visualization Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadyQueue queue={currentStep?.readyQueue || []} />
            <CPU
              cpu={currentStep?.cpu}
              currentTime={currentStep?.time || 0}
            />
          </div>

          {/* Gantt Chart (Using proportional lengths) */}
          <GanttChart
            blocks={currentStep?.ganttBlocks || []}
            totalTime={metrics.totalTime || 1}
          />

          {/* Metric Cards */}
          <SchedulingMetrics metrics={metrics} />

          {/* Walkthrough Explanation Panel */}
          <SchedulingExplanation step={currentStep} />

          {/* Complete Calculation Table */}
          <ProcessTable
            processes={simulationResult?.processes || []}
            activeStepProcessStates={currentStep?.processesState}
          />
        </div>
      </div>
    </div>
  );
}

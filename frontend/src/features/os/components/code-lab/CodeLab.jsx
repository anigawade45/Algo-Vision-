import React, { useState, useEffect } from 'react';
import {
  Code,
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Globe,
  Sliders,
  HelpCircle
} from 'lucide-react';

import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import InputPanel from './InputPanel';
import { codeExamples } from './codeExamples';
import { executeCode, EXECUTION_STATES } from './executionService';

export default function CodeLab({
  module = 'page-replacement',
  algorithm = null,
  currentVisualizerInput = null
}) {
  const moduleConfig = codeExamples[module] || codeExamples['page-replacement'];
  const [selectedAlgo, setSelectedAlgo] = useState(algorithm || moduleConfig.defaultAlgorithm);
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [inputValues, setInputValues] = useState(moduleConfig.defaultInputs);

  const [code, setCode] = useState('');
  const [executionState, setExecutionState] = useState(EXECUTION_STATES.IDLE);
  const [executionResult, setExecutionResult] = useState(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'terminal'

  // Update starter code whenever algorithm or language changes
  useEffect(() => {
    const algoKey = selectedAlgo || moduleConfig.defaultAlgorithm;
    const langKey = selectedLang || 'javascript';

    if (moduleConfig.code[algoKey] && moduleConfig.code[algoKey][langKey]) {
      setCode(moduleConfig.code[algoKey][langKey]);
    }
  }, [selectedAlgo, selectedLang, module]);

  // Update algorithm state if prop algorithm changes
  useEffect(() => {
    if (algorithm && moduleConfig.algorithms.includes(algorithm)) {
      setSelectedAlgo(algorithm);
    }
  }, [algorithm, moduleConfig]);

  // Handle Run Code Execution
  const handleRun = async () => {
    if (executionState === EXECUTION_STATES.RUNNING || executionState === EXECUTION_STATES.COMPILING) return;

    setExecutionState(EXECUTION_STATES.COMPILING);
    setExecutionResult(null);

    const result = await executeCode({
      language: selectedLang,
      code,
      input: inputValues,
      module,
      algorithm: selectedAlgo
    });

    setExecutionState(result.status);
    setExecutionResult(result);
  };

  // Handle Reset to Starter Code
  const handleReset = () => {
    const algoKey = selectedAlgo || moduleConfig.defaultAlgorithm;
    const langKey = selectedLang || 'javascript';
    setCode(moduleConfig.code[algoKey][langKey]);
    setExecutionState(EXECUTION_STATES.IDLE);
    setExecutionResult(null);
  };

  // Handle Clear Terminal
  const handleClearTerminal = () => {
    setExecutionState(EXECUTION_STATES.IDLE);
    setExecutionResult(null);
  };

  // Sync inputs from current visualizer
  const handleUseVisualizerInput = () => {
    if (!currentVisualizerInput) return;
    setInputValues({ ...currentVisualizerInput });
  };

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#05070e] p-6 overflow-y-auto space-y-6'
          : 'relative'
      }`}
    >
      {/* Code Lab Container Header */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                AlgoVision IDE
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-500" /> Reusable Code Lab & Execution Terminal
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive coding laboratory for {moduleConfig.name}. Write, edit, and execute algorithms in JavaScript, C++, Java, or Python.
            </p>
          </div>

          {/* Controls Bar: Language, Algorithm, Run, Reset, Fullscreen */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold font-mono focus:outline-none cursor-pointer pr-1"
              >
                <option value="javascript" className="bg-[#0b101d] text-white">JavaScript (Native)</option>
                <option value="cpp" className="bg-[#0b101d] text-white">C++ (GCC)</option>
                <option value="java" className="bg-[#0b101d] text-white">Java (OpenJDK)</option>
                <option value="python" className="bg-[#0b101d] text-white">Python (3.11)</option>
              </select>
            </div>

            {/* Algorithm Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <Sliders className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={selectedAlgo}
                onChange={(e) => setSelectedAlgo(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold font-mono focus:outline-none cursor-pointer pr-1"
              >
                {moduleConfig.algorithms.map((algo) => (
                  <option key={algo} value={algo} className="bg-[#0b101d] text-white">
                    {algo}
                  </option>
                ))}
              </select>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={executionState === EXECUTION_STATES.RUNNING || executionState === EXECUTION_STATES.COMPILING}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{executionState === EXECUTION_STATES.RUNNING || executionState === EXECUTION_STATES.COMPILING ? 'Running...' : 'Run ▶'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset to Starter Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Input Parameter Settings */}
        <InputPanel
          module={module}
          inputValues={inputValues}
          onChangeInput={setInputValues}
          currentVisualizerInput={currentVisualizerInput}
          onUseVisualizerInput={handleUseVisualizerInput}
        />

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden border-b border-slate-200 dark:border-slate-800 text-xs font-mono font-bold">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 text-center border-b-2 ${
              mobileTab === 'editor'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500'
            }`}
          >
            Code Editor
          </button>
          <button
            onClick={() => setMobileTab('terminal')}
            className={`flex-1 py-2 text-center border-b-2 ${
              mobileTab === 'terminal'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500'
            }`}
          >
            Terminal Output
          </button>
        </div>

        {/* Editor & Terminal Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch h-[450px]">
          {/* Code Editor Panel */}
          <div className={`md:col-span-7 h-full ${mobileTab === 'editor' ? 'block' : 'hidden md:block'}`}>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={selectedLang}
              onRun={handleRun}
            />
          </div>

          {/* Terminal Output Panel */}
          <div className={`md:col-span-5 h-full ${mobileTab === 'terminal' ? 'block' : 'hidden md:block'}`}>
            <Terminal
              executionState={executionState}
              executionResult={executionResult}
              onClear={handleClearTerminal}
            />
          </div>
        </div>

        {/* Educational Code Concept Panel */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Code ↔ Algorithm Concept Connection ({selectedAlgo})</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            This starter code implements the <strong>{selectedAlgo}</strong> algorithm logic. Modifying variables or adding print statements will directly output step traces in the terminal window above!
          </p>
        </div>
      </div>
    </div>
  );
}

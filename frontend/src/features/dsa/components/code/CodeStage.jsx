import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle2, XCircle, Clock, FileCode2, ArrowRight, Terminal } from 'lucide-react';
import { getStarterCode } from '../../data/code/mockCodeTemplates';

const LANGUAGES = [
  { id: 'cpp', name: 'C++', monacoLang: 'cpp' },
  { id: 'java', name: 'Java', monacoLang: 'java' },
  { id: 'python', name: 'Python', monacoLang: 'python' },
  { id: 'javascript', name: 'JavaScript', monacoLang: 'javascript' },
  { id: 'csharp', name: 'C#', monacoLang: 'csharp' }
];

export function CodeStage({
  problem,
  onCompleteStage,
  onNextStage,
  onOpenSpec
}) {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[3]); // Default to JS
  const [code, setCode] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // Preserve user code per language using a ref
  const userCodeCache = useRef({});

  useEffect(() => {
    // When language changes, save current code to cache and load new code
    const initialCode = getStarterCode(problem.id, selectedLang.id);
    setCode(userCodeCache.current[selectedLang.id] !== undefined ? userCodeCache.current[selectedLang.id] : initialCode);
  }, [selectedLang, problem.id]);

  const handleEditorChange = (value) => {
    setCode(value);
    userCodeCache.current[selectedLang.id] = value;
  };

  const handleReset = () => {
    const initialCode = getStarterCode(problem.id, selectedLang.id);
    setCode(initialCode);
    userCodeCache.current[selectedLang.id] = initialCode;
    setExecutionResult(null);
  };

  const handleRunCode = () => {
    setIsExecuting(true);
    setExecutionResult(null);

    // Simulate backend execution with a timeout
    setTimeout(() => {
      setIsExecuting(false);
      
      // Simple heuristic for simulation: if code is basically empty, fail.
      if (!code || code.trim().length < 15) {
        setExecutionResult({
          status: 'error',
          message: 'Compilation Error / Blank Solution',
          details: 'Please implement the solution before running. The code appears to be too short or empty.',
          testCases: problem.testCases.map(tc => ({
             ...tc,
             passed: false,
             actualOutput: 'N/A'
          }))
        });
        return;
      }

      // Simulate success since they are running the full solution (for educational platform demo purposes)
      setExecutionResult({
        status: 'success',
        message: 'Accepted',
        details: 'All test cases passed successfully.',
        testCases: problem.testCases.map(tc => ({
          ...tc,
          passed: true,
          actualOutput: tc.outputRaw
        }))
      });
      
      if (onCompleteStage) onCompleteStage('code');
    }, 1500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans w-full pb-12 flex flex-col min-h-screen">
      
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none">
              07  ·  CODE
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
              {problem.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSpec}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-mono font-bold cursor-pointer border border-blue-200/80 dark:border-blue-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 shrink-0" />
              <span>Problem Spec</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4">
          Code Solution
        </h1>
        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5">
          Implement your solution for {problem.title}. Choose your preferred language and run it against our test cases.
        </p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-h-[500px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0B101D] shadow-sm">
          
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827]">
            <div className="flex items-center gap-3">
              <select
                value={selectedLang.id}
                onChange={(e) => setSelectedLang(LANGUAGES.find(l => l.id === e.target.value))}
                className="bg-white dark:bg-[#1F2937] border border-slate-300 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-200 font-mono cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Reset Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold font-mono bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors cursor-pointer shadow-sm shadow-emerald-900/20"
              >
                {isExecuting ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 w-full h-[500px] relative">
             <Editor
                height="100%"
                language={selectedLang.monacoLang}
                theme="vs-dark" // Matches the dark aesthetic of AlgoVision well, could switch dynamically based on global theme
                value={code}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 24,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  formatOnPaste: true,
                }}
                className="absolute inset-0"
             />
          </div>
        </div>

        {/* Output Panel Area */}
        <div className="lg:w-96 flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0B101D] shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
            <Terminal className="w-4 h-4" />
            <span>EXECUTION OUTPUT</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {!executionResult && !isExecuting && (
              <div className="text-center text-slate-500 mt-10 text-sm">
                Run your code to see results here.
              </div>
            )}

            {isExecuting && (
              <div className="flex flex-col items-center justify-center mt-10 text-slate-500 space-y-4">
                <Clock className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-sm font-mono animate-pulse">Running test cases...</span>
              </div>
            )}

            {executionResult && !isExecuting && (
              <div className="space-y-6">
                <div className={`p-4 rounded-xl border ${executionResult.status === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {executionResult.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                    <h3 className={`font-bold ${executionResult.status === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                      {executionResult.message}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
                    {executionResult.details}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test Cases</h4>
                  {executionResult.testCases.map((tc, idx) => (
                    <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Case {idx + 1}</span>
                        {tc.passed ? (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-bold font-mono">PASSED</span>
                        ) : (
                          <span className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-2 py-0.5 rounded font-bold font-mono">FAILED</span>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs font-mono">
                        <div>
                          <span className="text-slate-500">Input:</span>
                          <div className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#111827] p-1.5 rounded mt-0.5 break-all">
                            {tc.inputRaw}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500">Expected:</span>
                          <div className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#111827] p-1.5 rounded mt-0.5 break-all">
                            {tc.outputRaw}
                          </div>
                        </div>
                        {tc.actualOutput && (
                          <div>
                            <span className="text-slate-500">Output:</span>
                            <div className={`p-1.5 rounded mt-0.5 break-all ${tc.passed ? 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#111827]' : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30'}`}>
                              {tc.actualOutput}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STAGE NAVIGATION */}
      {onNextStage && (
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex justify-end">
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <span>Continue to Dry Run</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CodeStage;

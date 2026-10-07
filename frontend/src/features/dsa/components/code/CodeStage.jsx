import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle2, XCircle, Clock, FileCode2, ArrowRight, Terminal, Check, Bot } from 'lucide-react';
import api from '../../../../api/apiClient';

const LANGUAGES = [
  { id: 'cpp', name: 'C++', monacoLang: 'cpp' },
  { id: 'java', name: 'Java', monacoLang: 'java' },
  { id: 'python', name: 'Python', monacoLang: 'python' }
];

export function CodeStage({
  problem,
  onCompleteStage,
  onNextStage,
  onOpenSpec
}) {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [approachId, setApproachId] = useState('');
  const [approachName, setApproachName] = useState('');
  const [pseudocodeLines, setPseudocodeLines] = useState([]);

  // Cache user edits independently
  const userCodeCache = useRef({});
  // Cache originally generated code
  const originalCodeCache = useRef({});

  // Active test mode (0 = problem test cases, 1 = custom test case)
  const [testMode, setTestMode] = useState(0);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    fetchCodeData();
  }, [problem._id]);

  useEffect(() => {
    if (isCompleted && onCompleteStage) {
      onCompleteStage('code');
    }
  }, [isCompleted, onCompleteStage]);

  // When language changes, preserve current edit and load the new one
  const handleLangChange = (e) => {
    const newLang = LANGUAGES.find(l => l.id === e.target.value);
    setSelectedLang(newLang);
    setCode(userCodeCache.current[newLang.id] || '');
  };

  const fetchCodeData = async () => {
    try {
      // Fetch pseudocode to display without hardcoding approachId to let backend auto-resolve
      const pseudoQuery = approachId ? `?approachId=${approachId}` : '';
      const pseudoRes = await api.get(`/problems/${problem.problemId}/pseudocode${pseudoQuery}`);
      // apiClient returns the JSON payload directly: { success: true, data: { pseudocode: { lines: [] }, approach: { approachId: ... } } }
      let resolvedApproachId = approachId;
      
      const pseudoPayload = pseudoRes.data;
      if (pseudoPayload?.pseudocode?.lines) {
        setPseudocodeLines(pseudoPayload.pseudocode.lines);
        setApproachName(pseudoPayload.approach?.approachName || '');
        resolvedApproachId = pseudoPayload.approach?.approachId || resolvedApproachId;
        setApproachId(resolvedApproachId);
      }

      const codeQuery = resolvedApproachId ? `?approachId=${resolvedApproachId}` : '';
      const res = await api.get(`/problems/${problem.problemId}/code${codeQuery}`);
      if (res.data?.generated) {
        const payload = res.data.data || res.data;
        setApproachId(payload.approachId);
        setApproachName(payload.approachName);
        
        // Setup initial caches
        const generatedCpp = payload.cpp || '';
        const generatedJava = payload.java || '';
        const generatedPython = payload.python || '';

        originalCodeCache.current = { cpp: generatedCpp, java: generatedJava, python: generatedPython };
        userCodeCache.current = { cpp: generatedCpp, java: generatedJava, python: generatedPython };

        setCode(userCodeCache.current[selectedLang.id] || '');
      }
    } catch (err) {
      console.error('Failed to fetch code data:', err);
    }
  };

  const handleGenerateCode = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setExecutionResult(null);
    try {
      const res = await api.post(`/problems/${problem.problemId}/code/generate`, {
        approachId,
        approachName
      });
      const payload = res.data?.data || res.data || {};
      const generatedCpp = payload.cpp || '';
      const generatedJava = payload.java || '';
      const generatedPython = payload.python || '';

      originalCodeCache.current = { cpp: generatedCpp, java: generatedJava, python: generatedPython };
      userCodeCache.current = { cpp: generatedCpp, java: generatedJava, python: generatedPython };

      setCode(userCodeCache.current[selectedLang.id] || '');
    } catch (err) {
      console.error('Failed to generate code:', err);
      alert(err.response?.data?.message || 'Failed to generate code.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
    userCodeCache.current[selectedLang.id] = value;
  };

  const handleReset = () => {
    const initialCode = originalCodeCache.current[selectedLang.id] || '';
    setCode(initialCode);
    userCodeCache.current[selectedLang.id] = initialCode;
    setExecutionResult(null);
  };

  const handleRunCode = async () => {
    if (isExecuting) return;
    if (!code.trim()) {
      alert("Code cannot be empty.");
      return;
    }
    if (testMode === 1 && !customInput.trim()) {
      alert("Custom input cannot be empty.");
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    let testCasesToRun = [];
    if (testMode === 0) {
      testCasesToRun = problem.testCases || [];
    } else {
      testCasesToRun = [{ inputRaw: customInput, outputRaw: null, isCustom: true }];
    }

    let overallStatus = 'success';
    let results = [];

    try {
      for (const tc of testCasesToRun) {
        const res = await api.post(`/problems/${problem.problemId}/code/execute`, {
          language: selectedLang.id,
          code: code,
          input: tc.inputRaw
        });

        const execData = res.data || {};
        const actualOutput = execData.output?.trim() || '';
        const isError = execData.isError;
        
        let passed = false;
        if (!isError && !tc.isCustom) {
          const normalizedActual = actualOutput.replace(/\s+/g, '');
          const normalizedExpected = (tc.outputRaw || '').replace(/\s+/g, '');
          passed = normalizedActual === normalizedExpected;
          if (!passed) overallStatus = 'error';
        } else if (isError) {
          overallStatus = 'error';
        }

        results.push({
          inputRaw: tc.inputRaw,
          expectedOutput: tc.outputRaw,
          actualOutput: isError ? execData.error : actualOutput,
          passed: tc.isCustom ? !isError : passed,
          isError: isError,
          isCustom: tc.isCustom
        });
      }

      setExecutionResult({
        status: overallStatus,
        message: overallStatus === 'success' ? 'Accepted' : 'Failed',
        details: overallStatus === 'success' ? 'All test cases passed successfully.' : 'Some test cases failed or produced errors.',
        testCases: results
      });

      if (overallStatus === 'success' && onCompleteStage) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error('Failed to execute code:', err);
      setExecutionResult({
        status: 'error',
        message: 'Execution Failed',
        details: err.response?.data?.message || 'Server error during execution.',
        testCases: []
      });
    } finally {
      setIsExecuting(false);
    }
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
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs font-mono font-bold cursor-pointer border border-purple-200/80 dark:border-purple-900/60 focus-visible:outline-none transition-colors"
            >
              {isGenerating ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
              <span>{isGenerating ? 'Generating...' : 'Generate AI Code'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4">
          {problem.title} - Code Solution
        </h1>
        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5">
          Execute and edit the generated code for {problem.title}. Choose your preferred language and run it against our test cases or use a custom test case.
        </p>

        {/* Info panel showing Selected Approach */}
        {approachName && (
          <div className="mt-6 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Selected Approach: {approachName}</h3>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-h-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0B101D] shadow-sm">
          
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827]">
            <div className="flex items-center gap-3">
              <select
                value={selectedLang.id}
                onChange={handleLangChange}
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

            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 w-full h-[550px] relative">
             <Editor
                height="100%"
                language={selectedLang.monacoLang}
                theme="vs-dark"
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


      </div>

      {/* Footer Action */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          aria-pressed={isCompleted}
          onClick={() => setIsCompleted(!isCompleted)}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isCompleted ? (
            <>
              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Code Mastered ✓</span>
            </>
          ) : (
            <span>I Understand This Code</span>
          )}
        </button>

        {onNextStage && (
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Next: Stage 08 Dry Run →</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default CodeStage;

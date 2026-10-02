import React, { useState } from 'react';
import {
  Terminal as TerminalIcon,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Clock,
  Square
} from 'lucide-react';
import { EXECUTION_STATES } from './executionService';

export default function Terminal({
  executionState = EXECUTION_STATES.IDLE,
  executionResult = null,
  onClear = () => {}
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!executionResult?.output) return;
    navigator.clipboard.writeText(executionResult.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRunning = executionState === EXECUTION_STATES.RUNNING || executionState === EXECUTION_STATES.COMPILING;
  const isSuccess = executionState === EXECUTION_STATES.SUCCESS;
  const isError = executionState === EXECUTION_STATES.COMPILATION_ERROR || executionState === EXECUTION_STATES.RUNTIME_ERROR || executionState === EXECUTION_STATES.TIMEOUT;

  return (
    <div className="w-full h-full min-h-[350px] flex flex-col bg-[#070a13] rounded-xl overflow-hidden border border-slate-800 font-mono shadow-inner">
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0c111e] border-b border-[#1e2638] text-xs">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200">TERMINAL OUTPUT</span>

          {/* Status Badge */}
          {isRunning && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              {executionState === EXECUTION_STATES.COMPILING ? 'Compiling...' : 'Running...'}
            </span>
          )}

          {isSuccess && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> SUCCESS
            </span>
          )}

          {isError && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {executionState}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {executionResult && (
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy Terminal Output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={onClear}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Console Output Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs text-slate-300 leading-relaxed font-mono selection:bg-cyan-500 selection:text-slate-950">
        <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-800/60 flex items-center justify-between">
          <span>AlgoVision Sandbox Environment v1.0.0</span>
          {executionResult?.executionTimeMs !== undefined && (
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-cyan-400" /> {executionResult.executionTimeMs}ms
            </span>
          )}
        </div>

        {executionState === EXECUTION_STATES.IDLE && !executionResult && (
          <div className="text-slate-500 italic pt-4">
            {'>'} Press <strong className="text-cyan-400 font-normal">Run ▶</strong> (or Ctrl+Enter) to execute code and view stdout logs...
          </div>
        )}

        {isRunning && (
          <div className="text-amber-400 space-y-1 pt-2">
            <div>{'>'} Initializing sandbox process...</div>
            <div className="animate-pulse">{'>'} Executing user program code...</div>
          </div>
        )}

        {executionResult && (
          <div className="space-y-1 pt-1">
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200 leading-relaxed">
              {executionResult.output}
            </pre>

            {isSuccess && (
              <div className="pt-3 text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{'>'} Program finished successfully (exit code 0).</span>
              </div>
            )}

            {isError && (
              <div className="pt-3 text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{'>'} Process terminated with error.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

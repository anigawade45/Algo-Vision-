import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, ShieldAlert, Sliders } from 'lucide-react';

export default function RequestSimulator({
  processCount,
  resourceCount,
  allocation,
  maximum,
  need,
  available,
  onGrantRequest
}) {
  const [targetProcess, setTargetProcess] = useState(0);
  const [requestVector, setRequestVector] = useState(Array(resourceCount).fill(0));
  const [evaluationResult, setEvaluationResult] = useState(null);

  const handleRequestChange = (resourceIndex, value) => {
    const updated = [...requestVector];
    updated[resourceIndex] = Math.max(0, value);
    setRequestVector(updated);
  };

  const handleEvaluateRequest = () => {
    const pIdx = targetProcess;
    const req = requestVector;
    const procNeed = need[pIdx] || Array(resourceCount).fill(0);
    const avail = available;

    // Step 1: Check Request <= Need
    for (let j = 0; j < resourceCount; j++) {
      if (req[j] > procNeed[j]) {
        setEvaluationResult({
          granted: false,
          errorType: 'EXCEEDED_NEED',
          message: `DENIED! Request R${j} (${req[j]}) exceeds declared Need (${procNeed[j]}) for P${pIdx}. Process has exceeded its maximum claim.`
        });
        return;
      }
    }

    // Step 2: Check Request <= Available
    for (let j = 0; j < resourceCount; j++) {
      if (req[j] > avail[j]) {
        setEvaluationResult({
          granted: false,
          errorType: 'INSUFFICIENT_AVAILABLE',
          message: `WAIT! Request R${j} (${req[j]}) exceeds Available (${avail[j]}). Process P${pIdx} must wait until resources are released.`
        });
        return;
      }
    }

    // Step 3: Pretend Allocation
    let pretendAvail = [...avail];
    let pretendAlloc = allocation.map(row => [...row]);
    let pretendNeed = need.map(row => [...row]);

    for (let j = 0; j < resourceCount; j++) {
      pretendAvail[j] -= req[j];
      pretendAlloc[pIdx][j] += req[j];
      pretendNeed[pIdx][j] -= req[j];
    }

    // Step 4: Run Safety Algorithm on pretend state
    let work = [...pretendAvail];
    let finish = Array(processCount).fill(false);
    let safeSeq = [];

    let foundCandidate = true;
    while (foundCandidate) {
      foundCandidate = false;
      for (let i = 0; i < processCount; i++) {
        if (!finish[i]) {
          const currentNeed = pretendNeed[i];
          const currentAlloc = pretendAlloc[i];

          let canRun = true;
          for (let j = 0; j < resourceCount; j++) {
            if (currentNeed[j] > work[j]) {
              canRun = false;
              break;
            }
          }

          if (canRun) {
            for (let j = 0; j < resourceCount; j++) {
              work[j] += currentAlloc[j];
            }
            finish[i] = true;
            safeSeq.push(`P${i}`);
            foundCandidate = true;
          }
        }
      }
    }

    const isSafe = finish.every(f => f === true);

    if (isSafe) {
      setEvaluationResult({
        granted: true,
        message: `REQUEST GRANTED! Pretend state is SAFE with Safe Sequence <${safeSeq.join(', ')}>. System will safely grant resources to P${pIdx}.`,
        pretendAvail,
        pretendAlloc,
        pretendNeed
      });
    } else {
      setEvaluationResult({
        granted: false,
        errorType: 'UNSAFE_STATE',
        message: `DENIED / MUST WAIT! Granting request to P${pIdx} leaves system in an UNSAFE STATE. Request cannot be granted.`
      });
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              Interactive Test Bench
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Try a New Resource Request
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate a new resource request from a process. The algorithm evaluates Request ≤ Need, Request ≤ Available, and performs a safety simulation.
          </p>
        </div>
      </div>

      {/* Target Process & Request Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Process Target Dropdown */}
        <div>
          <label className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Select Requesting Process:
          </label>
          <select
            value={targetProcess}
            onChange={(e) => setTargetProcess(parseInt(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold"
          >
            {Array.from({ length: processCount }).map((_, i) => (
              <option key={i} value={i}>
                Process P{i} (Need: [{need[i]?.join(', ')}])
              </option>
            ))}
          </select>
        </div>

        {/* Resource Vector Input Fields */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 block">
            Enter Resource Request Vector:
          </label>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {Array.from({ length: resourceCount }).map((_, j) => (
              <div key={j} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold">R{j}</span>
                <input
                  type="number"
                  min="0"
                  value={requestVector[j] !== undefined ? requestVector[j] : 0}
                  onChange={(e) => handleRequestChange(j, parseInt(e.target.value) || 0)}
                  className="w-16 p-2 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400 focus:border-cyan-500"
                />
              </div>
            ))}

            <button
              onClick={handleEvaluateRequest}
              className="py-2.5 px-4 rounded-xl bg-cyan-600 text-white font-mono font-bold text-xs hover:bg-cyan-700 transition-colors shadow-md cursor-pointer shrink-0 ml-2"
            >
              Evaluate Request
            </button>
          </div>
        </div>
      </div>

      {/* Result Display Banner */}
      {evaluationResult && (
        <div className={`p-5 rounded-2xl border-2 transition-all space-y-2 ${
          evaluationResult.granted
            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500 text-rose-300'
        }`}>
          <div className="flex items-center gap-2 font-mono font-extrabold text-sm">
            {evaluationResult.granted ? (
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />
            )}
            <span className={evaluationResult.granted ? 'text-emerald-500' : 'text-rose-500'}>
              {evaluationResult.granted ? 'REQUEST CAN BE GRANTED' : 'REQUEST DENIED / MUST WAIT'}
            </span>
          </div>

          <p className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
            {evaluationResult.message}
          </p>

          {evaluationResult.granted && (
            <button
              onClick={() => onGrantRequest(targetProcess, requestVector)}
              className="mt-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-700 cursor-pointer"
            >
              Apply Allocation to State
            </button>
          )}
        </div>
      )}
    </div>
  );
}

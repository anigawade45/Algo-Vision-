import { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Mail,
  CreditCard,
  Package,
  Layers
} from 'lucide-react';

export function SyncAsyncComparison({ onCompleteStep, isCompleted }) {
  const [syncState, setSyncState] = useState({
    status: 'idle', // 'idle', 'running', 'success', 'failed'
    currentStep: -1,
    totalTimeMs: 0,
    steps: [
      { id: 'validate', label: '1. Validate & Reserve Inventory', duration: 300, icon: Package, status: 'pending' },
      { id: 'payment', label: '2. Process Stripe Payment', duration: 800, icon: CreditCard, status: 'pending' },
      { id: 'email', label: '3. Send Confirmation Email (SendGrid)', duration: 1600, icon: Mail, status: 'pending' },
      { id: 'analytics', label: '4. Record Analytics & Warehouse Sync', duration: 600, icon: Layers, status: 'pending' },
    ],
  });

  const [asyncState, setAsyncState] = useState({
    status: 'idle',
    currentStep: -1,
    clientTimeMs: 0,
    steps: [
      { id: 'validate', label: '1. Validate & Reserve Inventory', duration: 300, icon: Package, status: 'pending' },
      { id: 'payment', label: '2. Process Stripe Payment', duration: 800, icon: CreditCard, status: 'pending' },
      { id: 'enqueue', label: '3. Publish `OrderPlaced` to Queue', duration: 25, icon: Zap, status: 'pending' },
      { id: 'background', label: '4. Workers process Email & Warehouse in Background', duration: 1600, icon: Mail, status: 'pending', isAsync: true },
    ],
  });

  const [simulateEmailTimeout, setSimulateEmailTimeout] = useState(false);

  // Run Synchronous Flow
  const handleRunSync = () => {
    setSyncState({
      status: 'running',
      currentStep: 0,
      totalTimeMs: 0,
      steps: [
        { id: 'validate', label: '1. Validate & Reserve Inventory', duration: 300, icon: Package, status: 'pending' },
        { id: 'payment', label: '2. Process Stripe Payment', duration: 800, icon: CreditCard, status: 'pending' },
        { id: 'email', label: '3. Send Confirmation Email (SendGrid)', duration: simulateEmailTimeout ? 3000 : 1600, icon: Mail, status: 'pending' },
        { id: 'analytics', label: '4. Record Analytics & Warehouse Sync', duration: 600, icon: Layers, status: 'pending' },
      ],
    });

    // Step 0: Validate
    setTimeout(() => {
      setSyncState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[0] = { ...nextSteps[0], status: 'completed' };
        return { ...prev, currentStep: 1, steps: nextSteps };
      });

      // Step 1: Payment
      setTimeout(() => {
        setSyncState((prev) => {
          const nextSteps = [...prev.steps];
          nextSteps[1] = { ...nextSteps[1], status: 'completed' };
          return { ...prev, currentStep: 2, steps: nextSteps };
        });

        // Step 2: Email (or timeout error)
        if (simulateEmailTimeout) {
          setTimeout(() => {
            setSyncState((prev) => {
              const nextSteps = [...prev.steps];
              nextSteps[2] = { ...nextSteps[2], status: 'failed' };
              return {
                ...prev,
                status: 'failed',
                currentStep: 2,
                totalTimeMs: 4100,
                steps: nextSteps,
              };
            });
          }, 3000);
        } else {
          setTimeout(() => {
            setSyncState((prev) => {
              const nextSteps = [...prev.steps];
              nextSteps[2] = { ...nextSteps[2], status: 'completed' };
              return { ...prev, currentStep: 3, steps: nextSteps };
            });

            // Step 3: Analytics
            setTimeout(() => {
              setSyncState((prev) => {
                const nextSteps = [...prev.steps];
                nextSteps[3] = { ...nextSteps[3], status: 'completed' };
                return {
                  ...prev,
                  status: 'success',
                  currentStep: 4,
                  totalTimeMs: 3300,
                  steps: nextSteps,
                };
              });
            }, 600);
          }, 1600);
        }
      }, 800);
    }, 300);
  };

  // Run Asynchronous Flow
  const handleRunAsync = () => {
    setAsyncState({
      status: 'running',
      currentStep: 0,
      clientTimeMs: 0,
      steps: [
        { id: 'validate', label: '1. Validate & Reserve Inventory', duration: 300, icon: Package, status: 'pending' },
        { id: 'payment', label: '2. Process Stripe Payment', duration: 800, icon: CreditCard, status: 'pending' },
        { id: 'enqueue', label: '3. Publish `OrderPlaced` to Queue', duration: 25, icon: Zap, status: 'pending' },
        { id: 'background', label: '4. Workers process Email & Warehouse in Background', duration: 1600, icon: Mail, status: 'pending', isAsync: true },
      ],
    });

    // Step 0: Validate
    setTimeout(() => {
      setAsyncState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[0] = { ...nextSteps[0], status: 'completed' };
        return { ...prev, currentStep: 1, steps: nextSteps };
      });

      // Step 1: Payment
      setTimeout(() => {
        setAsyncState((prev) => {
          const nextSteps = [...prev.steps];
          nextSteps[1] = { ...nextSteps[1], status: 'completed' };
          return { ...prev, currentStep: 2, steps: nextSteps };
        });

        // Step 2: Enqueue (Instant 25ms ACK!)
        setTimeout(() => {
          setAsyncState((prev) => {
            const nextSteps = [...prev.steps];
            nextSteps[2] = { ...nextSteps[2], status: 'completed' };
            return {
              ...prev,
              status: 'client-ack',
              currentStep: 3,
              clientTimeMs: 1125,
              steps: nextSteps,
            };
          });

          // Step 3: Background Worker finishes independently
          setTimeout(() => {
            setAsyncState((prev) => {
              const nextSteps = [...prev.steps];
              nextSteps[3] = { ...nextSteps[3], status: 'completed' };
              return {
                ...prev,
                status: 'success',
                currentStep: 4,
                steps: nextSteps,
              };
            });
          }, 1600);
        }, 30);
      }, 800);
    }, 300);
  };

  const handleReset = () => {
    setSyncState({
      status: 'idle',
      currentStep: -1,
      totalTimeMs: 0,
      steps: [
        { id: 'validate', label: '1. Validate & Reserve Inventory', duration: 300, icon: Package, status: 'pending' },
        { id: 'payment', label: '2. Process Stripe Payment', duration: 800, icon: CreditCard, status: 'pending' },
        { id: 'email', label: '3. Send Confirmation Email (SendGrid)', duration: 1600, icon: Mail, status: 'pending' },
        { id: 'analytics', label: '4. Record Analytics & Warehouse Sync', duration: 600, icon: Layers, status: 'pending' },
      ],
    });

    setAsyncState({
      status: 'idle',
      currentStep: -1,
      clientTimeMs: 0,
      steps: [
        { id: 'validate', label: '1. Validate & Reserve Inventory', duration: 300, icon: Package, status: 'pending' },
        { id: 'payment', label: '2. Process Stripe Payment', duration: 800, icon: CreditCard, status: 'pending' },
        { id: 'enqueue', label: '3. Publish `OrderPlaced` to Queue', duration: 25, icon: Zap, status: 'pending' },
        { id: 'background', label: '4. Workers process Email & Warehouse in Background', duration: 1600, icon: Mail, status: 'pending', isAsync: true },
      ],
    });
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Interactive Lab • Step 1 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Synchronous vs. Asynchronous Architecture
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Compare how a tight <strong className="text-rose-600 dark:text-rose-400 font-semibold">Synchronous Call Chain</strong> blocks the user for 3+ seconds and causes cascading timeouts, whereas an <strong className="text-purple-600 dark:text-purple-400 font-semibold">Asynchronous Message Queue</strong> acknowledges in milliseconds and isolates background worker execution.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B101D] text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={simulateEmailTimeout}
                onChange={(e) => setSimulateEmailTimeout(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Simulate 3rd-Party Email Outage
              </span>
            </label>

            <button
              onClick={handleReset}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Simulation Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Synchronous Blocking Pipeline */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border-2 border-rose-200 dark:border-rose-950/60 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Synchronous Direct Request Chain</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sequential Blocking HTTP Calls</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300">
                BLOCKING
              </span>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-2.5">
              {syncState.steps.map((step, idx) => {
                const Icon = step.icon;
                const isStepActive = syncState.currentStep === idx && syncState.status === 'running';
                const isStepDone = step.status === 'completed';
                const isStepFailed = step.status === 'failed';

                let stepBg = 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400';
                if (isStepActive) {
                  stepBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-100 animate-pulse';
                } else if (isStepDone) {
                  stepBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-100';
                } else if (isStepFailed) {
                  stepBg = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-100 font-bold';
                }

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${stepBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="font-semibold">{step.label}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span>{step.duration}ms</span>
                      {isStepDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      {isStepFailed && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                      {isStepActive && <Clock className="w-4 h-4 text-amber-600 animate-spin" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Performance Stats Banner */}
            {syncState.status !== 'idle' && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in ${
                  syncState.status === 'failed'
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : syncState.status === 'success'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Client Request Latency:</span>
                  <span className="text-sm font-mono">{syncState.totalTimeMs || 'Calculating...'} ms</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {syncState.status === 'failed'
                    ? '💥 HTTP 504 Gateway Timeout! The external SendGrid outage hung the entire order request, leaving the client frustrated and blocking connection thread pools.'
                    : syncState.status === 'success'
                    ? '⚠️ Client waited 3.3 seconds with a loading spinner before receiving an order confirmation response.'
                    : 'Client connection is blocked waiting for all downstream services to finish sequentially...'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleRunSync}
            disabled={syncState.status === 'running'}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>{syncState.status === 'running' ? 'Executing Synchronous Chain...' : 'Simulate Synchronous Checkout'}</span>
          </button>
        </div>

        {/* Right: Asynchronous Message Queue Pipeline */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border-2 border-purple-200 dark:border-purple-950/60 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Asynchronous Message Queue Architecture</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant ACK + Background Consumer Pool</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300">
                DECOUPLED
              </span>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-2.5">
              {asyncState.steps.map((step, idx) => {
                const Icon = step.icon;
                const isStepActive = asyncState.currentStep === idx && asyncState.status === 'running';
                const isStepDone = step.status === 'completed';

                let stepBg = 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400';
                if (isStepActive) {
                  stepBg = 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-900 dark:text-purple-100 animate-pulse';
                } else if (isStepDone) {
                  stepBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-100';
                }

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${stepBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <div>
                        <span className="font-semibold block">{step.label}</span>
                        {step.isAsync && (
                          <span className="text-[10px] opacity-75 font-mono">
                            ⚡ Non-blocking (runs on worker pool)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span>{step.duration}ms</span>
                      {isStepDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      {isStepActive && <Clock className="w-4 h-4 text-purple-600 animate-spin" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Performance Stats Banner */}
            {(asyncState.status === 'client-ack' || asyncState.status === 'success') && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between font-bold">
                  <span>Client Acknowledged In:</span>
                  <span className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {asyncState.clientTimeMs} ms (⚡ ~3x Faster!)
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  ✅ The API acknowledged the user order instantly once published to the message queue. Downstream email dispatch and warehouse sync happen asynchronously with automated retries.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleRunAsync}
            disabled={asyncState.status === 'running'}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>{asyncState.status === 'running' ? 'Executing Asynchronous Queue...' : 'Simulate Async Queue Checkout'}</span>
          </button>
        </div>
      </div>

      {/* 3. Architectural Key Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Temporal Decoupling
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Producers and consumers operate on independent timelines. Consumers can be offline or undergoing maintenance without dropping incoming traffic.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
            <Zap className="w-4 h-4" /> Traffic Spike Smoothing
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Queues act as backpressure shock absorbers during flash sales, buffering millions of events while workers consume at a sustainable steady rate.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" /> Failure Isolation
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A crash in a downstream analytics worker will never cause checkout requests to fail for paying end users.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SyncAsyncComparison;

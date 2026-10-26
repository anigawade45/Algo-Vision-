import { useState } from 'react';
import { ShieldCheck, Zap, Clock, Cpu, ArrowRight, Play, RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';

export const CriticalSectionRequirements = () => {
  // Lifecycle simulator state
  const [p1Stage, setP1Stage] = useState('ENTRY'); // ENTRY, CRITICAL, EXIT, REMAINDER
  const [p2Stage, setP2Stage] = useState('ENTRY');
  const [enforceMutex, setEnforceMutex] = useState(true);
  const [lifecycleLog, setLifecycleLog] = useState(['Simulator initialized with Mutual Exclusion ACTIVE.']);

  // Active requirement tab
  const [activeReq, setActiveReq] = useState('mutex'); // mutex, progress, bounded, speed

  // Progress Demo State
  const [csStatus, setCsStatus] = useState('EMPTY'); // EMPTY, P1_INSIDE
  const [progressMsg, setProgressMsg] = useState('Critical Section is empty. P1 wants to enter.');

  // Bounded Waiting State
  const [p1Turns, setP1Turns] = useState(0);
  const [p2Turns, setP2Turns] = useState(0);
  const [boundedAlert, setBoundedAlert] = useState('Fair round-robin allocation prevents starvation.');

  const stages = [
    { key: 'ENTRY', label: '1. Entry Section', color: 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400', desc: 'Requests permission to enter CS' },
    { key: 'CRITICAL', label: '2. Critical Section', color: 'border-amber-500 bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 font-bold', desc: 'Modifies shared resources/variables' },
    { key: 'EXIT', label: '3. Exit Section', color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', desc: 'Releases lock / notifies waiting processes' },
    { key: 'REMAINDER', label: '4. Remainder Section', color: 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400', desc: 'Non-critical background code execution' }
  ];

  const handleStageAdvance = (proc) => {
    const current = proc === 'P1' ? p1Stage : p2Stage;
    const otherStage = proc === 'P1' ? p2Stage : p1Stage;
    let next;

    if (current === 'ENTRY') next = 'CRITICAL';
    else if (current === 'CRITICAL') next = 'EXIT';
    else if (current === 'EXIT') next = 'REMAINDER';
    else next = 'ENTRY';

    // Check Mutex constraint if attempting to enter CRITICAL
    if (next === 'CRITICAL' && enforceMutex && otherStage === 'CRITICAL') {
      setLifecycleLog(prev => [`[BLOCKED] ${proc} cannot enter Critical Section because ${proc === 'P1' ? 'P2' : 'P1'} is inside!`, ...prev.slice(0, 9)]);
      return;
    }

    if (proc === 'P1') setP1Stage(next);
    else setP2Stage(next);

    setLifecycleLog(prev => [`[${proc}] Advanced to ${next} Section`, ...prev.slice(0, 9)]);
  };

  const handleResetLifecycle = () => {
    setP1Stage('ENTRY');
    setP2Stage('ENTRY');
    setLifecycleLog(['Simulator reset. Both processes placed in Entry Section.']);
  };

  // Requirement Card Data
  const requirements = [
    {
      id: 'mutex',
      title: '1. Mutual Exclusion',
      icon: ShieldCheck,
      short: 'Only ONE process inside Critical Section at a time.',
      badge: 'Mandatory',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
      description: 'If process P1 is executing in its critical section, no other processes can be executing in their critical sections concurrently.',
    },
    {
      id: 'progress',
      title: '2. Progress',
      icon: Zap,
      short: 'Selection of next process cannot be postponed indefinitely.',
      badge: 'Mandatory',
      badgeColor: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30',
      description: 'If no process is executing in its critical section and some processes wish to enter, only processes NOT in their remainder section can participate in deciding who enters next.',
    },
    {
      id: 'bounded',
      title: '3. Bounded Waiting',
      icon: Clock,
      short: 'Limits how many times others enter after a request is made.',
      badge: 'Mandatory',
      badgeColor: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30',
      description: 'There must be a bound/limit on the number of times other processes are allowed to enter their critical section after a process has made a request to enter, preventing starvation.',
    },
    {
      id: 'speed',
      title: '4. Architectural Independence',
      icon: Cpu,
      short: 'No assumptions about relative CPU speeds or core counts.',
      badge: 'Design Principle',
      badgeColor: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
      description: 'The solution must function correctly regardless of hardware architecture, CPU clock speed, number of CPU cores, or thread scheduling priorities.',
    },
  ];

  const handleSimulateProgress = () => {
    if (csStatus === 'EMPTY') {
      setCsStatus('P1_INSIDE');
      setProgressMsg('P1 requested entry when CS was empty -> P1 immediately granted access (No unnecessary blocking).');
    } else {
      setCsStatus('EMPTY');
      setProgressMsg('P1 completed execution and exited CS. Critical Section is now open for waiting candidates.');
    }
  };

  const handleSimulateBoundedP1 = () => {
    if (p1Turns - p2Turns >= 2) {
      setBoundedAlert('BOUNDED WAITING VIOLATION PREVENTED: P1 has entered 2 consecutive times while P2 was waiting. P2 must be given the next turn to prevent starvation!');
      return;
    }
    setP1Turns(prev => prev + 1);
    setBoundedAlert(`P1 entered Critical Section (Total P1 turns: ${p1Turns + 1}, P2 turns: ${p2Turns}). Queue balanced.`);
  };

  const handleSimulateBoundedP2 = () => {
    setP2Turns(prev => prev + 1);
    setBoundedAlert(`P2 entered Critical Section (Total P2 turns: ${p2Turns + 1}, P1 turns: ${p1Turns}). Queue balanced.`);
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Critical Section Architecture</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">The structure of process code and the strict requirements for valid synchronization</p>
          </div>
        </div>

        {/* Code Lifecycle Diagram */}
        <div className="bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-5">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <span>Process Execution Lifecycle Code Template</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {stages.map((st) => (
              <div
                key={st.key}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${st.color}`}
              >
                <div>
                  <span className="text-xs font-mono tracking-wider uppercase opacity-75">{st.key}</span>
                  <h4 className="font-semibold text-sm mt-0.5 mb-1">{st.label}</h4>
                  <p className="text-xs opacity-80 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Process CS Lifecycle Simulator */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interactive Critical Section Lifecycle Simulator</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Step processes through Entry, Critical Section, Exit, and Remainder code blocks</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
              <input
                type="checkbox"
                checked={enforceMutex}
                onChange={(e) => setEnforceMutex(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-amber-500 focus:ring-amber-500/20"
              />
              <span>Enforce Mutual Exclusion</span>
            </label>

            <button
              onClick={handleResetLifecycle}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* P1 State Card */}
          <div className="bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-200">Process P1</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-mono uppercase font-semibold border ${
                p1Stage === 'CRITICAL' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}>
                State: {p1Stage}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {stages.map((st) => {
                const isActive = p1Stage === st.key;
                return (
                  <div
                    key={st.key}
                    className={`p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                      isActive ? 'bg-blue-100 dark:bg-blue-500/20 border-blue-400 dark:border-blue-500/50 text-blue-900 dark:text-blue-300 font-bold shadow-sm' : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500'
                    }`}
                  >
                    <span>{st.label}</span>
                    {isActive && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">ACTIVE</span>}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleStageAdvance('P1')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Advance P1 Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* P2 State Card */}
          <div className="bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-200">Process P2</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-mono uppercase font-semibold border ${
                p2Stage === 'CRITICAL' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}>
                State: {p2Stage}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {stages.map((st) => {
                const isActive = p2Stage === st.key;
                return (
                  <div
                    key={st.key}
                    className={`p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                      isActive ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-400 dark:border-purple-500/50 text-purple-900 dark:text-purple-300 font-bold shadow-sm' : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500'
                    }`}
                  >
                    <span>{st.label}</span>
                    {isActive && <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded font-bold">ACTIVE</span>}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleStageAdvance('P2')}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Advance P2 Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Shared Critical Section Chamber */}
        <div className="bg-slate-50 dark:bg-[#070A12] border border-amber-500/30 rounded-xl p-5 mb-6 text-center">
          <div className="text-xs font-mono text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Shared Resource Critical Chamber</span>
          </div>

          <div className="min-h-[70px] border-2 border-dashed border-amber-500/40 bg-amber-500/5 rounded-lg p-4 flex items-center justify-center gap-4">
            {p1Stage !== 'CRITICAL' && p2Stage !== 'CRITICAL' && (
              <span className="text-sm font-mono text-slate-500 dark:text-slate-500 italic">Critical Section is currently EMPTY</span>
            )}
            {p1Stage === 'CRITICAL' && (
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-500/20 border border-blue-500 text-blue-800 dark:text-blue-300 font-mono text-sm font-bold rounded-lg flex items-center gap-2 animate-bounce">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>P1 INSIDE CRITICAL SECTION</span>
              </div>
            )}
            {p2Stage === 'CRITICAL' && (
              <div className="px-4 py-2 bg-purple-100 dark:bg-purple-500/20 border border-purple-500 text-purple-800 dark:text-purple-300 font-mono text-sm font-bold rounded-lg flex items-center gap-2 animate-bounce">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>P2 INSIDE CRITICAL SECTION</span>
              </div>
            )}
            {p1Stage === 'CRITICAL' && p2Stage === 'CRITICAL' && (
              <div className="mt-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20 border border-red-500/40 px-3 py-1 rounded">
                MUTUAL EXCLUSION VIOLATED! Data corruption risk high!
              </div>
            )}
          </div>
        </div>

        {/* Transition Log */}
        <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mb-2 font-bold">Execution Event Log</div>
          <div className="space-y-1 font-mono text-xs max-h-24 overflow-y-auto">
            {lifecycleLog.map((log, i) => (
              <div key={i} className={`py-0.5 ${log.includes('BLOCKED') ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronization Requirements Cards */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4 Core Requirements of Synchronization</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Every valid synchronization protocol (Peterson's, Mutex, Semaphores) must satisfy these criteria</p>
        </div>

        {/* Requirement Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {requirements.map((req) => {
            const Icon = req.icon;
            const isSelected = activeReq === req.id;
            return (
              <button
                key={req.id}
                onClick={() => setActiveReq(req.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`} />
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${req.badgeColor}`}>
                      {req.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200 mb-1">{req.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">{req.short}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Requirement Detailed View & Interactive Mini-Demo */}
        <div className="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          {activeReq === 'mutex' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Mutual Exclusion (Mutex)</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    If process P1 is executing in its Critical Section, no other process (P2, P3, etc.) can execute in its Critical Section concurrently.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>VALID (Mutual Exclusion Upheld)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">P1 inside CS $\rightarrow$ P2 is WAITING outside.</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-xs mb-1">
                    <XCircle className="w-4 h-4" />
                    <span>INVALID (Race Condition Risk)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">P1 inside CS AND P2 inside CS at the exact same moment.</p>
                </div>
              </div>
            </div>
          )}

          {activeReq === 'progress' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Progress Requirement</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    If no process is currently in the Critical Section and some processes want to enter, only those processes NOT in their remainder section can participate in deciding who enters next. This decision cannot be postponed indefinitely.
                  </p>
                </div>
              </div>

              {/* Progress Mini Simulator */}
              <div className="bg-white dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">Interactive Progress Check:</span>
                  <button
                    onClick={handleSimulateProgress}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Toggle P1 CS Entry Request</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono text-xs text-blue-800 dark:text-blue-300">
                  {progressMsg}
                </div>
              </div>
            </div>
          )}

          {activeReq === 'bounded' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Bounded Waiting Requirement</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    There must be a limit (bound) on the number of times other processes are allowed to enter their critical section after a process has made a request to enter, preventing indefinite starvation.
                  </p>
                </div>
              </div>

              {/* Bounded Waiting Mini Interactive */}
              <div className="bg-white dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSimulateBoundedP1}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium cursor-pointer"
                  >
                    P1 Requests & Grants CS (P1 Turns: {p1Turns})
                  </button>
                  <button
                    onClick={handleSimulateBoundedP2}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium cursor-pointer"
                  >
                    P2 Grants CS (P2 Turns: {p2Turns})
                  </button>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono text-xs text-purple-800 dark:text-purple-300">
                  {boundedAlert}
                </div>
              </div>
            </div>
          )}

          {activeReq === 'speed' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Cpu className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Architectural / Speed Independence</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    The synchronization solution must work reliably across all hardware environments. No assumptions may be made about the clock speeds of processors, the number of CPU cores, or the execution rates of threads.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                  <Info className="w-4 h-4" />
                  <span>Why hardware timing loops like "busy sleep for 100ms" fail:</span>
                </div>
                <p>
                  A loop that waits for 1000 CPU ticks on a 1.0 GHz processor takes 1 microsecond, whereas on a 4.0 GHz processor it takes 0.25 microseconds. Relying on execution speed creates hidden race conditions!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Server, 
  Database, 
  Laptop, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Code
} from 'lucide-react';
import { CLIENT_SERVER_PRESETS } from '../../data/basicsModuleData';

export function ClientServerVisualizerSection({ onCompleteStep, isCompleted }) {
  const [selectedPresetId, setSelectedPresetId] = useState('search');
  // Simulation stage: 0 = Idle, 1 = Client -> Server, 2 = Server Processing, 3 = Server -> DB, 4 = DB -> Server, 5 = Server -> Client, 6 = Completed
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);
  const [activeInspectionTab, setActiveInspectionTab] = useState('summary'); // 'summary' | 'request' | 'database' | 'response'

  const timerRef = useRef(null);

  const activePreset = CLIENT_SERVER_PRESETS.find((p) => p.id === selectedPresetId) || CLIENT_SERVER_PRESETS[0];

  const STAGE_CONFIGS = [
    {
      stage: 0,
      title: 'System Idle',
      activeComponent: 'none',
      badge: 'Ready',
      description: 'Select a preset request and click "Send Request" or "Run Next Step" to trace the packet transmission through the architecture.'
    },
    {
      stage: 1,
      title: 'Step 1: Client Transmits Request',
      activeComponent: 'client-to-server',
      badge: 'Network Hop (Client ➔ Server)',
      description: activePreset.stepNotes[0]
    },
    {
      stage: 2,
      title: 'Step 2: Server Authentication & Routing',
      activeComponent: 'server',
      badge: 'Compute Tier Processing',
      description: activePreset.stepNotes[1]
    },
    {
      stage: 3,
      title: 'Step 3: Database Query Execution',
      activeComponent: 'server-to-db',
      badge: 'Data Layer I/O',
      description: activePreset.stepNotes[2]
    },
    {
      stage: 4,
      title: 'Step 4: Database Returns Result Set',
      activeComponent: 'db-to-server',
      badge: 'Data Serialization',
      description: activePreset.stepNotes[3]
    },
    {
      stage: 5,
      title: 'Step 5: Server Delivers HTTP Response',
      activeComponent: 'server-to-client',
      badge: 'Network Hop (Server ➔ Client)',
      description: activePreset.stepNotes[4]
    },
    {
      stage: 6,
      title: 'Request-Response Cycle Complete',
      activeComponent: 'completed',
      badge: '200 OK • Completed',
      description: `Successfully finished round-trip in ${activePreset.timings.total}ms! Client DOM updated with response data.`
    }
  ];

  const currentStageInfo = STAGE_CONFIGS[currentStage] || STAGE_CONFIGS[0];

  // Auto-play timer logic
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = 1800 / playbackSpeed;
      timerRef.current = setTimeout(() => {
        setCurrentStage((prev) => {
          if (prev < 5) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return 6;
          }
        });
      }, stepDuration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStage, playbackSpeed]);

  const handleStartSimulation = () => {
    if (currentStage === 6) {
      setCurrentStage(1);
    } else if (currentStage === 0) {
      setCurrentStage(1);
    }
    setIsPlaying(true);
  };

  const handlePauseSimulation = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStage(0);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStage((prev) => (prev >= 6 ? 0 : prev + 1));
  };

  const handlePresetChange = (presetId) => {
    handleResetSimulation();
    setSelectedPresetId(presetId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Visualizer Control Toolbar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Client-Server Request-Response Lifecycle
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Trace packets and state transformations as a request flows from Client ➔ Server ➔ Database and back.
              </p>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Preset:</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
              {CLIENT_SERVER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedPresetId === preset.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {preset.name.split(' ')[1]} ({preset.method})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Play / Pause Button */}
            {!isPlaying ? (
              <button
                onClick={handleStartSimulation}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{currentStage === 0 ? 'Send Request' : 'Resume Flow'}</span>
              </button>
            ) : (
              <button
                onClick={handlePauseSimulation}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Flow</span>
              </button>
            )}

            {/* Run Next Step Button */}
            <button
              onClick={handleStepForward}
              disabled={isPlaying}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
              <span>Next Step</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetSimulation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Controller */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs font-mono">
              <span className="text-slate-400 px-1.5">Speed:</span>
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Request Details Inspector Toggle */}
            <button
              onClick={() => setShowPayloadInspector(!showPayloadInspector)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showPayloadInspector
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 text-purple-700 dark:text-purple-300'
                  : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-purple-500" />
              <span>Inspector Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Animated Topology Stage */}
      <div className="rounded-3xl bg-linear-to-b from-slate-900 via-slate-950 to-[#0B101D] border border-slate-800 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Top Status Bar of Simulation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
            <div className="text-sm font-bold text-slate-200">
              {currentStageInfo.title}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 font-bold">
              Stage {Math.min(currentStage, 5)} / 5
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Est. Latency: <strong>{activePreset.timings.total}ms</strong></span>
            </span>
          </div>
        </div>

        {/* 3-Tier Architecture Diagram with Animated Packet Connectors */}
        <div className="py-12 px-2 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 items-center relative">
            {/* Component 1: Client Browser / App */}
            <div
              className={`p-6 rounded-3xl border-2 transition-all duration-300 text-center space-y-3 relative ${
                currentStage === 1 || currentStage === 6
                  ? 'bg-purple-950/60 border-purple-400 shadow-xl shadow-purple-500/20 ring-4 ring-purple-500/20 scale-105'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 opacity-90'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-600/30">
                <Laptop className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Client Device</h4>
                <p className="text-xs font-mono text-purple-300 mt-0.5">Browser / Mobile App</p>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-slate-800 text-[11px] font-mono text-slate-300">
                IP: 192.0.2.45
              </div>

              {currentStage === 1 && (
                <div className="text-[11px] font-mono font-bold text-purple-300 animate-pulse">
                  ➔ Sending {activePreset.method} request
                </div>
              )}
              {currentStage === 6 && (
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  ✔ Rendered Response ({activePreset.statusCode})
                </div>
              )}
            </div>

            {/* Connection Link 1 (Client <-> Server) with Packet Animation */}
            <div className="hidden md:flex flex-col items-center justify-center absolute left-[28%] w-[11%] z-20">
              <div className="w-full h-1 bg-slate-800 relative rounded-full overflow-hidden">
                {currentStage === 1 && (
                  <div className="w-6 h-full bg-linear-to-r from-transparent via-purple-400 to-white rounded-full animate-[ping_1.5s_infinite] shadow-lg shadow-purple-400" />
                )}
                {currentStage === 5 && (
                  <div className="w-6 h-full bg-linear-to-l from-transparent via-emerald-400 to-white rounded-full animate-[ping_1.5s_infinite] shadow-lg shadow-emerald-400" />
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                {currentStage === 1 ? 'HTTP Request ➔' : currentStage === 5 ? '⬅ HTTP 200' : 'HTTPS / TLS 1.3'}
              </span>
            </div>

            {/* Component 2: Application Server */}
            <div
              className={`p-6 rounded-3xl border-2 transition-all duration-300 text-center space-y-3 relative ${
                currentStage === 2 || currentStage === 4 || currentStage === 5
                  ? 'bg-indigo-950/60 border-indigo-400 shadow-xl shadow-indigo-500/20 ring-4 ring-indigo-500/20 scale-105'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 opacity-90'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
                <Server className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Application Server</h4>
                <p className="text-xs font-mono text-indigo-300 mt-0.5">API Gateway / Node.js</p>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-slate-800 text-[11px] font-mono text-slate-300">
                Port: 443 (HTTPS)
              </div>

              {currentStage === 2 && (
                <div className="text-[11px] font-mono font-bold text-indigo-300 animate-pulse">
                  ⚙ Validating JWT & Routing
                </div>
              )}
              {currentStage === 5 && (
                <div className="text-[11px] font-mono font-bold text-indigo-300 animate-pulse">
                  ➔ Formatting JSON Response
                </div>
              )}
            </div>

            {/* Connection Link 2 (Server <-> Database) with Packet Animation */}
            <div className="hidden md:flex flex-col items-center justify-center absolute left-[62%] w-[11%] z-20">
              <div className="w-full h-1 bg-slate-800 relative rounded-full overflow-hidden">
                {currentStage === 3 && (
                  <div className="w-6 h-full bg-linear-to-r from-transparent via-amber-400 to-white rounded-full animate-[ping_1.5s_infinite] shadow-lg shadow-amber-400" />
                )}
                {currentStage === 4 && (
                  <div className="w-6 h-full bg-linear-to-l from-transparent via-emerald-400 to-white rounded-full animate-[ping_1.5s_infinite] shadow-lg shadow-emerald-400" />
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                {currentStage === 3 ? 'SQL Query ➔' : currentStage === 4 ? '⬅ Query Rows' : 'TCP Connection Pool'}
              </span>
            </div>

            {/* Component 3: Database Engine */}
            <div
              className={`p-6 rounded-3xl border-2 transition-all duration-300 text-center space-y-3 relative ${
                currentStage === 3 || currentStage === 4
                  ? 'bg-amber-950/60 border-amber-400 shadow-xl shadow-amber-500/20 ring-4 ring-amber-500/20 scale-105'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 opacity-90'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-600/30">
                <Database className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Database Engine</h4>
                <p className="text-xs font-mono text-amber-300 mt-0.5">PostgreSQL / Sharded Cluster</p>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-slate-800 text-[11px] font-mono text-slate-300">
                Port: 5432 (SQL)
              </div>

              {currentStage === 3 && (
                <div className="text-[11px] font-mono font-bold text-amber-300 animate-pulse">
                  ⚡ Scanning B-Tree Indexes
                </div>
              )}
              {currentStage === 4 && (
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  ✔ Returning Recordset
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Step Explanation Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              {currentStageInfo.badge}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Endpoint: <strong className="text-purple-300">{activePreset.endpoint}</strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {currentStageInfo.description}
          </p>
        </div>
      </div>

      {/* Detailed Request/Response Payload Inspector Panel */}
      {showPayloadInspector && (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-5 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Code className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Protocol Payload Inspector
              </h3>
            </div>

            {/* Inspector Sub-Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-xl">
              <button
                onClick={() => setActiveInspectionTab('summary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeInspectionTab === 'summary'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Summary & Latency
              </button>

              <button
                onClick={() => setActiveInspectionTab('request')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeInspectionTab === 'request'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                HTTP Request
              </button>

              <button
                onClick={() => setActiveInspectionTab('database')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeInspectionTab === 'database'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                SQL & DB I/O
              </button>

              <button
                onClick={() => setActiveInspectionTab('response')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeInspectionTab === 'response'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                HTTP Response
              </button>
            </div>
          </div>

          {/* Sub-Tab 1: Latency Breakdown Summary */}
          {activeInspectionTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-mono text-slate-400">DNS Resolution</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">{activePreset.timings.dns}ms</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-mono text-slate-400">TCP + TLS Handshake</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">{activePreset.timings.tcpTls}ms</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-mono text-slate-400">Server CPU Processing</span>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{activePreset.timings.serverProcessing}ms</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-mono text-slate-400">Database Disk/Index</span>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">{activePreset.timings.dbQuery}ms</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
                  <span className="text-[11px] font-mono text-purple-600 dark:text-purple-300 font-bold">Total Round-Trip</span>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-300 font-mono mt-0.5">{activePreset.timings.total}ms</p>
                </div>
              </div>

              {/* Progress bar of latency share */}
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div style={{ width: `${(activePreset.timings.dns / activePreset.timings.total) * 100}%` }} className="bg-sky-500 h-full" title="DNS" />
                <div style={{ width: `${(activePreset.timings.tcpTls / activePreset.timings.total) * 100}%` }} className="bg-blue-500 h-full" title="TCP/TLS" />
                <div style={{ width: `${(activePreset.timings.serverProcessing / activePreset.timings.total) * 100}%` }} className="bg-indigo-500 h-full" title="Server" />
                <div style={{ width: `${(activePreset.timings.dbQuery / activePreset.timings.total) * 100}%` }} className="bg-amber-500 h-full" title="DB" />
                <div style={{ width: `${(activePreset.timings.transfer / activePreset.timings.total) * 100}%` }} className="bg-emerald-500 h-full" title="Transfer" />
              </div>
            </div>
          )}

          {/* Sub-Tab 2: HTTP Request Headers & Body */}
          {activeInspectionTab === 'request' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
                <div className="text-purple-400 font-bold">
                  {activePreset.method} {activePreset.endpoint} HTTP/1.1
                </div>
                <div className="text-slate-400 space-y-1">
                  {Object.entries(activePreset.requestHeaders).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-indigo-300">{key}:</span> {val}
                    </div>
                  ))}
                </div>
                {activePreset.requestPayload && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-emerald-400 font-bold">Request Body (JSON):</span>
                    <pre className="mt-1 text-slate-300 overflow-x-auto p-2 bg-black/40 rounded-xl">
                      {JSON.stringify(activePreset.requestPayload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: SQL Query & Rows */}
          {activeInspectionTab === 'database' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-3">
                <div>
                  <span className="text-amber-400 font-bold">Executed SQL Query:</span>
                  <pre className="mt-1 text-amber-200 overflow-x-auto p-2.5 bg-black/50 rounded-xl border border-amber-900/40">
                    {activePreset.dbQuery}
                  </pre>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold">Returned Database Recordset:</span>
                  <pre className="mt-1 text-slate-300 overflow-x-auto p-2.5 bg-black/50 rounded-xl border border-slate-800">
                    {JSON.stringify(activePreset.dbResult, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: HTTP Response Headers & Body */}
          {activeInspectionTab === 'response' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
                <div className="text-emerald-400 font-bold">
                  HTTP/1.1 {activePreset.statusCode} {activePreset.statusText}
                </div>
                <div className="text-slate-400 space-y-1">
                  {Object.entries(activePreset.responseHeaders).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-indigo-300">{key}:</span> {val}
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-purple-400 font-bold">Response Body (JSON):</span>
                  <pre className="mt-1 text-slate-300 overflow-x-auto p-2.5 bg-black/40 rounded-xl">
                    {JSON.stringify(activePreset.responsePayload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  ShieldCheck,
  Server,
  Laptop
} from 'lucide-react';

export function TcpThreeWayHandshake() {
  const [activeSubMode, setActiveSubMode] = useState('handshake'); // 'handshake', 'data', 'teardown'
  const [clientIsn, setClientIsn] = useState(1000);
  const [serverIsn, setServerIsn] = useState(5000);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState(4); // Sliding window size
  const [simulatePacketLoss, setSimulatePacketLoss] = useState(false);

  // 3-Way Handshake Steps
  const handshakeSteps = [
    {
      id: 1,
      title: 'Step 1: Client sends SYN (Synchronize)',
      sender: 'client',
      receiver: 'server',
      packet: {
        flags: ['SYN'],
        seq: clientIsn,
        ack: 0,
        desc: `SYN flag set. Client proposes Initial Sequence Number (ISN_c = ${clientIsn}).`,
      },
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      log: `Client generates ISN=${clientIsn} -> Dispatches SYN segment to Server port 80.`,
    },
    {
      id: 2,
      title: 'Step 2: Server replies with SYN-ACK',
      sender: 'server',
      receiver: 'client',
      packet: {
        flags: ['SYN', 'ACK'],
        seq: serverIsn,
        ack: clientIsn + 1,
        desc: `SYN+ACK flags set. Server acknowledges client (ACK=${clientIsn + 1}) and proposes its own ISN_s = ${serverIsn}.`,
      },
      clientState: 'SYN_SENT',
      serverState: 'SYN_RECEIVED',
      log: `Server allocates TCB buffer, sets ACK=${clientIsn + 1}, and sends SYN-ACK (ISN_s=${serverIsn}).`,
    },
    {
      id: 3,
      title: 'Step 3: Client confirms with ACK',
      sender: 'client',
      receiver: 'server',
      packet: {
        flags: ['ACK'],
        seq: clientIsn + 1,
        ack: serverIsn + 1,
        desc: `ACK flag set. Client acknowledges server's ISN (ACK=${serverIsn + 1}). TCP socket is now ESTABLISHED.`,
      },
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      log: `Client receives SYN-ACK, sets ACK=${serverIsn + 1}, and transitions to ESTABLISHED. Full-duplex link ready!`,
    },
  ];

  // Data Transfer Steps
  const dataSteps = [
    {
      id: 1,
      title: 'Frame 1 & 2: Client bursts data packets within Sliding Window',
      sender: 'client',
      receiver: 'server',
      packet: {
        flags: ['PSH', 'ACK'],
        seq: clientIsn + 1,
        ack: serverIsn + 1,
        desc: `Sending Packet #1 (SEQ=${clientIsn + 1}, 512 bytes) and Packet #2 (SEQ=${clientIsn + 513}, 512 bytes).`,
      },
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      log: `Client Sliding Window (rwnd=${windowSize * 512}B): In-flight packets 1 & 2 dispatched.`,
    },
    {
      id: 2,
      title: simulatePacketLoss
        ? 'Frame Loss Detected & Retransmission Timeout (RTO)'
        : 'Cumulative ACK from Server',
      sender: 'server',
      receiver: 'client',
      packet: {
        flags: ['ACK'],
        seq: serverIsn + 1,
        ack: simulatePacketLoss ? clientIsn + 513 : clientIsn + 1025,
        desc: simulatePacketLoss
          ? `Packet #2 dropped! Server sends Duplicate ACK=${clientIsn + 513} (Fast Retransmit trigger).`
          : `Server confirms receipt of 1024 bytes (Cumulative ACK=${clientIsn + 1025}).`,
      },
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      log: simulatePacketLoss
        ? `Packet loss on Packet #2! Server issues Duplicate ACK=${clientIsn + 513}. Client RTO timer fires -> Fast Retransmit!`
        : `Server receiver buffer accepted 1024 bytes -> Cumulative ACK=${clientIsn + 1025} sliding window advances right.`,
    },
  ];

  // 4-Way Teardown Steps
  const teardownSteps = [
    {
      id: 1,
      title: 'Step 1: Client initiates termination with FIN',
      sender: 'client',
      receiver: 'server',
      packet: { flags: ['FIN', 'ACK'], seq: clientIsn + 2000, ack: serverIsn + 1000, desc: 'Client has no more data to transmit. Sends FIN segment.' },
      clientState: 'FIN_WAIT_1',
      serverState: 'ESTABLISHED',
      log: 'Client sends FIN segment -> enters FIN_WAIT_1 state.',
    },
    {
      id: 2,
      title: 'Step 2: Server acknowledges with ACK',
      sender: 'server',
      receiver: 'client',
      packet: { flags: ['ACK'], seq: serverIsn + 1000, ack: clientIsn + 2001, desc: 'Server confirms client FIN. Half-close active.' },
      clientState: 'FIN_WAIT_2',
      serverState: 'CLOSE_WAIT',
      log: 'Server acknowledges client FIN with ACK -> Client enters FIN_WAIT_2; Server in CLOSE_WAIT.',
    },
    {
      id: 3,
      title: 'Step 3: Server finishes pending tasks and sends FIN',
      sender: 'server',
      receiver: 'client',
      packet: { flags: ['FIN', 'ACK'], seq: serverIsn + 1000, ack: clientIsn + 2001, desc: 'Server sends its own FIN to close server-to-client channel.' },
      clientState: 'TIME_WAIT',
      serverState: 'LAST_ACK',
      log: 'Server transmits FIN segment -> enters LAST_ACK; Client enters TIME_WAIT (2*MSL timer).',
    },
    {
      id: 4,
      title: 'Step 4: Client confirms final ACK',
      sender: 'client',
      receiver: 'server',
      packet: { flags: ['ACK'], seq: clientIsn + 2001, ack: serverIsn + 1001, desc: 'Client sends final ACK. Both sockets cleanly closed (CLOSED).' },
      clientState: 'CLOSED (after 2*MSL)',
      serverState: 'CLOSED',
      log: 'Final ACK delivered. Both sockets returned to CLOSED state. Resources deallocated.',
    },
  ];

  const currentStepsList =
    activeSubMode === 'handshake'
      ? handshakeSteps
      : activeSubMode === 'data'
      ? dataSteps
      : teardownSteps;

  const maxSteps = currentStepsList.length;
  const currentStep = currentStepsList[Math.min(stepIndex, maxSteps - 1)];

  // Auto playback
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, maxSteps]);

  const handleNext = () => {
    if (stepIndex < maxSteps - 1) setStepIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex((prev) => prev - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Submode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638]">
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => {
              setActiveSubMode('handshake');
              handleReset();
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubMode === 'handshake'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            1. 3-Way Handshake
          </button>
          <button
            onClick={() => {
              setActiveSubMode('data');
              handleReset();
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubMode === 'data'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            2. Sliding Window & Flow Control
          </button>
          <button
            onClick={() => {
              setActiveSubMode('teardown');
              handleReset();
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubMode === 'teardown'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            3. 4-Way Teardown (FIN/ACK)
          </button>
        </div>

        {/* ISN customizer */}
        {activeSubMode === 'handshake' && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400 text-[10px]">Client ISN:</span>
            <input
              type="number"
              value={clientIsn}
              onChange={(e) => setClientIsn(Number(e.target.value) || 1000)}
              className="w-16 px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-bold text-slate-800 dark:text-slate-200 outline-none"
            />
            <span className="text-slate-400 text-[10px]">Server ISN:</span>
            <input
              type="number"
              value={serverIsn}
              onChange={(e) => setServerIsn(Number(e.target.value) || 5000)}
              className="w-16 px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-bold text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>
        )}

        {activeSubMode === 'data' && (
          <div className="flex items-center gap-3 font-mono text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={simulatePacketLoss}
                onChange={(e) => {
                  setSimulatePacketLoss(e.target.checked);
                  handleReset();
                }}
                className="rounded accent-red-500"
              />
              <span className="text-red-500 font-bold">Simulate Packet Loss</span>
            </label>
          </div>
        )}
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Visual Animated Canvas */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500">
                STEP {stepIndex + 1} OF {maxSteps}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentStep.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold">
                Full-Duplex Layer 4
              </span>
            </div>
          </div>

          {/* Client <---> Server Interactive Visual Animation Area */}
          <div className="relative w-full h-[280px] rounded-2xl bg-slate-950 border border-slate-800 p-6 flex items-center justify-between overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Left Node: Client Host */}
            <div className="relative z-10 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
                <Laptop className="w-8 h-8" />
              </div>
              <div className="text-center font-mono">
                <span className="text-xs font-bold text-white block">Client Host</span>
                <span className="text-[10px] text-slate-400 block">192.168.1.50:49152</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 border border-blue-800 text-blue-300">
                  State: {currentStep.clientState}
                </span>
              </div>
            </div>

            {/* Animated Packet Flight Line */}
            <div className="flex-1 mx-8 relative flex items-center justify-center">
              <div className="w-full h-0.5 bg-slate-800 absolute top-1/2 -translate-y-1/2"></div>

              {/* In-Flight Segment Card */}
              <div
                className={`relative z-20 px-4 py-2.5 rounded-xl border font-mono shadow-xl transition-all duration-500 transform animate-in zoom-in-95 ${
                  currentStep.sender === 'client'
                    ? 'bg-blue-900/80 border-blue-400 text-blue-100 translate-x-2'
                    : 'bg-emerald-900/80 border-emerald-400 text-emerald-100 -translate-x-2'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {currentStep.packet.flags.map((fl) => (
                    <span
                      key={fl}
                      className="px-1.5 py-0.5 rounded bg-white/20 text-white font-bold text-[10px]"
                    >
                      {fl}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-300 ml-1">
                    {currentStep.sender === 'client' ? 'Client -> Server' : 'Server -> Client'}
                  </span>
                </div>
                <div className="text-xs font-bold">
                  SEQ: <span className="text-amber-300">{currentStep.packet.seq}</span> | ACK:{' '}
                  <span className="text-cyan-300">{currentStep.packet.ack}</span>
                </div>
              </div>
            </div>

            {/* Right Node: Server Host */}
            <div className="relative z-10 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Server className="w-8 h-8" />
              </div>
              <div className="text-center font-mono">
                <span className="text-xs font-bold text-white block">Server (Nginx)</span>
                <span className="text-[10px] text-slate-400 block">10.0.0.1:80 (HTTP)</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                  State: {currentStep.serverState}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Playback Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handlePrev}
                disabled={stepIndex === 0}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous step"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-sm cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>
              <button
                onClick={handleNext}
                disabled={stepIndex === maxSteps - 1}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next step"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-500">
              {currentStep.packet.desc}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Packet Inspector & Sequence Number Arithmetic */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>TCP Header Inspector</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400">Active Flags:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {currentStep.packet.flags.join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400">Sequence Number:</span>
                <span className="font-bold text-amber-500">{currentStep.packet.seq}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400">Acknowledgment:</span>
                <span className="font-bold text-cyan-400">{currentStep.packet.ack}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400">Window Size (rwnd):</span>
                <span className="font-bold text-emerald-400">{windowSize * 1024} Bytes</span>
              </div>
            </div>

            {/* Arithmetic Box */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs font-mono space-y-1">
              <span className="font-bold text-blue-700 dark:text-blue-300 block">
                Sequence Arithmetic Rule:
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                SYN and FIN segments consume exactly <strong>1 Sequence Number</strong>. Pure ACKs
                without payload consume <strong>0 Sequence Numbers</strong>.
              </p>
            </div>
          </div>

          {/* Event Log Output */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2 shadow-inner">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Kernel Socket Trace:
            </span>
            <div className="text-emerald-400 leading-relaxed text-[11px]">
              {currentStep.log}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TcpThreeWayHandshake;

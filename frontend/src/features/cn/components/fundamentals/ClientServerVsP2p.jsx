import React, { useState } from 'react';
import { 
  Server, 
  Share2, 
  Play, 
  Laptop
} from 'lucide-react';
import { CLIENT_SERVER_VS_P2P_DATA } from '../../data/fundamentalsData';

export function ClientServerVsP2p() {
  const [activeArch, setActiveArch] = useState('clientServer'); // 'clientServer' or 'p2p'
  const [isSimulating, setIsSimulating] = useState(false);
  const [isServerCrashed, setIsServerCrashed] = useState(false);
  const [failedPeerId, setFailedPeerId] = useState(null);
  const [simLog, setSimLog] = useState('Ready to simulate architecture request flow.');

  const handleSimulateCs = () => {
    if (isSimulating) return;
    if (isServerCrashed) {
      setSimLog('503 Service Unavailable: Central Server is down! All client requests failed.');
      return;
    }

    setIsSimulating(true);
    setSimLog('Client 1 transmitting HTTP GET request to Central Server...');

    setTimeout(() => {
      setSimLog('Central Server querying database & generating response payload...');
      setTimeout(() => {
        setSimLog('HTTP 200 OK: Central Server replied to Client 1 with resource data.');
        setIsSimulating(false);
      }, 1000);
    }, 900);
  };

  const handleSimulateP2p = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimLog('Peer 1 uploading Chunk #1 to Peer 2, while Peer 3 uploads Chunk #2 to Peer 4 simultaneously in swarm...');

    setTimeout(() => {
      setSimLog('Swarm exchange complete: Distributed chunk hash verified across all active peers!');
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Architecture Selector Tabs */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono font-semibold mb-1">
              <Share2 className="w-3 h-3 text-emerald-500" />
              <span>NETWORK ARCHITECTURE MODELS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Client-Server vs Peer-to-Peer (P2P)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore the fundamental dichotomy between centralized control architectures and decentralized distributed swarms.
            </p>
          </div>

          {/* Architecture Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setActiveArch('clientServer');
                setSimLog('Switched to Client-Server Architecture mode.');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeArch === 'clientServer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Client-Server</span>
            </button>

            <button
              onClick={() => {
                setActiveArch('p2p');
                setSimLog('Switched to Peer-to-Peer (P2P) Swarm mode.');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeArch === 'p2p'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Peer-to-Peer (P2P)</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Architecture Sandbox Canvas */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase block">
                {activeArch === 'clientServer' ? 'Centralized Request-Response Cycle' : 'Decentralized Swarm Chunk Distribution'}
              </span>
              <h3 className="text-base font-bold text-white">
                {activeArch === 'clientServer' ? 'Client-Server Live Sandbox' : 'P2P Swarm Live Sandbox'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {activeArch === 'clientServer' ? (
                <>
                  <button
                    onClick={() => {
                      setIsServerCrashed(!isServerCrashed);
                      setSimLog(isServerCrashed ? 'Central Server restored and rebooted.' : 'ALERT: Central Server crashed! Single point of failure triggered.');
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      isServerCrashed
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 text-rose-400 border-rose-900/60 hover:bg-rose-950/40'
                    }`}
                  >
                    {isServerCrashed ? 'Reboot Server' : 'Crash Central Server'}
                  </button>
                  <button
                    onClick={handleSimulateCs}
                    disabled={isSimulating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isSimulating ? 'Requesting...' : 'Send HTTP Request'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setFailedPeerId(failedPeerId ? null : 'P2');
                      setSimLog(failedPeerId ? 'Peer 2 reconnected to swarm.' : 'Peer 2 disconnected. Swarm seamlessly re-adjusts.');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-indigo-300 border border-indigo-900/60 text-xs font-mono font-bold hover:bg-indigo-950/40 transition-all cursor-pointer"
                  >
                    {failedPeerId ? 'Reconnect Peer 2' : 'Disconnect Peer 2'}
                  </button>
                  <button
                    onClick={handleSimulateP2p}
                    disabled={isSimulating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isSimulating ? 'Swarm Exchanging...' : 'Distribute Swarm Chunks'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Visual Architecture Representation */}
          {activeArch === 'clientServer' ? (
            <div className="relative py-6 flex flex-col items-center justify-center gap-8">
              {/* Central Server */}
              <div className={`p-5 rounded-3xl border-2 text-center transition-all ${
                isServerCrashed
                  ? 'border-rose-500 bg-rose-950/70 shadow-lg shadow-rose-500/30'
                  : 'border-emerald-500 bg-slate-900 shadow-lg shadow-emerald-500/20'
              }`}>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <Server className={`w-7 h-7 ${isServerCrashed ? 'text-rose-400' : 'text-emerald-400'}`} />
                </div>
                <span className="block font-bold text-sm text-white">Central Production Server</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {isServerCrashed ? 'OFFLINE (CRASHED)' : 'Online • 10.0.0.1 (Web + DB)'}
                </span>
              </div>

              {/* Clients Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                {[1, 2, 3, 4].map((cNum) => (
                  <div
                    key={cNum}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isServerCrashed
                        ? 'border-slate-800 bg-slate-900/50 opacity-60'
                        : isSimulating && cNum === 1
                        ? 'border-amber-400 bg-amber-950/40 shadow-md shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    <Laptop className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <span className="block font-bold text-xs">Client {cNum}</span>
                    <span className="text-[10px] font-mono text-slate-500">Consumer</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative py-6 flex items-center justify-center">
              {/* P2P Swarm Polygon Grid */}
              <div className="grid grid-cols-2 gap-8 max-w-md w-full">
                {[
                  { id: 'P1', name: 'Peer 1 (Servent)', ip: '10.0.1.1', shares: 'Chunk #1' },
                  { id: 'P2', name: 'Peer 2 (Servent)', ip: '10.0.1.2', shares: 'Chunk #2' },
                  { id: 'P3', name: 'Peer 3 (Servent)', ip: '10.0.1.3', shares: 'Chunk #3' },
                  { id: 'P4', name: 'Peer 4 (Servent)', ip: '10.0.1.4', shares: 'Chunk #4' },
                ].map((peer) => {
                  const isOffline = failedPeerId === peer.id;

                  return (
                    <div
                      key={peer.id}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        isOffline
                          ? 'border-rose-900 bg-rose-950/40 opacity-50'
                          : isSimulating
                          ? 'border-indigo-400 bg-indigo-950/40 shadow-md shadow-indigo-500/20'
                          : 'border-slate-800 bg-slate-900'
                      }`}
                    >
                      <Share2 className={`w-5 h-5 mx-auto mb-1 ${isOffline ? 'text-rose-400' : 'text-indigo-400'}`} />
                      <span className="block font-bold text-xs">{peer.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{peer.ip}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-1">{peer.shares}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real-time Status Banner */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{simLog}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Deep Architectural Comparison Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client-Server Profile */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">Centralized Paradigm</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Client-Server Model</h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {CLIENT_SERVER_VS_P2P_DATA.clientServer.description}
          </p>

          <div className="space-y-2 pt-1 text-xs">
            {CLIENT_SERVER_VS_P2P_DATA.clientServer.characteristics.map((c, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/60 dark:border-[#1E2638]">
                <strong className="text-slate-900 dark:text-white block text-[11.5px]">{c.label}</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{c.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Everyday Examples:</span>
            <div className="flex flex-wrap gap-1.5">
              {CLIENT_SERVER_VS_P2P_DATA.clientServer.realWorldExamples.map((ex, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10.5px] font-mono font-semibold">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Peer-to-Peer Profile */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-semibold">Decentralized Paradigm</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Peer-to-Peer (P2P) Model</h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {CLIENT_SERVER_VS_P2P_DATA.peerToPeer.description}
          </p>

          <div className="space-y-2 pt-1 text-xs">
            {CLIENT_SERVER_VS_P2P_DATA.peerToPeer.characteristics.map((c, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/60 dark:border-[#1E2638]">
                <strong className="text-slate-900 dark:text-white block text-[11.5px]">{c.label}</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{c.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Everyday Examples:</span>
            <div className="flex flex-wrap gap-1.5">
              {CLIENT_SERVER_VS_P2P_DATA.peerToPeer.realWorldExamples.map((ex, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10.5px] font-mono font-semibold">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

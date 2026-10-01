import React, { useState, useEffect, useRef } from 'react';
import { Database, Eye, Edit3, Play, Pause, RotateCcw, Plus, UserCheck, ShieldAlert, CheckCircle2, Clock, Lock } from 'lucide-react';

export const ReadersWritersSimulator = () => {
  // Database access state
  const [activeReaders, setActiveReaders] = useState([]); // array of reader IDs e.g. ['R1', 'R2']
  const [activeWriter, setActiveWriter] = useState(null); // writer ID e.g. 'W1' or null
  const [waitingWriters, setWaitingWriters] = useState([]);
  const [waitingReaders, setWaitingReaders] = useState([]);

  const [dbState, setDbState] = useState('IDLE'); // IDLE, READING, WRITING
  const [readCount, setReadCount] = useState(0);
  const [rwMutex, setRwMutex] = useState(1); // 1 = unlocked, 0 = locked by readers or writer
  const [mutex, setMutex] = useState(1); // protects readCount variable update

  const [logs, setLogs] = useState(['Readers-Writers Database Simulator initialized.']);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveReaders([]);
    setActiveWriter(null);
    setWaitingWriters([]);
    setWaitingReaders([]);
    setDbState('IDLE');
    setReadCount(0);
    setRwMutex(1);
    setMutex(1);
    setLogs(['Database cleared and mutexes reset to initial state.']);
  };

  // Reader Requests Read
  const handleAddReader = (readerId) => {
    if (activeWriter) {
      if (!waitingReaders.includes(readerId) && !activeReaders.includes(readerId)) {
        setWaitingReaders(prev => [...prev, readerId]);
        setLogs(prev => [`[BLOCKED] Reader ${readerId} requested read -> Writer ${activeWriter} is WRITING! ${readerId} must wait.`, ...prev]);
      }
      return;
    }

    if (!activeReaders.includes(readerId)) {
      setActiveReaders(prev => [...prev, readerId]);
      setReadCount(prev => prev + 1);
      setDbState('READING');
      setRwMutex(0); // Lock out writers
      setLogs(prev => [`[READ GRANTED] Reader ${readerId} entered database. Active Readers = ${activeReaders.length + 1}.`, ...prev]);
    }
  };

  // Reader Releases Read
  const handleRemoveReader = (readerId) => {
    if (activeReaders.includes(readerId)) {
      const nextReaders = activeReaders.filter(r => r !== readerId);
      setActiveReaders(nextReaders);
      const nextCount = readCount - 1;
      setReadCount(nextCount);

      if (nextReaders.length === 0) {
        setDbState('IDLE');
        setRwMutex(1); // Unlock rwMutex so writers can write
        setLogs(prev => [`[READ FINISHED] Last Reader ${readerId} exited. Database is now IDLE. rw_mutex released!`, ...prev]);

        if (waitingWriters.length > 0) {
          const [nextWriter, ...restWriters] = waitingWriters;
          setWaitingWriters(restWriters);
          setActiveWriter(nextWriter);
          setDbState('WRITING');
          setRwMutex(0);
          setLogs(prev => [`[WRITE GRANTED] Waiting Writer ${nextWriter} acquired exclusive database lock!`, ...prev]);
        }
      } else {
        setLogs(prev => [`[READ FINISHED] Reader ${readerId} exited. Active Readers remaining = ${nextReaders.length}.`, ...prev]);
      }
    }
  };

  // Writer Requests Write
  const handleAddWriter = (writerId) => {
    if (activeWriter === writerId) return;

    if (activeReaders.length > 0 || activeWriter !== null) {
      if (!waitingWriters.includes(writerId)) {
        setWaitingWriters(prev => [...prev, writerId]);
        setLogs(prev => [
          `[BLOCKED] Writer ${writerId} requested write -> ${
            activeReaders.length > 0 ? `${activeReaders.length} Active Readers present!` : `Writer ${activeWriter} is writing!`
          } Writer ${writerId} placed in Waiting Queue.`,
          ...prev
        ]);
      }
      return;
    }

    setActiveWriter(writerId);
    setDbState('WRITING');
    setRwMutex(0);
    setLogs(prev => [`[EXCLUSIVE WRITE GRANTED] Writer ${writerId} acquired database write lock! Readers & Writers blocked.`, ...prev]);
  };

  // Writer Releases Write
  const handleRemoveWriter = () => {
    if (activeWriter) {
      const finishedWriter = activeWriter;
      setActiveWriter(null);
      setDbState('IDLE');
      setRwMutex(1);
      setLogs(prev => [`[WRITE FINISHED] Writer ${finishedWriter} released database lock. Database is now IDLE.`, ...prev]);

      if (waitingReaders.length > 0) {
        setActiveReaders(waitingReaders);
        setReadCount(waitingReaders.length);
        setDbState('READING');
        setRwMutex(0);
        setLogs(prev => [`[READ GRANTED] Unblocked ${waitingReaders.length} waiting reader(s) into database!`, ...prev]);
        setWaitingReaders([]);
      } else if (waitingWriters.length > 0) {
        const [nextWriter, ...restWriters] = waitingWriters;
        setWaitingWriters(restWriters);
        setActiveWriter(nextWriter);
        setDbState('WRITING');
        setRwMutex(0);
        setLogs(prev => [`[WRITE GRANTED] Unblocked next waiting Writer ${nextWriter}!`, ...prev]);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Readers-Writers Problem Simulator</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Concurrent read sharing with strict exclusive write mutual exclusion</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulator</span>
            </button>
          </div>
        </div>

        {/* Action Controls for Readers and Writers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          {/* Readers Controls */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Reader Controls</span>
            <div className="flex items-center gap-2 flex-wrap">
              {['R1', 'R2', 'R3'].map(rId => {
                const isReading = activeReaders.includes(rId);
                const isWaiting = waitingReaders.includes(rId);
                return (
                  <button
                    key={rId}
                    onClick={() => isReading ? handleRemoveReader(rId) : handleAddReader(rId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isReading
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : isWaiting
                        ? 'bg-amber-100 dark:bg-amber-600/30 border border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isReading ? `Exit ${rId}` : `Read ${rId}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Writer Controls */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Writer Controls</span>
            <div className="flex items-center gap-2 flex-wrap">
              {['W1', 'W2'].map(wId => {
                const isWriting = activeWriter === wId;
                const isWaiting = waitingWriters.includes(wId);
                return (
                  <button
                    key={wId}
                    onClick={() => isWriting ? handleRemoveWriter() : handleAddWriter(wId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isWriting
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                        : isWaiting
                        ? 'bg-purple-100 dark:bg-purple-600/30 border border-purple-300 dark:border-purple-500/50 text-purple-900 dark:text-purple-300'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isWriting ? `Exit ${wId}` : `Write ${wId}`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Database & Processes Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shared Database Central Visual Box */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6 lg:col-span-2">
          <div className="p-6 bg-slate-50 dark:bg-slate-950/90 rounded-2xl border border-indigo-500/30 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 font-bold">
              <Database className="w-5 h-5" />
              <span>SHARED DATABASE RESOURCE</span>
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-h-[140px] ${
              dbState === 'READING'
                ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 dark:border-blue-500/60 text-blue-900 dark:text-blue-300 shadow-md'
                : dbState === 'WRITING'
                ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-400 dark:border-amber-500/60 text-amber-900 dark:text-amber-300 shadow-md'
                : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500 border-dashed'
            }`}>
              <div className="text-2xl font-mono font-extrabold uppercase mb-2">
                DATABASE STATE: {dbState}
              </div>

              {dbState === 'READING' && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-mono text-blue-700 dark:text-blue-300">Concurrent Active Readers:</span>
                  {activeReaders.map(r => (
                    <span key={r} className="px-3 py-1 bg-blue-600 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 animate-pulse shadow-sm">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{r} Reading</span>
                    </span>
                  ))}
                </div>
              )}

              {dbState === 'WRITING' && (
                <div className="px-4 py-2 bg-amber-600 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-2 animate-bounce shadow-sm">
                  <Edit3 className="w-4 h-4" />
                  <span>EXCLUSIVE WRITE BY {activeWriter} (All Readers Blocked)</span>
                </div>
              )}

              {dbState === 'IDLE' && (
                <span className="text-xs font-mono text-slate-500 dark:text-slate-600">No active readers or writers</span>
              )}
            </div>
          </div>

          {/* Active Queues Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Waiting Readers Queue */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block mb-2">
                Blocked Readers Queue ({waitingReaders.length})
              </span>
              <div className="min-h-[50px] border border-dashed border-slate-300 dark:border-slate-800 rounded-lg p-2 flex flex-wrap items-center gap-2">
                {waitingReaders.length === 0 ? (
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-600 italic">No waiting readers</span>
                ) : (
                  waitingReaders.map(r => (
                    <span key={r} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40 rounded font-mono text-xs">
                      {r} Waiting
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Waiting Writers Queue */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block mb-2">
                Blocked Writers Queue ({waitingWriters.length})
              </span>
              <div className="min-h-[50px] border border-dashed border-slate-300 dark:border-slate-800 rounded-lg p-2 flex flex-wrap items-center gap-2">
                {waitingWriters.length === 0 ? (
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-600 italic">No waiting writers</span>
                ) : (
                  waitingWriters.map(w => (
                    <span key={w} className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 rounded font-mono text-xs">
                      {w} Waiting
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Log & Rules Box */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-800 dark:text-slate-300 font-bold mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
            Readers-Writers Event Log
          </div>

          <div className="space-y-2 font-mono text-xs max-h-80 overflow-y-auto pr-1 flex-1">
            {logs.map((lg, i) => (
              <div key={i} className={`p-2 rounded-lg border text-[11px] leading-relaxed ${
                lg.includes('READ GRANTED') ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-900 dark:text-blue-300' :
                lg.includes('EXCLUSIVE') ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-300' :
                lg.includes('BLOCKED') ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-300' :
                'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
              }`}>
                {lg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

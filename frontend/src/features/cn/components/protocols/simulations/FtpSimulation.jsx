import React, { useState, useEffect } from 'react';
import {
  Folder,
  File,
  Upload,
  Download,
  Server,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  Radio,
  Check
} from 'lucide-react';

export function FtpSimulation() {
  const [transferMode, setTransferMode] = useState('download'); // 'download', 'upload'
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState('project_dataset.zip');

  const filesList = [
    { name: 'project_dataset.zip', size: '24.5 MB' },
    { name: 'architecture_diagram.png', size: '3.2 MB' },
    { name: 'config_backup.json', size: '480 KB' }
  ];

  const totalSteps = 5;

  const stepsInfo = [
    {
      step: 1,
      title: '1. Control Connection & Authentication',
      desc: 'Client establishes persistent TCP control session on Port 21. Sends USER & PASS credentials; Server responds with "230 User logged in".',
      channel: 'Port 21 (Command Channel)'
    },
    {
      step: 2,
      title: `2. Command Dispatch (${transferMode === 'download' ? 'RETR' : 'STOR'})`,
      desc: `Client issues command "${transferMode === 'download' ? 'RETR ' + selectedFile : 'STOR ' + selectedFile}". Server responds "150 Opening BINARY mode data connection".`,
      channel: 'Port 21 (Command Channel)'
    },
    {
      step: 3,
      title: '3. Ephemeral Data Channel Spawned',
      desc: 'A dedicated secondary TCP connection is established on Port 20 specifically for high-throughput byte streaming.',
      channel: 'Port 20 (Data Channel)'
    },
    {
      step: 4,
      title: `4. Streaming File Payload (${transferMode.toUpperCase()})`,
      desc: `Binary byte stream flows through Port 20 data pipe: "${selectedFile}" is transferring in chunks.`,
      channel: 'Port 20 (Data Streaming)'
    },
    {
      step: 5,
      title: '5. Transfer Complete & Data Channel Teardown',
      desc: 'Data connection on Port 20 closes automatically. Server transmits "226 Transfer complete" over Port 21 control session.',
      channel: 'Port 21 (Control Remains Open)'
    }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive FTP Dual-Channel Architecture Simulator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Understand the separation between Port 21 (Command/Control) and Port 20 (Data Transfer) connections.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold">
          <Folder className="w-3.5 h-3.5" />
          <span>PORT 20 / 21 DUAL TCP</span>
        </div>
      </div>

      {/* Mode & File Selection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
        <div className="md:col-span-4">
          <label className="text-[11px] font-mono uppercase font-bold text-slate-400 block mb-1.5">
            Transfer Operation
          </label>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
            <button
              onClick={() => {
                setTransferMode('download');
                setCurrentStep(1);
              }}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                transferMode === 'download'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (RETR)</span>
            </button>
            <button
              onClick={() => {
                setTransferMode('upload');
                setCurrentStep(1);
              }}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                transferMode === 'upload'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload (STOR)</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-5">
          <label className="text-[11px] font-mono uppercase font-bold text-slate-400 block mb-1.5">
            Select File Object
          </label>
          <div className="flex gap-1.5 overflow-x-auto">
            {filesList.map((f) => (
              <button
                key={f.name}
                onClick={() => {
                  setSelectedFile(f.name);
                  setCurrentStep(1);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                  selectedFile === f.name
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500 font-bold'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {f.name} ({f.size})
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 flex items-end">
          <button
            onClick={() => {
              setCurrentStep(1);
              setIsPlaying(true);
            }}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate FTP Flow</span>
          </button>
        </div>
      </div>

      {/* Step Action Banner */}
      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-amber-600 text-white font-mono text-xs font-extrabold shadow-xs">
            Step {currentStep} / {totalSteps}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {stepsInfo[currentStep - 1].title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {stepsInfo[currentStep - 1].desc}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={() => {
              setIsPlaying(false);
              if (currentStep > 1) setCurrentStep(currentStep - 1);
            }}
            disabled={currentStep === 1}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
            }}
            disabled={currentStep === totalSteps}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Next Step"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(1);
            }}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dual Channel Visual Arena (Port 21 Control vs Port 20 Data) */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 min-h-[300px] flex items-center justify-between text-white overflow-hidden shadow-inner">
        {/* Client Side */}
        <div className="relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
            <Laptop className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block">FTP Client</span>
            <span className="text-[10px] font-mono text-amber-300">FileZilla / CLI</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            Authenticated
          </span>
        </div>

        {/* Dual Channels in Middle */}
        <div className="flex-1 mx-4 sm:mx-8 space-y-5">
          {/* Channel 1: Control (Port 21) */}
          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Port 21: Control Channel (Commands)</span>
              </span>
              <span className="text-[10px] text-slate-400">PERSISTENT TCP</span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              {currentStep === 1
                ? 'USER anonymous ➔ 331 Password required ➔ PASS guest ➔ 230 Logged in'
                : currentStep === 2
                ? `${transferMode === 'download' ? 'RETR ' + selectedFile : 'STOR ' + selectedFile} ➔ 150 Data connection open`
                : currentStep === 5
                ? '226 Transfer complete. Session remains open for next command.'
                : 'Control channel idle (waiting for data channel completion)'}
            </p>
          </div>

          {/* Channel 2: Data (Port 20) */}
          <div className={`p-3 rounded-xl border transition-all duration-300 ${
            currentStep === 3 || currentStep === 4
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-950 border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${currentStep === 4 ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
                <span>Port 20: Data Channel (Byte Stream)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                {currentStep === 4 ? 'STREAMING ACTIVE' : currentStep === 5 ? 'CLOSED (TEARDOWN)' : 'STANDBY'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              {currentStep === 4
                ? `Streaming chunks of "${selectedFile}" across temporary TCP data socket...`
                : currentStep === 5
                ? 'Data connection automatically closed upon final byte transmission.'
                : 'Created on demand only when file transfer begins.'}
            </p>
          </div>
        </div>

        {/* Server Side */}
        <div className="relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Server className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block">FTP Server</span>
            <span className="text-[10px] font-mono text-indigo-300">vsftpd / ProFTPD</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            Storage Ready
          </span>
        </div>
      </div>
    </div>
  );
}

export default FtpSimulation;

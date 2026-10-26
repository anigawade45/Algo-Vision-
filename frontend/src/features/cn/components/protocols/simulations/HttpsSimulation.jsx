import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Server,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export function HttpsSimulation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [samplePayload, setSamplePayload] = useState('username=Ritesh&password=SecretPass123&token=99281');
  const [simulatedCipher, setSimulatedCipher] = useState('8F@2#K9$L*!q7Z890vB#18aXZ_c92@0-Q9wLp');
  const [showWireView, setShowWireView] = useState('encrypted'); // 'encrypted', 'mitm'

  const totalSteps = 6;

  const handshakeSteps = [
    {
      step: 1,
      name: 'ClientHello',
      actor: 'Client → Server',
      desc: 'Client initiates TLS handshake, offering supported cipher suites (e.g. TLS_AES_256_GCM_SHA384) and a 32-byte Client Random string.',
      icon: Laptop
    },
    {
      step: 2,
      name: 'ServerHello & Certificate',
      actor: 'Server → Client',
      desc: 'Server chooses best cipher suite, sends Server Random, and presents its X.509 Digital Certificate containing its RSA/ECC Public Key.',
      icon: Server
    },
    {
      step: 3,
      name: 'Certificate Verification',
      actor: 'Client (CA Check)',
      desc: 'Client browser validates certificate signature against trusted root Certificate Authorities (CAs). Domain identity verified!',
      icon: ShieldCheck
    },
    {
      step: 4,
      name: 'Key Exchange & Session Secret',
      actor: 'Client → Server',
      desc: 'Client generates a Pre-Master Secret, encrypts it with Server Public Key. Server decrypts using its Private Key. Both independently derive identical Symmetric Session Keys.',
      icon: Key
    },
    {
      step: 5,
      name: 'Finished & Secure Tunnel Established',
      actor: 'Client ↔ Server',
      desc: 'Both parties exchange encrypted "Finished" messages. From this instant, all data is encrypted symmetrically with AES-256.',
      icon: Lock
    },
    {
      step: 6,
      name: 'Encrypted Application Data Stream',
      actor: 'Client → Server',
      desc: 'Client transmits sensitive payload. Eavesdroppers only see randomized ciphertext; only the authenticated server can decrypt.',
      icon: Sparkles
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
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive TLS Handshake & AES-256 Encryption Simulator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Step through the TLS 1.3 cryptographic handshake and observe how plaintext payloads are secured across the wire.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>PORT 443 (TLS/SSL)</span>
        </div>
      </div>

      {/* Step Prominent Action Banner */}
      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-mono text-xs font-extrabold shadow-sm">
            Step {currentStep} / {totalSteps}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {handshakeSteps[currentStep - 1].name} ({handshakeSteps[currentStep - 1].actor})
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {handshakeSteps[currentStep - 1].desc}
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
            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play Handshake'}</span>
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

      {/* Visual TLS Tunnel Animation */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 min-h-[280px] flex items-center justify-between text-white overflow-hidden shadow-inner">
        {/* Background Network Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        {/* Client Host */}
        <div className="relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Laptop className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block">Client Browser</span>
            <span className="text-[10px] font-mono text-indigo-300">192.168.1.100</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 font-bold ${currentStep >= 5 ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}>
            {currentStep >= 5 ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span>{currentStep >= 5 ? 'TLS Session Active' : 'Plain Socket'}</span>
          </span>
        </div>

        {/* Handshake / Wire Channel */}
        <div className="flex-1 mx-4 sm:mx-8 relative flex flex-col items-center justify-center">
          {/* Animated Tunnel Pipe */}
          <div className={`w-full h-4 rounded-full border transition-all duration-500 relative flex items-center justify-center ${currentStep >= 5
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 border-slate-700'
            }`}>
            <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-emerald-400">
              {currentStep >= 5 ? 'Encrypted TLS 1.3 Tunnel' : 'TCP Connection (Handshaking...)'}
            </span>
          </div>

          {/* Active Step Packet Visual */}
          <div className="my-4 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-center shadow-lg animate-pulse">
            <span className="text-emerald-400 font-bold block">{handshakeSteps[currentStep - 1].name}</span>
            <span className="text-[10px] text-slate-400">{handshakeSteps[currentStep - 1].actor}</span>
          </div>

          {/* Wire Eavesdropper Comparison Indicator */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Security Status:</span>
            <strong className={currentStep >= 5 ? 'text-emerald-400' : 'text-amber-400'}>
              {currentStep >= 5 ? 'AES-256 Symmetric Cipher Active' : 'Key Negotiation in Progress'}
            </strong>
          </div>
        </div>

        {/* Server Host */}
        <div className="relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <Server className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block">HTTPS Server</span>
            <span className="text-[10px] font-mono text-emerald-300">Port 443 (SSL/TLS)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>X.509 CA Certified</span>
          </span>
        </div>
      </div>

      {/* Plaintext vs Ciphertext Wire Inspector */}
      <div className="rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono uppercase">
              Plaintext vs Ciphertext Wire Comparison
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
            CONFIDENTIALITY DEMO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* HTTP Plain View (Vulnerable) */}
          <div className="rounded-xl bg-rose-950/20 border border-rose-500/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" />
                <span>Standard HTTP (Unencrypted Port 80)</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                EAVESDROPPER VISIBLE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Sniffers on Wi-Fi/LAN can read passwords, session cookies, and authentication tokens directly:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-rose-900/50 text-rose-300 text-xs break-all font-bold">
              {samplePayload}
            </div>
          </div>

          {/* HTTPS Encrypted View (Secure) */}
          <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>HTTPS with TLS 1.3 (Port 443)</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                AES-256 CIPHERTEXT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Network wire eavesdroppers only observe cryptographically randomized cipher blocks:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-900/50 text-emerald-300 text-xs break-all font-bold tracking-wider">
              {simulatedCipher}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HttpsSimulation;

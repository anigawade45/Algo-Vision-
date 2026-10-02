import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Server,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Inbox,
  Globe,
  Sparkles,
  Check
} from 'lucide-react';

export function SmtpSimulation() {
  const [senderEmail, setSenderEmail] = useState('alice@company.com');
  const [recipientEmail, setRecipientEmail] = useState('bob@gmail.com');
  const [subject, setSubject] = useState('Network Protocols Project Submission');
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSteps = 5;

  const stepsInfo = [
    {
      step: 1,
      title: '1. Mail Submission (Port 587 / STARTTLS)',
      actor: 'Alice (Client) → Sender SMTP Server (mail.company.com)',
      desc: 'Alice submits email message to her outbound Mail Submission Agent (MSA). Issues EHLO, MAIL FROM: <alice@company.com>, RCPT TO: <bob@gmail.com>, DATA.',
      node: 'sender-client'
    },
    {
      step: 2,
      title: '2. DNS MX Record Lookup',
      actor: 'mail.company.com → DNS Server',
      desc: 'Sender SMTP server queries DNS for the MX (Mail Exchanger) records of "gmail.com". DNS resolves destination MTA: "gmail-smtp-in.l.google.com".',
      node: 'dns-mx'
    },
    {
      step: 3,
      title: '3. Server-to-Server MTA Relay (Port 25)',
      actor: 'mail.company.com → gmail-smtp-in.l.google.com',
      desc: 'Sender MTA opens TCP connection on Port 25 to Google Mail Server and pushes the envelope headers and message body.',
      node: 'mta-relay'
    },
    {
      step: 4,
      title: '4. Mailbox Delivery & Storage',
      actor: 'Receiver SMTP Server → Bob\'s Mailbox',
      desc: 'Receiver SMTP server parses message, runs spam/virus scans, and stores the message safely in Bob\'s inbox directory.',
      node: 'mailbox-stored'
    },
    {
      step: 5,
      title: '5. Client Pull Retrieval (IMAP / POP3)',
      actor: 'Bob (Client) ← Receiver Mailbox',
      desc: 'Bob opens his email app (Thunderbird/Outlook/Apple Mail) and pulls the new message via IMAP (Port 993) or POP3 (Port 995).',
      node: 'recipient-retrieved'
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
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive SMTP Email Delivery & MTA Relay Simulator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Trace how email travels from sender client through intermediate MTAs using DNS MX lookups to the destination mailbox.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-mono font-bold">
          <Mail className="w-3.5 h-3.5" />
          <span>PORT 25 / 587 (SMTP PUSH)</span>
        </div>
      </div>

      {/* Email Composer Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 font-mono text-xs">
        <div className="md:col-span-4">
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">From (Sender)</label>
          <input
            type="text"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="md:col-span-4">
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">To (Recipient)</label>
          <input
            type="text"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="md:col-span-4 flex items-end">
          <button
            onClick={() => {
              setCurrentStep(1);
              setIsPlaying(true);
            }}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
            <span>Simulate Mail Dispatch</span>
          </button>
        </div>
      </div>

      {/* Step Action Banner */}
      <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-mono text-xs font-extrabold shadow-xs">
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
            className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play Relay'}</span>
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

      {/* Visual SMTP Relay Pipeline (Alice -> Sender MTA -> Receiver MTA -> Bob) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white space-y-6 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Node 1: Sender Client */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            currentStep === 1
              ? 'bg-rose-950/80 border-rose-500 shadow-lg shadow-rose-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Laptop className="w-5 h-5 text-rose-400" />
              <span className="text-xs font-bold">1. Alice (Sender)</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono truncate">{senderEmail}</p>
            <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Submits on Port 587
            </span>
          </div>

          {/* Node 2: Sender MTA */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            currentStep === 2 || currentStep === 3
              ? 'bg-rose-950/80 border-rose-500 shadow-lg shadow-rose-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold">2. Sender SMTP MTA</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">mail.company.com</p>
            <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Queries DNS MX
            </span>
          </div>

          {/* Node 3: Receiver MTA */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            currentStep === 3 || currentStep === 4
              ? 'bg-rose-950/80 border-rose-500 shadow-lg shadow-rose-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold">3. Receiver SMTP MTA</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">gmail-smtp-in.l.google.com</p>
            <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Listens on Port 25
            </span>
          </div>

          {/* Node 4: Bob Mailbox */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            currentStep === 5
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Inbox className="w-5 h-5 text-teal-400" />
              <span className="text-xs font-bold">4. Bob (Recipient)</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono truncate">{recipientEmail}</p>
            <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
              Retrieved via IMAP (993)
            </span>
          </div>
        </div>

        {/* Envelope Command Dialog Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-rose-400 block pb-1 border-b border-slate-800">
            SMTP Conversation Dialog
          </span>
          <pre className="text-slate-300 text-[11px] leading-relaxed">
            <span className="text-slate-500">220 mail.company.com ESMTP Postfix</span>{'\n'}
            <span className="text-indigo-400">C: EHLO client.lan</span>{'\n'}
            <span className="text-slate-500">S: 250-mail.company.com Hello [192.168.1.100]</span>{'\n'}
            <span className="text-indigo-400">C: MAIL FROM: &lt;{senderEmail}&gt;</span>{'\n'}
            <span className="text-slate-500">S: 250 2.1.0 Ok</span>{'\n'}
            <span className="text-indigo-400">C: RCPT TO: &lt;{recipientEmail}&gt;</span>{'\n'}
            <span className="text-slate-500">S: 250 2.1.5 Ok</span>{'\n'}
            <span className="text-indigo-400">C: DATA</span>{'\n'}
            <span className="text-slate-500">S: 354 End data with &lt;CR&gt;&lt;LF&gt;.&lt;CR&gt;&lt;LF&gt;</span>{'\n'}
            <span className="text-teal-300">Subject: {subject}</span>{'\n'}
            <span className="text-slate-400">Message content payload...</span>{'\n'}
            <span className="text-indigo-400">.</span>{'\n'}
            <span className="text-emerald-400">S: 250 2.0.0 Ok: queued as 4Y7Z91</span>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default SmtpSimulation;

import React, { useState } from 'react';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Binary,
  Cpu,
  Wifi,
  Server,
  ArrowRight,
  Trophy,
  Sparkles
} from 'lucide-react';

export function VisualizerModal({ isOpen, onClose, initialModule = 'dsa' }) {
  const [selectedModule, setSelectedModule] = useState(initialModule);
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const visualizerDemos = {
    dsa: {
      title: 'Binary Search Visualization',
      subtitle: 'Target Search: Find element 42 in sorted array',
      steps: [
        { desc: 'Initial Array: Low = 0 (10), High = 6 (90), Mid = 3 (42)', activeIdx: 3, matched: true },
        { desc: 'Target 42 is matched at Index 3 in 1 comparison! Time Complexity: O(1) best case, O(log N) worst case.', activeIdx: 3, matched: true },
      ],
      array: [10, 23, 35, 42, 56, 78, 90],
    },
    os: {
      title: 'Round Robin CPU Scheduling (Quantum = 2ms)',
      subtitle: 'Simulating Process Execution & Context Switching',
      steps: [
        { desc: 'Time 0-2ms: Process P1 runs. Quantum expires, context switch to P2.', activeProcess: 'P1' },
        { desc: 'Time 2-4ms: Process P2 runs. Context switch to P3.', activeProcess: 'P2' },
        { desc: 'Time 4-6ms: Process P3 runs. Context switch back to P1.', activeProcess: 'P3' },
      ],
    },
    networks: {
      title: 'TCP 3-Way Handshake Simulation',
      subtitle: 'Client <-> Server Connection Establishment',
      steps: [
        { desc: 'Step 1: Client sends SYN (Seq=100) -> Server enters SYN_RCVD', active: 'SYN' },
        { desc: 'Step 2: Server responds with SYN-ACK (Seq=300, Ack=101) -> Client enters ESTABLISHED', active: 'SYN-ACK' },
        { desc: 'Step 3: Client sends ACK (Seq=101, Ack=301) -> Both sockets in ESTABLISHED state.', active: 'ACK' },
      ],
    },
    sysdesign: {
      title: 'Distributed Redis Cache-Aside Simulation',
      subtitle: 'High Throughput Read Request Flow',
      steps: [
        { desc: 'Client queries API Gateway -> API queries Redis In-Memory Cache (Key: user:84)', active: 'cache-check' },
        { desc: 'Cache HIT! Response returned in 0.8ms without hitting PostgreSQL database.', active: 'cache-hit' },
      ],
    },
  };

  const demo = visualizerDemos[selectedModule] || visualizerDemos.dsa;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-sans animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#070A12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Visualizer Playground
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step-by-step state visualization engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Module Selector Tabs */}
        <div className="px-6 pt-4 flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto pb-3">
          {[
            { id: 'dsa', name: 'DSA Binary Search', icon: Binary },
            { id: 'os', name: 'OS Round Robin', icon: Cpu },
            { id: 'networks', name: 'TCP 3-Way Handshake', icon: Wifi },
            { id: 'sysdesign', name: 'Redis Cache Flow', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedModule(tab.id);
                  setStep(0);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Visualizer Canvas Body */}
        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {demo.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{demo.subtitle}</p>
          </div>

          {/* Graphical Demo Rendering */}
          {selectedModule === 'dsa' && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
              {demo.array.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-11 h-14 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-sm transition-all ${
                    idx === 3
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-110'
                      : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[9px] font-normal text-slate-400 mt-1">[{idx}]</span>
                </div>
              ))}
            </div>
          )}

          {selectedModule === 'os' && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-500">Gantt Execution Timeline:</div>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs font-bold text-center">
                <div className={`p-2 rounded-lg border ${step >= 0 ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                  P1 (0-2ms)
                </div>
                <div className={`p-2 rounded-lg border ${step >= 1 ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                  P2 (2-4ms)
                </div>
                <div className={`p-2 rounded-lg border ${step >= 2 ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                  P3 (4-6ms)
                </div>
                <div className="p-2 rounded-lg border bg-slate-200 dark:bg-slate-800 text-slate-400">
                  P1 (6-8ms)
                </div>
              </div>
            </div>
          )}

          {selectedModule === 'networks' && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="text-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold">
                Client (192.168.1.10)
              </div>
              <div className="flex-1 mx-4 text-center text-slate-600 dark:text-slate-300 font-semibold space-y-1">
                <div className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  {demo.steps[step % demo.steps.length].active} Segment Flowing
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                Server (93.184.216.34)
              </div>
            </div>
          )}

          {selectedModule === 'sysdesign' && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-3 text-center font-mono text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Nginx Proxy</span>
                <span className="text-[10px] text-slate-400">Round Robin</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-600 text-white font-bold shadow-md">
                <span>Redis Cluster</span>
                <span className="text-[10px] opacity-80 block">HIT (0.8ms)</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">PostgreSQL</span>
                <span className="text-[10px] text-slate-400">Idle (Saved)</span>
              </div>
            </div>
          )}

          {/* Current Step Description */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>{demo.steps[step % demo.steps.length].desc}</span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Simulation
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep((prev) => (prev + 1) % demo.steps.length)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Next Step</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizModal({ isOpen, onClose }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = [
    {
      q: 'What is the time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black)?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correct: 1,
      explanation: 'In balanced BSTs, height is strictly bounded by log2(N), guaranteeing O(log N) lookup, insertion, and deletion.',
    },
    {
      q: 'In Round Robin CPU Scheduling, what happens if the time quantum is set extremely high (e.g. infinity)?',
      options: [
        'It behaves exactly like Shortest Job First (SJF)',
        'It degenerates into First-Come, First-Served (FCFS)',
        'It causes frequent deadlock conditions',
        'CPU utilization drops to 0%',
      ],
      correct: 1,
      explanation: 'If quantum is larger than any process burst time, processes run to completion in order of arrival, behaving as FCFS.',
    },
    {
      q: 'During the TCP 3-Way Handshake, which packet flag is sent by the Server in response to the Client SYN?',
      options: ['FIN-ACK', 'RST-ACK', 'SYN-ACK', 'PSH-ACK'],
      correct: 2,
      explanation: 'The server synchronizes its own sequence number while acknowledging the client SYN with SYN-ACK.',
    },
  ];

  if (!isOpen) return null;

  const current = questions[currentQ];

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === current.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-sans animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#070A12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Adaptive Practice Quiz
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Question {currentQ + 1} of {questions.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!finished ? (
          <div className="p-6 space-y-4">
            <div className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug">
              {current.q}
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {current.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === current.correct;

                let btnStyle =
                  'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400';

                if (showResult) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showResult}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-[13px] transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after selection */}
            {showResult && (
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in">
                <strong>Explanation:</strong> {current.explanation}
              </div>
            )}

            {/* Next Button */}
            {showResult && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <span>{currentQ < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-md">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Quiz Completed!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You scored <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-base">{score} / {questions.length}</strong> ({(score / questions.length) * 100}%)
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetQuiz}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                Retry Quiz
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

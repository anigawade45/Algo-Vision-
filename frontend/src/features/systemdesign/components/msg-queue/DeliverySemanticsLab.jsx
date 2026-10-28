import { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Copy,
  RotateCcw,
  Layers,
  Database,
  Send
} from 'lucide-react';

export function DeliverySemanticsLab({ onCompleteStep, isCompleted }) {
  const [deliveryMode, setDeliveryMode] = useState('at-least-once'); // 'at-most-once', 'at-least-once', 'idempotent'
  const [dedupCache, setDedupCache] = useState({
    'tx_order_1001': { processedAt: '10:00:01', amount: '$150.00', status: 'SETNX_SUCCESS' },
    'tx_order_1002': { processedAt: '10:00:15', amount: '$420.00', status: 'SETNX_SUCCESS' },
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [accountBalance, setAccountBalance] = useState(1000);
  const [chargeCount, setChargeCount] = useState(2);

  const testKey = 'tx_order_1003';
  const testAmount = 75;

  const handleSendInitialMessage = () => {
    const isKeyPresent = Boolean(dedupCache[testKey]);

    if (deliveryMode === 'at-most-once') {
      setAccountBalance((b) => b - testAmount);
      setChargeCount((c) => c + 1);
      setSimulationResult({
        type: 'success',
        mode: 'At-Most-Once',
        duplicateDetected: false,
        message: `Message dispatched and acknowledged BEFORE execution. Card charged $${testAmount}. If worker crashed mid-way, data would be lost.`,
      });
    } else if (deliveryMode === 'at-least-once') {
      setAccountBalance((b) => b - testAmount);
      setChargeCount((c) => c + 1);
      setSimulationResult({
        type: 'success',
        mode: 'At-Least-Once (Non-Idempotent)',
        duplicateDetected: false,
        message: `Message processed and ACKed AFTER execution. Card charged $${testAmount}.`,
      });
    } else {
      if (isKeyPresent) {
        setSimulationResult({
          type: 'idempotent_skip',
          mode: 'Idempotent Consumer (Redis SETNX)',
          duplicateDetected: true,
          message: `Deduplication Key '${testKey}' found in Redis cache! Skipped payment execution, safely returned cached 200 OK. Zero duplicate billing!`,
        });
      } else {
        setDedupCache((prev) => ({
          ...prev,
          [testKey]: { processedAt: new Date().toLocaleTimeString(), amount: `$${testAmount}.00`, status: 'SETNX_SUCCESS' },
        }));
        setAccountBalance((b) => b - testAmount);
        setChargeCount((c) => c + 1);
        setSimulationResult({
          type: 'success',
          mode: 'Idempotent Consumer (Redis SETNX)',
          duplicateDetected: false,
          message: `First time key '${testKey}' seen. Acquired atomic Redis lock, processed charge $${testAmount}, and saved record.`,
        });
      }
    }
  };

  const handleInjectDuplicateDelivery = () => {
    if (deliveryMode === 'idempotent') {
      setSimulationResult({
        type: 'idempotent_skip',
        mode: 'Idempotent Consumer',
        duplicateDetected: true,
        message: `🛡️ DUPLICATE INTERCEPTED: Worker checked Redis for '${testKey}' ➔ Key already exists! Bypassed Stripe API call and sent ACK to broker. Customer NOT double charged!`,
      });
    } else {
      setAccountBalance((b) => b - testAmount);
      setChargeCount((c) => c + 1);
      setSimulationResult({
        type: 'double_charge_bug',
        mode: deliveryMode === 'at-least-once' ? 'At-Least-Once (No Dedup)' : 'At-Most-Once',
        duplicateDetected: false,
        message: `🚨 DOUBLE CHARGING BUG! Network glitch caused duplicate delivery. Without an Idempotency Key check, the consumer charged the card a SECOND time ($${testAmount})! Total charges: ${chargeCount + 1}`,
      });
    }
  };

  const handleClearCache = () => {
    setDedupCache({});
    setSimulationResult(null);
  };

  const handleResetLedger = () => {
    setAccountBalance(1000);
    setChargeCount(2);
    setSimulationResult(null);
    setDedupCache({
      'tx_order_1001': { processedAt: '10:00:01', amount: '$150.00', status: 'SETNX_SUCCESS' },
      'tx_order_1002': { processedAt: '10:00:15', amount: '$420.00', status: 'SETNX_SUCCESS' },
    });
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Interactive Lab • Step 4 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Delivery Semantics &amp; Idempotent Processing Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Master the fundamental truth of distributed networks: <strong className="text-slate-900 dark:text-white">True Exactly-Once network delivery is impossible</strong> without consumer-side deduplication. Compare At-Most-Once, At-Least-Once, and Idempotent Consumers with Redis SETNX keys.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetLedger}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Ledger
          </button>
        </div>
      </div>

      {/* 2. Mode Selector Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Choose Consumer Processing Strategy:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'at-most-once',
              title: 'At-Most-Once Delivery',
              desc: 'ACK sent BEFORE task execution. Zero duplicates, but risk of silent message loss on worker crash.',
              tag: 'Fire & Forget',
            },
            {
              id: 'at-least-once',
              title: 'At-Least-Once (Standard)',
              desc: 'ACK sent AFTER execution. No data loss, but duplicate delivery on network retry causes DOUBLE CHARGING.',
              tag: 'Vulnerable to Dups',
            },
            {
              id: 'idempotent',
              title: 'Idempotent Consumer (SETNX)',
              desc: 'At-Least-Once + Atomic Deduplication Key (Redis SETNX). Guaranteed Exactly-Once semantic effect!',
              tag: 'Gold Standard ⭐',
            },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setDeliveryMode(m.id);
                setSimulationResult(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                deliveryMode === m.id
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 shadow-sm ring-1 ring-purple-500/20'
                  : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{m.title}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {m.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive Execution Stage: Message Dispatch & Redis Dedup Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dispatch Actions & Customer Ledger (6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Simulate Message Delivery &amp; Network Glitches
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
              <span>Simulated Payment Event</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">Key: {testKey}</span>
            </div>
            <div className="text-slate-900 dark:text-white">
              Amount: <strong className="text-emerald-600 dark:text-emerald-400">${testAmount}.00 USD</strong> • Action: Stripe Charge API
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleSendInitialMessage}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> 1. Send Order Event
            </button>

            <button
              onClick={handleInjectDuplicateDelivery}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> 2. Re-send Duplicate (Glitch)
            </button>
          </div>

          {/* Customer Financial Ledger */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Customer Bank Balance:</span>
              <span className="font-bold font-mono text-base text-slate-900 dark:text-white">${accountBalance}.00</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Total Charges Processed:</span>
              <span className={`font-bold font-mono ${chargeCount > 3 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                {chargeCount} Charges
              </span>
            </div>
          </div>

          {/* Simulation Output Banner */}
          {simulationResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in ${
                simulationResult.type === 'double_charge_bug'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                  : simulationResult.type === 'idempotent_skip'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 text-purple-950 dark:text-purple-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>Result ({simulationResult.mode})</span>
                {simulationResult.duplicateDetected ? (
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                    🛡️ DEDUP SUCCESS
                  </span>
                ) : simulationResult.type === 'double_charge_bug' ? (
                  <span className="font-mono text-[10px] text-rose-600 dark:text-rose-400 font-black">
                    🚨 CRITICAL BUG
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] leading-relaxed">{simulationResult.message}</p>
            </div>
          )}
        </div>

        {/* Right: Redis Idempotency Table (6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Redis In-Memory Deduplication Key Store
              </h3>
            </div>

            <button
              onClick={handleClearCache}
              className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
            >
              Clear Cache
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 font-mono text-xs custom-scrollbar">
            {Object.keys(dedupCache).length > 0 ? (
              Object.entries(dedupCache).map(([key, val]) => (
                <div
                  key={key}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-purple-600 dark:text-purple-400 text-xs">SETNX &apos;{key}&apos;</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Processed: {val.processedAt} • {val.amount}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                    {val.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                No keys stored in Redis cache.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliverySemanticsLab;

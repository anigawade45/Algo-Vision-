import { useState } from 'react';
import {
  Users,
  Zap,
  RotateCcw,
  Sparkles,
  Flame,
  Server
} from 'lucide-react';
import { RATE_LIMIT_SCENARIOS } from '../../data/rateLimitingData';

export function IdentityScopingLab({ onCompleteStep, isCompleted }) {
  const [scopeMode, setScopeMode] = useState('per-user'); // 'global' vs 'per-user'
  const [globalTokens, setGlobalTokens] = useState(10);
  const globalCapacity = 10;

  const [userTokens, setUserTokens] = useState({
    alice: { name: 'Alice (Regular User)', tokens: 5, max: 5 },
    bob: { name: 'Bob (Regular User)', tokens: 5, max: 5 },
    mallory: { name: 'Mallory (Scraper / Bot 🤖)', tokens: 5, max: 5 },
  });

  const [lastScenarioResult, setLastScenarioResult] = useState(null);

  // Send request for a specific user under active scope mode
  const sendUserRequest = (userKey) => {
    if (scopeMode === 'global') {
      if (globalTokens > 0) {
        setGlobalTokens((t) => t - 1);
        setLastScenarioResult({
          user: userTokens[userKey].name,
          status: 200,
          msg: `✅ [GLOBAL QUOTA] Request from ${userTokens[userKey].name} admitted! Remaining global pool: ${globalTokens - 1}/${globalCapacity}`,
        });
      } else {
        setLastScenarioResult({
          user: userTokens[userKey].name,
          status: 429,
          msg: `⛔ [GLOBAL QUOTA EXHAUSTED] ${userTokens[userKey].name} was BLOCKED! A noisy neighbor consumed all tokens.`,
        });
      }
    } else {
      // Per-User isolation
      const current = userTokens[userKey].tokens;
      if (current > 0) {
        setUserTokens((prev) => ({
          ...prev,
          [userKey]: { ...prev[userKey], tokens: current - 1 },
        }));
        setLastScenarioResult({
          user: userTokens[userKey].name,
          status: 200,
          msg: `✅ [PER-USER ISOLATION] Request from ${userTokens[userKey].name} admitted! Remaining: ${current - 1}/${userTokens[userKey].max}`,
        });
      } else {
        setLastScenarioResult({
          user: userTokens[userKey].name,
          status: 429,
          msg: `⛔ [USER QUOTA EXHAUSTED] ${userTokens[userKey].name} throttled (0/${userTokens[userKey].max}). Other users remain completely unaffected!`,
        });
      }
    }
  };

  // Simulate Mallory flooding 10 requests
  const handleTriggerMallorySurge = () => {
    if (scopeMode === 'global') {
      setGlobalTokens(0);
      setLastScenarioResult({
        user: 'Mallory (Scraper 🤖)',
        status: 429,
        msg: `🚨 NOISY NEIGHBOR DISASTER: Mallory consumed all 10 tokens in the Global Pool! Now when Alice or Bob try to click, they will receive HTTP 429!`,
      });
    } else {
      setUserTokens((prev) => ({
        ...prev,
        mallory: { ...prev.mallory, tokens: 0 },
      }));
      setLastScenarioResult({
        user: 'Mallory (Scraper 🤖)',
        status: 429,
        msg: `🛡️ ISOLATION SUCCESS: Mallory flooded the server and depleted her own 5 tokens (HTTP 429). Alice and Bob still have their full quotas intact!`,
      });
    }
  };

  const handleReset = () => {
    setGlobalTokens(10);
    setUserTokens({
      alice: { name: 'Alice (Regular User)', tokens: 5, max: 5 },
      bob: { name: 'Bob (Regular User)', tokens: 5, max: 5 },
      mallory: { name: 'Mallory (Scraper / Bot 🤖)', tokens: 5, max: 5 },
    });
    setLastScenarioResult(null);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Interactive Scoping Lab • Step 3 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Identity Scoping &amp; Noisy Neighbor Mitigation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Compare a naive <strong className="text-rose-600 dark:text-rose-400 font-semibold">Global Rate Limit</strong> against isolated <strong className="text-purple-600 dark:text-purple-400 font-semibold">Per-User / Per-IP Tiering</strong>. Experience how a single rogue client (Noisy Neighbor) starves legitimate users under a global pool.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerMallorySurge}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" /> Simulate Mallory Bot Flood
            </button>

            <button
              onClick={handleReset}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Quotas
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scope Strategy Switcher */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Select Identity Scoping Strategy:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setScopeMode('global');
              setLastScenarioResult(null);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              scopeMode === 'global'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500/20 shadow-sm'
                : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Global Rate Limit (Shared Pool)</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300">
                VULNERABLE ⚠️
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              All clients share one global pool of 10 tokens. A single bot can consume all tokens and deny service to everyone.
            </p>
          </button>

          <button
            onClick={() => {
              setScopeMode('per-user');
              setLastScenarioResult(null);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              scopeMode === 'per-user'
                ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-900 dark:text-purple-100 ring-1 ring-purple-500/20 shadow-sm'
                : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Per-User / Per-IP Isolation</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300">
                RECOMMENDED ⭐
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Each user/IP has an isolated quota of 5 tokens. Rogue clients exhaust only their own quota; other users remain unaffected.
            </p>
          </button>
        </div>
      </div>

      {/* 3. Live User Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(userTokens).map(([key, data]) => {
          const isMallory = key === 'mallory';
          const tokensLeft = scopeMode === 'global' ? globalTokens : data.tokens;
          const maxTokens = scopeMode === 'global' ? globalCapacity : data.max;

          return (
            <div
              key={key}
              className={`rounded-3xl bg-white dark:bg-[#111827] border p-6 transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                isMallory ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-[#1E2638]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{data.name}</div>
                  <span className={`text-[10px] font-mono font-bold ${tokensLeft === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-400'}`}>
                    {tokensLeft} / {maxTokens} left
                  </span>
                </div>

                {/* Tokens Bar */}
                <div className="pt-3 space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        tokensLeft === 0 ? 'bg-rose-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${(tokensLeft / maxTokens) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => sendUserRequest(key)}
                className={`w-full text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isMallory
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Send Request as {key.toUpperCase()}
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. Live Scenario Result Banner */}
      {lastScenarioResult && (
        <div
          className={`p-5 rounded-3xl border text-xs space-y-1.5 animate-in fade-in ${
            lastScenarioResult.status === 200
              ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
              : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span>Result for {lastScenarioResult.user}</span>
            <span className="font-mono text-[11px] font-black">
              HTTP {lastScenarioResult.status}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">{lastScenarioResult.msg}</p>
        </div>
      )}

      {/* 5. Real-World Architecture Scenarios */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Industry Rate Limiting Architecture Blueprints
          </h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">System Design Patterns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RATE_LIMIT_SCENARIOS.map((sc) => (
            <div key={sc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">{sc.title}</div>
              <div className="font-mono text-purple-600 dark:text-purple-400 text-[11px] font-semibold">{sc.policy}</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">{sc.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IdentityScopingLab;

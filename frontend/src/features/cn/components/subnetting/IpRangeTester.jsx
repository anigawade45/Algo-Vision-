import React, { useState } from 'react';
import { Route, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { testSameSubnet } from '../../utils/subnettingLogic';

export function IpRangeTester({ sourceIp, cidr }) {
  const [targetIp, setTargetIp] = useState('192.168.1.120');

  const testResult = testSameSubnet(sourceIp, targetIp, cidr);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Subnet Reachability &amp; L2 vs. L3 Router Tester
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Source Host IP (A)
            </span>
            <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#111827] text-xs font-mono font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
              {sourceIp} /{cidr}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Test Destination IP (B)
            </label>
            <input
              type="text"
              value={targetIp}
              onChange={(e) => setTargetIp(e.target.value)}
              placeholder="192.168.1.120"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-2xl border transition-all ${
              testResult.isSame
                ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {testResult.isSame ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <span className="font-bold block text-sm">
                  {testResult.isSame ? 'Same Subnet (Direct L2 Switch)' : 'Different Subnets (Requires L3 Gateway)'}
                </span>
                <p className="leading-relaxed opacity-90">
                  {testResult.verdict}
                </p>
                <div className="pt-1 font-mono text-[11px] opacity-80">
                  Network A: <strong>{testResult.netA}</strong> | Network B: <strong>{testResult.netB}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

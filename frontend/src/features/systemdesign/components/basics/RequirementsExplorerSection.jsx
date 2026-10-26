import { useState } from 'react';
import { 
  ListFilter, 
  ShoppingCart, 
  Video, 
  Server, 
  Database, 
  Zap, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Globe
} from 'lucide-react';
import { SYSTEM_CASES } from '../../data/basicsModuleData';

export function RequirementsExplorerSection({ onCompleteStep, isCompleted }) {
  const [selectedCaseId, setSelectedCaseId] = useState('ecommerce');
  const [selectedReqType, setSelectedReqType] = useState('functional'); // 'functional' | 'non-functional'
  const [selectedReqId, setSelectedReqId] = useState('fr-catalog');

  const activeCase = SYSTEM_CASES.find((c) => c.id === selectedCaseId) || SYSTEM_CASES[0];
  const activeReqList = selectedReqType === 'functional' ? activeCase.functionalRequirements : activeCase.nonFunctionalRequirements;
  const activeReq = activeReqList.find((r) => r.id === selectedReqId) || activeReqList[0];

  const handleCaseChange = (caseId) => {
    setSelectedCaseId(caseId);
    const targetCase = SYSTEM_CASES.find((c) => c.id === caseId);
    if (selectedReqType === 'functional') {
      setSelectedReqId(targetCase.functionalRequirements[0].id);
    } else {
      setSelectedReqId(targetCase.nonFunctionalRequirements[0].id);
    }
  };

  const handleTypeChange = (type) => {
    setSelectedReqType(type);
    if (type === 'functional') {
      setSelectedReqId(activeCase.functionalRequirements[0].id);
    } else {
      setSelectedReqId(activeCase.nonFunctionalRequirements[0].id);
    }
  };

  // Helper to test if an architecture component is illuminated by the current requirement
  const isComponentHighlighted = (componentName) => {
    if (!activeReq || !activeReq.addressedBy) return false;
    return activeReq.addressedBy.some((item) =>
      item.toLowerCase().includes(componentName.toLowerCase()) ||
      componentName.toLowerCase().includes(item.toLowerCase())
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Case Selector */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ListFilter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Requirements Explorer & Architecture Mapping
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Discover how product requirements translate directly into engineering architecture and trade-offs.
              </p>
            </div>
          </div>

          {/* System Case Selector */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <button
              onClick={() => handleCaseChange('ecommerce')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCaseId === 'ecommerce'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>ShopSphere (E-Commerce)</span>
            </button>

            <button
              onClick={() => handleCaseChange('streaming')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCaseId === 'streaming'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>StreamPulse (Video)</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {activeCase.description}
        </p>

        {/* Functional vs Non-Functional Switcher */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => handleTypeChange('functional')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedReqType === 'functional'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                : 'bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-purple-300'
            }`}
          >
            Functional Requirements (What it does)
          </button>

          <button
            onClick={() => handleTypeChange('non-functional')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedReqType === 'non-functional'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            Non-Functional Requirements (How well it performs)
          </button>
        </div>
      </div>

      {/* Main Interactive Split: Requirements List (Left) & Architecture Visualizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requirements Selection List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Select a {selectedReqType === 'functional' ? 'Feature' : 'Quality Metric'} to Map:
            </h3>
            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
              {activeReqList.length} Requirements
            </span>
          </div>

          <div className="space-y-2.5">
            {activeReqList.map((req) => {
              const isSelected = selectedReqId === req.id;
              return (
                <button
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer space-y-2 ${
                    isSelected
                      ? selectedReqType === 'functional'
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                        : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {req.id.toUpperCase()}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500 text-white font-bold">
                        Active Selection
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {req.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {req.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Architecture Mapping & Trade-off Inspection */}
        <div className="lg:col-span-7 space-y-4">
          {/* Requirement Detail Banner */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-white via-purple-50/20 to-indigo-50/20 dark:from-[#111827] dark:via-[#111827] dark:to-purple-950/20 border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-md">
            <div className="space-y-1">
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                Selected: {activeReq.id.toUpperCase()}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeReq.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeReq.description}
              </p>
            </div>

            {/* Addressed By Components Tags */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-400">
                Architectural Components & Solutions Employed:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeReq.addressedBy.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 text-xs font-mono font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Trade-off or Impact Note */}
            {activeReq.tradeoff && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 font-mono">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Engineering Trade-Off Analysis</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeReq.tradeoff}
                </p>
              </div>
            )}

            {activeReq.impact && (
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-0.5 text-xs">
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  Business & Reliability Impact:
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {activeReq.impact}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Architecture Component Topology Map */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>Live Architecture Topology Map</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Glowing boxes indicate active components for current requirement
              </span>
            </div>

            {/* Architecture Node Flow Diagram */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Node 1: Client & CDN */}
              <div
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center space-y-2 ${
                  isComponentHighlighted('CDN') || isComponentHighlighted('Client')
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 opacity-70'
                }`}
              >
                <Globe className="w-6 h-6" />
                <div>
                  <div className="text-xs font-bold">Edge CDN & DNS</div>
                  <div className="text-[10px] font-mono opacity-80">Cloudflare / Akamai</div>
                </div>
              </div>

              {/* Node 2: App Server / Gateway */}
              <div
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center space-y-2 ${
                  isComponentHighlighted('Server') || isComponentHighlighted('Gateway') || isComponentHighlighted('Stateless')
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 opacity-70'
                }`}
              >
                <Server className="w-6 h-6" />
                <div>
                  <div className="text-xs font-bold">App Server Tier</div>
                  <div className="text-[10px] font-mono opacity-80">Node.js / Go / Java</div>
                </div>
              </div>

              {/* Node 3: Cache (Redis) */}
              <div
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center space-y-2 ${
                  isComponentHighlighted('Redis') || isComponentHighlighted('Cache') || isComponentHighlighted('Session')
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 opacity-70'
                }`}
              >
                <Zap className="w-6 h-6" />
                <div>
                  <div className="text-xs font-bold">In-Memory Cache</div>
                  <div className="text-[10px] font-mono opacity-80">Redis / Memcached</div>
                </div>
              </div>

              {/* Node 4: Database / Queue */}
              <div
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center space-y-2 ${
                  isComponentHighlighted('Database') || isComponentHighlighted('PostgreSQL') || isComponentHighlighted('Kafka') || isComponentHighlighted('Locks')
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 opacity-70'
                }`}
              >
                <Database className="w-6 h-6" />
                <div>
                  <div className="text-xs font-bold">Data Tier & Queue</div>
                  <div className="text-[10px] font-mono opacity-80">Postgres & Kafka</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

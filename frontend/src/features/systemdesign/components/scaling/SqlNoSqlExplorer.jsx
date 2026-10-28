import { useState } from 'react';
import { 
  Database, 
  Layers, 
  Sparkles, 
  FileCode, 
  Table, 
  Play, 
  RotateCcw,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SQL_NOSQL_DATA } from '../../data/dbScalingData';

export function SqlNoSqlExplorer({ onCompleteStep, isCompleted }) {
  const [activeModel, setActiveModel] = useState('sql'); // 'sql' | 'nosql'
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryResult, setQueryResult] = useState(null);

  const modelData = SQL_NOSQL_DATA[activeModel];

  const handleRunQuery = () => {
    setQueryRunning(true);
    setQueryResult(null);

    setTimeout(() => {
      if (activeModel === 'sql') {
        setQueryResult({
          latency: '24.2 ms',
          method: 'Nested Loop Index Join (3 tables scanned: orders ➔ users ➔ order_items)',
          payload: [
            { customer_name: 'Alice Cooper', order_id: 1042, item: 'MacBook Pro M3 Max', qty: 1, total: '$3,499.00', status: 'PAID' }
          ],
          cost: 'High CPU on JOINs; 100% Normalized schema (Zero duplicate data)'
        });
      } else {
        setQueryResult({
          latency: '1.4 ms',
          method: 'Primary Key Point Lookup: db.orders.findOne({ _id: "ord_1042" })',
          payload: {
            _id: 'ord_1042',
            customer: { userId: 'usr_99', name: 'Alice Cooper', email: 'alice@company.com' },
            items: [{ productId: 'p_404', title: 'MacBook Pro M3 Max', price: 3499, qty: 1 }],
            totalAmount: 3499.00,
            status: 'PAID'
          },
          cost: 'Instant O(1) single-document read; Denormalized customer data embedded'
        });
      }
      setQueryRunning(false);
    }, 450);
  };

  const handleResetQuery = () => {
    setQueryResult(null);
    setQueryRunning(false);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Storage Paradigm Comparison</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Relational SQL vs. Document NoSQL Databases
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Compare relational normalization, foreign-key JOINs, and ACID transactions against document embedding and horizontal partitioning.
            </p>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <button
              onClick={() => {
                setActiveModel('sql');
                handleResetQuery();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeModel === 'sql'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Relational (SQL)</span>
            </button>
            <button
              onClick={() => {
                setActiveModel('nosql');
                handleResetQuery();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeModel === 'nosql'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Document (NoSQL)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Schema & Query Execution Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Schema & Query Inspector (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#060A14] border-2 border-slate-800 p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${modelData.badgeColor}`}>
                  {modelData.tag}
                </span>
                <h3 className="text-base font-bold text-white">
                  {modelData.name} Schema Inspector
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunQuery}
                  disabled={queryRunning}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{queryRunning ? 'Executing...' : 'Run Query'}</span>
                </button>

                <button
                  onClick={handleResetQuery}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Reset Query"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code / Schema Viewer */}
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs overflow-x-auto custom-scrollbar">
              <pre className="text-blue-300">
                {modelData.exampleSchema}
              </pre>
            </div>

            {/* Query Result Output Box */}
            {queryResult && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/40 space-y-2 font-mono text-xs animate-in fade-in">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Query Executed Successfully
                  </span>
                  <span className="font-bold">Execution Time: {queryResult.latency}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{queryResult.method}</p>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-200 overflow-x-auto">
                  <pre>{JSON.stringify(queryResult.payload, null, 2)}</pre>
                </div>
                <p className="text-[10px] text-amber-400 font-sans">
                  💡 <strong>Trade-off Insight:</strong> {queryResult.cost}
                </p>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <strong className="text-white">Ideal Workload: </strong>
              <span>{modelData.bestFor}</span>
            </div>
          </div>
        </div>

        {/* Right: Architectural Property Matrix (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${modelData.badgeColor}`}>
                Architectural Breakdown
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                {modelData.name}
              </h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Data Model:</span>
                <strong className="text-slate-900 dark:text-white">{modelData.model}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Schema Constraints:</span>
                <strong className="text-slate-900 dark:text-white">{modelData.schema}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Transaction Model:</span>
                <strong className="text-slate-900 dark:text-white">{modelData.transactions}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Horizontal Scaling Support:</span>
                <strong className="text-slate-900 dark:text-white">{modelData.scaling}</strong>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Neither paradigm is universally superior — choose SQL for strict relational integrity and NoSQL for high-write schema flexibility.</span>
          </div>
        </div>
      </div>

      {/* 3. Master Decision Matrix */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Comprehensive SQL vs. NoSQL Feature Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="pb-3">Criterion</th>
                <th className="pb-3">Relational Databases (SQL)</th>
                <th className="pb-3">Document / Key-Value (NoSQL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-bold text-slate-900 dark:text-white">Data Structure</td>
                <td className="py-3 text-blue-600 dark:text-blue-400">Strict 2D Tables (Rows &amp; Columns)</td>
                <td className="py-3 text-emerald-600 dark:text-emerald-400">Hierarchical JSON / BSON Documents</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-bold text-slate-900 dark:text-white">Relationships &amp; Joins</td>
                <td className="py-3 text-blue-600 dark:text-blue-400">Native JOINs with Foreign Key Constraints</td>
                <td className="py-3 text-amber-500">Denormalized Embedded Objects (No native multi-table JOINs)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-bold text-slate-900 dark:text-white">Consistency Model</td>
                <td className="py-3 text-emerald-500">Strict ACID (Immediate Consistency)</td>
                <td className="py-3 text-purple-400">BASE (Eventual Consistency default)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-bold text-slate-900 dark:text-white">Scaling Mechanism</td>
                <td className="py-3 text-slate-500">Vertical Scale-Up + Read Replicas (Manual Sharding)</td>
                <td className="py-3 text-emerald-500 font-bold">Horizontal Scale-Out (Auto Partition Sharding)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SqlNoSqlExplorer;

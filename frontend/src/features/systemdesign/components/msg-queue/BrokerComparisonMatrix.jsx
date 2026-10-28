import { useState } from 'react';
import {
  Server,
  Sparkles
} from 'lucide-react';
import { BROKER_COMPARISONS } from '../../data/msgQueueData';

export function BrokerComparisonMatrix({ onCompleteStep, isCompleted }) {
  const [selectedBroker, setSelectedBroker] = useState('rabbitmq');
  const [activeScenario, setActiveScenario] = useState('clickstream');

  const scenarios = [
    {
      id: 'clickstream',
      title: 'Real-Time User Clickstream & Metrics Stream',
      traffic: '500,000 Events / sec • High Throughput • Analytics',
      recommendedBroker: 'Apache Kafka',
      tagBadge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
      explanation:
        'Requires massive batching and append-only disk logging. Multiple analytics consumers (Flink, ClickHouse, Data Lake) read the same log at their own offsets without deleting data.',
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce Order Fulfillment & Background Jobs',
      traffic: '5,000 Tasks / sec • Discrete Work Distribution • DLQ',
      recommendedBroker: 'RabbitMQ or AWS SQS FIFO',
      tagBadge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800',
      explanation:
        'Tasks need discrete point-to-point worker distribution, complex routing keys (e.g. `order.created`, `order.paid`), instant message deletion on ACK, and sophisticated Dead-Letter Queues.',
    },
    {
      id: 'delayed',
      title: 'Delayed User Reminders & Scheduled Jobs',
      traffic: '1,000 Jobs / sec • Delayed Scheduling • High Speed',
      recommendedBroker: 'Redis Streams / BullMQ',
      tagBadge: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800',
      explanation:
        'BullMQ on top of Redis supports sub-millisecond job scheduling, delayed jobs (e.g. "Send abandoned cart email in 2 hours"), cron jobs, and rate-limited worker processing natively in RAM.',
    },
    {
      id: 'serverless',
      title: 'Serverless Cloud Microservices (AWS Lambda)',
      traffic: 'Variable Burst • Zero Infrastructure Maintenance',
      recommendedBroker: 'AWS SQS (Simple Queue Service)',
      tagBadge: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800',
      explanation:
        'Fully managed serverless architecture. AWS SQS auto-scales from zero to thousands of messages per second with zero server provisioning and native AWS Lambda event triggers.',
    },
  ];

  const currentBroker = BROKER_COMPARISONS.find((b) => b.id === selectedBroker) || BROKER_COMPARISONS[0];
  const currentScenario = scenarios.find((s) => s.id === activeScenario) || scenarios[0];

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Server className="w-3.5 h-3.5" />
                <span>Decision Matrix • Step 5 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Message Broker Architecture Comparison Matrix
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Compare <strong className="text-slate-900 dark:text-white">RabbitMQ</strong>, <strong className="text-slate-900 dark:text-white">Apache Kafka</strong>, <strong className="text-slate-900 dark:text-white">AWS SQS</strong>, and <strong className="text-slate-900 dark:text-white">Redis Streams</strong>. Master Push vs. Pull models, retention guarantees, and scenario-based broker selection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Broker Selector Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {BROKER_COMPARISONS.map((b) => {
          const isSelected = selectedBroker === b.id;

          return (
            <button
              key={b.id}
              onClick={() => setSelectedBroker(b.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 shadow-sm ring-1 ring-purple-500/20'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#1E2638] hover:bg-slate-50 dark:hover:bg-[#131B2E]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${b.badgeColor}`}>
                    {b.tag.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                      SELECTED
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{b.name}</div>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                {b.type.split('/')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Deep-Dive Specification Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentBroker.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentBroker.badgeColor}`}>
                  {currentBroker.tag}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentBroker.type}</p>
            </div>
          </div>
        </div>

        {/* 6-Stat Technical Matrix Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Architecture &amp; Topology</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{currentBroker.model}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Throughput Scale</div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5">{currentBroker.throughput}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Latency Profile</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{currentBroker.latency}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Ordering Guarantees</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{currentBroker.ordering}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Message Retention</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{currentBroker.retention}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Replayable Log Offset</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{currentBroker.replayable}</div>
          </div>
        </div>

        {/* Best For Callout */}
        <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/80 text-xs space-y-1">
          <span className="font-bold text-purple-900 dark:text-purple-200 block">Best Use Case:</span>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{currentBroker.bestFor}</p>
        </div>
      </div>

      {/* 4. Scenario Decision Helper */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Scenario-Based Broker Selection
          </h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">System Design Interview Guide</span>
        </div>

        {/* Scenario Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-semibold">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeScenario === sc.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <div className="truncate">{sc.title.split(' (')[0]}</div>
              <div className="text-[10px] opacity-80 truncate font-mono">{sc.traffic.split(' • ')[0]}</div>
            </button>
          ))}
        </div>

        {/* Selected Scenario Details */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-slate-900 dark:text-white text-sm">{currentScenario.title}</span>
            <span className="font-mono text-purple-600 dark:text-purple-400 text-[11px] font-semibold">{currentScenario.traffic}</span>
          </div>

          <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              Recommended Broker:
            </div>
            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {currentScenario.recommendedBroker}
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Why:</strong> {currentScenario.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BrokerComparisonMatrix;

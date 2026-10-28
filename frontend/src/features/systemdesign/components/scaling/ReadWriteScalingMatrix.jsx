import { useState } from 'react';
import {
  Layers,
  ArrowUpDown,
  Zap,
  GitBranch,
  Grid,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Database
} from 'lucide-react';

export function ReadWriteScalingMatrix({ onCompleteStep, isCompleted }) {
  const [selectedTechnique, setSelectedTechnique] = useState('replicas');
  const [activeScenario, setActiveScenario] = useState('ecommerce');

  const techniques = [
    {
      id: 'replicas',
      name: 'Read Replicas (Primary-Replica)',
      type: 'Read Scaling',
      typeBadge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: GitBranch,
      targetBottleneck: 'Read Throughput (SELECT queries)',
      writeImpact: 'Neutral / Slight Negative (Leader must stream WAL logs)',
      complexity: 'Low to Medium',
      consistency: 'Eventual Consistency (Replication Lag)',
      idealRatio: '10:1 to 100:1 Read-to-Write Ratio',
      summary: 'Distributes read queries across follower database instances while keeping a single leader for write transactions.',
      pros: ['Easy to set up on AWS RDS / PostgreSQL', 'Zero changes to relational schema', 'High availability read failover'],
      cons: ['Does not scale write throughput', 'Risk of stale reads during replication lag', 'Primary remains single point of write failure'],
    },
    {
      id: 'caching',
      name: 'In-Memory Cache (Redis / Memcached)',
      type: 'Read Scaling',
      typeBadge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: Zap,
      targetBottleneck: 'Read Latency & Database CPU Load',
      writeImpact: 'Neutral (Requires Cache Invalidation on Writes)',
      complexity: 'Medium',
      consistency: 'Eventual Consistency (TTL / Invalidation dependent)',
      idealRatio: 'Hot Data / High Repeat Access',
      summary: 'Intercepts database reads in microsecond RAM cache, reducing database IOPS by 80-95%.',
      pros: ['Sub-millisecond read latency', 'Protects database from thundering herd', 'Extremely cost-effective read scaling'],
      cons: ['Cache invalidation is notoriously difficult', 'Risk of cache stampede on TTL expiry', 'Data lost if RAM unpersisted'],
    },
    {
      id: 'sharding',
      name: 'Database Sharding (Horizontal Partitioning)',
      type: 'Write & Storage Scaling',
      typeBadge: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      icon: Grid,
      targetBottleneck: 'Write Throughput, Disk IOPS & Total Storage Size',
      writeImpact: 'Massive Horizontal Write Scaling (O(N) shards)',
      complexity: 'High to Very High',
      consistency: 'Local ACID per shard; Cross-shard requires 2PC / Sagas',
      idealRatio: 'Heavy Write & Massive Datasets (Terabytes/Petabytes)',
      summary: 'Splits large datasets across multiple independent database nodes by partition key (hash or range).',
      pros: ['Scales both reads and writes linearly', 'Overcomes single-node disk storage limits', 'Isolates failure domains'],
      cons: ['Cross-shard joins are slow or unsupported', 'Re-sharding and re-balancing data is complex', 'Prone to hot shards if key chosen poorly'],
    },
    {
      id: 'queues',
      name: 'Write Buffering & Queues (Kafka / RabbitMQ)',
      type: 'Write Scaling',
      typeBadge: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      icon: ArrowUpDown,
      targetBottleneck: 'Write Spikes & Sudden Traffic Bursts',
      writeImpact: 'Buffers Writes in Disk Queue to Smooth DB Load',
      complexity: 'Medium',
      consistency: 'Asynchronous Eventual Consistency',
      idealRatio: 'High-Velocity Append-Only Events',
      summary: 'Decouples ingestion from database writes by buffering incoming operations in a distributed streaming log.',
      pros: ['Prevents database crashing during flash sales', 'Guaranteed message persistence', 'Enables asynchronous batch inserts'],
      cons: ['Writes are not immediately visible in database', 'Requires consumer workers and DLQ monitoring', 'Complex error compensation logic'],
    },
    {
      id: 'cqrs',
      name: 'CQRS (Command Query Segregation)',
      type: 'Hybrid Architecture',
      typeBadge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      icon: Layers,
      targetBottleneck: 'Complex Multi-Entity Reads + High Write Logic',
      writeImpact: 'Writes optimized for validation; Reads optimized for projection',
      complexity: 'Very High',
      consistency: 'Eventual Consistency (Event-Driven Projections)',
      idealRatio: 'Enterprise Systems with Disparate Read/Write Needs',
      summary: 'Separates write models (Commands via SQL/Event Sourcing) from read models (Projections via Elasticsearch/Redis).',
      pros: ['Optimizes reads and writes completely independently', 'Super-fast pre-joined materialized views', 'Highly flexible schema evolution'],
      cons: ['Massive architectural complexity', 'Eventual consistency lag between command & query store', 'Data synchronization bugs'],
    },
  ];

  const scenarios = [
    {
      id: 'ecommerce',
      title: 'E-Commerce Platform (Shopify / Amazon)',
      traffic: '100,000 Reads/sec • 5,000 Writes/sec (20:1 Ratio)',
      bottleneck: 'High Product Catalog Reads + Flash-Sale Write Bursts',
      recommendedStack: 'Redis Product Cache + 5 Read Replicas + Kafka Order Ingestion Queue',
      explanation: 'Product catalogs are 98% read-heavy and cached in Redis. Flash-sale checkouts are buffered via Kafka to prevent database connection saturation.',
    },
    {
      id: 'social',
      title: 'Social Media Feed (Instagram / X)',
      traffic: '500,000 Reads/sec • 30,000 Writes/sec (16:1 Ratio)',
      bottleneck: 'Celebrity Fanout-on-Write & Timeline Assembly Latency',
      recommendedStack: 'Fanout Service (Redis Timeline Lists) + Sharded Cassandra/PostgreSQL by user_id',
      explanation: 'User posts are partitioned by user_id across database shards. Timelines for active followers are materialized in Redis RAM for instant feed loading.',
    },
    {
      id: 'fintech',
      title: 'Banking & Financial Ledger (Stripe / Revolut)',
      traffic: '10,000 Reads/sec • 8,000 Writes/sec (1.2:1 Heavy Write Ratio)',
      bottleneck: 'Strict Double-Entry ACID Consistency & Audit Immutability',
      recommendedStack: 'Multi-AZ Primary-Replica PostgreSQL + Synchronous Replication + Event Sourcing Log',
      explanation: 'Financial balances require strict serializability. Read replicas handle historical transaction lookups while Primary runs strict ACID transactions.',
    },
    {
      id: 'iot',
      title: 'IoT Sensor Telemetry (Tesla / Smart Meters)',
      traffic: '200,000 Writes/sec (Append-Only) • 500 Reads/sec (Analytical)',
      bottleneck: 'Massive Ingestion IOPS & High Storage Volume',
      recommendedStack: 'Time-Series Distributed Store (ClickHouse / TimescaleDB) + Kafka Ingestion',
      explanation: 'Data is strictly append-only. Kafka streams raw metrics into ClickHouse partitioned by timestamp and device ID, utilizing columnar compression.',
    },
  ];

  const currentTech = techniques.find((t) => t.id === selectedTechnique) || techniques[0];
  const currentScenario = scenarios.find((s) => s.id === activeScenario) || scenarios[0];

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Comprehensive Decision Matrix • Step 5 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Read Scaling vs. Write Scaling Strategy Matrix
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Master the architectural trade-offs between <strong className="text-slate-900 dark:text-white">Read Replicas</strong>, <strong className="text-slate-900 dark:text-white">In-Memory Caching</strong>, <strong className="text-slate-900 dark:text-white">Database Sharding</strong>, <strong className="text-slate-900 dark:text-white">Write Buffering</strong>, and <strong className="text-slate-900 dark:text-white">CQRS</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Technique Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {techniques.map((tech) => {
          const Icon = tech.icon;
          const isSelected = selectedTechnique === tech.id;

          return (
            <button
              key={tech.id}
              onClick={() => setSelectedTechnique(tech.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 shadow-sm ring-1 ring-purple-500/20'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#1E2638] hover:bg-slate-50 dark:hover:bg-[#131B2E]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tech.typeBadge}`}>
                    {tech.type.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{tech.name}</div>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2.5 font-mono">
                {tech.targetBottleneck.split(' ')[0]} Focus
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Technique Deep-Dive Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
              <currentTech.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentTech.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentTech.typeBadge}`}>
                  {currentTech.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentTech.summary}</p>
            </div>
          </div>
        </div>

        {/* 4-Stat Comparison Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Target Bottleneck</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{currentTech.targetBottleneck}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Write Performance Impact</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{currentTech.writeImpact}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">System Complexity</div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5">{currentTech.complexity}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Consistency Guarantees</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{currentTech.consistency}</div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Architectural Strengths
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {currentTech.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2">
            <div className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Trade-offs &amp; Pitfalls
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {currentTech.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Real-World Architecture Scenarios */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Real-World System Architecture Scenarios
          </h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">System Design Blueprint</span>
        </div>

        {/* Scenario Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-semibold">
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

        {/* Scenario Deep Dive Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-slate-900 dark:text-white text-sm">{currentScenario.title}</span>
            <span className="font-mono text-purple-600 dark:text-purple-400 text-[11px] font-semibold">
              {currentScenario.traffic}
            </span>
          </div>

          <div className="bg-white dark:bg-[#111827] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              Recommended Architecture Stack:
            </div>
            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {currentScenario.recommendedStack}
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Why this architecture:</strong> {currentScenario.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReadWriteScalingMatrix;

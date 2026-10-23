import { useState, useMemo } from 'react';
import {
  Grid,
  Server,
  Plus,
  Zap,
  Flame,
  Globe,
  Hash,
  ListFilter,
  CheckCircle2,
  RefreshCcw,
  Sparkles,
  Search,
  Activity,
  Cpu,
  ArrowRight,
  Database,
  AlertTriangle
} from 'lucide-react';
import { INITIAL_SHARD_RECORDS } from '../../data/dbScalingData';

// Simple deterministic string hash
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Compute shard assignment for any record given strategy
function getShardForRecord(record, strategy) {
  if (strategy === 'hash') {
    const h = simpleHash(record.id);
    const shardIndex = (h % 3) + 1; // 1, 2, or 3
    return `shard${shardIndex}`;
  } else if (strategy === 'range') {
    // Range by first letter of Name (A-H -> 1, I-P -> 2, Q-Z -> 3)
    const firstChar = (record.name || 'A')[0].toUpperCase();
    if (firstChar <= 'H') return 'shard1';
    if (firstChar <= 'P') return 'shard2';
    return 'shard3';
  } else if (strategy === 'geo') {
    // Geo by Country code
    if (record.country === 'US') return 'shard1';
    if (record.country === 'EU') return 'shard2';
    return 'shard3'; // APAC & MEA
  }
  return 'shard1';
}

export function DbShardingSimulator({ onCompleteStep, isCompleted }) {
  const [shardingStrategy, setShardingStrategy] = useState('hash'); // 'hash', 'range', 'geo'
  const [records, setRecords] = useState(INITIAL_SHARD_RECORDS);
  const [shardStatus, setShardStatus] = useState({
    shard1: { name: 'Shard 1 (Node A)', isOnline: true },
    shard2: { name: 'Shard 2 (Node B)', isOnline: true },
    shard3: { name: 'Shard 3 (Node C)', isOnline: true },
  });

  // Query & Routing simulation state
  const [lastRoutingAction, setLastRoutingAction] = useState(null);
  const [activeHighlightedShard, setActiveHighlightedShard] = useState(null);
  const [isCrossShardActive, setIsCrossShardActive] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserCountry, setNewUserCountry] = useState('US');
  const [newUserSpend, setNewUserSpend] = useState('$1,200');

  // Group records into shards
  const shardsData = useMemo(() => {
    const s1 = [];
    const s2 = [];
    const s3 = [];

    records.forEach((r) => {
      const target = getShardForRecord(r, shardingStrategy);
      if (target === 'shard1') s1.push(r);
      else if (target === 'shard2') s2.push(r);
      else s3.push(r);
    });

    return { shard1: s1, shard2: s2, shard3: s3 };
  }, [records, shardingStrategy]);

  // Insert Record
  const handleInsertRecord = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const nextIdNum = records.length + 101;
    const newRec = {
      id: `usr_${nextIdNum}`,
      name: newUserName,
      email: `${newUserName.toLowerCase().replace(/\s+/g, '.')}@cloud.com`,
      country: newUserCountry,
      spend: newUserSpend,
    };

    const targetShard = getShardForRecord(newRec, shardingStrategy);
    const targetNode = shardStatus[targetShard];

    setRecords((prev) => [...prev, newRec]);
    setNewUserName('');

    // Highlight target shard
    setActiveHighlightedShard(targetShard);
    setTimeout(() => setActiveHighlightedShard(null), 2000);

    setLastRoutingAction({
      type: 'insert',
      record: newRec,
      shard: targetShard,
      nodeName: targetNode.name,
      isOnline: targetNode.isOnline,
      explanation:
        shardingStrategy === 'hash'
          ? `hash('${newRec.id}') % 3 = ${targetShard} ➔ Direct O(1) single-shard write.`
          : shardingStrategy === 'range'
          ? `Initial letter '${newRec.name[0]}' mapped into range bracket ➔ Route to ${targetShard}.`
          : `Country '${newRec.country}' geo-routed to ${targetShard}.`,
    });
  };

  // Single Shard Lookup (Fast)
  const handleSingleShardLookup = (sampleId = 'usr_104') => {
    const targetRec = records.find((r) => r.id === sampleId) || records[0];
    const targetShard = getShardForRecord(targetRec, shardingStrategy);
    const targetNode = shardStatus[targetShard];

    setActiveHighlightedShard(targetShard);
    setIsCrossShardActive(false);
    setTimeout(() => setActiveHighlightedShard(null), 2500);

    setLastRoutingAction({
      type: 'single-query',
      query: `SELECT * FROM users WHERE id = '${targetRec.id}'`,
      shard: targetShard,
      nodeName: targetNode.name,
      isOnline: targetNode.isOnline,
      latency: targetNode.isOnline ? '1.8 ms' : 'FAILED (Node Offline)',
      shardsContacted: 1,
      rowsFound: targetNode.isOnline ? 1 : 0,
      explanation: `Router extracted Shard Key (${targetRec.id}), calculated route directly to ${targetNode.name}. Only 1 server hit!`,
    });
  };

  // Cross-Shard Scatter-Gather Query (Slow & Expensive)
  const handleScatterGatherQuery = () => {
    setIsCrossShardActive(true);
    setActiveHighlightedShard(null);

    const onlineShards = Object.keys(shardStatus).filter((k) => shardStatus[k].isOnline);
    const totalHits = onlineShards.length;

    setTimeout(() => {
      setIsCrossShardActive(false);
      setLastRoutingAction({
        type: 'scatter-gather',
        query: `SELECT * FROM users WHERE spend > '$1,000' ORDER BY spend DESC`,
        shardsContacted: 3,
        latency: onlineShards.length === 3 ? '48.5 ms' : 'Degraded / Incomplete',
        rowsFound: records.filter((r) => parseInt(r.spend.replace(/[^0-9]/g, ''), 10) > 1000).length,
        explanation: `⚠️ Non-shard-key query forced query coordinator to broadcast requests to ALL 3 shards simultaneously (Scatter), wait for slowest disk node, and merge results in router memory (Gather).`,
      });
    }, 1200);
  };

  // Simulate Hot Shard Surge
  const handleTriggerHotShardSurge = () => {
    // Generate 5 records that all map to Shard 1 (US or letter A-H)
    const hotRecords = [
      { id: `usr_hot_${Date.now() + 1}`, name: 'Aaron VIP', email: 'aaron@influencer.tv', country: 'US', spend: '$9,500' },
      { id: `usr_hot_${Date.now() + 2}`, name: 'Alice Celeb', email: 'alice@streamer.com', country: 'US', spend: '$12,000' },
      { id: `usr_hot_${Date.now() + 3}`, name: 'Bob Star', email: 'bob@hollywood.org', country: 'US', spend: '$8,200' },
      { id: `usr_hot_${Date.now() + 4}`, name: 'Bella Model', email: 'bella@fashion.co', country: 'US', spend: '$6,400' },
      { id: `usr_hot_${Date.now() + 5}`, name: 'Charlie Whale', email: 'charlie@crypto.fund', country: 'US', spend: '$45,000' },
    ];

    setRecords((prev) => [...prev, ...hotRecords]);
    setActiveHighlightedShard('shard1');
    setTimeout(() => setActiveHighlightedShard(null), 3000);

    setLastRoutingAction({
      type: 'hot-shard',
      explanation: `🔥 HOT SHARD ALERT: 5 high-profile records inundated Shard 1 due to partition key clustering! Shard 1 CPU & disk IOPS spiked to 92%.`,
    });
  };

  const toggleShardStatus = (shardKey) => {
    setShardStatus((prev) => ({
      ...prev,
      [shardKey]: {
        ...prev[shardKey],
        isOnline: !prev[shardKey].isOnline,
      },
    }));
  };

  const handleResetData = () => {
    setRecords(INITIAL_SHARD_RECORDS);
    setLastRoutingAction(null);
    setShardStatus({
      shard1: { name: 'Shard 1 (Node A)', isOnline: true },
      shard2: { name: 'Shard 2 (Node B)', isOnline: true },
      shard3: { name: 'Shard 3 (Node C)', isOnline: true },
    });
  };

  // Calculate skew
  const counts = [shardsData.shard1.length, shardsData.shard2.length, shardsData.shard3.length];
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  const skewPercentage = records.length > 0 ? Math.round(((maxCount - minCount) / records.length) * 100) : 0;
  const isHotSpotPresent = skewPercentage > 30 || maxCount >= 7;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Grid className="w-3.5 h-3.5" />
                <span>Interactive Lab • Step 4 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Database Sharding &amp; Horizontal Partitioning Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Scale writes and storage horizontally by partitioning datasets across multiple independent database nodes. Compare <strong className="text-purple-600 dark:text-purple-400 font-semibold">Hash-Based</strong> vs <strong className="text-purple-600 dark:text-purple-400 font-semibold">Range-Based</strong> sharding, witness <strong className="text-rose-600 dark:text-rose-400 font-semibold">Hot Shards</strong>, and execute <strong className="text-amber-600 dark:text-amber-400 font-semibold">Scatter-Gather queries</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSingleShardLookup('usr_104')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" /> Single Shard Query (O(1))
            </button>
            <button
              onClick={handleScatterGatherQuery}
              disabled={isCrossShardActive}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" /> Cross-Shard Query
            </button>
            <button
              onClick={handleTriggerHotShardSurge}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" /> Trigger Hot Shard Surge
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sharding Strategy Selector & Skew Metric Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Partitioning / Sharding Strategy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select how shard keys route user rows to physical nodes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'hash', label: 'Hash-Based (Consistent)', icon: Hash },
              { id: 'range', label: 'Range-Based (A-Z Name)', icon: ListFilter },
              { id: 'geo', label: 'Geo-Based (Region)', icon: Globe },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setShardingStrategy(s.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    shardingStrategy === s.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shard Skew Meter */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Partition Data Distribution Skew: {skewPercentage}%
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isHotSpotPresent
                  ? '⚠️ High Imbalance: One shard is shouldering an excessive proportion of traffic.'
                  : '✅ Balanced Distribution: Rows are relatively evenly distributed across cluster nodes.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
              S1: {shardsData.shard1.length}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
              S2: {shardsData.shard2.length}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
              S3: {shardsData.shard3.length}
            </span>
            <button
              onClick={handleResetData}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Reset data"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Physical Shards Cluster Grid (3 Nodes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { key: 'shard1', label: 'Shard 1 (Node A)', rule: shardingStrategy === 'hash' ? 'hash(id) % 3 == 1' : shardingStrategy === 'range' ? 'Names A — H' : 'Region: US / North America' },
          { key: 'shard2', label: 'Shard 2 (Node B)', rule: shardingStrategy === 'hash' ? 'hash(id) % 3 == 2' : shardingStrategy === 'range' ? 'Names I — P' : 'Region: EU / Europe' },
          { key: 'shard3', label: 'Shard 3 (Node C)', rule: shardingStrategy === 'hash' ? 'hash(id) % 3 == 0' : shardingStrategy === 'range' ? 'Names Q — Z' : 'Region: APAC / Global' },
        ].map(({ key, label, rule }) => {
          const shardInfo = shardStatus[key];
          const rows = shardsData[key] || [];
          const isHighlighted = activeHighlightedShard === key || isCrossShardActive;
          const isHot = rows.length >= 7;

          let cardBorder = 'border-slate-200 dark:border-slate-800';
          if (isHighlighted) cardBorder = 'border-purple-500 ring-2 ring-purple-500/20 shadow-lg';
          if (!shardInfo.isOnline) cardBorder = 'border-rose-300 dark:border-rose-900/60 bg-rose-50/10 opacity-70';

          return (
            <div
              key={key}
              className={`rounded-3xl bg-white dark:bg-[#111827] border p-6 transition-all shadow-xs flex flex-col justify-between space-y-4 ${cardBorder}`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{label}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{rule}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      shardInfo.isOnline
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300'
                    }`}
                  >
                    {shardInfo.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                {/* Shard Capacity / Load Bar */}
                <div className="pt-3 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Shard Storage Volume:</span>
                    <span className={`font-mono font-bold ${isHot ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                      {rows.length} Records {isHot && '(HOT)'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHot ? 'bg-rose-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${Math.min(100, (rows.length / 10) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Shard Data Table Preview */}
                <div className="mt-3.5 space-y-1.5 max-h-48 overflow-y-auto pr-1 font-mono text-[11px] custom-scrollbar">
                  {rows.length > 0 ? (
                    rows.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{r.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{r.id} • {r.country}</div>
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                          {r.spend}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B101D] text-center text-[11px] text-slate-400">
                      Empty partition
                    </div>
                  )}
                </div>
              </div>

              {/* Shard Node Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono">Port: 543{key.slice(-1)}</span>
                <button
                  onClick={() => toggleShardStatus(key)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    shardInfo.isOnline
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
                      : 'bg-emerald-600 text-white border-emerald-700'
                  }`}
                >
                  {shardInfo.isOnline ? 'Simulate Crash' : 'Recover Node'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Live Routing Activity Card */}
      {lastRoutingAction && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Distributed Shard Query Coordinator Trace
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold uppercase">
              {lastRoutingAction.type}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {lastRoutingAction.explanation}
          </p>

          {lastRoutingAction.latency && (
            <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-500 dark:text-slate-400">
              <span>Shards Contacted: <strong className="text-slate-900 dark:text-white">{lastRoutingAction.shardsContacted}</strong></span>
              <span>Observed Latency: <strong className="text-emerald-600 dark:text-emerald-400">{lastRoutingAction.latency}</strong></span>
              <span>Matched Rows: <strong className="text-purple-600 dark:text-purple-400">{lastRoutingAction.rowsFound}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* 5. Sharding Architectural Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Shard Key Selection is Permanent
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Choosing the wrong shard key causes catastrophic partition skew and hot spots. Resharding a multi-terabyte production database requires complex live data migrations.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            Cross-Shard JOINs are Forbidden
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Relational SQL JOINs between records on separate physical nodes require network scatter-gather transfers. Sharded architectures demand denormalization or application-level joins.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
            <Grid className="w-4 h-4" />
            Consistent Hashing Minimizes Movement
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            When adding a 4th node with consistent hashing, only <code className="text-slate-900 dark:text-white font-mono">1/N</code> of the keys need to migrate, compared to nearly 100% of keys in naive modulo hashing.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DbShardingSimulator;

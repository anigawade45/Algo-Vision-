import { useState } from 'react';
import {
  Activity,
  Send,
  Zap,
  RotateCcw,
  Globe,
  Sparkles,
  Server,
  Layers
} from 'lucide-react';

export function RequestFlowPipeline({ onCompleteStep, isCompleted }) {
  const [selectedClient, setSelectedClient] = useState('alice');
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/checkout');
  const [clientQuotas, setClientQuotas] = useState({
    alice: { name: 'Alice (Free Tier)', remaining: 3, limit: 5, ip: '192.168.1.42' },
    bob: { name: 'Bob (Pro Tier)', remaining: 8, limit: 10, ip: '10.0.4.12' },
    mallory: { name: 'Mallory (Bot / Scraper 🤖)', remaining: 0, limit: 5, ip: '172.56.21.99' },
  });

  const [pipelineState, setPipelineState] = useState({
    status: 'idle', // 'idle', 'in_flight', 'admitted', 'rejected'
    currentReq: null,
  });

  const [requestHistory, setRequestHistory] = useState([
    { id: 'req_101', time: '12:00:01', client: 'Alice (Free)', endpoint: '/api/products', status: 200, result: 'Admitted (Token Consumed)', latency: '1.2ms' },
    { id: 'req_102', time: '12:00:03', client: 'Mallory (Bot)', endpoint: '/api/checkout', status: 429, result: 'Throttled (Quota 0/5)', latency: '0.4ms', retryAfter: '8s' },
  ]);

  const handleSendPipelineRequest = () => {
    const clientData = clientQuotas[selectedClient];
    const reqId = `req_${Date.now().toString().slice(-4)}`;
    const isAllowed = clientData.remaining > 0;

    setPipelineState({
      status: 'in_flight',
      currentReq: { id: reqId, client: clientData.name, endpoint: selectedEndpoint },
    });

    setTimeout(() => {
      if (isAllowed) {
        setClientQuotas((prev) => ({
          ...prev,
          [selectedClient]: {
            ...prev[selectedClient],
            remaining: prev[selectedClient].remaining - 1,
          },
        }));

        setPipelineState({
          status: 'admitted',
          currentReq: { id: reqId, client: clientData.name, endpoint: selectedEndpoint, status: 200 },
        });

        setRequestHistory((prev) => [
          {
            id: reqId,
            time: new Date().toLocaleTimeString(),
            client: clientData.name,
            endpoint: selectedEndpoint,
            status: 200,
            result: `Admitted (${clientData.remaining - 1}/${clientData.limit} remaining)`,
            latency: '1.4ms',
          },
          ...prev.slice(0, 9),
        ]);
      } else {
        setPipelineState({
          status: 'rejected',
          currentReq: { id: reqId, client: clientData.name, endpoint: selectedEndpoint, status: 429, retryAfter: '10s' },
        });

        setRequestHistory((prev) => [
          {
            id: reqId,
            time: new Date().toLocaleTimeString(),
            client: clientData.name,
            endpoint: selectedEndpoint,
            status: 429,
            result: 'HTTP 429 Quota Exhausted',
            latency: '0.3ms',
            retryAfter: '10s',
          },
          ...prev.slice(0, 9),
        ]);
      }
    }, 600);
  };

  const handleResetQuotas = () => {
    setClientQuotas({
      alice: { name: 'Alice (Free Tier)', remaining: 5, limit: 5, ip: '192.168.1.42' },
      bob: { name: 'Bob (Pro Tier)', remaining: 10, limit: 10, ip: '10.0.4.12' },
      mallory: { name: 'Mallory (Bot / Scraper 🤖)', remaining: 0, limit: 5, ip: '172.56.21.99' },
    });
    setPipelineState({ status: 'idle', currentReq: null });
  };

  const currentClientData = clientQuotas[selectedClient];

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Activity className="w-3.5 h-3.5" />
                <span>Interactive Pipeline • Step 2 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Request Flow Pipeline &amp; HTTP 429 Header Inspection
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Trace an incoming HTTP request through the API Gateway middleware layer. Inspect standard rate limit headers (<code className="text-slate-900 dark:text-white font-mono">X-RateLimit-Limit</code>, <code className="text-slate-900 dark:text-white font-mono">X-RateLimit-Remaining</code>, and <code className="text-slate-900 dark:text-white font-mono">Retry-After</code>).
              </p>
            </div>
          </div>

          <button
            onClick={handleResetQuotas}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Quotas
          </button>
        </div>
      </div>

      {/* 2. Client & Endpoint Selection Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Client Identity */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Client Identity / Token Tier:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(clientQuotas).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedClient(key)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedClient === key
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-900 dark:text-purple-100 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs truncate">{data.name.split(' (')[0]}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {data.remaining}/{data.limit} left
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Selector */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Endpoint:</label>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              className="w-full text-xs font-mono font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B101D] px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="/api/checkout">POST /api/checkout (Critical)</option>
              <option value="/api/products">GET /api/products (Public Read)</option>
              <option value="/api/auth/login">POST /api/auth/login (Auth Strict)</option>
            </select>
          </div>

          {/* Dispatch Button */}
          <div className="md:col-span-3">
            <button
              onClick={handleSendPipelineRequest}
              disabled={pipelineState.status === 'in_flight'}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {pipelineState.status === 'in_flight' ? 'Evaluating Pipeline...' : 'Dispatch Request'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Visual Pipeline Flow: Client ➔ Gateway ➔ Redis ➔ Backend */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stage 1: Client Browser */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            1. Client Application
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {currentClientData.name} ({currentClientData.ip})
          </p>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 font-mono text-[10px]">
            {selectedEndpoint}
          </div>
        </div>

        {/* Stage 2: Gateway Rate Limiter Middleware */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-purple-400/60 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            2. API Gateway Limiter
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Nginx / Envoy / Kong Gateway Layer
          </p>
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 font-mono text-[10px] text-purple-900 dark:text-purple-200">
            Quota Check: {currentClientData.remaining}/{currentClientData.limit} remaining
          </div>
        </div>

        {/* Stage 3: Redis Distributed Counter */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            3. Redis Memory Store
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Atomic Lua Script (Sub-millisecond)
          </p>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 font-mono text-[10px]">
            rl:{selectedClient}:{selectedEndpoint}
          </div>
        </div>

        {/* Stage 4: Backend Microservice */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            4. Backend Service
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Core Application Database &amp; Logic
          </p>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 font-mono text-[10px]">
            {pipelineState.status === 'admitted' ? '✓ Protected & Safe' : 'Shielded from Flood'}
          </div>
        </div>
      </div>

      {/* 4. HTTP Headers Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              HTTP Response Headers Inspector
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">RFC 6585 Standard</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2">
            <div className="text-purple-400 font-bold">
              HTTP/1.1 {currentClientData.remaining > 0 ? '200 OK' : '429 Too Many Requests'}
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div><span className="text-slate-500">X-RateLimit-Limit:</span> {currentClientData.limit}</div>
              <div><span className="text-slate-500">X-RateLimit-Remaining:</span> {currentClientData.remaining}</div>
              <div><span className="text-slate-500">X-RateLimit-Reset:</span> {Math.floor(Date.now() / 1000) + 60}</div>
              {currentClientData.remaining === 0 && (
                <div className="text-rose-400 font-bold">
                  <span className="text-slate-500">Retry-After:</span> 10 (seconds)
                </div>
              )}
              <div><span className="text-slate-500">Content-Type:</span> application/json</div>
            </div>
          </div>
        </div>

        {/* Live Pipeline Request Log */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Gateway Traffic Log
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Live Activity</span>
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1 custom-scrollbar">
            {requestHistory.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  item.status === 200
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div>
                  <div className="font-bold">{item.client} ➔ {item.endpoint}</div>
                  <div className="text-[10px] opacity-75">{item.result}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    item.status === 200 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {item.status}
                  </span>
                  <div className="text-[9px] opacity-70 mt-0.5">{item.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestFlowPipeline;

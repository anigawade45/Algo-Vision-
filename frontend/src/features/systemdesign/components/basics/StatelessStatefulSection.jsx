import { useState } from 'react';
import { 
  Server, 
  Database, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Lock
} from 'lucide-react';

export function StatelessStatefulSection({ onCompleteStep, isCompleted }) {
  // Stateful setup state
  const [statefulStep, setStatefulStep] = useState(0); // 0: Idle, 1: Logged in on S1, 2: Switched to S2 (Error!), 3: S1 Crashed
  // Stateless setup state
  const [statelessStep, setStatelessStep] = useState(0); // 0: Idle, 1: Logged in with JWT/Redis, 2: Switched to S2 (Success!), 3: S1 Crashed (Failover OK!)

  const [statelessMode, setStatelessMode] = useState('jwt'); // 'jwt' | 'redis'

  const handleResetBoth = () => {
    setStatefulStep(0);
    setStatelessStep(0);
  };

  const handleSimulateLogin = () => {
    setStatefulStep(1);
    setStatelessStep(1);
  };

  const handleSimulateSwitchServer = () => {
    setStatefulStep(2);
    setStatelessStep(2);
  };

  const handleSimulateCrash = () => {
    setStatefulStep(3);
    setStatelessStep(3);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Stateless vs. Stateful Server Architecture
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Compare session handling, horizontal auto-scaling, and failover behavior side by side.
              </p>
            </div>
          </div>

          {/* Stateless strategy toggle */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[11px] font-mono text-slate-400 px-2">Stateless Mode:</span>
            <button
              onClick={() => setStatelessMode('jwt')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statelessMode === 'jwt'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              JWT Client Token
            </button>
            <button
              onClick={() => setStatelessMode('redis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statelessMode === 'redis'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Shared Redis Cache
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          In a <strong>Stateful architecture</strong>, user session data (shopping cart, auth tokens, step wizards) is stored inside the local RAM memory of a specific server. In a <strong>Stateless architecture</strong>, servers maintain zero in-memory user state; state is transmitted inside signed tokens (JWT) or stored in an external distributed cache (Redis).
        </p>

        {/* Global Simulation Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSimulateLogin}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            1. Login & Add Item to Cart
          </button>

          <button
            onClick={handleSimulateSwitchServer}
            disabled={statefulStep === 0}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-40"
          >
            2. Re-route Request to Server 2
          </button>

          <button
            onClick={handleSimulateCrash}
            disabled={statefulStep === 0}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-40"
          >
            3. Simulate Server 1 Crash
          </button>

          <button
            onClick={handleResetBoth}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
            Reset
          </button>
        </div>
      </div>

      {/* Side-by-Side Live Interactive Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Stateful Cluster */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Stateful Architecture (In-Memory Session)
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                Local RAM State
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Session state is stored in <strong>Server 1's local RAM memory</strong>. Requires sticky sessions on the load balancer.
            </p>

            {/* Stateful Server Nodes Visual */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Stateful Server 1 */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all space-y-2 text-center ${
                  statefulStep === 3
                    ? 'bg-rose-950/20 border-rose-500 opacity-60'
                    : statefulStep >= 1
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 shadow-md'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800'
                }`}
              >
                <Server className={`w-6 h-6 mx-auto ${statefulStep === 3 ? 'text-rose-500' : 'text-amber-500'}`} />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Server 1 {statefulStep === 3 ? '(CRASHED)' : ''}
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  {statefulStep === 0 && <span className="text-slate-400">RAM: Empty</span>}
                  {statefulStep === 1 && (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      RAM: Session#941 (Cart: 1 item)
                    </span>
                  )}
                  {statefulStep === 2 && (
                    <span className="text-amber-600 dark:text-amber-400">
                      RAM: Session#941 (Idle)
                    </span>
                  )}
                  {statefulStep === 3 && (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      RAM Lost! (Process Died)
                    </span>
                  )}
                </div>
              </div>

              {/* Stateful Server 2 */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all space-y-2 text-center ${
                  statefulStep === 2 || statefulStep === 3
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800'
                }`}
              >
                <Server className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Server 2 (Active Target)
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  {statefulStep < 2 && <span className="text-slate-400">RAM: Empty</span>}
                  {(statefulStep === 2 || statefulStep === 3) && (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      RAM: Session#941 NOT FOUND!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stateful Outcome Box */}
            <div className="pt-2">
              {statefulStep === 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center">
                  Click "1. Login & Add Item" above to begin simulation.
                </div>
              )}

              {statefulStep === 1 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Session Created in Server 1 RAM</span>
                  </div>
                  <p>User is logged in on Server 1. Everything works as long as all future requests go strictly to Server 1.</p>
                </div>
              )}

              {statefulStep === 2 && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Error: 401 Unauthorized / Session Lost!</span>
                  </div>
                  <p>Load balancer sent request to Server 2, which has no copy of Session#941 in its local RAM. User must log in again and their cart is lost.</p>
                </div>
              )}

              {statefulStep === 3 && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Server 1 Crash = Total Data Loss!</span>
                  </div>
                  <p>All user sessions stored in Server 1 RAM were instantly erased when the node crashed.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">Stateful Limitations:</span>
            <p>• Cannot horizontally auto-scale dynamically.</p>
            <p>• Sticky sessions cause uneven traffic hot-spots.</p>
            <p>• Rolling zero-downtime server deployments drop active user carts.</p>
          </div>
        </div>

        {/* Right Side: Stateless Cluster */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Stateless Architecture ({statelessMode === 'jwt' ? 'Self-Contained JWT' : 'Shared Redis'})
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                Zero Local State
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Servers have no local memory. State is stored in {statelessMode === 'jwt' ? 'cryptographically signed JWT tokens sent on each request' : 'a shared high-speed Redis cluster'}.
            </p>

            {/* Stateless Server Nodes Visual */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Stateless Server 1 */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all space-y-2 text-center ${
                  statelessStep === 3
                    ? 'bg-slate-200/50 dark:bg-slate-900/50 border-slate-400 opacity-60'
                    : statelessStep >= 1
                    ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800'
                }`}
              >
                <Server className={`w-6 h-6 mx-auto ${statelessStep === 3 ? 'text-slate-400' : 'text-purple-500'}`} />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Server 1 {statelessStep === 3 ? '(OFFLINE)' : ''}
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  <span className="text-slate-400">RAM: Stateless</span>
                </div>
              </div>

              {/* Stateless Server 2 */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all space-y-2 text-center ${
                  statelessStep === 2 || statelessStep === 3
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800'
                }`}
              >
                <Server className={`w-6 h-6 mx-auto ${statelessStep >= 2 ? 'text-emerald-500' : 'text-slate-400'}`} />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Server 2 (Identical Node)
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  {statelessStep < 2 && <span className="text-slate-400">RAM: Stateless</span>}
                  {(statelessStep === 2 || statelessStep === 3) && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {statelessMode === 'jwt' ? 'Verified JWT Signature' : 'Fetched from Redis (1ms)'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Shared State Store (Redis or Token) */}
            <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
                {statelessMode === 'jwt' ? <Lock className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                <span>{statelessMode === 'jwt' ? 'Client Authorization Header' : 'Shared Distributed Redis Store'}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                {statelessStep >= 1 ? 'Session Active (Cart: 1 item)' : 'No Active Session'}
              </span>
            </div>

            {/* Stateless Outcome Box */}
            <div className="pt-2">
              {statelessStep === 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center">
                  Click "1. Login & Add Item" above to begin simulation.
                </div>
              )}

              {statelessStep === 1 && (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-300 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-500" />
                    <span>Stateless Session Established</span>
                  </div>
                  <p>User receives {statelessMode === 'jwt' ? 'signed JWT token' : 'session ID backed by shared Redis cluster'}. Any server in the fleet can process subsequent requests.</p>
                </div>
              )}

              {statelessStep >= 2 && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>200 OK • Seamless Server Switch & Failover!</span>
                  </div>
                  <p>Server 2 handled the request seamlessly with zero session loss! The client experienced zero errors or interruptions.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">Stateless Superpowers:</span>
            <p>• Infinite horizontal scaling: Add/remove 100s of nodes instantly.</p>
            <p>• Zero downtime rolling deploys without terminating sessions.</p>
            <p>• Instant fault tolerance when server hardware dies.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

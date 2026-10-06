import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layers,
  Send,
  Play,
  Pause,
  Plus,
  Trash2,
  RefreshCw,
  Cpu,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  Clock,
  Server,
  AlertTriangle
} from 'lucide-react';
import { SAMPLE_MESSAGE_TEMPLATES } from '../../data/msgQueueData';

export function QueueArchitectureSimulator({ onCompleteStep, isCompleted }) {
  const [queue, setQueue] = useState([
    { id: 'msg_101', type: 'ORDER_CONFIRMATION', name: 'Order Confirmation #101', duration: 1600, priority: 'HIGH', enqueuedAt: '10:00:01' },
    { id: 'msg_102', type: 'INVOICE_PDF', name: 'PDF Tax Invoice #102', duration: 1200, priority: 'NORMAL', enqueuedAt: '10:00:02' },
    { id: 'msg_103', type: 'VIDEO_TRANSCODE', name: 'Video 1080p #103', duration: 2400, priority: 'NORMAL', enqueuedAt: '10:00:03' },
  ]);

  const [workers, setWorkers] = useState([
    { id: 'worker_1', name: 'Worker 1 (Node A)', status: 'idle', currentMsg: null, progress: 0, completedCount: 2 },
    { id: 'worker_2', name: 'Worker 2 (Node B)', status: 'idle', currentMsg: null, progress: 0, completedCount: 1 },
    { id: 'worker_3', name: 'Worker 3 (Node C)', status: 'idle', currentMsg: null, progress: 0, completedCount: 0 },
  ]);

  const [isProcessing, setIsProcessing] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('ORDER_CONFIRMATION');
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5, 1, 2
  const [autoProduce, setAutoProduce] = useState(false);
  const [metrics, setMetrics] = useState({
    totalProduced: 6,
    totalCompleted: 3,
    avgWaitMs: 380,
    avgProcessMs: 1600,
  });

  const [eventLogs, setEventLogs] = useState([
    { id: 1, time: '10:00:00', type: 'system', text: 'Message broker initialized with 3 active consumers.' },
  ]);

  const msgCounterRef = useRef(104);
  const queueCapacity = 20;

  const addLog = (type, text) => {
    const time = new Date().toLocaleTimeString();
    setEventLogs((prev) => [{ id: Date.now() + Math.random(), time, type, text }, ...prev.slice(0, 15)]);
  };

  // Produce 1 message
  const handleProduceOne = useCallback((templateKey = selectedTemplate) => {
    setQueue((prevQueue) => {
      if (prevQueue.length >= queueCapacity) {
        addLog('warn', `⚠️ [QUEUE FULL] Capacity limit (${queueCapacity}) reached! Rejecting message.`);
        return prevQueue;
      }

      const tpl = SAMPLE_MESSAGE_TEMPLATES.find((t) => t.type === templateKey) || SAMPLE_MESSAGE_TEMPLATES[0];
      const newId = `msg_${msgCounterRef.current++}`;
      const newMsg = {
        id: newId,
        type: tpl.type,
        name: `${tpl.name} #${newId.slice(-3)}`,
        duration: Math.round(tpl.defaultDuration / speedMultiplier),
        priority: tpl.priority,
        enqueuedAt: new Date().toLocaleTimeString(),
      };

      setMetrics((prev) => ({ ...prev, totalProduced: prev.totalProduced + 1 }));
      addLog('enqueue', `[PRODUCED] ${newMsg.name} enqueued into FIFO buffer (${prevQueue.length + 1} in queue).`);
      return [...prevQueue, newMsg];
    });
  }, [selectedTemplate, speedMultiplier]);

  // Produce Batch (5)
  const handleProduceBatch = () => {
    const countToAdd = Math.min(5, queueCapacity - queue.length);
    if (countToAdd <= 0) {
      addLog('warn', `⚠️ [QUEUE FULL] Cannot produce batch.`);
      return;
    }

    const newMsgs = [];
    for (let i = 0; i < countToAdd; i++) {
      const tpl = SAMPLE_MESSAGE_TEMPLATES[i % SAMPLE_MESSAGE_TEMPLATES.length];
      const newId = `msg_${msgCounterRef.current++}`;
      newMsgs.push({
        id: newId,
        type: tpl.type,
        name: `${tpl.name} #${newId.slice(-3)}`,
        duration: Math.round(tpl.defaultDuration / speedMultiplier),
        priority: tpl.priority,
        enqueuedAt: new Date().toLocaleTimeString(),
      });
    }

    setQueue((prev) => [...prev, ...newMsgs]);
    setMetrics((prev) => ({ ...prev, totalProduced: prev.totalProduced + countToAdd }));
    addLog('enqueue', `[BURST] Ingested batch of ${countToAdd} messages.`);
  };

  // Auto produce ticker
  useEffect(() => {
    if (!autoProduce) return;
    const interval = setInterval(() => {
      handleProduceOne();
    }, 1800);
    return () => clearInterval(interval);
  }, [autoProduce, handleProduceOne]);

  // Worker dispatch loop
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setWorkers((prevWorkers) => {
        let updatedQueue = [...queue];

        const nextWorkers = prevWorkers.map((worker) => {
          // If worker is busy, advance progress
          if (worker.status === 'busy' && worker.currentMsg) {
            const stepIncrement = (100 / (worker.currentMsg.duration / 100)) * speedMultiplier;
            const nextProgress = worker.progress + stepIncrement;

            if (nextProgress >= 100) {
              // Message Completed
              addLog(
                'complete',
                `✓ [ACK] ${worker.name} finished & ACKed ${worker.currentMsg.name}.`
              );
              setMetrics((m) => ({ ...m, totalCompleted: m.totalCompleted + 1 }));

              return {
                ...worker,
                status: 'idle',
                currentMsg: null,
                progress: 0,
                completedCount: worker.completedCount + 1,
              };
            }

            return {
              ...worker,
              progress: Math.min(99, nextProgress),
            };
          }

          // If worker is idle, attempt to consume from queue
          if (worker.status === 'idle' && updatedQueue.length > 0) {
            const nextMsg = updatedQueue.shift();
            addLog(
              'consume',
              `⚡ [PULL] ${worker.name} picked up ${nextMsg.name} from FIFO queue.`
            );

            return {
              ...worker,
              status: 'busy',
              currentMsg: nextMsg,
              progress: 0,
            };
          }

          return worker;
        });

        // Update queue state if items were consumed
        if (updatedQueue.length !== queue.length) {
          setQueue(updatedQueue);
        }

        return nextWorkers;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isProcessing, queue, speedMultiplier]);

  // Add Worker
  const handleAddWorker = () => {
    if (workers.length >= 6) return;
    const newIdx = workers.length + 1;
    const newWorker = {
      id: `worker_${Date.now().toString().slice(-4)}`,
      name: `Worker ${newIdx} (Node ${String.fromCharCode(64 + newIdx)})`,
      status: 'idle',
      currentMsg: null,
      progress: 0,
      completedCount: 0,
    };
    setWorkers((prev) => [...prev, newWorker]);
    addLog('system', `Scaled out consumer pool: spawned ${newWorker.name}.`);
  };

  // Remove Worker
  const handleRemoveWorker = (id) => {
    if (workers.length <= 1) return;
    const target = workers.find((w) => w.id === id);
    if (target?.currentMsg) {
      // Requeue in-flight message back to queue
      setQueue((prev) => [target.currentMsg, ...prev]);
      addLog('warn', `⚠️ [RE-QUEUED] ${target.name} terminated mid-task; ${target.currentMsg.name} returned to queue.`);
    }
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    addLog('system', `Scaled in consumer pool: decommissioned worker ${id}.`);
  };

  // Clear queue
  const handlePurgeQueue = () => {
    setQueue([]);
    addLog('warn', '🚨 Purged all messages from FIFO queue buffer.');
  };

  const activeWorkerCount = workers.filter((w) => w.status === 'busy').length;
  const workerUtilization = Math.round((activeWorkerCount / workers.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Interactive Lab • Step 2 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Queue Architecture &amp; Worker Pool Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Simulate high-concurrency event publishing, FIFO message queues, backpressure buffering, and worker pool consumer threads. Scale worker instances in real-time to clear task backlogs.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsProcessing(!isProcessing)}
              className={`text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isProcessing
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isProcessing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isProcessing ? 'Pause Dispatcher' : 'Resume Dispatcher'}
            </button>

            <button
              onClick={handlePurgeQueue}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Purge
            </button>
          </div>
        </div>
      </div>

      {/* 2. Producer Control Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Message Producer Station
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Publish structured tasks into the distributed queue buffer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B101D] text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={autoProduce}
                onChange={(e) => setAutoProduce(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="font-semibold text-purple-700 dark:text-purple-300">Auto-Generate Traffic</span>
            </label>

            <button
              onClick={() => handleProduceOne(selectedTemplate)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Publish 1 Msg
            </button>

            <button
              onClick={handleProduceBatch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" /> Burst Traffic (+5)
            </button>
          </div>
        </div>

        {/* Template Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {SAMPLE_MESSAGE_TEMPLATES.map((tpl) => (
            <button
              key={tpl.type}
              onClick={() => setSelectedTemplate(tpl.type)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedTemplate === tpl.type
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-900 dark:text-purple-100 shadow-xs'
                  : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-xs truncate">{tpl.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between mt-1 font-mono">
                <span>{tpl.defaultDuration}ms</span>
                <span className="font-bold uppercase text-[9px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {tpl.priority}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Stage: FIFO Queue Buffer (Left) + Consumer Worker Pool (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: FIFO Buffer (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">FIFO Message Buffer</h3>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
              {queue.length} / {queueCapacity} Messages
            </span>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  queue.length > 15 ? 'bg-rose-500' : queue.length > 8 ? 'bg-amber-500' : 'bg-purple-600'
                }`}
                style={{ width: `${(queue.length / queueCapacity) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>HEAD (Next to Consume)</span>
              <span>TAIL (Latest Ingested)</span>
            </div>
          </div>

          {/* Queue Items Stack */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 font-mono text-xs custom-scrollbar">
            {queue.length > 0 ? (
              queue.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    idx === 0
                      ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800 text-purple-950 dark:text-purple-100 font-semibold'
                      : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{msg.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[10px]">
                    <span className="text-slate-400">{msg.duration}ms</span>
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      {msg.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                Queue is empty. Publish tasks above to start the pipeline.
              </div>
            )}
          </div>
        </div>

        {/* Right: Worker Pool (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Consumer Worker Pool ({workers.length} Nodes)
              </h3>
            </div>

            <button
              onClick={handleAddWorker}
              disabled={workers.length >= 6}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Scale Worker (+1)
            </button>
          </div>

          {/* Workers Grid */}
          <div className="space-y-3">
            {workers.map((w) => {
              const isBusy = w.status === 'busy';

              return (
                <div
                  key={w.id}
                  className={`p-4 rounded-2xl border transition-all shadow-xs space-y-2.5 ${
                    isBusy
                      ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800/80'
                      : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isBusy
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{w.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          ACKed: <strong className="text-emerald-600 dark:text-emerald-400">{w.completedCount}</strong> msgs
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        isBusy
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}>
                        {isBusy ? 'PROCESSING' : 'IDLE'}
                      </span>

                      {workers.length > 1 && (
                        <button
                          onClick={() => handleRemoveWorker(w.id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Decommission worker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task Progress Bar */}
                  {isBusy && w.currentMsg ? (
                    <div className="space-y-1 pt-1 font-mono text-[11px]">
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span className="truncate max-w-[200px]">{w.currentMsg.name}</span>
                        <span>{Math.round(w.progress)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-100"
                          style={{ width: `${w.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 font-mono">
                      Awaiting message from broker...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Live Metrics & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Metrics (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Queue Performance Telemetry
          </h4>

          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Produced</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{metrics.totalProduced}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Completed (ACK)</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{metrics.totalCompleted}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Worker Utilization</div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400 font-mono">{workerUtilization}%</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Backlog Pressure</div>
              <div className={`text-lg font-bold font-mono ${queue.length > 10 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                {queue.length} pending
              </div>
            </div>
          </div>
        </div>

        {/* Live Broker Event Log (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Live Broker Activity Stream
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Stream Log</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1 custom-scrollbar">
            {eventLogs.map((log) => {
              let logColor = 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#0B101D]';
              if (log.type === 'enqueue') logColor = 'text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20';
              else if (log.type === 'consume') logColor = 'text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950/20';
              else if (log.type === 'complete') logColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20';
              else if (log.type === 'warn') logColor = 'text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20';

              return (
                <div key={log.id} className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-start gap-2 ${logColor}`}>
                  <span className="text-[10px] opacity-70 shrink-0 font-mono">{log.time}</span>
                  <span className="break-all">{log.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
          <div>
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
              Step 2: Queue Simulator Completed
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              Ready to explore Retries, Exponential Backoff, and Dead-Letter Queues (DLQ)?
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
        >
          <span>Proceed to Retries &amp; DLQ Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default QueueArchitectureSimulator;

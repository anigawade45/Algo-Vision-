import { useState, useEffect, useRef, useCallback } from 'react';
import { Package, Play, Pause, RotateCcw, Plus, Minus, Box } from 'lucide-react';

export const ProducerConsumerSimulator = () => {
  const [bufferSize, setBufferSize] = useState(5);
  const [buffer, setBuffer] = useState([]); // Array of items, e.g. [{ id: 1, val: 'Item #1' }]
  const [itemsProducedCount, setItemsProducedCount] = useState(0);
  const [itemsConsumedCount, setItemsConsumedCount] = useState(0);

  // Classic Semaphores
  const [mutex, setMutex] = useState(1);
  const [producerState, setProducerState] = useState('READY'); // READY, PRODUCING, WAITING_FULL, BLOCKED_MUTEX
  const [consumerState, setConsumerState] = useState('READY'); // READY, CONSUMING, WAITING_EMPTY, BLOCKED_MUTEX

  const [logs, setLogs] = useState(['Producer-Consumer Bounded Buffer Simulator ready.']);
  const [isRunning, setIsRunning] = useState(false);
  const [autoMode, setAutoMode] = useState('balanced'); // balanced, producer_fast, consumer_fast
  const timerRef = useRef(null);

  const emptySlots = bufferSize - buffer.length;
  const fullSlots = buffer.length;

  const handleBufferSizeChange = (size) => {
    const newSize = Math.max(3, Math.min(8, size));
    setBufferSize(newSize);
    handleReset();
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setBuffer([]);
    setItemsProducedCount(0);
    setItemsConsumedCount(0);
    setMutex(1);
    setProducerState('READY');
    setConsumerState('READY');
    setLogs(['Buffer cleared and semaphores reset.']);
  };

  // Produce Operation
  const handleProduce = useCallback(() => {
    if (buffer.length >= bufferSize) {
      setProducerState('WAITING_FULL');
      setLogs(prev => ['[BUFFER FULL] Producer attempted wait(empty) -> empty = 0! Producer is BLOCKED until consumer removes an item.', ...prev]);
      return false;
    }

    if (mutex === 0) {
      setProducerState('BLOCKED_MUTEX');
      setLogs(prev => ['[MUTEX LOCKED] Producer attempted wait(mutex) -> mutex = 0! Producer waiting for mutex lock.', ...prev]);
      return false;
    }

    setMutex(0);
    setProducerState('PRODUCING');
    const newItemId = itemsProducedCount + 1;
    const newItem = { id: newItemId, val: `Item #${newItemId}`, time: new Date().toLocaleTimeString() };

    setTimeout(() => {
      setBuffer(prev => [...prev, newItem]);
      setItemsProducedCount(prev => prev + 1);
      setMutex(1);
      setProducerState('READY');
      setLogs(prev => [`[PRODUCED] Item #${newItemId} added to buffer. empty = ${bufferSize - (buffer.length + 1)}, full = ${buffer.length + 1}.`, ...prev]);
    }, 300);

    return true;
  }, [buffer.length, bufferSize, mutex, itemsProducedCount]);

  // Consume Operation
  const handleConsume = useCallback(() => {
    if (buffer.length === 0) {
      setConsumerState('WAITING_EMPTY');
      setLogs(prev => ['[BUFFER EMPTY] Consumer attempted wait(full) -> full = 0! Consumer is BLOCKED until producer inserts an item.', ...prev]);
      return false;
    }

    if (mutex === 0) {
      setConsumerState('BLOCKED_MUTEX');
      setLogs(prev => ['[MUTEX LOCKED] Consumer attempted wait(mutex) -> mutex = 0! Consumer waiting for mutex lock.', ...prev]);
      return false;
    }

    setMutex(0);
    setConsumerState('CONSUMING');

    setTimeout(() => {
      setBuffer(prev => {
        const [, ...remaining] = prev;
        return remaining;
      });
      setItemsConsumedCount(prev => prev + 1);
      setMutex(1);
      setConsumerState('READY');
      setLogs(prev => [`[CONSUMED] First item in buffer removed. empty = ${bufferSize - (buffer.length - 1)}, full = ${buffer.length - 1}.`, ...prev]);
    }, 300);

    return true;
  }, [buffer.length, bufferSize, mutex]);

  // Auto Run loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (autoMode === 'balanced') {
          if (Math.random() > 0.5) handleProduce();
          else handleConsume();
        } else if (autoMode === 'producer_fast') {
          if (Math.random() > 0.3) handleProduce();
          else handleConsume();
        } else {
          if (Math.random() > 0.3) handleConsume();
          else handleProduce();
        }
      }, 1200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, autoMode, handleProduce, handleConsume]);

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Producer-Consumer Bounded Buffer</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Classic multi-process synchronization problem using empty, full, and mutex semaphores</p>
            </div>
          </div>

          {/* Buffer Capacity Adjuster */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">Buffer Capacity:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleBufferSizeChange(bufferSize - 1)}
                className="p-1 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1 font-mono font-extrabold text-sm text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded">
                {bufferSize} Slots
              </span>
              <button
                onClick={() => handleBufferSizeChange(bufferSize + 1)}
                className="p-1 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls & Mode selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleProduce}
              disabled={isRunning}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Produce Item</span>
            </button>

            <button
              onClick={handleConsume}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
              <span>Consume Item</span>
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause Auto Run' : 'Auto Run'}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span>Auto Speed Pattern:</span>
            <select
              value={autoMode}
              onChange={(e) => setAutoMode(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="balanced">50/50 Balanced</option>
              <option value="producer_fast">Fast Producer (Test Full Buffer)</option>
              <option value="consumer_fast">Fast Consumer (Test Empty Buffer)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Semaphore & Buffer Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-4 rounded-2xl text-center shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semaphore empty</span>
          <div className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400 my-1">{emptySlots}</div>
          <span className="text-[10px] text-slate-500 font-mono">Unoccupied Buffer Slots</span>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-4 rounded-2xl text-center shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semaphore full</span>
          <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 my-1">{fullSlots}</div>
          <span className="text-[10px] text-slate-500 font-mono">Occupied Buffer Slots</span>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-4 rounded-2xl text-center shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semaphore mutex</span>
          <div className={`text-2xl font-mono font-extrabold my-1 ${mutex === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {mutex} ({mutex === 1 ? 'UNLOCKED' : 'LOCKED'})
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Binary Lock State</span>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-4 rounded-2xl text-center shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Buffer Occupancy</span>
          <div className="text-2xl font-mono font-extrabold text-amber-600 dark:text-amber-400 my-1">
            {Math.round((buffer.length / bufferSize) * 100)}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {buffer.length} / {bufferSize} Items
          </span>
        </div>
      </div>

      {/* Main Bounded Buffer Visualization Arena */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Producer Process Box */}
          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center transition-all ${
            producerState === 'PRODUCING'
              ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 shadow-md'
              : producerState === 'WAITING_FULL'
              ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300'
              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300'
          }`}>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-2">
              <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-mono font-bold text-base">PRODUCER PROCESS</h3>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold uppercase mt-2 border ${
              producerState === 'PRODUCING'
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 animate-pulse'
                : producerState === 'WAITING_FULL'
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}>
              State: {producerState}
            </span>

            {producerState === 'WAITING_FULL' && (
              <div className="mt-3 p-2 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 rounded-lg text-xs font-mono text-amber-900 dark:text-amber-300">
                BUFFER FULL: Producer must wait!
              </div>
            )}

            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-3">
              Total Produced: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{itemsProducedCount}</span>
            </div>
          </div>

          {/* Central Bounded Buffer Visual Slots */}
          <div className="bg-slate-50 dark:bg-slate-950/90 border border-amber-500/30 rounded-2xl p-5 text-center shadow-sm">
            <div className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <Box className="w-4 h-4" />
              <span>Bounded Buffer ({buffer.length} / {bufferSize})</span>
            </div>

            {/* Slots Row */}
            <div className="grid grid-cols-5 md:grid-cols-5 gap-2 my-4">
              {Array.from({ length: bufferSize }).map((_, idx) => {
                const item = buffer[idx];
                const isFilled = !!item;

                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      isFilled
                        ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-300 shadow-sm scale-105'
                        : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600 border-dashed'
                    }`}
                  >
                    <span className="text-[9px] font-mono opacity-60">[{idx}]</span>
                    {isFilled ? (
                      <span className="font-mono font-extrabold text-xs text-amber-700 dark:text-amber-400">{item.val}</span>
                    ) : (
                      <span className="font-mono text-xs opacity-40">EMPTY</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Edge Case Warning Banners */}
            {buffer.length >= bufferSize && (
              <div className="p-2.5 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 rounded-xl text-xs font-mono text-amber-900 dark:text-amber-300 font-bold animate-pulse">
                BUFFER FULL (empty = 0): Producer blocked on wait(empty)
              </div>
            )}
            {buffer.length === 0 && (
              <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 rounded-xl text-xs font-mono text-blue-900 dark:text-blue-300 font-bold animate-pulse">
                BUFFER EMPTY (full = 0): Consumer blocked on wait(full)
              </div>
            )}
          </div>

          {/* Consumer Process Box */}
          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center transition-all ${
            consumerState === 'CONSUMING'
              ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/40 text-blue-900 dark:text-blue-300 shadow-md'
              : consumerState === 'WAITING_EMPTY'
              ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300'
              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300'
          }`}>
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-full mb-2">
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-mono font-bold text-base">CONSUMER PROCESS</h3>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold uppercase mt-2 border ${
              consumerState === 'CONSUMING'
                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/40 animate-pulse'
                : consumerState === 'WAITING_EMPTY'
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}>
              State: {consumerState}
            </span>

            {consumerState === 'WAITING_EMPTY' && (
              <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 rounded-lg text-xs font-mono text-blue-900 dark:text-blue-300">
                BUFFER EMPTY: Consumer must wait!
              </div>
            )}

            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-3">
              Total Consumed: <span className="text-blue-600 dark:text-blue-400 font-bold">{itemsConsumedCount}</span>
            </div>
          </div>
        </div>

        {/* Algorithm Pseudocode Step Highlights & Logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pseudocode Timeline Cards */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Semaphore Synchronization Pseudocode</h4>

            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
              {/* Producer Code */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-slate-700 dark:text-slate-300">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-1">Producer Timeline</div>
                <div>wait(empty);</div>
                <div>wait(mutex);</div>
                <div className="text-amber-600 dark:text-amber-400 font-bold">// insert item</div>
                <div>signal(mutex);</div>
                <div>signal(full);</div>
              </div>

              {/* Consumer Code */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-slate-700 dark:text-slate-300">
                <div className="text-blue-600 dark:text-blue-400 font-bold mb-1">Consumer Timeline</div>
                <div>wait(full);</div>
                <div>wait(mutex);</div>
                <div className="text-amber-600 dark:text-amber-400 font-bold">// remove item</div>
                <div>signal(mutex);</div>
                <div>signal(empty);</div>
              </div>
            </div>
          </div>

          {/* Execution Log */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 mb-2">Producer-Consumer Operation Log</div>
            <div className="space-y-1.5 font-mono text-xs max-h-36 overflow-y-auto">
              {logs.map((lg, i) => (
                <div key={i} className={`p-1.5 rounded-lg text-[11px] leading-relaxed ${
                  lg.includes('PRODUCED') ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20' :
                  lg.includes('CONSUMED') ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20' :
                  lg.includes('FULL') || lg.includes('EMPTY') ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20' :
                  'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}>
                  {lg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

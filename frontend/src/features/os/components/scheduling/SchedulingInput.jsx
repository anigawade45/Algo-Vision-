import { Plus, Trash2, Play } from 'lucide-react';

export default function SchedulingInput({ processes, setProcesses, onSimulate, selectedAlgorithm, timeQuantum = 2, setTimeQuantum }) {
  const handleInputChange = (id, field, value) => {
    const updated = processes.map((p) => {
      if (p.id === id) {
        // Enforce valid bounds
        let parsed = Number(value) || 0;
        if (field === 'burstTime') {
          parsed = Math.max(1, parsed); // burst time >= 1
        } else {
          parsed = Math.max(0, parsed); // arrival & priority >= 0
        }
        return { ...p, [field]: parsed };
      }
      return p;
    });
    setProcesses(updated);
  };

  const handleAddProcess = () => {
    // Generate next ID
    const maxNum = processes.reduce((max, p) => {
      const num = parseInt(p.id.replace('P', ''), 10);
      return !isNaN(num) ? Math.max(max, num) : max;
    }, 0);
    const nextId = `P${maxNum + 1}`;

    const newProc = {
      id: nextId,
      arrivalTime: 0,
      burstTime: 3,
      priority: 0,
    };
    setProcesses([...processes, newProc]);
  };

  const handleRemoveProcess = (id) => {
    if (processes.length <= 1) {
      alert("At least one process is required for simulation!");
      return;
    }
    setProcesses(processes.filter((p) => p.id !== id));
  };

  const showQuantum = selectedAlgorithm === 'RR' || selectedAlgorithm === 'MLQ';
  const showPriorityNote = selectedAlgorithm === 'Priority' || selectedAlgorithm === 'MLQ';

  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Processes List</h3>
        <button
          onClick={handleAddProcess}
          className="px-2.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Process</span>
        </button>
      </div>

      {showQuantum && setTimeQuantum && (
        <div className="p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
          <label className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
            Time Quantum (Q):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="20"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 px-2 py-1 text-center border border-blue-300 dark:border-blue-500/40 rounded-lg bg-white dark:bg-[#070A12] text-slate-800 dark:text-slate-200 font-mono text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 font-mono">ms</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1E2638] text-slate-500 font-semibold">
              <th className="py-2.5 px-2">ID</th>
              <th className="py-2.5 px-2">Arrival Time</th>
              <th className="py-2.5 px-2">Burst Time</th>
              <th className="py-2.5 px-2">
                Priority
                <span className="text-[9px] font-normal text-slate-400 block">
                  {showPriorityNote ? '(Lower = Higher)' : '(Ignored)'}
                </span>
              </th>
              <th className="py-2.5 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638]/50">
            {processes.map((proc) => (
              <tr key={proc.id} className="hover:bg-slate-50/30 dark:hover:bg-[#080B13]/10">
                <td className="py-2.5 px-2 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {proc.id}
                </td>
                <td className="py-2.5 px-2">
                  <input
                    type="number"
                    min="0"
                    value={proc.arrivalTime}
                    onChange={(e) => handleInputChange(proc.id, 'arrivalTime', e.target.value)}
                    className="w-18 px-2 py-1 border border-slate-200 dark:border-[#1E2638] rounded-md bg-slate-50 dark:bg-[#070A12] text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </td>
                <td className="py-2.5 px-2">
                  <input
                    type="number"
                    min="1"
                    value={proc.burstTime}
                    onChange={(e) => handleInputChange(proc.id, 'burstTime', e.target.value)}
                    className="w-18 px-2 py-1 border border-slate-200 dark:border-[#1E2638] rounded-md bg-slate-50 dark:bg-[#070A12] text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </td>
                <td className="py-2.5 px-2">
                  <input
                    type="number"
                    min="0"
                    value={proc.priority}
                    onChange={(e) => handleInputChange(proc.id, 'priority', e.target.value)}
                    className="w-18 px-2 py-1 border border-slate-200 dark:border-[#1E2638] rounded-md bg-slate-50 dark:bg-[#070A12] text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </td>
                <td className="py-2.5 px-2 text-center">
                  <button
                    onClick={() => handleRemoveProcess(proc.id)}
                    className="p-1 rounded text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={onSimulate}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-500/15"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>SIMULATE {selectedAlgorithm}</span>
      </button>
    </div>
  );
}

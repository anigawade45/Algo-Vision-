import { useState, useMemo } from 'react';
import {
  Search,
  Key,
  Plus,
  Trash2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  ArrowRight,
  Database
} from 'lucide-react';
import { INITIAL_INDEXING_RECORDS } from '../../data/dbScalingData';

export function DbIndexingSimulator({ onCompleteStep, isCompleted }) {
  const [records, setRecords] = useState(INITIAL_INDEXING_RECORDS);
  const [activeIndexes, setActiveIndexes] = useState({
    id: true,
    email: false,
    city: false,
  });
  const [searchField, setSearchField] = useState('email');
  const [searchValue, setSearchValue] = useState('charlie@web.org');
  const [searchStatus, setSearchStatus] = useState(null); // null, 'scanning', 'completed'
  const [scannedRowIndex, setScannedRowIndex] = useState(-1);
  const [matchedIds, setMatchedIds] = useState([]);
  const [lastQueryStats, setLastQueryStats] = useState(null);
  const [isInserting, setIsInserting] = useState(false);
  const [newRowName, setNewRowName] = useState('');
  const [newRowEmail, setNewRowEmail] = useState('');
  const [newRowCity, setNewRowCity] = useState('Austin');

  const hasIndexOnField = activeIndexes[searchField] || false;

  // Pre-calculated B-Tree simulated index nodes for active indexed fields
  const btreeIndexes = useMemo(() => {
    const indexes = {};
    if (activeIndexes.email) {
      const sorted = [...records].sort((a, b) => a.email.localeCompare(b.email));
      indexes.email = sorted.map((r) => ({ key: r.email, rowId: r.id }));
    }
    if (activeIndexes.city) {
      const sorted = [...records].sort((a, b) => a.city.localeCompare(b.city));
      indexes.city = sorted.map((r) => ({ key: r.city, rowId: r.id }));
    }
    if (activeIndexes.id) {
      const sorted = [...records].sort((a, b) => a.id - b.id);
      indexes.id = sorted.map((r) => ({ key: r.id, rowId: r.id }));
    }
    return indexes;
  }, [records, activeIndexes]);

  const toggleIndex = (field) => {
    setActiveIndexes((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setLastQueryStats(null);
  };

  const handleRunSearch = () => {
    if (!searchValue.trim()) return;
    setSearchStatus('scanning');
    setMatchedIds([]);
    setScannedRowIndex(-1);

    const isIndexed = activeIndexes[searchField];
    const targetVal = searchValue.toLowerCase().trim();

    if (isIndexed) {
      // Indexed B-Tree search simulation: O(log N)
      setTimeout(() => {
        const matches = records.filter((r) =>
          String(r[searchField]).toLowerCase() === targetVal
        );
        const matchIds = matches.map((m) => m.id);
        setMatchedIds(matchIds);
        setScannedRowIndex(-1);
        setSearchStatus('completed');
        setLastQueryStats({
          method: 'Index Scan (B-Tree)',
          indexed: true,
          rowsTotal: records.length,
          rowsExamined: matches.length > 0 ? matches.length : 1,
          pagesRead: Math.max(1, Math.ceil(Math.log2(records.length))),
          latencyMs: (1.2 + Math.random() * 0.8).toFixed(1),
          treeDepth: 2,
          algorithm: 'O(log N) Binary/B-Tree Traversal',
          matchedCount: matches.length,
        });
      }, 350);
    } else {
      // Full Table Scan simulation: O(N) sequential scan
      let currentIdx = 0;
      const foundIds = [];
      const interval = setInterval(() => {
        if (currentIdx < records.length) {
          setScannedRowIndex(currentIdx);
          const currentRow = records[currentIdx];
          if (String(currentRow[searchField]).toLowerCase() === targetVal) {
            foundIds.push(currentRow.id);
          }
          currentIdx++;
        } else {
          clearInterval(interval);
          setMatchedIds(foundIds);
          setSearchStatus('completed');
          setLastQueryStats({
            method: 'Sequential Scan (Full Table Scan)',
            indexed: false,
            rowsTotal: records.length,
            rowsExamined: records.length,
            pagesRead: Math.ceil(records.length / 2),
            latencyMs: (65.0 + records.length * 2.5 + Math.random() * 10).toFixed(1),
            treeDepth: 0,
            algorithm: 'O(N) Sequential Linear Scan',
            matchedCount: foundIds.length,
          });
        }
      }, 120);
    }
  };

  const handleInsertRow = (e) => {
    e.preventDefault();
    if (!newRowName || !newRowEmail) return;
    const nextId = Math.max(...records.map((r) => r.id), 100) + 1;
    const newRecord = {
      id: nextId,
      name: newRowName,
      email: newRowEmail,
      city: newRowCity,
      department: 'General',
      salary: 130000,
    };
    setRecords((prev) => [...prev, newRecord]);
    setNewRowName('');
    setNewRowEmail('');
    setIsInserting(false);
  };

  const handleDeleteRow = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setMatchedIds((prev) => prev.filter((mid) => mid !== id));
  };

  const activeIndexCount = Object.values(activeIndexes).filter(Boolean).length;
  const writeCostMultiplier = (1 + activeIndexCount * 1.2).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Section Header */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
                <Search className="w-3.5 h-3.5" />
                <span>Interactive Lab • Step 2 of 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Database Indexing &amp; B-Tree Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Experience the stark contrast between a slow <strong className="text-slate-900 dark:text-white">Sequential Full Table Scan O(N)</strong> and a high-speed <strong className="text-purple-600 dark:text-purple-400 font-semibold">B-Tree Index Lookup O(log N)</strong>. Toggle indexes on and off to observe query acceleration and write penalty trade-offs.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 self-start md:self-auto shrink-0 shadow-xs">
            <HardDrive className="w-8 h-8 text-purple-600 dark:text-purple-400 shrink-0" />
            <div className="text-xs">
              <div className="text-slate-500 dark:text-slate-400">Active Indexes</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">{activeIndexCount} / 3 Fields</div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Write Penalty: {writeCostMultiplier}x cost
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Index Configuration & Query Controls */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Manage Secondary B-Tree Indexes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click to toggle B-Tree index creation on table columns in real time.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => toggleIndex('id')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeIndexes.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              INDEX on `id` (PK Clustered)
              <span className="text-[10px] opacity-80 font-mono">{activeIndexes.id ? 'ACTIVE' : 'OFF'}</span>
            </button>

            <button
              onClick={() => toggleIndex('email')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeIndexes.email
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              INDEX on `email` (B-Tree Unique)
              <span className="text-[10px] opacity-80 font-mono">{activeIndexes.email ? 'ACTIVE' : 'OFF'}</span>
            </button>

            <button
              onClick={() => toggleIndex('city')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeIndexes.city
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              INDEX on `city` (B-Tree Non-Unique)
              <span className="text-[10px] opacity-80 font-mono">{activeIndexes.city ? 'ACTIVE' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Query Formulation & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Search Column:
            </label>
            <select
              value={searchField}
              onChange={(e) => {
                const field = e.target.value;
                setSearchField(field);
                if (field === 'email') setSearchValue('charlie@web.org');
                else if (field === 'city') setSearchValue('Austin');
                else if (field === 'id') setSearchValue('107');
                else setSearchValue('Diana Prince');
                setLastQueryStats(null);
              }}
              className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B101D] px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="email">email (Unique)</option>
              <option value="city">city (Non-Unique)</option>
              <option value="id">id (Primary Key)</option>
              <option value="name">name (Unindexed)</option>
            </select>
          </div>

          <div className="md:col-span-5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Target Value:
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="e.g. charlie@web.org or Austin"
              className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B101D] px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <button
              onClick={handleRunSearch}
              disabled={searchStatus === 'scanning'}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              {searchStatus === 'scanning' ? 'Executing Query...' : 'Execute SELECT Query'}
            </button>

            <button
              onClick={() => setIsInserting(!isInserting)}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold py-2.5 px-3.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              title="Insert new record to test write overhead"
            >
              <Plus className="w-3.5 h-3.5" />
              Insert
            </button>
          </div>
        </div>

        {/* Index Status Banner for chosen query */}
        <div className="flex items-center gap-2 text-xs py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
          <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span className="text-slate-600 dark:text-slate-400">
            Execution Planner:{' '}
            <strong className="text-slate-900 dark:text-white font-mono">
              SELECT * FROM employees WHERE {searchField} = &apos;{searchValue}&apos;
            </strong>
          </span>
          <span
            className={`ml-auto font-bold px-2.5 py-0.5 rounded-full text-[11px] border ${
              hasIndexOnField
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}
          >
            {hasIndexOnField ? '⚡ Index Scan Available' : '⚠️ Sequential Full Table Scan'}
          </span>
        </div>
      </div>

      {/* Insert Modal / Form */}
      {isInserting && (
        <form
          onSubmit={handleInsertRow}
          className="rounded-3xl bg-white dark:bg-[#111827] border border-purple-300 dark:border-purple-800 p-6 shadow-md space-y-3 animate-in fade-in"
        >
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Insert Record (Simulates write overhead to heap table + active B-Tree indexes)</span>
            <button
              type="button"
              onClick={() => setIsInserting(false)}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Full Name (e.g. Kevin Vance)"
              value={newRowName}
              onChange={(e) => setNewRowName(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50 dark:bg-[#0B101D] text-slate-900 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Email (e.g. kevin@corp.io)"
              value={newRowEmail}
              onChange={(e) => setNewRowEmail(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50 dark:bg-[#0B101D] text-slate-900 dark:text-white"
              required
            />
            <select
              value={newRowCity}
              onChange={(e) => setNewRowCity(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50 dark:bg-[#0B101D] text-slate-900 dark:text-white"
            >
              <option value="Austin">Austin</option>
              <option value="San Francisco">San Francisco</option>
              <option value="New York">New York</option>
              <option value="Seattle">Seattle</option>
              <option value="London">London</option>
              <option value="Tokyo">Tokyo</option>
            </select>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer"
            >
              Commit INSERT ({1 + activeIndexCount} writes)
            </button>
          </div>
        </form>
      )}

      {/* 3. Main Simulation View: 2 Columns (Table Data + Query Execution / B-Tree Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Table View with Disk Pages */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                `employees` Physical Table Data ({records.length} Rows)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Heap Pages: {Math.ceil(records.length / 3)}
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">
                    <span className="flex items-center gap-1">
                      ID {activeIndexes.id && <Key className="w-3 h-3 text-purple-500" />}
                    </span>
                  </th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">
                    <span className="flex items-center gap-1">
                      Email {activeIndexes.email && <Key className="w-3 h-3 text-purple-500" />}
                    </span>
                  </th>
                  <th className="py-2.5 px-3">
                    <span className="flex items-center gap-1">
                      City {activeIndexes.city && <Key className="w-3 h-3 text-purple-500" />}
                    </span>
                  </th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {records.map((r, idx) => {
                  const isScanned = scannedRowIndex === idx;
                  const isMatched = matchedIds.includes(r.id);

                  let rowBg = 'bg-white dark:bg-[#111827]';
                  if (isMatched) {
                    rowBg = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium';
                  } else if (isScanned) {
                    rowBg = 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100 animate-pulse';
                  }

                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors duration-150 ${rowBg}`}
                    >
                      <td className="py-2.5 px-3 font-mono text-[11px] font-bold">
                        #{r.id}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{r.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {r.email}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{r.city}</td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{r.department}</td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleDeleteRow(r.id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Matched Row
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Currently Scanning Row
            </span>
            <span className="font-mono">Total Size: ~{(records.length * 0.12).toFixed(1)} KB</span>
          </div>
        </div>

        {/* Right: B-Tree Index Visualization & Execution Plan Stats */}
        <div className="lg:col-span-5 space-y-4">
          {/* Query Stats Card */}
          {lastQueryStats ? (
            <div
              className={`rounded-3xl border p-5 shadow-xs animate-in fade-in ${
                lastQueryStats.indexed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {lastQueryStats.indexed ? (
                    <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Query Execution Report
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    lastQueryStats.indexed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {lastQueryStats.method}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="bg-white/80 dark:bg-[#0B101D]/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Rows Inspected</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {lastQueryStats.rowsExamined} / {lastQueryStats.rowsTotal}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {lastQueryStats.indexed ? 'O(log N) jump' : '100% full scan'}
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-[#0B101D]/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Est. Latency</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {lastQueryStats.latencyMs} ms
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {lastQueryStats.indexed ? '⚡ 50x Faster' : '🐢 High Disk IOPS'}
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-[#0B101D]/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Disk Pages Read</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {lastQueryStats.pagesRead} pages
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-[#0B101D]/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Matches Found</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {lastQueryStats.matchedCount} records
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {lastQueryStats.indexed
                  ? '✅ The database engine bypassed table rows and traversed the B-Tree root -> branch -> leaf in O(log N) time, fetching the exact row pointers directly.'
                  : '⚠️ Without an index, the database engine had to read every physical disk block and examine every single row sequentially, causing high I/O saturation.'}
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-xs text-center space-y-2">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto opacity-80" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Run a Query to Compare</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a target value above and click &quot;Execute SELECT Query&quot; to witness the performance metrics.
              </p>
            </div>
          )}

          {/* Active B-Tree Index Explorer */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Simulated B-Tree Memory Index
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Balanced B-Tree
              </span>
            </div>

            {hasIndexOnField && btreeIndexes[searchField] ? (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Sorted Index Keys for `{searchField}`:</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {btreeIndexes[searchField].length} Nodes
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px] custom-scrollbar">
                  {btreeIndexes[searchField].map((node, i) => {
                    const isTarget =
                      String(node.key).toLowerCase() === searchValue.toLowerCase().trim();
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-xl border ${
                          isTarget
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold'
                            : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="truncate max-w-[180px]">&apos;{node.key}&apos;</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                          ➔ Heap Row #{node.rowId}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No index active for <code className="text-purple-600 dark:text-purple-400 font-bold">`{searchField}`</code>.
                  Toggle index above to view the sorted B-Tree node hierarchy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Architectural Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            When to Index
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Columns frequently queried in <code className="text-slate-900 dark:text-white font-mono">WHERE</code>, <code className="text-slate-900 dark:text-white font-mono">JOIN ON</code>, and <code className="text-slate-900 dark:text-white font-mono">ORDER BY</code> with high cardinality (e.g. emails, UUIDs, timestamps).
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <XCircle className="w-4 h-4" />
            The Write Overhead Penalty
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every index is a duplicate tree structure. Every <code className="text-slate-900 dark:text-white font-mono">INSERT</code> or <code className="text-slate-900 dark:text-white font-mono">DELETE</code> must rebalance and write to all active B-Tree indexes, degrading write throughput.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
            <Layers className="w-4 h-4" />
            Index Selectivity
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Low cardinality columns (like boolean flags with 2 values) shouldn&apos;t be indexed because scanning 50% of the tree is slower than a sequential heap scan.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DbIndexingSimulator;

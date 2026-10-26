import { useState } from 'react';
import { GitBranch, CornerDownRight, Skull, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

let nextPidCounter = 401;
const getNextPid = () => {
  const pid = nextPidCounter;
  nextPidCounter += 1;
  return pid;
};

const EXEC_PROGRAMS = [
  'grep "error" log.txt',
  'node server.js',
  'ffmpeg -i input.mp4',
  'curl -O file.zip'
];
let programIndex = 0;
const getNextProgram = () => {
  const prog = EXEC_PROGRAMS[programIndex % EXEC_PROGRAMS.length];
  programIndex += 1;
  return prog;
};

// Helper to find process node by PID
const findNode = (node, pid) => {
  if (node.pid === pid) return node;
  for (const child of node.children) {
    const res = findNode(child, pid);
    if (res) return res;
  }
  return null;
};

// Helper to add child node via fork
const addForkChild = (node, parentPid, newChild) => {
  if (node.pid === parentPid) {
    return { ...node, children: [...node.children, newChild] };
  }
  return {
    ...node,
    children: node.children.map(child => addForkChild(child, parentPid, newChild))
  };
};

// Helper to update process state or program name (exec/exit)
const updateNode = (node, pid, updater) => {
  if (node.pid === pid) {
    return updater(node);
  }
  return {
    ...node,
    children: node.children.map(c => updateNode(c, pid, updater))
  };
};

export default function ProcessCreationTree() {
  // Process Tree State starting with PID 1 systemd
  const [tree, setTree] = useState({
    pid: 1,
    name: 'systemd / init',
    state: 'RUNNING',
    ppid: 0,
    children: [
      {
        pid: 101,
        name: 'bash (Shell)',
        state: 'RUNNING',
        ppid: 1,
        children: [
          { pid: 205, name: 'gcc compiler', state: 'RUNNING', ppid: 101, children: [] },
          { pid: 206, name: 'python3 script.py', state: 'WAITING', ppid: 101, children: [] }
        ]
      },
      {
        pid: 102,
        name: 'sshd daemon',
        state: 'RUNNING',
        ppid: 1,
        children: [
          { pid: 301, name: 'ssh session (parvej)', state: 'RUNNING', ppid: 102, children: [] }
        ]
      }
    ]
  });

  const [selectedProcess, setSelectedProcess] = useState(101);
  const [logs, setLogs] = useState([
    { text: 'System boot completed. Root process PID 1 (systemd) initialized.', type: 'info' }
  ]);

  // Action 1: fork()
  const handleFork = () => {
    const parentNode = findNode(tree, selectedProcess);
    if (!parentNode) return;
    if (parentNode.state === 'ZOMBIE' || parentNode.state === 'TERMINATED') {
      alert('Cannot fork from a dead or zombie process!');
      return;
    }

    const newPid = getNextPid();
    const newChild = {
      pid: newPid,
      name: `${parentNode.name}_child`,
      state: 'RUNNING',
      ppid: parentNode.pid,
      children: []
    };

    setTree(prev => addForkChild(prev, selectedProcess, newChild));
    setLogs(prev => [
      { text: `fork() called by Parent PID ${selectedProcess}: Spawned Child PID ${newPid} (Copy-On-Write memory cloned).`, type: 'success' },
      ...prev
    ]);
  };

  // Action 2: exec()
  const handleExec = () => {
    const randomProgram = getNextProgram();

    setTree(prev =>
      updateNode(prev, selectedProcess, (node) => ({
        ...node,
        name: randomProgram
      }))
    );

    setLogs(prev => [
      { text: `exec() invoked on PID ${selectedProcess}: Replaced address space with "${randomProgram}".`, type: 'info' },
      ...prev
    ]);
  };

  // Action 3: exit() -> Creates Zombie if parent didn't wait()
  const handleExit = () => {
    if (selectedProcess === 1) {
      alert('Cannot kill root PID 1 systemd!');
      return;
    }

    setTree(prev =>
      updateNode(prev, selectedProcess, (node) => ({
        ...node,
        state: 'ZOMBIE'
      }))
    );

    setLogs(prev => [
      { text: `exit() called by PID ${selectedProcess}: Process terminated execution. Entered [ZOMBIE] state awaiting parent wait().`, type: 'warning' },
      ...prev
    ]);
  };

  // Action 4: wait() by Parent -> Reaps Zombie child
  const handleWait = () => {
    const parentNode = findNode(tree, selectedProcess);
    if (!parentNode) return;

    let reapedCount = 0;
    const newChildren = parentNode.children.filter(c => {
      if (c.state === 'ZOMBIE') {
        reapedCount++;
        return false;
      }
      return true;
    });

    if (reapedCount === 0) {
      setLogs(prev => [
        { text: `wait() called by Parent PID ${selectedProcess}: No zombie children to reap. Parent blocks if active children exist.`, type: 'info' },
        ...prev
      ]);
      return;
    }

    setTree(prev =>
      updateNode(prev, selectedProcess, (node) => ({
        ...node,
        children: newChildren
      }))
    );

    setLogs(prev => [
      { text: `wait() executed by Parent PID ${selectedProcess}: Successfully reaped ${reapedCount} ZOMBIE child process entry from PCB table.`, type: 'success' },
      ...prev
    ]);
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node, depth = 0) => {
    const isSelected = selectedProcess === node.pid;
    const stateColors = {
      RUNNING: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      WAITING: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      ZOMBIE: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse',
    };

    return (
      <div key={node.pid} className="space-y-2">
        <div
          onClick={() => setSelectedProcess(node.pid)}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            isSelected
              ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md'
              : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-[#1E2638] hover:border-cyan-400'
          }`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          <div className="flex items-center gap-3">
            {depth > 0 && <CornerDownRight className="w-4 h-4 text-slate-400 shrink-0" />}
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-xs">
              {node.pid}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                  {node.name}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${stateColors[node.state]}`}>
                  {node.state}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                PID: {node.pid} | Parent PPID: {node.ppid}
              </span>
            </div>
          </div>

          {isSelected && (
            <span className="px-2 py-0.5 rounded bg-cyan-600 text-white text-[10px] font-mono font-bold">
              Selected Target
            </span>
          )}
        </div>

        {/* Render Children */}
        {node.children.map(child => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  const activeSelectedNode = findNode(tree, selectedProcess);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                Process Hierarchy Tree
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Process Creation & Termination Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a process in the tree below and simulate <code className="font-mono text-cyan-600 dark:text-cyan-400">fork()</code>, <code className="font-mono text-cyan-600 dark:text-cyan-400">exec()</code>, <code className="font-mono text-cyan-600 dark:text-cyan-400">wait()</code>, and <code className="font-mono text-cyan-600 dark:text-cyan-400">exit()</code> system calls.
            </p>
          </div>

          {/* Action Toolbar */}
          {activeSelectedNode && (
            <div className="flex items-center gap-2 flex-wrap bg-slate-50 dark:bg-[#070A12] p-2 rounded-xl border border-slate-200 dark:border-[#1E2638]">
              <button
                onClick={handleFork}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="fork() - Clones parent into a child process"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>fork()</span>
              </button>

              <button
                onClick={handleExec}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="exec() - Overwrites address space with new program"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>exec()</span>
              </button>

              <button
                onClick={handleWait}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="wait() - Parent reaps zombie child status"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>wait()</span>
              </button>

              <button
                onClick={handleExit}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="exit() - Process terminates execution"
              >
                <Skull className="w-3.5 h-3.5" />
                <span>exit()</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Tree View vs Concept Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Tree View (Col 7) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-500" />
              <span>Live Process Hierarchy Tree</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Root: PID 1 (systemd)
            </span>
          </div>

          <div className="space-y-3">
            {renderTreeNode(tree)}
          </div>
        </div>

        {/* Right Column: Zombie/Orphan & Code Walkthrough (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Zombie & Orphan Concepts */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Zombie vs Orphan Process States</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                <span className="font-bold text-rose-600 dark:text-rose-400 block">
                  🧟 Zombie Process
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  A child process that has called <code className="font-mono text-rose-600">exit()</code>, but its parent process has not yet executed <code className="font-mono text-rose-600">wait()</code>. Its memory is freed, but its PID entry stays in the PCB table.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">
                  👶 Orphan Process
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  A child process whose parent process terminated before the child finished. Operating systems automatically re-parent orphans to <strong className="text-slate-900 dark:text-white">init / systemd (PID 1)</strong>, which reaps them upon exit.
                </p>
              </div>
            </div>
          </div>

          {/* C Code Pattern Walkthrough */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-500" />
              <span>Standard C System Call Pattern</span>
            </h4>

            <div className="bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-xl border border-slate-800 space-y-1 overflow-x-auto">
              <div className="text-slate-500">// Forking & executing child process in C</div>
              <div><span className="text-purple-400">pid_t</span> pid = <span className="text-cyan-400">fork()</span>;</div>
              <div className="text-slate-400">if (pid == 0) &#123;</div>
              <div className="pl-4 text-slate-300">// Child process execution path</div>
              <div className="pl-4"><span className="text-cyan-400">execlp</span>(<span className="text-emerald-400">"/bin/ls"</span>, <span className="text-emerald-400">"ls"</span>, NULL);</div>
              <div className="pl-4"><span className="text-rose-400">exit(0)</span>;</div>
              <div className="text-slate-400">&#125; else if (pid &gt; 0) &#123;</div>
              <div className="pl-4 text-slate-300">// Parent process blocks awaiting child exit</div>
              <div className="pl-4"><span className="text-cyan-400">wait</span>(NULL);</div>
              <div className="text-slate-400">&#125;</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live System Logs */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <span>Process Lifecycle System Call Logs</span>
        </h4>
        <div className="bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl border border-slate-800 max-h-[140px] overflow-y-auto space-y-1">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-cyan-400">&gt;</span>
              <span>{l.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

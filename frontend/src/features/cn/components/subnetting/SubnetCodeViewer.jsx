import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  FileCode,
  Calculator,
  GitFork,
  Network,
  Binary,
  Layers,
  Globe,
  Sliders,
  Sparkles
} from 'lucide-react';
import { SUBNETTING_CODE_DATA } from '../../data/subnettingCodeData';

export function SubnetCodeViewer({
  initialIp = '192.168.10.50',
  initialCidr = 26,
  onSwitchToCalculator
}) {
  const [selectedAlgo, setSelectedAlgo] = useState('calculator'); // 'calculator', 'vlsm', 'membership'
  const [selectedLang, setSelectedLang] = useState('python'); // 'python', 'cpp', 'java'
  const [isCopied, setIsCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);

  // Calculator Parameters
  const [calcIp, setCalcIp] = useState(initialIp);
  const [calcCidr, setCalcCidr] = useState(initialCidr);

  // VLSM Parameters
  const [vlsmBase, setVlsmBase] = useState('192.168.1.0');
  const [vlsmParentCidr, setVlsmParentCidr] = useState(24);
  const [vlsmPreset, setVlsmPreset] = useState('campus'); // 'campus', 'datacenter', 'branch'

  // Membership & LPM Parameters
  const [memberIpA, setMemberIpA] = useState('192.168.1.15');
  const [memberIpB, setMemberIpB] = useState('192.168.1.45');
  const [memberCidr, setMemberCidr] = useState(26);
  const [lpmDestIp, setLpmDestIp] = useState('192.168.1.75');

  const currentAlgoData = SUBNETTING_CODE_DATA[selectedAlgo] || SUBNETTING_CODE_DATA.calculator;

  const currentCode =
    selectedLang === 'python'
      ? currentAlgoData.pythonCode
      : selectedLang === 'cpp'
      ? currentAlgoData.cppCode
      : currentAlgoData.javaCode;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClearLogs = () => {
    setExecutionLogs([]);
  };

  const handleRunExecution = () => {
    setIsExecuting(true);
    setExecutionLogs([`[KERNEL] Initializing ${currentAlgoData.title}...`]);

    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 2,
      });

      let logs = [];

      if (selectedAlgo === 'calculator') {
        const octets = calcIp.split('.').map((x) => parseInt(x, 10) || 0);
        const ipNum = ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
        const maskNum = calcCidr === 0 ? 0 : ((0xffffffff << (32 - calcCidr)) >>> 0);
        const wildcardNum = (~maskNum) >>> 0;
        const netNum = (ipNum & maskNum) >>> 0;
        const bcastNum = (netNum | wildcardNum) >>> 0;

        const toIp = (num) =>
          `${(num >>> 24) & 255}.${(num >>> 16) & 255}.${(num >>> 8) & 255}.${num & 255}`;
        const toBin = (num) =>
          [
            ((num >>> 24) & 255).toString(2).padStart(8, '0'),
            ((num >>> 16) & 255).toString(2).padStart(8, '0'),
            ((num >>> 8) & 255).toString(2).padStart(8, '0'),
            (num & 255).toString(2).padStart(8, '0'),
          ].join('.');

        const totalHosts = Math.pow(2, 32 - calcCidr);
        const usableHosts = calcCidr >= 31 ? (calcCidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);
        const firstUsable = calcCidr >= 31 ? netNum : netNum + 1;
        const lastUsable = calcCidr >= 31 ? bcastNum : bcastNum - 1;

        logs = [
          `[${timestamp}] [SYS_EXEC] Invoking ${selectedLang.toUpperCase()} Subnet Calculation Engine...`,
          `[${timestamp}] [PARSING] IP Address: ${calcIp} -> Unsigned 32-bit Integer: 0x${ipNum.toString(16).toUpperCase()} (${ipNum})`,
          `[${timestamp}] [CIDR MASK] Prefix /${calcCidr} -> Subnet Mask: ${toIp(maskNum)}`,
          `[${timestamp}] [BITWISE AND] IP & Subnet Mask:`,
          `[${timestamp}]   IP  : ${toBin(ipNum)}`,
          `[${timestamp}]   MASK: ${toBin(maskNum)}`,
          `[${timestamp}]   NET : ${toBin(netNum)}  <-- Network Address: ${toIp(netNum)}`,
          `[${timestamp}] [BITWISE OR] Network | Wildcard Mask (${toIp(wildcardNum)}):`,
          `[${timestamp}]   BCST: ${toBin(bcastNum)}  <-- Broadcast Address: ${toIp(bcastNum)}`,
          `[${timestamp}] [HOST METRICS] Total Address Space: ${totalHosts.toLocaleString()} IPs (2^${32 - calcCidr})`,
          `[${timestamp}] [HOST METRICS] Usable Endpoints  : ${usableHosts.toLocaleString()} Hosts (2^${32 - calcCidr} - 2)`,
          `[${timestamp}] [VALID RANGE] First Host: ${toIp(firstUsable)} | Last Host: ${toIp(lastUsable)}`,
          `[${timestamp}] [CLASSIFICATION] ${octets[0] < 127 ? 'Class A' : octets[0] < 192 ? 'Class B' : octets[0] < 224 ? 'Class C' : 'Class D/E'} | ${
            octets[0] === 10 || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168)
              ? 'Private Network (RFC 1918)'
              : 'Public Internet Routable'
          }`,
          `[${timestamp}] [STATUS] Computation successfully completed in 0.42 ms. Memory allocated: 0 overhead.`
        ];
      } else if (selectedAlgo === 'vlsm') {
        const presetsMap = {
          campus: [
            { dept: 'Sales', hosts: 60, cidr: 26, block: 64, net: '192.168.1.0', bcast: '192.168.1.63', range: '192.168.1.1 - 192.168.1.62' },
            { dept: 'Engineering', hosts: 28, cidr: 27, block: 32, net: '192.168.1.64', bcast: '192.168.1.95', range: '192.168.1.65 - 192.168.1.94' },
            { dept: 'Marketing', hosts: 14, cidr: 28, block: 16, net: '192.168.1.96', bcast: '192.168.1.111', range: '192.168.1.97 - 192.168.1.110' },
            { dept: 'Customer Support', hosts: 6, cidr: 29, block: 8, net: '192.168.1.112', bcast: '192.168.1.119', range: '192.168.1.113 - 192.168.1.118' },
            { dept: 'Core Router P2P', hosts: 2, cidr: 30, block: 4, net: '192.168.1.120', bcast: '192.168.1.123', range: '192.168.1.121 - 192.168.1.122' },
          ],
          datacenter: [
            { dept: 'Database Cluster', hosts: 120, cidr: 25, block: 128, net: '192.168.1.0', bcast: '192.168.1.127', range: '192.168.1.1 - 192.168.1.126' },
            { dept: 'Application Servers', hosts: 60, cidr: 26, block: 64, net: '192.168.1.128', bcast: '192.168.1.191', range: '192.168.1.129 - 192.168.1.190' },
            { dept: 'Web DMZ Gateway', hosts: 28, cidr: 27, block: 32, net: '192.168.1.192', bcast: '192.168.1.223', range: '192.168.1.193 - 192.168.1.222' },
            { dept: 'Redis Cache Tier', hosts: 14, cidr: 28, block: 16, net: '192.168.1.224', bcast: '192.168.1.239', range: '192.168.1.225 - 192.168.1.238' },
          ],
          branch: [
            { dept: 'Admin LAN', hosts: 30, cidr: 27, block: 32, net: '192.168.1.0', bcast: '192.168.1.31', range: '192.168.1.1 - 192.168.1.30' },
            { dept: 'Office Staff', hosts: 14, cidr: 28, block: 16, net: '192.168.1.32', bcast: '192.168.1.47', range: '192.168.1.33 - 192.168.1.46' },
            { dept: 'Guest Wi-Fi', hosts: 14, cidr: 28, block: 16, net: '192.168.1.48', bcast: '192.168.1.63', range: '192.168.1.49 - 192.168.1.62' },
            { dept: 'VoIP Telephony', hosts: 6, cidr: 29, block: 8, net: '192.168.1.64', bcast: '192.168.1.71', range: '192.168.1.65 - 192.168.1.70' },
          ]
        };

        const activePreset = presetsMap[vlsmPreset] || presetsMap.campus;
        let totalUsed = activePreset.reduce((acc, row) => acc + row.block, 0);

        logs = [
          `[${timestamp}] [VLSM INIT] Base Pool: ${vlsmBase}/${vlsmParentCidr} (256 Total IPv4 Addresses)`,
          `[${timestamp}] [PRE-SORT] Sorting ${activePreset.length} department requirements in DESCENDING host order...`,
          `[${timestamp}] [FRAGMENTATION GUARD] Descending order guarantees contiguous boundaries and zero block collision.`,
          `[${timestamp}] -------------------------------------------------------------`
        ];

        activePreset.forEach((sub, idx) => {
          logs.push(
            `[${timestamp}] [SUBNET ${idx + 1}] Dept: "${sub.dept}" (Needed: ${sub.hosts} hosts)`,
            `[${timestamp}]   --> Host Bits: ceil(log2(${sub.hosts} + 2)) = ${32 - sub.cidr} bits | Allocated Mask: /${sub.cidr} (${sub.block} IPs)`,
            `[${timestamp}]   --> Network: ${sub.net}/${sub.cidr} | Broadcast: ${sub.bcast}`,
            `[${timestamp}]   --> Usable Range: ${sub.range} (${sub.block - 2} usable hosts)`,
            `[${timestamp}]   --> Allocation Efficiency: ${((sub.hosts / (sub.block - 2)) * 100).toFixed(1)}%`
          );
        });

        logs.push(
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [CAPACITY REPORT] Allocated: ${totalUsed} / 256 IPs (${((totalUsed / 256) * 100).toFixed(1)}% utilized)`,
          `[${timestamp}] [UNALLOCATED POOL] ${256 - totalUsed} IPs remain available for future network expansion.`,
          `[${timestamp}] [STATUS] Optimal VLSM plan compiled without external address waste.`
        );
      } else {
        // Membership & LPM
        logs = [
          `[${timestamp}] [ROUTING ENGINE] Initializing Layer 3 Routing & Subnet Membership Inspector...`,
          `[${timestamp}] [TEST 1: SAME SUBNET CHECK]`,
          `[${timestamp}]   Host A: ${memberIpA} | Host B: ${memberIpB} (CIDR /${memberCidr})`,
          `[${timestamp}]   --> Host A Network: 192.168.1.0/26 (0xC0A80100)`,
          `[${timestamp}]   --> Host B Network: 192.168.1.0/26 (0xC0A80100)`,
          `[${timestamp}]   --> Networks MATCH (Bitwise AND equality confirmed)`,
          `[${timestamp}]   [DECISION] DIRECT LAYER 2 ETHERNET DELIVERY (ARP Broadcast Resolution). No router required!`,
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [TEST 2: LONGEST PREFIX MATCH ROUTE LOOKUP]`,
          `[${timestamp}]   Destination Packet Header: ${lpmDestIp}`,
          `[${timestamp}]   Scanning Kernel Forwarding Information Base (FIB):`,
          `[${timestamp}]   [CANDIDATE 1] 10.0.0.0/8       -> Mismatch (0x0A000000 != 0xC0A8014B)`,
          `[${timestamp}]   [CANDIDATE 2] 192.168.1.0/24   -> MATCH! (Prefix Length = 24)`,
          `[${timestamp}]   [CANDIDATE 3] 192.168.1.64/26  -> MATCH! (Prefix Length = 26)`,
          `[${timestamp}]   [CANDIDATE 4] 0.0.0.0/0        -> MATCH (Default Route, Prefix Length = 0)`,
          `[${timestamp}] [LPM RULE] Route 192.168.1.64/26 has the longest prefix (26 > 24 > 0).`,
          `[${timestamp}] [FORWARDING ACTION] Egress through interface 'eth3 (DMZ Subnet B)' -> Next Hop: Direct`,
          `[${timestamp}] [SUCCESS] Delivered Layer 3 packet to destination hop in 0.35 ms.`
        ];
      }

      setExecutionLogs(logs);
      setIsExecuting(false);
    }, 700);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Selector Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                <span>LAYER 3 IPv4 SUBNETTING &amp; CIDR CODE LAB</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentAlgoData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              {currentAlgoData.summary}
            </p>
          </div>

          {/* Algorithm Switcher */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex flex-wrap items-center gap-1 font-mono text-xs self-start lg:self-center">
            <button
              onClick={() => {
                setSelectedAlgo('calculator');
                setExecutionLogs([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedAlgo === 'calculator'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Subnet Math</span>
            </button>

            <button
              onClick={() => {
                setSelectedAlgo('vlsm');
                setExecutionLogs([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedAlgo === 'vlsm'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>VLSM Engine</span>
            </button>

            <button
              onClick={() => {
                setSelectedAlgo('membership');
                setExecutionLogs([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedAlgo === 'membership'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>LPM &amp; Route Lookup</span>
            </button>
          </div>
        </div>

        {/* Complexity & Specifications Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            Time Complexity:{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {currentAlgoData.complexity.time}
            </strong>
          </span>
          <span>•</span>
          <span className="text-slate-500 dark:text-slate-400">
            Space:{' '}
            <strong className="text-indigo-600 dark:text-indigo-400">
              {currentAlgoData.complexity.space}
            </strong>
          </span>
          <span>•</span>
          <span className="text-slate-500 dark:text-slate-400">
            RFC Standard:{' '}
            <strong className="text-cyan-600 dark:text-cyan-400">
              {currentAlgoData.standard}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Code Viewer (7 cols) + Execution Console (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Multi-Language Code Viewer */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-xl">
          {/* Toolbar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setSelectedLang('python')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'python'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Python 3
              </button>
              <button
                onClick={() => setSelectedLang('cpp')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'cpp'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                C++
              </button>
              <button
                onClick={() => setSelectedLang('java')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'java'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Java
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors cursor-pointer"
              title="Copy code to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed max-h-[560px] overflow-y-auto custom-scrollbar">
            <pre className="text-slate-200 whitespace-pre">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Simulation & Console Runner */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Interactive Subnet Execution Engine
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                Layer 3 IP Stack
              </span>
            </div>

            {/* Dynamic Controls based on selected algorithm */}
            {selectedAlgo === 'calculator' && (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Target IPv4 Address
                  </label>
                  <input
                    type="text"
                    value={calcIp}
                    onChange={(e) => setCalcIp(e.target.value)}
                    placeholder="192.168.10.50"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      CIDR Prefix
                    </label>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      /{calcCidr}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={calcCidr}
                    onChange={(e) => setCalcCidr(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[8, 16, 24, 26, 27, 28, 30].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCalcCidr(c)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          calcCidr === c
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        /{c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedAlgo === 'vlsm' && (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Base Parent Network
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={vlsmBase}
                      onChange={(e) => setVlsmBase(e.target.value)}
                      placeholder="192.168.1.0"
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none"
                    />
                    <span className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      /{vlsmParentCidr}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Department Requirements Preset
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setVlsmPreset('campus')}
                      className={`p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer transition-colors ${
                        vlsmPreset === 'campus'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      Enterprise LAN (5 subnets)
                    </button>
                    <button
                      onClick={() => setVlsmPreset('datacenter')}
                      className={`p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer transition-colors ${
                        vlsmPreset === 'datacenter'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      Data Center (4 tiers)
                    </button>
                    <button
                      onClick={() => setVlsmPreset('branch')}
                      className={`p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer transition-colors ${
                        vlsmPreset === 'branch'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      Small Office (4 subnets)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedAlgo === 'membership' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Endpoint Host A
                    </label>
                    <input
                      type="text"
                      value={memberIpA}
                      onChange={(e) => setMemberIpA(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Endpoint Host B
                    </label>
                    <input
                      type="text"
                      value={memberIpB}
                      onChange={(e) => setMemberIpB(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Destination Packet Header (LPM Lookup)
                  </label>
                  <input
                    type="text"
                    value={lpmDestIp}
                    onChange={(e) => setLpmDestIp(e.target.value)}
                    placeholder="192.168.1.75"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* Run Execution Button */}
            <div className="pt-2">
              <button
                onClick={handleRunExecution}
                disabled={isExecuting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Subnet Math...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Execute {selectedAlgo === 'calculator' ? 'Subnet Calculator' : selectedAlgo === 'vlsm' ? 'VLSM Allocator' : 'LPM Engine'} ({selectedLang.toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-Time Terminal Logs Output */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 overflow-hidden shadow-lg flex flex-col font-mono text-xs">
            {/* Terminal Header */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5 ml-2">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>kernel_ip_subnetting.log</span>
                </span>
              </div>

              {executionLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-1.5 min-h-[220px] max-h-[320px] overflow-y-auto custom-scrollbar text-[11px] leading-relaxed">
              {executionLogs.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                  <Terminal className="w-6 h-6 text-slate-600" />
                  <p>Click &quot;Execute&quot; above to run the {selectedLang.toUpperCase()} subnetting algorithm.</p>
                  <p className="text-[10px] text-slate-600">Simulates real kernel bitwise arithmetic, host capacity formulas &amp; CIDR route matching.</p>
                </div>
              ) : (
                executionLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.includes('SUCCESS') || log.includes('MATCH') || log.includes('DIRECT')
                        ? 'text-emerald-400 font-semibold'
                        : log.includes('SYS_EXEC') || log.includes('VLSM INIT') || log.includes('ROUTING ENGINE')
                        ? 'text-cyan-400 font-bold'
                        : log.includes('BITWISE') || log.includes('HOST METRICS') || log.includes('SUBNET')
                        ? 'text-amber-300'
                        : log.includes('-->')
                        ? 'text-slate-300 pl-2'
                        : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubnetCodeViewer;

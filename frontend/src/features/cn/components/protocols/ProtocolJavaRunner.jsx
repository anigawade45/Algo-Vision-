import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  FileCode,
  Clock,
  Globe,
  Search,
  Radio,
  Layers,
  Activity,
  Zap,
  Server
} from 'lucide-react';

export function ProtocolJavaRunner({ protocolData }) {
  const [selectedLang, setSelectedLang] = useState('python'); // 'python', 'cpp', 'java'
  const [isCopied, setIsCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);

  // Protocol-Specific Interactive State
  const [httpMethod, setHttpMethod] = useState('GET');
  const [httpPath, setHttpPath] = useState('/index.html');
  const [httpBody, setHttpBody] = useState('{"author": "Ritesh", "text": "AlgoVision is awesome!"}');

  const [dnsDomain, setDnsDomain] = useState('www.example.com');
  const [dnsRecordType, setDnsRecordType] = useState('A');

  const [dhcpMac, setDhcpMac] = useState('00:1A:2B:3C:4D:5E');
  const [dhcpHostname, setDhcpHostname] = useState('Host-Workstation-01');

  const [arpTargetIp, setArpTargetIp] = useState('192.168.1.5');

  const [icmpTarget, setIcmpTarget] = useState('8.8.8.8');
  const [icmpCount, setIcmpCount] = useState(4);

  if (!protocolData || (!protocolData.hasCode && !protocolData.hasJavaCode)) {
    return null;
  }

  const currentCode =
    selectedLang === 'python'
      ? protocolData.pythonCode || protocolData.javaCode
      : selectedLang === 'cpp'
      ? protocolData.cppCode || protocolData.javaCode
      : protocolData.javaCode;

  const currentFilename =
    selectedLang === 'python'
      ? `${protocolData.id}_simulation.py`
      : selectedLang === 'cpp'
      ? `${protocolData.id}_simulation.cpp`
      : `${protocolData.name}Demo.java`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsExecuting(true);
    setExecutionLogs([`[KERNEL] Initializing ${protocolData.name} protocol simulation engine...`]);

    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 2,
      });

      let logs = [];

      if (protocolData.id === 'http') {
        const isPost = httpMethod === 'POST' || httpMethod === 'PUT';
        logs = [
          `[${timestamp}] [TCP HANDSHAKE] Connected to 104.21.32.1:80 (3-Way SYN/ACK verified)`,
          `[${timestamp}] [HTTP CLIENT] Transmitting Request:`,
          `[${timestamp}]   --> ${httpMethod} ${httpPath} HTTP/1.1`,
          `[${timestamp}]   --> Host: api.algovision.dev`,
          `[${timestamp}]   --> User-Agent: AlgoVision-Client/1.0`,
          `[${timestamp}]   --> Accept: application/json, text/html`,
          ...(isPost ? [`[${timestamp}]   --> Content-Type: application/json`, `[${timestamp}]   --> Payload: ${httpBody}`] : []),
          `[${timestamp}] [HTTP SERVER] Dispatched request to route handler for "${httpPath}"`,
          `[${timestamp}] [HTTP SERVER] HTTP/1.1 ${isPost ? '201 Created' : httpPath === '/status' ? '200 OK' : '200 OK'}`,
          `[${timestamp}]   <-- Server: AlgoVision-WebServer/2.0`,
          `[${timestamp}]   <-- Content-Type: ${isPost ? 'application/json' : 'text/html'}`,
          `[${timestamp}]   <-- Content-Length: ${isPost ? '58' : '72'} bytes`,
          `[${timestamp}]   <-- Response: ${isPost ? '{"status": "success", "id": 1024, "created": true}' : '<html><body><h1>AlgoVision Gateway 200 OK</h1></body></html>'}`,
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [SUCCESS] HTTP ${httpMethod} transaction completed successfully in 32ms!`
        ];
      } else if (protocolData.id === 'dns') {
        const ipMap = {
          'www.example.com': '93.184.216.34',
          'api.github.com': '140.82.121.6',
          'algovision.dev': '76.76.21.21',
          'cloudflare.com': '104.16.132.229'
        };
        const resolvedIp = ipMap[dnsDomain] || '198.51.100.42';

        logs = [
          `[${timestamp}] [DNS CLIENT] Querying ${dnsDomain} (${dnsRecordType} Record)`,
          `[${timestamp}] [CACHE MISS] Local OS Resolver Cache miss for ${dnsDomain}`,
          `[${timestamp}] [STEP 1: ROOT SERVER] Querying [a.root-servers.net:53 UDP] -> Referred to .com / .dev TLD`,
          `[${timestamp}] [STEP 2: TLD SERVER] Querying [.gtld-servers.net:53] -> Referred to Authoritative NS`,
          `[${timestamp}] [STEP 3: AUTHORITATIVE] Querying ns1.${dnsDomain} -> Received ${dnsRecordType} = ${resolvedIp} (TTL: 300s)`,
          `[${timestamp}] [CACHE STORE] Saved ${dnsDomain} -> ${resolvedIp} to local resolver cache.`,
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [SUCCESS] Resolved ${dnsDomain} -> ${resolvedIp} in 44ms (UDP 53)`
        ];
      } else if (protocolData.id === 'dhcp') {
        const allocatedIp = dhcpMac.endsWith('5E') ? '192.168.1.10' : dhcpMac.endsWith('99') ? '192.168.1.11' : '192.168.1.15';
        logs = [
          `[${timestamp}] [DHCP INIT] Host "${dhcpHostname}" (MAC: ${dhcpMac}) linked on Port 3`,
          `[${timestamp}] [1. DHCPDISCOVER] Broadcast sent: 0.0.0.0:68 -> 255.255.255.255:67 (Transaction ID: 0x39A4)`,
          `[${timestamp}] [2. DHCPOFFER] Server 192.168.1.1 offers IP: ${allocatedIp}`,
          `[${timestamp}]   --> Subnet Mask: 255.255.255.0 | Gateway: 192.168.1.1 | DNS: 8.8.8.8`,
          `[${timestamp}] [3. DHCPREQUEST] Client requests lease for offered IP: ${allocatedIp}`,
          `[${timestamp}] [4. DHCPACK] Server commits lease for ${allocatedIp} (Duration: 86400s / 24 Hours)`,
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [SUCCESS] Host configured: IP=${allocatedIp}, Gateway=192.168.1.1 in 52ms (DORA Flow Complete)`
        ];
      } else if (protocolData.id === 'arp') {
        const macMap = {
          '192.168.1.5': 'AA:BB:CC:DD:EE:05',
          '192.168.1.1': '00:50:56:FE:ED:01',
          '192.168.1.10': '00:1A:2B:3C:4D:10',
          '192.168.1.50': '52:54:00:12:34:56'
        };
        const resolvedMac = macMap[arpTargetIp] || 'AA:BB:CC:11:22:33';
        logs = [
          `[${timestamp}] [ARP LOOKUP] Checking local ARP cache for IP: ${arpTargetIp}...`,
          `[${timestamp}] [CACHE MISS] No MAC binding in memory table for ${arpTargetIp}`,
          `[${timestamp}] [ARP REQUEST] Broadcasting Ethernet frame to FF:FF:FF:FF:FF:FF (EtherType: 0x0806)`,
          `[${timestamp}]   --> "Who has ${arpTargetIp}? Tell 192.168.1.2 (DE:AD:BE:EF:00:01)"`,
          `[${timestamp}] [SWITCH FABRIC] Frame flooded to all active switch ports on VLAN 1`,
          `[${timestamp}] [ARP REPLY] Host ${arpTargetIp} replies unicast: "I am at ${resolvedMac}"`,
          `[${timestamp}] [ARP TABLE] Added binding: ${arpTargetIp} -> ${resolvedMac} (Dynamic)`,
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [SUCCESS] Ready to encapsulate IP packet with Dest MAC: ${resolvedMac}`
        ];
      } else if (protocolData.id === 'icmp') {
        logs = [
          `[${timestamp}] [ICMP PING] Pinging ${icmpTarget} with 32 bytes of echo diagnostic data:`,
          `[${timestamp}] Reply from ${icmpTarget}: bytes=32 seq=1 time=12ms TTL=118 Type=0 (Echo Reply)`,
          `[${timestamp}] Reply from ${icmpTarget}: bytes=32 seq=2 time=14ms TTL=118 Type=0 (Echo Reply)`,
          `[${timestamp}] Reply from ${icmpTarget}: bytes=32 seq=3 time=11ms TTL=118 Type=0 (Echo Reply)`,
          `[${timestamp}] Reply from ${icmpTarget}: bytes=32 seq=4 time=15ms TTL=118 Type=0 (Echo Reply)`,
          ...(icmpCount === 8 ? [
            `[${timestamp}] Reply from ${icmpTarget}: bytes=32 seq=5 time=13ms TTL=118 Type=0 (Echo Reply)`,
            `[${timestamp}] Reply from ${icmpTarget}: bytes=32 seq=6 time=12ms TTL=118 Type=0 (Echo Reply)`,
            `[${timestamp}] Reply from ${icmpTarget}: bytes=32 seq=7 time=16ms TTL=118 Type=0 (Echo Reply)`,
            `[${timestamp}] Reply from ${icmpTarget}: bytes=32 seq=8 time=12ms TTL=118 Type=0 (Echo Reply)`
          ] : []),
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [PING STATS] Packets: Sent = ${icmpCount}, Received = ${icmpCount}, Lost = 0 (0.0% loss)`,
          `[${timestamp}] [SUCCESS] Round-Trip Time: Min = 11ms, Max = ${icmpCount === 8 ? '16ms' : '15ms'}, Avg = 13.0ms`
        ];
      }

      setExecutionLogs(logs);
      setIsExecuting(false);
    }, 650);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Protocol Code Header Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                <span>{protocolData.layer.toUpperCase()} CODE LAB</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {protocolData.name} Algorithmic Implementation (Python 3, C++, Java)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {protocolData.codeExplanation}
            </p>
          </div>
        </div>

        {/* Specs & Transport Tags */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            Transport Protocol: <strong className="text-indigo-600 dark:text-indigo-400">{protocolData.transportProtocol}</strong>
          </span>
          <span>•</span>
          <span className="text-slate-500 dark:text-slate-400">
            Layer: <strong className="text-emerald-600 dark:text-emerald-400">{protocolData.layer}</strong>
          </span>
          <span>•</span>
          <span className="text-slate-500 dark:text-slate-400">
            Available Languages: <strong className="text-cyan-600 dark:text-cyan-400">Python 3, C++, Java</strong>
          </span>
        </div>
      </div>

      {/* 2. Side-by-Side Code & Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Multi-Language Code Viewer */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-xl">
          {/* Code Toolbar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Language Switcher: Python 3, C++, Java */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setSelectedLang('python')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'python'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Python 3
              </button>
              <button
                onClick={() => setSelectedLang('cpp')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'cpp'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                C++
              </button>
              <button
                onClick={() => setSelectedLang('java')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'java'
                    ? 'bg-blue-600 text-white shadow-xs'
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
          <div className="flex-1 p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed max-h-[520px] overflow-y-auto custom-scrollbar">
            <pre className="text-slate-200 whitespace-pre">
              <code>{currentCode}</code>
            </pre>
          </div>

          {/* Code Footer */}
          <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>File: {currentFilename}</span>
            <span>Lines: {currentCode.split('\n').length}</span>
          </div>
        </div>

        {/* Right 5 Columns: Interactive Simulation & Console Runner */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {protocolData.name} Execution Console
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                INTERACTIVE
              </span>
            </div>

            {/* Protocol-Specific Parameters Inputs */}
            {protocolData.id === 'http' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      HTTP Method
                    </label>
                    <select
                      value={httpMethod}
                      onChange={(e) => setHttpMethod(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="GET">GET (Fetch)</option>
                      <option value="POST">POST (Create)</option>
                      <option value="PUT">PUT (Update)</option>
                      <option value="DELETE">DELETE (Remove)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      Target URI Path
                    </label>
                    <select
                      value={httpPath}
                      onChange={(e) => setHttpPath(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="/index.html">/index.html</option>
                      <option value="/api/comments">/api/comments</option>
                      <option value="/users/profile">/users/profile</option>
                      <option value="/status">/status</option>
                    </select>
                  </div>
                </div>

                {(httpMethod === 'POST' || httpMethod === 'PUT') && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      JSON Request Body
                    </label>
                    <input
                      type="text"
                      value={httpBody}
                      onChange={(e) => setHttpBody(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white font-mono text-xs outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {protocolData.id === 'dns' && (
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Domain Name
                  </label>
                  <select
                    value={dnsDomain}
                    onChange={(e) => setDnsDomain(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="www.example.com">www.example.com</option>
                    <option value="api.github.com">api.github.com</option>
                    <option value="algovision.dev">algovision.dev</option>
                    <option value="cloudflare.com">cloudflare.com</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Record Type
                  </label>
                  <select
                    value={dnsRecordType}
                    onChange={(e) => setDnsRecordType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="A">A Record (IPv4)</option>
                    <option value="AAAA">AAAA Record (IPv6)</option>
                    <option value="CNAME">CNAME (Alias)</option>
                  </select>
                </div>
              </div>
            )}

            {protocolData.id === 'dhcp' && (
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Client MAC Address
                  </label>
                  <select
                    value={dhcpMac}
                    onChange={(e) => setDhcpMac(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="00:1A:2B:3C:4D:5E">00:1A:2B:3C:4D:5E</option>
                    <option value="A4:C3:F0:88:12:99">A4:C3:F0:88:12:99</option>
                    <option value="BC:54:2F:11:8A:33">BC:54:2F:11:8A:33</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Device Hostname
                  </label>
                  <input
                    type="text"
                    value={dhcpHostname}
                    onChange={(e) => setDhcpHostname(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white font-mono text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {protocolData.id === 'arp' && (
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Target IPv4 Address
                  </label>
                  <select
                    value={arpTargetIp}
                    onChange={(e) => setArpTargetIp(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="192.168.1.5">192.168.1.5 (Host 2)</option>
                    <option value="192.168.1.1">192.168.1.1 (Gateway R1)</option>
                    <option value="192.168.1.10">192.168.1.10 (Printer)</option>
                    <option value="192.168.1.50">192.168.1.50 (Storage)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Local Source Host
                  </label>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold truncate">
                    192.168.1.2 (PC1)
                  </div>
                </div>
              </div>
            )}

            {protocolData.id === 'icmp' && (
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Target Host
                  </label>
                  <select
                    value={icmpTarget}
                    onChange={(e) => setIcmpTarget(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="8.8.8.8">8.8.8.8 (Google DNS)</option>
                    <option value="1.1.1.1">1.1.1.1 (Cloudflare)</option>
                    <option value="192.168.1.1">192.168.1.1 (Default Gateway)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Echo Ping Count
                  </label>
                  <select
                    value={icmpCount}
                    onChange={(e) => setIcmpCount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value={4}>4 Packets</option>
                    <option value={8}>8 Packets</option>
                  </select>
                </div>
              </div>
            )}

            {/* Action Buttons: Run + Reset */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isExecuting}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Simulation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run {protocolData.name} Simulation</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setExecutionLogs([])}
                className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Clear Console"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Real-Time Terminal Output */}
            <div className="rounded-xl bg-[#05070E] border border-slate-800 p-4 font-mono text-xs space-y-2 min-h-[220px] max-h-[290px] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-900 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-indigo-400" />
                  <span className="text-indigo-400 font-bold">Protocol Trace Engine</span>
                </div>
                <span>STATUS: {isExecuting ? 'RUNNING' : 'READY'}</span>
              </div>

              {executionLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-600 text-[11px]">
                  Configure parameters above and click <strong className="text-slate-400">"Run {protocolData.name} Simulation"</strong> to inspect protocol frame exchange.
                </div>
              ) : (
                <div className="space-y-1 text-[11px] leading-relaxed">
                  {executionLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`${
                        log.includes('SUCCESS') || log.includes('200 OK') || log.includes('201 Created') || log.includes('ACK')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('INIT') || log.includes('QUERY') || log.includes('DISCOVER') || log.includes('REQUEST')
                          ? 'text-cyan-300 font-semibold'
                          : log.includes('CACHE MISS') || log.includes('REPLY') || log.includes('OFFER')
                          ? 'text-amber-300'
                          : log.includes('ERROR') || log.includes('404')
                          ? 'text-rose-400 font-bold'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtocolJavaRunner;

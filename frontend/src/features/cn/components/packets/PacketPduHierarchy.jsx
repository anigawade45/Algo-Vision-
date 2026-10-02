import React, { useState } from 'react';
import {
  Layers,
  ArrowDown,
  ArrowUp,
  ShieldCheck,
  Cpu,
  Radio,
  FileText,
  Server,
  Sparkles,
  Info,
  CheckCircle2,
  Binary
} from 'lucide-react';
import { PACKET_TRANSMISSION_DATA } from '../../data/packetTransmissionData';

export function PacketPduHierarchy() {
  const [direction, setDirection] = useState('encapsulation'); // 'encapsulation' (L7->L1) or 'deencapsulation' (L1->L7)
  const [selectedLayerLevel, setSelectedLayerLevel] = useState(3); // default L3 Packet

  const layers = PACKET_TRANSMISSION_DATA.pduLayers;

  const layerDetails = {
    5: {
      name: 'Application Layer: Data / Payload',
      pdu: 'Data',
      protocolExamples: 'HTTP, HTTPS, DNS, SMTP, FTP, SSH',
      layerNumber: 'Layers 7, 6, 5',
      primaryRole: 'User-facing application messages, file byte streams, database queries, and web page content.',
      headerSize: 'Varies (Application headers e.g. HTTP GET / Host / User-Agent)',
      keyFields: [
        { name: 'Payload / Content', desc: 'Raw application bytes sent by the user process (e.g. "GET /index.html HTTP/1.1")' },
        { name: 'Application Headers', desc: 'Metadata like Content-Type: application/json, Cookies, or Authorization headers' }
      ]
    },
    4: {
      name: 'Transport Layer: Segment / Datagram',
      pdu: 'Segment (TCP) or Datagram (UDP)',
      protocolExamples: 'TCP (Port 80, 443), UDP (Port 53, 67)',
      layerNumber: 'Layer 4',
      primaryRole: 'End-to-end process-to-process communication, port multiplexing, segmentation, and reliability.',
      headerSize: '20 Bytes (TCP) or 8 Bytes (UDP)',
      keyFields: [
        { name: 'Source Port (16 bits)', desc: 'Identifies sender client application process (e.g., Ephemeral Port 52412)' },
        { name: 'Destination Port (16 bits)', desc: 'Identifies target server service (e.g., Port 80 for HTTP, 443 for HTTPS)' },
        { name: 'Sequence Number (32 bits)', desc: 'Tracks byte offset in TCP stream to ensure in-order reassembly' },
        { name: 'Acknowledgment Number (32 bits)', desc: 'Confirms receipt of next expected byte from sender' },
        { name: 'Control Flags (9 bits)', desc: 'SYN, ACK, FIN, RST, PSH, URG connection management signals' },
        { name: 'Window Size (16 bits)', desc: 'Flow control buffer capacity advertising receiver availability' },
        { name: 'Checksum (16 bits)', desc: 'Error detection covering TCP pseudo-header, header, and data' }
      ]
    },
    3: {
      name: 'Network Layer: Packet / Datagram',
      pdu: 'Packet (IPv4 / IPv6)',
      protocolExamples: 'IPv4, IPv6, ICMP, OSPF, BGP, ARP',
      layerNumber: 'Layer 3',
      primaryRole: 'Logical end-to-end host addressing, packet routing across intermediate routers, and hop-limit control.',
      headerSize: '20 Bytes (IPv4 base) to 40 Bytes (IPv6 base)',
      keyFields: [
        { name: 'Source IP Address (32 bits)', desc: 'Original host IPv4 address (e.g. 192.168.1.10) preserved across all router hops' },
        { name: 'Destination IP Address (32 bits)', desc: 'Final destination server IPv4 address (e.g. 172.16.0.80)' },
        { name: 'Time-To-Live / TTL (8 bits)', desc: 'Hop counter decremented by 1 at every router to prevent infinite loops (Discarded at TTL=0)' },
        { name: 'Protocol Identifier (8 bits)', desc: 'Specifies next higher-layer protocol (6 = TCP, 17 = UDP, 1 = ICMP)' },
        { name: 'Version & IHL (8 bits)', desc: 'IP version (IPv4 = 4) and Internet Header Length (5 words = 20 bytes)' },
        { name: 'Total Length (16 bits)', desc: 'Entire packet size including IP header and encapsulated payload (up to 65,535 bytes)' },
        { name: 'Identification & Flags (32 bits)', desc: 'Used for IP fragmentation and reassembly when exceeding MTU' },
        { name: 'Header Checksum (16 bits)', desc: 'Recomputed at every router hop due to TTL decrements' }
      ]
    },
    2: {
      name: 'Data Link Layer: Frame',
      pdu: 'Frame (Ethernet II / IEEE 802.3)',
      protocolExamples: 'Ethernet, Wi-Fi (802.11), PPP, VLAN (802.1Q)',
      layerNumber: 'Layer 2',
      primaryRole: 'Hop-by-hop local physical link delivery across direct switches/cables and hardware MAC addressing.',
      headerSize: '14 Bytes Header + 4 Bytes Trailer (FCS)',
      keyFields: [
        { name: 'Destination MAC (48 bits / 6B)', desc: 'Physical hardware address of NEXT HOP router or switch port (Rewritten at every hop)' },
        { name: 'Source MAC (48 bits / 6B)', desc: 'Physical hardware address of the outgoing transmitter interface' },
        { name: 'EtherType (16 bits / 2B)', desc: 'Identifies encapsulated L3 protocol: 0x0800 for IPv4, 0x86DD for IPv6, 0x0806 for ARP' },
        { name: 'Frame Check Sequence / FCS (32 bits / 4B)', desc: 'CRC-32 checksum trailer verifying frame integrity; corrupted frames are silently dropped' }
      ]
    },
    1: {
      name: 'Physical Layer: Bits / Signals',
      pdu: 'Bit / Symbol',
      protocolExamples: '1000BASE-T (Cat6), Fiber (10GBASE-LR), Wi-Fi RF (2.4/5GHz)',
      layerNumber: 'Layer 1',
      primaryRole: 'Transmission of raw binary 1s and 0s over physical copper, optical fiber glass, or wireless radio airwaves.',
      headerSize: 'Preamble (7 Bytes) + Start Frame Delimiter / SFD (1 Byte)',
      keyFields: [
        { name: 'Preamble (56 bits)', desc: 'Alternating 10101010 pattern to synchronize receiver hardware clock clock cycles' },
        { name: 'SFD (8 bits)', desc: '10101011 pattern signaling the immediate start of Ethernet frame destination MAC' },
        { name: 'Physical Modulation', desc: 'Voltage levels (+V / -V), light pulse frequency, or RF QAM phase modulation' }
      ]
    }
  };

  const activeLayer = layerDetails[selectedLayerLevel] || layerDetails[3];

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header & Direction Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              PDU Structure & Protocol Encapsulation Engine
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Understand how PDUs transform from Application Data down to Physical Bits (and vice versa).
          </p>
        </div>

        {/* Encapsulation vs De-encapsulation Mode Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-center font-mono text-xs">
          <button
            onClick={() => setDirection('encapsulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${direction === 'encapsulation'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Encapsulation (L7 ➔ L1)</span>
          </button>
          <button
            onClick={() => setDirection('deencapsulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${direction === 'deencapsulation'
                ? 'bg-emerald-600 text-whSee ite shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>De-encapsulation (L1 ➔ L7)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive PDU Stack & Layer Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual PDU Encapsulation Stack */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              {direction === 'encapsulation' ? 'Sender: Adding Headers' : 'Receiver: Stripping Headers'}
            </span>
            <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-bold">
              Click any PDU to inspect
            </span>
          </div>

          <div className="space-y-2.5">
            {(direction === 'encapsulation' ? layers : [...layers].reverse()).map((item) => {
              const isSelected = selectedLayerLevel === item.level;
              return (
                <button
                  key={item.level}
                  onClick={() => setSelectedLayerLevel(item.level)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                      >
                        L{item.level === 5 ? '7-5' : item.level}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span>PDU: <strong className="text-slate-700 dark:text-slate-200">{item.unit}</strong></span>
                      <span>•</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{item.headersAdded}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {direction === 'encapsulation' ? (
                      <ArrowDown
                        className={`w-4 h-4 transition-transform ${isSelected ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 group-hover:translate-y-0.5'
                          }`}
                      />
                    ) : (
                      <ArrowUp
                        className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-400 group-hover:-translate-y-0.5'
                          }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Educational Concept Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                {direction === 'encapsulation'
                  ? 'Why does Encapsulation happen?'
                  : 'Why does De-encapsulation happen?'}
              </span>
            </div>
            <p className="leading-relaxed text-[11px]">
              {direction === 'encapsulation'
                ? 'Each OSI layer wraps the payload with its own control header containing addressing, multiplexing, sequencing, or error detection without needing to understand the underlying application payload.'
                : 'The receiving host strips each header sequentially: verifying FCS at L2, checking destination IP at L3, reassembling TCP stream at L4, and finally delivering pure application data to the target software process at L7.'}
            </p>
          </div>
        </div>

        {/* Right Column: Layer Inspector & Field Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-4 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-[10px] font-bold">
                    {activeLayer.layerNumber}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {activeLayer.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Protocols: <span className="text-cyan-400">{activeLayer.protocolExamples}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Header Overhead</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {activeLayer.headerSize}
                </span>
              </div>
            </div>

            {/* Primary Role */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Primary Function & Layer Responsibility
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                {activeLayer.primaryRole}
              </p>
            </div>

            {/* Header Fields Table */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Standard Header Structure & Protocol Fields</span>
              </span>

              <div className="space-y-2 font-mono text-xs max-h-[280px] overflow-y-auto pr-1">
                {activeLayer.keyFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-indigo-300 text-xs font-bold">{field.name}</strong>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      {field.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PacketPduHierarchy;

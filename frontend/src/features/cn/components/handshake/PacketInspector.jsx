import React, { useState } from 'react';
import { Table, Eye, Layers, ShieldCheck, Binary, Info } from 'lucide-react';

export function PacketInspector({ loggedPackets, activePacketIndex }) {
  const [selectedPacket, setSelectedPacket] = useState(null);

  const displayedPacket = selectedPacket || (loggedPackets.length > 0 ? loggedPackets[loggedPackets.length - 1] : null);

  const getFlagColor = (flag, val) => {
    if (val === 1) {
      if (flag === 'SYN') return 'bg-amber-500 text-white font-bold';
      if (flag === 'ACK') return 'bg-emerald-600 text-white font-bold';
      if (flag === 'FIN') return 'bg-rose-500 text-white font-bold';
      if (flag === 'PSH') return 'bg-indigo-600 text-white font-bold';
      return 'bg-blue-600 text-white font-bold';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      {/* Left: Wireshark Packet Log Stream (7 cols) */}
      <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-500" />
              <span>Packet Capture Stream</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {loggedPackets.length} captured
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-[#111827] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Flags</th>
                  <th className="py-2.5 px-3">Seq</th>
                  <th className="py-2.5 px-3">Ack</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {loggedPackets.length > 0 ? (
                  loggedPackets.map((pkt, idx) => {
                    const isSelected = displayedPacket?.packetNum === pkt.packetNum;
                    const isClient = pkt.from === 'client';

                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedPacket(pkt)}
                        className={`hover:bg-slate-50 dark:hover:bg-[#1C2638] transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 font-semibold text-emerald-900 dark:text-emerald-200'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-3">{pkt.packetNum}</td>
                        <td className="py-2.5 px-3 text-slate-400">{pkt.timestamp}</td>
                        <td className="py-2.5 px-3">
                          <span className={isClient ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                            {isClient ? '192.168.1.105' : '93.184.216.34'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={!isClient ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                            {!isClient ? '192.168.1.105' : '93.184.216.34'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10.5px] font-bold">
                            {pkt.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">{pkt.seq}</td>
                        <td className="py-2.5 px-3">{pkt.ack || '-'}</td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPacket(pkt);
                            }}
                            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            title="Inspect TCP Header"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-sans text-xs">
                      No packets transmitted yet. Click "Play Flow" or "Next Step".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          Click on any row in the capture stream to inspect its full 20-byte TCP header structure.
        </p>
      </div>

      {/* Right: TCP 20-Byte Header Inspector (5 cols) */}
      <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>TCP Segment Header Inspector</span>
          </h3>
          {displayedPacket && (
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Packet #{displayedPacket.packetNum} ({displayedPacket.type})
            </span>
          )}
        </div>

        {displayedPacket ? (
          <div className="space-y-3 font-mono text-xs">
            {/* Row 1: Source & Destination Ports (16 bits each) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Source Port (16b)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {displayedPacket.from === 'client' ? '49152 (Ephemeral)' : '80 (HTTP)'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Destination Port (16b)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {displayedPacket.to === 'server' ? '80 (HTTP)' : '49152'}
                </span>
              </div>
            </div>

            {/* Row 2: Sequence Number (32 bits) */}
            <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/40">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-semibold">
                Sequence Number (32 bits)
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {displayedPacket.seq}
              </span>
            </div>

            {/* Row 3: Acknowledgment Number (32 bits) */}
            <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                Acknowledgment Number (32 bits)
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {displayedPacket.ack || '0 (No ACK present)'}
              </span>
            </div>

            {/* Row 4: Header Length & Window Size */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Data Offset / Header Len</span>
                <span className="font-bold text-slate-900 dark:text-white">20 Bytes (5 words)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Window Size (16b)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {displayedPacket.windowSize || 65535} bytes
                </span>
              </div>
            </div>

            {/* Row 5: 6 TCP Control Flags (SYN, ACK, FIN, PSH, RST, URG) */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 block font-sans">
                Control Flags (6 bits)
              </span>
              <div className="grid grid-cols-6 gap-1.5 text-center">
                {['SYN', 'ACK', 'FIN', 'PSH', 'RST', 'URG'].map((flag) => {
                  const val = displayedPacket.flags?.[flag] || 0;
                  return (
                    <div key={flag} className={`py-1 rounded-lg text-[10px] ${getFlagColor(flag, val)}`}>
                      <span className="block font-bold">{flag}</span>
                      <span className="text-[9px] opacity-80">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs font-sans">
            Start simulation to inspect transmitted TCP segments.
          </div>
        )}
      </div>
    </div>
  );
}

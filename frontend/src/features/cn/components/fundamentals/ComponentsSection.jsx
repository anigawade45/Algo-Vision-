import React, { useState } from 'react';
import { 
  Laptop, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  Layers, 
  Wifi, 
  Cable,
  Hash,
  Binary
} from 'lucide-react';
import { NETWORK_COMPONENTS_DATA } from '../../data/fundamentalsData';

const MEDIA_COMPARISON = [
  {
    type: 'Twisted Pair Copper (Cat6/6a)',
    distance: '100 meters (328 ft)',
    speed: '1 Gbps – 10 Gbps',
    emiImmunity: 'Moderate (Pair twisting cancels crosstalk)',
    cost: 'Low / Inexpensive',
    connector: 'RJ-45 Connector',
    color: 'emerald',
    icon: Cable,
  },
  {
    type: 'Fiber Optic Cable (Single/Multi Mode)',
    distance: '2 km – 40+ km (Long-haul)',
    speed: '10 Gbps – 400 Gbps+',
    emiImmunity: 'Total (Immune to electromagnetic noise)',
    cost: 'High (Glass core & precision splicing)',
    connector: 'LC / SC / ST Optical Connectors',
    color: 'blue',
    icon: Cable,
  },
  {
    type: 'Coaxial Cable (RG-6 / RG-59)',
    distance: '500 meters',
    speed: '10 Mbps – 1 Gbps (DOCSIS)',
    emiImmunity: 'High (Braided metallic shield)',
    cost: 'Moderate',
    connector: 'BNC / F-Type Screw Connector',
    color: 'amber',
    icon: Cable,
  },
  {
    type: 'Wireless RF (Wi-Fi 6E/7 & 5G)',
    distance: '30m (Indoor Wi-Fi) to kilometers (Cellular/Microwave)',
    speed: '300 Mbps – 9.6 Gbps',
    emiImmunity: 'Susceptible to interference & atmospheric absorption',
    cost: 'Moderate infrastructure',
    connector: 'Antenna Arrays (MIMO / Beamforming)',
    color: 'purple',
    icon: Wifi,
  },
];

export function ComponentsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMediaTab, setActiveMediaTab] = useState(MEDIA_COMPARISON[0]);

  const filteredCategories = selectedCategory === 'all'
    ? NETWORK_COMPONENTS_DATA
    : NETWORK_COMPONENTS_DATA.filter((c) => c.id === selectedCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Category Filter Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-mono font-semibold mb-1">
              <Layers className="w-3 h-3 text-blue-500" />
              <span>NETWORK BUILDING BLOCKS</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Components of a Computer Network
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Modern networks are built on a synergy of end hosts, intermediary routing hardware, transmission conduits, and communication protocols.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All (4)
            </button>
            {NETWORK_COMPONENTS_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat.category.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredCategories.map((cat) => {
            const IconComponent = 
              cat.id === 'end-devices' ? Laptop :
              cat.id === 'intermediary-devices' ? Cpu :
              cat.id === 'media' ? Radio : ShieldCheck;

            return (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {cat.category}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200/60 dark:border-[#1E2638] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          {item.layer}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 dark:text-slate-400">
                        {item.role}
                      </p>
                      <div className="text-[10.5px] font-mono text-slate-400">
                        Example: <span className="text-slate-600 dark:text-slate-300">{item.example}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Transmission Media Deep-Dive Explorer */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-mono font-semibold mb-1">
              <Radio className="w-3 h-3 text-amber-500" />
              <span>GUIDED VS UNGUIDED MEDIA</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Transmission Media Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guided media uses physical conductors (copper/glass), whereas unguided media propagates radio waves through free space.
            </p>
          </div>
        </div>

        {/* Media Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {MEDIA_COMPARISON.map((media, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMediaTab(media)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                activeMediaTab.type === media.type
                  ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#111827] border-slate-200/80 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              <span className="block text-xs font-bold truncate">{media.type.split(' (')[0]}</span>
              <span className="text-[11px] font-mono text-slate-400">{media.speed}</span>
            </button>
          ))}
        </div>

        {/* Active Media Detail Card */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Cable className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{activeMediaTab.type}</h4>
                <span className="text-[11px] font-mono text-slate-400">Connector: {activeMediaTab.connector}</span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-mono text-xs font-bold self-start sm:self-auto">
              Max Speed: {activeMediaTab.speed}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Max Segment Reach</span>
              <span className="text-amber-400 font-bold text-sm">{activeMediaTab.distance}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">EMI Immunity</span>
              <span className="text-slate-200 font-bold text-xs">{activeMediaTab.emiImmunity}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Cost Profile</span>
              <span className="text-slate-200 font-bold text-xs">{activeMediaTab.cost}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Physics Principle</span>
              <span className="text-cyan-400 font-bold text-xs">
                {activeMediaTab.type.includes('Fiber') ? 'Total Internal Reflection' : activeMediaTab.type.includes('Copper') ? 'Electromagnetic Waves' : 'RF Modulation'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Logical IP vs Physical MAC Address Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MAC Address */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-mono uppercase text-purple-600 dark:text-purple-400 font-semibold">Layer 2 Physical Identifier</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">MAC Address (EUI-48)</h4>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A 48-bit (6-byte) hexadecimal identifier permanently burned into the Network Interface Card (NIC). It uniquely identifies the physical network interface on a local LAN.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Example 48-bit MAC:</span>
              <span className="text-purple-400 font-bold">00:1A:2B : 3C:4D:5E</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800">
              <div className="p-1.5 rounded bg-slate-800">
                <span className="text-purple-300 block font-bold">First 24 Bits (OUI):</span>
                <span>Vendor ID (e.g. Cisco/Apple)</span>
              </div>
              <div className="p-1.5 rounded bg-slate-800">
                <span className="text-cyan-300 block font-bold">Last 24 Bits:</span>
                <span>Unique Device Serial</span>
              </div>
            </div>
          </div>
        </div>

        {/* IP Address */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-mono uppercase text-blue-600 dark:text-blue-400 font-semibold">Layer 3 Logical Identifier</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">IP Address (IPv4 / IPv6)</h4>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A 32-bit (IPv4) or 128-bit (IPv6) logical numerical label assigned dynamically or statically by routers and DHCP to deliver packets across global subnets.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Example 32-bit IPv4:</span>
              <span className="text-blue-400 font-bold">192.168.1.45 / 24</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800">
              <div className="p-1.5 rounded bg-slate-800">
                <span className="text-blue-300 block font-bold">Network ID (192.168.1):</span>
                <span>Subnet location identifier</span>
              </div>
              <div className="p-1.5 rounded bg-slate-800">
                <span className="text-emerald-300 block font-bold">Host ID (.45):</span>
                <span>Individual host address</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Globe,
  Lock,
  Search,
  Radio,
  Folder,
  Mail,
  Activity,
  Code2,
  ChevronRight,
  Layers,
  Filter,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { PROTOCOLS_DATA } from '../../data/protocolsData';

export function ProtocolSidebar({
  activeProtocolId,
  onSelectProtocol,
  isOpenMobile,
  onToggleMobile
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLayer, setFilterLayer] = useState('ALL'); // 'ALL', 'L7', 'L3_L2'

  const protocolsList = Object.values(PROTOCOLS_DATA);

  const getProtocolIcon = (id) => {
    switch (id) {
      case 'http':
        return Globe;
      case 'https':
        return Lock;
      case 'dns':
        return Search;
      case 'dhcp':
        return Radio;
      case 'arp':
        return Layers;
      case 'ftp':
        return Folder;
      case 'smtp':
        return Mail;
      case 'icmp':
        return Activity;
      default:
        return Globe;
    }
  };

  const filteredProtocols = protocolsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.layer.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterLayer === 'L7') {
      return p.category === 'Application';
    } else if (filterLayer === 'L3_L2') {
      return p.category === 'Network';
    }
    return true;
  });

  return (
    <aside
      className={`w-full lg:w-72 shrink-0 flex flex-col rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-sm transition-all duration-300 ${
        isOpenMobile ? 'block' : 'hidden lg:flex'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Protocols Hub
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                8 Core Network Protocols
              </span>
            </div>
          </div>

          {/* Mobile close button */}
          {onToggleMobile && (
            <button
              onClick={onToggleMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search protocol..."
            className="w-full bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Layer Filter Pills */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <button
            onClick={() => setFilterLayer('ALL')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              filterLayer === 'ALL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All (8)
          </button>
          <button
            onClick={() => setFilterLayer('L7')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              filterLayer === 'L7'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            App Layer (6)
          </button>
          <button
            onClick={() => setFilterLayer('L3_L2')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              filterLayer === 'L3_L2'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Net / Link (2)
          </button>
        </div>
      </div>

      {/* Protocols Vertical List */}
      <div className="p-2 sm:p-3 flex-1 overflow-y-auto space-y-1.5 custom-scrollbar max-h-[calc(100vh-260px)]">
        {filteredProtocols.map((p) => {
          const IconComponent = getProtocolIcon(p.id);
          const isActive = activeProtocolId === p.id;

          return (
            <button
              key={p.id}
              onClick={() => {
                onSelectProtocol(p.id);
                if (onToggleMobile) onToggleMobile();
              }}
              className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/80 shadow-sm shadow-emerald-500/10'
                  : 'hover:bg-slate-50 dark:hover:bg-[#111827] border border-transparent text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <IconComponent className="w-4.5 h-4.5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold tracking-tight ${
                        isActive ? 'text-emerald-900 dark:text-white' : 'text-slate-900 dark:text-slate-200'
                      }`}
                    >
                      {p.name}
                    </span>
                    {p.hasJavaCode && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                        JAVA
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {p.fullName}
                  </p>
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 translate-x-0.5'
                    : 'text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>5 Java Simulators</span>
        <span className="flex items-center gap-1 text-emerald-500 font-bold">
          <CheckCircle2 className="w-3 h-3" />
          Live Lab
        </span>
      </div>
    </aside>
  );
}

export default ProtocolSidebar;

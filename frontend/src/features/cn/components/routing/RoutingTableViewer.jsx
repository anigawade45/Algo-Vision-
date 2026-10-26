import React from 'react';
import { Table } from 'lucide-react';

export function RoutingTableViewer({ sourceId, destId, routingTable, finalPath, totalCost }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-sm font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Router {sourceId} Forwarding &amp; Routing Table
          </h3>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
          OSPF Link-State
        </span>
      </div>

      {/* Shortest Path Summary Card */}
      {finalPath && finalPath.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Shortest Route ({sourceId} &rarr; {destId}):</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
              {finalPath.join(' → ')}
            </span>
          </div>

          <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
            Total Metric Cost: <span className="text-base font-extrabold">{totalCost}</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 dark:bg-[#111827] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Destination</th>
              <th className="py-2.5 px-3">Network IP</th>
              <th className="py-2.5 px-3">Next Hop Router</th>
              <th className="py-2.5 px-3">Metric Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {routingTable.map((row) => {
              const isTarget = row.destination === destId;
              return (
                <tr
                  key={row.destination}
                  className={`hover:bg-slate-50 dark:hover:bg-[#1C2638] transition-colors ${
                    isTarget
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-bold text-emerald-900 dark:text-emerald-200'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3">Router {row.destination}</td>
                  <td className="py-2.5 px-3 text-slate-400">{row.destIp}</td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                    {row.nextHop === '-' ? 'Direct / Local' : `Router ${row.nextHop}`}
                  </td>
                  <td
                    className="py-2.5 px-3 font-bold"
                    dangerouslySetInnerHTML={{ __html: row.cost }}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

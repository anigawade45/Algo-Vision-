import React from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

/**
 * OutputDataRenderer Component
 * Dedicated renderer for expected output data across all 10 DSA problem types.
 * Supports: indices, boolean, number, linked_list, array, intervals, matrix, string, and structured outputs.
 * Wrapped in React.memo for optimal rendering performance.
 */
export const OutputDataRenderer = React.memo(function OutputDataRenderer({ outputData, rawOutput, label = 'EXPECTED OUTPUT' }) {
  if (!outputData && rawOutput === undefined) return null;

  // Derive output type and value safely
  let type = typeof outputData === 'object' && outputData !== null ? outputData.type : undefined;
  let value = typeof outputData === 'object' && outputData !== null ? outputData.value : outputData;

  // Fallback type detection if outputData is passed directly as raw value
  if (!type) {
    if (typeof value === 'boolean') type = 'boolean';
    else if (typeof value === 'number') type = 'number';
    else if (typeof value === 'string') type = 'string';
    else if (Array.isArray(value)) {
      if (value.length > 0 && Array.isArray(value[0])) type = 'intervals';
      else type = 'array';
    }
  }

  const finalValue = value !== undefined ? value : rawOutput;

  return (
    <div className="space-y-1 font-mono text-xs">
      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
        {label}:
      </span>

      <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold transition-all duration-150">
        {/* TYPE 1: Indices */}
        {type === 'indices' && Array.isArray(finalValue) && (
          <div className="flex items-center gap-2">
            <span>Indices:</span>
            <span className="px-2.5 py-1 rounded bg-white dark:bg-[#0F172A] border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm shadow-xs">
              [{finalValue.join(', ')}]
            </span>
          </div>
        )}

        {/* TYPE 2: Boolean */}
        {type === 'boolean' && (
          <div className="flex items-center gap-2 text-sm font-extrabold tracking-wider">
            {finalValue === true ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                <span>TRUE (Valid)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4 text-rose-500" aria-hidden="true" />
                <span>FALSE (Invalid)</span>
              </span>
            )}
          </div>
        )}

        {/* TYPE 3: Linked List */}
        {type === 'linked_list' && (Array.isArray(finalValue) || Array.isArray(outputData?.nodes)) && (
          <div className="flex items-center gap-2 overflow-x-auto py-1" aria-label="Output linked list structure">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mr-1 shrink-0">
              HEAD ➔
            </span>
            {(Array.isArray(finalValue) ? finalValue : outputData?.nodes || []).map((val, idx) => (
              <React.Fragment key={idx}>
                <span className="px-2.5 py-1 rounded bg-white dark:bg-[#0F172A] border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs">
                  {val}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
              </React.Fragment>
            ))}
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              null
            </span>
          </div>
        )}

        {/* TYPE 4: Intervals */}
        {type === 'intervals' && (Array.isArray(finalValue) || Array.isArray(outputData?.ranges)) && (
          <div className="flex flex-wrap items-center gap-2">
            {(Array.isArray(finalValue) ? finalValue : outputData?.ranges || []).map((range, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded bg-white dark:bg-[#0F172A] border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs shadow-xs"
              >
                [{Array.isArray(range) ? range.join(', ') : range}]
              </span>
            ))}
          </div>
        )}

        {/* TYPE 5: Number / Integer */}
        {type === 'number' && (
          <div className="flex items-center gap-2">
            <span>Result Value:</span>
            <span className="px-3 py-1 rounded bg-white dark:bg-[#0F172A] border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm shadow-xs">
              {String(finalValue)}
            </span>
          </div>
        )}

        {/* TYPE 6: String */}
        {type === 'string' && (
          <div className="flex items-center gap-2">
            <span>Result Substring:</span>
            <span className="px-3 py-1 rounded bg-white dark:bg-[#0F172A] border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm shadow-xs">
              "{String(finalValue)}"
            </span>
          </div>
        )}

        {/* TYPE 7: Array */}
        {type === 'array' && Array.isArray(finalValue) && (
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-sm font-bold">
            <span className="text-emerald-600 dark:text-emerald-400">[</span>
            {finalValue.map((val, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-white dark:bg-[#0F172A] border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-xs"
              >
                {val}
                {idx < finalValue.length - 1 ? ',' : ''}
              </span>
            ))}
            <span className="text-emerald-600 dark:text-emerald-400">]</span>
          </div>
        )}

        {/* DEFAULT FALLBACK */}
        {!['indices', 'boolean', 'linked_list', 'intervals', 'number', 'string', 'array'].includes(type) && (
          <div>
            {typeof finalValue === 'object' ? JSON.stringify(finalValue) : String(finalValue ?? rawOutput)}
          </div>
        )}
      </div>
    </div>
  );
});

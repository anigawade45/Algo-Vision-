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
    <div className="font-mono text-xs flex flex-wrap items-center gap-2 py-1">
      <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
        {label}:
      </span>

      <span className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
        {/* TYPE 1: Indices */}
        {type === 'indices' && Array.isArray(finalValue) && `[${finalValue.join(', ')}]`}

        {/* TYPE 2: Boolean */}
        {type === 'boolean' && (
          <span className="inline-flex items-center gap-1.5 font-extrabold tracking-wider">
            {finalValue === true ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>TRUE (Valid)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
                <span>FALSE (Invalid)</span>
              </span>
            )}
          </span>
        )}

        {/* TYPE 3: Linked List */}
        {type === 'linked_list' && (Array.isArray(finalValue) || Array.isArray(outputData?.nodes)) && (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
              HEAD
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
            {(Array.isArray(finalValue) ? finalValue : outputData?.nodes || []).map((val, idx) => (
              <React.Fragment key={idx}>
                <span className="inline-flex items-stretch rounded border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-[#0D1322] overflow-hidden divide-x divide-emerald-200 dark:divide-emerald-900/60">
                  <span className="px-2 py-0.5 font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {val}
                  </span>
                  <span className="px-1 py-0.5 bg-emerald-50/50 dark:bg-[#070A13] text-emerald-600/70 dark:text-emerald-400/70 font-mono text-[9px] font-bold uppercase">
                    next
                  </span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
              </React.Fragment>
            ))}
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Null
            </span>
          </span>
        )}

        {/* TYPE 4: Intervals */}
        {type === 'intervals' && (Array.isArray(finalValue) || Array.isArray(outputData?.ranges)) && (
          `[${(Array.isArray(finalValue) ? finalValue : outputData?.ranges || []).map((r) => `[${Array.isArray(r) ? r.join(', ') : r}]`).join(', ')}]`
        )}

        {/* TYPE 5: Number / Integer */}
        {(type === 'number' || type === 'integer') && String(finalValue)}

        {/* TYPE 6: String */}
        {type === 'string' && `"${String(finalValue)}"`}

        {/* TYPE 7: Array */}
        {type === 'array' && Array.isArray(finalValue) && (
          Array.isArray(finalValue[0])
            ? `[${finalValue.map(sub => `[${sub.join(', ')}]`).join(', ')}]`
            : `[${finalValue.join(', ')}]`
        )}

        {/* DEFAULT FALLBACK */}
        {!['indices', 'boolean', 'linked_list', 'intervals', 'number', 'integer', 'string', 'array'].includes(type) && (
          typeof finalValue === 'object' ? JSON.stringify(finalValue) : String(finalValue ?? rawOutput)
        )}
      </span>
    </div>
  );
});

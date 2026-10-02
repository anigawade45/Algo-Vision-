import React from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

/**
 * OutputDataRenderer Component
 * Dedicated renderer for expected output data across all 10 DSA problem types.
 * Supports: indices, boolean, number, linked_list, array, intervals, matrix, string, and structured outputs.
 * Wrapped in React.memo for optimal rendering performance.
 */
export const OutputDataRenderer = React.memo(function OutputDataRenderer({ outputData, rawOutput, problemType, category, label = 'EXPECTED OUTPUT' }) {
  if (!outputData && rawOutput === undefined) return null;

  // Derive output type and value safely
  let type = typeof outputData === 'object' && outputData !== null ? outputData.type : problemType;
  let value = typeof outputData === 'object' && outputData !== null ? outputData.value : outputData;

  const finalValue = value !== undefined ? value : rawOutput;

  const isLinkedListType =
    type === 'linked_list' ||
    type === 'linkedlist' ||
    problemType === 'linked_list' ||
    problemType === 'linkedlist' ||
    (category && String(category).toLowerCase().includes('linked list')) ||
    outputData?.head ||
    outputData?.nodes ||
    (typeof finalValue === 'string' && (finalValue.includes('->') || finalValue.includes('head')));

  let listNodes = null;
  if (isLinkedListType) {
    type = 'linked_list';
    if (Array.isArray(outputData?.nodes)) listNodes = outputData.nodes;
    else if (Array.isArray(outputData?.head)) listNodes = outputData.head;
    else if (Array.isArray(finalValue)) listNodes = finalValue;
    else if (typeof finalValue === 'string') {
      if (finalValue.includes('->')) {
        listNodes = finalValue
          .split('->')
          .map((s) => s.trim())
          .filter((s) => s.toLowerCase() !== 'null' && s.length > 0);
      } else {
        const match = finalValue.match(/\[([\d\s,.-]*)\]/);
        if (match) {
          try {
            listNodes = match[1].trim() === '' ? [] : JSON.parse(`[${match[1]}]`);
          } catch (e) {
            listNodes = [];
          }
        } else if (finalValue.trim() === '[]' || finalValue.trim() === 'null') {
          listNodes = [];
        }
      }
    }
  }

  let outputMatrix = null;
  if (Array.isArray(finalValue) && finalValue.length > 0 && Array.isArray(finalValue[0]) && type !== 'intervals') {
    outputMatrix = finalValue;
  } else if (typeof finalValue === 'string') {
    const str = finalValue.trim();
    if (str.startsWith('[[')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0]) && type !== 'intervals') {
          outputMatrix = parsed;
        }
      } catch (e) {}
    }
  }

  // Fallback type detection if outputData is passed directly as raw value
  if (!type) {
    if (outputMatrix) type = 'matrix';
    else if (typeof value === 'boolean') type = 'boolean';
    else if (typeof value === 'number') type = 'number';
    else if (typeof value === 'string') {
      if (value.includes('->')) {
        type = 'linked_list';
        listNodes = value.split('->').map(s => s.trim()).filter(s => s.toLowerCase() !== 'null' && s.length > 0);
      } else {
        type = 'string';
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0 && Array.isArray(value[0])) type = 'intervals';
      else type = 'array';
    }
  }

  return (
    <div className="font-mono text-xs space-y-2 py-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          {label}:
        </span>

        {!outputMatrix && (
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
            {type === 'linked_list' && (
              <span className="inline-flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 border border-emerald-300 dark:border-emerald-800">
                  HEAD
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />

                {listNodes && listNodes.length > 0 ? (
                  listNodes.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <span className="inline-flex items-stretch rounded-xl border border-emerald-400 dark:border-emerald-700/80 bg-white dark:bg-[#0D1322] shadow-xs overflow-hidden divide-x divide-emerald-200 dark:divide-emerald-900/60">
                        <span className="px-3 py-1.5 font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400 min-w-[36px] text-center flex items-center justify-center">
                          {val}
                        </span>
                        <span className="px-2 py-1.5 bg-emerald-50/60 dark:bg-[#070A13] flex items-center justify-center text-emerald-600/80 dark:text-emerald-400/80 font-mono text-[10px] font-bold uppercase tracking-wider">
                          NEXT
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                    </React.Fragment>
                  ))
                ) : null}

                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
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
            {!['indices', 'boolean', 'linked_list', 'intervals', 'number', 'integer', 'string', 'array', 'matrix'].includes(type) && (
              typeof finalValue === 'object' ? JSON.stringify(finalValue) : String(finalValue ?? rawOutput)
            )}
          </span>
        )}
      </div>

      {/* TYPE 8: 2D Matrix Visual Output */}
      {outputMatrix && (
        <div className="pt-1 font-mono">
          <div className="inline-block p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5 shadow-xs">
            <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
              2D OUTPUT MATRIX ({outputMatrix.length} × {outputMatrix[0]?.length || 0})
            </div>

            {/* Column Headers */}
            <div className="flex items-center gap-1.5 ml-8">
              {outputMatrix[0]?.map((_, cIdx) => (
                <span key={cIdx} className="w-9 text-center text-[9px] font-mono text-emerald-600/70 dark:text-emerald-400/70">
                  c{cIdx}
                </span>
              ))}
            </div>

            {/* Grid Rows */}
            {outputMatrix.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1.5">
                <span className="w-6 text-right text-[9px] font-mono text-emerald-600/70 dark:text-emerald-400/70 mr-1">
                  r{rIdx}
                </span>
                {row.map((cell, cIdx) => (
                  <div
                    key={cIdx}
                    className="w-9 h-9 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-[#0D1322] text-emerald-700 dark:text-emerald-300 font-mono text-xs font-extrabold flex items-center justify-center shadow-xs"
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

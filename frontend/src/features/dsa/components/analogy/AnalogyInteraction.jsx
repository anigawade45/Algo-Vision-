import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertCircle, RotateCcw, Sparkles, Lightbulb, Wand2, ArrowRight } from 'lucide-react';

function getItemVisualIcon(item, index, title = '') {
  const text = `${item.label || ''} ${item.priceDisplay || ''} ${item.value || ''} ${title}`.toLowerCase();

  if (text.includes('box') || text.includes('lid') || text.includes('{') || text.includes('(')) return '🎁';
  if (text.includes('carriage') || text.includes('train') || text.includes('engine')) return '🚂';
  if (text.includes('tree') || text.includes('node') || text.includes('root') || text.includes('leaf')) return '🌿';
  if (text.includes('island') || text.includes('archipelago') || text.includes('land')) return '🏝️';
  if (text.includes('player') || text.includes('rank') || text.includes('medal') || text.includes('score')) return '🏆';
  if (text.includes('window') || text.includes('camera') || text.includes('max')) return '📷';
  if (text.includes('meeting') || text.includes('interval') || text.includes('slot')) return '📅';
  if (text.includes('specialist') || text.includes('badge') || text.includes('worker')) return '👤';
  if (text.includes('station') || text.includes('transfer') || text.includes('subway')) return '🚉';
  if (text.includes('stride') || text.includes('step') || text.includes('stair')) return '🪜';
  if (text.includes('house') || text.includes('loot') || text.includes('apple') || text.includes('orchard')) return '🏠';
  if (text.includes('topping') || text.includes('pizza') || text.includes('mushroom') || text.includes('pepperoni')) return '🍕';
  if (text.includes('flight') || text.includes('course') || text.includes('module') || text.includes('prereq')) return '✈️';
  if (text.includes('book') || text.includes('shelf') || text.includes('library')) return '📚';
  if (text.includes('song') || text.includes('vote') || text.includes('radio') || text.includes('frequent')) return '🎵';
  if (text.includes('gear') || text.includes('ratio') || text.includes('teeth')) return '⚙️';
  if (text.includes('sock') || text.includes('laundry') || text.includes('pair')) return '🧦';
  if (text.includes('stone') || text.includes('detective') || text.includes('step')) return '🧱';
  if (text.includes('price') || text.includes('grocery') || text.includes('item') || text.includes('₹')) return '🏷️';

  return '✨';
}

/**
 * INTERACTIVE DISCOVERY COMPONENT
 * Allows learner to select items, displays live relationship vs target,
 * gives educational feedback for incorrect choices, toggles hints, auto-solves, and unlocks discovery.
 */
export function AnalogyInteraction({ scenario, interaction, onDiscoveryStateChange }) {
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isDiscovered, setIsDiscovered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Reset local state when scenario or interaction changes
  useEffect(() => {
    setSelectedItemIds([]);
    setFeedback(null);
    setIsDiscovered(false);
    setShowHint(false);
    if (onDiscoveryStateChange) {
      onDiscoveryStateChange(false);
    }
  }, [scenario?.title, interaction?.targetValue]);

  if (!scenario || !interaction) return null;

  const { items = [], target } = scenario;
  const { requiredCount, targetValue, correctPairIds = [], validPairs = [], successMessage, bridgeMessage } = interaction;
  const targetCount = requiredCount || (correctPairIds.length > 0 ? correctPairIds.length : 2);

  const evaluateSelection = (nextSelected) => {
    if (nextSelected.length === targetCount) {
      const selectedItems = items.filter((it) => nextSelected.includes(it.id));
      const numericSum = selectedItems.reduce((acc, current) => {
        const val = typeof current.value === 'number' ? current.value : 0;
        return acc + val;
      }, 0);

      // Check correctness by ID match, validPairs match, or numeric sum match
      const isCorrectById =
        (validPairs.length > 0 && validPairs.some((pair) => pair.every((cId) => nextSelected.includes(cId)))) ||
        (correctPairIds.length === targetCount && correctPairIds.every((cId) => nextSelected.includes(cId)));

      const isCorrectBySum =
        interaction.type === 'pair_sum' && typeof targetValue === 'number' && numericSum === targetValue;

      if (isCorrectById || isCorrectBySum) {
        setIsDiscovered(true);
        setFeedback({
          type: 'success',
          message: successMessage || 'You found the item(s) that satisfy the target condition!',
          bridge: bridgeMessage || 'That is exactly how this problem structure works.',
        });
        if (onDiscoveryStateChange) {
          onDiscoveryStateChange(true);
        }
      } else {
        setIsDiscovered(false);
        let customMessage = '';
        if (targetCount === 1) {
          const item1 = selectedItems[0];
          const val1Str = item1?.priceDisplay || item1?.label || item1?.value;
          customMessage = `Selection "${val1Str}" does not satisfy target ${target?.display || targetValue}.`;
        } else if (interaction.type === 'pair_sum') {
          const valStrs = selectedItems.map(it => it?.priceDisplay || it?.value).join(' + ');
          const targetStr = target?.display || targetValue;
          const unitStr = target?.unit ? ` ${target.unit}` : '';
          customMessage = `Selection total ${valStrs} = ${numericSum}${unitStr}, not ${targetStr}.`;
        } else {
          const valStrs = selectedItems.map(it => `"${it?.priceDisplay || it?.label || 'Item'}"`).join(' and ');
          customMessage = `Selecting ${valStrs} does not satisfy the target condition.`;
        }

        setFeedback({
          type: 'error',
          message: customMessage,
          bridge: 'Try selecting a different card combination.',
        });
        if (onDiscoveryStateChange) {
          onDiscoveryStateChange(false);
        }
      }
    } else {
      setFeedback(null);
      setIsDiscovered(false);
      if (onDiscoveryStateChange) {
        onDiscoveryStateChange(false);
      }
    }
  };

  const handleItemClick = (itemId) => {
    let nextSelected = [];

    if (selectedItemIds.includes(itemId)) {
      // Toggle off if already selected
      nextSelected = selectedItemIds.filter((id) => id !== itemId);
    } else {
      if (selectedItemIds.length < targetCount) {
        nextSelected = [...selectedItemIds, itemId];
      } else {
        // Replace oldest selection if max reached
        nextSelected = targetCount === 1 ? [itemId] : [...selectedItemIds.slice(1), itemId];
      }
    }

    setSelectedItemIds(nextSelected);
    evaluateSelection(nextSelected);
  };

  const handleAutoSolve = () => {
    let targetPair = [];
    if (correctPairIds && correctPairIds.length > 0) {
      targetPair = correctPairIds;
    } else if (validPairs && validPairs.length > 0) {
      targetPair = validPairs[0];
    } else {
      targetPair = items.slice(0, targetCount).map((it) => it.id);
    }
    setSelectedItemIds(targetPair);
    evaluateSelection(targetPair);
  };

  const handleReset = () => {
    setSelectedItemIds([]);
    setFeedback(null);
    setIsDiscovered(false);
    if (onDiscoveryStateChange) {
      onDiscoveryStateChange(false);
    }
  };

  // Derive formula calculation string for selected items
  const selectedObjects = items.filter((it) => selectedItemIds.includes(it.id));
  const selectedSum = selectedObjects.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0);

  return (
    <section className="space-y-4" aria-label="Interactive Discovery">
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-sm space-y-6">
        
        {/* Interactive Guidance Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-slate-100 dark:border-[#162032] pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px] uppercase tracking-wider">
              YOUR TASK
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              SELECT {targetCount} {targetCount === 1 ? 'ITEM' : 'ITEMS'}
            </span>
            <div className="flex items-center gap-1 ml-1">
              {Array.from({ length: targetCount }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < selectedItemIds.length
                      ? 'bg-blue-600 dark:bg-blue-400 scale-110 ring-2 ring-blue-400/30'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isDiscovered && (
              <button
                type="button"
                onClick={handleAutoSolve}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/60 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Wand2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Auto-Select Solution</span>
              </button>
            )}

            {selectedItemIds.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Item Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, index) => {
            const selectedIndex = selectedItemIds.indexOf(item.id);
            const isSelected = selectedIndex !== -1;
            const isCorrectPair = isDiscovered && isSelected;
            const isIncorrectPair = feedback?.type === 'error' && isSelected;
            const icon = getItemVisualIcon(item, index, scenario?.title);

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleItemClick(item.id)}
                className={`group relative p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer min-h-[110px] flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98] ${
                  isCorrectPair
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : isIncorrectPair
                    ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-500 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/40 shadow-sm'
                    : isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-slate-50/80 dark:bg-[#070A13] border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-[#0F172A] hover:-translate-y-0.5'
                }`}
              >
                {/* Selection Order Badge */}
                {isSelected && (
                  <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-extrabold shadow-sm ${
                    isCorrectPair ? 'bg-emerald-500 text-white' : isIncorrectPair ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {selectedIndex + 1}
                  </span>
                )}

                {/* Item Header / Label */}
                <div className="flex items-center justify-between w-full gap-1.5">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-base select-none shrink-0" aria-hidden="true">{icon}</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-85 truncate">
                      {item.label || `Item #${index + 1}`}
                    </span>
                  </div>
                </div>

                {/* Item Price / Value Display */}
                <div className="pt-2 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight">
                    {item.priceDisplay || item.value}
                  </span>
                  {isSelected && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-2xs ${
                      isCorrectPair
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
                        : isIncorrectPair
                        ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100'
                        : 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    }`}>
                      Selected #{selectedIndex + 1}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Relationship Calculator Display */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/60 dark:border-[#162032] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span>TARGET CONDITION</span>
            </span>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/60">
              <Target className="w-3.5 h-3.5" aria-hidden="true" />
              <span>TARGET: {target?.display || target?.value}</span>
            </div>
          </div>

          <div className="flex items-center justify-center min-h-[48px] py-2 px-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800/80 text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white transition-all">
            {selectedObjects.length === 0 && (
              <span className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm text-center flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
                <span>{interaction.hint || `Tap ${targetCount} ${targetCount === 1 ? 'card' : 'cards'} above to test target condition (${target?.display || target?.value})`}</span>
              </span>
            )}

            {selectedObjects.length > 0 && selectedObjects.length < targetCount && (
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Selected: <span className="font-bold text-blue-600 dark:text-blue-400">{selectedObjects.map((it) => it.priceDisplay || it.value).join(interaction.type === 'pair_sum' ? ' + ' : ' & ')}</span> ... <span className="text-slate-400 italic font-normal">(Pick {targetCount - selectedObjects.length} more)</span>
              </span>
            )}

            {selectedObjects.length === targetCount && (
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                {interaction.type === 'pair_sum' ? (
                  <span>
                    {selectedObjects.map((it) => it.priceDisplay || it.value).join(' + ')} = <span className="text-blue-600 dark:text-blue-400 font-extrabold">{selectedSum}{target?.unit ? ` ${target.unit}` : ''}</span>
                  </span>
                ) : (
                  <span>
                    Selected: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{selectedObjects.map((it) => it.priceDisplay || it.value).join(' & ')}</span>
                  </span>
                )}

                {isDiscovered ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-extrabold animate-pulse">
                    ✓ MATCHES TARGET!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
                    ≠ TARGET ({target?.display || target?.value})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Hint Callout */}
        {interaction.hint && (
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1.5 py-0.5 bg-blue-50/50 dark:bg-blue-950/30"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                <span>{showHint ? 'Hide Interactive Hint' : '💡 Need a Hint?'}</span>
              </button>
            </div>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200 font-sans leading-relaxed flex items-start gap-2.5 animate-fadeIn">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="font-mono font-bold uppercase tracking-wider block text-[10px] text-blue-700 dark:text-blue-300 mb-0.5">Analogy Hint:</strong>
                  <span>{interaction.hint}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Educational Feedback Message & Discovery Moment */}
        {feedback && (
          <div
            aria-live="polite"
            className={`p-4 sm:p-5 rounded-xl border space-y-2 transition-all duration-300 motion-reduce:transition-none shadow-sm ${
              feedback.type === 'success'
                ? 'bg-emerald-50/95 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500/30'
                : 'bg-amber-50/95 dark:bg-amber-950/50 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {feedback.type === 'success' ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/80 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                </div>
              )}

              <div className="space-y-1.5 text-xs sm:text-sm font-sans flex-1">
                {feedback.type === 'success' && (
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                    <span>DISCOVERY MOMENT UNLOCKED!</span>
                  </div>
                )}
                <p className="font-bold text-sm sm:text-base leading-snug">{feedback.message}</p>
                <p className="opacity-90 font-medium leading-relaxed text-xs sm:text-sm">{feedback.bridge}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default AnalogyInteraction;


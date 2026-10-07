/**
 * Standardized Semantic Highlight Tokens for AlgoVision Visualization Primitives
 * Maps high-level algorithm concepts (current, active, visited, changed, matched, etc.)
 * to consistent visual hierarchy styles across all primitives.
 */

export const SEMANTIC_HIGHLIGHTS = {
  CURRENT: 'current',
  ACTIVE: 'active',
  VISITED: 'visited',
  CHANGED: 'changed',
  MATCHED: 'matched',
  POPPED: 'popped',
  SWAPPED: 'swapped',
  RESULT: 'result',
  WARNING: 'warning',
  SUCCESS: 'success',
};

export const semanticHighlights = SEMANTIC_HIGHLIGHTS;


export const SEMANTIC_HIGHLIGHT_STYLES = {
  [SEMANTIC_HIGHLIGHTS.CURRENT]: {
    border: 'border-blue-700 dark:border-blue-500',
    bg: 'bg-blue-600 dark:bg-blue-600 text-white',
    ring: 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/30 font-bold scale-105',
    badge: 'blue',
  },
  [SEMANTIC_HIGHLIGHTS.ACTIVE]: {
    border: 'border-sky-600 dark:border-sky-500',
    bg: 'bg-sky-500 text-white',
    ring: 'ring-2 ring-sky-400 shadow-md shadow-sky-500/20 font-bold',
    badge: 'indigo',
  },
  [SEMANTIC_HIGHLIGHTS.VISITED]: {
    border: 'border-emerald-600 dark:border-emerald-500',
    bg: 'bg-emerald-600 text-white',
    ring: 'ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20 font-bold',
    badge: 'emerald',
  },
  [SEMANTIC_HIGHLIGHTS.CHANGED]: {
    border: 'border-amber-400 dark:border-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100',
    ring: 'ring-1 ring-amber-400/50',
    badge: 'amber',
  },
  [SEMANTIC_HIGHLIGHTS.MATCHED]: {
    border: 'border-emerald-600 dark:border-emerald-500',
    bg: 'bg-emerald-500 text-white',
    ring: 'ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20 font-bold',
    badge: 'emerald',
  },
  [SEMANTIC_HIGHLIGHTS.POPPED]: {
    border: 'border-rose-600 dark:border-rose-500',
    bg: 'bg-rose-500 text-white',
    ring: 'ring-2 ring-rose-400 shadow-md shadow-rose-500/20 font-bold animate-pulse',
    badge: 'rose',
  },
  [SEMANTIC_HIGHLIGHTS.SWAPPED]: {
    border: 'border-amber-600 dark:border-amber-500',
    bg: 'bg-amber-500 text-white',
    ring: 'ring-2 ring-amber-400 shadow-md shadow-amber-500/20 font-bold scale-105',
    badge: 'amber',
  },
  [SEMANTIC_HIGHLIGHTS.RESULT]: {
    border: 'border-emerald-600 dark:border-emerald-500',
    bg: 'bg-emerald-600 text-white',
    ring: 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30 font-bold',
    badge: 'emerald',
  },
  [SEMANTIC_HIGHLIGHTS.WARNING]: {
    border: 'border-rose-500 dark:border-rose-600',
    bg: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
    ring: 'ring-1 ring-rose-400',
    badge: 'rose',
  },
};

/**
 * Utility helper to resolve semantic highlight classes for a given highlight key
 * @param {string} stateKey - Key like 'current', 'active', 'visited', etc.
 * @returns {string} Tailwind CSS class string
 */
export function getHighlightClass(stateKey) {
  if (!stateKey) return '';
  const styleObj = SEMANTIC_HIGHLIGHT_STYLES[stateKey.toLowerCase()];
  if (!styleObj) return '';
  return `${styleObj.border || ''} ${styleObj.bg || ''} ${styleObj.ring || ''}`.trim();
}


/**
 * Distributed Caching & Eviction Strategy Utilities
 * Pure helper functions for cache evaluation, eviction policies, and latency calculations
 */

/**
 * Calculates Cache Hit Ratio percentage
 *
 * @param {number} hits - Number of cache hits
 * @param {number} totalRequests - Total cache requests (hits + misses)
 * @returns {{ ratio: number, percentage: string }}
 */
export function calculateHitRatio(hits, totalRequests) {
  if (!totalRequests || totalRequests <= 0) {
    return { ratio: 0, percentage: '0.0%' };
  }
  const ratio = hits / totalRequests;
  const percentage = `${(ratio * 100).toFixed(1)}%`;
  return { ratio, percentage };
}

/**
 * Computes Effective Access Time (EAT) / Average Latency:
 * EAT = (Hit Ratio × Cache Latency) + ((1 - Hit Ratio) × DB Latency)
 *
 * @param {number} hitRatio - Hit ratio between 0 and 1
 * @param {number} [cacheLatencyMs=1.5] - In-memory cache latency (ms)
 * @param {number} [dbLatencyMs=85] - Fallback database latency (ms)
 * @returns {number} Average estimated latency in milliseconds
 */
export function estimateAverageLatency(hitRatio, cacheLatencyMs = 1.5, dbLatencyMs = 85) {
  const boundedRatio = Math.max(0, Math.min(1, hitRatio));
  const avg = (boundedRatio * cacheLatencyMs) + ((1 - boundedRatio) * dbLatencyMs);
  return Number(avg.toFixed(2));
}

/**
 * Identifies the candidate item to evict under Least Recently Used (LRU) policy
 * (Item with the smallest lastAccessedAt timestamp)
 *
 * @param {Array<{ key: string, lastAccessedAt: number }>} items - Cache item entries
 * @returns {Object|null} Evicted item
 */
export function evictByLRU(items) {
  if (!items || items.length === 0) return null;
  return [...items].sort((a, b) => (a.lastAccessedAt || 0) - (b.lastAccessedAt || 0))[0];
}

/**
 * Identifies the candidate item to evict under Least Frequently Used (LFU) policy
 * (Item with lowest accessCount; uses lastAccessedAt as tie-breaker)
 *
 * @param {Array<{ key: string, accessCount: number, lastAccessedAt: number }>} items
 * @returns {Object|null} Evicted item
 */
export function evictByLFU(items) {
  if (!items || items.length === 0) return null;
  return [...items].sort((a, b) => {
    if (a.accessCount === b.accessCount) {
      return (a.lastAccessedAt || 0) - (b.lastAccessedAt || 0);
    }
    return (a.accessCount || 0) - (b.accessCount || 0);
  })[0];
}

/**
 * Identifies the candidate item to evict under First-In First-Out (FIFO) policy
 * (Item with smallest insertedAt timestamp)
 *
 * @param {Array<{ key: string, insertedAt: number }>} items
 * @returns {Object|null} Evicted item
 */
export function evictByFIFO(items) {
  if (!items || items.length === 0) return null;
  return [...items].sort((a, b) => (a.insertedAt || 0) - (b.insertedAt || 0))[0];
}

/**
 * Checks if a cached key has exceeded its Time-To-Live (TTL)
 *
 * @param {{ insertedAt: number, ttlSec: number }} item
 * @param {number} currentClock - Current simulation clock or Unix timestamp in seconds
 * @returns {boolean} True if expired
 */
export function isTtlExpired(item, currentClock) {
  if (!item || !item.ttlSec) return false;
  return currentClock >= (item.insertedAt + item.ttlSec);
}

/**
 * Calculates total memory size consumed by cache items
 *
 * @param {Array<{ sizeBytes?: number }>} items
 * @returns {number} Total bytes
 */
export function calculateCacheMemoryUsage(items = []) {
  return items.reduce((acc, item) => acc + (item.sizeBytes || 64), 0);
}

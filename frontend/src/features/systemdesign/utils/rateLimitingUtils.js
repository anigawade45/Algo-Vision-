/**
 * Rate Limiting & Traffic Shaping Mathematical Utilities
 * Pure state transition & evaluation functions for distributed rate limiting algorithms
 */

/**
 * Evaluates the Token Bucket algorithm state after time has elapsed and a new request arrives.
 *
 * @param {Object} params
 * @param {number} params.currentTokens - Current number of tokens in the bucket
 * @param {number} params.capacity - Maximum capacity of the bucket
 * @param {number} params.refillRate - Refill rate in tokens per second
 * @param {number} [params.elapsedSec=0] - Time elapsed since last check (seconds)
 * @param {number} [params.cost=1] - Number of tokens required for the request
 * @returns {{ isAllowed: boolean, remainingTokens: number, tokensAdded: number }}
 */
export function evaluateTokenBucket({
  currentTokens,
  capacity,
  refillRate,
  elapsedSec = 0,
  cost = 1
}) {
  const tokensAdded = elapsedSec * refillRate;
  const replenished = Math.min(capacity, currentTokens + tokensAdded);

  if (replenished >= cost) {
    return {
      isAllowed: true,
      remainingTokens: replenished - cost,
      tokensAdded
    };
  }

  return {
    isAllowed: false,
    remainingTokens: replenished,
    tokensAdded
  };
}

/**
 * Evaluates the Leaky Bucket (FIFO queue) algorithm state after time elapsed and a new request arrives.
 *
 * @param {Object} params
 * @param {Array<any>} params.queue - Current queue of requests awaiting leak
 * @param {number} params.capacity - Maximum queue buffer capacity
 * @param {number} params.leakRate - Number of requests processed (leaked) per second
 * @param {number} [params.elapsedSec=0] - Time elapsed since last leak
 * @param {any} [params.newRequest=null] - Optional request payload to enqueue if space permits
 * @returns {{ isAllowed: boolean, updatedQueue: Array<any>, leakedCount: number }}
 */
export function evaluateLeakyBucket({
  queue,
  capacity,
  leakRate,
  elapsedSec = 0,
  newRequest = null
}) {
  const leakedCount = Math.min(queue.length, Math.floor(elapsedSec * leakRate));
  const queueAfterLeak = queue.slice(leakedCount);

  if (newRequest !== null) {
    if (queueAfterLeak.length < capacity) {
      return {
        isAllowed: true,
        updatedQueue: [...queueAfterLeak, newRequest],
        leakedCount
      };
    }
    return {
      isAllowed: false,
      updatedQueue: queueAfterLeak,
      leakedCount
    };
  }

  return {
    isAllowed: true,
    updatedQueue: queueAfterLeak,
    leakedCount
  };
}

/**
 * Evaluates Fixed Window Counter rate limit
 *
 * @param {Object} params
 * @param {number} params.count - Current count of requests in current window
 * @param {number} params.limit - Maximum allowed requests per window
 * @param {number} params.windowSec - Window size in seconds
 * @param {number} params.currentTime - Current timestamp in seconds
 * @param {number} params.windowStart - Current window start timestamp
 * @returns {{ isAllowed: boolean, newCount: number, isNewWindow: boolean, retryAfter: number }}
 */
export function evaluateFixedWindow({
  count,
  limit,
  windowSec,
  currentTime,
  windowStart
}) {
  const isNewWindow = currentTime >= windowStart + windowSec;
  const effectiveCount = isNewWindow ? 0 : count;

  if (effectiveCount < limit) {
    return {
      isAllowed: true,
      newCount: effectiveCount + 1,
      isNewWindow,
      retryAfter: 0
    };
  }

  const retryAfter = Math.max(1, Math.ceil(windowStart + windowSec - currentTime));
  return {
    isAllowed: false,
    newCount: effectiveCount,
    isNewWindow,
    retryAfter
  };
}

/**
 * Evaluates Sliding Window Log rate limit (exact timestamp history)
 *
 * @param {Object} params
 * @param {Array<number>} params.timestamps - Array of timestamps for past admitted requests
 * @param {number} params.limit - Maximum allowed requests in sliding window
 * @param {number} params.windowSec - Window duration in seconds
 * @param {number} params.currentTime - Current request timestamp in seconds
 * @returns {{ isAllowed: boolean, validTimestamps: Array<number>, retryAfter: number }}
 */
export function evaluateSlidingWindowLog({
  timestamps,
  limit,
  windowSec,
  currentTime
}) {
  const windowBoundary = currentTime - windowSec;
  const validTimestamps = timestamps.filter((t) => t > windowBoundary);

  if (validTimestamps.length < limit) {
    return {
      isAllowed: true,
      validTimestamps: [...validTimestamps, currentTime],
      retryAfter: 0
    };
  }

  // Oldest timestamp in current window defines retryAfter
  const oldestTimestamp = validTimestamps[0];
  const retryAfter = Math.max(1, Math.ceil(oldestTimestamp + windowSec - currentTime));

  return {
    isAllowed: false,
    validTimestamps,
    retryAfter
  };
}

/**
 * Evaluates Sliding Window Counter (Cloudflare weighted approximation)
 * Combines previous window count and current window count with time weight.
 *
 * @param {Object} params
 * @param {number} params.prevCount - Request count in previous window
 * @param {number} params.currCount - Request count in current window
 * @param {number} params.limit - Maximum requests per window
 * @param {number} params.windowSec - Window duration in seconds
 * @param {number} params.currentTime - Current time in seconds
 * @returns {{ isAllowed: boolean, estimatedCount: number, newCurrCount: number, weight: number }}
 */
export function evaluateSlidingWindowCounter({
  prevCount,
  currCount,
  limit,
  windowSec,
  currentTime
}) {
  const timeIntoCurrentWindow = currentTime % windowSec;
  const weight = (windowSec - timeIntoCurrentWindow) / windowSec;
  const estimatedCount = prevCount * weight + currCount;

  if (estimatedCount < limit) {
    return {
      isAllowed: true,
      estimatedCount,
      newCurrCount: currCount + 1,
      weight
    };
  }

  return {
    isAllowed: false,
    estimatedCount,
    newCurrCount: currCount,
    weight
  };
}

/**
 * Generates standard HTTP 429 response headers
 *
 * @param {number} limit - Quota limit
 * @param {number} remaining - Remaining quota
 * @param {number} resetSeconds - Seconds until reset
 * @returns {Record<string, string>} HTTP Header map
 */
export function generateRateLimitHeaders(limit, remaining, resetSeconds) {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil(resetSeconds)),
    ...(remaining <= 0 ? { 'Retry-After': String(Math.ceil(resetSeconds)) } : {})
  };
}

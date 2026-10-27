/**
 * System Design & Distributed Systems Formatting Utilities
 * Standardized formatters for network latency, throughput, memory, uptime, and numbers
 */

/**
 * Formats millisecond latency into clean human-readable units
 *
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted latency (e.g. '0.8 ms', '125 ms', '1.45 s')
 */
export function formatLatency(ms) {
  if (ms === undefined || ms === null || isNaN(ms)) return '0 ms';
  if (ms < 1) return `${(ms * 1000).toFixed(0)} μs`;
  if (ms < 1000) return `${ms.toFixed(ms % 1 === 0 ? 0 : 1)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

/**
 * Formats byte size into B, KB, MB, GB
 *
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size (e.g. '256 B', '4.2 KB', '12.8 MB')
 */
export function formatBytes(bytes) {
  if (!bytes || bytes <= 0 || isNaN(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i] || 'TB'}`;
}

/**
 * Formats throughput (requests per second)
 *
 * @param {number} rps - Requests per second
 * @returns {string} Formatted throughput (e.g. '450 RPS', '25.0k RPS', '1.2M RPS')
 */
export function formatThroughput(rps) {
  if (!rps || rps <= 0 || isNaN(rps)) return '0 RPS';
  if (rps < 1000) return `${Math.round(rps)} RPS`;
  if (rps < 1000000) return `${(rps / 1000).toFixed(1)}k RPS`;
  return `${(rps / 1000000).toFixed(2)}M RPS`;
}

/**
 * Formats numeric ratio or percentage
 *
 * @param {number} value - Numeric value (0 to 1 or 0 to 100)
 * @param {number} [decimals=1] - Decimal precision
 * @returns {string} Formatted percentage (e.g. '87.5%')
 */
export function formatPercentage(value, decimals = 1) {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  const num = value > 1 ? value : value * 100;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Formats large integers with localized commas
 *
 * @param {number} num - Number
 * @returns {string} Formatted number (e.g. '1,420,500')
 */
export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
}

/**
 * Converts High Availability "Nines" percentage to annual downtime string
 *
 * @param {number|string} nines - e.g. 99.9 or 99.99
 * @returns {string} Expected annual downtime
 */
export function formatUptimeDowntime(nines) {
  const val = parseFloat(nines);
  if (val >= 99.999) return '~5.26 minutes / year (Five Nines)';
  if (val >= 99.99) return '~52.6 minutes / year (Four Nines)';
  if (val >= 99.9) return '~8.76 hours / year (Three Nines)';
  if (val >= 99.0) return '~3.65 days / year (Two Nines)';
  return '> 3.65 days / year';
}

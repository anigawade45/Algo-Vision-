/**
 * Load Balancing & Traffic Routing Utilities
 * Pure algorithm routing functions for Layer 4 & Layer 7 traffic distribution
 */

import { simpleHash } from './hashingUtils';

/**
 * Filters a pool of backend servers to only those that are online and healthy
 *
 * @param {Array<Object>} servers - List of server node objects
 * @returns {Array<Object>} Active, healthy servers
 */
export function filterHealthyServers(servers) {
  if (!Array.isArray(servers)) return [];
  return servers.filter((s) => s.isHealthy !== false && s.isEnabled !== false);
}

/**
 * Selects next server in cyclical Round-Robin order
 *
 * @param {Array<Object>} servers - Pool of candidate servers
 * @param {number} currentIndex - Current dispatch pointer
 * @returns {{ selectedServer: Object|null, nextIndex: number }}
 */
export function selectRoundRobin(servers, currentIndex = 0) {
  const healthy = filterHealthyServers(servers);
  if (healthy.length === 0) {
    return { selectedServer: null, nextIndex: currentIndex };
  }

  const normalizedIndex = currentIndex % healthy.length;
  const selectedServer = healthy[normalizedIndex];
  const nextIndex = (normalizedIndex + 1) % healthy.length;

  return { selectedServer, nextIndex };
}

/**
 * Selects server with the fewest active concurrent connections/jobs
 *
 * @param {Array<Object>} servers - Pool of candidate servers
 * @returns {Object|null} Server with lowest load
 */
export function selectLeastConnections(servers) {
  const healthy = filterHealthyServers(servers);
  if (healthy.length === 0) return null;

  return healthy.reduce((minServer, current) => {
    const currentConn = current.activeConnections ?? (current.activeJobs ? current.activeJobs.length : 0);
    const minConn = minServer.activeConnections ?? (minServer.activeJobs ? minServer.activeJobs.length : 0);
    return currentConn < minConn ? current : minServer;
  }, healthy[0]);
}

/**
 * Selects server deterministically based on client IP hash (Sticky Sessions)
 *
 * @param {Array<Object>} servers - Pool of candidate servers
 * @param {string} clientIp - Client IP address string (e.g. '192.168.1.42')
 * @returns {Object|null} Target sticky server
 */
export function selectIpHash(servers, clientIp) {
  const healthy = filterHealthyServers(servers);
  if (healthy.length === 0) return null;

  const hash = simpleHash(String(clientIp || '127.0.0.1'));
  const targetIndex = hash % healthy.length;
  return healthy[targetIndex];
}

/**
 * Selects server randomly among healthy nodes
 *
 * @param {Array<Object>} servers - Pool of candidate servers
 * @returns {Object|null} Randomly chosen server
 */
export function selectRandom(servers) {
  const healthy = filterHealthyServers(servers);
  if (healthy.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * healthy.length);
  return healthy[randomIndex];
}

/**
 * Calculates aggregate utilization and metrics for a server cluster
 *
 * @param {Array<Object>} servers - Server list
 * @returns {{ totalServers: number, healthyCount: number, activeConnections: number, avgLoadPercent: number }}
 */
export function calculateClusterMetrics(servers = []) {
  const totalServers = servers.length;
  const healthyCount = servers.filter((s) => s.isHealthy !== false).length;
  let activeConnections = 0;
  let totalCapacity = 0;

  for (const s of servers) {
    const conn = s.activeConnections ?? (s.activeJobs ? s.activeJobs.length : 0);
    activeConnections += conn;
    totalCapacity += (s.capacity || 10);
  }

  const avgLoadPercent = totalCapacity > 0 ? Math.min(100, Math.round((activeConnections / totalCapacity) * 100)) : 0;

  return {
    totalServers,
    healthyCount,
    activeConnections,
    avgLoadPercent
  };
}

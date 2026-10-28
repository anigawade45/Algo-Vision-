/**
 * Hashing & Sharding Utilities for Distributed Systems & Database Scaling
 */

/**
 * Deterministic polynomial string hash (DJB2-like / Java hashCode variant)
 * Produces a non-negative integer from any string input.
 *
 * @param {string} str - Input key to hash (e.g., record ID, user email, IP)
 * @returns {number} Non-negative 32-bit integer hash value
 */
export function simpleHash(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Determines target shard for a record based on chosen sharding strategy
 *
 * @param {Object} record - Data row/record with id, name, country, etc.
 * @param {'hash' | 'range' | 'geo'} strategy - Sharding scheme
 * @param {number} shardCount - Total number of available shards (default: 3)
 * @returns {string} Target shard key identifier (e.g. 'shard1', 'shard2', 'shard3')
 */
export function getShardForRecord(record, strategy = 'hash', shardCount = 3) {
  if (!record) return 'shard1';

  if (strategy === 'hash') {
    const key = String(record.id || record.key || '');
    const h = simpleHash(key);
    const shardIndex = (h % shardCount) + 1;
    return `shard${shardIndex}`;
  }

  if (strategy === 'range') {
    // Range partition by first character of name (A-H -> 1, I-P -> 2, Q-Z -> 3)
    const firstChar = String(record.name || 'A')[0].toUpperCase();
    if (firstChar <= 'H') return 'shard1';
    if (firstChar <= 'P') return 'shard2';
    return 'shard3';
  }

  if (strategy === 'geo') {
    // Geographic partition by Country / Region
    const country = String(record.country || '').toUpperCase();
    if (country === 'US' || country === 'NA') return 'shard1';
    if (country === 'EU' || country === 'UK' || country === 'DE') return 'shard2';
    return 'shard3'; // APAC, MEA, LATAM, etc.
  }

  return 'shard1';
}

/**
 * Maps a key onto a consistent hashing ring of circumference ringSize
 *
 * @param {string} key - String key to place on the ring
 * @param {number} ringSize - Size of the ring space (default: 360 degrees)
 * @returns {number} Angle or point [0, ringSize - 1]
 */
export function hashKeyToRing(key, ringSize = 360) {
  return simpleHash(String(key)) % ringSize;
}

/**
 * Identifies the target node on a consistent hashing ring by finding the
 * first node located clockwise (>= ringPosition). Wraps to index 0 if beyond last node.
 *
 * @param {number} ringPosition - Position of key on ring [0, ringSize]
 * @param {Array<{ id: string, angle: number }>} sortedNodes - Ring nodes sorted by angle ascending
 * @returns {Object|null} Selected node
 */
export function findConsistentHashNode(ringPosition, sortedNodes) {
  if (!sortedNodes || sortedNodes.length === 0) return null;
  for (const node of sortedNodes) {
    if (node.angle >= ringPosition) {
      return node;
    }
  }
  // Wrap around to first node
  return sortedNodes[0];
}

/**
 * Generates virtual node points for consistent hashing to prevent hot spots
 *
 * @param {string} nodeId - Node identifier (e.g. 'Node-A')
 * @param {number} virtualNodeCount - Number of replicas per physical node (e.g. 3)
 * @param {number} ringSize - Maximum ring circumference (default: 360)
 * @returns {Array<{ id: string, physicalId: string, angle: number }>}
 */
export function generateVirtualNodes(nodeId, virtualNodeCount = 3, ringSize = 360) {
  const vNodes = [];
  for (let i = 0; i < virtualNodeCount; i++) {
    const vKey = `${nodeId}-vnode-${i}`;
    vNodes.push({
      id: vKey,
      physicalId: nodeId,
      angle: hashKeyToRing(vKey, ringSize)
    });
  }
  return vNodes;
}

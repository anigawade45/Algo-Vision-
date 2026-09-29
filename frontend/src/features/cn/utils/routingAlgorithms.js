/**
 * Routing Protocols & Graph Algorithms (Dijkstra Link-State & Bellman-Ford Distance-Vector)
 */

export const DEFAULT_NODES = [
  { id: 'A', name: 'Router A', x: 100, y: 180, ip: '10.0.1.1' },
  { id: 'B', name: 'Router B', x: 280, y: 80, ip: '10.0.2.1' },
  { id: 'C', name: 'Router C', x: 280, y: 280, ip: '10.0.3.1' },
  { id: 'D', name: 'Router D', x: 480, y: 80, ip: '10.0.4.1' },
  { id: 'E', name: 'Router E', x: 480, y: 280, ip: '10.0.5.1' },
  { id: 'F', name: 'Router F', x: 660, y: 180, ip: '10.0.6.1' },
];

export const DEFAULT_EDGES = [
  { id: 'A-B', source: 'A', target: 'B', cost: 4, isDown: false },
  { id: 'A-C', source: 'A', target: 'C', cost: 2, isDown: false },
  { id: 'B-C', source: 'B', target: 'C', cost: 1, isDown: false },
  { id: 'B-D', source: 'B', target: 'D', cost: 5, isDown: false },
  { id: 'C-E', source: 'C', target: 'E', cost: 8, isDown: false },
  { id: 'C-D', source: 'C', target: 'D', cost: 8, isDown: false },
  { id: 'D-E', source: 'D', target: 'E', cost: 2, isDown: false },
  { id: 'D-F', source: 'D', target: 'F', cost: 6, isDown: false },
  { id: 'E-F', source: 'E', target: 'F', cost: 3, isDown: false },
];

export function runDijkstraSimulation(nodes = DEFAULT_NODES, edges = DEFAULT_EDGES, sourceId = 'A', destId = 'F') {
  const steps = [];
  const activeEdges = edges.filter((e) => !e.isDown);

  // Build adjacency list
  const adj = {};
  nodes.forEach((n) => {
    adj[n.id] = [];
  });

  activeEdges.forEach((e) => {
    adj[e.source].push({ neighbor: e.target, cost: e.cost, edgeId: e.id });
    adj[e.target].push({ neighbor: e.source, cost: e.cost, edgeId: e.id });
  });

  const dist = {};
  const prev = {};
  const visited = new Set();

  nodes.forEach((n) => {
    dist[n.id] = n.id === sourceId ? 0 : Infinity;
    prev[n.id] = null;
  });

  steps.push({
    stepIndex: 0,
    title: `Initialization from Source ${sourceId}`,
    description: `Set dist[${sourceId}] = 0, all other nodes to Infinity. Visited set is empty.`,
    currentNode: sourceId,
    visited: Array.from(visited),
    distances: { ...dist },
    previous: { ...prev },
    activeEdgeId: null,
    highlightPath: [],
    explanation: `Link-State algorithm begins by initializing all distance metrics relative to source router ${sourceId}.`,
  });

  while (visited.size < nodes.length) {
    // Find unvisited node with minimum distance
    let u = null;
    let minD = Infinity;

    nodes.forEach((n) => {
      if (!visited.has(n.id) && dist[n.id] < minD) {
        minD = dist[n.id];
        u = n.id;
      }
    });

    if (u === null || dist[u] === Infinity) break;

    visited.add(u);

    steps.push({
      stepIndex: steps.length,
      title: `Visit Node ${u} (Min Dist = ${dist[u]})`,
      description: `Select unvisited node with lowest tentative distance: ${u} (cost = ${dist[u]}). Marked as Visited.`,
      currentNode: u,
      visited: Array.from(visited),
      distances: { ...dist },
      previous: { ...prev },
      activeEdgeId: null,
      highlightPath: [],
      explanation: `Router ${u} is finalized in the shortest path tree. Now inspecting outgoing links to unvisited neighbors.`,
    });

    // Relax neighbors
    for (const edge of adj[u]) {
      const v = edge.neighbor;
      if (!visited.has(v)) {
        const alt = dist[u] + edge.cost;
        const improved = alt < dist[v];

        if (improved) {
          dist[v] = alt;
          prev[v] = u;
        }

        steps.push({
          stepIndex: steps.length,
          title: `Relax Link ${u} &rarr; ${v} (Cost ${edge.cost})`,
          description: improved
            ? `Found shorter path to ${v}: dist[${u}] (${dist[u]}) + ${edge.cost} = ${alt} < previous (${dist[v] === alt ? 'Inf' : dist[v]}). Updated!`
            : `Path via ${u} (cost ${alt}) is not shorter than existing dist[${v}] (${dist[v]}). No change.`,
          currentNode: u,
          visited: Array.from(visited),
          distances: { ...dist },
          previous: { ...prev },
          activeEdgeId: edge.edgeId,
          highlightPath: [],
          explanation: improved
            ? `Edge relaxation improved the route to ${v}. Predecessor set to ${u}.`
            : `Existing metric to ${v} is already optimal.`,
        });
      }
    }
  }

  // Reconstruct shortest path from source to dest
  const path = [];
  let curr = destId;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  const isReachable = dist[destId] !== Infinity && path[0] === sourceId;
  const pathEdges = [];
  if (isReachable) {
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      const match = activeEdges.find(
        (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
      );
      if (match) pathEdges.push(match.id);
    }
  }

  // Routing Table for Source Node
  const routingTable = nodes
    .filter((n) => n.id !== sourceId)
    .map((n) => {
      let nextHop = '-';
      if (dist[n.id] !== Infinity) {
        let temp = n.id;
        while (prev[temp] && prev[temp] !== sourceId) {
          temp = prev[temp];
        }
        nextHop = temp;
      }
      return {
        destination: n.id,
        destIp: n.ip,
        cost: dist[n.id] === Infinity ? '&infin;' : dist[n.id],
        nextHop: nextHop,
      };
    });

  // Final Completion Step
  steps.push({
    stepIndex: steps.length,
    title: `Calculation Complete: Shortest Path ${sourceId} &rarr; ${destId}`,
    description: isReachable
      ? `Shortest path: [${path.join(' &rarr; ')}] with total metric cost = ${dist[destId]}.`
      : `No available path between ${sourceId} and ${destId}.`,
    currentNode: destId,
    visited: Array.from(visited),
    distances: { ...dist },
    previous: { ...prev },
    activeEdgeId: null,
    highlightPath: isReachable ? pathEdges : [],
    explanation: `Dijkstra algorithm has converged. Complete routing table generated for Router ${sourceId}.`,
  });

  return {
    steps,
    totalSteps: steps.length,
    finalPath: isReachable ? path : [],
    finalPathEdges: pathEdges,
    totalCost: dist[destId],
    routingTable,
  };
}

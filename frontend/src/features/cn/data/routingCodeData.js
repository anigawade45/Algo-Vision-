/**
 * Routing Algorithms Code Data: Python 3, C++, and Java
 * Matching the 6-Router Topology (Routers A, B, C, D, E, F)
 */

export const ROUTING_CODE_DATA = {
  dijkstra: {
    id: 'dijkstra',
    title: "Dijkstra's Link-State Routing Algorithm (OSPF)",
    protocol: 'OSPF (Open Shortest Path First) / IS-IS',
    complexity: {
      time: 'O((V + E) log V) with Min-Heap',
      space: 'O(V + E) Adjacency List'
    },
    explanation:
      "Dijkstra's algorithm computes the shortest path from a source router to all other routers in the autonomous system by iteratively relaxing edges of the unvisited node with minimum tentative distance.",

    pythonCode: `import heapq

class RouterNetwork:
    """Simulates OSPF Link-State Routing using Dijkstra's Algorithm."""
    def __init__(self):
        # Network Topology Adjacency List (Router -> [(Neighbor, Cost), ...])
        # Exactly matches the AlgoVision 6-Router Topology Diagram
        self.graph = {
            'A': [('B', 4), ('C', 2)],
            'B': [('A', 4), ('C', 1), ('D', 5)],
            'C': [('A', 2), ('B', 1), ('D', 8), ('E', 8)],
            'D': [('B', 5), ('C', 8), ('E', 2), ('F', 6)],
            'E': [('C', 8), ('D', 2), ('F', 3)],
            'F': [('D', 6), ('E', 3)]
        }

    def compute_shortest_paths(self, source: str):
        print(f"\\n========== RUNNING OSPF DIJKSTRA FROM ROUTER {source} ==========")
        
        distances = {node: float('inf') for node in self.graph}
        previous = {node: None for node in self.graph}
        distances[source] = 0
        
        # Priority queue stores (cost, current_router)
        pq = [(0, source)]
        visited = set()

        while pq:
            curr_dist, curr_node = heapq.heappop(pq)

            if curr_node in visited:
                continue
            visited.add(curr_node)
            print(f"[*] Settled Router {curr_node} with optimal cost {curr_dist}")

            for neighbor, weight in self.graph[curr_node]:
                if neighbor in visited:
                    continue
                new_dist = curr_dist + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    previous[neighbor] = curr_node
                    heapq.heappush(pq, (new_dist, neighbor))
                    print(f"    --> Relaxed edge ({curr_node} -> {neighbor}): Tentative Cost = {new_dist}")

        return distances, previous

    def get_routing_table(self, source: str):
        distances, previous = self.compute_shortest_paths(source)
        
        print(f"\\n--- GENERATED ROUTING TABLE FOR ROUTER {source} ---")
        print(f"{'Destination':<15} {'Next Hop':<12} {'Total Cost':<10} {'Full Path'}")
        print("-" * 55)

        for dest in sorted(self.graph.keys()):
            if dest == source:
                print(f"{dest:<15} {'Direct (Local)':<12} {0:<10} {source}")
                continue

            # Reconstruct Path
            path = []
            curr = dest
            while curr is not None:
                path.append(curr)
                curr = previous[curr]
            path.reverse()

            if path and path[0] == source:
                next_hop = path[1] if len(path) > 1 else dest
                full_path = " -> ".join(path)
                print(f"{dest:<15} {next_hop:<12} {distances[dest]:<10} {full_path}")
            else:
                print(f"{dest:<15} {'Unreachable':<12} {'INF':<10} {'None'}")


def main():
    network = RouterNetwork()
    # Compute full OSPF Link-State shortest paths from Router A to Router F
    network.get_routing_table(source='A')


if __name__ == "__main__":
    main()`,

    cppCode: `#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <string>
#include <algorithm>
#include <iomanip>

using namespace std;

const int INF = 1e9;

// Edge structure (destination neighbor, link weight)
struct Edge {
    string target;
    int cost;
};

class RouterNetwork {
private:
    map<string, vector<Edge>> graph;

public:
    RouterNetwork() {
        // Topology matching the AlgoVision Diagram
        graph["A"] = {{"B", 4}, {"C", 2}};
        graph["B"] = {{"A", 4}, {"C", 1}, {"D", 5}};
        graph["C"] = {{"A", 2}, {"B", 1}, {"D", 8}, {"E", 8}};
        graph["D"] = {{"B", 5}, {"C", 8}, {"E", 2}, {"F", 6}};
        graph["E"] = {{"C", 8}, {"D", 2}, {"F", 3}};
        graph["F"] = {{"D", 6}, {"E", 3}};
    }

    void computeDijkstra(const string& source) {
        cout << "\\n========== RUNNING OSPF DIJKSTRA FROM ROUTER " << source << " ==========\\n";

        map<string, int> dist;
        map<string, string> prev;
        map<string, bool> visited;

        for (const auto& pair : graph) {
            dist[pair.first] = INF;
            prev[pair.first] = "";
            visited[pair.first] = false;
        }

        dist[source] = 0;

        // Min-heap priority queue: pair<cost, router_id>
        priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
        pq.push({0, source});

        while (!pq.empty()) {
            auto [currDist, currNode] = pq.top();
            pq.pop();

            if (visited[currNode]) continue;
            visited[currNode] = true;
            cout << "[*] Settled Router " << currNode << " with optimal cost " << currDist << "\\n";

            for (const auto& edge : graph[currNode]) {
                if (visited[edge.target]) continue;
                int newDist = currDist + edge.cost;
                if (newDist < dist[edge.target]) {
                    dist[edge.target] = newDist;
                    prev[edge.target] = currNode;
                    pq.push({newDist, edge.target});
                    cout << "    --> Relaxed edge (" << currNode << " -> " << edge.target << "): Cost = " << newDist << "\\n";
                }
            }
        }

        // Print Routing Table
        cout << "\\n--- GENERATED ROUTING TABLE FOR ROUTER " << source << " ---\\n";
        cout << left << setw(15) << "Destination" << setw(12) << "Next Hop" << setw(12) << "Cost" << "Full Path\\n";
        cout << string(55, '-') << "\\n";

        for (const auto& pair : graph) {
            string dest = pair.first;
            if (dest == source) {
                cout << left << setw(15) << dest << setw(12) << "Direct" << setw(12) << 0 << source << "\\n";
                continue;
            }

            vector<string> path;
            string curr = dest;
            while (!curr.empty()) {
                path.push_back(curr);
                curr = prev[curr];
            }
            reverse(path.begin(), path.end());

            if (!path.empty() && path[0] == source) {
                string nextHop = (path.size() > 1) ? path[1] : dest;
                string pathStr = "";
                for (size_t i = 0; i < path.size(); ++i) {
                    pathStr += path[i] + (i + 1 < path.size() ? " -> " : "");
                }
                cout << left << setw(15) << dest << setw(12) << nextHop << setw(12) << dist[dest] << pathStr << "\\n";
            }
        }
    }
};

int main() {
    RouterNetwork net;
    net.computeDijkstra("A");
    return 0;
}`,

    javaCode: `import java.util.*;

public class OspfDijkstraRouting {

    static class Edge {
        String target;
        int cost;

        public Edge(String target, int cost) {
            this.target = target;
            this.cost = cost;
        }
    }

    static class NodeEntry implements Comparable<NodeEntry> {
        String node;
        int dist;

        public NodeEntry(String node, int dist) {
            this.node = node;
            this.dist = dist;
        }

        @Override
        public int compareTo(NodeEntry other) {
            return Integer.compare(this.dist, other.dist);
        }
    }

    static class RouterNetwork {
        private Map<String, List<Edge>> graph = new HashMap<>();

        public RouterNetwork() {
            // Matching the AlgoVision 6-Router Topology
            addEdge("A", "B", 4);
            addEdge("A", "C", 2);
            addEdge("B", "C", 1);
            addEdge("B", "D", 5);
            addEdge("C", "D", 8);
            addEdge("C", "E", 8);
            addEdge("D", "E", 2);
            addEdge("D", "F", 6);
            addEdge("E", "F", 3);
        }

        private void addEdge(String u, String v, int cost) {
            graph.computeIfAbsent(u, k -> new ArrayList<>()).add(new Edge(v, cost));
            graph.computeIfAbsent(v, k -> new ArrayList<>()).add(new Edge(u, cost));
        }

        public void computeDijkstra(String source) {
            System.out.println("\\n========== RUNNING OSPF DIJKSTRA FROM ROUTER " + source + " ==========");

            Map<String, Integer> dist = new HashMap<>();
            Map<String, String> prev = new HashMap<>();
            Set<String> visited = new HashSet<>();

            for (String node : graph.keySet()) {
                dist.put(node, Integer.MAX_VALUE);
                prev.put(node, null);
            }

            dist.put(source, 0);
            PriorityQueue<NodeEntry> pq = new PriorityQueue<>();
            pq.add(new NodeEntry(source, 0));

            while (!pq.isEmpty()) {
                NodeEntry top = pq.poll();
                String curr = top.node;

                if (visited.contains(curr)) continue;
                visited.add(curr);
                System.out.println("[*] Settled Router " + curr + " with optimal cost " + top.dist);

                for (Edge edge : graph.getOrDefault(curr, Collections.emptyList())) {
                    if (visited.contains(edge.target)) continue;
                    int newDist = dist.get(curr) + edge.cost;
                    if (newDist < dist.get(edge.target)) {
                        dist.put(edge.target, newDist);
                        prev.put(edge.target, curr);
                        pq.add(new NodeEntry(edge.target, newDist));
                        System.out.println("    --> Relaxed edge (" + curr + " -> " + edge.target + "): Cost = " + newDist);
                    }
                }
            }

            // Display Routing Table
            System.out.println("\\n--- GENERATED ROUTING TABLE FOR ROUTER " + source + " ---");
            System.out.printf("%-15s %-12s %-10s %s\\n", "Destination", "Next Hop", "Cost", "Full Path");
            System.out.println("-".repeat(55));

            List<String> sortedKeys = new ArrayList<>(graph.keySet());
            Collections.sort(sortedKeys);

            for (String dest : sortedKeys) {
                if (dest.equals(source)) {
                    System.out.printf("%-15s %-12s %-10d %s\\n", dest, "Direct", 0, source);
                    continue;
                }

                List<String> path = new ArrayList<>();
                String curr = dest;
                while (curr != null) {
                    path.add(curr);
                    curr = prev.get(curr);
                }
                Collections.reverse(path);

                if (!path.isEmpty() && path.get(0).equals(source)) {
                    String nextHop = (path.size() > 1) ? path.get(1) : dest;
                    String fullPath = String.join(" -> ", path);
                    System.out.printf("%-15s %-12s %-10d %s\\n", dest, nextHop, dist.get(dest), fullPath);
                }
            }
        }
    }

    public static void main(String[] args) {
        RouterNetwork net = new RouterNetwork();
        net.computeDijkstra("A");
    }
}`
  },

  distanceVector: {
    id: 'distanceVector',
    title: 'Distance-Vector Bellman-Ford Routing (RIP)',
    protocol: 'RIP (Routing Information Protocol) / BGP (Path Vector)',
    complexity: {
      time: 'O(V * E) Iterative Relaxation',
      space: 'O(V) per Router Table'
    },
    explanation:
      'Distance-Vector routing computes shortest paths via distributed iterative neighbor vector exchanges using the Bellman-Ford equation: D_x(y) = min_v { c(x,v) + D_v(y) }.',

    pythonCode: `class DistanceVectorRouter:
    """Simulates RIP Distance-Vector Bellman-Ford Routing Algorithm."""
    def __init__(self):
        self.nodes = ['A', 'B', 'C', 'D', 'E', 'F']
        # Directed edge representation with costs
        self.edges = [
            ('A', 'B', 4), ('A', 'C', 2),
            ('B', 'C', 1), ('B', 'D', 5),
            ('C', 'D', 8), ('C', 'E', 8),
            ('D', 'E', 2), ('D', 'F', 6),
            ('E', 'F', 3)
        ]
        # Undirected bidirectional links
        self.all_edges = []
        for u, v, w in self.edges:
            self.all_edges.append((u, v, w))
            self.all_edges.append((v, u, w))

    def run_bellman_ford(self, source: str):
        print(f"\\n========== RUNNING DISTANCE-VECTOR BELLMAN-FORD FROM {source} ==========")
        dist = {n: float('inf') for n in self.nodes}
        next_hop = {n: None for n in self.nodes}
        dist[source] = 0

        # Relax edges |V| - 1 times
        for iteration in range(1, len(self.nodes)):
            updated = False
            print(f"\\n[Iteration {iteration}] Exchanging distance vectors with neighbors...")

            for u, v, w in self.all_edges:
                if dist[u] != float('inf') and dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    next_hop[v] = u if u != source else v
                    updated = True
                    print(f"  --> Updated route to {v} via {u}: Cost = {dist[v]}")

            if not updated:
                print(f"[*] Distance vectors converged early at iteration {iteration}.")
                break

        print(f"\\n--- CONVERGED DISTANCE-VECTOR TABLE FOR {source} ---")
        print(f"{'Destination':<15} {'Total Cost':<12}")
        print("-" * 30)
        for n in sorted(self.nodes):
            cost_str = str(dist[n]) if dist[n] != float('inf') else "INF"
            print(f"{n:<15} {cost_str:<12}")


def main():
    dv = DistanceVectorRouter()
    dv.run_bellman_ford(source='A')


if __name__ == "__main__":
    main()`,

    cppCode: `#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <iomanip>

using namespace std;

const int INF = 1e9;

struct Link {
    string src, dst;
    int weight;
};

class DistanceVectorRouting {
private:
    vector<string> nodes = {"A", "B", "C", "D", "E", "F"};
    vector<Link> edges;

public:
    DistanceVectorRouting() {
        vector<Link> base = {
            {"A", "B", 4}, {"A", "C", 2},
            {"B", "C", 1}, {"B", "D", 5},
            {"C", "D", 8}, {"C", "E", 8},
            {"D", "E", 2}, {"D", "F", 6},
            {"E", "F", 3}
        };
        for (const auto& e : base) {
            edges.push_back(e);
            edges.push_back({e.dst, e.src, e.weight});
        }
    }

    void runBellmanFord(const string& source) {
        cout << "\\n========== RUNNING DISTANCE-VECTOR BELLMAN-FORD FROM " << source << " ==========\\n";
        map<string, int> dist;
        for (const auto& n : nodes) dist[n] = INF;
        dist[source] = 0;

        for (size_t iter = 1; iter < nodes.size(); ++iter) {
            bool updated = false;
            cout << "\\n[Iteration " << iter << "] Exchanging distance vectors with neighbors...\\n";

            for (const auto& e : edges) {
                if (dist[e.src] != INF && dist[e.src] + e.weight < dist[e.dst]) {
                    dist[e.dst] = dist[e.src] + e.weight;
                    updated = true;
                    cout << "  --> Updated route to " << e.dst << " via " << e.src << ": Cost = " << dist[e.dst] << "\\n";
                }
            }

            if (!updated) {
                cout << "[*] Distance vectors converged early at iteration " << iter << ".\\n";
                break;
            }
        }

        cout << "\\n--- CONVERGED DISTANCE-VECTOR TABLE FOR " << source << " ---\\n";
        cout << left << setw(15) << "Destination" << setw(12) << "Total Cost" << "\\n";
        cout << string(30, '-') << "\\n";
        for (const auto& n : nodes) {
            cout << left << setw(15) << n << setw(12) << (dist[n] == INF ? "INF" : to_string(dist[n])) << "\\n";
        }
    }
};

int main() {
    DistanceVectorRouting rip;
    rip.runBellmanFord("A");
    return 0;
}`,

    javaCode: `import java.util.*;

public class DistanceVectorRouting {

    static class Link {
        String src, dst;
        int weight;

        public Link(String src, String dst, int weight) {
            this.src = src;
            this.dst = dst;
            this.weight = weight;
        }
    }

    static class BellmanFordSimulator {
        private List<String> nodes = Arrays.asList("A", "B", "C", "D", "E", "F");
        private List<Link> edges = new ArrayList<>();

        public BellmanFordSimulator() {
            addBidirectional("A", "B", 4);
            addBidirectional("A", "C", 2);
            addBidirectional("B", "C", 1);
            addBidirectional("B", "D", 5);
            addBidirectional("C", "D", 8);
            addBidirectional("C", "E", 8);
            addBidirectional("D", "E", 2);
            addBidirectional("D", "F", 6);
            addBidirectional("E", "F", 3);
        }

        private void addBidirectional(String u, String v, int cost) {
            edges.add(new Link(u, v, cost));
            edges.add(new Link(v, u, cost));
        }

        public void runBellmanFord(String source) {
            System.out.println("\\n========== RUNNING DISTANCE-VECTOR BELLMAN-FORD FROM " + source + " ==========");
            Map<String, Integer> dist = new HashMap<>();
            for (String n : nodes) dist.put(n, Integer.MAX_VALUE);
            dist.put(source, 0);

            for (int iter = 1; iter < nodes.size(); iter++) {
                boolean updated = false;
                System.out.println("\\n[Iteration " + iter + "] Exchanging distance vectors with neighbors...");

                for (Link link : edges) {
                    if (dist.get(link.src) != Integer.MAX_VALUE && dist.get(link.src) + link.weight < dist.get(link.dst)) {
                        dist.put(link.dst, dist.get(link.src) + link.weight);
                        updated = true;
                        System.out.println("  --> Updated route to " + link.dst + " via " + link.src + ": Cost = " + dist.get(link.dst));
                    }
                }

                if (!updated) {
                    System.out.println("[*] Distance vectors converged early at iteration " + iter + ".");
                    break;
                }
            }

            System.out.println("\\n--- CONVERGED DISTANCE-VECTOR TABLE FOR " + source + " ---");
            System.out.printf("%-15s %-12s\\n", "Destination", "Total Cost");
            System.out.println("-".repeat(30));
            for (String n : nodes) {
                int cost = dist.get(n);
                System.out.printf("%-15s %-12s\\n", n, (cost == Integer.MAX_VALUE ? "INF" : String.valueOf(cost)));
            }
        }
    }

    public static void main(String[] args) {
        BellmanFordSimulator rip = new BellmanFordSimulator();
        rip.runBellmanFord("A");
    }
}`
  }
};

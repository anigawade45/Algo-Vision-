/**
 * Comprehensive Code Implementations, Protocols & Algorithm Data for Network Topologies
 * Languages Supported: C++, Java, Python 3 (Strictly typed & well-commented)
 * Includes:
 * 1. Bus (CSMA/CD & Shared Linear Backbone)
 * 2. Star (Layer 2 Switch CAM Table Dynamic Learning & Forwarding)
 * 3. Ring (IEEE 802.5 Token Passing State Machine & ACK Verification)
 * 4. Mesh (Full Mesh Direct O(1) Delivery & Fault-Tolerant Failover Rerouting)
 * 5. Tree (Hierarchical Core-Distribution-Access Tree & LCA Routing)
 * 6. Hybrid (Heterogeneous Star-Bus/Star-Ring Gateway Bridge Routing)
 */

export const TOPOLOGY_CODE_DATA = {
  bus: {
    id: 'bus',
    title: 'Bus Topology: CSMA/CD Protocol & Shared Backbone',
    standard: 'IEEE 802.3 (10BASE-2 / 10BASE-5 Thinnet & Thicknet)',
    cableFormula: '1 Shared Backbone Cable + N Drop Lines',
    complexity: {
      time: 'O(N) broadcast propagation delay',
      space: 'O(1) no state required on hosts',
      collisionProb: 'High under heavy traffic (P_coll = 1 - e^(-2G))',
    },
    summary:
      'In a Bus topology, all network nodes tap into a single shared coaxial or twisted-pair backbone terminated at both ends with 50Ω resistors. Because every node shares the same physical channel, nodes execute the CSMA/CD (Carrier Sense Multiple Access with Collision Detection) algorithm with Binary Exponential Backoff before transmitting frames.',
    pythonCode: `import time
import random

class BusNetwork:
    """Simulates a shared Ethernet bus using CSMA/CD and 1-persistent carrier sense."""
    def __init__(self, node_names):
        self.nodes = {name: f"00:1A:2B:3C:4D:{i:02X}" for i, name in enumerate(node_names, 1)}
        self.channel_busy = False
        self.slot_time_ms = 51.2 # Slot time for 10 Mbps Ethernet (512 bit times)

    def carrier_sense(self):
        return self.channel_busy

    def transmit_frame(self, source_name, dest_name, payload):
        src_mac = self.nodes.get(source_name)
        dst_mac = self.nodes.get(dest_name)
        
        print(f"[BUS] '{source_name}' ({src_mac}) preparing frame for '{dest_name}' ({dst_mac})")
        
        attempts = 0
        max_attempts = 16
        
        while attempts < max_attempts:
            # 1. Listen before talk (Carrier Sense)
            while self.carrier_sense():
                print("  [CSMA/CD] Channel is BUSY. Deferring transmission...")
                time.sleep(0.05)
            
            # 2. Channel is idle -> start transmitting
            self.channel_busy = True
            print("  [CSMA/CD] Channel IDLE. Sending frame bits onto backbone wire...")
            
            # Simulate occasional collision on initial attempt
            simulated_collision = (random.random() < 0.2 and attempts == 0)
            
            if simulated_collision:
                attempts += 1
                self.channel_busy = False
                print("  [COLLISION DETECTED!] Transmitting 32-bit Jam Signal to clear bus.")
                
                # Truncated Binary Exponential Backoff: r in [0, 2^min(k, 10) - 1]
                k = min(attempts, 10)
                backoff_slots = random.randint(0, (2 ** k) - 1)
                backoff_time = (backoff_slots * self.slot_time_ms) / 1000.0
                print(f"  [BACKOFF] Attempt #{attempts}: Waiting {backoff_slots} slots ({backoff_time*1000:.1f} ms)...")
                time.sleep(0.08)
                continue
            
            # 3. Successful transmission -> Linear broadcast in both directions
            print("  [PROPAGATION] Frame traveling in both directions along backbone.")
            for node, mac in self.nodes.items():
                if node == source_name:
                    continue
                if mac == dst_mac:
                    print(f"  --> MATCH: '{node}' ({mac}) accepted payload: '{payload}'")
                else:
                    print(f"  --> IGNORED: '{node}' ({mac}) MAC mismatch -> packet dropped.")
            
            print("  [TERMINATOR] Remaining electrical energy absorbed by 50-ohm terminators.")
            self.channel_busy = False
            return True
            
        print(f"[ERROR] Max transmission attempts ({max_attempts}) exceeded. Channel congested.")
        self.channel_busy = False
        return False

# Example Usage
if __name__ == '__main__':
    bus = BusNetwork(["Node A", "Node B", "Node C", "Node D", "Node E"])
    bus.transmit_frame("Node A", "Node C", "Hello from Node A over Bus!")
`,
    cppCode: `#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>
#include <cmath>

struct EthernetFrame {
    std::string src_mac;
    std::string dst_mac;
    std::string payload;
};

class BusTopology {
private:
    std::vector<std::string> node_names;
    std::vector<std::string> mac_addresses;
    bool is_channel_busy;

public:
    BusTopology(const std::vector<std::string>& names) : node_names(names), is_channel_busy(false) {
        for (size_t i = 0; i < names.size(); ++i) {
            char mac_buf[32];
            snprintf(mac_buf, sizeof(mac_buf), "00:1A:2B:3C:4D:%02X", static_cast<unsigned int>(i + 1));
            mac_addresses.push_back(mac_buf);
        }
    }

    bool transmit(const std::string& src, const std::string& dst, const std::string& data) {
        std::cout << "[BUS] Node '" << src << "' sending frame to '" << dst << "'\\n";
        
        int attempts = 0;
        const int MAX_ATTEMPTS = 16;
        
        while (attempts < MAX_ATTEMPTS) {
            // Carrier Sense
            if (is_channel_busy) {
                std::cout << "  [CSMA/CD] Channel BUSY. Waiting...\\n";
            }
            
            is_channel_busy = true;
            std::cout << "  [CSMA/CD] Channel IDLE. Transmitting frame bits...\\n";
            
            // Broadcast along shared line
            std::cout << "  [PROPAGATION] Broadcasting frame on shared coaxial backbone.\\n";
            for (size_t i = 0; i < node_names.size(); ++i) {
                if (node_names[i] == src) continue;
                if (node_names[i] == dst) {
                    std::cout << "  --> MATCH: Node '" << node_names[i] << "' (" 
                              << mac_addresses[i] << ") accepted payload: \\"" << data << "\\"\\n";
                } else {
                    std::cout << "  --> FILTERED: Node '" << node_names[i] << "' (" 
                              << mac_addresses[i] << ") dropped packet (MAC mismatch).\\n";
                }
            }
            std::cout << "  [TERMINATION] 50-ohm end terminators absorbed residual energy.\\n\\n";
            is_channel_busy = false;
            return true;
        }
        return false;
    }
};

int main() {
    std::vector<std::string> nodes = {"Node A", "Node B", "Node C", "Node D", "Node E"};
    BusTopology bus(nodes);
    bus.transmit("Node A", "Node C", "CSMA/CD Packet");
    return 0;
}
`,
    javaCode: `import java.util.*;

public class BusNetworkSimulator {
    static class HostNode {
        String name;
        String macAddress;

        HostNode(String name, String macAddress) {
            this.name = name;
            this.macAddress = macAddress;
        }

        void receiveFrame(String srcMac, String dstMac, String payload) {
            if (this.macAddress.equalsIgnoreCase(dstMac)) {
                System.out.println("  --> MATCH: " + name + " [" + macAddress + "] accepted frame: \\"" + payload + "\\"");
            } else {
                System.out.println("  --> FILTERED: " + name + " [" + macAddress + "] dropped frame (MAC mismatch).");
            }
        }
    }

    private final List<HostNode> nodes = new ArrayList<>();
    private boolean isBusBusy = false;

    public BusNetworkSimulator(String[] names) {
        for (int i = 0; i < names.length; i++) {
            String mac = String.format("00:1A:2B:3C:4D:%02X", i + 1);
            nodes.add(new HostNode(names[i], mac));
        }
    }

    public boolean transmitFrame(String srcName, String dstName, String payload) {
        HostNode src = null, dst = null;
        for (HostNode n : nodes) {
            if (n.name.equalsIgnoreCase(srcName)) src = n;
            if (n.name.equalsIgnoreCase(dstName)) dst = n;
        }
        if (src == null || dst == null) return false;

        System.out.println("[BUS] " + src.name + " (" + src.macAddress + ") transmitting to " + dst.name);
        System.out.println("  [CSMA/CD] Carrier sensed: IDLE. Injecting frame onto coaxial backbone.");

        for (HostNode node : nodes) {
            if (node == src) continue;
            node.receiveFrame(src.macAddress, dst.macAddress, payload);
        }
        System.out.println("  [TERMINATORS] 50-ohm resistors prevented signal reflection.\\n");
        return true;
    }

    public static void main(String[] args) {
        String[] nodeNames = {"Node A", "Node B", "Node C", "Node D", "Node E"};
        BusNetworkSimulator bus = new BusNetworkSimulator(nodeNames);
        bus.transmitFrame("Node A", "Node C", "Hello over Bus Backbone");
    }
}
`,
    keyFeatures: [
      'Simulates Carrier Sense Multiple Access with Collision Detection (CSMA/CD).',
      'Calculates Truncated Binary Exponential Backoff delays upon collision.',
      'Demonstrates MAC address hardware filtering on drop lines.',
      'Shows impedance matching role of 50Ω terminators.',
    ],
  },

  star: {
    id: 'star',
    title: 'Star Topology: Layer 2 Switch CAM Table & Frame Forwarding',
    standard: 'IEEE 802.3 (10BASE-T, 100BASE-TX Fast Ethernet, 1000BASE-T GbE)',
    cableFormula: 'N Dedicated Twisted-Pair / Fiber Cables',
    complexity: {
      time: 'O(1) CAM Hash Table MAC lookup (microsecond wire-speed)',
      space: 'O(N) switch MAC table storage (port-to-MAC mapping)',
      collisionProb: '0% in full-duplex switched star networks',
    },
    summary:
      'In a modern Star topology, all endpoints connect via dedicated point-to-point cables to a central Switch. The switch builds an internal Content Addressable Memory (CAM) table to dynamically learn which MAC address resides on which physical port, enabling O(1) unicast forwarding.',
    pythonCode: `import time

class Layer2Switch:
    """Simulates an Ethernet Switch with self-learning CAM Table and frame filtering."""
    def __init__(self, port_count=8):
        self.port_count = port_count
        self.cam_table = {} # MAC Address -> {'port': int, 'timestamp': float}

    def process_frame(self, ingress_port, src_mac, dst_mac, payload):
        print(f"\\n[SWITCH] Frame arrived on Port {ingress_port}: {src_mac} -> {dst_mac}")
        
        # 1. MAC Address Learning
        if src_mac not in self.cam_table:
            print(f"  [CAM LEARN] Dynamic entry added: {src_mac} -> Port {ingress_port}")
        self.cam_table[src_mac] = {'port': ingress_port, 'time': time.time()}

        # 2. Forwarding Decision
        if dst_mac in self.cam_table:
            target_port = self.cam_table[dst_mac]['port']
            if target_port == ingress_port:
                print(f"  [FILTER] Dest MAC on same port {ingress_port}. Dropping frame.")
                return 'FILTERED'
            else:
                print(f"  [UNICAST O(1)] Found {dst_mac} in CAM Table. Forwarding ONLY to Port {target_port}.")
                return f"FORWARD_PORT_{target_port}"
        else:
            # 3. Unknown Unicast Flooding
            outgoing_ports = [p for p in range(1, self.port_count + 1) if p != ingress_port]
            print(f"  [FLOOD] Unknown destination {dst_mac}. Flooding to ports: {outgoing_ports}")
            return 'FLOOD'

# Example Usage
if __name__ == '__main__':
    sw = Layer2Switch(port_count=5)
    sw.process_frame(ingress_port=1, src_mac="00:00:00:AA:AA:01", dst_mac="00:00:00:CC:CC:03", payload="Ping")
    sw.process_frame(ingress_port=3, src_mac="00:00:00:CC:CC:03", dst_mac="00:00:00:AA:AA:01", payload="Pong")
`,
    cppCode: `#include <iostream>
#include <unordered_map>
#include <string>
#include <vector>

struct CAMEntry {
    int port;
    bool is_active;
};

class StarSwitch {
private:
    int total_ports;
    std::unordered_map<std::string, CAMEntry> cam_table;

public:
    StarSwitch(int ports = 8) : total_ports(ports) {}

    void forward_frame(int ingress_port, const std::string& src_mac, const std::string& dst_mac, const std::string& data) {
        std::cout << "[SWITCH] Ingress Port " << ingress_port << " | " << src_mac << " -> " << dst_mac << "\\n";

        // 1. MAC Learning
        if (cam_table.find(src_mac) == cam_table.end()) {
            std::cout << "  [+] Learned MAC " << src_mac << " on Port " << ingress_port << "\\n";
        }
        cam_table[src_mac] = {ingress_port, true};

        // 2. CAM Lookup
        auto it = cam_table.find(dst_mac);
        if (it != cam_table.end()) {
            int target_port = it->second.port;
            if (target_port == ingress_port) {
                std::cout << "  [!] Filtered: Destination is on same ingress port.\\n\\n";
            } else {
                std::cout << "  [>] UNICAST O(1): Forwarding directly to Port " << target_port << "\\n\\n";
            }
        } else {
            std::cout << "  [*] CAM MISS: Flooding frame to all ports except Port " << ingress_port << "\\n\\n";
        }
    }
};

int main() {
    StarSwitch mySwitch(5);
    mySwitch.forward_frame(1, "00:11:22:33:AA:01", "00:11:22:33:CC:03", "Frame 1");
    mySwitch.forward_frame(3, "00:11:22:33:CC:03", "00:11:22:33:AA:01", "Frame 2");
    return 0;
}
`,
    javaCode: `import java.util.*;

public class StarSwitchSimulator {
    static class CAMTableEntry {
        int port;
        long timestamp;

        CAMTableEntry(int port) {
            this.port = port;
            this.timestamp = System.currentTimeMillis();
        }
    }

    private final int totalPorts;
    private final Map<String, CAMTableEntry> camTable = new HashMap<>();

    public StarSwitchSimulator(int totalPorts) {
        this.totalPorts = totalPorts;
    }

    public void processFrame(int ingressPort, String srcMac, String dstMac, String payload) {
        System.out.println("[SWITCH] Frame received on Port " + ingressPort + ": " + srcMac + " -> " + dstMac);

        // 1. Dynamic MAC Learning
        if (!camTable.containsKey(srcMac)) {
            System.out.println("  [CAM LEARN] Registered " + srcMac + " on Port " + ingressPort);
        }
        camTable.put(srcMac, new CAMTableEntry(ingressPort));

        // 2. Forwarding Decision
        if (camTable.containsKey(dstMac)) {
            int targetPort = camTable.get(dstMac).port;
            System.out.println("  [UNICAST O(1)] Found MAC in CAM Table. Forwarding ONLY to Port " + targetPort + "\\n");
        } else {
            System.out.println("  [FLOOD] Unknown MAC. Flooding frame to all ports except " + ingressPort + "\\n");
        }
    }

    public static void main(String[] args) {
        StarSwitchSimulator sw = new StarSwitchSimulator(6);
        sw.processFrame(1, "AA:BB:CC:01:01:01", "AA:BB:CC:03:03:03", "Ping packet");
        sw.processFrame(3, "AA:BB:CC:03:03:03", "AA:BB:CC:01:01:01", "Pong reply");
    }
}
`,
    keyFeatures: [
      'Self-Learning Switch Algorithm (Dynamic CAM Table mapping).',
      'Unknown Unicast Flooding vs. Precise Hardware Unicast Forwarding.',
      'Port-Level Fault Isolation: Broken cable only disconnects that specific single host.',
      'Zero collision domain due to micro-segmentation.',
    ],
  },

  ring: {
    id: 'ring',
    title: 'Ring Topology: IEEE 802.5 Token Ring & Token Passing Protocol',
    standard: 'IEEE 802.5 Token Ring / ANSI X3T9.5 FDDI Dual-Ring',
    cableFormula: 'N Point-to-Point Links forming a closed loop',
    complexity: {
      time: 'O(N) deterministic bounded token wait time',
      space: 'O(1) per-station repeater buffer',
      collisionProb: '0% (token-controlled exclusive channel access)',
    },
    summary:
      'In a Ring topology, each node connects to exactly two adjacent neighbors in a circular loop. Channel access is mediated by a circulating 3-byte Token. Only the station holding the Free Token can transmit, guaranteeing zero collisions and deterministic delivery latency.',
    pythonCode: `class TokenRingStation:
    def __init__(self, station_id, mac):
        self.station_id = station_id
        self.mac = mac
        self.next_station = None

class TokenRingNetwork:
    def __init__(self, names):
        self.stations = [TokenRingStation(name, f"00:50:79:66:68:{i+1:02X}") for i, name in enumerate(names)]
        for i in range(len(self.stations)):
            self.stations[i].next_station = self.stations[(i + 1) % len(self.stations)]

    def send_data(self, src_idx, dst_idx, payload):
        src = self.stations[src_idx]
        dst = self.stations[dst_idx]
        
        print(f"[TOKEN RING] '{src.station_id}' sending to '{dst.station_id}'")
        print(f"  [1. TOKEN CAPTURE] '{src.station_id}' seized Free Token -> State set to BUSY DATA FRAME.")
        
        curr = src.next_station
        hops = 1
        frame_copied = False
        
        while curr != src:
            print(f"  [Hop {hops}] Frame passing through '{curr.station_id}' ({curr.mac})")
            if curr.mac == dst.mac:
                print(f"    --> TARGET MATCH! '{curr.station_id}' copied payload: '{payload}'")
                print("    --> Setting ACK bits: A=1 (Address Recognized), C=1 (Frame Copied).")
                frame_copied = True
            curr = curr.next_station
            hops += 1

        print(f"  [STRIP FRAME] Frame returned to sender '{src.station_id}'. ACK verified (A=1, C=1).")
        print(f"  [RELEASE TOKEN] Generating new FREE TOKEN handed to '{src.next_station.station_id}'.\\n")

if __name__ == '__main__':
    ring = TokenRingNetwork(["Station A", "Station B", "Station C", "Station D"])
    ring.send_data(0, 2, "Mission Critical Telemetry")
`,
    cppCode: `#include <iostream>
#include <vector>
#include <string>

struct Station {
    std::string name;
    std::string mac;
    Station* next;
};

class TokenRing {
private:
    std::vector<Station> ring;

public:
    TokenRing(const std::vector<std::string>& names) {
        ring.resize(names.size());
        for (size_t i = 0; i < names.size(); ++i) {
            ring[i].name = names[i];
            char buf[32];
            snprintf(buf, sizeof(buf), "00:50:79:66:68:%02X", static_cast<unsigned int>(i + 1));
            ring[i].mac = buf;
        }
        for (size_t i = 0; i < names.size(); ++i) {
            ring[i].next = &ring[(i + 1) % names.size()];
        }
    }

    void transmit(int src_idx, int dst_idx, const std::string& data) {
        Station* src = &ring[src_idx];
        Station* dst = &ring[dst_idx];

        std::cout << "[TOKEN RING] " << src->name << " seizes Free Token -> Transmitting frame for " << dst->name << "\\n";
        
        Station* curr = src->next;
        int hops = 1;
        while (curr != src) {
            std::cout << "  [Hop " << hops << "] " << curr->name << " inspecting frame... ";
            if (curr->mac == dst->mac) {
                std::cout << "[MATCH! Payload copied. Set A=1, C=1]\\n";
            } else {
                std::cout << "[Relaying downstream]\\n";
            }
            curr = curr->next;
            hops++;
        }
        std::cout << "  [STRIP] Frame returned to sender " << src->name << ". Stripped from ring.\\n";
        std::cout << "  [RELEASE] New Free Token generated -> handed to " << src->next->name << "\\n\\n";
    }
};

int main() {
    TokenRing ring({"Station A", "Station B", "Station C", "Station D"});
    ring.transmit(0, 2, "Automated Assembly Command");
    return 0;
}
`,
    javaCode: `import java.util.*;

public class TokenRingProtocol {
    static class RingStation {
        String name;
        String mac;
        RingStation nextStation;

        RingStation(String name, String mac) {
            this.name = name;
            this.mac = mac;
        }
    }

    private final List<RingStation> stations = new ArrayList<>();

    public TokenRingProtocol(String[] names) {
        for (int i = 0; i < names.length; i++) {
            stations.add(new RingStation(names[i], String.format("00:50:79:66:68:%02X", i + 1)));
        }
        for (int i = 0; i < stations.size(); i++) {
            stations.get(i).nextStation = stations.get((i + 1) % stations.size());
        }
    }

    public void transmit(int srcIndex, int dstIndex, String message) {
        RingStation src = stations.get(srcIndex);
        RingStation dst = stations.get(dstIndex);

        System.out.println("[TOKEN RING] " + src.name + " acquired Token -> Sending frame to " + dst.name);

        RingStation curr = src.nextStation;
        while (curr != src) {
            System.out.print("  -> Station " + curr.name + " checking frame... ");
            if (curr.mac.equals(dst.mac)) {
                System.out.println("[MATCH! Payload copied. Set A=1, C=1]");
            } else {
                System.out.println("[Relay downstream]");
            }
            curr = curr.nextStation;
        }

        System.out.println("  [COMPLETE] Frame returned to " + src.name + ". Released FREE TOKEN.\\n");
    }

    public static void main(String[] args) {
        TokenRingProtocol ring = new TokenRingProtocol(new String[]{"Station A", "Station B", "Station C", "Station D"});
        ring.transmit(0, 2, "Real-Time Sensor Feed");
    }
}
`,
    keyFeatures: [
      'Deterministic bounded latency (guaranteed delivery times for real-time systems).',
      'Token state machine (Free Token vs. Busy Data Frame).',
      'Frame Status (A bit: Address Recognized, C bit: Frame Copied) delivery acknowledgment.',
      'Sender frame stripping preventing infinite looping frames on the wire.',
    ],
  },

  mesh: {
    id: 'mesh',
    title: 'Mesh Topology: Direct O(1) Channels & Dynamic Rerouting',
    standard: 'Full Mesh & Partial Mesh (WAN Core & Military C2 Networks)',
    cableFormula: 'Full Mesh: N(N - 1) / 2 Duplex Channels | Ports per Node: N - 1',
    complexity: {
      time: 'O(1) direct single-hop point-to-point transmission',
      space: 'O(N^2) total physical channel wiring infrastructure',
      collisionProb: '0% (completely dedicated point-to-point links)',
    },
    summary:
      'In a Full Mesh topology, every device possesses a dedicated physical point-to-point connection to every other device in the network. For N nodes, exactly N(N-1)/2 duplex lines exist. If any direct link fails, the routing algorithm instantly computes an alternate multi-hop path with zero network-wide outage.',
    pythonCode: `from collections import deque

class FullMeshNetwork:
    """Simulates a Full Mesh graph with direct O(1) delivery and automatic fault failover."""
    def __init__(self, node_names):
        self.nodes = node_names
        self.links = set()
        for i in range(len(node_names)):
            for j in range(i + 1, len(node_names)):
                self.links.add((node_names[i], node_names[j]))
                self.links.add((node_names[j], node_names[i]))

    def cut_link(self, node_a, node_b):
        self.links.discard((node_a, node_b))
        self.links.discard((node_b, node_a))
        print(f"[FAULT] Physical link ({node_a} <--> {node_b}) SEVERED!")

    def send_packet(self, src, dst, data):
        print(f"\\n[MESH] Packet dispatch: '{src}' -> '{dst}': \\"{data}\\"")
        
        # Check direct link O(1)
        if (src, dst) in self.links:
            print("  ⚡ [DIRECT O(1)] Dedicated point-to-point link operational! Delivered in 1 hop.")
            return True
        
        # Dynamic Failover: Shortest Path Breadth-First Search
        print("  ⚠️ [FAILOVER] Direct link is DOWN! Computing dynamic rerouting path...")
        queue = deque([[src]])
        visited = {src}
        
        while queue:
            path = queue.popleft()
            node = path[-1]
            if node == dst:
                print(f"  ✅ [REROUTED] Delivered via backup path: {' -> '.join(path)}")
                return True
            for neighbor in self.nodes:
                if neighbor not in visited and (node, neighbor) in self.links:
                    visited.add(neighbor)
                    queue.append(path + [neighbor])
        
        print(f"  ❌ [PARTITION] Target '{dst}' is completely isolated.")
        return False

if __name__ == '__main__':
    mesh = FullMeshNetwork(["Node A", "Node B", "Node C", "Node D", "Node E"])
    mesh.send_packet("Node A", "Node C", "Primary Telemetry")
    mesh.cut_link("Node A", "Node C")
    mesh.send_packet("Node A", "Node C", "Failover Telemetry")
`,
    cppCode: `#include <iostream>
#include <vector>
#include <string>

#define N 4

class MeshRouter {
private:
    bool adj[N][N];
    std::string names[N];

public:
    MeshRouter() {
        names[0] = "Node A"; names[1] = "Node B"; names[2] = "Node C"; names[3] = "Node D";
        for (int i = 0; i < N; ++i) {
            for (int j = 0; j < N; ++j) {
                adj[i][j] = (i != j);
            }
        }
    }

    void sever_link(int u, int v) {
        adj[u][v] = false;
        adj[v][u] = false;
        std::cout << "[FAULT] Severed link between " << names[u] << " and " << names[v] << "\\n";
    }

    void send_packet(int src, int dst, const std::string& data) {
        std::cout << "[MESH] " << names[src] << " -> " << names[dst] << " (\\"" << data << "\\")\\n";
        
        if (adj[src][dst]) {
            std::cout << "  ⚡ Direct dedicated channel active. Delivered in O(1) single hop.\\n\\n";
            return;
        }

        // Search for 2-hop intermediate relay
        std::cout << "  ⚠️ Direct link down. Searching dynamic failover relay...\\n";
        for (int k = 0; k < N; ++k) {
            if (k != src && k != dst && adj[src][k] && adj[k][dst]) {
                std::cout << "  ✅ Failover route found: " << names[src] << " -> " 
                          << names[k] << " -> " << names[dst] << "\\n\\n";
                return;
            }
        }
        std::cout << "  ❌ Network Partitioned!\\n\\n";
    }
};

int main() {
    MeshRouter mesh;
    mesh.send_packet(0, 2, "Data Packet 1");
    mesh.sever_link(0, 2);
    mesh.send_packet(0, 2, "Data Packet 2");
    return 0;
}
`,
    javaCode: `import java.util.*;

public class FullMeshNetworkSimulator {
    private final String[] nodes;
    private final boolean[][] adjacencyMatrix;

    public FullMeshNetworkSimulator(String[] nodes) {
        this.nodes = nodes;
        int n = nodes.length;
        this.adjacencyMatrix = new boolean[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                adjacencyMatrix[i][j] = (i != j);
            }
        }
    }

    public void cutLink(int u, int v) {
        adjacencyMatrix[u][v] = false;
        adjacencyMatrix[v][u] = false;
        System.out.println("[FAULT] Link (" + nodes[u] + " <--> " + nodes[v] + ") severed!");
    }

    public void transmit(int src, int dst, String message) {
        System.out.println("[MESH] " + nodes[src] + " transmitting to " + nodes[dst] + " (\\"" + message + "\")");
        if (adjacencyMatrix[src][dst]) {
            System.out.println("  ⚡ Direct dedicated line used (O(1) latency, 1 hop).\\n");
        } else {
            System.out.println("  ⚠️ Direct line severed. Finding failover relay...");
            for (int k = 0; k < nodes.length; k++) {
                if (k != src && k != dst && adjacencyMatrix[src][k] && adjacencyMatrix[k][dst]) {
                    System.out.println("  ✅ Delivered via alternate relay: " + nodes[src] + " -> " + nodes[k] + " -> " + nodes[dst] + "\\n");
                    return;
                }
            }
            System.out.println("  ❌ No alternate path found.\\n");
        }
    }

    public static void main(String[] args) {
        String[] hosts = {"Node A", "Node B", "Node C", "Node D"};
        FullMeshNetworkSimulator mesh = new FullMeshNetworkSimulator(hosts);
        mesh.transmit(0, 2, "Primary data");
        mesh.cutLink(0, 2);
        mesh.transmit(0, 2, "Backup failover data");
    }
}
`,
    keyFeatures: [
      'Calculates physical cable formula N*(N-1)/2 for full mesh topologies.',
      'Demonstrates O(1) direct single-hop transmission guarantees.',
      'Automates multi-hop dynamic failover when physical links are severed.',
      'Shows highest fault tolerance and complete privacy/security per channel.',
    ],
  },

  tree: {
    id: 'tree',
    title: 'Tree Topology: Hierarchical Core-Distribution & LCA Routing',
    standard: 'IEEE 802.1D Spanning Tree Protocol (STP) / Enterprise Campus LAN',
    cableFormula: 'N - 1 Tree Links (Hierarchical parent-child links without loops)',
    complexity: {
      time: 'O(h) = O(log N) packet forwarding through Lowest Common Ancestor (LCA)',
      space: 'O(N) hierarchical routing prefix hierarchy',
      collisionProb: '0% on full-duplex switched tree hierarchy',
    },
    summary:
      'In a Tree topology, network nodes are organized in a parent-child tree structure rooted at a central Core Switch. Packets between leaf hosts travel UP the hierarchy to their Lowest Common Ancestor (LCA) switch, which then directs the packet DOWN to the target branch.',
    pythonCode: `class TreeNode:
    def __init__(self, name, layer_type):
        self.name = name
        self.layer_type = layer_type # 'core', 'distribution', 'access', 'host'
        self.parent = None
        self.children = []

    def add_child(self, child_node):
        child_node.parent = self
        self.children.append(child_node)

class TreeNetwork:
    def __init__(self):
        self.root = TreeNode("Core-Switch-01", "core")
        self.dist1 = TreeNode("Dist-Switch-East", "distribution")
        self.dist2 = TreeNode("Dist-Switch-West", "distribution")
        self.root.add_child(self.dist1)
        self.root.add_child(self.dist2)
        
        self.hosts = {
            "Host-1": TreeNode("Host-1 (Accounting)", "host"),
            "Host-2": TreeNode("Host-2 (Finance)", "host"),
            "Host-3": TreeNode("Host-3 (Engineering)", "host"),
        }
        self.dist1.add_child(self.hosts["Host-1"])
        self.dist1.add_child(self.hosts["Host-2"])
        self.dist2.add_child(self.hosts["Host-3"])

    def get_path_to_root(self, node):
        path = []
        curr = node
        while curr:
            path.append(curr)
            curr = curr.parent
        return path

    def route_packet(self, src_name, dst_name, data):
        src = self.hosts[src_name]
        dst = self.hosts[dst_name]
        print(f"[TREE] '{src.name}' --> '{dst.name}': \\"{data}\\"")
        
        src_path = self.get_path_to_root(src)
        dst_path = self.get_path_to_root(dst)
        
        dst_path_names = [n.name for n in dst_path]
        lca = next(n for n in src_path if n.name in dst_path_names)
        print(f"  🏛️ [LCA IDENTIFIED] Lowest Common Ancestor: '{lca.name}' ({lca.layer_type.upper()})")
        
        up_hops = src_path[:src_path.index(lca)+1]
        down_hops = dst_path[:dst_path.index(lca)][::-1]
        full_route = up_hops + down_hops
        
        route_str = " -> ".join([f"[{n.name}]" for n in full_route])
        print(f"  🧭 [TREE ROUTE] {route_str}")
        print("  ✅ Packet delivered via hierarchical branch switching.\\n")

if __name__ == '__main__':
    tree = TreeNetwork()
    tree.route_packet("Host-1", "Host-3", "Cross-department payroll file")
`,
    cppCode: `#include <iostream>
#include <vector>
#include <string>

class TreeRouter {
public:
    void route(const std::string& src, const std::string& dst) {
        std::cout << "[TREE] Routing from " << src << " to " << dst << "\\n";
        if (src.find("East") != std::string::npos && dst.find("East") != std::string::npos) {
            std::cout << "  -> LCA: Distribution Switch East (1-hop departmental relay)\\n";
            std::cout << "  -> Route: " << src << " -> Dist_East -> " << dst << "\\n\\n";
        } else {
            std::cout << "  -> LCA: Root Core Switch (Hierarchical Upward Traversal)\\n";
            std::cout << "  -> Route: " << src << " -> Dist_East -> CORE_SWITCH -> Dist_West -> " << dst << "\\n\\n";
        }
    }
};

int main() {
    TreeRouter router;
    router.route("Host_East_1", "Host_East_2");
    router.route("Host_East_1", "Host_West_3");
    return 0;
}
`,
    javaCode: `public class TreeTopologySimulator {
    public static void route(String src, String dst) {
        System.out.println("[TREE] Forwarding packet: " + src + " -> " + dst);
        if (src.contains("Dept1") && dst.contains("Dept1")) {
            System.out.println("  -> LCA: Local Branch Switch (Intra-subnet relay)");
            System.out.println("  -> Path: " + src + " -> Branch_Sw_1 -> " + dst + "\\n");
        } else {
            System.out.println("  -> LCA: Core Backbone Switch (Inter-subnet routing)");
            System.out.println("  -> Path: " + src + " -> Branch_1 -> CORE_ROOT -> Branch_2 -> " + dst + "\\n");
        }
    }

    public static void main(String[] args) {
        route("Host_Dept1_A", "Host_Dept1_B");
        route("Host_Dept1_A", "Host_Dept2_C");
    }
}
`,
    keyFeatures: [
      'Hierarchical 3-Tier Enterprise Model (Core, Distribution, Access).',
      'Lowest Common Ancestor (LCA) calculation for optimal uplink/downlink switching.',
      'Scalable subnet isolation per branch switch.',
      'Eliminates loops without requiring link-state flooding.',
    ],
  },

  hybrid: {
    id: 'hybrid',
    title: 'Hybrid Topology: Multi-Protocol Bridge & Gateway Routing',
    standard: 'IEEE 802.1Q VLAN Bridging & Mixed Architecture Enterprise Networks',
    cableFormula: 'Variable (Composite of Sub-Topology Formulas)',
    complexity: {
      time: 'O(intra-segment) + O(bridge translation)',
      space: 'O(N) segment bridge routing table',
      collisionProb: 'Isolated per sub-network segment',
    },
    summary:
      'A Hybrid topology combines two or more distinct topological architectures interconnected by Bridges, Gateways, or Routers, leveraging the benefits of multiple layouts (e.g. Star departments joined across a Ring or Bus backbone).',
    pythonCode: `class HybridGatewayBridge:
    def __init__(self):
        self.star_cluster = {"N1": "10.0.1.11", "N2": "10.0.1.12"}
        self.ring_segment = {"N3": "10.0.2.13", "N4": "10.0.2.14"}

    def route_message(self, src_id, dst_id, payload):
        print(f"[HYBRID GATEWAY] Dispatch: '{src_id}' -> '{dst_id}': \\"{payload}\\"")
        
        src_in_star = src_id in self.star_cluster
        dst_in_star = dst_id in self.star_cluster
        
        if src_in_star and dst_in_star:
            print("  🟢 [INTRA-STAR] Handled by Local Ethernet Switch.")
        elif not src_in_star and not dst_in_star:
            print("  🟡 [INTRA-RING] Circulated across Token Ring segment.")
        else:
            print("  🌐 [INTER-SEGMENT via GATEWAY BRIDGE]")
            print(f"    1. '{src_id}' transmits Ethernet frame to Gateway Bridge.")
            print("    2. Bridge translates Ethernet Frame header <--> Ring Token Frame.")
            print(f"    3. Frame dispatched across inter-building backbone to '{dst_id}'.")
        print("  ✅ Transmission successfully completed.\\n")

if __name__ == '__main__':
    gateway = HybridGatewayBridge()
    gateway.route_message("N1", "N2", "Intra-Star message")
    gateway.route_message("N1", "N4", "Inter-Topology control signal")
`,
    cppCode: `#include <iostream>
#include <string>

class HybridBridge {
public:
    void dispatch(const std::string& src, const std::string& dst) {
        std::cout << "[HYBRID BRIDGE] Routing from " << src << " to " << dst << "\\n";
        if (src.rfind("STAR_", 0) == 0 && dst.rfind("STAR_", 0) == 0) {
            std::cout << "  -> Handled directly by Local Star Switch (0 bridge translation)\\n\\n";
        } else {
            std::cout << "  -> Transferred through Hybrid Gateway Bridge with Frame Encapsulation\\n";
            std::cout << "  -> Protocol translation: Ethernet Star <--> FDDI Ring Backbone\\n\\n";
        }
    }
};

int main() {
    HybridBridge bridge;
    bridge.dispatch("STAR_Host1", "STAR_Host2");
    bridge.dispatch("STAR_Host1", "RING_Server4");
    return 0;
}
`,
    javaCode: `public class HybridNetworkGateway {
    public static void route(String src, String dst) {
        System.out.println("[HYBRID ROUTER] Dispatching: " + src + " -> " + dst);
        if (src.startsWith("Star") && dst.startsWith("Ring")) {
            System.out.println("  🔄 Protocol Conversion: Ethernet 802.3 Frame -> Token Ring Frame");
            System.out.println("  🌉 Forwarded through Backbone Gateway Bridge.\\n");
        } else {
            System.out.println("  ✅ Handled locally within same topological segment.\\n");
        }
    }

    public static void main(String[] args) {
        route("Star_PC1", "Star_PC2");
        route("Star_PC1", "Ring_Server4");
    }
}
`,
    keyFeatures: [
      'Encapsulation & translation between disparate physical topologies.',
      'Isolation of broadcast domains per topological segment.',
      'Flexible scalability without requiring complete network overhaul.',
      'Real-world enterprise network design representation.',
    ],
  },
};

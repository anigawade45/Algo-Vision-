export const httpPython = `class HttpRequest:
    """Simulated HTTP/1.1 Request Object."""
    def __init__(self, method, path, body=None):
        self.method = method.upper()
        self.path = path
        self.body = body
        self.headers = {
            "Host": "api.algovision.dev",
            "User-Agent": "AlgoVision-Browser/1.0",
            "Accept": "application/json, text/html"
        }

    def __str__(self):
        req_str = f"{self.method} {self.path} HTTP/1.1\\n"
        for k, v in self.headers.items():
            req_str += f"{k}: {v}\\n"
        if self.body:
            req_str += f"\\nPayload: {self.body}"
        return req_str


class HttpResponse:
    """Simulated HTTP/1.1 Response Object."""
    def __init__(self, status_code, status_message, content_type, body):
        self.status_code = status_code
        self.status_message = status_message
        self.body = body
        self.headers = {
            "Content-Type": content_type,
            "Content-Length": str(len(body)),
            "Server": "AlgoVision-WebServer/2.0"
        }

    def __str__(self):
        res_str = f"HTTP/1.1 {self.status_code} {self.status_message}\\n"
        for k, v in self.headers.items():
            res_str += f"{k}: {v}\\n"
        res_str += f"\\n{self.body}"
        return res_str


class SimpleHttpServer:
    """Simulated Web Server Router."""
    def handle_request(self, req: HttpRequest) -> HttpResponse:
        if req.method == "GET" and req.path == "/index.html":
            return HttpResponse(200, "OK", "text/html", "<html><body><h1>Welcome to AlgoVision!</h1></body></html>")
        elif req.method == "POST" and req.path == "/api/comments":
            return HttpResponse(201, "Created", "application/json", '{"status": "success", "message": "Resource created"}')
        else:
            return HttpResponse(404, "Not Found", "text/plain", "404 - Endpoint not found.")


def main():
    server = SimpleHttpServer()

    print("========== CLIENT SENDS GET REQUEST ==========")
    get_req = HttpRequest("GET", "/index.html")
    print(get_req)

    get_res = server.handle_request(get_req)
    print("\\n<-- CLIENT RECEIVED RESPONSE:")
    print(get_res)

    print("\\n========== CLIENT SENDS POST REQUEST ==========")
    post_req = HttpRequest("POST", "/api/comments", '{"author": "Ritesh", "text": "Great simulation!"}')
    print(post_req)

    post_res = server.handle_request(post_req)
    print("\\n<-- CLIENT RECEIVED RESPONSE:")
    print(post_res)


if __name__ == "__main__":
    main()`;

export const httpCpp = `#include <iostream>
#include <string>
#include <map>

class HttpRequest {
public:
    std::string method;
    std::string path;
    std::string body;
    std::map<std::string, std::string> headers;

    HttpRequest(std::string m, std::string p, std::string b = "") : method(m), path(p), body(b) {
        headers["Host"] = "api.algovision.dev";
        headers["User-Agent"] = "AlgoVision-Browser/1.0";
        headers["Accept"] = "application/json, text/html";
    }

    void display() const {
        std::cout << method << " " << path << " HTTP/1.1\\n";
        for (const auto& h : headers) {
            std::cout << h.first << ": " << h.second << "\\n";
        }
        if (!body.empty()) {
            std::cout << "\\nPayload: " << body << "\\n";
        }
    }
};

class HttpResponse {
public:
    int statusCode;
    std::string statusMessage;
    std::string body;
    std::map<std::string, std::string> headers;

    HttpResponse(int code, std::string msg, std::string cType, std::string b)
        : statusCode(code), statusMessage(msg), body(b) {
        headers["Content-Type"] = cType;
        headers["Content-Length"] = std::to_string(b.length());
        headers["Server"] = "AlgoVision-WebServer/2.0";
    }

    void display() const {
        std::cout << "HTTP/1.1 " << statusCode << " " << statusMessage << "\\n";
        for (const auto& h : headers) {
            std::cout << h.first << ": " << h.second << "\\n";
        }
        std::cout << "\\n" << body << "\\n";
    }
};

class SimpleHttpServer {
public:
    HttpResponse handleRequest(const HttpRequest& req) {
        if (req.method == "GET" && req.path == "/index.html") {
            return HttpResponse(200, "OK", "text/html", "<html><body><h1>Welcome to AlgoVision!</h1></body></html>");
        } else if (req.method == "POST" && req.path == "/api/comments") {
            return HttpResponse(201, "Created", "application/json", "{\\"status\\": \\"success\\", \\"message\\": \\"Resource created\\"}");
        } else {
            return HttpResponse(404, "Not Found", "text/plain", "404 - Endpoint not found.");
        }
    }
};

int main() {
    SimpleHttpServer server;

    std::cout << "========== CLIENT SENDS GET REQUEST ==========\\n";
    HttpRequest getReq("GET", "/index.html");
    getReq.display();

    HttpResponse getRes = server.handleRequest(getReq);
    std::cout << "\\n<-- CLIENT RECEIVED RESPONSE:\\n";
    getRes.display();

    std::cout << "\\n========== CLIENT SENDS POST REQUEST ==========\\n";
    HttpRequest postReq("POST", "/api/comments", "{\\"author\\": \\"Ritesh\\", \\"text\\": \\"Great simulation!\\"}");
    postReq.display();

    HttpResponse postRes = server.handleRequest(postReq);
    std::cout << "\\n<-- CLIENT RECEIVED RESPONSE:\\n";
    postRes.display();

    return 0;
}`;

export const dnsPython = `class DnsRecord:
    """Simulated DNS Resource Record (A-Record)."""
    def __init__(self, domain, ip_address, rec_type="A", ttl=300):
        self.domain = domain
        self.ip_address = ip_address
        self.type = rec_type
        self.ttl = ttl


class DnsHierarchy:
    """Simulates Hierarchical DNS Resolution & Caching."""
    def __init__(self):
        # Master Authoritative Zones
        self.authoritative_zone = {
            "www.example.com": DnsRecord("www.example.com", "93.184.216.34", "A", 300),
            "api.github.com": DnsRecord("api.github.com", "140.82.121.6", "A", 300),
            "algovision.dev": DnsRecord("algovision.dev", "76.76.21.21", "A", 300)
        }
        # Local Recursive Resolver Cache
        self.resolver_cache = {}

    def resolve_domain(self, domain: str) -> str:
        print(f"\\n[DNS Client] Initiating lookup for: {domain}")

        # 1. Local Resolver Cache Check
        if domain in self.resolver_cache:
            ip = self.resolver_cache[domain].ip_address
            print(f"  [CACHE HIT] Found in Resolver Cache -> {ip}")
            return ip

        print("  [CACHE MISS] Traversing DNS Hierarchy...")
        print("  1. Querying Root Server (.) -> Referred to TLD Server")

        tld = domain[domain.rfind("."):]
        print(f"  2. Querying {tld} TLD Server -> Referred to Authoritative Name Server")
        print(f"  3. Querying Authoritative Server for {domain}")

        if domain in self.authoritative_zone:
            record = self.authoritative_zone[domain]
            print(f"  4. Authoritative Server returned A Record: {record.ip_address} (TTL: {record.ttl}s)")
            self.resolver_cache[domain] = record
            print("  5. Cached locally for future fast lookups.")
            return record.ip_address
        else:
            print("  [ERROR] NXDOMAIN: Domain not found in Authoritative Server.")
            return None


def main():
    dns = DnsHierarchy()

    # Query 1: Cold Cache
    ip1 = dns.resolve_domain("www.example.com")
    print(f"Result: www.example.com -> {ip1}")

    # Query 2: Warm Cache (Cache Hit)
    ip2 = dns.resolve_domain("www.example.com")
    print(f"Result: www.example.com -> {ip2}")

    # Query 3: Another Domain
    ip3 = dns.resolve_domain("api.github.com")
    print(f"Result: api.github.com -> {ip3}")


if __name__ == "__main__":
    main()`;

export const dnsCpp = `#include <iostream>
#include <string>
#include <map>

struct DnsRecord {
    std::string domain;
    std::string ipAddress;
    std::string type;
    int ttl;

    DnsRecord(std::string d = "", std::string ip = "", std::string t = "A", int time = 300)
        : domain(d), ipAddress(ip), type(t), ttl(time) {}
};

class DnsHierarchy {
private:
    std::map<std::string, DnsRecord> authoritativeZone;
    std::map<std::string, DnsRecord> resolverCache;

public:
    DnsHierarchy() {
        authoritativeZone["www.example.com"] = DnsRecord("www.example.com", "93.184.216.34", "A", 300);
        authoritativeZone["api.github.com"] = DnsRecord("api.github.com", "140.82.121.6", "A", 300);
        authoritativeZone["algovision.dev"] = DnsRecord("algovision.dev", "76.76.21.21", "A", 300);
    }

    std::string resolveDomain(const std::string& domain) {
        std::cout << "\\n[DNS Client] Initiating lookup for: " << domain << "\\n";

        // 1. Check Resolver Cache
        if (resolverCache.find(domain) != resolverCache.end()) {
            std::string ip = resolverCache[domain].ipAddress;
            std::cout << "  [CACHE HIT] Found in Resolver Cache -> " << ip << "\\n";
            return ip;
        }

        std::cout << "  [CACHE MISS] Traversing DNS Hierarchy...\\n";
        std::cout << "  1. Querying Root Server (.) -> Referred to .com / .dev TLD Server\\n";

        size_t dotPos = domain.rfind(".");
        std::string tld = (dotPos != std::string::npos) ? domain.substr(dotPos) : ".com";
        std::cout << "  2. Querying " << tld << " TLD Server -> Referred to Authoritative Name Server\\n";
        std::cout << "  3. Querying Authoritative Server for " << domain << "\\n";

        if (authoritativeZone.find(domain) != authoritativeZone.end()) {
            DnsRecord record = authoritativeZone[domain];
            std::cout << "  4. Authoritative Server returned A Record: " << record.ipAddress << " (TTL: " << record.ttl << "s)\\n";
            resolverCache[domain] = record;
            std::cout << "  5. Cached locally for future fast lookups.\\n";
            return record.ipAddress;
        } else {
            std::cout << "  [ERROR] NXDOMAIN: Domain not found.\\n";
            return "";
        }
    }
};

int main() {
    DnsHierarchy dns;

    // 1st Query: Cache Miss
    std::string ip1 = dns.resolveDomain("www.example.com");
    std::cout << "Result: www.example.com -> " << ip1 << "\\n";

    // 2nd Query: Cache Hit
    std::string ip2 = dns.resolveDomain("www.example.com");
    std::cout << "Result: www.example.com -> " << ip2 << "\\n";

    // 3rd Query: Different domain
    std::string ip3 = dns.resolveDomain("api.github.com");
    std::cout << "Result: api.github.com -> " << ip3 << "\\n";

    return 0;
}`;

export const dhcpPython = `class DhcpLease:
    """Represents a dynamic DHCP Lease assigned to a client."""
    def __init__(self, mac_address, assigned_ip, subnet_mask, default_gateway, lease_duration=86400):
        self.mac_address = mac_address
        self.assigned_ip = assigned_ip
        self.subnet_mask = subnet_mask
        self.default_gateway = default_gateway
        self.lease_duration = lease_duration


class DhcpServer:
    """Simulates DHCP 4-Way DORA (Discover, Offer, Request, Acknowledge)."""
    def __init__(self):
        self.available_pool = ["192.168.1.10", "192.168.1.11", "192.168.1.12", "192.168.1.13"]
        self.active_leases = {}
        self.subnet_mask = "255.255.255.0"
        self.default_gateway = "192.168.1.1"

    def handle_discover(self, client_mac: str) -> str:
        print(f"1. [SERVER] Received DHCPDISCOVER broadcast from MAC: {client_mac}")
        if not self.available_pool:
            print("   [ERROR] IP Pool exhausted!")
            return None
        offered_ip = self.available_pool[0]
        print(f"2. [SERVER] Sending DHCPOFFER proposing IP: {offered_ip}")
        return offered_ip

    def handle_request(self, client_mac: str, requested_ip: str) -> DhcpLease:
        print(f"3. [SERVER] Received DHCPREQUEST from {client_mac} accepting IP: {requested_ip}")
        if requested_ip in self.available_pool:
            self.available_pool.remove(requested_ip)
            lease = DhcpLease(client_mac, requested_ip, self.subnet_mask, self.default_gateway)
            self.active_leases[client_mac] = lease
            print(f"4. [SERVER] Sending DHCPACK committing lease for {requested_ip} (Lease: 24h)")
            return lease
        return None

    def display_status(self):
        print(f"\\n--- DHCP SERVER STATUS ---")
        print(f"Available Pool: {self.available_pool}")
        print(f"Active Leases Count: {len(self.active_leases)}")


def main():
    server = DhcpServer()
    server.display_status()

    print("\\n========== CLIENT 1 CONNECTS (DORA FLOW) ==========")
    client1_mac = "00:1A:2B:3C:4D:5E"
    offered_ip1 = server.handle_discover(client1_mac)
    lease1 = server.handle_request(client1_mac, offered_ip1)
    print(f"--> Client 1 configured with IP: {lease1.assigned_ip}, Mask: {lease1.subnet_mask}")

    print("\\n========== CLIENT 2 CONNECTS ==========")
    client2_mac = "A4:C3:F0:88:12:99"
    offered_ip2 = server.handle_discover(client2_mac)
    lease2 = server.handle_request(client2_mac, offered_ip2)
    print(f"--> Client 2 configured with IP: {lease2.assigned_ip}")

    server.display_status()


if __name__ == "__main__":
    main()`;

export const dhcpCpp = `#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>

struct DhcpLease {
    std::string macAddress;
    std::string assignedIp;
    std::string subnetMask;
    std::string defaultGateway;
    long leaseDuration;

    DhcpLease(std::string mac = "", std::string ip = "", std::string mask = "", std::string gw = "", long duration = 86400)
        : macAddress(mac), assignedIp(ip), subnetMask(mask), defaultGateway(gw), leaseDuration(duration) {}
};

class DhcpServer {
private:
    std::vector<std::string> availablePool;
    std::map<std::string, DhcpLease> activeLeases;
    std::string subnetMask;
    std::string defaultGateway;

public:
    DhcpServer() : subnetMask("255.255.255.0"), defaultGateway("192.168.1.1") {
        availablePool.push_back("192.168.1.10");
        availablePool.push_back("192.168.1.11");
        availablePool.push_back("192.168.1.12");
        availablePool.push_back("192.168.1.13");
    }

    std::string handleDiscover(const std::string& clientMac) {
        std::cout << "1. [SERVER] Received DHCPDISCOVER broadcast from MAC: " << clientMac << "\\n";
        if (availablePool.empty()) {
            std::cout << "   [ERROR] IP Pool exhausted!\\n";
            return "";
        }
        std::string offeredIp = availablePool.front();
        std::cout << "2. [SERVER] Sending DHCPOFFER proposing IP: " << offeredIp << "\\n";
        return offeredIp;
    }

    DhcpLease handleRequest(const std::string& clientMac, const std::string& requestedIp) {
        std::cout << "3. [SERVER] Received DHCPREQUEST from " << clientMac << " accepting IP: " << requestedIp << "\\n";
        auto it = std::find(availablePool.begin(), availablePool.end(), requestedIp);
        if (it != availablePool.end()) {
            availablePool.erase(it);
            DhcpLease lease(clientMac, requestedIp, subnetMask, defaultGateway, 86400);
            activeLeases[clientMac] = lease;
            std::cout << "4. [SERVER] Sending DHCPACK committing lease for " << requestedIp << " (Lease: 24h)\\n";
            return lease;
        }
        return DhcpLease();
    }

    void displayStatus() const {
        std::cout << "\\n--- DHCP SERVER STATUS ---\\n";
        std::cout << "Available Pool Count: " << availablePool.size() << "\\n";
        std::cout << "Active Leases Count: " << activeLeases.size() << "\\n";
    }
};

int main() {
    DhcpServer server;
    server.displayStatus();

    std::cout << "\\n========== CLIENT 1 CONNECTS (DORA FLOW) ==========\\n";
    std::string client1Mac = "00:1A:2B:3C:4D:5E";
    std::string offeredIp1 = server.handleDiscover(client1Mac);
    DhcpLease lease1 = server.handleRequest(client1Mac, offeredIp1);
    std::cout << "--> Client 1 configured with IP: " << lease1.assignedIp << ", Mask: " << lease1.subnetMask << "\\n";

    std::cout << "\\n========== CLIENT 2 CONNECTS ==========\\n";
    std::string client2Mac = "A4:C3:F0:88:12:99";
    std::string offeredIp2 = server.handleDiscover(client2Mac);
    DhcpLease lease2 = server.handleRequest(client2Mac, offeredIp2);
    std::cout << "--> Client 2 configured with IP: " << lease2.assignedIp << "\\n";

    server.displayStatus();
    return 0;
}`;

export const arpPython = `class ArpEntry:
    """Represents an IP-to-MAC mapping in the ARP Cache."""
    def __init__(self, ip, mac, entry_type="Dynamic"):
        self.ip = ip
        self.mac = mac
        self.type = entry_type


class HostNetworkStack:
    """Simulates Host ARP Resolution & Cache Management."""
    LAN_NETWORK = {
        "192.168.1.5": "AA:BB:CC:DD:EE:05",
        "192.168.1.10": "11:22:33:44:55:66",
        "192.168.1.1": "00:50:56:FE:ED:01"  # Default Gateway
    }

    def __init__(self, host_name, ip, mac):
        self.host_name = host_name
        self.host_ip = ip
        self.host_mac = mac
        self.arp_cache = {}

    def get_mac_for_ip(self, target_ip: str) -> str:
        print(f"\\n[{self.host_name}] Resolving MAC address for IP: {target_ip}")

        # 1. Check Local ARP Cache (Cache Hit)
        if target_ip in self.arp_cache:
            mac = self.arp_cache[target_ip].mac
            print(f"  --> [ARP CACHE HIT] {target_ip} = {mac} (Dynamic)")
            return mac

        # 2. Cache Miss -> Broadcast ARP Request
        print(f"  --> [ARP CACHE MISS] Broadcasting ARP Request to FF:FF:FF:FF:FF:FF")
        print(f'      "Who has {target_ip}? Tell {self.host_ip} ({self.host_mac})"')

        # 3. Target Host Responds with Unicast ARP Reply
        if target_ip in self.LAN_NETWORK:
            target_mac = self.LAN_NETWORK[target_ip]
            print(f'  <-- [ARP REPLY UNICAST] {target_ip} replies: "I am at {target_mac}"')
            self.arp_cache[target_ip] = ArpEntry(target_ip, target_mac, "Dynamic")
            print(f"  --> [CACHE UPDATED] Added {target_ip} -> {target_mac} to ARP table.")
            return target_mac
        else:
            print("  <-- [ARP TIMEOUT] Destination Host Unreachable (No reply).")
            return None

    def print_arp_table(self):
        print(f"\\n--- {self.host_name} ARP TABLE ---")
        print(f"{'Internet Address':<20} {'Physical Address':<20} {'Type':<10}")
        for entry in self.arp_cache.values():
            print(f"{entry.ip:<20} {entry.mac:<20} {entry.type:<10}")


def main():
    pc1 = HostNetworkStack("PC1", "192.168.1.2", "DE:AD:BE:EF:00:01")

    # Packet 1 to 192.168.1.5 (Cache Miss -> Broadcast Request -> Unicast Reply)
    mac1 = pc1.get_mac_for_ip("192.168.1.5")
    print(f"Packet ready to send to MAC: {mac1}")

    # Packet 2 to 192.168.1.5 (Instant Cache Hit -> 0 Broadcast traffic)
    mac2 = pc1.get_mac_for_ip("192.168.1.5")
    print(f"Packet ready to send to MAC: {mac2}")

    # Packet 3 to Gateway 192.168.1.1
    pc1.get_mac_for_ip("192.168.1.1")

    pc1.print_arp_table()


if __name__ == "__main__":
    main()`;

export const arpCpp = `#include <iostream>
#include <string>
#include <map>
#include <iomanip>

struct ArpEntry {
    std::string ipAddress;
    std::string macAddress;
    std::string type;

    ArpEntry(std::string ip = "", std::string mac = "", std::string t = "Dynamic")
        : ipAddress(ip), macAddress(mac), type(t) {}
};

class HostNetworkStack {
private:
    std::string hostName;
    std::string hostIp;
    std::string hostMac;
    std::map<std::string, ArpEntry> arpCache;
    std::map<std::string, std::string> lanNetwork;

public:
    HostNetworkStack(std::string name, std::string ip, std::string mac)
        : hostName(name), hostIp(ip), hostMac(mac) {
        lanNetwork["192.168.1.5"] = "AA:BB:CC:DD:EE:05";
        lanNetwork["192.168.1.10"] = "11:22:33:44:55:66";
        lanNetwork["192.168.1.1"] = "00:50:56:FE:ED:01";
    }

    std::string getMacForIp(const std::string& targetIp) {
        std::cout << "\\n[" << hostName << "] Resolving MAC address for IP: " << targetIp << "\\n";

        // 1. Check ARP Cache
        if (arpCache.find(targetIp) != arpCache.end()) {
            std::string mac = arpCache[targetIp].macAddress;
            std::cout << "  --> [ARP CACHE HIT] " << targetIp << " = " << mac << " (Dynamic)\\n";
            return mac;
        }

        // 2. Cache Miss -> Broadcast ARP Request
        std::cout << "  --> [ARP CACHE MISS] Broadcasting ARP Request to FF:FF:FF:FF:FF:FF\\n";
        std::cout << "      \\"Who has " << targetIp << "? Tell " << hostIp << " (" << hostMac << ")\\"\\n";

        // 3. LAN resolution
        if (lanNetwork.find(targetIp) != lanNetwork.end()) {
            std::string targetMac = lanNetwork[targetIp];
            std::cout << "  <-- [ARP REPLY UNICAST] " << targetIp << " replies: \\"I am at " << targetMac << "\\"\\n";
            arpCache[targetIp] = ArpEntry(targetIp, targetMac, "Dynamic");
            std::cout << "  --> [CACHE UPDATED] Added " << targetIp << " -> " << targetMac << " to ARP table.\\n";
            return targetMac;
        } else {
            std::cout << "  <-- [ARP TIMEOUT] Destination Host Unreachable.\\n";
            return "";
        }
    }

    void printArpTable() const {
        std::cout << "\\n--- " << hostName << " ARP TABLE ---\\n";
        std::cout << std::left << std::setw(20) << "Internet Address"
                  << std::setw(20) << "Physical Address"
                  << std::setw(10) << "Type" << "\\n";
        for (const auto& pair : arpCache) {
            std::cout << std::left << std::setw(20) << pair.second.ipAddress
                      << std::setw(20) << pair.second.macAddress
                      << std::setw(10) << pair.second.type << "\\n";
        }
    }
};

int main() {
    HostNetworkStack pc1("PC1", "192.168.1.2", "DE:AD:BE:EF:00:01");

    // Packet 1: Cache Miss
    std::string mac1 = pc1.getMacForIp("192.168.1.5");
    std::cout << "Packet ready to send to MAC: " << mac1 << "\\n";

    // Packet 2: Cache Hit
    std::string mac2 = pc1.getMacForIp("192.168.1.5");
    std::cout << "Packet ready to send to MAC: " << mac2 << "\\n";

    // Packet 3: Gateway
    pc1.getMacForIp("192.168.1.1");

    pc1.printArpTable();
    return 0;
}`;

export const icmpPython = `import time
import random

class IcmpEchoPacket:
    """Simulates an ICMP Type 8 Echo Request / Type 0 Echo Reply packet."""
    def __init__(self, sequence_num, source_ip, destination_ip, packet_type=8):
        self.sequence_num = sequence_num
        self.source_ip = source_ip
        self.destination_ip = destination_ip
        self.type = packet_type  # 8 = Echo Request, 0 = Echo Reply
        self.sent_timestamp = time.time()


class IcmpPingSimulator:
    """Simulates the network 'ping' diagnostic utility."""
    def ping(self, target_ip: str, packet_count: int = 4):
        print(f"PING {target_ip} with 32 bytes of diagnostic data:\\n")

        received = 0
        latencies = []

        for seq in range(1, packet_count + 1):
            # Construct ICMP Echo Request
            req = IcmpEchoPacket(seq, "192.168.1.100", target_ip, packet_type=8)

            # Simulated trip latency (12ms - 35ms)
            latency_ms = random.randint(12, 35)

            # Simulate 10% packet drop
            dropped = random.random() < 0.10

            if not dropped:
                received += 1
                latencies.append(latency_ms)
                print(f"Reply from {target_ip}: bytes=32 seq={seq} time={latency_ms}ms TTL=118")
            else:
                print(f"Request timed out (seq={seq}).")

            time.sleep(0.05)

        # Compute Ping Statistics
        lost = packet_count - received
        loss_rate = (lost / packet_count) * 100

        print(f"\\n--- {target_ip} Ping Statistics ---")
        print(f"Packets: Sent = {packet_count}, Received = {received}, Lost = {lost} ({loss_rate:.1f}% loss)")

        if latencies:
            min_rtt = min(latencies)
            max_rtt = max(latencies)
            avg_rtt = sum(latencies) / len(latencies)
            print("Approximate round trip times in milli-seconds:")
            print(f"    Minimum = {min_rtt}ms, Maximum = {max_rtt}ms, Average = {avg_rtt:.1f}ms")


def main():
    ping_tool = IcmpPingSimulator()

    print("========== SIMULATING ICMP PING (8.8.8.8) ==========")
    ping_tool.ping("8.8.8.8", 4)

    print("\\n========== SIMULATING LOCAL HOST PING (192.168.1.1) ==========")
    ping_tool.ping("192.168.1.1", 4)


if __name__ == "__main__":
    main()`;

export const icmpCpp = `#include <iostream>
#include <string>
#include <vector>
#include <numeric>
#include <algorithm>
#include <cstdlib>

struct IcmpEchoPacket {
    int sequenceNum;
    std::string sourceIp;
    std::string destinationIp;
    int type; // 8 = Request, 0 = Reply

    IcmpEchoPacket(int seq, std::string src, std::string dst, int t = 8)
        : sequenceNum(seq), sourceIp(src), destinationIp(dst), type(t) {}
};

class IcmpPingSimulator {
public:
    void ping(const std::string& targetIp, int packetCount = 4) {
        std::cout << "PING " << targetIp << " with 32 bytes of diagnostic data:\\n\\n";

        int received = 0;
        std::vector<int> latencies;

        for (int seq = 1; seq <= packetCount; seq++) {
            IcmpEchoPacket req(seq, "192.168.1.100", targetIp, 8);

            int latencyMs = 12 + (std::rand() % 24);
            bool dropped = (std::rand() % 100) < 10;

            if (!dropped) {
                received++;
                latencies.push_back(latencyMs);
                std::cout << "Reply from " << targetIp << ": bytes=32 seq=" << seq << " time=" << latencyMs << "ms TTL=118\\n";
            } else {
                std::cout << "Request timed out (seq=" << seq << ").\\n";
            }
        }

        int lost = packetCount - received;
        double lossRate = ((double)lost / packetCount) * 100.0;

        std::cout << "\\n--- " << targetIp << " Ping Statistics ---\\n";
        std::cout << "Packets: Sent = " << packetCount << ", Received = " << received << ", Lost = " << lost << " (" << lossRate << "% loss)\\n";

        if (!latencies.empty()) {
            int minRtt = *std::min_element(latencies.begin(), latencies.end());
            int maxRtt = *std::max_element(latencies.begin(), latencies.end());
            double avgRtt = std::accumulate(latencies.begin(), latencies.end(), 0.0) / latencies.size();

            std::cout << "Approximate round trip times in milli-seconds:\\n";
            std::cout << "    Minimum = " << minRtt << "ms, Maximum = " << maxRtt << "ms, Average = " << avgRtt << "ms\\n";
        }
    }
};

int main() {
    IcmpPingSimulator pingTool;

    std::cout << "========== SIMULATING ICMP PING (8.8.8.8) ==========\\n";
    pingTool.ping("8.8.8.8", 4);

    std::cout << "\\n========== SIMULATING LOCAL HOST PING (192.168.1.1) ==========\\n";
    pingTool.ping("192.168.1.1", 4);

    return 0;
}`;

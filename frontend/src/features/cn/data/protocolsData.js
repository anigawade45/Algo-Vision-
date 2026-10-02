import {
  httpPython, httpCpp,
  dnsPython, dnsCpp,
  dhcpPython, dhcpCpp,
  arpPython, arpCpp,
  icmpPython, icmpCpp
} from './protocolsCodeSnippets';

/**
 * Network Protocols Knowledge Base, Metadata, and Multi-Language Simulation Code (Python 3, C++, Java)
 * Covers: HTTP, HTTPS, DNS, DHCP, ARP, FTP, SMTP, ICMP
 */

export const PROTOCOLS_DATA = {
  http: {
    id: 'http',
    name: 'HTTP',
    fullName: 'Hypertext Transfer Protocol',
    layer: 'Layer 7 — Application Layer',
    transportProtocol: 'TCP (Port 80)',
    category: 'Application',
    accentColor: 'indigo',
    hasJavaCode: true,
    whatIsIt:
      'HTTP (Hypertext Transfer Protocol) is an application-layer protocol for transmitting hypermedia documents, such as HTML, images, and JSON APIs. It is the foundational protocol of the World Wide Web, designed for communication between web browsers (clients) and web servers.',
    purpose:
      'To provide a standardized, stateless, request-response communication model allowing clients to fetch resources, submit form data, and interact with web services over reliable TCP connections.',
    whereItWorks:
      'Operates at Layer 7 (Application Layer) of the OSI model. It uses TCP at Layer 4 (typically port 80 for unencrypted traffic) to ensure ordered and error-checked delivery.',
    howItWorks: [
      'Client initiates a TCP connection to the server on port 80 (or port 8080).',
      'Client sends an HTTP Request containing a Method (GET, POST, PUT, DELETE), URI path, headers (Host, User-Agent), and optional body.',
      'Server parses the request, executes backend business logic or retrieves files from storage.',
      'Server sends an HTTP Response with a 3-digit Status Code (e.g., 200 OK, 404 Not Found), response headers (Content-Type, Content-Length), and payload body.',
      'Browser parses the response body, renders the HTML/CSS or processes the JSON data.'
    ],
    keyTerms: [
      { term: 'GET Method', definition: 'Requests a representation of the specified resource. Should only retrieve data without side effects.' },
      { term: 'POST Method', definition: 'Submits an entity to the specified resource, often causing a change in state or side effects on the server.' },
      { term: 'Status Code', definition: 'A 3-digit integer from the server indicating the result (1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error).' },
      { term: 'Stateless Protocol', definition: 'Each request is executed independently; the server does not retain session state between requests without cookies or tokens.' }
    ],
    keyTakeaways: [
      'HTTP is a stateless request-response protocol running over TCP (port 80).',
      'CRUD operations map neatly to HTTP methods: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).',
      'HTTP transmits all headers and data in plain text, making it vulnerable to eavesdropping without TLS encryption.'
    ],
    codeExplanation:
      'This simulation demonstrates an HTTP request-response engine. It defines HttpRequest and HttpResponse data objects, parses request methods, routes paths, and returns appropriate status codes (200 OK, 201 Created, 404 Not Found).',
    pythonCode: httpPython,
    cppCode: httpCpp,
    javaCode: `import java.util.HashMap;
import java.util.Map;

// Simulated HTTP Request Object
class HttpRequest {
    private String method;
    private String path;
    private Map<String, String> headers = new HashMap<>();
    private String body;

    public HttpRequest(String method, String path, String body) {
        this.method = method.toUpperCase();
        this.path = path;
        this.body = body;
        this.headers.put("Host", "api.algovision.dev");
        this.headers.put("User-Agent", "AlgoVision-Browser/1.0");
        this.headers.put("Accept", "application/json, text/html");
    }

    public String getMethod() { return method; }
    public String getPath() { return path; }
    public String getBody() { return body; }

    @Override
    public String toString() {
        return method + " " + path + " HTTP/1.1\\n" +
               "Host: " + headers.get("Host") + "\\n" +
               "User-Agent: " + headers.get("User-Agent") + "\\n" +
               (body != null && !body.isEmpty() ? "\\nPayload: " + body : "");
    }
}

// Simulated HTTP Response Object
class HttpResponse {
    private int statusCode;
    private String statusMessage;
    private Map<String, String> headers = new HashMap<>();
    private String body;

    public HttpResponse(int statusCode, String statusMessage, String contentType, String body) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.body = body;
        this.headers.put("Content-Type", contentType);
        this.headers.put("Content-Length", String.valueOf(body.length()));
        this.headers.put("Server", "AlgoVision-WebServer/2.0");
    }

    @Override
    public String toString() {
        return "HTTP/1.1 " + statusCode + " " + statusMessage + "\\n" +
               "Server: " + headers.get("Server") + "\\n" +
               "Content-Type: " + headers.get("Content-Type") + "\\n" +
               "Content-Length: " + headers.get("Content-Length") + " bytes\\n\\n" +
               body;
    }
}

// Simulated HTTP Web Server
class SimpleHttpServer {
    private Map<String, String> database = new HashMap<>();

    public SimpleHttpServer() {
        database.put("/index.html", "<html><body><h1>Welcome to AlgoVision!</h1></body></html>");
        database.put("/api/users", "{\\"users\\": [\\"Alice\\", \\"Bob\\", \\"Charlie\\"]}");
    }

    public HttpResponse handleRequest(HttpRequest request) {
        System.out.println("--> Server received: " + request.getMethod() + " " + request.getPath());

        switch (request.getMethod()) {
            case "GET":
                if (database.containsKey(request.getPath())) {
                    String contentType = request.getPath().endsWith(".html") ? "text/html" : "application/json";
                    return new HttpResponse(200, "OK", contentType, database.get(request.getPath()));
                } else {
                    return new HttpResponse(404, "Not Found", "text/plain", "Error 404: Resource not found");
                }

            case "POST":
                database.put(request.getPath(), request.getBody());
                return new HttpResponse(201, "Created", "application/json", "{\\"status\\": \\"success\\", \\"message\\": \\"Resource created\\"}");

            case "DELETE":
                if (database.containsKey(request.getPath())) {
                    database.remove(request.getPath());
                    return new HttpResponse(200, "OK", "application/json", "{\\"status\\": \\"deleted\\"}");
                }
                return new HttpResponse(404, "Not Found", "text/plain", "Resource not found to delete");

            default:
                return new HttpResponse(405, "Method Not Allowed", "text/plain", "Method not supported");
        }
    }
}

public class HttpDemo {
    public static void main(String[] args) {
        SimpleHttpServer server = new SimpleHttpServer();

        System.out.println("========== CLIENT SENDS GET REQUEST ==========");
        HttpRequest getReq = new HttpRequest("GET", "/index.html", null);
        System.out.println(getReq);

        HttpResponse getRes = server.handleRequest(getReq);
        System.out.println("\\n<-- CLIENT RECEIVED RESPONSE:");
        System.out.println(getRes);

        System.out.println("\\n========== CLIENT SENDS POST REQUEST ==========");
        HttpRequest postReq = new HttpRequest("POST", "/api/comments", "{\\"author\\": \\"Ritesh\\", \\"text\\": \\"Great simulation!\\"}");
        System.out.println(postReq);

        HttpResponse postRes = server.handleRequest(postReq);
        System.out.println("\\n<-- CLIENT RECEIVED RESPONSE:");
        System.out.println(postRes);
    }
}`
  },

  https: {
    id: 'https',
    name: 'HTTPS',
    fullName: 'Hypertext Transfer Protocol Secure',
    layer: 'Layer 7 — Application Layer (via TLS/SSL)',
    transportProtocol: 'TCP (Port 443)',
    category: 'Application',
    accentColor: 'emerald',
    hasJavaCode: false,
    whatIsIt:
      'HTTPS is the secure version of HTTP. It encrypts all communications between client and server using TLS (Transport Layer Security) or SSL (Secure Sockets Layer), preventing eavesdropping, tampering, and man-in-the-middle (MITM) attacks.',
    purpose:
      'To provide three critical security pillars: Confidentiality (encryption so only sender and receiver can read data), Integrity (ensuring packets are not modified in transit), and Authentication (verifying server identity via digital certificates).',
    whereItWorks:
      'Operates at the Application Layer wrapped inside a TLS cryptographic tunnel running over TCP Port 443.',
    howItWorks: [
      'TCP 3-Way Handshake establishes a raw transport connection on port 443.',
      'TLS Handshake Begins: Client sends "ClientHello" with supported cipher suites and a random nonce.',
      'Server responds with "ServerHello", selected cipher, and its Digital X.509 Certificate containing its Public Key.',
      'Client verifies certificate authenticity against trusted Certificate Authorities (CAs).',
      'Client generates a Pre-Master Secret, encrypts it with Server’s Public Key, and sends it to the server.',
      'Both parties independently compute identical Symmetric Session Keys (AES-256) for ultra-fast bulk data encryption.',
      'All subsequent HTTP requests and responses are encrypted with the symmetric session key.'
    ],
    keyTerms: [
      { term: 'TLS (Transport Layer Security)', definition: 'The modern cryptographic protocol successor to SSL that secures internet communications.' },
      { term: 'Asymmetric Encryption', definition: 'Uses a Public Key for encryption and a Private Key for decryption; used during the initial TLS handshake.' },
      { term: 'Symmetric Encryption', definition: 'Uses a single shared session key for both encryption and decryption; used for actual data transfer due to speed.' },
      { term: 'Digital Certificate (X.509)', definition: 'An electronic credential issued by a trusted Certificate Authority (CA) binding a public key to an organization domain.' }
    ],
    keyTakeaways: [
      'HTTPS = HTTP + TLS Encryption on TCP Port 443.',
      'Uses asymmetric encryption (Public/Private keys) to securely agree on a symmetric session key.',
      'Protects against packet sniffing, credential theft, and Man-in-the-Middle (MITM) attacks.',
      'Eavesdroppers on the network wire only observe randomized ciphertext without the private session key.'
    ]
  },

  dns: {
    id: 'dns',
    name: 'DNS',
    fullName: 'Domain Name System',
    layer: 'Layer 7 — Application Layer',
    transportProtocol: 'UDP / TCP (Port 53)',
    category: 'Application',
    accentColor: 'teal',
    hasJavaCode: true,
    whatIsIt:
      'DNS (Domain Name System) is the hierarchical distributed phonebook of the Internet. It translates human-friendly domain names (like www.google.com) into machine-routable numerical IP addresses (like 142.250.190.46).',
    purpose:
      'To eliminate the need for humans to memorize complex IPv4/IPv6 addresses by providing fast, distributed, and cached name-to-IP resolution.',
    whereItWorks:
      'Operates at the Application Layer (Layer 7). Queries typically use UDP port 53 for speed and low overhead (under 512 bytes), while zone transfers and large responses use TCP port 53.',
    howItWorks: [
      'User enters a domain (e.g. www.example.com) in browser. Browser checks local cache and OS cache.',
      'If not cached, query is sent to the Recursive DNS Resolver (usually provided by ISP or 8.8.8.8).',
      'Resolver queries a Root DNS Server (.) to locate the Top-Level Domain (TLD) server.',
      'Root server refers resolver to the .com TLD DNS Server.',
      'Resolver queries the .com TLD Server, which refers resolver to the Authoritative DNS Server for example.com.',
      'Resolver queries the Authoritative Server, which returns the final IP address (A record: 93.184.216.34).',
      'Resolver caches the record according to its TTL (Time to Live) and returns the IP to the browser.',
      'Browser uses IP address to establish TCP connection with the web server.'
    ],
    keyTerms: [
      { term: 'Root DNS Server', definition: 'Top of the DNS hierarchy (13 root server IP clusters worldwide, named a.root-servers.net to m.root-servers.net).' },
      { term: 'TLD Server', definition: 'Manages top-level domain extensions such as .com, .org, .net, .edu, or country codes like .in, .uk.' },
      { term: 'Authoritative DNS Server', definition: 'The server holding the actual master DNS records (A, AAAA, CNAME, MX) for a specific registered domain.' },
      { term: 'A Record & TTL', definition: 'A Record maps hostname to IPv4; TTL (Time To Live) specifies how many seconds resolvers may cache the record.' }
    ],
    keyTakeaways: [
      'DNS resolves human names (e.g. example.com) to IP addresses (e.g. 93.184.216.34).',
      'Resolution follows a top-down hierarchy: Local Cache -> Resolver -> Root Server -> TLD Server -> Authoritative Server.',
      'Uses lightweight UDP Port 53 for fast query/response cycles.',
      'Caching at every level dramatically speeds up lookups and prevents overload on root servers.'
    ],
    codeExplanation:
      'This simulation implements a hierarchical DNS lookup system with a local cache, root server, TLD server (.com, .org), and authoritative servers. It demonstrates cache misses vs instant cache hits.',
    pythonCode: dnsPython,
    cppCode: dnsCpp,
    javaCode: `import java.util.HashMap;
import java.util.Map;

// Simulated DNS Record
class DnsRecord {
    String domain;
    String ipAddress;
    String type; // "A", "CNAME"
    int ttl;     // Time To Live in seconds

    public DnsRecord(String domain, String ipAddress, String type, int ttl) {
        this.domain = domain;
        this.ipAddress = ipAddress;
        this.type = type;
        this.ttl = ttl;
    }
}

// Simulated Hierarchical DNS System
class DnsHierarchy {
    // Authoritative Server Zones
    private Map<String, DnsRecord> authoritativeZone = new HashMap<>();
    // Local Resolver Cache
    private Map<String, DnsRecord> resolverCache = new HashMap<>();

    public DnsHierarchy() {
        // Pre-populate Authoritative DNS Records
        authoritativeZone.put("www.example.com", new DnsRecord("www.example.com", "93.184.216.34", "A", 300));
        authoritativeZone.put("api.github.com", new DnsRecord("api.github.com", "140.82.121.6", "A", 300));
        authoritativeZone.put("algovision.dev", new DnsRecord("algovision.dev", "76.76.21.21", "A", 300));
    }

    public String resolveDomain(String domain) {
        System.out.println("\\n[DNS Client] Initiating lookup for: " + domain);

        // Step 1: Check Local Resolver Cache
        if (resolverCache.containsKey(domain)) {
            System.out.println("  [CACHE HIT] Found in Resolver Cache -> " + resolverCache.get(domain).ipAddress);
            return resolverCache.get(domain).ipAddress;
        }

        System.out.println("  [CACHE MISS] Traversing DNS Hierarchy...");

        // Step 2: Query Root DNS Server (.)
        System.out.println("  1. Querying Root Server (.) -> Referred to .com / .dev TLD Server");

        // Step 3: Query TLD DNS Server
        String tld = domain.substring(domain.lastIndexOf("."));
        System.out.println("  2. Querying " + tld + " TLD Server -> Referred to Authoritative Name Server");

        // Step 4: Query Authoritative DNS Server
        System.out.println("  3. Querying Authoritative Server for " + domain);
        if (authoritativeZone.containsKey(domain)) {
            DnsRecord record = authoritativeZone.get(domain);
            System.out.println("  4. Authoritative Server returned A Record: " + record.ipAddress + " (TTL: " + record.ttl + "s)");

            // Save to Resolver Cache
            resolverCache.put(domain, record);
            System.out.println("  5. Cached locally for future fast lookups.");
            return record.ipAddress;
        } else {
            System.out.println("  [ERROR] NXDOMAIN: Domain not found in Authoritative Server.");
            return null;
        }
    }
}

public class DnsDemo {
    public static void main(String[] args) {
        DnsHierarchy dns = new DnsHierarchy();

        // 1st Query: Cold Cache (Full Hierarchy Resolution)
        String ip1 = dns.resolveDomain("www.example.com");
        System.out.println("Result: www.example.com -> " + ip1);

        // 2nd Query: Warm Cache (Instant Cache Hit)
        String ip2 = dns.resolveDomain("www.example.com");
        System.out.println("Result: www.example.com -> " + ip2);

        // 3rd Query: Different domain
        String ip3 = dns.resolveDomain("api.github.com");
        System.out.println("Result: api.github.com -> " + ip3);
    }
}`
  },

  dhcp: {
    id: 'dhcp',
    name: 'DHCP',
    fullName: 'Dynamic Host Configuration Protocol',
    layer: 'Layer 7 — Application Layer (UDP)',
    transportProtocol: 'UDP (Port 67 Server / Port 68 Client)',
    category: 'Application',
    accentColor: 'cyan',
    hasJavaCode: true,
    whatIsIt:
      'DHCP (Dynamic Host Configuration Protocol) is a network management protocol that automatically assigns IP addresses, default gateways, subnet masks, and DNS servers to client devices joining a local network.',
    purpose:
      'To eliminate manual, error-prone static IP configuration and prevent IP address conflicts across dynamic corporate, home, and campus LANs.',
    whereItWorks:
      'Operates at Layer 7 using UDP broadcast messaging (Client uses port 68, Server listens on port 67).',
    howItWorks: [
      'D - DISCOVER: Newly connected client broadcasts a DHCPDISCOVER packet (0.0.0.0:68 -> 255.255.255.255:67) with its MAC address to find available DHCP servers.',
      'O - OFFER: DHCP Server reserves an available IP from its pool and broadcasts a DHCPOFFER containing IP address, Subnet Mask, Default Gateway, and Lease Time.',
      'R - REQUEST: Client broadcasts a DHCPREQUEST announcing which offered IP address it accepts (notifying all other DHCP servers to release their reserved offers).',
      'A - ACKNOWLEDGE: The selected DHCP Server sends a DHCPACK confirming the lease parameters. The client binds the IP and begins communicating on the LAN.'
    ],
    keyTerms: [
      { term: 'DORA Process', definition: 'The 4-step handshake: Discover, Offer, Request, and Acknowledge.' },
      { term: 'IP Pool / Scope', definition: 'The range of valid, assignable IP addresses configured on the DHCP server (e.g. 192.168.1.10 - 192.168.1.250).' },
      { term: 'IP Lease Time', definition: 'The duration for which a client is permitted to use the assigned IP address before requesting a renewal.' },
      { term: 'Default Gateway', definition: 'The router IP assigned to the client so it can route packets to external networks (the Internet).' }
    ],
    keyTakeaways: [
      'DHCP automates network setup using the 4-step DORA handshake.',
      'Operates via UDP Broadcast (Port 67 for Server, Port 68 for Client) because client initially lacks an IP.',
      'Maintains an active pool of dynamic IP leases that expire and recycle when devices disconnect.'
    ],
    codeExplanation:
      'This code simulates a stateful DHCP server with an IP pool (192.168.1.10 - 192.168.1.13). It executes the complete 4-step DORA process, maintaining client MAC-to-IP lease records.',
    pythonCode: dhcpPython,
    cppCode: dhcpCpp,
    javaCode: `import java.util.*;

// Simulated DHCP Lease Record
class DhcpLease {
    String macAddress;
    String assignedIp;
    String subnetMask;
    String defaultGateway;
    long leaseDurationSeconds;

    public DhcpLease(String mac, String ip, String mask, String gw, long duration) {
        this.macAddress = mac;
        this.assignedIp = ip;
        this.subnetMask = mask;
        this.defaultGateway = gw;
        this.leaseDurationSeconds = duration;
    }
}

// Simulated DHCP Server
class DhcpServer {
    private List<String> availablePool = new ArrayList<>();
    private Map<String, DhcpLease> activeLeases = new HashMap<>();
    private String subnetMask = "255.255.255.0";
    private String defaultGateway = "192.168.1.1";

    public DhcpServer() {
        // Initialize pool of available IPs
        availablePool.add("192.168.1.10");
        availablePool.add("192.168.1.11");
        availablePool.add("192.168.1.12");
        availablePool.add("192.168.1.13");
    }

    // Step 1 & 2: Process DISCOVER and return OFFER
    public String handleDiscover(String clientMac) {
        System.out.println("1. [SERVER] Received DHCPDISCOVER broadcast from MAC: " + clientMac);
        if (availablePool.isEmpty()) {
            System.out.println("   [ERROR] IP Pool exhausted!");
            return null;
        }
        String offeredIp = availablePool.get(0);
        System.out.println("2. [SERVER] Sending DHCPOFFER proposing IP: " + offeredIp);
        return offeredIp;
    }

    // Step 3 & 4: Process REQUEST and return DHCPACK
    public DhcpLease handleRequest(String clientMac, String requestedIp) {
        System.out.println("3. [SERVER] Received DHCPREQUEST from " + clientMac + " accepting IP: " + requestedIp);
        if (availablePool.contains(requestedIp)) {
            availablePool.remove(requestedIp);
            DhcpLease lease = new DhcpLease(clientMac, requestedIp, subnetMask, defaultGateway, 86400);
            activeLeases.put(clientMac, lease);
            System.out.println("4. [SERVER] Sending DHCPACK committing lease for " + requestedIp + " (Lease: 24h)");
            return lease;
        }
        return null;
    }

    public void displayStatus() {
        System.out.println("\\n--- DHCP SERVER STATUS ---");
        System.out.println("Available Pool: " + availablePool);
        System.out.println("Active Leases Count: " + activeLeases.size());
    }
}

public class DhcpDemo {
    public static void main(String[] args) {
        DhcpServer server = new DhcpServer();
        server.displayStatus();

        System.out.println("\\n========== CLIENT 1 CONNECTS (DORA FLOW) ==========");
        String client1Mac = "00:1A:2B:3C:4D:5E";
        
        // 1. Discover -> 2. Offer
        String offeredIp1 = server.handleDiscover(client1Mac);
        
        // 3. Request -> 4. Acknowledge
        DhcpLease lease1 = server.handleRequest(client1Mac, offeredIp1);
        System.out.println("--> Client 1 configured with IP: " + lease1.assignedIp + ", Mask: " + lease1.subnetMask);

        System.out.println("\\n========== CLIENT 2 CONNECTS ==========");
        String client2Mac = "A4:C3:F0:88:12:99";
        String offeredIp2 = server.handleDiscover(client2Mac);
        DhcpLease lease2 = server.handleRequest(client2Mac, offeredIp2);
        System.out.println("--> Client 2 configured with IP: " + lease2.assignedIp);

        server.displayStatus();
    }
}`
  },

  arp: {
    id: 'arp',
    name: 'ARP',
    fullName: 'Address Resolution Protocol',
    layer: 'Layer 2 / Layer 3 (Data Link to Network Bridge)',
    transportProtocol: 'Raw Ethernet (EtherType 0x0806)',
    category: 'Network',
    accentColor: 'purple',
    hasJavaCode: true,
    whatIsIt:
      'ARP (Address Resolution Protocol) maps a known logical IP address (Layer 3) to a physical hardware MAC address (Layer 2) on a local area network (LAN).',
    purpose:
      'Devices communicate across Ethernet/Wi-Fi using 48-bit MAC addresses. When Host A wants to send an IP packet to Host B on the same subnet, it must know Host B’s MAC address to encapsulate the Ethernet frame.',
    whereItWorks:
      'Operates between Layer 2 (Data Link) and Layer 3 (Network). Packets are encapsulated directly in Ethernet frames with EtherType 0x0806.',
    howItWorks: [
      'Host A checks its local ARP Cache table for Host B’s IP (e.g. 192.168.1.5).',
      'If entry exists (ARP Cache Hit), Host A immediately encapsulates the frame with Host B’s MAC and sends it unicast.',
      'If entry is missing (ARP Cache Miss), Host A sends an ARP Request Broadcast to FF:FF:FF:FF:FF:FF: "Who has IP 192.168.1.5? Tell 192.168.1.2".',
      'All switches flood the broadcast to all connected ports on the LAN.',
      'Every device receives the request, but only the device owning IP 192.168.1.5 processes it and sends an ARP Reply Unicast back to Host A: "192.168.1.5 is at AA:BB:CC:DD:EE:FF".',
      'Host A stores the mapping in its ARP cache and transmits the queued IP packet.'
    ],
    keyTerms: [
      { term: 'ARP Request (Broadcast)', definition: 'Ethernet destination set to FF:FF:FF:FF:FF:FF asking the LAN who holds a given IP.' },
      { term: 'ARP Reply (Unicast)', definition: 'Target device replies directly to requester containing its hardware MAC address.' },
      { term: 'ARP Cache / Table', definition: 'RAM table mapping IP -> MAC addresses with dynamic expiration timers (typically 2-20 minutes).' },
      { term: 'Gratuitous ARP', definition: 'An ARP announcement sent by a node to announce or update its IP/MAC mapping or detect duplicate IPs.' }
    ],
    keyTakeaways: [
      'ARP bridges the gap between Layer 3 logical IP addressing and Layer 2 physical MAC framing.',
      'ARP Requests are LAN Broadcasts (FF:FF:FF:FF:FF:FF); ARP Replies are Unicast directly to requester.',
      'Caching IP-to-MAC mappings prevents network flooding on subsequent packet transmissions.'
    ],
    codeExplanation:
      'This code simulates a host ARP cache. It handles cache misses by broadcasting an ARP request, receiving an ARP reply, populating the cache, and instantly fulfilling subsequent lookups via cache hit.',
    pythonCode: arpPython,
    cppCode: arpCpp,
    javaCode: `import java.util.HashMap;
import java.util.Map;

// Simulated ARP Cache Entry
class ArpEntry {
    String ipAddress;
    String macAddress;
    String type; // "Dynamic", "Static"

    public ArpEntry(String ip, String mac, String type) {
        this.ipAddress = ip;
        this.macAddress = mac;
        this.type = type;
    }
}

// Simulated Host with ARP Cache Engine
class HostNetworkStack {
    private String hostName;
    private String hostIp;
    private String hostMac;
    private Map<String, ArpEntry> arpCache = new HashMap<>();

    // Simulated LAN Environment (Other hosts on subnet)
    private static final Map<String, String> LAN_NETWORK = new HashMap<>();
    static {
        LAN_NETWORK.put("192.168.1.5", "AA:BB:CC:DD:EE:05");
        LAN_NETWORK.put("192.168.1.10", "11:22:33:44:55:66");
        LAN_NETWORK.put("192.168.1.1", "00:50:56:FE:ED:01"); // Gateway
    }

    public HostNetworkStack(String hostName, String ip, String mac) {
        this.hostName = hostName;
        this.hostIp = ip;
        this.hostMac = mac;
    }

    public String getMacForIp(String targetIp) {
        System.out.println("\\n[" + hostName + "] Resolving MAC address for IP: " + targetIp);

        // Step 1: Check ARP Cache
        if (arpCache.containsKey(targetIp)) {
            ArpEntry entry = arpCache.get(targetIp);
            System.out.println("  --> [ARP CACHE HIT] " + targetIp + " = " + entry.macAddress + " (" + entry.type + ")");
            return entry.macAddress;
        }

        // Step 2: Cache Miss -> Broadcast ARP Request
        System.out.println("  --> [ARP CACHE MISS] Broadcasting ARP Request to FF:FF:FF:FF:FF:FF");
        System.out.println("      \\"Who has " + targetIp + "? Tell " + hostIp + " (" + hostMac + ")\\"");

        // Step 3: LAN resolution
        if (LAN_NETWORK.containsKey(targetIp)) {
            String targetMac = LAN_NETWORK.get(targetIp);
            System.out.println("  <-- [ARP REPLY UNICAST] " + targetIp + " replies: \\"I am at " + targetMac + "\\"");

            // Step 4: Update ARP Cache
            arpCache.put(targetIp, new ArpEntry(targetIp, targetMac, "Dynamic"));
            System.out.println("  --> [CACHE UPDATED] Added " + targetIp + " -> " + targetMac + " to ARP table.");
            return targetMac;
        } else {
            System.out.println("  <-- [ARP TIMEOUT] Destination Host Unreachable (No reply).");
            return null;
        }
    }

    public void printArpTable() {
        System.out.println("\\n--- " + hostName + " ARP TABLE ---");
        System.out.println("Internet Address      Physical Address      Type");
        for (ArpEntry e : arpCache.values()) {
            System.out.printf("%-20s  %-20s  %-10s\\n", e.ipAddress, e.macAddress, e.type);
        }
    }
}

public class ArpDemo {
    public static void main(String[] args) {
        HostNetworkStack pc1 = new HostNetworkStack("PC1", "192.168.1.2", "DE:AD:BE:EF:00:01");

        // First packet to 192.168.1.5 (Cache Miss -> ARP Broadcast -> Reply -> Cache Update)
        String mac1 = pc1.getMacForIp("192.168.1.5");
        System.out.println("Packet ready to send to MAC: " + mac1);

        // Second packet to 192.168.1.5 (Instant Cache Hit -> No Broadcast needed)
        String mac2 = pc1.getMacForIp("192.168.1.5");
        System.out.println("Packet ready to send to MAC: " + mac2);

        // Third packet to Gateway 192.168.1.1
        pc1.getMacForIp("192.168.1.1");

        pc1.printArpTable();
    }
}`
  },

  ftp: {
    id: 'ftp',
    name: 'FTP',
    fullName: 'File Transfer Protocol',
    layer: 'Layer 7 — Application Layer',
    transportProtocol: 'TCP (Port 21 Control / Port 20 Data)',
    category: 'Application',
    accentColor: 'amber',
    hasJavaCode: false,
    whatIsIt:
      'FTP (File Transfer Protocol) is a standard client-server network protocol used for transferring computer files between a client and server over a TCP/IP network.',
    purpose:
      'To provide reliable, high-throughput bulk file upload and download capabilities with directory listing, user authentication, and file management commands.',
    whereItWorks:
      'Operates at the Application Layer using a distinct dual-channel architecture on TCP Ports 20 and 21.',
    howItWorks: [
      'Control Connection (Port 21): Client initiates a persistent TCP connection to server port 21 for issuing commands (USER, PASS, LIST, RETR, STOR) and receiving status codes (220, 230, 226).',
      'Data Connection (Port 20 in Active Mode / Negotiated Port in Passive Mode): A separate temporary TCP connection is spawned specifically for streaming the actual file bytes or directory lists.',
      'Active Mode: Client opens port N and asks Server to connect from port 20 to client port N.',
      'Passive Mode (PASV): Server opens an unassigned high port (e.g. 50000) and client initiates the data connection to circumvent client-side firewalls.',
      'Data connection closes automatically once the file transfer is complete, while the control connection remains open for subsequent commands.'
    ],
    keyTerms: [
      { term: 'Control Connection (Port 21)', definition: 'Persistent TCP link for sending user commands and receiving server status responses.' },
      { term: 'Data Connection (Port 20)', definition: 'Ephemeral TCP link created dynamically to stream actual file payload or directory listings.' },
      { term: 'Active Mode (PORT)', definition: 'Server connects back to client data port; frequently blocked by client firewalls/NATs.' },
      { term: 'Passive Mode (PASV)', definition: 'Client connects to a server-specified ephemeral port; firewall-friendly and standard today.' }
    ],
    keyTakeaways: [
      'FTP uses a unique dual-channel architecture: Port 21 for Control/Commands and Port 20 for Data transfer.',
      'Passive mode (PASV) is the modern standard to allow data transfers through client-side NAT routers.',
      'Standard FTP transmits credentials and files in plaintext; modern systems use SFTP (SSH File Transfer) or FTPS (FTP over TLS).'
    ]
  },

  smtp: {
    id: 'smtp',
    name: 'SMTP',
    fullName: 'Simple Mail Transfer Protocol',
    layer: 'Layer 7 — Application Layer',
    transportProtocol: 'TCP (Port 25 Relay / Port 587 Submission)',
    category: 'Application',
    accentColor: 'rose',
    hasJavaCode: false,
    whatIsIt:
      'SMTP (Simple Mail Transfer Protocol) is the universal application-layer protocol for sending and relaying electronic mail (email) messages between mail servers across the Internet.',
    purpose:
      'To push outgoing email messages from client to Mail Submission Agent (MSA) and relay messages between intermediate Mail Transfer Agents (MTAs) until arriving at the destination mailbox server.',
    whereItWorks:
      'Operates at the Application Layer over reliable TCP (Port 587 with STARTTLS for client-to-server submission, Port 25 for server-to-server MTA relaying).',
    howItWorks: [
      'Client (Sender Alice) composes email and connects to her outbound SMTP server on port 587.',
      'Handshake & Authentication: Client sends "EHLO", authenticates credentials, and issues "MAIL FROM: <alice@example.com>".',
      'Recipient Declaration: Client issues "RCPT TO: <bob@destination.com>".',
      'Body Transmission: Client issues "DATA", sends headers (Subject, Date) and message body, terminating with a single period on a line (".")',
      'MTA Relay: Alice’s SMTP server queries DNS for destination.com’s MX (Mail Exchange) record to locate Bob’s SMTP server.',
      'Alice’s SMTP server establishes a TCP connection on port 25 to Bob’s SMTP server and relays the email message.',
      'Bob retrieves the stored email from his mailbox using a pull protocol like IMAP (port 993) or POP3 (port 995).'
    ],
    keyTerms: [
      { term: 'MTA (Mail Transfer Agent)', definition: 'Server software (e.g. Postfix, Sendmail, Exchange) that routes and relays email across servers.' },
      { term: 'MX Record (DNS)', definition: 'DNS record specifying which mail server handles incoming email for a domain name.' },
      { term: 'Push Protocol vs Pull Protocol', definition: 'SMTP is a push protocol (sends mail); IMAP/POP3 are pull protocols (retrieves mail to user clients).' },
      { term: 'STARTTLS', definition: 'Command to upgrade a plain text SMTP connection to an encrypted TLS session on port 587.' }
    ],
    keyTakeaways: [
      'SMTP is a connection-oriented, push-based protocol used strictly to send and relay email.',
      'Uses DNS MX records to discover the authoritative destination mail servers.',
      'Receiving mail at the user endpoint requires a separate pull protocol like IMAP or POP3.'
    ]
  },

  icmp: {
    id: 'icmp',
    name: 'ICMP',
    fullName: 'Internet Control Message Protocol',
    layer: 'Layer 3 — Network Layer',
    transportProtocol: 'Encapsulated directly in IP (Protocol Number 1)',
    category: 'Network',
    accentColor: 'blue',
    hasJavaCode: true,
    whatIsIt:
      'ICMP (Internet Control Message Protocol) is a network-layer protocol used by network devices (routers and hosts) to send diagnostic information, operational queries, and error messages (e.g., Host Unreachable, Time-To-Live Exceeded).',
    purpose:
      'To verify end-to-end network connectivity (via Ping), trace routing paths (via Traceroute), report routing loops or MTU fragmentation requirements, and detect network anomalies.',
    whereItWorks:
      'Operates at Layer 3 (Network Layer). Unlike transport protocols (TCP/UDP), ICMP packets are encapsulated directly into IP datagrams with IP Protocol number 1.',
    howItWorks: [
      'Source node initiates a connectivity test by creating an ICMP Echo Request message (Type 8, Code 0) containing a sequence number and timestamp.',
      'Message is wrapped in an IP packet with destination IP and transmitted across routers.',
      'Target destination receives the packet, constructs an ICMP Echo Reply message (Type 0, Code 0) with identical payload and sequence number, and sends it back.',
      'Source receives the reply, calculates Round-Trip Time (RTT = arrival time - send time), and checks for packet loss.',
      'If a router drops the packet because TTL reaches 0, it generates an ICMP Time Exceeded message (Type 11) back to the source (foundation of Traceroute).'
    ],
    keyTerms: [
      { term: 'Echo Request (Type 8)', definition: 'Message sent by a host to query another device for connectivity (Ping request).' },
      { term: 'Echo Reply (Type 0)', definition: 'Response sent back by target host confirming receipt and connectivity (Ping reply).' },
      { term: 'Time Exceeded (Type 11)', definition: 'Generated by routers when an IP packet’s TTL decrements to 0, preventing infinite loops.' },
      { term: 'Round-Trip Time (RTT)', definition: 'The total time elapsed in milliseconds for a data packet to travel to destination and back.' }
    ],
    keyTakeaways: [
      'ICMP operates at Layer 3 alongside IP (IP Protocol 1) for diagnostics and error reporting.',
      'Ping uses ICMP Echo Request (Type 8) and Echo Reply (Type 0) to measure latency and packet loss.',
      'Traceroute leverages ICMP Time Exceeded (Type 11) generated as TTL expires at successive hops.'
    ],
    codeExplanation:
      'This simulation models the ICMP Ping mechanism. It simulates sending a sequence of Echo Request packets to a target IP, introduces realistic simulated network latency, checks for packet drop probability, and computes min/avg/max RTT statistics.',
    pythonCode: icmpPython,
    cppCode: icmpCpp,
    javaCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Random;

// Simulated ICMP Ping Packet
class IcmpEchoPacket {
    int sequenceNum;
    String sourceIp;
    String destinationIp;
    int type; // 8 = Echo Request, 0 = Echo Reply
    long sentTimestampMs;

    public IcmpEchoPacket(int seq, String src, String dst, int type) {
        this.sequenceNum = seq;
        this.sourceIp = src;
        this.destinationIp = dst;
        this.type = type;
        this.sentTimestampMs = System.currentTimeMillis();
    }
}

// Simulated Ping Diagnostic Tool
class IcmpPingSimulator {
    private Random random = new Random();

    public void ping(String targetIp, int packetCount) {
        System.out.println("PING " + targetIp + " with 32 bytes of diagnostic data:\\n");

        int received = 0;
        List<Long> latencies = new ArrayList<>();

        for (int seq = 1; seq <= packetCount; seq++) {
            // Construct ICMP Echo Request (Type 8)
            IcmpEchoPacket request = new IcmpEchoPacket(seq, "192.168.1.100", targetIp, 8);

            // Simulate Network Trip Latency (10ms - 45ms)
            long latencyMs = 12 + random.nextInt(28);

            // Simulate 10% packet drop probability
            boolean packetDropped = (random.nextInt(100) < 10);

            if (!packetDropped) {
                received++;
                latencies.add(latencyMs);
                System.out.printf("Reply from %s: bytes=32 seq=%d time=%dms TTL=118\\n", targetIp, seq, latencyMs);
            } else {
                System.out.printf("Request timed out (seq=%d).\\n", seq);
            }

            try {
                Thread.sleep(100); // Simulated delay between pings
            } catch (InterruptedException ignored) {}
        }

        // Compute Statistics
        int lost = packetCount - received;
        double lossRate = ((double) lost / packetCount) * 100.0;

        System.out.println("\\n--- " + targetIp + " Ping Statistics ---");
        System.out.printf("Packets: Sent = %d, Received = %d, Lost = %d (%.1f%% loss)\\n", packetCount, received, lost, lossRate);

        if (!latencies.isEmpty()) {
            long min = latencies.stream().min(Long::compareTo).orElse(0L);
            long max = latencies.stream().max(Long::compareTo).orElse(0L);
            double avg = latencies.stream().mapToLong(Long::longValue).average().orElse(0.0);
            System.out.printf("Approximate round trip times in milli-seconds:\\n");
            System.out.printf("    Minimum = %dms, Maximum = %dms, Average = %.1fms\\n", min, max, avg);
        }
    }
}

public class IcmpDemo {
    public static void main(String[] args) {
        IcmpPingSimulator pingTool = new IcmpPingSimulator();
        
        System.out.println("========== SIMULATING ICMP PING (8.8.8.8) ==========");
        pingTool.ping("8.8.8.8", 4);

        System.out.println("\\n========== SIMULATING LOCAL HOST PING (192.168.1.1) ==========");
        pingTool.ping("192.168.1.1", 4);
    }
}`
  }
};

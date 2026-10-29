/**
 * Comprehensive IPv4 Subnetting & CIDR Code Implementations
 * Languages Supported: Python 3, C++, Java (Strictly typed, production-ready & CCNA/GATE compliant)
 * Modules Included:
 * 1. IPv4 Subnet Mask & Host Range Calculator (Bitwise Network/Broadcast/Wildcard Math)
 * 2. Variable-Length Subnet Masking (VLSM) Partitioning Engine
 * 3. Subnet Membership & CIDR Longest Prefix Match (LPM) Route Engine
 */

export const SUBNETTING_CODE_DATA = {
  calculator: {
    id: 'calculator',
    title: 'IPv4 Subnet & CIDR Calculator (Bitwise Network/Broadcast Math)',
    standard: 'RFC 950 (Internet Subnetting Standard) & RFC 4632 (CIDR)',
    complexity: {
      time: 'O(1) Bitwise Arithmetic',
      space: 'O(1) Memory Allocation',
      formula: 'Usable Hosts = 2^(32 - CIDR) - 2'
    },
    summary:
      'Calculates 32-bit subnet masks, wildcard inversion masks, network IDs via bitwise AND, broadcast addresses via bitwise OR, usable host ranges, and binary octet alignments using fundamental Layer 3 IP math.',

    pythonCode: `import math

class Ipv4SubnetCalculator:
    """Calculates IPv4 subnet boundaries, host capacity, and bitwise binary octets."""

    @staticmethod
    def ip_to_int(ip_str: str) -> int:
        """Converts dotted-quad string (e.g. '192.168.10.50') to 32-bit unsigned integer."""
        octets = [int(octet) for octet in ip_str.strip().split('.')]
        if len(octets) != 4 or any(o < 0 or o > 255 for o in octets):
            raise ValueError(f"Invalid IPv4 address: {ip_str}")
        return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]

    @staticmethod
    def int_to_ip(num: int) -> str:
        """Converts 32-bit unsigned integer back to dotted-decimal IPv4 string."""
        return f"{(num >> 24) & 255}.{(num >> 16) & 255}.{(num >> 8) & 255}.{num & 255}"

    @staticmethod
    def to_binary_octets(num: int) -> str:
        """Formats 32-bit integer as four 8-bit dotted binary octets."""
        return ".".join(f"{(num >> (8 * i)) & 255:08b}" for i in range(3, -1, -1))

    @staticmethod
    def get_ip_class(first_octet: int) -> str:
        """Determines traditional classful address classification."""
        if 1 <= first_octet <= 126:
            return "Class A"
        elif first_octet == 127:
            return "Class A (Loopback)"
        elif 128 <= first_octet <= 191:
            return "Class B"
        elif 192 <= first_octet <= 223:
            return "Class C"
        elif 224 <= first_octet <= 239:
            return "Class D (Multicast)"
        else:
            return "Class E (Experimental/Reserved)"

    @staticmethod
    def is_private_ip(ip_num: int) -> str:
        """Identifies RFC 1918 private IPv4 scopes."""
        o1 = (ip_num >> 24) & 255
        o2 = (ip_num >> 16) & 255
        if o1 == 10:
            return "Private (RFC 1918 Class A 10.0.0.0/8)"
        elif o1 == 172 and 16 <= o2 <= 31:
            return "Private (RFC 1918 Class B 172.16.0.0/12)"
        elif o1 == 192 and o2 == 168:
            return "Private (RFC 1918 Class C 192.168.0.0/16)"
        elif o1 == 127:
            return "Loopback (127.0.0.0/8)"
        elif o1 == 169 and o2 == 254:
            return "Link-Local APIPA (169.254.0.0/16)"
        return "Public Globally Routable IP"

    def calculate(self, ip_str: str, cidr: int) -> dict:
        """Performs Layer 3 subnet calculations using bitwise manipulation."""
        if not (1 <= cidr <= 32):
            raise ValueError(f"CIDR prefix must be between 1 and 32. Received: {cidr}")

        ip_int = self.ip_to_int(ip_str)

        # Subnet mask: 32 - cidr zero bits on the right
        mask_int = (0xFFFFFFFF << (32 - cidr)) & 0xFFFFFFFF if cidr > 0 else 0
        wildcard_int = (~mask_int) & 0xFFFFFFFF

        # Network address = IP AND Mask
        network_int = ip_int & mask_int
        # Broadcast address = Network OR Wildcard
        broadcast_int = network_int | wildcard_int

        # Host capacity calculations
        total_hosts = 2 ** (32 - cidr)
        if cidr >= 31:
            # RFC 3021: /31 for point-to-point links (2 usable hosts, no broadcast)
            usable_hosts = 2 if cidr == 31 else 1
            first_usable = network_int
            last_usable = broadcast_int
        else:
            usable_hosts = max(0, total_hosts - 2)
            first_usable = network_int + 1
            last_usable = broadcast_int - 1

        first_octet = (ip_int >> 24) & 255

        return {
            "ip": ip_str,
            "cidr": cidr,
            "subnet_mask": self.int_to_ip(mask_int),
            "wildcard_mask": self.int_to_ip(wildcard_int),
            "network_address": self.int_to_ip(network_int),
            "broadcast_address": self.int_to_ip(broadcast_int),
            "first_usable": self.int_to_ip(first_usable),
            "last_usable": self.int_to_ip(last_usable),
            "total_hosts": total_hosts,
            "usable_hosts": usable_hosts,
            "ip_class": self.get_ip_class(first_octet),
            "ip_scope": self.is_private_ip(ip_int),
            "binary_ip": self.to_binary_octets(ip_int),
            "binary_mask": self.to_binary_octets(mask_int),
            "binary_network": self.to_binary_octets(network_int),
        }

    def print_report(self, ip_str: str, cidr: int):
        data = self.calculate(ip_str, cidr)
        print("=" * 60)
        print(f"      IPv4 SUBNET CALCULATION REPORT: {data['ip']}/{data['cidr']}")
        print("=" * 60)
        print(f"  Target IP Address  : {data['ip']}")
        print(f"  Subnet Mask        : {data['subnet_mask']} (/{data['cidr']})")
        print(f"  Wildcard Mask      : {data['wildcard_mask']}")
        print(f"  Network Address    : {data['network_address']}")
        print(f"  Broadcast Address  : {data['broadcast_address']}")
        print(f"  Usable Host Range  : {data['first_usable']} -> {data['last_usable']}")
        print(f"  Total Addresses    : {data['total_hosts']:,}")
        print(f"  Usable Hosts Count : {data['usable_hosts']:,} [2^{32-cidr} - 2]")
        print(f"  Address Category   : {data['ip_class']} | {data['ip_scope']}")
        print("-" * 60)
        print("  32-Bit Binary Bitwise Breakdown:")
        print(f"  IP Binary   : {data['binary_ip']}")
        print(f"  Mask Binary : {data['binary_mask']}")
        print(f"  Net Binary  : {data['binary_network']} (Bitwise AND)")
        print("=" * 60)


def main():
    calc = Ipv4SubnetCalculator()
    calc.print_report(ip_str="192.168.10.50", cidr=26)


if __name__ == "__main__":
    main()`,

    cppCode: `#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <cmath>

using namespace std;

struct SubnetDetails {
    string ip;
    int cidr;
    string subnetMask;
    string wildcardMask;
    string networkAddress;
    string broadcastAddress;
    string firstUsable;
    string lastUsable;
    uint32_t totalHosts;
    uint32_t usableHosts;
    string ipClass;
    string ipScope;
    string binaryIp;
    string binaryMask;
    string binaryNetwork;
};

class Ipv4SubnetCalculator {
public:
    static uint32_t ipToInt(const string& ipStr) {
        stringstream ss(ipStr);
        string segment;
        uint32_t result = 0;
        int shift = 24;

        while (getline(ss, segment, '.')) {
            uint32_t octet = static_cast<uint32_t>(stoi(segment));
            result |= (octet << shift);
            shift -= 8;
        }
        return result;
    }

    static string intToIp(uint32_t num) {
        return to_string((num >> 24) & 0xFF) + "." +
               to_string((num >> 16) & 0xFF) + "." +
               to_string((num >> 8) & 0xFF) + "." +
               to_string(num & 0xFF);
    }

    static string toBinaryOctets(uint32_t num) {
        string out = "";
        for (int i = 3; i >= 0; --i) {
            uint32_t octet = (num >> (8 * i)) & 0xFF;
            for (int b = 7; b >= 0; --b) {
                out += ((octet >> b) & 1) ? '1' : '0';
            }
            if (i > 0) out += ".";
        }
        return out;
    }

    static string getIpClass(uint32_t firstOctet) {
        if (firstOctet >= 1 && firstOctet <= 126) return "Class A";
        if (firstOctet == 127) return "Class A (Loopback)";
        if (firstOctet >= 128 && firstOctet <= 191) return "Class B";
        if (firstOctet >= 192 && firstOctet <= 223) return "Class C";
        if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)";
        return "Class E (Experimental)";
    }

    static string getIpScope(uint32_t ipNum) {
        uint32_t o1 = (ipNum >> 24) & 0xFF;
        uint32_t o2 = (ipNum >> 16) & 0xFF;

        if (o1 == 10) return "Private (RFC 1918 Class A)";
        if (o1 == 172 && (o2 >= 16 && o2 <= 31)) return "Private (RFC 1918 Class B)";
        if (o1 == 192 && o2 == 168) return "Private (RFC 1918 Class C)";
        if (o1 == 127) return "Loopback";
        if (o1 == 169 && o2 == 254) return "Link-Local APIPA";
        return "Public Globally Routable";
    }

    static SubnetDetails calculate(const string& ipStr, int cidr) {
        uint32_t ip = ipToInt(ipStr);
        uint32_t mask = (cidr == 0) ? 0 : (0xFFFFFFFF << (32 - cidr));
        uint32_t wildcard = ~mask;
        uint32_t network = ip & mask;
        uint32_t broadcast = network | wildcard;

        uint32_t total = (cidr == 32) ? 1 : static_cast<uint32_t>(pow(2, 32 - cidr));
        uint32_t usable = 0;
        uint32_t first = network;
        uint32_t last = broadcast;

        if (cidr == 31) {
            usable = 2; // RFC 3021
        } else if (cidr < 31) {
            usable = total - 2;
            first = network + 1;
            last = broadcast - 1;
        }

        uint32_t firstOctet = (ip >> 24) & 0xFF;

        SubnetDetails details;
        details.ip = ipStr;
        details.cidr = cidr;
        details.subnetMask = intToIp(mask);
        details.wildcardMask = intToIp(wildcard);
        details.networkAddress = intToIp(network);
        details.broadcastAddress = intToIp(broadcast);
        details.firstUsable = intToIp(first);
        details.lastUsable = intToIp(last);
        details.totalHosts = total;
        details.usableHosts = usable;
        details.ipClass = getIpClass(firstOctet);
        details.ipScope = getIpScope(ip);
        details.binaryIp = toBinaryOctets(ip);
        details.binaryMask = toBinaryOctets(mask);
        details.binaryNetwork = toBinaryOctets(network);

        return details;
    }
};

int main() {
    string targetIp = "192.168.10.50";
    int cidrPrefix = 26;

    SubnetDetails res = Ipv4SubnetCalculator::calculate(targetIp, cidrPrefix);

    cout << "============================================================\\n";
    cout << "      IPv4 SUBNET CALCULATION REPORT: " << res.ip << "/" << res.cidr << "\\n";
    cout << "============================================================\\n";
    cout << "  Target IP Address  : " << res.ip << "\\n";
    cout << "  Subnet Mask        : " << res.subnetMask << " (/" << res.cidr << ")\\n";
    cout << "  Wildcard Mask      : " << res.wildcardMask << "\\n";
    cout << "  Network Address    : " << res.networkAddress << "\\n";
    cout << "  Broadcast Address  : " << res.broadcastAddress << "\\n";
    cout << "  Usable Host Range  : " << res.firstUsable << " -> " << res.lastUsable << "\\n";
    cout << "  Total Addresses    : " << res.totalHosts << "\\n";
    cout << "  Usable Hosts Count : " << res.usableHosts << "\\n";
    cout << "  Address Category   : " << res.ipClass << " | " << res.ipScope << "\\n";
    cout << "------------------------------------------------------------\\n";
    cout << "  32-Bit Binary Bitwise Breakdown:\\n";
    cout << "  IP Binary   : " << res.binaryIp << "\\n";
    cout << "  Mask Binary : " << res.binaryMask << "\\n";
    cout << "  Net Binary  : " << res.binaryNetwork << " (Bitwise AND)\\n";
    cout << "============================================================\\n";

    return 0;
}`,

    javaCode: `import java.util.*;

public class Ipv4SubnetCalculator {

    public static class SubnetDetails {
        public String ip;
        public int cidr;
        public String subnetMask;
        public String wildcardMask;
        public String networkAddress;
        public String broadcastAddress;
        public String firstUsable;
        public String lastUsable;
        public long totalHosts;
        public long usableHosts;
        public String ipClass;
        public String ipScope;
        public String binaryIp;
        public String binaryMask;
        public String binaryNetwork;
    }

    public static long ipToLong(String ipStr) {
        String[] octets = ipStr.trim().split("\\\\.");
        if (octets.length != 4) throw new IllegalArgumentException("Invalid IPv4: " + ipStr);
        long result = 0;
        for (int i = 0; i < 4; i++) {
            long octet = Long.parseLong(octets[i]);
            result |= (octet << (24 - 8 * i));
        }
        return result & 0xFFFFFFFFL;
    }

    public static String longToIp(long num) {
        return String.format("%d.%d.%d.%d",
                (num >> 24) & 0xFF,
                (num >> 16) & 0xFF,
                (num >> 8) & 0xFF,
                num & 0xFF);
    }

    public static String toBinaryOctets(long num) {
        StringBuilder sb = new StringBuilder();
        for (int i = 3; i >= 0; i--) {
            long octet = (num >> (8 * i)) & 0xFF;
            String bin = String.format("%8s", Long.toBinaryString(octet)).replace(' ', '0');
            sb.append(bin);
            if (i > 0) sb.append(".");
        }
        return sb.toString();
    }

    public static String getIpClass(long firstOctet) {
        if (firstOctet >= 1 && firstOctet <= 126) return "Class A";
        if (firstOctet == 127) return "Class A (Loopback)";
        if (firstOctet >= 128 && firstOctet <= 191) return "Class B";
        if (firstOctet >= 192 && firstOctet <= 223) return "Class C";
        if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)";
        return "Class E (Experimental)";
    }

    public static String getIpScope(long ipNum) {
        long o1 = (ipNum >> 24) & 0xFF;
        long o2 = (ipNum >> 16) & 0xFF;

        if (o1 == 10) return "Private (RFC 1918 Class A)";
        if (o1 == 172 && (o2 >= 16 && o2 <= 31)) return "Private (RFC 1918 Class B)";
        if (o1 == 192 && o2 == 168) return "Private (RFC 1918 Class C)";
        if (o1 == 127) return "Loopback";
        if (o1 == 169 && o2 == 254) return "Link-Local APIPA";
        return "Public Globally Routable";
    }

    public static SubnetDetails calculate(String ipStr, int cidr) {
        long ip = ipToLong(ipStr);
        long mask = (cidr == 0) ? 0L : ((0xFFFFFFFFL << (32 - cidr)) & 0xFFFFFFFFL);
        long wildcard = (~mask) & 0xFFFFFFFFL;
        long network = ip & mask;
        long broadcast = network | wildcard;

        long total = (long) Math.pow(2, 32 - cidr);
        long usable;
        long first = network;
        long last = broadcast;

        if (cidr == 31) {
            usable = 2; // RFC 3021
        } else if (cidr < 31) {
            usable = Math.max(0, total - 2);
            first = network + 1;
            last = broadcast - 1;
        } else {
            usable = 1;
        }

        long firstOctet = (ip >> 24) & 0xFF;

        SubnetDetails details = new SubnetDetails();
        details.ip = ipStr;
        details.cidr = cidr;
        details.subnetMask = longToIp(mask);
        details.wildcardMask = longToIp(wildcard);
        details.networkAddress = longToIp(network);
        details.broadcastAddress = longToIp(broadcast);
        details.firstUsable = longToIp(first);
        details.lastUsable = longToIp(last);
        details.totalHosts = total;
        details.usableHosts = usable;
        details.ipClass = getIpClass(firstOctet);
        details.ipScope = getIpScope(ip);
        details.binaryIp = toBinaryOctets(ip);
        details.binaryMask = toBinaryOctets(mask);
        details.binaryNetwork = toBinaryOctets(network);

        return details;
    }

    public static void main(String[] args) {
        SubnetDetails res = calculate("192.168.10.50", 26);

        System.out.println("============================================================");
        System.out.println("      IPv4 SUBNET CALCULATION REPORT: " + res.ip + "/" + res.cidr);
        System.out.println("============================================================");
        System.out.println("  Target IP Address  : " + res.ip);
        System.out.println("  Subnet Mask        : " + res.subnetMask + " (/" + res.cidr + ")");
        System.out.println("  Wildcard Mask      : " + res.wildcardMask);
        System.out.println("  Network Address    : " + res.networkAddress);
        System.out.println("  Broadcast Address  : " + res.broadcastAddress);
        System.out.println("  Usable Host Range  : " + res.firstUsable + " -> " + res.lastUsable);
        System.out.println("  Total Addresses    : " + String.format("%,d", res.totalHosts));
        System.out.println("  Usable Hosts Count : " + String.format("%,d", res.usableHosts));
        System.out.println("  Address Category   : " + res.ipClass + " | " + res.ipScope);
        System.out.println("------------------------------------------------------------");
        System.out.println("  32-Bit Binary Bitwise Breakdown:");
        System.out.println("  IP Binary   : " + res.binaryIp);
        System.out.println("  Mask Binary : " + res.binaryMask);
        System.out.println("  Net Binary  : " + res.binaryNetwork + " (Bitwise AND)");
        System.out.println("============================================================");
    }
}`
  },

  vlsm: {
    id: 'vlsm',
    title: 'Variable-Length Subnet Masking (VLSM) Partitioning Engine',
    standard: 'RFC 1878 (Variable Length Subnet Masks) & RFC 4632',
    complexity: {
      time: 'O(N log N) Sorting Subnet Requests',
      space: 'O(N) Allocation Plan Storage',
      strategy: 'Greedy Allocation in Descending Host Order'
    },
    summary:
      'Partitions an IPv4 major network block into tailored subnets according to department host demands. Sorting requests in descending order eliminates address fragmentation and optimizes IPv4 utilization.',

    pythonCode: `import math

class VlsmSubnetAllocator:
    """Variable-Length Subnet Masking (VLSM) Engine.
    Allocates contiguous subnets sorted by host demand to eliminate fragmentation."""

    @staticmethod
    def ip_to_int(ip_str: str) -> int:
        octets = [int(x) for x in ip_str.strip().split('.')]
        return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]

    @staticmethod
    def int_to_ip(num: int) -> str:
        return f"{(num >> 24) & 255}.{(num >> 16) & 255}.{(num >> 8) & 255}.{num & 255}"

    def allocate(self, base_network: str, parent_cidr: int, requirements: list) -> list:
        """
        requirements: List of tuples (department_name, needed_usable_hosts)
        """
        # Step 1: Sort requirements in DESCENDING order of host capacity
        sorted_reqs = sorted(requirements, key=lambda x: x[1], reverse=True)

        current_base = self.ip_to_int(base_network)
        parent_capacity = 2 ** (32 - parent_cidr)
        network_limit = current_base + parent_capacity

        allocations = []

        print(f"\\n=== VLSM PARTITIONING: {base_network}/{parent_cidr} (Capacity: {parent_capacity} IPs) ===")

        for dept, needed_hosts in sorted_reqs:
            # Need +2 hosts for Network and Broadcast
            total_needed = needed_hosts + 2
            # Calculate host bits: h = ceil(log2(needed + 2))
            host_bits = math.ceil(math.log2(total_needed)) if total_needed > 1 else 1
            if host_bits < 2:
                host_bits = 2 # Minimum /30 for 2 usable hosts
            
            allocated_cidr = 32 - host_bits
            block_size = 1 << host_bits
            mask_int = (0xFFFFFFFF << host_bits) & 0xFFFFFFFF

            net_addr = current_base
            bcast_addr = net_addr + block_size - 1

            if bcast_addr >= network_limit:
                raise OverflowError(f"Pool exhausted: Cannot allocate {dept} ({needed_hosts} hosts).")

            first_usable = net_addr + 1
            last_usable = bcast_addr - 1
            usable_hosts = block_size - 2
            efficiency = (needed_hosts / usable_hosts) * 100

            entry = {
                "dept": dept,
                "needed_hosts": needed_hosts,
                "allocated_cidr": allocated_cidr,
                "subnet_mask": self.int_to_ip(mask_int),
                "network_address": self.int_to_ip(net_addr),
                "broadcast_address": self.int_to_ip(bcast_addr),
                "usable_range": f"{self.int_to_ip(first_usable)} - {self.int_to_ip(last_usable)}",
                "usable_hosts": usable_hosts,
                "block_size": block_size,
                "efficiency": f"{efficiency:.1f}%"
            }
            allocations.append(entry)

            # Move base pointer forward by block_size
            current_base += block_size

        return allocations

    def display_plan(self, allocations: list):
        print(f"\\n{'Department':<16} {'Needed':<8} {'CIDR':<6} {'Subnet Mask':<16} {'Network':<16} {'Usable Range':<32} {'Broadcast':<16}")
        print("=" * 115)
        for row in allocations:
            print(f"{row['dept']:<16} {row['needed_hosts']:<8} /{row['allocated_cidr']:<5} {row['subnet_mask']:<16} {row['network_address']:<16} {row['usable_range']:<32} {row['broadcast_address']:<16}")


def main():
    allocator = VlsmSubnetAllocator()
    departments = [
        ("Sales", 60),
        ("Engineering", 28),
        ("Marketing", 14),
        ("Support", 6),
        ("WAN Router P2P", 2)
    ]
    plan = allocator.allocate(base_network="192.168.1.0", parent_cidr=24, requirements=departments)
    allocator.display_plan(plan)


if __name__ == "__main__":
    main()`,

    cppCode: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <cstdint>
#include <sstream>

using namespace std;

struct SubnetRequirement {
    string dept;
    int neededHosts;
};

struct VlsmAllocation {
    string dept;
    int neededHosts;
    int allocatedCidr;
    string subnetMask;
    string networkAddress;
    string broadcastAddress;
    string usableRange;
    int usableHosts;
    int blockSize;
};

class VlsmSubnetAllocator {
public:
    static uint32_t ipToInt(const string& ipStr) {
        stringstream ss(ipStr);
        string segment;
        uint32_t result = 0;
        int shift = 24;
        while (getline(ss, segment, '.')) {
            result |= (static_cast<uint32_t>(stoi(segment)) << shift);
            shift -= 8;
        }
        return result;
    }

    static string intToIp(uint32_t num) {
        return to_string((num >> 24) & 0xFF) + "." +
               to_string((num >> 16) & 0xFF) + "." +
               to_string((num >> 8) & 0xFF) + "." +
               to_string(num & 0xFF);
    }

    static vector<VlsmAllocation> allocate(
        const string& baseNetwork,
        int parentCidr,
        vector<SubnetRequirement> reqs
    ) {
        // Step 1: Sort in descending order to avoid fragmentation
        sort(reqs.begin(), reqs.end(), [](const auto& a, const auto& b) {
            return a.neededHosts > b.neededHosts;
        });

        uint32_t currentBase = ipToInt(baseNetwork);
        vector<VlsmAllocation> plan;

        for (const auto& req : reqs) {
            int totalNeeded = req.neededHosts + 2;
            int hostBits = static_cast<int>(ceil(log2(totalNeeded)));
            if (hostBits < 2) hostBits = 2; // minimum /30 for point-to-point links

            int allocatedCidr = 32 - hostBits;
            uint32_t blockSize = 1 << hostBits;
            uint32_t mask = (0xFFFFFFFF << hostBits);

            uint32_t netAddr = currentBase;
            uint32_t bcastAddr = netAddr + blockSize - 1;

            VlsmAllocation alloc;
            alloc.dept = req.dept;
            alloc.neededHosts = req.neededHosts;
            alloc.allocatedCidr = allocatedCidr;
            alloc.subnetMask = intToIp(mask);
            alloc.networkAddress = intToIp(netAddr);
            alloc.broadcastAddress = intToIp(bcastAddr);
            alloc.usableRange = intToIp(netAddr + 1) + " - " + intToIp(bcastAddr - 1);
            alloc.usableHosts = blockSize - 2;
            alloc.blockSize = blockSize;

            plan.push_back(alloc);
            currentBase += blockSize;
        }

        return plan;
    }
};

int main() {
    vector<SubnetRequirement> departments = {
        {"Sales", 60},
        {"Engineering", 28},
        {"Marketing", 14},
        {"Support", 6},
        {"WAN Router P2P", 2}
    };

    auto plan = VlsmSubnetAllocator::allocate("192.168.1.0", 24, departments);

    cout << left << setw(18) << "Department"
         << setw(8) << "Needed"
         << setw(8) << "CIDR"
         << setw(16) << "Subnet Mask"
         << setw(16) << "Network"
         << setw(32) << "Usable Range"
         << "Broadcast\\n";
    cout << string(110, '=') << "\\n";

    for (const auto& r : plan) {
        cout << left << setw(18) << r.dept
             << setw(8) << r.neededHosts
             << "/" + to_string(r.allocatedCidr)
             << setw(8 - (to_string(r.allocatedCidr).length() + 1)) << ""
             << setw(16) << r.subnetMask
             << setw(16) << r.networkAddress
             << setw(32) << r.usableRange
             << r.broadcastAddress << "\\n";
    }

    return 0;
}`,

    javaCode: `import java.util.*;

public class VlsmSubnetAllocator {

    public static class SubnetRequirement {
        public String dept;
        public int neededHosts;

        public SubnetRequirement(String dept, int neededHosts) {
            this.dept = dept;
            this.neededHosts = neededHosts;
        }
    }

    public static class VlsmAllocation {
        public String dept;
        public int neededHosts;
        public int allocatedCidr;
        public String subnetMask;
        public String networkAddress;
        public String broadcastAddress;
        public String usableRange;
        public int usableHosts;
        public int blockSize;
    }

    public static long ipToLong(String ipStr) {
        String[] octets = ipStr.trim().split("\\\\.");
        long res = 0;
        for (int i = 0; i < 4; i++) {
            res |= (Long.parseLong(octets[i]) << (24 - 8 * i));
        }
        return res & 0xFFFFFFFFL;
    }

    public static String longToIp(long num) {
        return String.format("%d.%d.%d.%d",
                (num >> 24) & 0xFF,
                (num >> 16) & 0xFF,
                (num >> 8) & 0xFF,
                num & 0xFF);
    }

    public static List<VlsmAllocation> allocate(
            String baseNetwork,
            int parentCidr,
            List<SubnetRequirement> reqs
    ) {
        // Step 1: Sort requests descending by host demand
        reqs.sort((a, b) -> Integer.compare(b.neededHosts, a.neededHosts));

        long currentBase = ipToLong(baseNetwork);
        List<VlsmAllocation> plan = new ArrayList<>();

        for (SubnetRequirement req : reqs) {
            int totalNeeded = req.neededHosts + 2;
            int hostBits = (int) Math.ceil(Math.log(totalNeeded) / Math.log(2));
            if (hostBits < 2) hostBits = 2; // /30 minimum

            int allocatedCidr = 32 - hostBits;
            long blockSize = 1L << hostBits;
            long mask = ((0xFFFFFFFFL << hostBits) & 0xFFFFFFFFL);

            long netAddr = currentBase;
            long bcastAddr = netAddr + blockSize - 1;

            VlsmAllocation alloc = new VlsmAllocation();
            alloc.dept = req.dept;
            alloc.neededHosts = req.neededHosts;
            alloc.allocatedCidr = allocatedCidr;
            alloc.subnetMask = longToIp(mask);
            alloc.networkAddress = longToIp(netAddr);
            alloc.broadcastAddress = longToIp(bcastAddr);
            alloc.usableRange = longToIp(netAddr + 1) + " - " + longToIp(bcastAddr - 1);
            alloc.usableHosts = (int) (blockSize - 2);
            alloc.blockSize = (int) blockSize;

            plan.add(alloc);
            currentBase += blockSize;
        }

        return plan;
    }

    public static void main(String[] args) {
        List<SubnetRequirement> list = new ArrayList<>();
        list.add(new SubnetRequirement("Sales", 60));
        list.add(new SubnetRequirement("Engineering", 28));
        list.add(new SubnetRequirement("Marketing", 14));
        list.add(new SubnetRequirement("Support", 6));
        list.add(new SubnetRequirement("WAN Router P2P", 2));

        List<VlsmAllocation> plan = allocate("192.168.1.0", 24, list);

        System.out.printf("%-18s %-8s %-8s %-16s %-16s %-32s %s%n",
                "Department", "Needed", "CIDR", "Subnet Mask", "Network", "Usable Range", "Broadcast");
        System.out.println("=".repeat(110));

        for (VlsmAllocation r : plan) {
            System.out.printf("%-18s %-8d /%-6d %-16s %-16s %-32s %s%n",
                    r.dept, r.neededHosts, r.allocatedCidr, r.subnetMask,
                    r.networkAddress, r.usableRange, r.broadcastAddress);
        }
    }
}`
  },

  membership: {
    id: 'membership',
    title: 'Subnet Membership & CIDR Longest Prefix Match (LPM)',
    standard: 'RFC 1812 (Requirements for IPv4 Routers) & RFC 4632',
    complexity: {
      time: 'O(R) Routing Table Scan / O(1) Local Subnet Test',
      space: 'O(R) Routing Table Size',
      decision: 'L2 Local ARP Broadcast vs. L3 Default Gateway Forward'
    },
    summary:
      'Performs destination IP route lookups using the core routing principle: Longest Prefix Match (LPM). Also verifies whether two IP endpoints share the same local subnet or require Layer 3 gateway forwarding.',

    pythonCode: `class SubnetRouterEngine:
    """Simulates Layer 3 IP routing, subnet membership testing, and Longest Prefix Match (LPM)."""

    @staticmethod
    def ip_to_int(ip_str: str) -> int:
        octets = [int(x) for x in ip_str.strip().split('.')]
        return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]

    @staticmethod
    def int_to_ip(num: int) -> str:
        return f"{(num >> 24) & 255}.{(num >> 16) & 255}.{(num >> 8) & 255}.{num & 255}"

    def __init__(self):
        # Routing table entries: (Network IP, CIDR, Next Hop Gateway, Egress Interface, Metric)
        self.routes = [
            ("10.0.0.0", 8, "192.168.1.254", "eth0 (Corporate WAN)", 10),
            ("172.16.0.0", 16, "192.168.1.253", "eth1 (Data Center)", 15),
            ("192.168.1.0", 24, "Direct", "eth2 (Local Subnet A)", 1),
            ("192.168.1.64", 26, "Direct", "eth3 (DMZ Subnet B)", 1),
            ("192.168.1.128", 25, "192.168.1.129", "eth4 (Branch Office)", 5),
            ("0.0.0.0", 0, "203.0.113.1", "wan0 (ISP Default Gateway)", 100)
        ]

    def test_same_subnet(self, ip_a_str: str, ip_b_str: str, cidr: int) -> dict:
        """Determines if two endpoints share the same local broadcast domain."""
        num_a = self.ip_to_int(ip_a_str)
        num_b = self.ip_to_int(ip_b_str)
        mask = (0xFFFFFFFF << (32 - cidr)) & 0xFFFFFFFF if cidr > 0 else 0

        net_a = num_a & mask
        net_b = num_b & mask
        same = (net_a == net_b)

        return {
            "ip_a": ip_a_str,
            "ip_b": ip_b_str,
            "cidr": cidr,
            "net_a": self.int_to_ip(net_a),
            "net_b": self.int_to_ip(net_b),
            "is_same_subnet": same,
            "action": "Direct Layer 2 ARP Broadcast Delivery (No router needed)" if same
                      else "Route via Layer 3 Default Gateway"
        }

    def longest_prefix_match(self, destination_ip_str: str) -> dict:
        """Finds the most specific route in routing table matching destination IP."""
        dest_num = self.ip_to_int(destination_ip_str)
        best_match = None
        best_cidr = -1
        evaluated_candidates = []

        for net_str, cidr, next_hop, iface, metric in self.routes:
            mask = (0xFFFFFFFF << (32 - cidr)) & 0xFFFFFFFF if cidr > 0 else 0
            route_net_num = self.ip_to_int(net_str) & mask

            # Check if destination IP matches this subnet route
            is_match = (dest_num & mask) == route_net_num
            evaluated_candidates.append({
                "prefix": f"{net_str}/{cidr}",
                "matched": is_match,
                "interface": iface
            })

            if is_match and cidr > best_cidr:
                best_cidr = cidr
                best_match = {
                    "prefix": f"{net_str}/{cidr}",
                    "cidr": cidr,
                    "next_hop": next_hop,
                    "interface": iface,
                    "metric": metric
                }

        return {
            "dest_ip": destination_ip_str,
            "selected_route": best_match,
            "candidates": evaluated_candidates
        }


def main():
    engine = SubnetRouterEngine()

    print("=== TEST 1: SUBNET MEMBERSHIP CHECK ===")
    res1 = engine.test_same_subnet("192.168.1.15", "192.168.1.45", 26)
    print(f"Host A: {res1['ip_a']} | Host B: {res1['ip_b']} (Mask /{res1['cidr']})")
    print(f"Decision: {res1['action']} (NetA={res1['net_a']}, NetB={res1['net_b']})\\n")

    print("=== TEST 2: LONGEST PREFIX MATCH ROUTE LOOKUP ===")
    target = "192.168.1.75"
    lpm = engine.longest_prefix_match(target)
    print(f"Lookup Destination IP : {lpm['dest_ip']}")
    sel = lpm['selected_route']
    print(f"Longest Matching Route: {sel['prefix']} -> Egress: {sel['interface']} (Next Hop: {sel['next_hop']})")


if __name__ == "__main__":
    main()`,

    cppCode: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
#include <cstdint>

using namespace std;

struct RouteEntry {
    string prefix;
    uint32_t network;
    uint32_t mask;
    int cidr;
    string nextHop;
    string iface;
};

class SubnetRouterEngine {
private:
    vector<RouteEntry> table;

public:
    static uint32_t ipToInt(const string& ipStr) {
        stringstream ss(ipStr);
        string seg;
        uint32_t res = 0;
        int shift = 24;
        while (getline(ss, seg, '.')) {
            res |= (static_cast<uint32_t>(stoi(seg)) << shift);
            shift -= 8;
        }
        return res;
    }

    static string intToIp(uint32_t num) {
        return to_string((num >> 24) & 0xFF) + "." +
               to_string((num >> 16) & 0xFF) + "." +
               to_string((num >> 8) & 0xFF) + "." +
               to_string(num & 0xFF);
    }

    SubnetRouterEngine() {
        addRoute("10.0.0.0", 8, "192.168.1.254", "eth0 (Corporate WAN)");
        addRoute("172.16.0.0", 16, "192.168.1.253", "eth1 (Data Center)");
        addRoute("192.168.1.0", 24, "Direct", "eth2 (Local Subnet A)");
        addRoute("192.168.1.64", 26, "Direct", "eth3 (DMZ Subnet B)");
        addRoute("0.0.0.0", 0, "203.0.113.1", "wan0 (ISP Default Gateway)");
    }

    void addRoute(const string& netStr, int cidr, const string& nextHop, const string& iface) {
        uint32_t mask = (cidr == 0) ? 0 : (0xFFFFFFFF << (32 - cidr));
        uint32_t net = ipToInt(netStr) & mask;
        table.push_back({netStr + "/" + to_string(cidr), net, mask, cidr, nextHop, iface});
    }

    bool isSameSubnet(const string& ipA, const string& ipB, int cidr) {
        uint32_t numA = ipToInt(ipA);
        uint32_t numB = ipToInt(ipB);
        uint32_t mask = (cidr == 0) ? 0 : (0xFFFFFFFF << (32 - cidr));
        return (numA & mask) == (numB & mask);
    }

    RouteEntry longestPrefixMatch(const string& destIp) {
        uint32_t destNum = ipToInt(destIp);
        RouteEntry bestMatch = {"None", 0, 0, -1, "None", "None"};

        for (const auto& route : table) {
            if ((destNum & route.mask) == route.network) {
                if (route.cidr > bestMatch.cidr) {
                    bestMatch = route;
                }
            }
        }
        return bestMatch;
    }
};

int main() {
    SubnetRouterEngine engine;

    cout << "=== TEST 1: SUBNET MEMBERSHIP CHECK ===\\n";
    string hostA = "192.168.1.15";
    string hostB = "192.168.1.45";
    int cidr = 26;
    bool same = engine.isSameSubnet(hostA, hostB, cidr);
    cout << "Host A: " << hostA << " | Host B: " << hostB << " (/" << cidr << ")\\n";
    cout << "Verdict: " << (same ? "Same Subnet -> Direct L2 ARP" : "Different -> Forward to L3 Router") << "\\n\\n";

    cout << "=== TEST 2: LONGEST PREFIX MATCH ROUTE LOOKUP ===\\n";
    string target = "192.168.1.75";
    RouteEntry route = engine.longestPrefixMatch(target);
    cout << "Destination IP : " << target << "\\n";
    cout << "Matched Route  : " << route.prefix << "\\n";
    cout << "Egress Port    : " << route.iface << " (Next Hop: " << route.nextHop << ")\\n";

    return 0;
}`,

    javaCode: `import java.util.*;

public class SubnetRouterEngine {

    static class RouteEntry {
        String prefix;
        long network;
        long mask;
        int cidr;
        String nextHop;
        String iface;

        public RouteEntry(String prefix, long network, long mask, int cidr, String nextHop, String iface) {
            this.prefix = prefix;
            this.network = network;
            this.mask = mask;
            this.cidr = cidr;
            this.nextHop = nextHop;
            this.iface = iface;
        }
    }

    private List<RouteEntry> table = new ArrayList<>();

    public SubnetRouterEngine() {
        addRoute("10.0.0.0", 8, "192.168.1.254", "eth0 (Corporate WAN)");
        addRoute("172.16.0.0", 16, "192.168.1.253", "eth1 (Data Center)");
        addRoute("192.168.1.0", 24, "Direct", "eth2 (Local Subnet A)");
        addRoute("192.168.1.64", 26, "Direct", "eth3 (DMZ Subnet B)");
        addRoute("0.0.0.0", 0, "203.0.113.1", "wan0 (ISP Default Gateway)");
    }

    public static long ipToLong(String ipStr) {
        String[] octets = ipStr.trim().split("\\\\.");
        long res = 0;
        for (int i = 0; i < 4; i++) {
            res |= (Long.parseLong(octets[i]) << (24 - 8 * i));
        }
        return res & 0xFFFFFFFFL;
    }

    public void addRoute(String netStr, int cidr, String nextHop, String iface) {
        long mask = (cidr == 0) ? 0L : ((0xFFFFFFFFL << (32 - cidr)) & 0xFFFFFFFFL);
        long net = ipToLong(netStr) & mask;
        table.add(new RouteEntry(netStr + "/" + cidr, net, mask, cidr, nextHop, iface));
    }

    public boolean isSameSubnet(String ipA, String ipB, int cidr) {
        long numA = ipToLong(ipA);
        long numB = ipToLong(ipB);
        long mask = (cidr == 0) ? 0L : ((0xFFFFFFFFL << (32 - cidr)) & 0xFFFFFFFFL);
        return (numA & mask) == (numB & mask);
    }

    public RouteEntry longestPrefixMatch(String destIp) {
        long destNum = ipToLong(destIp);
        RouteEntry bestMatch = null;
        int bestCidr = -1;

        for (RouteEntry route : table) {
            if ((destNum & route.mask) == route.network) {
                if (route.cidr > bestCidr) {
                    bestCidr = route.cidr;
                    bestMatch = route;
                }
            }
        }
        return bestMatch;
    }

    public static void main(String[] args) {
        SubnetRouterEngine engine = new SubnetRouterEngine();

        System.out.println("=== TEST 1: SUBNET MEMBERSHIP CHECK ===");
        String hostA = "192.168.1.15";
        String hostB = "192.168.1.45";
        int cidr = 26;
        boolean same = engine.isSameSubnet(hostA, hostB, cidr);
        System.out.println("Host A: " + hostA + " | Host B: " + hostB + " (/" + cidr + ")");
        System.out.println("Verdict: " + (same ? "Same Subnet -> Direct L2 ARP" : "Different -> Forward to L3 Router"));

        System.out.println("\\n=== TEST 2: LONGEST PREFIX MATCH ROUTE LOOKUP ===");
        String target = "192.168.1.75";
        RouteEntry match = engine.longestPrefixMatch(target);
        System.out.println("Destination IP : " + target);
        System.out.println("Matched Route  : " + match.prefix);
        System.out.println("Egress Port    : " + match.iface + " (Next Hop: " + match.nextHop + ")");
    }
}`
  }
};

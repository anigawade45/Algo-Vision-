/**
 * Comprehensive Data, Protocols, Algorithms & Code Implementations for Transport Layer (TCP vs UDP)
 * Languages: C++, Java, Python 3
 */

export const TRANSPORT_LAYER_DATA = {
  overview: {
    title: 'Transport Layer Protocols: TCP vs UDP',
    tagline: 'End-to-End Process-to-Process Delivery, Reliability, Flow Control & Multiplexing',
    osiLayer: 'Layer 4 (Transport Layer)',
    addressing: 'Port Numbers (16-bit: 0 to 65535)',
    pdu: 'TCP Segment / UDP Datagram',
  },

  tcp: {
    name: 'Transmission Control Protocol (TCP)',
    standard: 'RFC 793, RFC 5681, RFC 7323',
    connectionType: 'Connection-Oriented (Full-Duplex Byte Stream)',
    headerSize: '20 bytes minimum (up to 60 bytes with Options)',
    reliability: '100% Guaranteed (Sequencing, ACKs, Retransmissions, Checksums)',
    flowControl: 'Sliding Window Protocol (Advertised Receive Window rwnd)',
    congestionControl: 'Additive Increase Multiplicative Decrease (AIMD), Slow Start, Fast Retransmit',
    handshake: '3-Way Handshake (SYN -> SYN-ACK -> ACK)',
    teardown: '4-Way Teardown (FIN -> ACK -> FIN -> ACK)',
    speed: 'Moderate (Connection establishment overhead + ACK roundtrips)',
    useCases: [
      'Web Browsing (HTTP/HTTPS - Ports 80, 443)',
      'File Transfers (FTP, SFTP - Ports 20, 21, 22)',
      'Email Delivery (SMTP, IMAP, POP3 - Ports 25, 993, 995)',
      'Remote Server Administration (SSH - Port 22)',
      'Database Connections (PostgreSQL: 5432, MySQL: 3306)',
    ],
    headerFields: [
      { name: 'Source Port', bits: '16 bits', desc: 'Identifies sending application process.' },
      { name: 'Destination Port', bits: '16 bits', desc: 'Identifies receiving application process.' },
      { name: 'Sequence Number (SEQ)', bits: '32 bits', desc: 'Byte stream order of the first data byte in this segment.' },
      { name: 'Acknowledgment Number (ACK)', bits: '32 bits', desc: 'Next expected byte number from the sender (Cumulative ACK).' },
      { name: 'Data Offset (Header Length)', bits: '4 bits', desc: 'Number of 32-bit words in the TCP header (20 to 60 bytes).' },
      { name: 'Reserved', bits: '3 bits', desc: 'Must be zero; reserved for future protocol enhancements.' },
      { name: 'Control Flags (URG, ACK, PSH, RST, SYN, FIN)', bits: '9 bits', desc: 'Controls connection state, sync, termination, and priority.' },
      { name: 'Window Size (rwnd)', bits: '16 bits', desc: 'Flow control: Number of bytes the receiver buffer can accept.' },
      { name: 'Checksum', bits: '16 bits', desc: 'Error detection covering header, data, and pseudo-IP header.' },
      { name: 'Urgent Pointer', bits: '16 bits', desc: 'Points to urgent out-of-band data (if URG flag set).' },
      { name: 'Options & Padding', bits: '0-320 bits', desc: 'MSS negotiation, Window Scaling, Selective ACK (SACK), Timestamps.' },
    ],
  },

  udp: {
    name: 'User Datagram Protocol (UDP)',
    standard: 'RFC 768',
    connectionType: 'Connectionless (Independent Datagrams)',
    headerSize: '8 bytes fixed (Extremely lightweight)',
    reliability: 'Best-effort delivery (No ACKs, No retransmissions, No ordering)',
    flowControl: 'None (Receiver buffer overflow causes silent packet drops)',
    congestionControl: 'None (Application or higher-layer protocol must manage rate)',
    handshake: 'None (0 RTT instant packet transmission)',
    teardown: 'None (Fire-and-forget)',
    speed: 'Maximum wire-speed (Zero handshake delay, low bandwidth overhead)',
    useCases: [
      'Domain Name System queries (DNS - Port 53)',
      'Dynamic Host Configuration (DHCP - Ports 67, 68)',
      'Voice over IP & Video Calling (VoIP / SIP / RTP / Zoom)',
      'Online Multiplayer Gaming (Valorant, Fortnite, CS:GO)',
      'Modern Web Transport (QUIC / HTTP/3 over UDP)',
      'Network Time Synchronization (NTP - Port 123)',
    ],
    headerFields: [
      { name: 'Source Port', bits: '16 bits', desc: 'Identifies sending application port (optional in UDP, set to 0 if unused).' },
      { name: 'Destination Port', bits: '16 bits', desc: 'Identifies receiving destination application port.' },
      { name: 'Length', bits: '16 bits', desc: 'Total byte length of the UDP segment (Header 8 bytes + Data payload).' },
      { name: 'Checksum', bits: '16 bits', desc: 'Optional in IPv4, mandatory in IPv6. Validates payload & pseudo-header integrity.' },
    ],
  },

  comparisonMatrix: [
    { feature: 'Connection Paradigm', tcp: 'Connection-Oriented (Stateful)', udp: 'Connectionless (Stateless)', winner: 'tcp' },
    { feature: 'Reliability & Delivery', tcp: '100% Guaranteed Delivery', udp: 'Best-Effort (Packets may drop)', winner: 'tcp' },
    { feature: 'Packet Sequencing', tcp: 'In-order Byte Stream Reassembly', udp: 'No Ordering (Arrival as-is)', winner: 'tcp' },
    { feature: 'Header Overhead', tcp: '20 to 60 Bytes (Heavy)', udp: '8 Bytes Fixed (Lightweight)', winner: 'udp' },
    { feature: 'Handshake Delay', tcp: '1.5 RTT (3-Way Handshake)', udp: '0 RTT (Instantaneous)', winner: 'udp' },
    { feature: 'Flow Control', tcp: 'Sliding Window (Prevents buffer overrun)', udp: 'None (Packets dropped on overflow)', winner: 'tcp' },
    { feature: 'Congestion Control', tcp: 'AIMD / Slow Start / Fast Recovery', udp: 'None (Can saturate links)', winner: 'tcp' },
    { feature: 'Error Recovery', tcp: 'Automatic Retransmission (RTO/Fast)', udp: 'None (Ignored)', winner: 'tcp' },
    { feature: 'Transmission Mode', tcp: 'Unicast Only (Point-to-Point)', udp: 'Unicast, Multicast, & Broadcast', winner: 'udp' },
    { feature: 'Best Suited For', tcp: 'Precision, Web, Files, Databases', udp: 'Gaming, Live Streaming, DNS, VoIP', winner: 'neutral' },
  ],

  codeExamples: {
    tcp: {
      title: 'TCP Socket Server & Client (Reliable Byte Stream)',
      python: `import socket
import threading

def run_tcp_server(host='127.0.0.1', port=8080):
    """TCP Server: Creates a reliable stream socket, binds, listens, and accepts connections."""
    server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_sock.bind((host, port))
    server_sock.listen(5)
    print(f"[TCP SERVER] Listening on {host}:{port} (State: LISTEN)...")

    def handle_client(conn, addr):
        print(f"[TCP SERVER] Handshake Complete with {addr} (State: ESTABLISHED)")
        while True:
            data = conn.recv(1024)
            if not data:
                break
            print(f"[TCP SERVER] Received: {data.decode('utf-8')}")
            ack_msg = f"ACK: Received {len(data)} bytes securely."
            conn.sendall(ack_msg.encode('utf-8'))
        print(f"[TCP SERVER] Client {addr} disconnected (4-way teardown).")
        conn.close()

    try:
        conn, addr = server_sock.accept()
        handle_client(conn, addr)
    finally:
        server_sock.close()

def run_tcp_client(host='127.0.0.1', port=8080):
    """TCP Client: Initiates 3-Way Handshake (SYN -> SYN-ACK -> ACK) and sends data stream."""
    client_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    print(f"[TCP CLIENT] Initiating 3-Way Handshake to {host}:{port}...")
    client_sock.connect((host, port))
    print(f"[TCP CLIENT] Connected! (State: ESTABLISHED)")

    message = "GET /api/v1/resource HTTP/1.1\\r\\nHost: algovision.io\\r\\n\\r\\n"
    print(f"[TCP CLIENT] Transmitting byte stream: {message.strip()}")
    client_sock.sendall(message.encode('utf-8'))

    response = client_sock.recv(1024)
    print(f"[TCP CLIENT] Server Response: {response.decode('utf-8')}")

    print("[TCP CLIENT] Closing socket (Sending FIN segment)...")
    client_sock.close()

if __name__ == '__main__':
    # Run in threaded demo
    srv = threading.Thread(target=run_tcp_server, daemon=True)
    srv.start()
    import time; time.sleep(0.2)
    run_tcp_client()
`,
      cpp: `#include <iostream>
#include <string>
#include <cstring>

#if defined(_WIN32)
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#endif

// High-level conceptual C++ implementation of a Reliable TCP Stream Socket
class TCPServer {
private:
    int port;

public:
    TCPServer(int p) : port(p) {}

    void start() {
        std::cout << "[TCP SERVER] Socket created: SOCK_STREAM (Protocol: IPPROTO_TCP)\\n";
        std::cout << "[TCP SERVER] Binding to 0.0.0.0:" << port << "...\\n";
        std::cout << "[TCP SERVER] Listening for incoming connections (State: LISTEN)...\\n\\n";
        
        // Simulating incoming 3-Way Handshake
        std::cout << "  [1. INGRESS] Received SYN from 192.168.1.50:49152 (SEQ=1000)\\n";
        std::cout << "  [2. EGRESS]  Sending SYN-ACK to 192.168.1.50:49152 (SEQ=5000, ACK=1001)\\n";
        std::cout << "  [3. INGRESS] Received ACK from 192.168.1.50:49152 (SEQ=1001, ACK=5001)\\n";
        std::cout << "  [ESTABLISHED] Full-duplex byte stream established!\\n\\n";

        std::cout << "  [DATA RX] Received 32 bytes: \\"Hello Server via TCP\\" (SEQ=1001..1033)\\n";
        std::cout << "  [DATA TX] Returning Cumulative ACK=1033 with response payload.\\n";
        std::cout << "  [TEARDOWN] Handled 4-way FIN/ACK teardown cleanly.\\n";
    }
};

int main() {
    TCPServer server(8080);
    server.start();
    return 0;
}
`,
      java: `import java.io.*;
import java.net.*;

public class TCPSocketDemo {
    public static void runServer(int port) {
        System.out.println("[TCP SERVER] Creating ServerSocket on port " + port + "...");
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("[TCP SERVER] Waiting for incoming client 3-way handshake (LISTEN)...");
            
            Socket clientSocket = serverSocket.accept();
            System.out.println("[TCP SERVER] Connection ESTABLISHED with " + clientSocket.getRemoteSocketAddress());

            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

            String inputLine = in.readLine();
            System.out.println("[TCP SERVER] Received in-order byte stream: \\"" + inputLine + "\\"");

            out.println("HTTP/1.1 200 OK - Byte stream confirmed by server.");
            System.out.println("[TCP SERVER] Transmitted response + ACK.");

            clientSocket.close();
            System.out.println("[TCP SERVER] Socket closed via 4-way FIN handshake.\\n");
        } catch (IOException e) {
            System.err.println("[TCP ERROR] " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Run Server simulation
        new Thread(() -> runServer(8080)).start();
    }
}
`,
    },

    udp: {
      title: 'UDP Datagram Socket Server & Client (0-RTT Fast Datagrams)',
      python: `import socket
import threading
import time

def run_udp_server(host='127.0.0.1', port=9090):
    """UDP Server: Creates a lightweight connectionless datagram socket."""
    server_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_sock.bind((host, port))
    print(f"[UDP SERVER] Bound to {host}:{port} (Ready for datagrams, 0 handshake overhead)...")

    while True:
        data, addr = server_sock.recvfrom(2048) # 2 KB Buffer
        print(f"[UDP SERVER] Received {len(data)} bytes from {addr}: {data.decode('utf-8')}")
        reply = f"ACK_DATAGRAM_{time.time():.2f}"
        server_sock.sendto(reply.encode('utf-8'), addr)
        break
    server_sock.close()

def run_udp_client(host='127.0.0.1', port=9090):
    """UDP Client: Sends immediate fire-and-forget packet without prior handshake."""
    client_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print(f"[UDP CLIENT] Blasting datagram to {host}:{port} with 0 RTT delay...")

    payload = "DNS_QUERY: algovision.io (A-Record Type 1)"
    client_sock.sendto(payload.encode('utf-8'), (host, port))

    # Optional receive (non-blocking / timeout enabled)
    client_sock.settimeout(2.0)
    try:
        data, srv_addr = client_sock.recvfrom(2048)
        print(f"[UDP CLIENT] Server Reply from {srv_addr}: {data.decode('utf-8')}")
    except socket.timeout:
        print("[UDP CLIENT] Packet timeout! (UDP does not retransmit automatically).")
    finally:
        client_sock.close()

if __name__ == '__main__':
    srv = threading.Thread(target=run_udp_server, daemon=True)
    srv.start()
    time.sleep(0.1)
    run_udp_client()
`,
      cpp: `#include <iostream>
#include <string>

// High-level conceptual C++ implementation of a Fast UDP Datagram Socket
class UDPSocketManager {
private:
    int port;

public:
    UDPSocketManager(int p) : port(p) {}

    void runDemo() {
        std::cout << "[UDP SOCKET] Creating socket: SOCK_DGRAM (Protocol: IPPROTO_UDP)\\n";
        std::cout << "[UDP SOCKET] Header size: Exactly 8 Bytes (Source Port, Dest Port, Length, Checksum)\\n";
        std::cout << "[UDP SOCKET] 0-RTT Connectionless transmission initiated...\\n\\n";

        std::cout << "  [TX] Blasting Datagram -> 192.168.1.1:53 (Payload: \\"DNS Lookup google.com\\")\\n";
        std::cout << "  [TX] No handshake, no SYN packet, no sequence numbering overhead.\\n";
        std::cout << "  [RX] Received 48 bytes datagram reply directly into buffer.\\n\\n";
        std::cout << "[UDP STATUS] High-throughput delivery complete with 0 connection state.\\n";
    }
};

int main() {
    UDPSocketManager udp(9090);
    udp.runDemo();
    return 0;
}
`,
      java: `import java.net.*;

public class UDPDatagramDemo {
    public static void runUdpServer(int port) {
        System.out.println("[UDP SERVER] Listening on DatagramSocket port " + port + "...");
        try (DatagramSocket socket = new DatagramSocket(port)) {
            byte[] buffer = new byte[1024];
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            
            System.out.println("[UDP SERVER] Waiting for datagram (0 handshake needed)...");
            socket.receive(packet);

            String message = new String(packet.getData(), 0, packet.getLength());
            System.out.println("[UDP SERVER] Received datagram: \\"" + message + "\\" from " + packet.getSocketAddress());

            // Immediate Datagram Reply
            byte[] replyBytes = "UDP_REPLY_OK".getBytes();
            DatagramPacket replyPacket = new DatagramPacket(replyBytes, replyBytes.length, packet.getAddress(), packet.getPort());
            socket.send(replyPacket);
            System.out.println("[UDP SERVER] Dispatched fire-and-forget datagram reply.\\n");
        } catch (Exception e) {
            System.err.println("[UDP ERROR] " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        new Thread(() -> runUdpServer(9090)).start();
    }
}
`,
    },
  },
};

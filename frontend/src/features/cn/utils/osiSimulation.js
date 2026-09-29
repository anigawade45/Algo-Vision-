/**
 * OSI 7-Layer Protocol Simulation & Encapsulation Logic
 */

export const OSI_LAYERS = [
  {
    layerNum: 7,
    name: 'Application Layer',
    shortName: 'L7 - App',
    pdu: 'Data / Message',
    protocols: ['HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP', 'SMTP'],
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-500',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    description: 'Direct interface with user software. Generates application data payload.',
    headerName: 'HTTP Request Header',
    addedFields: {
      Method: 'GET',
      URI: '/index.html',
      Version: 'HTTP/1.1',
      Host: 'algovision.edu',
      'User-Agent': 'AlgoVision-Browser/3.2',
      Accept: 'text/html,application/json',
    },
  },
  {
    layerNum: 6,
    name: 'Presentation Layer',
    shortName: 'L6 - Pres',
    pdu: 'Formatted Data',
    protocols: ['TLS 1.3', 'SSL', 'JSON', 'MIME', 'JPEG', 'ASCII'],
    color: 'from-indigo-600 to-purple-600',
    borderColor: 'border-indigo-500',
    textColor: 'text-indigo-500',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
    description: 'Data encryption (TLS), serialization, MIME encoding, and compression.',
    headerName: 'TLS / Encryption Wrapper',
    addedFields: {
      'TLS Version': 'TLS 1.3 (RFC 8446)',
      Cipher: 'TLS_AES_256_GCM_SHA384',
      Encoding: 'UTF-8 / JSON',
      Compression: 'None (Gzip ready)',
    },
  },
  {
    layerNum: 5,
    name: 'Session Layer',
    shortName: 'L5 - Session',
    pdu: 'Session Data',
    protocols: ['NetBIOS', 'RPC', 'PPTP', 'Sockets', 'PAP'],
    color: 'from-purple-600 to-fuchsia-600',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-500',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    description: 'Establishes, manages, and terminates session dialogs and token tracking.',
    headerName: 'Session Context Header',
    addedFields: {
      'Session ID': '0x7F4A8C99B2',
      'Sync Token': 'SYNC_PT_04',
      Dialog: 'Full-Duplex Request',
      'Keep-Alive': '300s',
    },
  },
  {
    layerNum: 4,
    name: 'Transport Layer',
    shortName: 'L4 - Transport',
    pdu: 'Segment / Datagram',
    protocols: ['TCP', 'UDP', 'QUIC', 'SCTP'],
    color: 'from-cyan-600 to-blue-600',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-500',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/30',
    description: 'End-to-end reliability, multiplexing via port numbers, segmentation & flow control.',
    headerName: 'TCP Transport Header (20 Bytes)',
    addedFields: {
      'Source Port': '49152 (Ephemeral)',
      'Dest Port': '443 (HTTPS)',
      'Sequence #': '1048576',
      'Ack #': '2097152',
      'Flags': 'PSH, ACK',
      'Window Size': '65535 Bytes',
      'Checksum': '0x9E2A (Valid)',
    },
  },
  {
    layerNum: 3,
    name: 'Network Layer',
    shortName: 'L3 - Network',
    pdu: 'Packet',
    protocols: ['IPv4', 'IPv6', 'ICMP', 'IPsec', 'OSPF', 'BGP'],
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    description: 'Logical IP addressing, subnet routing across routers, packet fragmentation & TTL.',
    headerName: 'IPv4 Network Header (20 Bytes)',
    addedFields: {
      'Source IP': '192.168.1.105',
      'Dest IP': '93.184.216.34',
      'TTL (Time to Live)': '64 Hops',
      Protocol: '6 (TCP)',
      'Header Checksum': '0x4F1C',
      'Total Length': '128 Bytes',
    },
  },
  {
    layerNum: 2,
    name: 'Data Link Layer',
    shortName: 'L2 - Data Link',
    pdu: 'Frame',
    protocols: ['Ethernet (802.3)', 'Wi-Fi (802.11)', 'ARP', 'PPP'],
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    description: 'Physical MAC addressing, hop-to-hop framing, error detection (CRC-32 trailer).',
    headerName: 'Ethernet II Frame Header & FCS Trailer',
    addedFields: {
      'Source MAC': '00:1A:2B:3C:4D:5E',
      'Dest MAC (Next Hop)': 'F0:9F:C2:11:22:33 (Gateway)',
      EtherType: '0x0800 (IPv4)',
      'Trailer (FCS/CRC-32)': '0x8A51C3E0 (Integrity OK)',
    },
  },
  {
    layerNum: 1,
    name: 'Physical Layer',
    shortName: 'L1 - Physical',
    pdu: 'Raw Bits',
    protocols: ['1000BASE-T', 'Fiber Optic', 'RJ45 Cat6', 'NRZ / Manchester'],
    color: 'from-rose-600 to-pink-600',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-500',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30',
    description: 'Bitstream transmission over copper wire, light in fiber, or RF electromagnetic waves.',
    headerName: 'Physical Signal & Bitstream',
    addedFields: {
      'Encoding': 'Manchester / 8b/10b',
      'Medium': 'Twisted Pair Cat6 (1 Gbps)',
      'Signal Voltage': '+0.85V / -0.85V Differential',
      'Bit Pattern': '01000111 01000101 01010100...',
    },
  },
];

export function generateEncapsulationSteps(userMessage = 'GET /index.html HTTP/1.1') {
  const steps = [];

  // Sender Encapsulation: L7 -> L1 (Layer 7 down to Layer 1)
  OSI_LAYERS.forEach((layer, idx) => {
    const activeLayers = OSI_LAYERS.slice(0, idx + 1);
    steps.push({
      stepIndex: steps.length,
      mode: 'encapsulation',
      currentLayer: layer,
      activeLayers,
      title: `Encapsulation at ${layer.name} (${layer.shortName})`,
      actionDescription: `Adding ${layer.headerName} to package the PDU into a ${layer.pdu}.`,
      direction: 'down',
      pduName: layer.pdu,
      payloadPreview: userMessage,
    });
  });

  // Transit across wire (Physical)
  steps.push({
    stepIndex: steps.length,
    mode: 'transit',
    currentLayer: OSI_LAYERS[6],
    activeLayers: [...OSI_LAYERS],
    title: 'Physical Transit across Network Medium',
    actionDescription: 'Bitstream traveling through network routers and switches to Destination.',
    direction: 'transit',
    pduName: 'Bitstream',
    payloadPreview: userMessage,
  });

  // Receiver Decapsulation: L1 -> L7 (Layer 1 up to Layer 7)
  [...OSI_LAYERS].reverse().forEach((layer, idx) => {
    const remainingLayers = OSI_LAYERS.slice(0, 7 - idx);
    steps.push({
      stepIndex: steps.length,
      mode: 'decapsulation',
      currentLayer: layer,
      activeLayers: remainingLayers,
      title: `Decapsulation at ${layer.name} (${layer.shortName})`,
      actionDescription: `Validating and stripping ${layer.headerName} to extract inner ${layer.pdu}.`,
      direction: 'up',
      pduName: layer.pdu,
      payloadPreview: userMessage,
    });
  });

  return steps;
}

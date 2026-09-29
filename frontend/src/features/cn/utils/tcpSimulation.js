/**
 * TCP Handshake & Session Protocol Simulation Engine
 * Generates step-by-step state transitions, packet metadata, sequence numbers, and byte tracing.
 */

export const TCP_SCENARIOS = [
  {
    id: 'handshake',
    name: '3-Way Handshake',
    badge: 'Core Protocol',
    description: 'Classic connection establishment between Client and Server using SYN, SYN-ACK, and ACK.',
  },
  {
    id: 'full_session',
    name: 'Full Session (Handshake + HTTP Data + Teardown)',
    badge: 'Complete Flow',
    description: 'Full lifecycle: 3-way handshake, HTTP Request/Response data transmission, and 4-way FIN termination.',
  },
  {
    id: 'packet_drop',
    name: 'Packet Loss & Retransmission',
    badge: 'Error Recovery',
    description: 'Simulates a dropped SYN segment in transit, RTO timer expiry, and automatic retransmission.',
  },
  {
    id: 'teardown',
    name: '4-Way Teardown (Connection Termination)',
    badge: 'Termination',
    description: 'Graceful connection close using FIN and ACK segments from both endpoints.',
  },
];

export function runTcpSimulation({
  scenario = 'handshake',
  clientIsn = 1000,
  serverIsn = 5000,
  dataPayload = 'GET /index.html HTTP/1.1',
  responsePayload = 'HTTP/1.1 200 OK (84 bytes HTML)',
}) {
  const steps = [];
  const loggedPackets = [];

  const addStep = ({
    title,
    description,
    clientState,
    serverState,
    activePacket = null,
    explanation = '',
    wireStatus = 'idle', // 'transmitting' | 'dropped' | 'idle' | 'established'
  }) => {
    if (activePacket) {
      loggedPackets.push({
        ...activePacket,
        packetNum: loggedPackets.length + 1,
        timestamp: (loggedPackets.length * 0.045).toFixed(3) + 's',
      });
    }

    steps.push({
      stepIndex: steps.length,
      title,
      description,
      clientState,
      serverState,
      activePacket: activePacket ? { ...activePacket } : null,
      loggedPackets: [...loggedPackets],
      explanation,
      wireStatus,
    });
  };

  const cIsn = Number(clientIsn) || 1000;
  const sIsn = Number(serverIsn) || 5000;
  const reqLen = dataPayload.length;
  const resLen = responsePayload.length;

  if (scenario === 'handshake') {
    // Initial State
    addStep({
      title: 'Initial State: Closed & Listening',
      description: 'The Client is in CLOSED state. The Server has bound a socket and is in LISTEN state waiting for incoming connections.',
      clientState: 'CLOSED',
      serverState: 'LISTEN',
      wireStatus: 'idle',
      explanation: 'Before communication starts, Server opens port 80/443 in passive open (LISTEN). Client initiates active open.',
    });

    // Step 1: SYN
    const synPacket = {
      from: 'client',
      to: 'server',
      type: 'SYN',
      flags: { SYN: 1, ACK: 0, PSH: 0, FIN: 0, RST: 0 },
      seq: cIsn,
      ack: 0,
      length: 0,
      windowSize: 65535,
      summary: `SYN [Seq=${cIsn}, Len=0, Win=65535]`,
      isDropped: false,
    };
    addStep({
      title: 'Step 1: Client sends SYN segment',
      description: `Client generates an Initial Sequence Number (ISN = ${cIsn}) and sends a SYN packet to Server. Client transitions to SYN_SENT.`,
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      activePacket: synPacket,
      wireStatus: 'transmitting',
      explanation: 'SYN flag is set to 1. Even though payload length is 0, SYN consumes 1 sequence number in the sequence space.',
    });

    // Step 2: SYN-ACK
    const synAckPacket = {
      from: 'server',
      to: 'client',
      type: 'SYN-ACK',
      flags: { SYN: 1, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
      seq: sIsn,
      ack: cIsn + 1,
      length: 0,
      windowSize: 65535,
      summary: `SYN, ACK [Seq=${sIsn}, Ack=${cIsn + 1}, Len=0]`,
      isDropped: false,
    };
    addStep({
      title: 'Step 2: Server responds with SYN-ACK',
      description: `Server acknowledges client SYN by setting Ack=${cIsn + 1} and sends its own ISN (Seq=${sIsn}). Server transitions to SYN_RCVD.`,
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      activePacket: synAckPacket,
      wireStatus: 'transmitting',
      explanation: 'Server validates Client ISN and increments it (Ack = Client_ISN + 1). Server also synchronizes its own sequence space.',
    });

    // Step 3: ACK
    const ackPacket = {
      from: 'client',
      to: 'server',
      type: 'ACK',
      flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
      seq: cIsn + 1,
      ack: sIsn + 1,
      length: 0,
      windowSize: 65535,
      summary: `ACK [Seq=${cIsn + 1}, Ack=${sIsn + 1}, Len=0]`,
      isDropped: false,
    };
    addStep({
      title: 'Step 3: Client sends ACK acknowledgment',
      description: `Client acknowledges server SYN by sending Ack=${sIsn + 1} with Seq=${cIsn + 1}. Both endpoints are now in ESTABLISHED state!`,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      activePacket: ackPacket,
      wireStatus: 'established',
      explanation: 'Full-duplex TCP virtual circuit is established. Both Client and Server can now exchange bidirectional application data.',
    });
  } else if (scenario === 'full_session') {
    // Handshake
    addStep({
      title: 'Initial State: Ready for Connection',
      description: 'Client is CLOSED, Server is in LISTEN state.',
      clientState: 'CLOSED',
      serverState: 'LISTEN',
      wireStatus: 'idle',
      explanation: 'Server is passively listening for connections on designated port.',
    });

    // 1. SYN
    addStep({
      title: '1. Handshake: Client sends SYN',
      description: `Client sends SYN with Seq=${cIsn}. Transitions to SYN_SENT.`,
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'SYN',
        flags: { SYN: 1, ACK: 0, PSH: 0, FIN: 0, RST: 0 },
        seq: cIsn,
        ack: 0,
        length: 0,
        windowSize: 65535,
        summary: `SYN [Seq=${cIsn}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'Client initiates connection handshake.',
    });

    // 2. SYN-ACK
    addStep({
      title: '2. Handshake: Server responds SYN-ACK',
      description: `Server sends SYN-ACK with Seq=${sIsn}, Ack=${cIsn + 1}. Transitions to SYN_RCVD.`,
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      activePacket: {
        from: 'server',
        to: 'client',
        type: 'SYN-ACK',
        flags: { SYN: 1, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: sIsn,
        ack: cIsn + 1,
        length: 0,
        windowSize: 65535,
        summary: `SYN, ACK [Seq=${sIsn}, Ack=${cIsn + 1}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'Server synchronizes its sequence space and acknowledges Client.',
    });

    // 3. ACK
    addStep({
      title: '3. Handshake: Client sends ACK (Connection ESTABLISHED)',
      description: `Client confirms connection with Ack=${sIsn + 1}. Both endpoints are now ESTABLISHED.`,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'ACK',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: cIsn + 1,
        ack: sIsn + 1,
        length: 0,
        windowSize: 65535,
        summary: `ACK [Seq=${cIsn + 1}, Ack=${sIsn + 1}]`,
      },
      wireStatus: 'established',
      explanation: 'Handshake complete. Stream is ready for HTTP payload.',
    });

    // 4. Client Data (HTTP GET)
    addStep({
      title: '4. Data Transfer: Client sends HTTP Request',
      description: `Client sends "${dataPayload}" (${reqLen} bytes). Seq=${cIsn + 1}, Ack=${sIsn + 1}.`,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'DATA',
        flags: { SYN: 0, ACK: 1, PSH: 1, FIN: 0, RST: 0 },
        seq: cIsn + 1,
        ack: sIsn + 1,
        length: reqLen,
        windowSize: 65535,
        payload: dataPayload,
        summary: `PSH, ACK [Seq=${cIsn + 1}, Ack=${sIsn + 1}, Len=${reqLen}] "${dataPayload}"`,
      },
      wireStatus: 'transmitting',
      explanation: 'PSH (Push) flag indicates receiver should push data immediately to application layer.',
    });

    // 5. Server Response Data
    addStep({
      title: '5. Data Transfer: Server sends HTTP Response + ACK',
      description: `Server acknowledges client request with Ack=${cIsn + 1 + reqLen} and returns response (${resLen} bytes).`,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      activePacket: {
        from: 'server',
        to: 'client',
        type: 'DATA',
        flags: { SYN: 0, ACK: 1, PSH: 1, FIN: 0, RST: 0 },
        seq: sIsn + 1,
        ack: cIsn + 1 + reqLen,
        length: resLen,
        windowSize: 64240,
        payload: responsePayload,
        summary: `PSH, ACK [Seq=${sIsn + 1}, Ack=${cIsn + 1 + reqLen}, Len=${resLen}] "${responsePayload}"`,
      },
      wireStatus: 'transmitting',
      explanation: 'Acknowledgment number advances by the exact number of data bytes received (Seq + Length).',
    });

    // 6. Client Acknowledges Server Data
    addStep({
      title: '6. Client Acknowledges Response Data',
      description: `Client confirms receipt of server response data with Ack=${sIsn + 1 + resLen}.`,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'ACK',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: cIsn + 1 + reqLen,
        ack: sIsn + 1 + resLen,
        length: 0,
        windowSize: 65535,
        summary: `ACK [Seq=${cIsn + 1 + reqLen}, Ack=${sIsn + 1 + resLen}]`,
      },
      wireStatus: 'established',
      explanation: 'All bytes safely delivered and acknowledged without loss.',
    });

    // 7. Teardown: Client sends FIN
    addStep({
      title: '7. Teardown: Client initiates close with FIN',
      description: `Client finishes sending data and sends FIN segment. Client transitions to FIN_WAIT_1.`,
      clientState: 'FIN_WAIT_1',
      serverState: 'ESTABLISHED',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'FIN',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 1, RST: 0 },
        seq: cIsn + 1 + reqLen,
        ack: sIsn + 1 + resLen,
        length: 0,
        windowSize: 65535,
        summary: `FIN, ACK [Seq=${cIsn + 1 + reqLen}, Ack=${sIsn + 1 + resLen}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'FIN flag consumes 1 sequence number. Client enters half-closed state.',
    });

    // 8. Teardown: Server ACK
    addStep({
      title: '8. Teardown: Server acknowledges FIN',
      description: `Server sends ACK for Client FIN (Ack=${cIsn + 2 + reqLen}). Client transitions to FIN_WAIT_2, Server enters CLOSE_WAIT.`,
      clientState: 'FIN_WAIT_2',
      serverState: 'CLOSE_WAIT',
      activePacket: {
        from: 'server',
        to: 'client',
        type: 'ACK',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: sIsn + 1 + resLen,
        ack: cIsn + 2 + reqLen,
        length: 0,
        windowSize: 64240,
        summary: `ACK [Seq=${sIsn + 1 + resLen}, Ack=${cIsn + 2 + reqLen}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'Client will no longer send data, but can still receive data if Server has pending writes.',
    });

    // 9. Teardown: Server sends FIN
    addStep({
      title: '9. Teardown: Server sends FIN',
      description: `Server completes pending tasks and sends its own FIN. Server enters LAST_ACK. Client enters TIME_WAIT.`,
      clientState: 'TIME_WAIT',
      serverState: 'LAST_ACK',
      activePacket: {
        from: 'server',
        to: 'client',
        type: 'FIN',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 1, RST: 0 },
        seq: sIsn + 1 + resLen,
        ack: cIsn + 2 + reqLen,
        length: 0,
        windowSize: 64240,
        summary: `FIN, ACK [Seq=${sIsn + 1 + resLen}, Ack=${cIsn + 2 + reqLen}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'Server asks to close its side of the connection.',
    });

    // 10. Teardown: Client Final ACK
    addStep({
      title: '10. Teardown: Client sends Final ACK (Session Closed)',
      description: `Client sends final ACK (${sIsn + 2 + resLen}). Server closes immediately. Client stays in TIME_WAIT for 2*MSL before fully closing.`,
      clientState: 'TIME_WAIT (2MSL)',
      serverState: 'CLOSED',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'ACK',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: cIsn + 2 + reqLen,
        ack: sIsn + 2 + resLen,
        length: 0,
        windowSize: 65535,
        summary: `ACK [Seq=${cIsn + 2 + reqLen}, Ack=${sIsn + 2 + resLen}]`,
      },
      wireStatus: 'idle',
      explanation: '2MSL (Maximum Segment Lifetime) ensures final ACK reached Server before port is recycled.',
    });
  } else if (scenario === 'packet_drop') {
    // Dropped packet scenario
    addStep({
      title: 'Initial State: Ready',
      description: 'Client is CLOSED, Server is in LISTEN state.',
      clientState: 'CLOSED',
      serverState: 'LISTEN',
      wireStatus: 'idle',
      explanation: 'Initial connection setup.',
    });

    // Step 1: SYN (Dropped in transit)
    addStep({
      title: 'Step 1: Client sends SYN segment (LOST IN TRANSIT ❌)',
      description: `Client sends SYN with Seq=${cIsn}. Due to network congestion or buffer overflow, the packet is DROPPED.`,
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'SYN',
        flags: { SYN: 1, ACK: 0, PSH: 0, FIN: 0, RST: 0 },
        seq: cIsn,
        ack: 0,
        length: 0,
        windowSize: 65535,
        summary: `SYN [Seq=${cIsn}] (DROPPED)`,
        isDropped: true,
      },
      wireStatus: 'dropped',
      explanation: 'TCP sets a Retransmission Timeout (RTO) timer. Server never received the packet, so no SYN-ACK is returned.',
    });

    // Step 2: Timer expiry & Retransmission
    addStep({
      title: 'Step 2: RTO Timer Expires -> Client Retransmits SYN 🔄',
      description: `Retransmission timer expires at Client. Client automatically retransmits the SYN segment with the same Seq=${cIsn}.`,
      clientState: 'SYN_SENT (Retrying)',
      serverState: 'LISTEN',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'SYN',
        flags: { SYN: 1, ACK: 0, PSH: 0, FIN: 0, RST: 0 },
        seq: cIsn,
        ack: 0,
        length: 0,
        windowSize: 65535,
        summary: `[Retransmission] SYN [Seq=${cIsn}]`,
        isDropped: false,
      },
      wireStatus: 'transmitting',
      explanation: 'TCP guarantees reliable delivery through sequence tracking and automatic repeat requests (ARQ).',
    });

    // Step 3: Server SYN-ACK
    addStep({
      title: 'Step 3: Server receives retransmitted SYN and replies with SYN-ACK',
      description: `Server successfully receives the retransmitted SYN and returns SYN-ACK with Ack=${cIsn + 1}.`,
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      activePacket: {
        from: 'server',
        to: 'client',
        type: 'SYN-ACK',
        flags: { SYN: 1, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: sIsn,
        ack: cIsn + 1,
        length: 0,
        windowSize: 65535,
        summary: `SYN, ACK [Seq=${sIsn}, Ack=${cIsn + 1}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'The lost segment is recovered seamlessly without application intervention.',
    });

    // Step 4: Final ACK
    addStep({
      title: 'Step 4: Client ACK -> Connection ESTABLISHED',
      description: `Client sends final ACK=${sIsn + 1}. Connection is established!`,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'ACK',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: cIsn + 1,
        ack: sIsn + 1,
        length: 0,
        windowSize: 65535,
        summary: `ACK [Seq=${cIsn + 1}, Ack=${sIsn + 1}]`,
      },
      wireStatus: 'established',
      explanation: 'Connection successfully established after automatic error recovery.',
    });
  } else if (scenario === 'teardown') {
    // Teardown
    addStep({
      title: 'Active Connection (ESTABLISHED)',
      description: 'Both Client and Server are currently in ESTABLISHED state.',
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      wireStatus: 'established',
      explanation: 'Data transmission is complete, initiating termination handshake.',
    });

    // 1. Client FIN
    addStep({
      title: '1. Client sends FIN segment',
      description: `Client issues close() socket call and sends FIN segment (Seq=${cIsn + 100}). Client enters FIN_WAIT_1.`,
      clientState: 'FIN_WAIT_1',
      serverState: 'ESTABLISHED',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'FIN',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 1, RST: 0 },
        seq: cIsn + 100,
        ack: sIsn + 200,
        length: 0,
        windowSize: 65535,
        summary: `FIN, ACK [Seq=${cIsn + 100}, Ack=${sIsn + 200}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'Client signals it has no more data to send in this direction.',
    });

    // 2. Server ACK
    addStep({
      title: '2. Server sends ACK for Client FIN',
      description: `Server acknowledges FIN (Ack=${cIsn + 101}). Server enters CLOSE_WAIT, Client enters FIN_WAIT_2.`,
      clientState: 'FIN_WAIT_2',
      serverState: 'CLOSE_WAIT',
      activePacket: {
        from: 'server',
        to: 'client',
        type: 'ACK',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: sIsn + 200,
        ack: cIsn + 101,
        length: 0,
        windowSize: 64240,
        summary: `ACK [Seq=${sIsn + 200}, Ack=${cIsn + 101}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'Server notifies operating system application to close remaining socket descriptors.',
    });

    // 3. Server FIN
    addStep({
      title: '3. Server sends its own FIN segment',
      description: `Server sends FIN to close its direction (Seq=${sIsn + 200}). Server enters LAST_ACK, Client enters TIME_WAIT.`,
      clientState: 'TIME_WAIT',
      serverState: 'LAST_ACK',
      activePacket: {
        from: 'server',
        to: 'client',
        type: 'FIN',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 1, RST: 0 },
        seq: sIsn + 200,
        ack: cIsn + 101,
        length: 0,
        windowSize: 64240,
        summary: `FIN, ACK [Seq=${sIsn + 200}, Ack=${cIsn + 101}]`,
      },
      wireStatus: 'transmitting',
      explanation: 'Server initiates closure of the reverse direction.',
    });

    // 4. Client Final ACK
    addStep({
      title: '4. Client sends Final ACK segment',
      description: `Client acknowledges Server FIN (Ack=${sIsn + 201}). Server transitions to CLOSED. Client enters 2*MSL TIME_WAIT.`,
      clientState: 'TIME_WAIT',
      serverState: 'CLOSED',
      activePacket: {
        from: 'client',
        to: 'server',
        type: 'ACK',
        flags: { SYN: 0, ACK: 1, PSH: 0, FIN: 0, RST: 0 },
        seq: cIsn + 101,
        ack: sIsn + 201,
        length: 0,
        windowSize: 65535,
        summary: `ACK [Seq=${cIsn + 101}, Ack=${sIsn + 201}]`,
      },
      wireStatus: 'idle',
      explanation: 'Connection is closed cleanly on both endpoints without data corruption.',
    });
  }

  return {
    scenario,
    totalSteps: steps.length,
    steps,
  };
}

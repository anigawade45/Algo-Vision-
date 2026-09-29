/**
 * IPv4 Subnetting & CIDR Calculation Engine
 */

export function ipToNumber(ipStr) {
  const octets = ipStr.split('.').map(Number);
  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
    return null;
  }
  return ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
}

export function numberToIp(num) {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

export function numberToBinaryOctets(num) {
  return [
    ((num >>> 24) & 255).toString(2).padStart(8, '0'),
    ((num >>> 16) & 255).toString(2).padStart(8, '0'),
    ((num >>> 8) & 255).toString(2).padStart(8, '0'),
    (num & 255).toString(2).padStart(8, '0'),
  ];
}

export function cidrToMaskNum(cidr) {
  if (cidr === 0) return 0;
  return ((0xffffffff << (32 - cidr)) >>> 0);
}

export function getIpClass(firstOctet) {
  if (firstOctet >= 1 && firstOctet <= 126) return { class: 'Class A', defaultMask: '/8', defaultMaskStr: '255.0.0.0' };
  if (firstOctet === 127) return { class: 'Loopback', defaultMask: '/8', defaultMaskStr: '255.0.0.0' };
  if (firstOctet >= 128 && firstOctet <= 191) return { class: 'Class B', defaultMask: '/16', defaultMaskStr: '255.255.0.0' };
  if (firstOctet >= 192 && firstOctet <= 223) return { class: 'Class C', defaultMask: '/24', defaultMaskStr: '255.255.255.0' };
  if (firstOctet >= 224 && firstOctet <= 239) return { class: 'Class D (Multicast)', defaultMask: 'N/A', defaultMaskStr: 'N/A' };
  return { class: 'Class E (Experimental)', defaultMask: 'N/A', defaultMaskStr: 'N/A' };
}

export function isPrivateIp(ipNum) {
  const ipStr = numberToIp(ipNum);
  const octets = ipStr.split('.').map(Number);
  // 10.0.0.0/8
  if (octets[0] === 10) return 'Private (RFC 1918 - Class A)';
  // 172.16.0.0/12
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return 'Private (RFC 1918 - Class B)';
  // 192.168.0.0/16
  if (octets[0] === 192 && octets[1] === 168) return 'Private (RFC 1918 - Class C)';
  // 127.0.0.0/8
  if (octets[0] === 127) return 'Loopback Address';
  // 169.254.0.0/16 (APIPA)
  if (octets[0] === 169 && octets[1] === 254) return 'APIPA (Link-Local)';
  return 'Public Routable IP';
}

export function calculateSubnetDetails(ipString = '192.168.1.50', cidr = 24) {
  const ipNum = ipToNumber(ipString.trim());
  if (ipNum === null) {
    return { error: 'Invalid IPv4 address format. Please enter a valid address (e.g. 192.168.1.1)' };
  }

  const cidrVal = Math.min(32, Math.max(1, Number(cidr) || 24));
  const maskNum = cidrToMaskNum(cidrVal);
  const wildcardNum = (~maskNum) >>> 0;
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | wildcardNum) >>> 0;

  const totalHosts = Math.pow(2, 32 - cidrVal);
  const usableHosts = cidrVal >= 31 ? 0 : Math.max(0, totalHosts - 2);

  const firstUsableNum = cidrVal >= 31 ? networkNum : networkNum + 1;
  const lastUsableNum = cidrVal >= 31 ? broadcastNum : broadcastNum - 1;

  const firstOctet = (ipNum >>> 24) & 255;
  const classInfo = getIpClass(firstOctet);
  const ipType = isPrivateIp(ipNum);

  const ipBinary = numberToBinaryOctets(ipNum);
  const maskBinary = numberToBinaryOctets(maskNum);
  const netBinary = numberToBinaryOctets(networkNum);

  return {
    ip: ipString,
    cidr: cidrVal,
    subnetMask: numberToIp(maskNum),
    wildcardMask: numberToIp(wildcardNum),
    networkAddress: numberToIp(networkNum),
    broadcastAddress: numberToIp(broadcastNum),
    firstUsableHost: numberToIp(firstUsableNum),
    lastUsableHost: numberToIp(lastUsableNum),
    totalHosts,
    usableHosts,
    ipClass: classInfo.class,
    defaultMask: classInfo.defaultMask,
    ipType,
    ipBinary,
    maskBinary,
    netBinary,
    networkBits: cidrVal,
    hostBits: 32 - cidrVal,
  };
}

export function generateSubnetDivisions(baseIp = '192.168.1.0', parentCidr = 24, newCidr = 26) {
  const baseNum = ipToNumber(baseIp);
  if (baseNum === null || newCidr <= parentCidr) return [];

  const parentMask = cidrToMaskNum(parentCidr);
  const baseNetNum = (baseNum & parentMask) >>> 0;

  const numSubnets = Math.pow(2, newCidr - parentCidr);
  const blockSize = Math.pow(2, 32 - newCidr);

  const subnets = [];
  const limit = Math.min(numSubnets, 16); // Limit to 16 rows for clean UI

  for (let i = 0; i < limit; i++) {
    const net = (baseNetNum + i * blockSize) >>> 0;
    const bcast = (net + blockSize - 1) >>> 0;
    const first = newCidr >= 31 ? net : net + 1;
    const last = newCidr >= 31 ? bcast : bcast - 1;

    subnets.push({
      index: i + 1,
      network: numberToIp(net) + `/${newCidr}`,
      range: `${numberToIp(first)} - ${numberToIp(last)}`,
      broadcast: numberToIp(bcast),
      usableHosts: newCidr >= 31 ? 0 : blockSize - 2,
    });
  }

  return subnets;
}

export function testSameSubnet(ipA, ipB, cidr) {
  const numA = ipToNumber(ipA);
  const numB = ipToNumber(ipB);
  if (numA === null || numB === null) return null;

  const mask = cidrToMaskNum(cidr);
  const netA = (numA & mask) >>> 0;
  const netB = (numB & mask) >>> 0;

  const isSame = netA === netB;
  return {
    isSame,
    netA: numberToIp(netA),
    netB: numberToIp(netB),
    verdict: isSame
      ? 'Same Local Subnet: Direct Layer 2 ARP delivery without routing.'
      : 'Different Subnets: Requires Layer 3 Default Gateway Router to forward packets.',
  };
}

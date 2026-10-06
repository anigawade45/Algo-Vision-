import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import CnHome from './pages/CnHome';
import NetworkFundamentals from './pages/NetworkFundamentals';
import NetworkTopologies from './pages/NetworkTopologies';
import OsiLayers from './pages/OsiLayers';
import IpSubnetting from './pages/IpSubnetting';
import RoutingProtocols from './pages/RoutingProtocols';
import TransportLayer from './pages/TransportLayer';
import NetworkProtocols from './pages/NetworkProtocols';
import PacketTransmission from './pages/PacketTransmission';

export const cnRoutes = (
  <>
    <Route path="/cn" element={<CnHome />} />
    <Route path="/cn/fundamentals" element={<NetworkFundamentals />} />
    <Route path="/cn/network-fundamentals" element={<Navigate to="/cn/fundamentals" replace />} />
    <Route path="/cn/topologies" element={<NetworkTopologies />} />
    <Route path="/cn/network-topologies" element={<Navigate to="/cn/topologies" replace />} />
    <Route path="/cn/topology" element={<Navigate to="/cn/topologies" replace />} />
    <Route path="/cn/packets" element={<PacketTransmission />} />
    <Route path="/cn/packet-transmission" element={<Navigate to="/cn/packets" replace />} />
    <Route path="/cn/packet" element={<Navigate to="/cn/packets" replace />} />
    <Route path="/cn/transport" element={<TransportLayer />} />
    <Route path="/cn/transport-layer" element={<Navigate to="/cn/transport" replace />} />
    <Route path="/cn/tcp-handshake" element={<Navigate to="/cn/transport" replace />} />
    <Route path="/cn/osi-layers" element={<OsiLayers />} />
    <Route path="/cn/ip-subnetting" element={<IpSubnetting />} />
    <Route path="/cn/routing-protocols" element={<RoutingProtocols />} />
    <Route path="/cn/protocols" element={<NetworkProtocols />} />
    <Route path="/cn/network-protocols" element={<Navigate to="/cn/protocols" replace />} />
  </>
);

export default cnRoutes;


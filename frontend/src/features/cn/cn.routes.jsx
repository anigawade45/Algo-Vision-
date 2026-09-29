import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import CnHome from './pages/CnHome';
import NetworkFundamentals from './pages/NetworkFundamentals';
import NetworkTopologies from './pages/NetworkTopologies';
import OsiLayers from './pages/OsiLayers';
import IpSubnetting from './pages/IpSubnetting';
import RoutingProtocols from './pages/RoutingProtocols';

export const cnRoutes = (
  <>
    <Route path="/cn" element={<CnHome />} />
    <Route path="/cn/fundamentals" element={<NetworkFundamentals />} />
    <Route path="/cn/network-fundamentals" element={<Navigate to="/cn/fundamentals" replace />} />
    <Route path="/cn/topologies" element={<NetworkTopologies />} />
    <Route path="/cn/network-topologies" element={<Navigate to="/cn/topologies" replace />} />
    <Route path="/cn/topology" element={<Navigate to="/cn/topologies" replace />} />
    <Route path="/cn/tcp-handshake" element={<Navigate to="/cn/fundamentals" replace />} />
    <Route path="/cn/osi-layers" element={<OsiLayers />} />
    <Route path="/cn/ip-subnetting" element={<IpSubnetting />} />
    <Route path="/cn/routing-protocols" element={<RoutingProtocols />} />
  </>
);

export default cnRoutes;

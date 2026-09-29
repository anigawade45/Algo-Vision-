import React from 'react';
import { Route } from 'react-router-dom';
import CnHome from './pages/CnHome';
import TcpHandshake from './pages/TcpHandshake';
import OsiLayers from './pages/OsiLayers';
import IpSubnetting from './pages/IpSubnetting';
import RoutingProtocols from './pages/RoutingProtocols';

export const cnRoutes = (
  <>
    <Route path="/cn" element={<CnHome />} />
    <Route path="/cn/tcp-handshake" element={<TcpHandshake />} />
    <Route path="/cn/osi-layers" element={<OsiLayers />} />
    <Route path="/cn/ip-subnetting" element={<IpSubnetting />} />
    <Route path="/cn/routing-protocols" element={<RoutingProtocols />} />
  </>
);

export default cnRoutes;

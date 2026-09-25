import React from 'react';
import { Route } from 'react-router-dom';
import OsHome from './pages/OsHome';
import CpuScheduling from './pages/CpuScheduling';

export const osRoutes = (
  <>
    <Route path="/os" element={<OsHome />} />
    <Route path="/os/cpu-scheduling" element={<CpuScheduling />} />
  </>
);

export default osRoutes;

import React from 'react';
import { Route } from 'react-router-dom';
import OsHome from './pages/OsHome';
import CpuScheduling from './pages/CpuScheduling';
import OsFundamentals from './pages/OsFundamentals';

export const osRoutes = (
  <>
    <Route path="/os" element={<OsHome />} />
    <Route path="/os/fundamentals" element={<OsFundamentals />} />
    <Route path="/os/cpu-scheduling" element={<CpuScheduling />} />
  </>
);

export default osRoutes;

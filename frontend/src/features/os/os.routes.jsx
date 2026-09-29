import React from 'react';
import { Route } from 'react-router-dom';
import OsHome from './pages/OsHome';
import CpuScheduling from './pages/CpuScheduling';
import OsFundamentals from './pages/OsFundamentals';
import ProcessManagement from './pages/ProcessManagement';
import Deadlocks from './pages/Deadlocks';

export const osRoutes = (
  <>
    <Route path="/os" element={<OsHome />} />
    <Route path="/os/fundamentals" element={<OsFundamentals />} />
    <Route path="/os/process-management" element={<ProcessManagement />} />
    <Route path="/os/deadlocks" element={<Deadlocks />} />
    <Route path="/os/cpu-scheduling" element={<CpuScheduling />} />
  </>
);

export default osRoutes;

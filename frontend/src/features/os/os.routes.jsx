import React from 'react';
import { Route } from 'react-router-dom';
import CpuScheduling from './pages/CpuScheduling';

// Export route elements for the OS features
export const osRoutes = (
  <>
    <Route path="/os/cpu-scheduling" element={<CpuScheduling />} />
  </>
);

export default osRoutes;

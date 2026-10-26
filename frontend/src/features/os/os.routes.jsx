import { Route } from 'react-router-dom';
import OsHome from './pages/OsHome';
import CpuScheduling from './pages/CpuScheduling';
import OsFundamentals from './pages/OsFundamentals';
import ProcessManagement from './pages/ProcessManagement';
import Deadlocks from './pages/Deadlocks';
import BankersAlgorithm from './pages/BankersAlgorithm';
import ProcessSynchronization from './pages/ProcessSynchronization';
import MemoryManagement from './pages/MemoryManagement';
import PagingSegmentation from './pages/PagingSegmentation';
import PageReplacement from './pages/PageReplacement';
import DiskScheduling from './pages/DiskScheduling';

export const osRoutes = (
  <>
    <Route path="/os" element={<OsHome />} />
    <Route path="/os/fundamentals" element={<OsFundamentals />} />
    <Route path="/os/process-management" element={<ProcessManagement />} />
    <Route path="/os/process-synchronization" element={<ProcessSynchronization />} />
    <Route path="/os/memory-management" element={<MemoryManagement />} />
    <Route path="/os/paging-segmentation" element={<PagingSegmentation />} />
    <Route path="/os/page-replacement" element={<PageReplacement />} />
    <Route path="/os/disk-scheduling" element={<DiskScheduling />} />
    <Route path="/os/deadlocks" element={<Deadlocks />} />
    <Route path="/os/bankers-algorithm" element={<BankersAlgorithm />} />
    <Route path="/os/cpu-scheduling" element={<CpuScheduling />} />
  </>
);

export default osRoutes;

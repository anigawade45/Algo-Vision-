import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';

import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute';
import NotFoundPage from '@/components/NotFoundPage';

import { LandingPage } from '@/features/landing/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import VerifyEmailSentPage from '@/features/auth/pages/VerifyEmailSentPage';
import VerifyEmailPage from '@/features/auth/pages/VerifyEmailPage';

import DashboardPage from '@/features/dashboard/DashboardPage';
import { ModuleDetailsPage } from '@/features/dashboard/components/ModuleDetailsPage';

import DsaHome from '@/features/dsa/pages/DsaHome';
import ProblemSubmit from '@/features/dsa/pages/ProblemSubmit';
import ProblemWorkspace from '@/features/dsa/pages/ProblemWorkspace';
import ProblemHistory from '@/features/dsa/pages/ProblemHistory';
import SavedProblems from '@/features/dsa/pages/SavedProblems';
import MyProblems from '@/features/dsa/pages/MyProblems';

import CpuScheduling from '@/features/os/pages/CpuScheduling';
import OsHome from '@/features/os/pages/OsHome';
import OsFundamentals from '@/features/os/pages/OsFundamentals';
import ProcessManagement from '@/features/os/pages/ProcessManagement';
import Deadlocks from '@/features/os/pages/Deadlocks';
import BankersAlgorithm from '@/features/os/pages/BankersAlgorithm';
import ProcessSynchronization from '@/features/os/pages/ProcessSynchronization';
import MemoryManagement from '@/features/os/pages/MemoryManagement';
import PagingSegmentation from '@/features/os/pages/PagingSegmentation';
import PageReplacement from '@/features/os/pages/PageReplacement';
import DiskScheduling from '@/features/os/pages/DiskScheduling';

import CnHome from '@/features/cn/pages/CnHome';
import NetworkFundamentals from '@/features/cn/pages/NetworkFundamentals';
import NetworkTopologies from '@/features/cn/pages/NetworkTopologies';
import OsiLayers from '@/features/cn/pages/OsiLayers';
import IpSubnetting from '@/features/cn/pages/IpSubnetting';
import RoutingProtocols from '@/features/cn/pages/RoutingProtocols';
import TransportLayer from '@/features/cn/pages/TransportLayer';
import NetworkProtocols from '@/features/cn/pages/NetworkProtocols';
import PacketTransmission from '@/features/cn/pages/PacketTransmission';
import SystemDesignHome from '@/features/systemdesign/pages/SystemDesignHome';
import SystemDesignBasics from '@/features/systemdesign/pages/SystemDesignBasics';
import LoadBalancing from '@/features/systemdesign/pages/LoadBalancing';
import Caching from '@/features/systemdesign/pages/Caching';
import Scaling from '@/features/systemdesign/pages/Scaling';
import MessageQueues from '@/features/systemdesign/pages/MessageQueues';
import RateLimiting from '@/features/systemdesign/pages/RateLimiting';
import { AiMentorProvider, AiMentorWidget, AiMentorDrawer } from '@/features/ai-mentor';

function DsaHomeRoute({ theme, toggleTheme, setActiveProblem }) {
  const navigate = useNavigate();
  return (
    <DsaHome
      theme={theme}
      toggleTheme={toggleTheme}
      onNavigateToLanding={() => navigate('/')}
      onNavigateToSubmit={() => navigate('/dsa/problem/new')}
      onNavigateToWorkspace={(problem) => {
        if (problem) setActiveProblem(problem);
        const problemId = problem?.id || 'two-sum';
        navigate(`/dsa/workspace/${problemId}`);
      }}
    />
  );
}

function ProblemSubmitRoute({ theme, toggleTheme, setActiveProblem }) {
  const navigate = useNavigate();
  return (
    <ProblemSubmit
      theme={theme}
      toggleTheme={toggleTheme}
      onNavigateToLanding={() => navigate('/')}
      onNavigateToHome={() => navigate('/dsa')}
      onNavigateToWorkspace={(problem) => {
        if (problem) setActiveProblem(problem);
        const problemId = problem?.slug || problem?.problemId || problem?.id || 'two-sum';
        navigate(`/dsa/workspace/${problemId}`);
      }}
    />
  );
}

function ProblemWorkspaceRoute({ theme, toggleTheme, activeProblem }) {
  const navigate = useNavigate();
  return (
    <ProblemWorkspace
      theme={theme}
      toggleTheme={toggleTheme}
      problemData={activeProblem}
      onNavigateToHome={() => navigate('/dsa')}
      onNavigateToSubmit={() => navigate('/dsa/problem/new')}
    />
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [activeProblem, setActiveProblem] = useState(null);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <Router>
          <AiMentorProvider>
            <AiMentorWidget />
            <AiMentorDrawer />
            <Routes>
              {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />
            
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage theme={theme} />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage theme={theme} />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/verify-email-sent"
              element={
                <PublicOnlyRoute>
                  <VerifyEmailSentPage />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/verify-email/:token"
              element={
                <PublicOnlyRoute>
                  <VerifyEmailPage />
                </PublicOnlyRoute>
              }
            />

            {/* PROTECTED AUTHENTICATED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            {/* DSA MODULE ROUTES */}
            <Route
              path="/dsa"
              element={
                <ProtectedRoute>
                  <DsaHomeRoute theme={theme} toggleTheme={toggleTheme} setActiveProblem={setActiveProblem} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dsa/problem/new"
              element={
                <ProtectedRoute>
                  <ProblemSubmitRoute theme={theme} toggleTheme={toggleTheme} setActiveProblem={setActiveProblem} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dsa/submit"
              element={<Navigate to="/dsa/problem/new" replace />}
            />

            <Route
              path="/dsa/my-problems"
              element={
                <ProtectedRoute>
                  <MyProblems theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dsa/workspace/:id"
              element={
                <ProtectedRoute>
                  <ProblemWorkspaceRoute theme={theme} toggleTheme={toggleTheme} activeProblem={activeProblem} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dsa/workspace"
              element={<Navigate to="/dsa/workspace/two-sum" replace />}
            />

            <Route
              path="/dsa/history"
              element={
                <ProtectedRoute>
                  <ProblemHistory theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dsa/saved"
              element={
                <ProtectedRoute>
                  <SavedProblems theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            {/* OPERATING SYSTEMS MODULE ROUTES */}
            <Route
              path="/os"
              element={
                <ProtectedRoute>
                  <OsHome theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/fundamentals"
              element={
                <ProtectedRoute>
                  <OsFundamentals theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/process-management"
              element={
                <ProtectedRoute>
                  <ProcessManagement theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/deadlocks"
              element={
                <ProtectedRoute>
                  <Deadlocks theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/bankers-algorithm"
              element={
                <ProtectedRoute>
                  <BankersAlgorithm theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/process-synchronization"
              element={
                <ProtectedRoute>
                  <ProcessSynchronization theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/memory-management"
              element={
                <ProtectedRoute>
                  <MemoryManagement theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/paging-segmentation"
              element={
                <ProtectedRoute>
                  <PagingSegmentation theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/page-replacement"
              element={
                <ProtectedRoute>
                  <PageReplacement theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/page-replacement-algorithms"
              element={
                <ProtectedRoute>
                  <PageReplacement theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/disk-scheduling"
              element={
                <ProtectedRoute>
                  <DiskScheduling theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/disk-scheduling-algorithms"
              element={
                <ProtectedRoute>
                  <DiskScheduling theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/os/cpu-scheduling"
              element={
                <ProtectedRoute>
                  <CpuScheduling theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/modules/os"
              element={<Navigate to="/os" replace />}
            />

            <Route
              path="/modules/dsa"
              element={<Navigate to="/dsa" replace />}
            />

            <Route
              path="/modules/:moduleId"
              element={
                <ProtectedRoute>
                  <ModuleDetailsPage theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/modules/:moduleId"
              element={<Navigate to="/modules/:moduleId" replace />}
            />

            {/* COMPUTER NETWORKS MODULE ROUTES */}
            <Route
              path="/cn"
              element={
                <ProtectedRoute>
                  <CnHome theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/fundamentals"
              element={
                <ProtectedRoute>
                  <NetworkFundamentals theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/network-fundamentals"
              element={<Navigate to="/cn/fundamentals" replace />}
            />

            <Route
              path="/cn/topologies"
              element={
                <ProtectedRoute>
                  <NetworkTopologies theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/network-topologies"
              element={<Navigate to="/cn/topologies" replace />}
            />

            <Route
              path="/cn/topology"
              element={<Navigate to="/cn/topologies" replace />}
            />

            <Route
              path="/cn/transport"
              element={
                <ProtectedRoute>
                  <TransportLayer theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/transport-layer"
              element={<Navigate to="/cn/transport" replace />}
            />

            <Route
              path="/cn/tcp-handshake"
              element={<Navigate to="/cn/transport" replace />}
            />

            <Route
              path="/cn/osi-layers"
              element={
                <ProtectedRoute>
                  <OsiLayers theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/ip-subnetting"
              element={
                <ProtectedRoute>
                  <IpSubnetting theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/subnetting"
              element={<Navigate to="/cn/ip-subnetting" replace />}
            />

            <Route
              path="/cn/subnet"
              element={<Navigate to="/cn/ip-subnetting" replace />}
            />

            <Route
              path="/cn/routing-protocols"
              element={
                <ProtectedRoute>
                  <RoutingProtocols theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/protocols"
              element={
                <ProtectedRoute>
                  <NetworkProtocols theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/packets"
              element={
                <ProtectedRoute>
                  <PacketTransmission theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cn/packet-transmission"
              element={<Navigate to="/cn/packets" replace />}
            />

            <Route
              path="/cn/packet"
              element={<Navigate to="/cn/packets" replace />}
            />

            <Route
              path="/cn/network-protocols"
              element={<Navigate to="/cn/protocols" replace />}
            />

            <Route
              path="/cn/protocol"
              element={<Navigate to="/cn/protocols" replace />}
            />

            <Route
              path="/networks"
              element={<Navigate to="/cn" replace />}
            />

            <Route
              path="/modules/networks"
              element={<Navigate to="/cn" replace />}
            />

            {/* SYSTEM DESIGN MODULE ROUTES */}
            <Route
              path="/systemdesign"
              element={
                <ProtectedRoute>
                  <SystemDesignHome theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/systemdesign/fundamentals"
              element={
                <ProtectedRoute>
                  <SystemDesignBasics theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/systemdesign/load-balancing"
              element={
                <ProtectedRoute>
                  <LoadBalancing theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/systemdesign/loadbalancing"
              element={<Navigate to="/systemdesign/load-balancing" replace />}
            />

            <Route
              path="/systemdesign/lb"
              element={<Navigate to="/systemdesign/load-balancing" replace />}
            />

            <Route
              path="/systemdesign/caching"
              element={
                <ProtectedRoute>
                  <Caching theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/systemdesign/cache"
              element={<Navigate to="/systemdesign/caching" replace />}
            />

            <Route
              path="/systemdesign/redis"
              element={<Navigate to="/systemdesign/caching" replace />}
            />

            <Route
              path="/systemdesign/database-scaling"
              element={
                <ProtectedRoute>
                  <Scaling theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/systemdesign/scaling"
              element={<Navigate to="/systemdesign/database-scaling" replace />}
            />

            <Route
              path="/systemdesign/sharding"
              element={<Navigate to="/systemdesign/database-scaling" replace />}
            />

            <Route
              path="/systemdesign/replication"
              element={<Navigate to="/systemdesign/database-scaling" replace />}
            />

            <Route
              path="/systemdesign/database"
              element={<Navigate to="/systemdesign/database-scaling" replace />}
            />

            <Route
              path="/systemdesign/message-queues"
              element={
                <ProtectedRoute>
                  <MessageQueues theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/systemdesign/message-queue"
              element={<Navigate to="/systemdesign/message-queues" replace />}
            />

            <Route
              path="/systemdesign/queues"
              element={<Navigate to="/systemdesign/message-queues" replace />}
            />

            <Route
              path="/systemdesign/queue"
              element={<Navigate to="/systemdesign/message-queues" replace />}
            />

            <Route
              path="/systemdesign/kafka"
              element={<Navigate to="/systemdesign/message-queues" replace />}
            />

            <Route
              path="/systemdesign/rabbitmq"
              element={<Navigate to="/systemdesign/message-queues" replace />}
            />

            <Route
              path="/systemdesign/sqs"
              element={<Navigate to="/systemdesign/message-queues" replace />}
            />

            <Route
              path="/systemdesign/async"
              element={<Navigate to="/systemdesign/message-queues" replace />}
            />

            <Route
              path="/systemdesign/rate-limiting"
              element={
                <ProtectedRoute>
                  <RateLimiting theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/systemdesign/ratelimiting"
              element={<Navigate to="/systemdesign/rate-limiting" replace />}
            />

            <Route
              path="/systemdesign/rate-limiter"
              element={<Navigate to="/systemdesign/rate-limiting" replace />}
            />

            <Route
              path="/systemdesign/ratelimit"
              element={<Navigate to="/systemdesign/rate-limiting" replace />}
            />

            <Route
              path="/systemdesign/throttling"
              element={<Navigate to="/systemdesign/rate-limiting" replace />}
            />

            <Route
              path="/systemdesign/token-bucket"
              element={<Navigate to="/systemdesign/rate-limiting" replace />}
            />

            <Route
              path="/systemdesign/leaky-bucket"
              element={<Navigate to="/systemdesign/rate-limiting" replace />}
            />

            <Route
              path="/systemdesign/basics-client-server"
              element={<Navigate to="/systemdesign/fundamentals" replace />}
            />

            <Route
              path="/systemdesign/basics"
              element={<Navigate to="/systemdesign/fundamentals" replace />}
            />

            <Route
              path="/systemdesign/client-server"
              element={<Navigate to="/systemdesign/fundamentals" replace />}
            />

            <Route
              path="/system-design"
              element={<Navigate to="/systemdesign" replace />}
            />

            <Route
              path="/sysdesign"
              element={<Navigate to="/systemdesign" replace />}
            />

            <Route
              path="/sd"
              element={<Navigate to="/systemdesign" replace />}
            />

            <Route
              path="/modules/sysdesign"
              element={<Navigate to="/systemdesign" replace />}
            />

            <Route
              path="/modules/systemdesign"
              element={<Navigate to="/systemdesign" replace />}
            />

            <Route
              path="/quiz"
              element={<Navigate to="/dashboard?tab=quiz" replace />}
            />

            <Route
              path="/progress"
              element={<Navigate to="/dashboard?tab=progress" replace />}
            />

            <Route
              path="/notes"
              element={<Navigate to="/dashboard?tab=notes" replace />}
            />

            <Route
              path="/profile/settings"
              element={
                <ProtectedRoute>
                  <DashboardPage theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={<Navigate to="/profile/settings" replace />}
            />

            {/* UNKNOWN / 404 CATCH-ALL ROUTE */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AiMentorProvider>
      </Router>
      </AuthProvider>
    </MotionConfig>
  );
}

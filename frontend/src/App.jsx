import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';

import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute';
import NotFoundPage from '@/components/NotFoundPage';

import { LandingPage } from '@/features/landing/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';

import DashboardPage from '@/features/dashboard/DashboardPage';
import { ModuleDetailsPage } from '@/features/dashboard/components/ModuleDetailsPage';

import DsaHome from '@/features/dsa/pages/DsaHome';
import ProblemSubmit from '@/features/dsa/pages/ProblemSubmit';
import ProblemWorkspace from '@/features/dsa/pages/ProblemWorkspace';
import ProblemHistory from '@/features/dsa/pages/ProblemHistory';
import SavedProblems from '@/features/dsa/pages/SavedProblems';

import CpuScheduling from '@/features/os/pages/CpuScheduling';
import OsHome from '@/features/os/pages/OsHome';
import OsFundamentals from '@/features/os/pages/OsFundamentals';
import ProcessManagement from '@/features/os/pages/ProcessManagement';
import Deadlocks from '@/features/os/pages/Deadlocks';
import BankersAlgorithm from '@/features/os/pages/BankersAlgorithm';
import ProcessSynchronization from '@/features/os/pages/ProcessSynchronization';

import CnHome from '@/features/cn/pages/CnHome';
import NetworkFundamentals from '@/features/cn/pages/NetworkFundamentals';
import NetworkTopologies from '@/features/cn/pages/NetworkTopologies';
import OsiLayers from '@/features/cn/pages/OsiLayers';
import IpSubnetting from '@/features/cn/pages/IpSubnetting';
import RoutingProtocols from '@/features/cn/pages/RoutingProtocols';

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
        const problemId = problem?.id || 'two-sum';
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
              path="/cn/tcp-handshake"
              element={<Navigate to="/cn/fundamentals" replace />}
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
              path="/cn/routing-protocols"
              element={
                <ProtectedRoute>
                  <RoutingProtocols theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/networks"
              element={<Navigate to="/cn" replace />}
            />

            <Route
              path="/modules/networks"
              element={<Navigate to="/cn" replace />}
            />

            <Route
              path="/system-design"
              element={<Navigate to="/modules/sysdesign" replace />}
            />

            <Route
              path="/sysdesign"
              element={<Navigate to="/modules/sysdesign" replace />}
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
              path="/settings"
              element={<Navigate to="/dashboard?tab=settings" replace />}
            />

            {/* UNKNOWN / 404 CATCH-ALL ROUTE */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MotionConfig>
  );
}

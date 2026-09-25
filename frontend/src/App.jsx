import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/features/landing/LandingPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import { ModuleDetailsPage } from '@/features/dashboard/components/ModuleDetailsPage';

export default function App() {
  const [theme, setTheme] = useState('light');

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
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={<LandingPage theme={theme} toggleTheme={toggleTheme} />}
        />

        {/* Student Dashboard Main Route */}
        <Route
          path="/dashboard"
          element={<DashboardPage theme={theme} toggleTheme={toggleTheme} />}
        />

        {/* Core Modules Dedicated Pages */}
        <Route
          path="/modules/:moduleId"
          element={<ModuleDetailsPage theme={theme} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/dashboard/modules/:moduleId"
          element={<ModuleDetailsPage theme={theme} toggleTheme={toggleTheme} />}
        />

        {/* Friendly Module Aliases */}
        <Route
          path="/dsa"
          element={<Navigate to="/modules/dsa" replace />}
        />
        <Route
          path="/os"
          element={<Navigate to="/modules/os" replace />}
        />
        <Route
          path="/networks"
          element={<Navigate to="/modules/networks" replace />}
        />
        <Route
          path="/system-design"
          element={<Navigate to="/modules/sysdesign" replace />}
        />
        <Route
          path="/sysdesign"
          element={<Navigate to="/modules/sysdesign" replace />}
        />

        {/* Tools & Tab Shortcuts */}
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

        {/* Wildcard Fallback */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

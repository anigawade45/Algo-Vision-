import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DashboardNavbar } from './components/DashboardNavbar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { ContinueLearningCard } from './components/ContinueLearningCard';
import { CoreModulesGrid } from './components/CoreModulesGrid';
import { QuickActions } from './components/QuickActions';
import { AccountSettingsPage } from './components/AccountSettingsPage';
import { VisualizerModal } from './components/InteractiveModals';
import { useAiMentor } from '@/features/ai-mentor';

export default function DashboardPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { openDrawer } = useAiMentor();
  const activeTab = searchParams.get('tab');
  const isSettingsPage =
    location.pathname === '/profile/settings' ||
    location.pathname === '/settings' ||
    activeTab === 'settings';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [visualizerInitialModule, setVisualizerInitialModule] = useState('dsa');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, activeTab]);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleOpenVisualizer = (moduleId = 'dsa') => {
    setVisualizerInitialModule(moduleId);
    setIsVisualizerOpen(true);
  };

  const handleExploreModule = (moduleId) => {
    if (moduleId === 'dsa') {
      navigate('/dsa');
    } else if (moduleId === 'os') {
      navigate('/os');
    } else if (moduleId === 'networks' || moduleId === 'cn') {
      navigate('/cn');
    } else if (moduleId === 'sysdesign' || moduleId === 'systemdesign') {
      navigate('/systemdesign');
    } else {
      navigate(`/modules/${moduleId}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200 font-sans">
      {/* 1. Left Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onOpenAiMentor={openDrawer}
        onOpenVisualizer={handleOpenVisualizer}
      />

      {/* 2. Main Body Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Navbar Header */}
        <DashboardNavbar
          theme={theme}
          toggleTheme={toggleTheme}
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAiMentor={openDrawer}
          onSelectTopic={(topic) => {
            const mod = topic.module.toLowerCase().includes('os')
              ? 'os'
              : topic.module.toLowerCase().includes('network')
              ? 'networks'
              : topic.module.toLowerCase().includes('design')
              ? 'sysdesign'
              : 'dsa';
            handleOpenVisualizer(mod);
          }}
        />

        {/* Dashboard Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto space-y-8">
          {isSettingsPage ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Link
                  to="/dashboard"
                  className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </Link>
              </div>

              <AccountSettingsPage />
            </div>
          ) : (
            <>
              {/* Section 1: Welcome Banner */}
              <WelcomeBanner />

              {/* Section 2: Featured / Continue Learning Card */}
              <ContinueLearningCard onContinue={handleExploreModule} />

              {/* Section 3: Four Core Module Cards */}
              <CoreModulesGrid onExploreModule={handleExploreModule} />

              {/* Section 4: Quick Actions */}
              <QuickActions
                onOpenAiMentor={openDrawer}
                onOpenVisualizer={() => handleOpenVisualizer('dsa')}
              />
            </>
          )}
        </main>
      </div>

      {/* 3. Interactive Simulation Visualizer Modal */}
      <VisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        initialModule={visualizerInitialModule}
      />
    </div>
  );
}


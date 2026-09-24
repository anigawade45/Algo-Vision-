import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { Navbar } from '@/features/landing/components/Navbar';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { CoreDomainsSection } from '@/features/landing/components/CoreDomainsSection';
import { TrustStrip } from '@/features/landing/components/TrustStrip';
import { ProblemSection } from '@/features/landing/components/ProblemSection';
import { ModulesSection } from '@/features/landing/components/ModulesSection';
import { AiSection } from '@/features/landing/components/AiSection';
import { DifferentiatorSection } from '@/features/landing/components/DifferentiatorSection';
import { FaqSection } from '@/features/landing/components/FaqSection';
import { Footer } from '@/features/landing/components/Footer';

import DsaHome from '@/features/dsa/pages/DsaHome';
import ProblemWorkspace from '@/features/dsa/pages/ProblemWorkspace';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.includes('/dsa/workspace') || hash === '#workspace') return 'dsa-workspace';
    if (path.includes('/dsa') || hash === '#dsa') return 'dsa-home';
    return 'landing';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/dsa/workspace') || hash === '#workspace') {
        setCurrentRoute('dsa-workspace');
      } else if (path.includes('/dsa') || hash === '#dsa') {
        setCurrentRoute('dsa-home');
      } else {
        setCurrentRoute('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    if (route === 'dsa-home') {
      window.history.pushState(null, '', '/dsa');
    } else if (route === 'dsa-workspace') {
      window.history.pushState(null, '', '/dsa/workspace');
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  if (currentRoute === 'dsa-home') {
    return (
      <MotionConfig reducedMotion="user">
        <DsaHome
          theme={theme}
          toggleTheme={toggleTheme}
          onNavigateToLanding={() => navigateTo('landing')}
          onNavigateToWorkspace={() => navigateTo('dsa-workspace')}
        />
      </MotionConfig>
    );
  }

  if (currentRoute === 'dsa-workspace') {
    return (
      <MotionConfig reducedMotion="user">
        <ProblemWorkspace
          theme={theme}
          toggleTheme={toggleTheme}
          onNavigateToHome={() => navigateTo('dsa-home')}
        />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-screen w-full transition-colors duration-200 ${theme === 'light' ? 'light bg-slate-50 text-slate-900' : 'dark bg-[#05070E] text-slate-100'}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} onNavigateToDsa={() => navigateTo('dsa-home')} />
        
        <main className="w-full overflow-hidden">
          <HeroSection theme={theme} onNavigateToDsa={() => navigateTo('dsa-home')} />
          <CoreDomainsSection onNavigateToDsa={() => navigateTo('dsa-home')} />
          <TrustStrip />
          <ProblemSection />
          <ModulesSection onNavigateToDsa={() => navigateTo('dsa-home')} />
          <AiSection />
          <DifferentiatorSection />
          <FaqSection />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}


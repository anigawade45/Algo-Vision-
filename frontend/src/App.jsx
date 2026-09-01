import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/features/landing/components/Navbar';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { TrustStrip } from '@/features/landing/components/TrustStrip';
import { ProblemSection } from '@/features/landing/components/ProblemSection';
import { SolutionSection } from '@/features/landing/components/SolutionSection';
import { ModulesSection } from '@/features/landing/components/ModulesSection';
import { AiSection } from '@/features/landing/components/AiSection';
import { DifferentiatorSection } from '@/features/landing/components/DifferentiatorSection';
import { FaqSection } from '@/features/landing/components/FaqSection';
import { Footer } from '@/features/landing/components/Footer';
import CpuScheduling from './features/os/pages/CpuScheduling';

function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ProblemSection />
      <SolutionSection />
      <ModulesSection />
      <AiSection />
      <DifferentiatorSection />
      <FaqSection />
    </>
  );
}

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
    <Router>
      <div className={`min-h-screen w-full transition-colors duration-200 ${theme === 'light' ? 'light bg-slate-50 text-slate-900' : 'dark bg-[#05070E] text-slate-100'}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main className="w-full overflow-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/os/cpu-scheduling" element={<CpuScheduling theme={theme} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}


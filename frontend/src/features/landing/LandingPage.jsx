import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { ModulesSection } from './components/ModulesSection';
import { AiSection } from './components/AiSection';
import { DifferentiatorSection } from './components/DifferentiatorSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export function LandingPage({ theme, toggleTheme }) {
  return (
    <div className={`min-h-screen w-full transition-colors duration-200 ${theme === 'light' ? 'light bg-slate-50 text-slate-900' : 'dark bg-[#05070E] text-slate-100'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="w-full overflow-hidden">
        <HeroSection />
        <TrustStrip />
        <ProblemSection />
        <SolutionSection />
        <ModulesSection />
        <AiSection />
        <DifferentiatorSection />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { ProblemSection } from './components/ProblemSection';
import { ModulesSection } from './components/ModulesSection';
import { AiSection } from './components/AiSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export function LandingPage({ theme, toggleTheme, onNavigateToDsa }) {
  return (
    <div className={`min-h-screen w-full transition-colors duration-200 ${theme === 'light' ? 'light bg-slate-50 text-slate-900' : 'dark bg-[#05070E] text-slate-100'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} onNavigateToDsa={onNavigateToDsa} />
      
      <main className="w-full overflow-hidden">
        <HeroSection theme={theme} onNavigateToDsa={onNavigateToDsa} />
        <TrustStrip />
        <ProblemSection />
        <ModulesSection onNavigateToDsa={onNavigateToDsa} />
        <AiSection />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { FAQ_DATA } from '../data/landingData';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'General', 'Curriculum', 'Visualizer', 'AI Tutor'];

  const filteredFaqs = activeCategory === 'All' ? FAQ_DATA : FAQ_DATA.filter(f => f.category === activeCategory);

  return (
    <section id="faq" className="py-20 bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-white relative font-sans overflow-hidden border-t border-slate-200/80 dark:border-[#1C2638] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>GOT QUESTIONS?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently asked <span className="text-blue-600 dark:text-[#3B82F6]">questions.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base max-w-md mx-auto leading-relaxed">
            Everything you need to know about AlgoVision's visualization engine, curriculum, and AI tutor.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div
          role="tablist"
          aria-label="FAQ Categories"
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-mono transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px] ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1E2638] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List with WAI-ARIA Expand / Collapse */}
        <div className="space-y-4 mb-14" role="region" aria-label="Frequently Asked Questions Accordion">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const buttonId = `faq-btn-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`bg-white dark:bg-[#0B101D] border rounded-2xl transition-all duration-200 overflow-hidden shadow-xs ${
                  isOpen
                    ? 'border-blue-500/50 dark:border-blue-500/60 ring-1 ring-blue-500/20 shadow-lg dark:shadow-[0_4px_20px_rgba(59,130,246,0.1)]'
                    : 'border-slate-200/80 dark:border-[#1E2638] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white text-base sm:text-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer min-h-[52px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {faq.q}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/80 font-normal">
                        <p>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Still Have Questions Support Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#090E1A] dark:to-[#0E172A] border border-blue-200 dark:border-[#1E2C4A] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left shadow-md"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              Still have questions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Ask AlgoVision's 24/7 AI tutor for instant conceptual breakdowns.
            </p>
          </div>

          <a
            href="#ai"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-blue-500/20 shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px]"
          >
            <span>Ask AI Tutor</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}

export default FaqSection;



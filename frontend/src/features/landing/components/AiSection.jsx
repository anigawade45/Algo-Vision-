import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Send, Eye, ArrowRight, BrainCircuit, Activity, Wand2 } from 'lucide-react';
import { PROMPT_CHIPS_DATA } from '../data/landingData';

export function AiSection() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: "Explain binary search like I'm a beginner.",
    },
    {
      id: 2,
      sender: 'ai',
      text: "Binary search works like finding a word in a dictionary. Instead of checking every single page sequentially, you open it right in the middle. If the target comes earlier alphabetically, you eliminate the entire right half and search left!",
      hasVisualOption: true,
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVisualPreview, setShowVisualPreview] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showVisualPreview]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim() || isTyping) return;

    const userMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: query },
    ]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = `Here is a custom AI breakdown for: "${query}". AlgoVision breaks down complex invariants into simple steps with synchronized visual feedback.`;
      
      if (query.toLowerCase().includes('dijkstra')) {
        aiResponseText = "Dijkstra's algorithm finds the shortest path from a starting node to all other nodes in a weighted graph by greedily picking the nearest unvisited node.";
      } else if (query.toLowerCase().includes('monotonic')) {
        aiResponseText = "A monotonic stack maintains its elements in strictly increasing or decreasing order, allowing you to find the next greater element in O(1) time!";
      } else if (query.toLowerCase().includes('cpu')) {
        aiResponseText = "Think of CPU scheduling like a doctor handling emergency patients — Round Robin gives each patient 5 minutes, while Shortest Job First sees minor cases first.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId + 1,
          sender: 'ai',
          text: aiResponseText,
          hasVisualOption: true,
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleVisualRequest = () => {
    setShowVisualPreview(true);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: 'Show me visually' },
      {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Let's visualize it right now in real time!",
        isVisualPreview: true,
      },
    ]);
  };

  return (
    <section id="ai" className="py-20 bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-white relative font-sans overflow-hidden border-t border-slate-200/80 dark:border-[#1C2638] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono">
            <BrainCircuit className="w-3.5 h-3.5" aria-hidden="true" />
            <span>INTELLIGENT CS TUTOR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your AI-powered <span className="text-blue-600 dark:text-[#3B82F6]">learning companion.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Stuck on an algorithm or system concept? Ask AlgoVision for instant, visual-first explanations.
          </p>
        </motion.div>

        {/* LIVE ANIMATED AI CHAT INTERFACE WINDOW */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative transition-colors"
        >
          
          {/* Top Bar with Live Animated Status Indicator */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#090E1A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-xs">
                <div className="w-full h-full bg-[#080B14] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" aria-hidden="true" />
                </div>
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block leading-none">AlgoVision AI Tutor</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" aria-hidden="true" />
                  Online &amp; Active
                </span>
              </div>
            </div>

            {/* Live Neural Waveform Indicator */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/60 text-[10px] font-mono text-slate-600 dark:text-slate-300" aria-hidden="true">
              <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span className="font-semibold ml-1">Neural Engine Active</span>
            </div>
          </div>

          {/* Animated Messages Scroll Container */}
          <div
            role="log"
            aria-live="polite"
            aria-label="AI Chat Conversation"
            className="p-6 space-y-4 min-h-[320px] max-h-[420px] overflow-y-auto bg-slate-50/50 dark:bg-[#070A12] transition-colors"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </div>
                  )}

                  <div className={`max-w-xl space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none font-medium shadow-xs'
                          : 'bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4A] text-slate-800 dark:text-slate-200 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.hasVisualOption && !showVisualPreview && (
                      <button
                        onClick={handleVisualRequest}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-xs font-mono font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer min-h-[36px]"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Show me visually</span>
                      </button>
                    )}

                    {msg.isVisualPreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-slate-100 dark:bg-[#111827] border border-blue-300 dark:border-blue-500/40 space-y-3 shadow-md"
                      >
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider block font-bold">
                          Live Interactive Array Visualizer
                        </span>
                        <div className="flex gap-2 justify-center py-2" aria-hidden="true">
                          <div className="w-8 h-8 rounded bg-white dark:bg-[#080B14] border border-slate-300 dark:border-[#263247] flex items-center justify-center text-xs font-mono font-bold text-slate-500">3</div>
                          <div className="w-8 h-8 rounded bg-white dark:bg-[#080B14] border border-slate-300 dark:border-[#263247] flex items-center justify-center text-xs font-mono font-bold text-slate-500">8</div>
                          <div className="w-8 h-8 rounded bg-blue-500/20 border border-blue-400 flex items-center justify-center text-xs font-mono font-bold text-blue-600 dark:text-blue-300 scale-110 shadow-xs">17</div>
                          <div className="w-8 h-8 rounded bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-xs font-mono font-bold text-indigo-600 dark:text-indigo-300">31</div>
                        </div>
                        <a href="#modules" className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 justify-center font-semibold rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                          <span>Open Full Interactive Playground</span>
                          <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </a>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Animated Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start items-center"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" aria-hidden="true" />
                </div>
                <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4A] rounded-2xl rounded-tl-none px-4 py-3 text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>AlgoVision AI is processing</span>
                  <span className="flex gap-1 items-center" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce duration-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce duration-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce duration-700" />
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-6 py-3 bg-slate-100/70 dark:bg-[#090E1A] border-t border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-blue-500" aria-hidden="true" /> Quick Prompts:
            </span>
            {PROMPT_CHIPS_DATA.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-[#151C2C] hover:bg-blue-50 dark:hover:bg-blue-600/30 border border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 text-xs font-medium transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer min-h-[36px]"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Form Footer */}
          <form onSubmit={handleFormSubmit} className="p-4 bg-white dark:bg-[#0B101D] border-t border-slate-200 dark:border-[#1E2638] flex items-center gap-3">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask AlgoVision any algorithm or CS question..."
              aria-label="Algorithm or Computer Science Question"
              className="flex-1 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isTyping || !inputVal.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px]"
              aria-label="Ask AlgoVision AI"
            >
              <span>Ask AlgoVision</span>
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

        </motion.div>

      </div>
    </section>
  );
}

export default AiSection;



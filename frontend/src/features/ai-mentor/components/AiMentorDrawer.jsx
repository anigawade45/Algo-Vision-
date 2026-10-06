import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Trash2,
  Sparkles,
  Loader2,
  RefreshCw,
  Compass,
  Code
} from 'lucide-react';

import { useAiMentor } from '../context/AiMentorContext';
import FormattedMessage from './FormattedMessage';

export default function AiMentorDrawer() {
  const {
    isOpen,
    closeDrawer,
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    currentPath
  } = useAiMentor();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const drawerRef = useRef(null);

  // Close AI Mentor drawer automatically when user interacts with the page outside
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideInteraction = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        closeDrawer();
      }
    };

    document.addEventListener('pointerdown', handleOutsideInteraction, true);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideInteraction, true);
    };
  }, [isOpen, closeDrawer]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none flex justify-end">
      {/* Slide-over Drawer Window */}
      <div
        ref={drawerRef}
        className="w-full max-w-lg bg-white dark:bg-[#0b101d] border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex flex-col h-full shadow-2xl transition-all duration-300 animate-in slide-in-from-right pointer-events-auto"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">AI Mentor</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 text-[10px] font-mono font-semibold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <Compass className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                <span>Path: {currentPath}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearMessages}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={closeDrawer}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Close AI Mentor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Conversation Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans no-scrollbar bg-slate-50/50 dark:bg-[#0b101d]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-cyan-100 dark:bg-cyan-600/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30'
                  }`}
                >
                  {isUser ? 'You' : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div className={`max-w-[85%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl shadow-sm text-xs sm:text-sm ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-[#141b2d] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <FormattedMessage text={msg.text} />
                  </div>
                  
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Thinking Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-600/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#141b2d] border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 text-xs flex items-center gap-2 font-mono shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI Mentor is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a]">
          <div className="flex items-center gap-2 bg-white dark:bg-[#141b2d] border border-slate-300 dark:border-slate-700 focus-within:border-cyan-500 dark:focus-within:border-cyan-500 rounded-xl p-1.5 transition-all shadow-xs">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about DSA, OS, CN, System Design, or AlgoVision..."
              className="flex-1 px-3 py-1.5 bg-transparent text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-sans"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>Powered by Gemini AI (AI Mentor API Key)</span>
            <span>Supports Markdown & Code</span>
          </div>
        </form>

      </div>
    </div>
  );
}



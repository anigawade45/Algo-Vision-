import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  HelpCircle,
  Binary,
  Cpu,
  Wifi,
  ChevronRight,
  Terminal
} from 'lucide-react';
import { mockDefaultAiResponse } from '../data/mockDashboardData';

export function FloatingAiMentor({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello Ritesh! 👋 I am your **AlgoVision AI CS Mentor**.\n\nI can help you understand algorithms, simulate OS scheduling, trace TCP packets, or break down System Design patterns. What would you like to explore today?`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const starterPrompts = [
    { title: 'Explain Backtracking (N-Queens)', query: 'Explain Backtracking and how N-Queens state-space search works.' },
    { title: 'Round Robin vs Priority Scheduling', query: 'How does Round Robin CPU scheduling work with Gantt charts?' },
    { title: 'TCP 3-Way Handshake Steps', query: 'Why does TCP use a 3-way handshake before data transfer?' },
    { title: 'Redis Cache-Aside Pattern', query: 'Explain the Cache-Aside pattern in distributed system design.' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response stream
    setTimeout(() => {
      const responseText = mockDefaultAiResponse(textToSend);
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `Chat cleared! How can I assist your Computer Science studies today?`,
        time: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Open AI CS Mentor"
        >
          {/* Pulsing ring animation */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-white dark:border-[#0B0F19]" />
          </span>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
          </div>

          <div className="text-left pr-1">
            <span className="block text-xs font-bold leading-tight">AI Mentor</span>
            <span className="block text-[10px] text-blue-200 font-medium">Ask any CS doubt</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] max-h-[620px] h-[82vh] sm:h-[580px] rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="h-16 px-4 sm:px-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  AlgoVision AI Mentor
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-300/30">
                    Online
                  </span>
                </h4>
                <p className="text-[11px] text-blue-100">
                  Interactive CS Tutor & Code Explainer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                title="Close Mentor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#070A12]/40 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white shadow-xs rounded-tr-none'
                      : 'bg-white dark:bg-[#1C2638] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9.5px] mt-1 text-right font-mono ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-[#1C2638] border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Starter Questions */}
          {messages.length <= 2 && (
            <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] shrink-0">
              <div className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Quick Questions:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {starterPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.query)}
                    className="text-left px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium truncate transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-[#111827] border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about algorithms, OS, networks..."
              className="flex-1 h-10 px-3.5 rounded-xl bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

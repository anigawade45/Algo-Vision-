import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Trash2,
  Plus,
  History,
  Loader2,
  Compass,
  MessageSquare,
  ChevronDown,
  ChevronUp
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
    currentPath,
    conversations,
    activeConversationId,
    loadingHistory,
    loadingConversation,
    selectConversation,
    startNewChat,
    deleteChat
  } = useAiMentor();

  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
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
    if (isOpen && !loadingConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading, loadingConversation]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || loadingConversation) return;
    sendMessage(input);
    setInput('');
  };

  const activeConversation = conversations.find(c => c._id === activeConversationId);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none flex justify-end">
      {/* Slide-over Drawer Window */}
      <div
        ref={drawerRef}
        className="w-full max-w-lg bg-white dark:bg-[#0b101d] border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex flex-col h-full shadow-2xl transition-all duration-300 animate-in slide-in-from-right pointer-events-auto"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight truncate">
                  {activeConversation ? activeConversation.title : 'AI Mentor'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 text-[10px] font-mono font-semibold shrink-0">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono truncate">
                <Compass className="w-3 h-3 text-cyan-500 dark:text-cyan-400 shrink-0" />
                <span className="truncate">Path: {currentPath}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* History Toggle Button */}
            <button
              onClick={() => setShowHistory(prev => !prev)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showHistory
                  ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
              title="View Recent Conversations"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Clear / Delete Active Chat */}
            <button
              onClick={clearMessages}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Clear or delete active chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Drawer Button */}
            <button
              onClick={closeDrawer}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Close AI Mentor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Collapsible Recent Conversations History Bar */}
        {showHistory && (
          <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-[#0d1322] p-3 space-y-2 max-h-56 overflow-y-auto no-scrollbar animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Recent Chats ({conversations.length})</span>
              </span>
              {loadingHistory && <Loader2 className="w-3.5 h-3.5 text-cyan-500 animate-spin" />}
            </div>

            {conversations.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
                No saved conversations found. Ask a question to start!
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((item) => {
                  const isActive = activeConversationId === item._id;
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        selectConversation(item._id);
                        setShowHistory(false);
                      }}
                      className={`group flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-700 text-cyan-900 dark:text-cyan-200 font-semibold shadow-xs'
                          : 'bg-white dark:bg-[#141b2d] border-slate-200 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{item.title || 'Conversation'}</p>
                          {item.preview && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{item.preview}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(item._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer shrink-0"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Chat Conversation Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans no-scrollbar bg-slate-50/50 dark:bg-[#0b101d]">
          {loadingConversation ? (
            <div className="flex items-center justify-center py-12 text-slate-500 dark:text-slate-400 text-xs font-mono gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
              <span>Loading conversation...</span>
            </div>
          ) : (
            messages.map((msg) => {
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
            })
          )}

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
              disabled={isLoading || loadingConversation}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading || loadingConversation}
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

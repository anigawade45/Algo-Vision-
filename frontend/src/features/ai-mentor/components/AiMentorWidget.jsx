import React from 'react';
import { Bot } from 'lucide-react';
import { useAiMentor } from '../context/AiMentorContext';

export default function AiMentorWidget() {
  const { isOpen, toggleDrawer } = useAiMentor();

  if (isOpen) return null;

  return (
    <button
      onClick={toggleDrawer}
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
      title="Ask AI Mentor"
    >
      <div className="relative">
        <Bot className="w-5 h-5 text-white" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
        </span>
      </div>

      <span className="font-extrabold tracking-wide text-sm">AI Mentor</span>
    </button>
  );
}



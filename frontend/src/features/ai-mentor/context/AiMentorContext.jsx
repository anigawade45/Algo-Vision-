import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMentorMessage } from '../services/aiMentorApi';

const AiMentorContext = createContext(null);

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome-1',
  sender: 'ai',
  text: "Hello! 👋 I am **AI Mentor**, your intelligent guide across **AlgoVision**.\n\nI can answer questions on:\n- 🚀 **DSA, OS, Computer Networks & System Design**\n- 🎯 **How AlgoVision simulations & visualizers work**\n- ⚡ **Using the Code Lab IDE & dynamic input sync**\n\nHow can I help you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export function AiMentorProvider({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageContext, setPageContext] = useState({});

  // Auto-detect page route
  const currentPath = location.pathname;

  // Function to register extra page context from active views
  const updatePageContext = (contextObj) => {
    setPageContext(prev => ({ ...prev, ...contextObj }));
  };

  const toggleDrawer = () => setIsOpen(prev => !prev);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  const sendMessage = async (text) => {
    if (!text || !text.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Pass last 10 messages for conversation context
      const chatHistory = messages.slice(-10).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await sendMentorMessage({
        message: text.trim(),
        currentPath,
        pageContext,
        chatHistory
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply || "I'm sorry, I couldn't process that response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to send AI Mentor message:', err.message || err);
      const errorMsg = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **AI Mentor Notice**: ${err.message || 'AI Mentor is temporarily unavailable. Please try again later.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
  };

  return (
    <AiMentorContext.Provider
      value={{
        isOpen,
        toggleDrawer,
        openDrawer,
        closeDrawer,
        messages,
        sendMessage,
        clearMessages,
        isLoading,
        currentPath,
        pageContext,
        updatePageContext
      }}
    >
      {children}
    </AiMentorContext.Provider>
  );
}

export function useAiMentor() {
  const ctx = useContext(AiMentorContext);
  if (!ctx) {
    throw new Error('useAiMentor must be used within an AiMentorProvider');
  }
  return ctx;
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  sendMentorMessage,
  fetchMentorHistory,
  fetchConversation,
  deleteConversationApi
} from '../services/aiMentorApi';

const AiMentorContext = createContext(null);

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome-1',
  sender: 'ai',
  text: "Hello! 👋 I am **AI Mentor**, your intelligent guide across **AlgoVision**.\n\nI can answer questions on:\n- 🚀 **DSA, OS, Computer Networks & System Design**\n- 🎯 **How AlgoVision simulations & visualizers work**\n- ⚡ **Using the Code Lab IDE & dynamic input sync**\n\nHow can I help you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export function AiMentorProvider({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [pageContext, setPageContext] = useState({});

  const currentPath = location.pathname;

  const updatePageContext = (contextObj) => {
    setPageContext(prev => ({ ...prev, ...contextObj }));
  };

  const toggleDrawer = () => setIsOpen(prev => !prev);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  // Load recent 10-15 conversation history items for authenticated user
  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([]);
      return;
    }
    try {
      setLoadingHistory(true);
      const res = await fetchMentorHistory();
      if (res?.success && Array.isArray(res.data)) {
        setConversations(res.data);
      }
    } catch (err) {
      console.error('Failed to load mentor history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [isAuthenticated]);

  // Load history when drawer opens or user authenticates
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadHistory();
    }
  }, [isOpen, isAuthenticated, loadHistory]);

  // Reset conversation state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveConversationId(null);
      setConversations([]);
      setMessages([DEFAULT_WELCOME_MESSAGE]);
    }
  }, [isAuthenticated]);

  // Load an individual conversation by ID
  const selectConversation = async (conversationId) => {
    if (!conversationId || conversationId === activeConversationId || loadingConversation) return;

    try {
      setLoadingConversation(true);
      const res = await fetchConversation(conversationId);
      if (res?.success && res.data) {
        setActiveConversationId(res.data._id);
        const formattedMsgs = (res.data.messages || []).map((m, idx) => ({
          id: m._id || `msg-${idx}`,
          sender: m.role === 'user' ? 'user' : 'ai',
          text: m.content,
          timestamp: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        setMessages(formattedMsgs.length > 0 ? formattedMsgs : [DEFAULT_WELCOME_MESSAGE]);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setLoadingConversation(false);
    }
  };

  // Start a fresh new chat session
  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([DEFAULT_WELCOME_MESSAGE]);
  };

  // Delete a conversation by ID
  const deleteChat = async (conversationId) => {
    if (!conversationId) return;

    try {
      await deleteConversationApi(conversationId);
      if (activeConversationId === conversationId) {
        startNewChat();
      }
      loadHistory();
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // Send message handler with automatic persistence
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
      const res = await sendMentorMessage({
        message: text.trim(),
        conversationId: activeConversationId,
        currentPath,
        pageContext
      });

      if (res?.conversationId) {
        setActiveConversationId(res.conversationId);
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply || "I'm sorry, I couldn't process that response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // Refresh history list so new conversation or updated timestamp appears in sidebar
      loadHistory();

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
    if (activeConversationId) {
      deleteChat(activeConversationId);
    } else {
      setMessages([DEFAULT_WELCOME_MESSAGE]);
    }
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
        updatePageContext,
        conversations,
        activeConversationId,
        loadingHistory,
        loadingConversation,
        loadHistory,
        selectConversation,
        startNewChat,
        deleteChat
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


import { useState, useEffect } from 'react';

interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

const CHAT_HISTORY_KEY = 'ai-coach-chat-history';

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Initialize with default message if parsing fails
        initializeDefaultHistory();
      }
    } else {
      initializeDefaultHistory();
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const initializeDefaultHistory = () => {
    const defaultMessage: ChatMessage = {
      type: "ai",
      message: "¡Hola! Soy tu entrenador personal AI powered by Google Gemini. Estoy aquí para ayudarte con rutinas personalizadas, consejos de técnica, nutrición y motivación. También puedo crear planes de entrenamiento personalizados y guardarlos en tu biblioteca. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory([defaultMessage]);
  };

  const addMessage = (message: ChatMessage) => {
    setChatHistory(prev => [...prev, message]);
  };

  const clearHistory = () => {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    initializeDefaultHistory();
  };

  return {
    chatHistory,
    setChatHistory,
    addMessage,
    clearHistory
  };
};

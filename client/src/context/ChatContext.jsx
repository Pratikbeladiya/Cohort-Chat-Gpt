import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { createNewChat } from '../api/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Connect to backend socket with cookie credentials
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully');
    });

    // Listen for AI responses from backend
    socketRef.current.on('ai-response', (data) => {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: data.content, chat: data.chat }
      ]);
      setIsAiTyping(false);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  const startNewChat = async (initialPrompt = '') => {
    const title = initialPrompt ? initialPrompt.slice(0, 25) + '...' : 'New Chat';
    try {
      const res = await createNewChat(title);
      const newChatObj = res.data.chat;
      setChats((prev) => [newChatObj, ...prev]);
      setActiveChat(newChatObj);
      setMessages([]);
      return newChatObj;
    } catch (err) {
      console.error('Failed to create new chat:', err);
      return null;
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    let targetChat = activeChat;
    if (!targetChat) {
      targetChat = await startNewChat(content);
      if (!targetChat) return;
    }

    // Add user message to state immediately for responsiveness
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: content, chat: targetChat._id }
    ]);
    setIsAiTyping(true);

    // Emit event to socket server
    socketRef.current.emit('ai-message', {
      chat: targetChat._id,
      content: content
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        setActiveChat,
        messages,
        isAiTyping,
        startNewChat,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
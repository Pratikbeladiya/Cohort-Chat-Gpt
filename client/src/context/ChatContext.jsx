import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { createNewChat, getUserChats, getChatMessages } from '../api/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const socketRef = useRef(null);

  // 1. Fetch user's chat list on page refresh or login
  useEffect(() => {
    if (!user) {
      setChats([]);
      setActiveChat(null);
      setMessages([]);
      return;
    }

    getUserChats()
      .then((res) => {
        const chatList = res.data.chats || [];
        setChats(chatList);
        if (chatList.length > 0) {
          setActiveChat(chatList[0]);
        }
      })
      .catch((err) => console.error('Failed to fetch chats:', err));
  }, [user]);

  // 2. Fetch conversation messages whenever the user clicks/switches a chat
  useEffect(() => {
    if (!activeChat?._id) {
      setMessages([]);
      return;
    }

    getChatMessages(activeChat._id)
      .then((res) => {
        setMessages(res.data.messages || []);
      })
      .catch((err) => console.error('Failed to fetch messages:', err));
  }, [activeChat?._id]);

  // 3. Socket.IO connection
  useEffect(() => {
    if (!user) return;

    socketRef.current = io('http://localhost:3000', {
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully');
    });

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

  // 4. Create new chat
  const startNewChat = async (customTitle = '') => {
    const title = customTitle && customTitle.trim() ? customTitle.trim() : 'New Chat';
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

  // 5. Send message
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    let targetChat = activeChat;
    if (!targetChat) {
      targetChat = await startNewChat(content);
      if (!targetChat) return;
    }

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: content, chat: targetChat._id }
    ]);
    setIsAiTyping(true);

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
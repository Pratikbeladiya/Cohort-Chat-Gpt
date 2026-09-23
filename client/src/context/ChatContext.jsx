import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { createNewChat, getUserChats, getChatMessages, deleteChatApi, renameChatApi } from '../api/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const socketRef = useRef(null);

  // 1. Fetch user's chats on page refresh or login
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

  // 2. Fetch conversation messages whenever activeChat changes
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

    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
socketRef.current = io(SERVER_URL, {
  withCredentials: true,
  transports: ['polling', 'websocket'] // Ensures fast, reliable connection
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

  // 5. Delete chat
  const deleteChat = async (chatId) => {
    try {
      await deleteChatApi(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));

      // If deleted chat was active, switch to next available chat or null
      if (activeChat?._id === chatId) {
        const remainingChats = chats.filter((c) => c._id !== chatId);
        setActiveChat(remainingChats.length > 0 ? remainingChats[0] : null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  // 6. Rename chat
  const renameChat = async (chatId, newTitle) => {
    if (!newTitle.trim()) return;
    try {
      const res = await renameChatApi(chatId, newTitle.trim());
      const updatedChat = res.data.chat;

      setChats((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, title: updatedChat.title } : c))
      );

      if (activeChat?._id === chatId) {
        setActiveChat((prev) => ({ ...prev, title: updatedChat.title }));
      }
    } catch (err) {
      console.error('Failed to rename chat:', err);
    }
  };

  // 7. Send message
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
        deleteChat,
        renameChat,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
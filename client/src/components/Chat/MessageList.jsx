import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { TypingLoader } from '../Common/TypingLoader';
import { useChat } from '../../context/ChatContext';

export const MessageList = () => {
  const { messages, isAiTyping } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-6 space-y-6">
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}

      {isAiTyping && (
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center text-white shrink-0 shadow">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <div className="pt-1">
            <TypingLoader />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};
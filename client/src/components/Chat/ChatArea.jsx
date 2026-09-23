import React from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../context/ChatContext';

export const ChatArea = () => {
  const { messages } = useChat();

  return (
    <main className="flex-1 flex flex-col h-screen bg-[#212121] overflow-hidden">
      <header className="px-6 py-3.5 flex items-center border-b border-white/5 shrink-0">
        <span className="font-semibold text-sm md:text-base text-[#ececec] flex items-center gap-2">
          TalkBot <span className="text-xs font-normal text-neutral-400">(Gemini 2.5 Flash)</span>
        </span>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {messages.length === 0 ? <WelcomeScreen /> : <MessageList />}
      </div>

      <MessageInput />
    </main>
  );
};
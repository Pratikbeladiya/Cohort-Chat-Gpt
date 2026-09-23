import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const ChatList = () => {
  const { chats, activeChat, setActiveChat } = useChat();

  return (
    <div className="flex-1 overflow-y-auto space-y-1 pr-1 my-2">
      <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1">
        Recent Chats
      </div>
      {chats.length === 0 ? (
        <div className="text-xs text-neutral-500 px-2 py-3">No conversations yet</div>
      ) : (
        chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => setActiveChat(chat)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
              activeChat?._id === chat._id
                ? 'bg-[#2f2f2f] text-[#ececec]'
                : 'text-neutral-300 hover:bg-[#262626] hover:text-[#ececec]'
            }`}
          >
            <MessageSquare size={16} className="shrink-0 text-neutral-400" />
            <span className="truncate">{chat.title || 'Untitled conversation'}</span>
          </button>
        ))
      )}
    </div>
  );
};
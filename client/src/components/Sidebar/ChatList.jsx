import React, { useState } from 'react';
import { MessageSquare, Pencil, Trash2, Check, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const ChatList = () => {
  const { chats, activeChat, setActiveChat, deleteChat, renameChat } = useChat();
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (e, chat) => {
    e.stopPropagation(); // Prevents chat selection click
    setEditingChatId(chat._id);
    setEditTitle(chat.title || 'Untitled');
  };

  const handleSaveRename = (e, chatId) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameChat(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const handleDelete = (e, chatId) => {
    e.stopPropagation(); // Prevents chat selection click
    const confirmed = window.confirm("Are you sure you want to delete this chat?");
    if (confirmed) {
      deleteChat(chatId);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-1 pr-1 my-2">
      <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1">
        Recent Chats
      </div>

      {chats.length === 0 ? (
        <div className="text-xs text-neutral-500 px-2 py-3">No conversations yet</div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setActiveChat(chat)}
            className={`group w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors cursor-pointer ${
              activeChat?._id === chat._id
                ? 'bg-[#2f2f2f] text-[#ececec]'
                : 'text-neutral-300 hover:bg-[#262626] hover:text-[#ececec]'
            }`}
          >
            {/* If currently renaming this chat */}
            {editingChatId === chat._id ? (
              <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename(e, chat._id);
                    if (e.key === 'Escape') handleCancelRename(e);
                  }}
                  className="flex-1 bg-[#171717] border border-[#10a37f] rounded px-2 py-1 text-xs text-[#ececec] outline-none"
                />
                <button
                  type="button"
                  onClick={(e) => handleSaveRename(e, chat._id)}
                  className="p-1 hover:text-[#10a37f] text-neutral-400"
                  title="Save"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleCancelRename}
                  className="p-1 hover:text-red-400 text-neutral-400"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare size={16} className="shrink-0 text-neutral-400" />
                  <span className="truncate">{chat.title || 'Untitled conversation'}</span>
                </div>

                {/* Action buttons (Visible on hover) */}
                <div className="hidden group-hover:flex items-center gap-1 text-neutral-400 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleStartRename(e, chat)}
                    className="p-1 hover:text-[#ececec] rounded hover:bg-white/10 transition-colors"
                    title="Rename chat"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, chat._id)}
                    className="p-1 hover:text-red-400 rounded hover:bg-white/10 transition-colors"
                    title="Delete chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};
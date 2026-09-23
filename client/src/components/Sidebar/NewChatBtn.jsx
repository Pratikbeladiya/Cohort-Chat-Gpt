import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const NewChatBtn = () => {
  const { startNewChat } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  // Auto-focus the input line when clicked
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    startNewChat(title.trim() || 'New Chat');
    setTitle('');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle('');
    }
  };

  if (isEditing) {
    return (
      <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#10a37f] bg-[#212121]">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter chat title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm text-[#ececec] outline-none placeholder-neutral-500"
        />
        <button
          type="button"
          onClick={handleConfirm}
          className="p-1 hover:text-[#10a37f] text-neutral-400 cursor-pointer"
          title="Create"
        >
          <Check size={16} />
        </button>
        <button
          type="button"
          onClick={() => { setIsEditing(false); setTitle(''); }}
          className="p-1 hover:text-red-400 text-neutral-400 cursor-pointer"
          title="Cancel"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-[#383838] hover:bg-[#2f2f2f] text-sm font-medium text-[#ececec] transition-colors cursor-pointer"
    >
      <Plus size={18} />
      <span>New chat</span>
    </button>
  );
};
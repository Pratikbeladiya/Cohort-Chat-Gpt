import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const MessageInput = () => {
  const [text, setText] = useState('');
  const { sendMessage, isAiTyping } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isAiTyping) return;
    sendMessage(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto px-4 pb-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-[#2f2f2f] border border-[#383838] focus-within:border-neutral-500 rounded-full px-5 py-3 shadow-xl transition-all"
      >
        <textarea
          rows={1}
          placeholder="Message ChatGPT..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-[#ececec] text-sm md:text-base placeholder-neutral-400 resize-none max-h-32"
        />
        <button
          type="submit"
          disabled={!text.trim() || isAiTyping}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            text.trim() && !isAiTyping
              ? 'bg-white text-black cursor-pointer hover:opacity-90'
              : 'bg-[#424242] text-neutral-500 cursor-not-allowed'
          }`}
        >
          <ArrowUp size={18} />
        </button>
      </form>
      <div className="text-center text-[11px] text-neutral-500 mt-2">
        Gemini can make mistakes. Verify important info.
      </div>
    </div>
  );
};
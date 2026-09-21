import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

export const MessageItem = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center text-white shrink-0 shadow">
          <Sparkles size={16} />
        </div>
      )}

      <div
        className={`max-w-[85%] text-[15px] leading-relaxed ${
          isUser
            ? 'bg-[#2f2f2f] text-[#ececec] px-4 py-2.5 rounded-2xl rounded-tr-sm'
            : 'text-[#ececec] w-full pt-1'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {!isUser && (
          <button
            onClick={handleCopy}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#ececec] transition-colors py-1 px-2 rounded-md hover:bg-white/5"
            title="Copy response"
          >
            {copied ? <Check size={13} className="text-[#10a37f]" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
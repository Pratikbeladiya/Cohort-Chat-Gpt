import React from 'react';
import { Sparkles, Code, Compass, Lightbulb } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const WelcomeScreen = () => {
  const { sendMessage } = useChat();

  const suggestions = [
    { icon: <Code size={18} />, title: 'Debug Code', desc: 'Find bugs in my JavaScript async function' },
    { icon: <Compass size={18} />, title: 'Diet Plan', desc: 'Suggest a healthy diet plan for muscle gain' },
    { icon: <Lightbulb size={18} />, title: 'Brainstorm Ideas', desc: 'Creative startup ideas for AI-driven applications' }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto px-4 text-center my-auto">
      <div className="w-16 h-16 rounded-full bg-[#2f2f2f] border border-[#383838] flex items-center justify-center text-[#10a37f] mb-5 shadow-lg">
        <Sparkles size={32} />
      </div>
      <h1 className="text-3xl font-semibold text-[#ececec] mb-8">
        What can I help with today?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        {suggestions.map((item, idx) => (
          <div
            key={idx}
            onClick={() => sendMessage(item.desc)}
            className="p-4 rounded-xl bg-[#2f2f2f] border border-[#383838] text-left cursor-pointer hover:bg-[#383838] hover:border-neutral-600 transition-all group"
          >
            <div className="text-[#10a37f] mb-2.5 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div className="text-sm font-semibold text-[#ececec] mb-1">{item.title}</div>
            <div className="text-xs text-neutral-400 line-clamp-2">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
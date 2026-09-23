import React, { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NewChatBtn } from './NewChatBtn';
import { ChatList } from './ChatList';
import { UserProfile } from './UserProfile';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-[#171717] border-r border-[#303030] flex flex-col transition-all duration-300 p-3 z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {!isCollapsed && <NewChatBtn />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-neutral-400 hover:text-[#ececec] hover:bg-[#262626] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <ChatList />
          <UserProfile />
        </>
      )}
    </aside>
  );
};
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UserProfile = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = `${user.fullName?.firstName?.[0] || ''}${user.fullName?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 mt-auto border border-white/5">
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
        {initials || 'U'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-[#ececec] truncate">
          {user.fullName?.firstName} {user.fullName?.lastName}
        </div>
        <div className="text-[11px] text-neutral-400 truncate">{user.email}</div>
      </div>
      <button
        onClick={logout}
        title="Log out"
        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};
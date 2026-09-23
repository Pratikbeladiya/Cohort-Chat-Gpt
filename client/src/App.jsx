
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatArea } from './components/Chat/ChatArea';
import { AuthModal } from './components/Auth/AuthModal';

const MainLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#212121] flex items-center justify-center text-neutral-400 text-sm">
        Loading ChatGPT...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121]">
      {!user && <AuthModal />}
      <Sidebar />
      <ChatArea />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <MainLayout />
      </ChatProvider>
    </AuthProvider>
  );
}
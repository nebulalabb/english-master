import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const Topbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 border-b bg-card text-card-foreground flex items-center justify-between px-8">
      <div className="font-medium text-lg">
        Welcome back, <span className="text-primary font-bold">{user?.name || 'Student'}</span>!
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
          {user?.name?.[0].toUpperCase() || 'S'}
        </div>
      </div>
    </header>
  );
};

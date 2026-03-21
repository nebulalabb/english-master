import React from 'react';

export const Topbar = () => {
  return (
    <header className="h-16 border-b bg-card text-card-foreground flex items-center justify-between px-8">
      <div className="font-medium">Welcome back, Student!</div>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-accent"></div>
      </div>
    </header>
  );
};

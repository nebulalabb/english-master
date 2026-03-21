import React from 'react';

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-card text-card-foreground border-r flex flex-col">
      <div className="p-6 font-bold text-2xl">EnglishMaster</div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <div className="p-2 hover:bg-accent rounded-md cursor-pointer">Dashboard</div>
        <div className="p-2 hover:bg-accent rounded-md cursor-pointer">Courses</div>
        <div className="p-2 hover:bg-accent rounded-md cursor-pointer">Vocabulary</div>
        <div className="p-2 hover:bg-accent rounded-md cursor-pointer">Exams</div>
      </nav>
    </aside>
  );
};

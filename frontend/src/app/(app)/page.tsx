import React from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold">Learning Points</h3>
          <p className="text-2xl font-bold">150 XP</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold">Courses Started</h3>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold">Streak</h3>
          <p className="text-2xl font-bold">5 Days</p>
        </div>
      </div>
    </div>
  );
}

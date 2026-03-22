import React from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold">Điểm tích lũy</h3>
          <p className="text-2xl font-bold">150 XP</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold">Khóa học đã bắt đầu</h3>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold">Chuỗi ngày học</h3>
          <p className="text-2xl font-bold">5 Ngày</p>
        </div>
      </div>
    </div>
  );
}

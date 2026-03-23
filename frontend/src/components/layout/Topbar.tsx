'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Bell, ChevronDown } from 'lucide-react';

export const Topbar = () => {
  const user = useAuthStore((state) => state.user);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Chào buổi sáng');
    else if (hours < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');

    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    setCurrentDate(`${days[now.getDay()]}, ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`);
  }, []);

  return (
    <div className="db-topbar">
      <div className="db-topbar-greeting">
        <h2>{greeting}, <span>{user?.name?.split(' ').pop()}!</span> ☀️</h2>
        <p>{currentDate} · Streak {user?.streak || 0} ngày · Hôm nay chưa học</p>
      </div>

      <div className="db-streak-pill">🔥 {user?.streak || 0} ngày</div>
      <div className="db-xp-pill">⚡ {user?.xp || 0} XP</div>

      <div className="db-lives-display" title={`${user?.lives || 0}/5 lives`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`db-heart ${i >= (user?.lives || 0) ? 'empty' : ''}`}>
            ❤️
          </span>
        ))}
      </div>

      <button 
        className="db-notif-btn" 
        onClick={() => setIsNotifOpen(!isNotifOpen)}
        title="Thông báo"
      >
        <Bell size={18} strokeWidth={2.2} />
        <div className="db-notif-dot"></div>
      </button>

      <div className="db-user-menu-btn">
        <div className="db-topbar-avatar">
          {user?.name?.[0].toUpperCase() || 'U'}
        </div>
        <span className="db-topbar-username">{user?.name?.split(' ').pop()}</span>
        <ChevronDown size={12} strokeWidth={2.5} />
      </div>

      {/* Notification Panel (Condensed) */}
      <div className={`db-notif-panel ${isNotifOpen ? 'open' : ''}`}>
        <div className="db-notif-panel-header">
          <div className="db-notif-panel-title">🔔 Thông báo</div>
          <button className="db-notif-mark-all">Đánh dấu đã đọc</button>
        </div>
        <div className="db-notif-list">
          <div className="db-notif-item unread">
            <div className="db-notif-icon">📚</div>
            <div style={{ flex: 1 }}>
              <div className="db-notif-text"><strong>Từ vựng đến hạn!</strong> 12 từ vựng đang chờ bạn ôn tập.</div>
              <div className="db-notif-time">Mới</div>
            </div>
            <div className="db-notif-unread-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

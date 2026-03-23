'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Plus, 
  ArrowRight, 
  Flame, 
  Zap, 
  Trophy, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Target,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const StreakCalendar = () => {
  const [days, setDays] = useState<any[]>([]);
  const today = new Date().getDate();
  const missed = [6, 14]; // Mock missed days

  useEffect(() => {
    // March 2026: starts on Sunday (day 0), 31 days
    const totalDays = 31;
    const calendarDays = [];
    
    for (let d = 1; d <= totalDays; d++) {
      let type = 'normal';
      if (d === today) type = 'today';
      else if (d > today) type = 'future';
      else if (missed.includes(d)) type = 'missed';
      else type = 'studied';
      
      calendarDays.push({ day: d, type });
    }
    setDays(calendarDays);
  }, [today]);

  return (
    <div className="db-streak-cal">
      <div className="db-cal-month">Tháng 3, 2026</div>
      <div className="db-cal-days-header">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
          <div key={d} className="db-cal-day-name">{d}</div>
        ))}
      </div>
      <div className="db-cal-grid">
        {days.map((d, i) => (
          <div key={i} className={`db-cal-day ${d.type === 'studied' ? 'studied' : d.type === 'today' ? 'today' : d.type === 'missed' ? 'missed' : ''}`}>
             {d.day}
          </div>
        ))}
      </div>
      <div className="flex gap-2.5 mt-2.5 text-[11px] font-bold text-[#9CA3AF]">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-gradient-to-br from-[#FF6B35] to-[#FF9966] rounded-[3px]"></span> Đã học
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-red-500/20 rounded-[3px]"></span> Bỏ lỡ
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-[#1E1B4B] rounded-[3px]"></span> Hôm nay
        </span>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="db-content">
      {/* Stats overview row */}
      <div className="db-stats-row">
        <div className="db-stat-mini" style={{ animationDelay: '0.05s' }}>
          <div className="db-stat-mini-icon" style={{ background: 'rgba(255,107,53,.1)' }}>⏱️</div>
          <div>
            <div className="db-stat-mini-val">48h</div>
            <div className="db-stat-mini-label">Tổng thời gian học</div>
          </div>
        </div>
        <div className="db-stat-mini" style={{ animationDelay: '0.1s' }}>
          <div className="db-stat-mini-icon" style={{ background: 'rgba(78,205,196,.1)' }}>📖</div>
          <div>
            <div className="db-stat-mini-val">850</div>
            <div className="db-stat-mini-label">Từ vựng đã học</div>
          </div>
        </div>
        <div className="db-stat-mini" style={{ animationDelay: '0.15s' }}>
          <div className="db-stat-mini-icon" style={{ background: 'rgba(107,203,119,.1)' }}>✅</div>
          <div>
            <div className="db-stat-mini-val">124</div>
            <div className="db-stat-mini-label">Bài học hoàn thành</div>
          </div>
        </div>
        <div className="db-stat-mini" style={{ animationDelay: '0.2s' }}>
          <div className="db-stat-mini-icon" style={{ background: 'rgba(167,139,250,.1)' }}>🎯</div>
          <div>
            <div className="db-stat-mini-val">82%</div>
            <div className="db-stat-mini-label">Điểm trung bình</div>
          </div>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="db-dash-grid">
        
        {/* Greeting Card */}
        <div className="db-card db-card-greeting" style={{ animationDelay: '0.1s' }}>
          <div className="db-greeting-inner">
            <div className="db-greeting-avatar">🧑‍🎓</div>
            <div className="db-greeting-text">
              <h2>Tiếp tục thôi, {user?.name?.split(' ').pop()}! 💪</h2>
              <p>Bạn đang ở trình độ <strong style={{ color: '#fff' }}>{user?.level || 'Bắt đầu'}</strong> · Mục tiêu: IELTS 7.0</p>
              <div className="db-greeting-badges">
                <span className="db-greeting-badge">🔥 Streak {user?.streak || 0} ngày</span>
                <span className="db-greeting-badge">⚡ {user?.xp || 0} XP tuần này</span>
                <span className="db-greeting-badge">🏆 Hạng #12 tuần này</span>
              </div>
            </div>
            <div className="db-greeting-right">
              <div className="db-level-ring-wrap">
                <svg width="76" height="76" viewBox="0 0 76 76">
                  <circle cx="38" cy="38" r="32" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="5"/>
                  <circle cx="38" cy="38" r="32" fill="none" stroke="#fff" strokeWidth="5"
                    strokeDasharray="201" strokeDashoffset={201 - (201 * 0.74)}
                    strokeLinecap="round" transform="rotate(-90 38 38)"/>
                </svg>
                <div className="db-level-ring-label">
                  <span className="db-level-num">{user?.level?.split(' ').pop() || 'B1'}</span>
                  <span className="db-level-txt">Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="db-card db-card-continue" style={{ animationDelay: '0.15s' }}>
          <div className="db-card-header">
            <div className="db-card-title">📚 Tiếp tục học</div>
            <Link href="/courses" className="db-card-action">Tất cả →</Link>
          </div>
          <div className="db-card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
            <div className="db-continue-lesson">
              <div className="db-lesson-icon" style={{ background: 'rgba(255,107,53,.1)' }}>🔤</div>
              <div style={{ flex: 1 }}>
                <div className="db-lesson-name">Present Perfect Continuous</div>
                <div className="db-lesson-unit">Unit 4 · Ngữ pháp B2</div>
                <div className="db-lesson-progress-bar">
                  <div className="db-lesson-progress-fill" style={{ width: '62%' }}></div>
                </div>
                <div className="db-lesson-pct">62% hoàn thành · còn 8 bài tập</div>
              </div>
            </div>
            <button className="db-btn-continue">
              Tiếp tục học
              <ArrowRight className="arrow" size={16} />
            </button>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="db-card" style={{ animationDelay: '0.2s' }}>
          <div className="db-card-header">
            <div>
              <div className="db-ai-rec-label">🤖 AI Gợi ý</div>
              <div className="db-card-title">Hôm nay cần làm</div>
            </div>
          </div>
          <div className="db-card-body">
            <div className="db-task-item">
              <div className="db-task-icon" style={{ background: 'rgba(255,107,53,.1)' }}>🔤</div>
              <div>
                <div className="db-task-label">Ôn tập ngữ pháp Past Perfect</div>
                <div className="db-task-sub">Bạn hay sai ở Unit 3 · ~10 phút</div>
              </div>
              <span className="db-task-badge" style={{ background: 'rgba(255,107,53,.12)', color: 'var(--db-primary)' }}>Yếu điểm</span>
            </div>
            <div className="db-task-item">
              <div className="db-task-icon" style={{ background: 'rgba(78,205,196,.12)' }}>📖</div>
              <div>
                <div className="db-task-label">Ôn 12 từ vựng đến hạn</div>
                <div className="db-task-sub">Spaced repetition · ~8 phút</div>
              </div>
              <span className="db-task-badge" style={{ background: 'rgba(239,68,68,.1)', color: 'rgb(220,38,38)' }}>Hôm nay</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="db-card" style={{ animationDelay: '0.25s' }}>
          <div className="db-card-header">
            <div className="db-card-title">⚡ XP & Cấp độ</div>
            <Link href="/stats" className="db-card-action">Chi tiết →</Link>
          </div>
          <div className="db-xp-card-inner">
            <div className="db-xp-level-row">
              <div className="db-xp-level-name">{user?.level || 'Intermediate'}</div>
              <div className="db-xp-next">Level tiếp: Advanced</div>
            </div>
            <div className="db-xp-bar-track">
              <div className="db-xp-bar-fill" style={{ width: '74%' }}>
                <div className="db-xp-bar-label">{user?.xp || 0} / 1680 XP</div>
              </div>
            </div>
            <div className="db-xp-sub">Cần thêm <strong>440 XP</strong> để đạt Advanced 🚀</div>
          </div>
        </div>

        {/* Streak Calendar */}
        <div className="db-card" style={{ animationDelay: '0.3s' }}>
          <div className="db-card-header">
            <div className="db-card-title">🔥 Streak Calendar</div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--db-primary)' }}>{user?.streak || 0} ngày 🔥</span>
          </div>
          <StreakCalendar />
        </div>

        {/* Leaderboard */}
        <div className="db-card" style={{ animationDelay: '0.35s' }}>
          <div className="db-card-header">
            <div className="db-card-title">🏆 Bảng xếp hạng</div>
            <Link href="/leaderboard" className="db-card-action">Xem đầy đủ →</Link>
          </div>
          <div className="db-lb-list">
            <div className="db-lb-item">
              <div className="db-lb-rank-num" style={{ background: 'linear-gradient(135deg,#FFD93D,#FF9966)', color: '#fff' }}>🥇</div>
              <div className="db-lb-av" style={{ background: 'linear-gradient(135deg,#FF6B35,#FF9966)' }}>N</div>
              <div className="db-lb-name">Nguyễn Minh Tuấn</div>
              <div className="db-lb-xp">3,840 XP</div>
            </div>
            <div className="db-lb-item me">
              <div className="db-lb-rank-num" style={{ background: 'rgba(255,107,53,.15)', color: 'var(--db-primary)', fontSize: '12px', fontWeight: 900 }}>#12</div>
              <div className="db-lb-av" style={{ background: 'linear-gradient(135deg,var(--db-primary),var(--db-accent))' }}>{user?.name?.[0].toUpperCase() || 'U'}</div>
              <div className="db-lb-name" style={{ color: 'var(--db-primary)', fontWeight: 800 }}>Bạn ({user?.name?.split(' ').pop()}) 👈</div>
              <div className="db-lb-xp">{user?.xp || 0} XP</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;


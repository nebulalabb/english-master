import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  BarChart3, 
  BookText, 
  BookOpen, 
  Library, 
  FileText, 
  Headphones, 
  Mic2, 
  PenTool, 
  BookOpenCheck,
  MessageSquareQuote,
  Trophy,
  Users,
  ShoppingBag,
  LogOut,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navGroups: NavGroup[] = [
    {
      label: 'Tổng quan',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Thống kê', path: '/stats', icon: BarChart3 },
        { name: 'Nhật ký học', path: '/journal', icon: BookText },
      ]
    },
    {
      label: 'Học tập',
      items: [
        { name: 'Khóa học', path: '/courses', icon: BookOpen },
        { name: 'Từ vựng', path: '/vocabulary', icon: Library, badge: '12' },
        { name: 'Ngữ pháp', path: '/grammar', icon: FileText },
        { name: 'Nghe hiểu', path: '/listening', icon: Headphones },
        { name: 'Nói & Phát âm', path: '/speaking', icon: Mic2 },
        { name: 'Viết', path: '/writing', icon: PenTool },
        { name: 'Đọc hiểu', path: '/reading', icon: BookOpenCheck },
      ]
    },
    {
      label: 'AI & Luyện thi',
      items: [
        { name: 'AI Chat luyện nói', path: '/ai/chat', icon: MessageSquareQuote, badge: 'PRO', badgeColor: '#A78BFA' },
        { name: 'Luyện đề IELTS/TOEIC', path: '/exams', icon: GraduationCap },
      ]
    },
    {
      label: 'Cộng đồng',
      items: [
        { name: 'Bảng xếp hạng', path: '/leaderboard', icon: Trophy },
        { name: 'Cộng đồng', path: '/forum', icon: Users },
        { name: 'Cửa hàng XP', path: '/shop', icon: ShoppingBag },
      ]
    }
  ];

  return (
    <aside className="db-sidebar">
      <div className="db-sb-logo">
        <div className="db-sb-logo-text">Nebula<span>English</span></div>
      </div>

      <div className="db-sb-body">
        {navGroups.map((group, gIdx) => (
          <React.Fragment key={gIdx}>
            <div className="db-sb-section-label">{group.label}</div>
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={iIdx} 
                  href={item.path} 
                  className={`db-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="db-nav-icon" size={18} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span 
                      className="db-nav-badge"
                      style={item.badgeColor ? { background: item.badgeColor } : {}}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="db-sb-user" onClick={() => router.push('/profile')}>
        <div className="db-sb-avatar">
          {user?.name?.[0].toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="db-sb-user-name truncate">{user?.name || 'Người dùng'}</div>
          <div className="db-sb-user-level truncate">
            ⚡ {user?.xp || 0} XP · {user?.level || 'Bắt đầu'}
          </div>
        </div>
        <ChevronRight className="db-sb-user-arrow" size={14} />
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors text-sm font-bold"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};


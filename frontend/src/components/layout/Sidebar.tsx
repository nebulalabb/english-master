import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, BookOpen, MessageSquare, GraduationCap, LogOut, User } from 'lucide-react';

export const Sidebar = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 h-screen bg-card text-card-foreground border-r flex flex-col">
      <div className="p-6 font-bold text-2xl text-primary">EnglishMaster</div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <div onClick={() => router.push('/')} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer">
          <LayoutDashboard size={20} />
          <span>Bảng điều khiển</span>
        </div>
        <div onClick={() => router.push('/courses')} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer">
          <BookOpen size={20} />
          <span>Khóa học</span>
        </div>
        <div onClick={() => router.push('/learning-path')} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer">
          <GraduationCap size={20} />
          <span>Lộ trình học</span>
        </div>
        <div onClick={() => router.push('/community')} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer">
          <MessageSquare size={20} />
          <span>Cộng đồng</span>
        </div>
        <div onClick={() => router.push('/exam')} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer">
          <GraduationCap size={20} />
          <span>Kỳ thi</span>
        </div>
        <div onClick={() => router.push('/profile')} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer">
          <User size={20} />
          <span>Hồ sơ</span>
        </div>
      </nav>
      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

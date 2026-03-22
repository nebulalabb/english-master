import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  level: string;
  xp: number;
  streak: number;
  lives: number;
  isPremium: boolean;
  learningGoals?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: typeof window !== 'undefined' ? Cookies.get('token') || null : null,
      setAuth: (user, token) => {
        Cookies.set('token', token, { expires: 7 });
        set({ user, token });
      },
      logout: () => {
        Cookies.remove('token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

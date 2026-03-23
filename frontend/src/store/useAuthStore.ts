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
  hasCompletedPlacementTest: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: typeof window !== 'undefined' ? Cookies.get('token') || null : null,
      setAuth: (user, token) => {
        Cookies.set('token', token, { expires: 7 });
        localStorage.setItem('token', token);
        set({ user, token });
      },
      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
      logout: () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

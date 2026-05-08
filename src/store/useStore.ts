import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  user: { name: string; email: string } | null;
  login: (email: string) => void;
  logout: () => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      theme: 'light',
      user: null,
      login: (email: string) => set({ isAuthenticated: true, user: { name: 'Admin User', email } }),
      logout: () => set({ isAuthenticated: false, user: null }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'swiftsales-storage',
    }
  )
);

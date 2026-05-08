import React from 'react';
import { Menu, Bell, Moon, Sun } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useLocation } from 'react-router-dom';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useStore();
  const location = useLocation();

  const title = location.pathname.split('/')[1] || 'Dashboard';
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-heading font-semibold text-slate-900 dark:text-slate-100">
          {displayTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <div className="relative">
          <button className="rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-white dark:ring-slate-800" />
          </button>
        </div>
      </div>
    </header>
  );
}

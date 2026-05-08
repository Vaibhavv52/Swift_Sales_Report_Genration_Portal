import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Package2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function Sidebar({ className }: { className?: string }) {
  const { logout, user } = useStore();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  return (
    <div className={cn('flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-slate-300', className)}>
      <div className="flex h-16 shrink-0 items-center px-6 text-white font-heading font-bold text-xl gap-2">
        <Package2 className="h-6 w-6 text-primary animate-pulse-glow" />
        SwiftSales
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105',
                    isActive
                      ? 'border-l-4 border-blue-500 bg-blue-500/10 text-primary'
                      : 'border-l-4 border-transparent hover:bg-slate-800 hover:text-white'
                  )
                }
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: { bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', dot: 'bg-slate-400' },
    success: { bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20', dot: 'bg-emerald-500' },
    warning: { bg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20', dot: 'bg-amber-500' },
    danger: { bg: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20', dot: 'bg-red-500' },
    outline: { bg: 'text-textPrimary border border-border', dot: 'bg-slate-400' },
  };

  const selected = variants[variant] || variants.default;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200',
        selected.bg,
        className
      )}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", selected.dot)} />
      {children}
    </div>
  );
}

export { Badge };

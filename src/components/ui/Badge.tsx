import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: { bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', dot: 'bg-slate-400 dark:bg-slate-500' },
    success: { bg: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800', dot: 'bg-green-500 dark:bg-green-400' },
    warning: { bg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800', dot: 'bg-amber-500 dark:bg-amber-400' },
    danger: { bg: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800', dot: 'bg-red-500 dark:bg-red-400' },
    outline: { bg: 'text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' },
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

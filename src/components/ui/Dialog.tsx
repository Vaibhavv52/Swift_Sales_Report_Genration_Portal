import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './Card';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children, title, description, className }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <Card className={cn("relative z-50 w-full max-w-lg mx-4 flex flex-col max-h-[90vh]", className)}>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="flex flex-col space-y-1.5 p-6 text-center sm:text-left">
          {title && <h2 className="text-lg font-heading font-semibold leading-none tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <div className="p-6 pt-0 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </Card>
    </div>
  );
}

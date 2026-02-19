'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const variantClasses: Record<string, { container: string; title: string; icon: string }> = {
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
      title: 'text-green-900 dark:text-green-200',
      icon: 'text-green-500',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
      title: 'text-red-900 dark:text-red-200',
      icon: 'text-red-500',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
      title: 'text-yellow-900 dark:text-yellow-200',
      icon: 'text-yellow-500',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
      title: 'text-blue-900 dark:text-blue-200',
      icon: 'text-blue-500',
    },
  };

  const v = variantClasses[variant] || variantClasses.info;

  return (
    <div className={`rounded-xl border p-4 ${v.container} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`text-sm font-medium mb-0.5 ${v.title}`}>{title}</p>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${v.icon}`}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

'use client';

import React from 'react';

export interface InfoBannerProps {
  icon?: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'error';
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const InfoBanner: React.FC<InfoBannerProps> = ({
  icon,
  variant = 'info',
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const variantClasses: Record<string, { container: string; icon: string; text: string }> = {
    info: {
      container: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800',
      icon: 'text-indigo-500 dark:text-indigo-400',
      text: 'text-indigo-700 dark:text-indigo-300',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-500 dark:text-yellow-400',
      text: 'text-yellow-700 dark:text-yellow-300',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
      icon: 'text-green-500 dark:text-green-400',
      text: 'text-green-700 dark:text-green-300',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
      icon: 'text-red-500 dark:text-red-400',
      text: 'text-red-700 dark:text-red-300',
    },
  };

  const v = variantClasses[variant] || variantClasses.info;

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-lg ${v.container} ${className}`}>
      {icon && (
        <span className={`shrink-0 mt-0.5 ${v.icon}`}>
          {icon}
        </span>
      )}
      <div className={`text-sm ${v.text}`}>{children}</div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={`shrink-0 ml-auto p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${v.icon}`}
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default InfoBanner;

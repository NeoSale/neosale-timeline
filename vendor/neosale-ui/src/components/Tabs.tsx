'use client';

import React from 'react';

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
  variant?: 'underline' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  className = '',
  theme,
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'text-xs py-2 px-3 gap-1.5',
    md: 'text-sm py-3 px-1 gap-2',
    lg: 'text-base py-3.5 px-1 gap-2',
  };

  const getTabClasses = (tab: TabItem) => {
    const isActive = tab.key === activeTab;
    const isDisabled = tab.disabled;
    const base = `inline-flex items-center font-medium transition-colors focus:outline-none ${sizeClasses[size]}`;

    if (isDisabled) {
      return `${base} opacity-40 cursor-not-allowed`;
    }

    if (variant === 'underline') {
      if (isActive) {
        if (theme === 'dark') {
          return `${base} border-b-2 border-primary text-primary-light cursor-pointer`;
        }
        if (theme === 'light') {
          return `${base} border-b-2 border-primary text-primary cursor-pointer`;
        }
        return `${base} border-b-2 border-primary text-primary dark:text-primary-light cursor-pointer`;
      }
      if (theme === 'dark') {
        return `${base} border-b-2 border-transparent text-gray-400 hover:text-gray-200 cursor-pointer`;
      }
      if (theme === 'light') {
        return `${base} border-b-2 border-transparent text-gray-500 hover:text-gray-700 cursor-pointer`;
      }
      return `${base} border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer`;
    }

    // pills variant
    if (isActive) {
      return `${base} bg-primary text-white rounded-lg cursor-pointer`;
    }
    if (theme === 'dark') {
      return `${base} text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg cursor-pointer`;
    }
    if (theme === 'light') {
      return `${base} text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg cursor-pointer`;
    }
    return `${base} text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg cursor-pointer`;
  };

  const containerClasses = variant === 'underline'
    ? `flex ${fullWidth ? '' : 'gap-6'} border-b border-gray-200 dark:border-gray-800`
    : `flex ${fullWidth ? '' : 'gap-1'} bg-gray-100 dark:bg-gray-800 rounded-lg p-1`;

  return (
    <nav className={`${containerClasses} ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={tab.key === activeTab}
          aria-disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.key)}
          className={`${getTabClasses(tab)} ${fullWidth ? 'flex-1 justify-center' : ''}`}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className={`ml-1.5 text-xs font-normal px-1.5 py-0.5 rounded-full ${
              tab.key === activeTab
                ? variant === 'pills'
                  ? 'bg-white/20 text-white'
                  : 'bg-primary/10 text-primary dark:text-primary-light'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;

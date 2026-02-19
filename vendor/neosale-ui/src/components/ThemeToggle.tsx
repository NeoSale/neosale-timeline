'use client';

import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      suppressHydrationWarning
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
};

export default ThemeToggle;

'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'bordered';
  hover?: boolean;
  onClick?: () => void;
  theme?: 'light' | 'dark';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  hover = false,
  onClick,
  theme,
}) => {
  const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const getThemeClasses = () => {
    if (theme === 'dark') {
      return {
        default: 'bg-gray-800 border border-gray-700',
        glass: 'glass',
        bordered: 'bg-gray-800 border-2 border-gray-600',
      };
    }
    if (theme === 'light') {
      return {
        default: 'bg-white border border-gray-200',
        glass: 'glass',
        bordered: 'bg-white border-2 border-gray-300',
      };
    }
    return {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      glass: 'glass',
      bordered: 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600',
    };
  };

  const themeClasses = getThemeClasses();
  const variantClass = themeClasses[variant] || themeClasses.default;

  const hoverClass = hover
    ? 'hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.01] cursor-pointer'
    : '';

  return (
    <div
      className={`
        ${variantClass}
        rounded-xl shadow-sm
        transition-all duration-200
        ${paddingClasses[padding]}
        ${hoverClass}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

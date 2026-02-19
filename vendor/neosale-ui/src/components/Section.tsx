'use client';

import React from 'react';

export interface SectionProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Render custom content in the top-right area (e.g., a toggle, counter, or button) */
  action?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  description,
  icon,
  action,
  padding = 'lg',
  className = '',
}) => {
  const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hasHeader = title || description || icon || action;

  return (
    <section
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${paddingClasses[padding]} ${className}`}
    >
      {hasHeader && (
        <div className={`flex items-start justify-between ${children ? 'mb-4' : ''}`}>
          <div className="flex items-start gap-3">
            {icon && (
              <div className="shrink-0">{icon}</div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export default Section;

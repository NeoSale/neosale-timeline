'use client';

import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Optional back link or breadcrumb rendered above the title */
  backLink?: React.ReactNode;
  /** Optional right-side actions (e.g., buttons) */
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backLink,
  actions,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {backLink && <div className="mb-4">{backLink}</div>}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0 ml-4">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;

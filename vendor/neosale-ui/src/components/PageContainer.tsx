'use client';

import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  /** Maximum width variant */
  maxWidth?: 'md' | 'lg' | 'xl' | '7xl';
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = '7xl',
  className = '',
}) => {
  const maxWidthClasses: Record<string, string> = {
    md: 'max-w-3xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    '7xl': 'max-w-7xl',
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto py-8 px-4 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;

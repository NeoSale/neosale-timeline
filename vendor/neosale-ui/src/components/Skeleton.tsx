'use client';

import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

const SkeletonItem: React.FC<Omit<SkeletonProps, 'count'>> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
}) => {
  const variantClasses: Record<string, string> = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'circular' && !height && width) {
    style.height = style.width;
  }

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  ...props
}) => {
  if (count === 1) {
    return <SkeletonItem {...props} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} {...props} />
      ))}
    </div>
  );
};

export default Skeleton;

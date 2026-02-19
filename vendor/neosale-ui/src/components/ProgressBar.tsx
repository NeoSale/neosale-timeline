'use client';

import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'green' | 'red' | 'blue' | 'purple' | 'emerald' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClasses: Record<string, string> = {
    primary: 'bg-primary',
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
    cyan: 'bg-cyan-500',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const barColor = colorClasses[color] || colorClasses.primary;
  const barSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`w-full ${className}`}>
      {(label || showLabel) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${barSize}`}>
        <div
          className={`${barColor} ${barSize} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

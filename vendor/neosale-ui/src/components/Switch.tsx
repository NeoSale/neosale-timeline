'use client';

import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
  theme,
}) => {
  const trackSizes: Record<string, string> = {
    sm: 'h-4 w-8',
    md: 'h-5 w-9',
    lg: 'h-6 w-11',
  };

  const thumbSizes: Record<string, string> = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  const translateOn: Record<string, string> = {
    sm: 'translate-x-4',
    md: 'translate-x-4',
    lg: 'translate-x-5',
  };

  const translateOff: Record<string, string> = {
    sm: 'translate-x-0.5',
    md: 'translate-x-0.5',
    lg: 'translate-x-1',
  };

  const getTrackColor = () => {
    if (checked) {
      return 'bg-primary';
    }
    if (theme === 'dark') return 'bg-gray-600';
    if (theme === 'light') return 'bg-gray-300';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={toggle}
      className={`relative inline-flex ${trackSizes[size]} items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getTrackColor()}`}
    >
      <span
        className={`inline-block ${thumbSizes[size]} transform rounded-full bg-white transition-transform shadow-sm ${
          checked ? translateOn[size] : translateOff[size]
        }`}
      />
    </button>
  );

  if (!label && !description) {
    return <div className={className}>{switchElement}</div>;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 mr-3">
        {label && (
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-gray-900' : 'text-gray-900 dark:text-white'
          }`}>
            {label}
          </span>
        )}
        {description && (
          <p className={`text-xs mt-0.5 ${
            theme === 'dark' ? 'text-gray-400' : theme === 'light' ? 'text-gray-500' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {description}
          </p>
        )}
      </div>
      {switchElement}
    </div>
  );
};

export default Switch;

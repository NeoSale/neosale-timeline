'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  inputSize = 'md',
  variant,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const variantClasses = {
    light: {
      label: 'text-gray-700',
      input: 'bg-white text-gray-900 border-gray-300 placeholder-gray-400',
      inputError: 'border-red-500',
      icon: 'text-gray-400',
    },
    dark: {
      label: 'text-gray-200',
      input: 'bg-gray-700 text-white border-gray-600 placeholder-gray-400',
      inputError: 'border-red-500',
      icon: 'text-gray-500',
    },
    auto: {
      label: 'text-gray-700 dark:text-gray-200',
      input: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400',
      inputError: 'border-red-500',
      icon: 'text-gray-400 dark:text-gray-500',
    },
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  const v = variant ? variantClasses[variant] : variantClasses.auto;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={`block text-sm font-medium mb-1 ${v.label}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${v.icon}`}>
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${sizeClasses[inputSize]}
            ${v.input}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? v.inputError : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className={`absolute inset-y-0 right-0 pr-3 flex items-center ${v.icon}`}>
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

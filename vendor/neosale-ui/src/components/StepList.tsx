'use client';

import React from 'react';

export interface StepListProps {
  count: number;
  min?: number;
  max?: number;
  onAdd: () => void;
  onRemove: () => void;
  label?: string;
  className?: string;
}

const StepList: React.FC<StepListProps> = ({
  count,
  min = 1,
  max = 10,
  onAdd,
  onRemove,
  label = 'step',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onRemove}
        disabled={count <= min}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={`Remove ${label}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="text-sm font-medium text-gray-900 dark:text-white w-20 text-center">
        {count} {label}{count > 1 ? 's' : ''}
      </span>
      <button
        onClick={onAdd}
        disabled={count >= max}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={`Add ${label}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default StepList;

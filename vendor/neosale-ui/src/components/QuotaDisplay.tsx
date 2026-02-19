'use client';

import React from 'react';

export interface QuotaDisplayProps {
  used: number;
  limit: number;
  label?: string;
  showBar?: boolean;
  className?: string;
}

const QuotaDisplay: React.FC<QuotaDisplayProps> = ({
  used,
  limit,
  label = '',
  showBar = false,
  className = '',
}) => {
  const remaining = Math.max(0, limit - used);
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  const barColor = percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Enviados{label ? ` ${label}` : ''}: <span className="font-semibold">{used}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Restantes: <span className="font-semibold">{remaining}</span>
          </span>
        </div>
      </div>

      {showBar && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden h-1.5">
          <div
            className={`${barColor} h-1.5 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default QuotaDisplay;

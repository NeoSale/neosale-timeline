'use client';

import React from 'react';

export interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: 'blue' | 'green' | 'purple' | 'emerald' | 'indigo' | 'red' | 'cyan';
  loading?: boolean;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  label,
  value,
  subtext,
  color = 'blue',
  loading = false,
  className = '',
}) => {
  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
    cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
  };

  const c = colorClasses[color] || colorClasses.blue;

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md ${className}`}>
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${c.bg} ${c.text} mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {label}
      </div>
      {subtext && (
        <div className={`text-xs ${c.text} mt-1 font-medium`}>
          {subtext}
        </div>
      )}
    </div>
  );
};

export default KpiCard;

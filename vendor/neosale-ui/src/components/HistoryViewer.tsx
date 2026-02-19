'use client';

import React, { useState } from 'react';

export interface HistoryViewerProps<T> {
  items: T[];
  onRestore: (item: T) => void;
  renderContent: (item: T) => React.ReactNode;
  getTimestamp: (item: T) => string;
  emptyMessage?: string;
  restoreLabel?: string;
  className?: string;
}

function HistoryViewer<T>({
  items,
  onRestore,
  renderContent,
  getTimestamp,
  emptyMessage = 'No history available',
  restoreLabel = 'Restore',
  className = '',
}: HistoryViewerProps<T>) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return (
      <div className={`text-sm text-gray-500 dark:text-gray-400 text-center py-4 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        History ({items.length})
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getTimestamp(item)}
                </span>
                <button
                  onClick={() => onRestore(item)}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {restoreLabel}
                </button>
              </div>
              <div className="text-sm">{renderContent(item)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryViewer;

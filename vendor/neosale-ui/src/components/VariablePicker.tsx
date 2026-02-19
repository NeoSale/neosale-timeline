'use client';

import React from 'react';

export interface Variable {
  name: string;
  description: string;
}

export interface VariablePickerProps {
  variables: Variable[];
  onInsert: (name: string) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

const VariablePicker: React.FC<VariablePickerProps> = ({
  variables,
  onInsert,
  columns = 4,
  className = '',
}) => {
  const gridCols: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3 ${className}`}>
      {variables.map((v) => (
        <button
          key={v.name}
          type="button"
          onClick={() => onInsert(v.name)}
          className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <code className="text-xs text-primary font-mono">{v.name}</code>
          <span className="text-xs text-gray-500 dark:text-gray-400">{v.description}</span>
        </button>
      ))}
    </div>
  );
};

export default VariablePicker;

'use client'

import React from 'react'

export interface ComparisonRow {
  cells: (string | React.ReactNode)[]
  highlighted?: boolean
}

export interface ComparisonTableProps {
  headers: string[]
  rows: ComparisonRow[]
  className?: string
}

export default function ComparisonTable({ headers, rows, className = '' }: ComparisonTableProps) {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-white/10 ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white/5">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider border-b border-white/10"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={[
                'border-b border-white/5 last:border-0 transition-colors',
                row.highlighted
                  ? 'bg-primary/20 border-l-4 border-l-primary'
                  : 'hover:bg-white/5',
              ].join(' ')}
            >
              {row.cells.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={[
                    'px-4 py-3 text-sm',
                    row.highlighted ? 'text-white font-semibold' : 'text-white/80',
                  ].join(' ')}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

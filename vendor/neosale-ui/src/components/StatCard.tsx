'use client'

import React from 'react'

export interface StatCardProps {
  value: string
  label: string
  sublabel?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'green' | 'red' | 'yellow' | 'white'
  animated?: boolean
  className?: string
}

const sizeMap = {
  sm: 'text-3xl md:text-4xl',
  md: 'text-4xl md:text-5xl',
  lg: 'text-5xl md:text-7xl',
}

const colorMap = {
  primary: 'text-primary dark:text-primary-light',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  white: 'text-white',
}

export default function StatCard({ value, label, sublabel, size = 'md', color = 'primary', animated = false, className = '' }: StatCardProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <span
        className={[
          'font-extrabold leading-none',
          sizeMap[size],
          colorMap[color],
          animated ? 'animate-pulse-scale' : '',
        ].join(' ')}
      >
        {value}
      </span>
      <span className="text-white/80 text-sm font-medium mt-1">{label}</span>
      {sublabel && <span className="text-white/50 text-xs mt-0.5">{sublabel}</span>}
    </div>
  )
}

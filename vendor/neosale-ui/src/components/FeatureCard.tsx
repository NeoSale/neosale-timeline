'use client'

import React from 'react'

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  variant?: 'default' | 'highlight' | 'pillar'
  accentColor?: 'primary' | 'green' | 'yellow' | 'orange' | 'red'
  className?: string
}

const borderColorMap = {
  primary: 'border-l-primary',
  green: 'border-l-green-500',
  yellow: 'border-l-yellow-500',
  orange: 'border-l-orange-500',
  red: 'border-l-red-500',
}

const iconBgMap = {
  primary: 'bg-primary/20',
  green: 'bg-green-500/20',
  yellow: 'bg-yellow-500/20',
  orange: 'bg-orange-500/20',
  red: 'bg-red-500/20',
}

const variantBgMap = {
  default: 'bg-gray-800',
  highlight: 'bg-gray-800',
  pillar: 'bg-gradient-to-br from-gray-800 to-green-900/20',
}

export default function FeatureCard({ icon, title, description, variant = 'default', accentColor = 'primary', className = '' }: FeatureCardProps) {
  return (
    <div
      className={[
        'rounded-2xl p-5 border-l-4 flex gap-4 items-start',
        variantBgMap[variant],
        borderColorMap[accentColor],
        className,
      ].join(' ')}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${iconBgMap[accentColor]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-base leading-tight mb-1">{title}</h4>
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

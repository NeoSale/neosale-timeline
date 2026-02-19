'use client'

import React from 'react'

export interface PricingFeature {
  text: string
  included?: boolean
}

export interface PricingCardProps {
  name: string
  price: string
  period?: string
  setupFee?: string
  features: PricingFeature[]
  featured?: boolean
  badge?: string
  idealFor?: string
  className?: string
}

export default function PricingCard({ name, price, period = '/mês', setupFee, features, featured = false, badge, idealFor, className = '' }: PricingCardProps) {
  return (
    <div
      className={[
        'rounded-2xl p-6 flex flex-col border-2 transition-all duration-300',
        featured
          ? 'border-primary bg-gradient-to-b from-gray-800 to-primary/20 scale-105 shadow-2xl shadow-primary/25'
          : 'border-white/10 bg-gray-800/80 hover:border-white/20',
        className,
      ].join(' ')}
    >
      {badge && (
        <div className="mb-3">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {badge}
          </span>
        </div>
      )}

      <div className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2">{name}</div>

      <div className="flex items-end gap-1 mb-1">
        <span className="text-white font-extrabold text-4xl leading-none">{price}</span>
        <span className="text-white/50 text-sm mb-1">{period}</span>
      </div>

      {setupFee && (
        <div className="text-yellow-400 text-xs font-medium mb-4">+ {setupFee} (setup único)</div>
      )}

      <ul className="flex-1 space-y-2 my-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={feature.included === false ? 'text-white/30 mt-0.5' : 'text-green-400 mt-0.5'}>
              {feature.included === false ? '✗' : '✓'}
            </span>
            <span className={feature.included === false ? 'text-white/30' : 'text-white/80'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {idealFor && (
        <div className="mt-auto pt-3 border-t border-white/10 text-white/40 text-xs">
          Ideal para: {idealFor}
        </div>
      )}
    </div>
  )
}

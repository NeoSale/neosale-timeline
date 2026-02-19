'use client'

import React from 'react'

export interface TimelineStep {
  number: number
  title: string
  description: string
  duration?: string
  status?: 'pending' | 'active' | 'completed'
}

export interface TimelineStepsProps {
  steps: TimelineStep[]
  orientation?: 'horizontal' | 'vertical'
  accentColor?: 'primary' | 'green'
  className?: string
}

export default function TimelineSteps({ steps, orientation = 'horizontal', accentColor = 'primary', className = '' }: TimelineStepsProps) {
  const dotColor = accentColor === 'green' ? 'bg-green-500' : 'bg-primary'
  const lineColor = accentColor === 'green' ? 'bg-green-500/30' : 'bg-primary/30'

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col gap-0 ${className}`}>
        {steps.map((step, i) => (
          <div key={step.number} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${dotColor} flex items-center justify-center text-white font-bold text-base shrink-0`}>
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 my-1 ${lineColor}`} style={{ minHeight: 32 }} />
              )}
            </div>
            <div className={`pb-6 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-semibold text-base">{step.title}</h4>
                {step.duration && (
                  <span className="text-white/50 text-xs border border-white/20 rounded-full px-2 py-0.5">{step.duration}</span>
                )}
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative flex justify-between gap-4 flex-wrap ${className}`}>
      {/* Connector line */}
      <div className={`absolute top-5 left-10 right-10 h-0.5 ${lineColor} hidden md:block`} />

      {steps.map((step) => (
        <div key={step.number} className="flex flex-col items-center text-center flex-1 min-w-[120px] relative z-10">
          <div className={`w-10 h-10 rounded-full ${dotColor} flex items-center justify-center text-white font-bold text-base mb-3`}>
            {step.number}
          </div>
          <h4 className="text-white font-semibold text-sm mb-1">{step.title}</h4>
          {step.duration && (
            <span className="text-primary text-xs font-semibold mb-1">{step.duration}</span>
          )}
          <p className="text-white/60 text-xs leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
  )
}

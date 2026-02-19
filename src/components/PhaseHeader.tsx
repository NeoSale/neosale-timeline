import React from 'react';
import { C, fmt } from '../data/financialData';
import type { Phase, MonthData } from '../types';

interface PhaseHeaderProps {
  phase: Phase;
  monthData: MonthData;
}

const PhaseHeader: React.FC<PhaseHeaderProps> = ({ phase: p, monthData: d }) => {
  const metrics = [
    { label: 'PAGANDO', value: `${d.payingCli}`, sub: d.inSetup > 0 ? `+${d.inSetup} setup` : '', color: C.gold },
    { label: 'MRR CRM', value: `R$${fmt(d.mrrCRM)}`, color: C.accent },
    { label: 'MRR MKT', value: d.mrrMKT > 0 ? `R$${fmt(d.mrrMKT)}` : '—', color: C.cyan },
    { label: 'PRÓ-LABORE', value: `R$${fmt(d.proLabore)}`, color: C.proLabore },
  ];

  return (
    <div style={{
      background: `${p.color}08`,
      border: `1px solid ${p.color}25`,
      borderRadius: 18,
      padding: '24px 32px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      flexWrap: 'wrap',
      animation: 'fadeSlide 0.35s ease',
    }}>
      <span style={{ fontSize: 50 }}>{p.icon}</span>

      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{
          fontSize: 16, fontWeight: 800, letterSpacing: 2,
          color: p.color, fontFamily: 'monospace',
        }}>
          FASE {p.id + 1} — {p.full}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.text, marginTop: 4 }}>
          {p.title}
        </div>
        <div style={{ fontSize: 17, color: C.textSec, marginTop: 2 }}>
          {p.sub}
        </div>
      </div>

      {/* KPI metrics */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {metrics.map((k, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 12, color: C.textMut, fontWeight: 700 }}>
              {k.label}
            </div>
            <div style={{
              fontSize: 24, fontWeight: 800,
              color: k.color, fontFamily: 'monospace',
            }}>
              {k.value}
            </div>
            {k.sub && (
              <div style={{ fontSize: 11, color: C.textMut }}>{k.sub}</div>
            )}
          </div>
        ))}
      </div>

      {/* Milestone badge */}
      {p.ms && (
        <div style={{
          background: p.ms.includes('🚨') ? `${C.red}12` : `${C.gold}12`,
          border: `2px solid ${p.ms.includes('🚨') ? C.red : C.gold}44`,
          borderRadius: 14,
          padding: '12px 20px',
        }}>
          <div style={{
            fontSize: 18, fontWeight: 800,
            color: p.ms.includes('🚨') ? C.red : C.gold,
            fontFamily: 'monospace',
          }}>
            {p.ms}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseHeader;

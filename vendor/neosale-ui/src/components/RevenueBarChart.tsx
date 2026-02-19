import React from 'react';

export interface RevenueCategory {
  key: string;
  label: string;
  color: string;
}

export interface RevenueBarData {
  month: string;
  values: Record<string, number>;
  total: number;
  payingClients?: number;
  inSetup?: number;
  proLabore?: number;
  exitLabel?: string;
}

export interface RevenueBarChartProps {
  title?: string;
  data: RevenueBarData[];
  activeMonths: number[];
  categories: RevenueCategory[];
  maxHeight?: number;
  showProLabore?: boolean;
  proLaboreColor?: string;
  colors?: {
    surface?: string;
    border?: string;
    text?: string;
    textSec?: string;
    textMut?: string;
  };
}

function fmt(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`;
}

const RevenueBarChart: React.FC<RevenueBarChartProps> = ({
  title,
  data,
  activeMonths,
  categories,
  maxHeight = 210,
  showProLabore = true,
  proLaboreColor = '#e879f9',
  colors = {},
}) => {
  const {
    surface = '#0d1117',
    border = '#21262d',
    text = '#f0f4f8',
    textSec = '#b0bec5',
    textMut = '#5a6a7a',
  } = colors;

  const maxTotal = Math.max(...data.map(d => d.total), 1);
  const barH = (v: number) => Math.max((v / maxTotal) * maxHeight, v > 0 ? 4 : 0);

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: '32px 28px' }}>
      {title && (
        <div style={{
          fontSize: 20, fontWeight: 800, letterSpacing: 2, color: '#fbbf24',
          fontFamily: 'monospace', marginBottom: 28,
        }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', marginBottom: 24, overflowX: 'auto' }}>
        {data.map((d, i) => {
          const on = activeMonths.includes(i);
          const plH = showProLabore && d.proLabore ? barH(d.proLabore) : 0;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                minWidth: 62,
                opacity: on ? 1 : 0.3,
                transition: 'opacity 0.4s',
              }}
            >
              <div style={{
                fontSize: 14, fontWeight: 800,
                color: on ? text : textMut,
                fontFamily: 'monospace', marginBottom: 8,
              }}>
                {fmt(d.total)}
              </div>

              <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
                {/* Stacked revenue bar */}
                <div style={{
                  display: 'flex', flexDirection: 'column-reverse',
                  width: 30, borderRadius: '6px 6px 0 0', overflow: 'hidden',
                }}>
                  {categories.map(cat => {
                    const val = d.values[cat.key] || 0;
                    if (!val) return null;
                    return (
                      <div key={cat.key} style={{ height: barH(val), background: cat.color }} />
                    );
                  })}
                </div>

                {/* Pro-labore bar */}
                {showProLabore && (
                  <div style={{
                    width: 14,
                    height: plH || 0,
                    background: `${proLaboreColor}cc`,
                    borderRadius: '4px 4px 0 0',
                    border: plH > 0 ? `1px solid ${proLaboreColor}44` : 'none',
                    position: 'relative',
                    minHeight: plH > 0 ? 4 : 0,
                  }}>
                    {on && d.proLabore && d.proLabore > 0 && (
                      <div style={{
                        position: 'absolute', top: -20, left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 10, fontWeight: 800, color: proLaboreColor,
                        fontFamily: 'monospace', whiteSpace: 'nowrap',
                      }}>
                        {fmt(d.proLabore)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{
                fontSize: 14, fontWeight: 800,
                color: on ? text : textMut,
                marginTop: 10, fontFamily: 'monospace',
              }}>
                {d.month}
              </div>

              {(d.payingClients !== undefined) && (
                <div style={{ fontSize: 11, color: on ? textSec : textMut, marginTop: 4 }}>
                  {d.payingClients}p {d.inSetup ? `+${d.inSetup}s` : ''}
                </div>
              )}

              {d.exitLabel && (
                <div style={{
                  fontSize: 11, color: '#ff6b6b', fontWeight: 800,
                  marginTop: 4, fontFamily: 'monospace',
                }}>
                  {d.exitLabel}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', borderTop: `1px solid ${border}`, paddingTop: 16 }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 13, height: 13, borderRadius: 3, background: cat.color }} />
            <span style={{ fontSize: 14, color: textSec, fontWeight: 600 }}>{cat.label}</span>
          </div>
        ))}
        {showProLabore && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 13, height: 13, borderRadius: 3, background: proLaboreColor }} />
            <span style={{ fontSize: 14, color: textSec, fontWeight: 600 }}>Pró-labore</span>
          </div>
        )}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: textMut }}>
          <strong>p</strong>=pagando MRR &nbsp; <strong>s</strong>=em setup
        </div>
      </div>
    </div>
  );
};

export default RevenueBarChart;

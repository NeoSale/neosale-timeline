import React from 'react';

export interface DRELine {
  label: string;
  value: number;
  color: string;
  bold?: boolean;
  separator?: boolean;
}

export interface FinancialDREProps {
  title: string;
  titleColor?: string;
  totalClients?: number;
  payingClients?: number;
  inSetup?: number;
  lines: DRELine[];
  marginPct?: number;
  profitable?: boolean;
  pjIncome?: { hapvida?: number; cea?: number };
  proLabore?: number;
  colors?: {
    surface?: string;
    border?: string;
    text?: string;
    textSec?: string;
    textMut?: string;
  };
}

function fmtFull(v: number): string {
  return Math.abs(v).toLocaleString('pt-BR');
}

function fmt(v: number): string {
  const abs = Math.abs(v);
  return abs >= 1000 ? `${(abs / 1000).toFixed(0)}k` : `${abs}`;
}

const FinancialDRE: React.FC<FinancialDREProps> = ({
  title,
  titleColor = '#fbbf24',
  totalClients,
  payingClients,
  inSetup,
  lines,
  marginPct,
  profitable = true,
  pjIncome,
  proLabore,
  colors = {},
}) => {
  const {
    surface = '#0d1117',
    border = '#21262d',
    text = '#f0f4f8',
    textSec = '#b0bec5',
    textMut = '#5a6a7a',
  } = colors;

  const green = '#34d399';
  const red = '#ff6b6b';
  const gray1 = '#64748b';
  const gray2 = '#8b9bb0';

  const hasPjIncome = pjIncome && (pjIncome.hapvida || pjIncome.cea);

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 24 }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
      }}>
        <div style={{
          fontSize: 17, fontWeight: 800, letterSpacing: 2,
          color: titleColor, fontFamily: 'monospace',
        }}>
          {title}
        </div>
        {totalClients !== undefined && (
          <div style={{ fontSize: 13, color: textMut }}>
            {totalClients} total · {payingClients} pagando · {inSetup} setup
          </div>
        )}
      </div>

      {/* DRE Lines */}
      {lines.map((line, i) => (
        <div key={i}>
          {line.separator && (
            <div style={{ height: 1, background: border, margin: '8px 0' }} />
          )}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '5px 0', alignItems: 'center',
          }}>
            <span style={{
              fontSize: line.bold ? 16 : 14,
              fontWeight: line.bold ? 800 : 500,
              color: line.bold ? text : textSec,
            }}>
              {line.label}
            </span>
            <span style={{
              fontSize: line.bold ? 19 : 15,
              fontWeight: line.bold ? 800 : 600,
              color: line.color,
              fontFamily: 'monospace',
            }}>
              {line.value < 0 ? '- ' : ''}R$ {fmtFull(Math.abs(line.value))}
            </span>
          </div>
        </div>
      ))}

      {/* Margin card */}
      {marginPct !== undefined && marginPct !== 0 && (
        <div style={{
          marginTop: 14, padding: '10px 16px',
          background: `${profitable ? green : red}12`,
          border: `1px solid ${profitable ? green : red}30`,
          borderRadius: 12,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 14, color: textSec }}>Margem líquida empresa</span>
          <span style={{
            fontSize: 18, fontWeight: 800,
            color: profitable ? green : red,
            fontFamily: 'monospace',
          }}>
            {(marginPct * 100).toFixed(1)}%
          </span>
        </div>
      )}

      {/* PJ Income section */}
      {hasPjIncome && (
        <div style={{
          marginTop: 10, padding: '10px 16px',
          background: `${gray1}12`,
          border: `1px solid ${border}`,
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 13, color: textMut, marginBottom: 4 }}>+ Renda PJ</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {pjIncome?.hapvida ? (
              <span style={{ fontSize: 14, color: gray1, fontFamily: 'monospace' }}>
                Hapvida R${fmt(pjIncome.hapvida)}
              </span>
            ) : null}
            {pjIncome?.cea ? (
              <span style={{ fontSize: 14, color: gray2, fontFamily: 'monospace' }}>
                C&A R${fmt(pjIncome.cea)}
              </span>
            ) : null}
            {proLabore !== undefined && (
              <span style={{
                fontSize: 14, fontWeight: 700, color: text,
                fontFamily: 'monospace', marginLeft: 'auto',
              }}>
                Renda pessoal: R${fmt(proLabore + (pjIncome?.hapvida || 0) + (pjIncome?.cea || 0))}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDRE;

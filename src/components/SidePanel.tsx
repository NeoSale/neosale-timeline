import React from 'react';
import { FinancialDRE } from '@neosale/ui';
import { finData, C, fmtFull, fmt } from '../data/financialData';
import type { Phase, MonthData } from '../types';

interface SidePanelProps {
  phase: Phase;
  monthData: MonthData;
}

const SidePanel: React.FC<SidePanelProps> = ({ phase, monthData: d }) => {
  const accReceita = finData.reduce((s, m) => s + m.receitaNeoSale, 0);
  const accPL = finData.reduce((s, m) => s + m.proLabore, 0);
  const accLucro = finData.reduce((s, m) => s + m.lucroEmpresa, 0);

  // Build DRE lines
  const dreLines = [
    { label: `NeoCRM MRR (${d.payingCli} clientes pagando)`, value: d.mrrCRM, color: C.accent },
    ...(d.mrrMKT > 0 ? [{ label: 'NeoMKT MRR', value: d.mrrMKT, color: C.cyan }] : []),
    { label: `Setups (${d.inSetup} novos × R$5k)`, value: d.setups, color: '#8b5cf6' },
    ...(d.lowTicket > 0 ? [{ label: 'Low Ticket (e-books + upsells)', value: d.lowTicket, color: C.orange }] : []),
    { label: 'RECEITA NEOSALE', value: d.receitaNeoSale, color: C.text, bold: true, separator: true },
    ...(d.impostos > 0 ? [{ label: '(-) Impostos 6%', value: -d.impostos, color: C.red }] : []),
    { label: '(-) Infra (servidor, DB)', value: -d.infra, color: C.red },
    { label: `(-) API variável (${d.totalCli} cli)`, value: -d.apiVar, color: C.red },
    ...(d.mkt > 0 ? [{ label: '(-) Marketing/Ads', value: -d.mkt, color: C.red }] : []),
    ...(d.closer > 0 ? [{ label: '(-) Closer PJ', value: -d.closer, color: C.red }] : []),
    ...(d.cs > 0 ? [{ label: '(-) CS PJ', value: -d.cs, color: C.red }] : []),
    { label: 'CUSTO TOTAL', value: -d.custoTotal, color: C.red, bold: true, separator: true },
    { label: 'PRÓ-LABORE BRUNO', value: -d.proLabore, color: C.proLabore, bold: true, separator: true },
    {
      label: 'LUCRO EMPRESA',
      value: d.lucroEmpresa,
      color: d.lucroEmpresa >= 0 ? C.green : C.red,
      bold: true,
      separator: true,
    },
  ];

  const exits = [
    { l: 'Hapvida', pay: 'R$16k', when: 'Jul/26', color: C.orange, done: phase.id >= 4 },
    { l: 'C&A', pay: 'R$14k', when: 'Set/26', color: C.pink, done: phase.id >= 5 },
  ];

  const accumulated = [
    { l: 'Receita NeoSale', v: accReceita, c: C.text },
    { l: 'Pró-labore Bruno', v: accPL, c: C.proLabore },
    { l: 'Lucro na empresa', v: accLucro, c: accLucro >= 0 ? C.green : C.red },
  ];

  return (
    <div style={{ position: 'sticky', top: 16 }}>
      {/* DRE Card */}
      <FinancialDRE
        title={`📊 DRE — ${d.m}/2026`}
        titleColor={phase.color}
        totalClients={d.totalCli}
        payingClients={d.payingCli}
        inSetup={d.inSetup}
        lines={dreLines}
        marginPct={d.margemLucro !== 0 ? d.margemLucro : undefined}
        profitable={d.lucroEmpresa >= 0}
        pjIncome={{ hapvida: d.h || undefined, cea: d.c || undefined }}
        proLabore={d.proLabore}
        colors={{
          surface: C.surface,
          border: C.border,
          text: C.text,
          textSec: C.textSec,
          textMut: C.textMut,
        }}
      />

      {/* Exits card */}
      <div style={{
        marginTop: 16,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: 20,
      }}>
        <div style={{
          fontSize: 15, fontWeight: 800, letterSpacing: 2,
          color: C.red, fontFamily: 'monospace', marginBottom: 14,
        }}>
          🚪 SAÍDAS CLT
        </div>

        {exits.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 12,
            background: e.done ? `${e.color}10` : 'transparent',
            border: `1px solid ${e.done ? e.color : C.border}44`,
            marginBottom: 6,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: `3px solid ${e.done ? e.color : C.textMut}`,
              background: e.done ? e.color : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#fff', flexShrink: 0,
            }}>
              {e.done ? '✓' : ''}
            </div>
            <div>
              <div style={{
                fontSize: 16, fontWeight: 700,
                color: e.done ? e.color : C.textSec,
                textDecoration: e.done ? 'line-through' : 'none',
              }}>
                {e.l} ({e.pay})
              </div>
              <div style={{ fontSize: 12, color: C.textMut }}>{e.when}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Accumulated card */}
      <div style={{
        marginTop: 16,
        background: `linear-gradient(135deg, ${C.accentDim}, #fbbf2412)`,
        border: `1px solid ${C.accent}30`,
        borderRadius: 18,
        padding: 20,
      }}>
        <div style={{
          fontSize: 13, fontWeight: 800, letterSpacing: 2,
          color: C.accent, fontFamily: 'monospace', marginBottom: 12,
        }}>
          📈 ACUMULADO 2026
        </div>
        {accumulated.map((x, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '5px 0',
          }}>
            <span style={{ fontSize: 14, color: C.textSec }}>{x.l}</span>
            <span style={{
              fontSize: 16, fontWeight: 800,
              color: x.c, fontFamily: 'monospace',
            }}>
              R$ {fmtFull(x.v)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePanel;

import { useState, useCallback } from 'react';
import { RevenueBarChart } from '@neosale/ui';
import type { RevenueBarData, RevenueCategory } from '@neosale/ui';
import { phases, finData, C } from './data/financialData';
import PhaseNav from './components/PhaseNav';
import PhaseHeader from './components/PhaseHeader';
import TasksPanel from './components/TasksPanel';
import SidePanel from './components/SidePanel';

// ═══════════════════════════════════════════════════
// CHART CONFIG
// ═══════════════════════════════════════════════════
const categories: RevenueCategory[] = [
  { key: 'h',         label: 'Hapvida R$16k',    color: C.gray1 },
  { key: 'c',         label: 'C&A R$14k',         color: C.gray2 },
  { key: 'mrrCRM',    label: 'NeoCRM MRR',        color: C.accent },
  { key: 'mrrMKT',    label: 'NeoMKT MRR',        color: C.cyan },
  { key: 'setups',    label: 'Setups (R$5k/cli)', color: '#8b5cf6' },
  { key: 'lowTicket', label: 'Low Ticket',         color: C.orange },
];

const chartData: RevenueBarData[] = finData.map((d, i) => ({
  month: d.m,
  values: {
    h:         d.h,
    c:         d.c,
    mrrCRM:    d.mrrCRM,
    mrrMKT:    d.mrrMKT,
    setups:    d.setups,
    lowTicket: d.lowTicket,
  },
  total:         d.receitaTotal,
  payingClients: d.payingCli,
  inSetup:       d.inSetup,
  proLabore:     d.proLabore,
  exitLabel:     i === 5 ? '✕ HPV' : i === 7 ? '✕ C&A' : undefined,
}));

// Total de tarefas no roadmap
const totalTasks = phases.reduce((s, p) => s + p.tasks.length, 0);

// ═══════════════════════════════════════════════════
// STORAGE KEY
// ═══════════════════════════════════════════════════
const STORAGE_KEY = 'neosale-timeline-completed';

function loadCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

// ═══════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════
export default function App() {
  const [active, setActive]           = useState(0);
  const [filter, setFilter]           = useState('all');
  const [completedTasks, setCompleted] = useState<Set<string>>(loadCompleted);

  const phase     = phases[active];
  const monthData = finData[phase.activeMonths[phase.activeMonths.length - 1]];

  const completedCount = completedTasks.size;
  const globalPct = Math.round((completedCount / totalTasks) * 100);

  const handlePhaseSelect = (id: number) => {
    setActive(id);
    setFilter('all');
  };

  const handleToggleTask = useCallback((id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveCompleted(next);
      return next;
    });
  }, []);

  return (
    <div style={{
      background: C.bg,
      minHeight: '100vh',
      padding: '32px 20px',
      fontFamily: "Poppins, -apple-system, 'Segoe UI', system-ui, sans-serif",
      color: C.text,
    }}>
      {/* HEADER */}
      <div style={{ maxWidth: 1300, margin: '0 auto 28px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', fontSize: 14, fontWeight: 800, letterSpacing: 3,
          color: C.accent, fontFamily: 'monospace',
          background: C.accentDim, padding: '8px 22px', borderRadius: 24, marginBottom: 16,
        }}>
          ROADMAP NEOSALE AI — 2026
        </div>

        <h1 style={{
          fontSize: 'clamp(26px, 4.5vw, 44px)', fontWeight: 700,
          lineHeight: 1.15, margin: '0 0 12px',
          background: `linear-gradient(135deg, ${C.text}, ${C.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          De Dev PJ a CEO da NeoSale em 10 Meses
        </h1>

        <p style={{ fontSize: 18, color: C.textSec, maxWidth: 900, margin: '0 auto 16px', lineHeight: 1.6 }}>
          <strong style={{ color: C.accent }}>NeoCRM</strong> (carro-chefe) +{' '}
          <strong style={{ color: C.cyan }}>NeoMKT</strong> (marketing) · Setup R$5k + 6 parcelas R$3k · Meta: R$50k pró-labore Dez/26
        </p>

        {/* Global progress bar */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 14,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: '10px 20px',
        }}>
          <span style={{ fontSize: 13, color: C.textMut, fontFamily: 'monospace' }}>
            PROGRESSO GERAL
          </span>
          <div style={{ width: 160, height: 7, borderRadius: 4, background: C.border, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${globalPct}%`,
              background: globalPct === 100
                ? C.green
                : `linear-gradient(90deg, ${C.accent}, ${C.blue})`,
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <span style={{
            fontSize: 14, fontWeight: 800, fontFamily: 'monospace',
            color: globalPct === 100 ? C.green : C.accent,
          }}>
            {completedCount}/{totalTasks}
          </span>
          <span style={{ fontSize: 13, color: C.textMut, fontFamily: 'monospace' }}>
            {globalPct}%
          </span>
        </div>
      </div>

      {/* PHASE NAV */}
      <div style={{ maxWidth: 1300, margin: '0 auto 28px' }}>
        <PhaseNav
          active={active}
          onSelect={handlePhaseSelect}
          completedTasks={completedTasks}
        />
      </div>

      {/* REVENUE CHART */}
      <div style={{ maxWidth: 1300, margin: '0 auto 28px' }}>
        <RevenueBarChart
          title="💰 RECEITA vs PRÓ-LABORE — FEV A DEZ 2026"
          data={chartData}
          activeMonths={phase.activeMonths}
          categories={categories}
          showProLabore
          proLaboreColor={C.proLabore}
          colors={{
            surface:  C.surface,
            border:   C.border,
            text:     C.text,
            textSec:  C.textSec,
            textMut:  C.textMut,
          }}
        />
      </div>

      {/* PHASE CONTENT */}
      <div style={{ maxWidth: 1300, margin: '0 auto' }} key={active}>
        <PhaseHeader phase={phase} monthData={monthData} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: 20,
          alignItems: 'start',
          animation: 'fadeSlide 0.35s ease',
        }}>
          <SidePanel phase={phase} monthData={monthData} />
          <TasksPanel
            phase={phase}
            filter={filter}
            onFilterChange={setFilter}
            completedTasks={completedTasks}
            onToggleTask={handleToggleTask}
          />
        </div>

        {/* PRINCIPLE FOOTER */}
        <div style={{
          marginTop: 28, borderRadius: 18, padding: 32, textAlign: 'center',
          background: `linear-gradient(135deg, ${C.accentDim}, #fbbf2412)`,
          border: `1px solid ${C.accent}30`,
          animation: 'fadeSlide 0.35s ease',
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🧠</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 10 }}>
            Modelo: Setup R$5k (mês 1, sem mensalidade) → 6 parcelas de R$3k (meses 2-7)
          </div>
          <div style={{
            fontSize: 16, color: C.textSec,
            lineHeight: 1.7, maxWidth: 900, margin: '0 auto',
          }}>
            Clientes novos pagam setup no mês de entrada. MRR começa no mês seguinte. Por isso em
            Dezembro temos 28 clientes totais mas 25 pagando MRR (3 entraram em Dez).{' '}
            Bruno é o canal de aquisição →{' '}
            <span style={{ color: C.accent }}>NeoCRM</span> +{' '}
            <span style={{ color: C.cyan }}>NeoMKT</span> = ecossistema que aumenta ticket e cria lock-in.
          </div>
        </div>
      </div>
    </div>
  );
}

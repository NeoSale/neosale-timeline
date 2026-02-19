import React from 'react';
import { phases, C } from '../data/financialData';

interface PhaseNavProps {
  active: number;
  onSelect: (id: number) => void;
  completedTasks: Set<string>;
}

function phaseProgress(phaseId: number, tasks: { t: string }[], completed: Set<string>): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter(t => completed.has(`${phaseId}::${t.t}`)).length;
  return done / tasks.length;
}

const PhaseNav: React.FC<PhaseNavProps> = ({ active, onSelect, completedTasks }) => {
  const progress = phases.length > 1
    ? (active / (phases.length - 1)) * 100
    : 0;

  return (
    <div style={{ display: 'flex', overflowX: 'auto', position: 'relative', paddingBottom: 12 }}>
      {/* Track line */}
      <div style={{
        position: 'absolute', top: 26, left: 40, right: 40,
        height: 4, background: C.border, zIndex: 0, borderRadius: 2,
      }} />

      {/* Progress fill */}
      <div style={{
        position: 'absolute', top: 26, left: 40,
        width: `${progress}%`,
        maxWidth: 'calc(100% - 80px)',
        height: 4,
        background: `linear-gradient(90deg, ${C.blue}, ${C.accent}, ${C.gold}, ${C.green})`,
        zIndex: 1,
        borderRadius: 2,
        transition: 'width 0.5s ease',
      }} />

      {/* Phase items */}
      {phases.map((ph, i) => {
        const isActive  = i === active;
        const isPast    = i < active;
        const pct       = phaseProgress(ph.id, ph.tasks, completedTasks);
        const allDone   = pct === 1 && ph.tasks.length > 0;
        const doneTasks = Math.round(pct * ph.tasks.length);

        return (
          <div
            key={i}
            onClick={() => onSelect(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(i)}
            style={{
              flex: 1,
              minWidth: 108,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2,
              padding: '0 4px',
            }}
          >
            {/* Icon circle */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: allDone
                ? `${C.green}33`
                : isActive ? ph.color
                : isPast ? `${ph.color}55` : C.surface,
              border: `3px solid ${allDone ? C.green : isActive ? ph.color : isPast ? ph.color : C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
              transition: 'all 0.3s',
              boxShadow: isActive
                ? `0 0 28px ${ph.color}44`
                : allDone ? `0 0 16px ${C.green}33` : 'none',
              userSelect: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Radial fill for partial progress */}
              {pct > 0 && pct < 1 && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `conic-gradient(${ph.color}44 ${pct * 360}deg, transparent ${pct * 360}deg)`,
                  borderRadius: '50%',
                }} />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>
                {allDone ? '✓' : ph.icon}
              </span>
            </div>

            {/* Month label */}
            <div style={{
              fontSize: 14, fontWeight: 800, letterSpacing: 1,
              color: allDone ? C.green : isActive ? ph.color : C.textMut,
              fontFamily: 'monospace', marginTop: 10,
              transition: 'color 0.3s',
            }}>
              {ph.month}
            </div>

            {/* Phase title */}
            <div style={{
              fontSize: 14,
              color: isActive ? C.text : C.textMut,
              marginTop: 3,
              fontWeight: isActive ? 700 : 400,
              textAlign: 'center',
            }}>
              {ph.title}
            </div>

            {/* Task completion count OR milestone */}
            {pct > 0 ? (
              <div style={{
                fontSize: 11, fontWeight: 800, textAlign: 'center', marginTop: 4,
                color: allDone ? C.green : ph.color,
                fontFamily: 'monospace',
              }}>
                {doneTasks}/{ph.tasks.length} feitas
              </div>
            ) : ph.ms ? (
              <div style={{
                fontSize: 11, fontWeight: 800, textAlign: 'center', marginTop: 4,
                color: ph.ms.includes('🚨') ? C.red : C.gold,
                fontFamily: 'monospace', maxWidth: 130,
              }}>
                {ph.ms.replace('🚨 ', '')}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default PhaseNav;

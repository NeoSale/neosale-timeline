import React from 'react';
import { TaskCard } from '@neosale/ui';
import { tagConfig, C } from '../data/financialData';
import type { Phase, TagKey } from '../types';

interface TasksPanelProps {
  phase: Phase;
  filter: string;
  onFilterChange: (f: string) => void;
  completedTasks: Set<string>;
  onToggleTask: (id: string) => void;
}

const FILTER_OPTIONS = [
  'all', 'neomkt', 'sales', 'ads', 'content',
  'tech', 'finance', 'milestone', 'team', 'delivery', 'brand', 'product',
];

function taskId(phaseId: number, taskTitle: string): string {
  return `${phaseId}::${taskTitle}`;
}

const TasksPanel: React.FC<TasksPanelProps> = ({
  phase,
  filter,
  onFilterChange,
  completedTasks,
  onToggleTask,
}) => {
  const neoMKTCount = phase.tasks.filter(t => t.tag === 'neomkt').length;

  const availableFilters = FILTER_OPTIONS.filter(f =>
    f === 'all' || phase.tasks.some(t => t.tag === f)
  );

  const filteredTasks = filter === 'all'
    ? phase.tasks
    : phase.tasks.filter(t => t.tag === filter);

  const completedCount = filteredTasks.filter(t =>
    completedTasks.has(taskId(phase.id, t.t))
  ).length;

  const allDone = filteredTasks.length > 0 && completedCount === filteredTasks.length;

  return (
    <div>
      {/* Filter row */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 18,
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* Task counter with progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 10 }}>
          <div style={{
            fontSize: 17, fontWeight: 800, letterSpacing: 2,
            color: allDone ? C.green : phase.color,
            fontFamily: 'monospace',
            transition: 'color 0.3s ease',
          }}>
            📋 {completedCount}/{filteredTasks.length} TAREFAS
          </div>

          {/* Mini progress bar */}
          {filteredTasks.length > 0 && (
            <div style={{
              width: 80, height: 6, borderRadius: 3,
              background: C.border, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(completedCount / filteredTasks.length) * 100}%`,
                background: allDone ? C.green : phase.color,
                borderRadius: 3,
                transition: 'width 0.4s ease, background 0.3s ease',
              }} />
            </div>
          )}
        </div>

        {availableFilters.map(f => {
          const isActive = filter === f;
          const tc = tagConfig[f as TagKey];

          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              style={{
                background: isActive
                  ? (f === 'neomkt' ? C.cyan : phase.color)
                  : 'transparent',
                color: isActive ? '#fff' : C.textMut,
                border: `1px solid ${isActive ? 'transparent' : C.border}`,
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'monospace',
                transition: 'all 0.2s ease',
              }}
            >
              {f === 'all'
                ? 'TODAS'
                : f === 'neomkt'
                ? `📐 MKT (${neoMKTCount})`
                : `${tc?.icon || ''} ${tc?.label?.toUpperCase() || f.toUpperCase()}`
              }
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredTasks.map((task, i) => {
          const id = taskId(phase.id, task.t);
          return (
            <TaskCard
              key={id}
              task={{
                title: task.t,
                description: task.d,
                date: task.dt,
                tag: task.tag,
              }}
              index={i}
              color={phase.color}
              tagConfig={tagConfig}
              isHighlighted={task.tag === 'neomkt'}
              highlightColor={C.cyan}
              completed={completedTasks.has(id)}
              onToggle={() => onToggleTask(id)}
              colors={{
                card: C.card,
                border: C.border,
                text: C.text,
                textSec: C.textSec,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TasksPanel;

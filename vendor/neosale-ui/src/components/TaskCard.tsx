import React from 'react';

export interface TaskData {
  title: string;
  description: string;
  date: string;
  tag: string;
}

export interface TagConfigItem {
  icon: string;
  label: string;
  color: string;
}

export interface TaskCardProps {
  task: TaskData;
  index: number;
  color: string;
  tagConfig: Record<string, TagConfigItem>;
  isHighlighted?: boolean;
  highlightColor?: string;
  completed?: boolean;
  onToggle?: () => void;
  colors?: {
    card?: string;
    border?: string;
    text?: string;
    textSec?: string;
  };
}

const green = '#34d399';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  color,
  tagConfig,
  isHighlighted = false,
  highlightColor = '#22d3ee',
  completed = false,
  onToggle,
  colors = {},
}) => {
  const {
    card = '#161b22',
    border = '#21262d',
    text = '#f0f4f8',
    textSec = '#b0bec5',
  } = colors;

  const tc = tagConfig[task.tag] || { icon: '📌', label: 'Geral', color: textSec };
  const activeColor = completed ? green : isHighlighted ? highlightColor : color;

  return (
    <div style={{
      background: completed
        ? `${green}08`
        : isHighlighted ? `${highlightColor}08` : card,
      border: `1px solid ${completed
        ? `${green}35`
        : isHighlighted ? `${highlightColor}30` : border}`,
      borderRadius: 16,
      padding: '20px 24px',
      borderLeft: `5px solid ${activeColor}`,
      opacity: completed ? 0.68 : 1,
      transition: 'opacity 0.3s ease, border-color 0.3s ease, background 0.3s ease',
    }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Checkbox / index toggle */}
        <div
          onClick={onToggle}
          title={completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          style={{
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: 10,
            background: completed ? `${green}25` : `${activeColor}18`,
            border: `2px solid ${completed ? green : `${activeColor}55`}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: completed ? 22 : 18,
            fontWeight: 800,
            color: completed ? green : activeColor,
            fontFamily: 'monospace',
            cursor: onToggle ? 'pointer' : 'default',
            transition: 'all 0.25s ease',
            userSelect: 'none',
          }}
        >
          {completed ? '✓' : index + 1}
        </div>

        <div style={{ flex: 1 }}>
          {/* Tag badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: tc.color,
              background: `${tc.color}15`,
              padding: '2px 8px',
              borderRadius: 5,
              fontFamily: 'monospace',
            }}>
              {tc.icon} {tc.label.toUpperCase()}
            </span>
            {completed && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: green,
                background: `${green}15`,
                padding: '2px 8px',
                borderRadius: 5,
                fontFamily: 'monospace',
              }}>
                ✓ CONCLUÍDA
              </span>
            )}
          </div>

          {/* Title */}
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: completed ? textSec : text,
            lineHeight: 1.4,
            marginBottom: 6,
            textDecoration: completed ? 'line-through' : 'none',
            transition: 'color 0.3s ease',
          }}>
            {task.title}
          </div>

          {/* Description */}
          <div style={{
            fontSize: 15,
            color: textSec,
            lineHeight: 1.7,
            marginBottom: 12,
            opacity: completed ? 0.6 : 1,
          }}>
            {task.description}
          </div>

          {/* Date badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: `${activeColor}12`,
            border: `1px solid ${activeColor}25`,
            borderRadius: 10,
            padding: '6px 14px',
          }}>
            <span style={{ fontSize: 14 }}>📅</span>
            <span style={{
              fontSize: 15,
              fontWeight: 700,
              color: activeColor,
              fontFamily: 'monospace',
            }}>
              {task.date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

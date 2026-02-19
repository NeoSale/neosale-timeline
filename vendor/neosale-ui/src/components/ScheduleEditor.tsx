'use client';

import React from 'react';

export interface ScheduleEditorProps {
  schedule: Record<string, string>;
  onChange: (schedule: Record<string, string>) => void;
  dayLabels?: Record<string, string>;
  showAlwaysOpen?: boolean;
  className?: string;
}

const DEFAULT_DAY_LABELS: Record<string, string> = {
  segunda: 'Segunda',
  terca: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

const DAY_ORDER = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

function isDayOpen(value: string): boolean {
  return value !== 'fechado';
}

function isDayAlwaysOpen(value: string): boolean {
  return value === '00:00-23:59';
}

function getTimeRange(value: string): { start: string; end: string } {
  if (!isDayOpen(value)) return { start: '08:00', end: '18:00' };
  const [start, end] = value.split('-');
  return { start: start || '08:00', end: end || '18:00' };
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  schedule,
  onChange,
  dayLabels = DEFAULT_DAY_LABELS,
  showAlwaysOpen = true,
  className = '',
}) => {
  const updateDay = (day: string, value: string) => {
    onChange({ ...schedule, [day]: value });
  };

  const toggleDay = (day: string) => {
    if (isDayOpen(schedule[day] || 'fechado')) {
      updateDay(day, 'fechado');
    } else {
      updateDay(day, '08:00-18:00');
    }
  };

  const toggleDayAlwaysOpen = (day: string) => {
    if (isDayAlwaysOpen(schedule[day] || '')) {
      updateDay(day, '08:00-18:00');
    } else {
      updateDay(day, '00:00-23:59');
    }
  };

  const updateTime = (day: string, field: 'start' | 'end', time: string) => {
    const { start, end } = getTimeRange(schedule[day] || '08:00-18:00');
    const newValue = field === 'start' ? `${time}-${end}` : `${start}-${time}`;
    updateDay(day, newValue);
  };

  const isAllAlwaysOpen = DAY_ORDER.every(day => isDayAlwaysOpen(schedule[day] || ''));

  const toggleAllAlwaysOpen = () => {
    const newSchedule = { ...schedule };
    if (isAllAlwaysOpen) {
      DAY_ORDER.forEach(day => { newSchedule[day] = '08:00-18:00'; });
    } else {
      DAY_ORDER.forEach(day => { newSchedule[day] = '00:00-23:59'; });
    }
    onChange(newSchedule);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showAlwaysOpen && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isAllAlwaysOpen}
            onChange={toggleAllAlwaysOpen}
            className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Sempre aberto (24h todos os dias)</span>
        </label>
      )}

      <div className="space-y-2">
        {DAY_ORDER.map(day => {
          const value = schedule[day] || 'fechado';
          const open = isDayOpen(value);
          const alwaysOpen = isDayAlwaysOpen(value);
          const { start, end } = getTimeRange(value);

          return (
            <div key={day} className="flex items-center gap-3">
              <button
                onClick={() => toggleDay(day)}
                className={`w-24 px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  open
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                }`}
              >
                {dayLabels[day] || day}
              </button>

              {open ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => updateTime(day, 'start', e.target.value)}
                    disabled={alwaysOpen}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => updateTime(day, 'end', e.target.value)}
                    disabled={alwaysOpen}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <label className="flex items-center gap-1.5 cursor-pointer ml-1">
                    <input
                      type="checkbox"
                      checked={alwaysOpen}
                      onChange={() => toggleDayAlwaysOpen(day)}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">24h</span>
                  </label>
                </div>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500 italic">Fechado</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleEditor;

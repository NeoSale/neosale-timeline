'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';

// ========== Types ==========

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  duration?: number;
}

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  removing?: boolean;
}

export interface ToastContextValue {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  dismiss: (id?: string) => void;
}

// ========== Context ==========

const ToastContext = createContext<ToastContextValue | null>(null);

// ========== Hook ==========

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um <ToastProvider>');
  }
  return context;
}

// ========== Styles ==========

const variantStyles: Record<ToastVariant, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-green-500',
    icon: <CheckCircleIcon className="w-5 h-5 text-white" />,
  },
  error: {
    bg: 'bg-red-500',
    icon: <ExclamationCircleIcon className="w-5 h-5 text-white" />,
  },
  warning: {
    bg: 'bg-yellow-500',
    icon: <ExclamationTriangleIcon className="w-5 h-5 text-white" />,
  },
  info: {
    bg: 'bg-blue-500',
    icon: <InformationCircleIcon className="w-5 h-5 text-white" />,
  },
};

const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
};

// ========== Toast Item Component ==========

function ToastNotification({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const style = variantStyles[toast.variant];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium
        min-w-[280px] max-w-[420px] pointer-events-auto
        ${style.bg}
        ${toast.removing ? 'animate-toast-out' : 'animate-toast-in'}
      `}
      role="alert"
    >
      <span className="shrink-0">{style.icon}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-0.5 rounded-md hover:bg-white/20 transition-colors"
      >
        <XMarkIcon className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

// ========== Provider ==========

let toastCounter = 0;

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant, options?: ToastOptions) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    const duration = options?.duration ?? DEFAULT_DURATIONS[variant];

    setToasts(prev => [...prev, { id, message, variant, duration }]);
  }, []);

  const dismiss = useCallback((id?: string) => {
    if (id) {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, removing: true } : t))
      );
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 250);
    } else {
      setToasts(prev => prev.map(t => ({ ...t, removing: true })));
      setTimeout(() => {
        setToasts([]);
      }, 250);
    }
  }, []);

  const contextValue: ToastContextValue = {
    success: useCallback((msg: string, opts?: ToastOptions) => addToast(msg, 'success', opts), [addToast]),
    error: useCallback((msg: string, opts?: ToastOptions) => addToast(msg, 'error', opts), [addToast]),
    warning: useCallback((msg: string, opts?: ToastOptions) => addToast(msg, 'warning', opts), [addToast]),
    info: useCallback((msg: string, opts?: ToastOptions) => addToast(msg, 'info', opts), [addToast]),
    dismiss,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  dismissToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      // Limit to 4 stacked toasts at once to prevent screen clutter
      const next = [...prev, { id, message, type, duration }];
      if (next.length > 4) {
        return next.slice(1);
      }
      return next;
    });

    if (type !== 'loading' && duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, dismissToast }: { toasts: Toast[]; dismissToast: (id: string) => void }) {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0" />;
      case 'loading':
        return <Loader2 className="h-4.5 w-4.5 text-indigo-500 animate-spin shrink-0" />;
      case 'info':
      default:
        return <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0" />;
    }
  };

  const getStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-100 bg-white dark:border-emerald-950/40 dark:bg-gray-900 shadow-emerald-500/5';
      case 'error':
        return 'border-rose-100 bg-white dark:border-rose-950/40 dark:bg-gray-900 shadow-rose-500/5';
      case 'warning':
        return 'border-amber-100 bg-white dark:border-amber-950/40 dark:bg-gray-900 shadow-amber-500/5';
      case 'loading':
        return 'border-indigo-100 bg-white dark:border-indigo-950/40 dark:bg-gray-900 shadow-indigo-500/5';
      case 'info':
      default:
        return 'border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-slate-500/5';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className={`pointer-events-auto flex items-center justify-between rounded-xl border p-3.5 shadow-lg backdrop-blur-md ${getStyle(
              toast.type
            )}`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              {getIcon(toast.type)}
              <span className="font-sans text-xs font-semibold text-gray-800 dark:text-gray-200 leading-normal truncate">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

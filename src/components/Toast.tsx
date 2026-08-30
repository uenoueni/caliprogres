import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning' | 'error';
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onDismiss }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 text-white rounded-xl shadow-xl border border-neutral-800 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
      {type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
      {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
      
      <span className="leading-snug">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 text-neutral-400 hover:text-white text-xs font-semibold p-1"
      >
        ✕
      </button>
    </div>
  );
};


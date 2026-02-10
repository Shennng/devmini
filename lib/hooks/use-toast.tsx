"use client";
import * as React from "react";
import { createContext, useContext, useReducer, useCallback, useEffect, useState } from "react";

type ToastType = { id: string; title?: string; description?: string; duration?: number };

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 4000;

interface ToastState {
  toasts: ToastType[];
}

type ToastAction = 
  | { type: "ADD_TOAST"; toast: ToastType }
  | { type: "REMOVE_TOAST"; toast: { id: string } };

function toasterReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.toast.id) };
    default:
      return state;
  }
}

interface ToastContextValue {
  toast: (props: Partial<ToastType>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue & { toasts: ToastType[] } {
  const context = useContext(ToastContext);
  if (!context) {
    return { toast: () => {}, toasts: [] };
  }
  return context as ToastContextValue & { toasts: ToastType[] };
}

export function Toaster() {
  const { toasts } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === "undefined" || toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="bg-background border border-border rounded-lg shadow-lg p-4 min-w-[300px] animate-in slide-in-from-bottom-5"
        >
          {t.title && <p className="font-medium">{t.title}</p>}
          {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = useCallback((props: Partial<ToastType>) => {
    const id = Math.random().toString(36).slice(2);
    const newToast: ToastType = { 
      id, 
      title: props.title, 
      description: props.description, 
      duration: props.duration ?? TOAST_REMOVE_DELAY 
    };
    
    setToasts(prev => [newToast, ...prev].slice(TOAST_LIMIT));
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, newToast.duration ?? TOAST_REMOVE_DELAY);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
}

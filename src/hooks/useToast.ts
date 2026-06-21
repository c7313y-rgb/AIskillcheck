import { useCallback, useEffect, useRef, useState } from "react";

export interface ToastState {
  message: string;
  id: number;
}

export interface ErrorState {
  message: string;
  id: number;
}

/** Lightweight toast/error banner controller, replacing the legacy DOM-injected toast() / showError(). */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(null), 5200);
    return () => window.clearTimeout(timer);
  }, [error]);

  const showToast = useCallback((message: string) => {
    counterRef.current += 1;
    setToast({ message, id: counterRef.current });
  }, []);

  const showError = useCallback((message: string) => {
    counterRef.current += 1;
    setError({ message, id: counterRef.current });
  }, []);

  return { toast, error, showToast, showError, dismissError: () => setError(null) };
}

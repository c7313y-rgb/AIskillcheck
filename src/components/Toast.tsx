interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}

interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert">
      <b>確認してください</b>
      <span>{message}</span>
    </div>
  );
}

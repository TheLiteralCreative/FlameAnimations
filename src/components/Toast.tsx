import { useApp } from '../state/AppContext'

export function ToastStack() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`toast toast-${t.kind}`}
          onClick={() => dismissToast(t.id)}
        >
          {t.text}
        </button>
      ))}
    </div>
  )
}

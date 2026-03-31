import { useState, useCallback, useEffect } from 'react'

let _addToast = () => {}

/** Show a toast notification from anywhere in the app */
export function showToast(message) { _addToast(message) }

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  _addToast = useCallback((message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300)
    }, 4000)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.exiting ? ' exiting' : ''}`} role="status">
          <div className="toast-text">{t.message}</div>
        </div>
      ))}
    </div>
  )
}

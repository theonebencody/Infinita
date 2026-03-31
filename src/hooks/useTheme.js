import { useState, useEffect, useCallback } from 'react'

const KEY = 'infinita-theme'

function getSystemPref() {
  if (typeof matchMedia === 'undefined') return 'dark'
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getInitial() {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return getSystemPref()
}

export default function useTheme() {
  const [theme, setThemeState] = useState(getInitial)

  const setTheme = useCallback((t) => {
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
    try { localStorage.setItem(KEY, t) } catch {}
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Apply on mount and listen for system changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const mq = matchMedia?.('(prefers-color-scheme: light)')
    const onChange = (e) => {
      // Only follow system if user hasn't explicitly chosen
      try {
        if (!localStorage.getItem(KEY)) setTheme(e.matches ? 'light' : 'dark')
      } catch {}
    }
    mq?.addEventListener?.('change', onChange)
    return () => mq?.removeEventListener?.('change', onChange)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { theme, setTheme, toggle }
}

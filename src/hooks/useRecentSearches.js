import { useState, useCallback } from 'react'

const KEY = 'launches-recent-searches'
const MAX = 5

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}

function save(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(arr)) } catch {}
}

export default function useRecentSearches() {
  const [recent, setRecent] = useState(load)

  const addSearch = useCallback((term) => {
    const t = term.trim()
    if (!t) return
    setRecent(prev => {
      const next = [t, ...prev.filter(s => s !== t)].slice(0, MAX)
      save(next)
      return next
    })
  }, [])

  const clearRecent = useCallback(() => {
    setRecent([])
    save([])
  }, [])

  return { recent, addSearch, clearRecent }
}

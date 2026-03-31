import { useState, useCallback, useEffect } from 'react'
import { showToast } from '../components/Toasts.jsx'

const KEY = 'infinita-mission-log'

const ACHIEVEMENTS = [
  { id: 'first-contact', name: 'First Contact', desc: 'Viewed your first launch', icon: '\uD83D\uDCE1', check: (s) => s.launches.size >= 1 },
  { id: 'globe-trotter', name: 'Globe Trotter', desc: 'Viewed launches from 5 different countries', icon: '\uD83C\uDF0D', check: (s) => s.providers.size >= 5 },
  { id: 'history-buff', name: 'History Buff', desc: 'Viewed a launch from before 1970', icon: '\uD83D\uDCDC', check: (s) => s.preSpace },
  { id: 'fleet-commander', name: 'Fleet Commander', desc: 'Viewed all launches from one provider', icon: '\u2B50', check: (s) => s.fullProvider },
  { id: 'solar-tourist', name: 'Solar Tourist', desc: 'Visited every planet in the 3D solar system', icon: '\u2604\uFE0F', check: (s) => s.planets.size >= 8 },
]

const PLANETS = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (!raw) return null
    return {
      launches: new Set(raw.launches || []),
      providers: new Set(raw.providers || []),
      rockets: new Set(raw.rockets || []),
      planets: new Set(raw.planets || []),
      badges: new Set(raw.badges || []),
      preSpace: raw.preSpace || false,
      fullProvider: raw.fullProvider || false,
    }
  } catch { return null }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      launches: [...state.launches],
      providers: [...state.providers],
      rockets: [...state.rockets],
      planets: [...state.planets],
      badges: [...state.badges],
      preSpace: state.preSpace,
      fullProvider: state.fullProvider,
    }))
  } catch {}
}

function defaultState() {
  return {
    launches: new Set(), providers: new Set(), rockets: new Set(),
    planets: new Set(), badges: new Set(), preSpace: false, fullProvider: false,
  }
}

export default function useMissionLog(launchData) {
  const [state, setState] = useState(() => load() || defaultState())

  // Check achievements after state changes
  const checkAchievements = useCallback((s) => {
    let changed = false
    ACHIEVEMENTS.forEach(a => {
      if (!s.badges.has(a.id) && a.check(s)) {
        s.badges.add(a.id)
        changed = true
        showToast(`${a.icon} Achievement unlocked: ${a.name}`)
      }
    })
    return changed
  }, [])

  const trackLaunch = useCallback((launch) => {
    setState(prev => {
      const next = {
        ...prev,
        launches: new Set(prev.launches).add(launch.id || launch.mission_name),
        providers: new Set(prev.providers).add(launch.provider),
        rockets: new Set(prev.rockets).add(launch.rocket_name),
        badges: new Set(prev.badges),
        preSpace: prev.preSpace || parseInt((launch.launch_date || '9999').slice(0, 4)) < 1970,
        fullProvider: prev.fullProvider,
        planets: new Set(prev.planets),
      }
      // Check if user has viewed all launches from any provider
      if (launchData && !next.fullProvider) {
        const providerCounts = {}
        launchData.forEach(l => { providerCounts[l.provider] = (providerCounts[l.provider] || 0) + 1 })
        for (const [prov, total] of Object.entries(providerCounts)) {
          const viewed = launchData.filter(l => l.provider === prov && next.launches.has(l.id || l.mission_name)).length
          if (viewed >= total) { next.fullProvider = true; break }
        }
      }
      checkAchievements(next)
      save(next)
      return next
    })
  }, [launchData, checkAchievements])

  const trackPlanet = useCallback((name) => {
    if (!PLANETS.includes(name)) return
    setState(prev => {
      const next = { ...prev, planets: new Set(prev.planets).add(name), badges: new Set(prev.badges) }
      checkAchievements(next)
      save(next)
      return next
    })
  }, [checkAchievements])

  return {
    launches: state.launches,
    providers: state.providers,
    rockets: state.rockets,
    planets: state.planets,
    badges: state.badges,
    launchCount: state.launches.size,
    providerCount: state.providers.size,
    rocketCount: state.rockets.size,
    planetCount: state.planets.size,
    badgeCount: state.badges.size,
    achievements: ACHIEVEMENTS.map(a => ({ ...a, earned: state.badges.has(a.id) })),
    trackLaunch,
    trackPlanet,
  }
}

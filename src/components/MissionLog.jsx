import { useState, useMemo } from 'react'
import { SEED_DATA } from '../data/launchDatabase.js'

// ── Daily featured launch (deterministic from date) ──
function getDailyLaunch() {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const idx = seed % SEED_DATA.length
  return SEED_DATA[idx]
}

// ── Next launch countdown (placeholder — would use real API) ──
function getNextLaunch() {
  const now = new Date()
  // Placeholder: next launch is always ~3 days from now
  const next = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  next.setHours(14, 30, 0, 0)
  return {
    name: 'Falcon 9 / Starlink',
    date: next,
    provider: 'SpaceX',
    site: 'Cape Canaveral',
  }
}

function Countdown({ target }) {
  const [diff, setDiff] = useState(() => Math.max(0, target - Date.now()))
  useState(() => {
    const id = setInterval(() => setDiff(Math.max(0, target - Date.now())), 1000)
    return () => clearInterval(id)
  })
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return <span className="ml-countdown-digits">{d}d {h}h {m}m {s}s</span>
}


export default function MissionLog({ open, missionLog, onViewLaunch }) {
  const daily = useMemo(getDailyLaunch, [])
  const nextLaunch = useMemo(getNextLaunch, [])
  const totalLaunches = SEED_DATA.length
  const pct = Math.round((missionLog.launchCount / totalLaunches) * 100)

  return (
    <div className={`mission-log-page${open ? ' open' : ''}`}>
      <div className="ml-header">
        <div className="ml-title">Mission Log</div>
      </div>

      <div className="ml-body">

        {/* ── Daily Featured Launch ── */}
        <section className="ml-section" aria-label="Today's mission">
          <div className="ml-section-label">Today's Mission</div>
          <div className="ml-daily">
            <div className="ml-daily-icon">{'\uD83D\uDE80'}</div>
            <div className="ml-daily-content">
              <div className="ml-daily-name">{daily.mission_name}</div>
              <div className="ml-daily-meta">{daily.launch_date} {'\u00B7'} {daily.provider} {'\u00B7'} {daily.rocket_name}</div>
              <div className="ml-daily-desc">{daily.mission_description?.slice(0, 120)}...</div>
              <button className="ml-daily-btn" onClick={() => onViewLaunch?.(daily)}>Explore this mission</button>
            </div>
          </div>
        </section>

        {/* ── Next Launch Countdown ── */}
        <section className="ml-section" aria-label="Next scheduled launch">
          <div className="ml-section-label">Next Launch</div>
          <div className="ml-countdown">
            <div className="ml-countdown-name">{nextLaunch.name}</div>
            <Countdown target={nextLaunch.date.getTime()} />
            <div className="ml-countdown-meta">{nextLaunch.provider} {'\u00B7'} {nextLaunch.site}</div>
            <div className="ml-countdown-source">Source: rocketlaunch.org</div>
          </div>
        </section>

        {/* ── Exploration Progress ── */}
        <section className="ml-section" aria-label="Exploration progress">
          <div className="ml-section-label">Exploration Progress</div>
          <div className="ml-progress">
            <div className="ml-progress-header">
              <span>You've explored <strong>{missionLog.launchCount}</strong> of <strong>{totalLaunches}</strong> launches</span>
              <span className="ml-progress-pct">{pct}%</span>
            </div>
            <div className="ml-progress-track">
              <div className="ml-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="ml-stats-row">
            <div className="ml-stat"><div className="ml-stat-val">{missionLog.providerCount}</div><div className="ml-stat-lbl">Providers</div></div>
            <div className="ml-stat"><div className="ml-stat-val">{missionLog.rocketCount}</div><div className="ml-stat-lbl">Rockets</div></div>
            <div className="ml-stat"><div className="ml-stat-val">{missionLog.planetCount}/8</div><div className="ml-stat-lbl">Planets</div></div>
            <div className="ml-stat"><div className="ml-stat-val">{missionLog.badgeCount}</div><div className="ml-stat-lbl">Badges</div></div>
          </div>
        </section>

        {/* ── Achievement Badges ── */}
        <section className="ml-section" aria-label="Achievements">
          <div className="ml-section-label">Achievement Badges</div>
          <div className="ml-badges">
            {missionLog.achievements.map(a => (
              <div key={a.id} className={`ml-badge${a.earned ? ' earned' : ''}`}>
                <div className="ml-badge-icon">{a.icon}</div>
                <div className="ml-badge-name">{a.name}</div>
                <div className="ml-badge-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

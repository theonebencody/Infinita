import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { SEED_DATA, getDistinctValues } from '../data/launchDatabase.js'

// ── Provider color palette (deterministic from design tokens) ──
const PROVIDER_COLORS = {
  SpaceX: '#4fc3f7', NASA: '#b388ff', ULA: '#7dcfff', ESA: '#bb9af7',
  CNSA: '#ff9e64', ISRO: '#e0af68', JAXA: '#7aa2f7', Roscosmos: '#f87171',
  'Rocket Lab': '#4ade80', 'Blue Origin': '#38bdf8', Firefly: '#fbbf24',
  Astra: '#f472b6', Relativity: '#a78bfa',
}
function provColor(p) { return PROVIDER_COLORS[p] || '#9e9e9e' }

// ── Simplified world map paths (major landmasses) ──
const MAP_PATHS = [
  // North America
  'M50,28 L55,25 L70,22 L80,20 L90,22 L95,28 L90,35 L85,38 L78,42 L72,38 L65,40 L58,38 L52,35 Z',
  // South America
  'M70,48 L75,45 L80,48 L82,55 L80,62 L76,68 L72,72 L68,65 L66,58 L68,52 Z',
  // Europe
  'M115,22 L120,20 L130,20 L135,22 L132,28 L125,30 L118,28 L115,25 Z',
  // Africa
  'M115,35 L125,32 L135,35 L140,42 L138,52 L132,58 L125,60 L118,55 L115,48 L112,42 Z',
  // Asia
  'M135,18 L150,15 L170,16 L180,20 L185,25 L180,30 L170,32 L160,35 L150,30 L140,28 L135,22 Z',
  // Australia
  'M170,55 L180,52 L185,55 L183,60 L178,63 L172,60 Z',
]

// ── Lat/lon to map x,y (equirectangular) ──
function geoToXY(lat, lon, w, h) {
  return { x: ((lon + 180) / 360) * w, y: ((90 - lat) / 180) * h }
}

// ── Tooltip component ──
function Tooltip({ tip }) {
  if (!tip) return null
  return (
    <div className="stats-tooltip" style={{ left: tip.x, top: tip.y }}>
      <div className="stats-tooltip-title">{tip.title}</div>
      <div className="stats-tooltip-value">{tip.value}</div>
    </div>
  )
}

// ── Scroll-into-view animation hook ──
function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}


export default function StatsPage({ open, onFilterYear, onFilterSite }) {
  const [tip, setTip] = useState(null)

  const ref1 = useScrollReveal()
  const ref2 = useScrollReveal()
  const ref3 = useScrollReveal()
  const ref4 = useScrollReveal()

  // ── 1. Launch frequency by year, stacked by provider ──
  const { yearData, allYears, allProviders, maxPerYear } = useMemo(() => {
    const provs = getDistinctValues(SEED_DATA, 'provider')
    const byYear = {}
    SEED_DATA.forEach(r => {
      const y = r.launch_date.slice(0, 4)
      if (!byYear[y]) byYear[y] = {}
      byYear[y][r.provider] = (byYear[y][r.provider] || 0) + 1
    })
    const years = Object.keys(byYear).sort()
    let max = 0
    years.forEach(y => { const t = Object.values(byYear[y]).reduce((a, b) => a + b, 0); if (t > max) max = t })
    return { yearData: byYear, allYears: years, allProviders: provs, maxPerYear: max }
  }, [])

  // ── 2. Success rate over time ──
  const successData = useMemo(() => {
    const sorted = [...SEED_DATA].sort((a, b) => a.launch_date.localeCompare(b.launch_date))
    const points = []
    const window = 10
    for (let i = window - 1; i < sorted.length; i++) {
      const slice = sorted.slice(i - window + 1, i + 1)
      const succ = slice.filter(r => r.outcome === 'success').length
      const rate = Math.round((succ / window) * 100)
      points.push({ date: sorted[i].launch_date, year: sorted[i].launch_date.slice(0, 4), rate, name: sorted[i].mission_name, outcome: sorted[i].outcome })
    }
    return points
  }, [])

  const failureAnnotations = useMemo(() =>
    successData.filter(p => p.outcome === 'failure').map(p => ({ ...p, label: p.name })),
  [successData])

  // ── 3. Launch sites ──
  const siteData = useMemo(() => {
    const sites = {}
    SEED_DATA.forEach(r => {
      const key = r.launch_site
      if (!sites[key]) sites[key] = { name: key, lat: r.launch_site_lat, lon: r.launch_site_lon, count: 0 }
      sites[key].count++
    })
    return Object.values(sites).sort((a, b) => b.count - a.count)
  }, [])
  const maxSiteCount = Math.max(...siteData.map(s => s.count), 1)

  // ── 4. Rocket comparison ──
  const rocketData = useMemo(() => {
    const rockets = {}
    SEED_DATA.forEach(r => {
      if (!rockets[r.rocket_name]) rockets[r.rocket_name] = { name: r.rocket_name, launches: 0, successes: 0, lastYear: 0 }
      rockets[r.rocket_name].launches++
      if (r.outcome === 'success') rockets[r.rocket_name].successes++
      const y = parseInt(r.launch_date.slice(0, 4))
      if (y > rockets[r.rocket_name].lastYear) rockets[r.rocket_name].lastYear = y
    })
    return Object.values(rockets).sort((a, b) => b.launches - a.launches).slice(0, 5)
  }, [])
  const maxRocketLaunches = Math.max(...rocketData.map(r => r.launches), 1)

  const showTip = useCallback((e, title, value) => {
    setTip({ x: e.clientX, y: e.clientY, title, value })
  }, [])

  const hideTip = useCallback(() => setTip(null), [])

  // ── Bar chart dims ──
  const barW = 700, barH = 200, barPad = 40
  const barGap = 4
  const bw = Math.max(8, (barW - barPad * 2) / allYears.length - barGap)

  // ── Line chart dims ──
  const lineW = 700, lineH = 200, linePad = 40

  // ── Map dims ──
  const mapW = 700, mapH = 350

  return (
    <div className={`stats-page${open ? ' open' : ''}`}>
      <div className="stats-header">
        <div className="stats-title">Statistics</div>
      </div>

      <div className="stats-body">

        {/* ── 1. Launch Frequency ── */}
        <section ref={ref1} className="stats-section" aria-label="Launch frequency by year">
          <div className="stats-section-title">Launch Frequency</div>
          <div className="stats-section-sub">Launches per year, colored by provider</div>
          <div className="sr-only">{allYears.map(y => {
            const total = Object.values(yearData[y]).reduce((a, b) => a + b, 0)
            return `${y}: ${total} launches. `
          }).join('')}</div>
          <div className="stats-bar-chart">
            <svg viewBox={`0 0 ${barW} ${barH + 30}`} role="img" aria-label="Bar chart of launches per year">
              {allYears.map((y, i) => {
                const x = barPad + i * (bw + barGap)
                let cumH = 0
                const total = Object.values(yearData[y]).reduce((a, b) => a + b, 0)
                const segments = allProviders.filter(p => yearData[y]?.[p]).map(p => {
                  const count = yearData[y][p]
                  const h = (count / maxPerYear) * (barH - 20)
                  const seg = { p, count, h, yOff: cumH }
                  cumH += h
                  return seg
                })
                return (
                  <g key={y} className="stats-bar" tabIndex={0} role="button" aria-label={`${y}: ${total} launches`}
                    onClick={() => onFilterYear?.(y)}
                    onMouseMove={e => showTip(e, y, `${total} launches`)} onMouseLeave={hideTip}>
                    {segments.map((s, j) => (
                      <rect key={j} x={x} y={barH - s.yOff - s.h} width={bw} height={Math.max(1, s.h)}
                        rx={1} fill={provColor(s.p)} />
                    ))}
                    <text className="stats-bar-label" x={x + bw / 2} y={barH + 14} textAnchor="middle">{y.slice(2)}</text>
                    <text className="stats-bar-value" x={x + bw / 2} y={barH - cumH - 4} textAnchor="middle">{total}</text>
                  </g>
                )
              })}
              {/* Y axis */}
              <line x1={barPad - 4} y1={0} x2={barPad - 4} y2={barH} stroke="var(--color-border-muted)" />
              {[0, 0.25, 0.5, 0.75, 1].map(f => (
                <text key={f} className="stats-axis-label" x={barPad - 8} y={barH - f * (barH - 20)} textAnchor="end" dominantBaseline="middle">
                  {Math.round(f * maxPerYear)}
                </text>
              ))}
            </svg>
          </div>
          {/* Provider legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: '12px' }}>
            {allProviders.filter(p => SEED_DATA.some(r => r.provider === p)).map(p => (
              <span key={p} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: provColor(p), display: 'inline-block' }} />{p}
              </span>
            ))}
          </div>
        </section>

        {/* ── 2. Success Rate Over Time ── */}
        <section ref={ref2} className="stats-section" aria-label="Success rate over time">
          <div className="stats-section-title">Success Rate</div>
          <div className="stats-section-sub">Rolling {10}-launch success rate</div>
          <div className="sr-only">Success rate ranges from {Math.min(...successData.map(p => p.rate))}% to {Math.max(...successData.map(p => p.rate))}%.</div>
          <div className="stats-line-chart">
            <svg viewBox={`0 0 ${lineW} ${lineH + 30}`} role="img" aria-label="Line chart of launch success rate">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(v => {
                const y = linePad + (1 - v / 100) * (lineH - linePad * 2)
                return <g key={v}>
                  <line className="stats-line-grid" x1={linePad} y1={y} x2={lineW - 10} y2={y} />
                  <text className="stats-axis-label" x={linePad - 6} y={y} textAnchor="end" dominantBaseline="middle">{v}%</text>
                </g>
              })}
              {/* Line + area */}
              {(() => {
                const pts = successData.map((p, i) => {
                  const x = linePad + (i / (successData.length - 1)) * (lineW - linePad - 10)
                  const y = linePad + (1 - p.rate / 100) * (lineH - linePad * 2)
                  return { x, y, ...p }
                })
                const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
                const areaPath = linePath + ` L${pts[pts.length - 1].x},${lineH - linePad} L${pts[0].x},${lineH - linePad} Z`
                return <>
                  <path className="stats-line-area" d={areaPath} fill="var(--color-success)" />
                  <path className="stats-line-path" d={linePath} stroke="var(--color-success)" />
                  {pts.map((p, i) => (
                    <circle key={i} className="stats-line-dot" cx={p.x} cy={p.y} r={3}
                      fill={p.outcome === 'failure' ? 'var(--color-failure)' : 'var(--color-success)'}
                      stroke="var(--color-bg-base)" strokeWidth={1.5}
                      onMouseMove={e => showTip(e, p.name, `${p.rate}% (${p.year})`)} onMouseLeave={hideTip}>
                      <title>{p.name}: {p.rate}% success rate</title>
                    </circle>
                  ))}
                  {/* Failure annotations */}
                  {failureAnnotations.map((a, i) => {
                    const pt = pts.find(p => p.date === a.date)
                    if (!pt) return null
                    return <g key={i}>
                      <line x1={pt.x} y1={pt.y - 8} x2={pt.x} y2={pt.y - 20} stroke="var(--color-failure)" strokeWidth={1} opacity={0.5} />
                      <text className="stats-line-annotation" x={pt.x} y={pt.y - 22}>{a.label.length > 15 ? a.label.slice(0, 15) + '...' : a.label}</text>
                    </g>
                  })}
                </>
              })()}
            </svg>
          </div>
        </section>

        {/* ── 3. Launch Site Map ── */}
        <section ref={ref3} className="stats-section" aria-label="Launch sites world map">
          <div className="stats-section-title">Launch Sites</div>
          <div className="stats-section-sub">Click a site to filter launches</div>
          <div className="sr-only">{siteData.map(s => `${s.name}: ${s.count} launches. `).join('')}</div>
          <div className="stats-map">
            <svg viewBox={`0 0 ${mapW} ${mapH}`} role="img" aria-label="World map with launch site markers">
              {/* Background */}
              <rect width={mapW} height={mapH} fill="var(--color-bg-deep)" rx={8} />
              {/* Simplified landmasses */}
              {MAP_PATHS.map((d, i) => <path key={i} className="stats-map-land" d={d} />)}
              {/* Grid lines */}
              {[0, 30, 60, 90, 120, 150].map(lon => {
                const x = ((lon + 180) / 360) * mapW
                return <line key={`lon${lon}`} x1={x} y1={0} x2={x} y2={mapH} stroke="rgba(79,195,247,0.04)" />
              })}
              {[0, 30, 60, -30, -60].map(lat => {
                const y = ((90 - lat) / 180) * mapH
                return <line key={`lat${lat}`} x1={0} y1={y} x2={mapW} y2={y} stroke="rgba(79,195,247,0.04)" />
              })}
              {/* Site markers */}
              {siteData.map(s => {
                const { x, y } = geoToXY(s.lat, s.lon, mapW, mapH)
                const r = 4 + (s.count / maxSiteCount) * 12
                return (
                  <g key={s.name} className="stats-map-marker" tabIndex={0} role="button"
                    aria-label={`${s.name}: ${s.count} launches`}
                    onClick={() => onFilterSite?.(s.name)}
                    onMouseMove={e => showTip(e, s.name, `${s.count} launches`)} onMouseLeave={hideTip}>
                    <circle cx={x} cy={y} r={r} fill="var(--color-accent-primary)" opacity={0.15} />
                    <circle cx={x} cy={y} r={r * 0.5} fill="var(--color-accent-primary)" opacity={0.6} />
                    <circle cx={x} cy={y} r={2.5} fill="var(--color-accent-primary)" />
                  </g>
                )
              })}
            </svg>
          </div>
        </section>

        {/* ── 4. Rocket Comparison ── */}
        <section ref={ref4} className="stats-section" aria-label="Top rockets comparison">
          <div className="stats-section-title">Top Rockets</div>
          <div className="stats-section-sub">Most-launched vehicles in the database</div>
          <div className="sr-only">{rocketData.map(r => `${r.name}: ${r.launches} launches, ${Math.round(r.successes / r.launches * 100)}% success rate. `).join('')}</div>
          <div className="stats-rockets">
            {rocketData.map(r => {
              const rate = Math.round((r.successes / r.launches) * 100)
              const barH = (r.launches / maxRocketLaunches) * 100
              const active = r.lastYear >= 2024
              return (
                <div key={r.name} className="stats-rocket-card">
                  <div className="stats-rocket-bar-wrap">
                    <div className="stats-rocket-bar" style={{ height: `${barH}%` }} />
                  </div>
                  <div className="stats-rocket-name">{r.name}</div>
                  <div className="stats-rocket-stat"><span>Launches</span><span className="stats-rocket-stat-val">{r.launches}</span></div>
                  <div className="stats-rocket-stat"><span>Success</span><span className="stats-rocket-stat-val">{rate}%</span></div>
                  <span className={`stats-rocket-status ${active ? 'active' : 'retired'}`}>{active ? 'Active' : 'Retired'}</span>
                </div>
              )
            })}
          </div>
        </section>

      </div>
      <Tooltip tip={tip} />
    </div>
  )
}

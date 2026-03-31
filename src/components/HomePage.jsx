import { useEffect, useRef, useState, useCallback } from 'react'

function useCounter(target, duration = 2000, active = false) {
  const [val, setVal] = useState(0)
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    if (!active) return
    if (reduced) { setVal(target); return }
    let start = null, raf = 0
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, active, reduced])
  return val
}

function useInView(threshold = 0.3) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

const HIGHLIGHTS = [
  { name: 'Starship IFT-5', year: '2024', detail: 'First booster caught at launch tower' },
  { name: 'Chandrayaan-3', year: '2023', detail: 'India lands near the lunar south pole' },
  { name: 'James Webb', year: '2021', detail: 'Most powerful space telescope ever launched' },
]

export default function HomePage({ onExplore, onLaunches }) {
  const [dataRef, dataInView] = useInView(0.2)
  const [forkRef, forkInView] = useInView(0.3)
  const count = useCounter(7223, 2500, dataInView)

  return (
    <div className="home-scroll" id="home-scroll">

      {/* ── Beat 1: Hero — title, CTA, scroll hint ── */}
      <section className="home-hero" aria-label="Welcome">
        <div className="home-hero-content">
          <div className="home-logo">INFINITA</div>
          <p className="home-hero-sub">The complete history of spaceflight</p>
          <button className="home-hero-cta" onClick={onLaunches}>
            Search Missions
          </button>
        </div>
        <div className="home-scroll-hint" aria-hidden="true">
          <div className="home-scroll-line" />
        </div>
      </section>

      {/* ── Beat 2: The scale + recent highlights ── */}
      <section ref={dataRef} className={`home-data${dataInView ? ' visible' : ''}`} aria-label="Database scale">
        <div className="home-counter">
          <span className="home-counter-num">{count.toLocaleString()}</span>
          <span className="home-counter-label">missions tracked</span>
        </div>
        <div className="home-highlights">
          {HIGHLIGHTS.map((h, i) => (
            <div key={h.name} className="home-highlight" style={{ '--h-delay': `${i * 100}ms` }}>
              <span className="home-highlight-year">{h.year}</span>
              <span className="home-highlight-name">{h.name}</span>
              <span className="home-highlight-detail">{h.detail}</span>
            </div>
          ))}
        </div>
        <noscript><p style={{ color: '#9e9e9e', textAlign: 'center' }}>7,223 missions tracked</p></noscript>
      </section>

      {/* ── Beat 3: Fork — database or 3D ── */}
      <section ref={forkRef} className={`home-fork${forkInView ? ' visible' : ''}`} aria-label="Choose your experience">
        <div className="home-fork-options">
          <button className="home-fork-btn primary" onClick={onLaunches}>
            <div className="home-fork-icon">{'\uD83D\uDCCA'}</div>
            <div className="home-fork-title">Browse the Database</div>
            <div className="home-fork-desc">Search, filter, and explore every orbital launch since 1957</div>
          </button>
          <button className="home-fork-btn" onClick={onExplore}>
            <div className="home-fork-icon">{'\uD83C\uDF0C'}</div>
            <div className="home-fork-title">Fly Through Space</div>
            <div className="home-fork-desc">Pilot a spacecraft through an accurate 3D solar system</div>
          </button>
        </div>
      </section>

    </div>
  )
}

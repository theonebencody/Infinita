import { useEffect, useRef, useState, useCallback } from 'react'

// ── Animated counter hook ──
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
      const e = 1 - Math.pow(1 - p, 3) // ease-out cubic
      setVal(Math.round(e * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, active, reduced])
  return val
}

// ── Intersection Observer hook ──
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

const ERAS = [
  { label: 'The Space Race', range: '1957 – 1975', color: '#7aa2f7', stat: '1,893 launches', desc: 'From Sputnik to Apollo — humanity\'s first steps beyond Earth. Two superpowers raced to put humans on the Moon.' },
  { label: 'Shuttle Era', range: '1981 – 2011', color: '#bb9af7', stat: '135 Shuttle missions', desc: 'The Space Shuttle made spaceflight routine, built the ISS, and launched Hubble — but at a terrible cost.' },
  { label: 'Commercial Revolution', range: '2010 – present', color: '#ff9e64', stat: '600+ reused boosters', desc: 'SpaceX proved rockets could land. Launch costs plummeted. The era of mega-constellations and private astronauts.' },
]

const FEATURED = [
  { name: 'Apollo 11', year: '1969', desc: 'First humans on the Moon', icon: '\uD83C\uDF15' },
  { name: 'STS-1 Columbia', year: '1981', desc: 'First Space Shuttle flight', icon: '\uD83D\uDE80' },
  { name: 'Falcon Heavy Demo', year: '2018', desc: 'A Tesla Roadster to Mars orbit', icon: '\u26A1' },
  { name: 'Starship IFT-5', year: '2024', desc: 'First orbital booster caught at tower', icon: '\u2B50' },
]


export default function HomePage({ onExplore, onLaunches }) {
  const [scrollRef, heroInView] = useInView(0.1)
  const [numsRef, numsInView] = useInView(0.3)
  const [eraRef, eraInView] = useInView(0.2)
  const [featRef, featInView] = useInView(0.2)
  const [ctaRef, ctaInView] = useInView(0.3)

  const launches = useCounter(7223, 2500, numsInView)
  const rockets = useCounter(230, 2000, numsInView)
  const providers = useCounter(21, 1500, numsInView)
  const countries = useCounter(12, 1500, numsInView)

  const scrollDown = useCallback(() => {
    document.getElementById('home-numbers')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="home-scroll" id="home-scroll">

      {/* ── Section 1: Hero ── */}
      <section ref={scrollRef} className="home-hero" aria-label="Welcome">
        <div className="home-hero-content">
          <h1 className="home-hero-title">INFINITA</h1>
          <p className="home-hero-sub">Every rocket launch in history, visualized</p>
          <button className="home-hero-cta" onClick={onExplore} aria-label="Start exploring the universe">
            Start Exploring
          </button>
        </div>
        <button className="home-scroll-hint" onClick={scrollDown} aria-label="Scroll to learn more">
          <span className="home-scroll-text">SCROLL</span>
          <span className="home-scroll-chevron">{'\u2304'}</span>
        </button>
      </section>

      {/* ── Section 2: The Numbers ── */}
      <section ref={numsRef} className={`home-numbers${numsInView ? ' visible' : ''}`} id="home-numbers" aria-label="Launch statistics">
        <div className="home-numbers-grid">
          <div className="home-number-card">
            <div className="home-number-val">{launches.toLocaleString()}</div>
            <div className="home-number-label">Orbital Launches</div>
          </div>
          <div className="home-number-card">
            <div className="home-number-val">{rockets}</div>
            <div className="home-number-label">Rocket Types</div>
          </div>
          <div className="home-number-card">
            <div className="home-number-val">{providers}</div>
            <div className="home-number-label">Launch Providers</div>
          </div>
          <div className="home-number-card">
            <div className="home-number-val">{countries}</div>
            <div className="home-number-label">Spacefaring Nations</div>
          </div>
        </div>
        <noscript>
          <div className="home-numbers-grid">
            <div className="home-number-card"><div className="home-number-val">7,223</div><div className="home-number-label">Orbital Launches</div></div>
            <div className="home-number-card"><div className="home-number-val">230</div><div className="home-number-label">Rocket Types</div></div>
          </div>
        </noscript>
      </section>

      {/* ── Section 3: Timeline Overview ── */}
      <section ref={eraRef} className={`home-timeline${eraInView ? ' visible' : ''}`} aria-label="Space exploration timeline">
        <h2 className="home-section-title">The Arc of Human Spaceflight</h2>
        <div className="home-era-list">
          {ERAS.map((era, i) => (
            <div key={era.label} className="home-era" style={{ '--era-color': era.color, '--era-delay': `${i * 150}ms` }}>
              <div className="home-era-accent" />
              <div className="home-era-range">{era.range}</div>
              <h3 className="home-era-label">{era.label}</h3>
              <p className="home-era-desc">{era.desc}</p>
              <div className="home-era-stat">{era.stat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Featured Launches ── */}
      <section ref={featRef} className={`home-featured${featInView ? ' visible' : ''}`} aria-label="Featured historic launches">
        <h2 className="home-section-title">Defining Moments</h2>
        <div className="home-featured-grid">
          {FEATURED.map((f, i) => (
            <div key={f.name} className="home-feat-card" style={{ '--feat-delay': `${i * 120}ms` }}>
              <div className="home-feat-icon">{f.icon}</div>
              <div className="home-feat-year">{f.year}</div>
              <div className="home-feat-name">{f.name}</div>
              <div className="home-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section ref={ctaRef} className={`home-cta${ctaInView ? ' visible' : ''}`} aria-label="Get started">
        <h2 className="home-cta-title">Ready to launch?</h2>
        <div className="home-cta-buttons">
          <button className="home-cta-btn primary" onClick={onLaunches}>Explore the Database</button>
          <button className="home-cta-btn" onClick={onExplore}>Enter the Solar System</button>
        </div>
      </section>

    </div>
  )
}

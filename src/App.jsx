import { useEffect, useRef } from 'react'

function App() {
  const canvasContainer = useRef(null)

  useEffect(() => {
    let cleanup
    import('./scene/SceneManager.js').then(m => {
      cleanup = m.init(canvasContainer.current)
    })
    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
  }, [])

  return (
    <>
      <div ref={canvasContainer} id="canvas-container" />

      <div id="splash">
        <div className="splash-inner">
          <div className="splash-title">INFINITA</div>
          <div className="splash-sub">Navigate the cosmos</div>
          <div className="splash-buttons">
            <button className="splash-btn splash-btn-primary" id="splash-explore-btn">
              <div className="splash-btn-icon">{'\u2B21'}</div>
              <div className="splash-btn-label">EXPLORE UNIVERSE</div>
              <div className="splash-btn-sub">Free-fly through space and time</div>
            </button>
            <button className="splash-btn" id="splash-launches-btn">
              <div className="splash-btn-icon">{'\uD83D\uDE80'}</div>
              <div className="splash-btn-label">LAUNCH HISTORY</div>
              <div className="splash-btn-sub">Relive humanity{"'"}s greatest missions</div>
            </button>
          </div>
        </div>
      </div>

      <div id="hud">
        <div className="crosshair"></div>

        <div className="hud-tl">
          <div className="hud-panel">
            <div className="hud-label">Velocity</div>
            <div className="hud-value large" id="hud-speed">0 m/s</div>
            <div className="hud-small" id="hud-speed-c"></div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">Distance from Sun</div>
            <div className="hud-value" id="hud-dist">0 AU</div>
            <div className="lightspeed-ref">Light travel: <span className="val" id="hud-light-time">0s</span></div>
          </div>
          <div className="nearest-body">
            <div className="hud-label">Nearest Body</div>
            <div className="nearest-name" id="hud-nearest-name">Sun</div>
            <div className="nearest-info" id="hud-nearest-info">0 AU</div>
          </div>
        </div>

        <div className="hud-tr">
          <div className="hud-panel">
            <div className="hud-label">Scale Level</div>
            <div className="hud-value" id="hud-scale">Solar System</div>
            <div className="scale-bar" id="scale-bar"></div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">Time Rate</div>
            <div className="hud-value" id="hud-time-rate">1 day/s</div>
            <div className="time-bar" id="time-bar"></div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">Simulation Date</div>
            <div className="hud-value" id="hud-date">2026.0</div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">Position (AU)</div>
            <div className="hud-small" id="hud-pos">x: 0 y: 0 z: 0</div>
          </div>
        </div>

        <div className="hud-bl">
          <button className="lh-back-btn" id="hud-back-btn" style={{marginBottom:'8px',pointerEvents:'all'}}>← BACK</button>
          <div className="hud-panel controls-help" id="controls-help">
            <span>C</span> Show all controls
          </div>
        </div>

        {/* Controls overlay */}
        <div className="controls-overlay" id="controls-overlay">
          <div className="controls-card">
            <div className="controls-card-title">CONTROLS</div>
            <div className="controls-grid">

              <div>
                <div className="ctrl-section-title">Navigation</div>
                <div className="ctrl-row"><span className="ctrl-key">W / S</span><span className="ctrl-desc">Fly forward / back</span></div>
                <div className="ctrl-row"><span className="ctrl-key">A / D</span><span className="ctrl-desc">Strafe left / right</span></div>
                <div className="ctrl-row"><span className="ctrl-key">Space</span><span className="ctrl-desc">Fly up</span></div>
                <div className="ctrl-row"><span className="ctrl-key">Shift</span><span className="ctrl-desc">Fly down</span></div>
                <div className="ctrl-row"><span className="ctrl-key">Mouse drag</span><span className="ctrl-desc">Look around</span></div>
                <div className="ctrl-row"><span className="ctrl-key">Q / E</span><span className="ctrl-desc">Roll left / right</span></div>
                <div className="ctrl-row"><span className="ctrl-key">Scroll</span><span className="ctrl-desc">Adjust speed</span></div>
                <div className="ctrl-row"><span className="ctrl-key">G</span><span className="ctrl-desc">Jump to nearest body</span></div>
              </div>

              <div>
                <div className="ctrl-section-title">Time</div>
                <div className="ctrl-row"><span className="ctrl-key">1</span><span className="ctrl-desc">0.1 day/s</span></div>
                <div className="ctrl-row"><span className="ctrl-key">2</span><span className="ctrl-desc">1 day/s</span></div>
                <div className="ctrl-row"><span className="ctrl-key">3</span><span className="ctrl-desc">10 days/s</span></div>
                <div className="ctrl-row"><span className="ctrl-key">4</span><span className="ctrl-desc">100 days/s</span></div>
                <div className="ctrl-row"><span className="ctrl-key">5</span><span className="ctrl-desc">~3 years/s</span></div>
                <div className="ctrl-row"><span className="ctrl-key">6</span><span className="ctrl-desc">~27 years/s</span></div>
                <div className="ctrl-row"><span className="ctrl-key">P</span><span className="ctrl-desc">Pause / resume time</span></div>
              </div>

              <div>
                <div className="ctrl-section-title">View</div>
                <div className="ctrl-row"><span className="ctrl-key">Tab</span><span className="ctrl-desc">Cycle scale level</span></div>
                <div className="ctrl-row"><span className="ctrl-key">H</span><span className="ctrl-desc">Toggle HUD</span></div>
                <div className="ctrl-row"><span className="ctrl-key">C</span><span className="ctrl-desc">Show / hide controls</span></div>
                <div className="ctrl-row"><span className="ctrl-key">T</span><span className="ctrl-desc">Navigation Computer</span></div>
              </div>

              <div>
                <div className="ctrl-section-title">Database {'&'} Travel</div>
                <div className="ctrl-row"><span className="ctrl-key">F</span><span className="ctrl-desc">Quick object search</span></div>
                <div className="ctrl-row"><span className="ctrl-key">R</span><span className="ctrl-desc">Random exploration mode</span></div>
                <div className="ctrl-row"><span className="ctrl-key">T</span><span className="ctrl-desc">Navigation Computer</span></div>
                <div className="ctrl-row"><span className="ctrl-key">Enter</span><span className="ctrl-desc">Travel to result</span></div>
                <div className="ctrl-row"><span className="ctrl-key">Esc</span><span className="ctrl-desc">Close / abort travel</span></div>
                <div className="ctrl-row"><span className="ctrl-key">{'\u25C8'} Panel</span><span className="ctrl-desc">Click header to collapse</span></div>
              </div>

            </div>
            <div className="controls-footer">PRESS C OR ESC TO CLOSE</div>
          </div>
        </div>

        {/* Search overlay */}
        <div className="search-overlay">
          <div className="search-panel" id="search-panel">
            <div className="search-title">Object Database Search</div>
            <input type="text" className="search-input" id="search-input" placeholder="Search stars, exoplanets, planets..." autoComplete="off" spellCheck="false" />
            <div className="search-results" id="search-results"></div>
            <div className="search-hint">ESC / F to close {'\u00A0'}{'\u00B7'}{'\u00A0'} Enter or click to travel {'\u00A0'}{'\u00B7'}{'\u00A0'} Powered by SIMBAD (~15M objects)</div>
          </div>
        </div>
      </div>

      {/* Travel Panel */}
      <div className="travel-panel" id="travel-panel">
        <div className="travel-card">
          <div className="travel-card-title">NAVIGATION COMPUTER</div>
          <div className="travel-section">
            <div className="travel-section-label">Destination</div>
            <input className="travel-dest-input" id="travel-dest-input" placeholder="Search star, planet, galaxy\u2026" autoComplete="off" spellCheck="false" />
            <div className="travel-dest-results" id="travel-dest-results"></div>
            <div className="travel-dest-confirmed" id="travel-dest-confirmed">
              <div className="travel-dest-confirmed-name" id="travel-dest-name">{'\u2014'}</div>
              <div className="travel-dest-confirmed-info" id="travel-dest-info"></div>
            </div>
          </div>
          <div className="travel-section">
            <div className="travel-section-label">Travel Speed</div>
            <div className="travel-speeds-grid" id="travel-speeds-grid"></div>
          </div>
          <div className="travel-engage-row">
            <button className="travel-engage-btn" id="travel-engage-btn" disabled>ENGAGE</button>
          </div>
          <div className="travel-panel-footer">T / ESC to close {'\u00A0'}{'\u00B7'}{'\u00A0'} ESC to abort during flight</div>
        </div>
      </div>

      {/* Travel flight HUD */}
      <div className="travel-hud" id="travel-hud">
        <div className="travel-hud-dest" id="travel-hud-dest">{'\u2014'}</div>
        <div className="travel-hud-stats">
          <div className="travel-hud-stat">SPD <span id="t-spd">0</span></div>
          <div className="travel-hud-stat">DIST <span id="t-dist">{'\u2014'}</span></div>
          <div className="travel-hud-stat">ETA <span id="t-eta">{'\u2014'}</span></div>
        </div>
        <button className="travel-abort-btn" id="travel-abort-btn">ABORT</button>
      </div>

      {/* Warp effect overlay */}
      <div id="warp-overlay"></div>

      {/* Explore Mode HUD */}
      <div id="explore-hud">
        <span className="exp-icon">{'\u2B21'}</span>
        <span className="exp-label">Auto-Explore</span>
        <span className="exp-sep">{'\u00B7'}</span>
        <span id="exp-dest" className="exp-dest">{'\u2014'}</span>
        <span className="exp-sep">{'\u00B7'}</span>
        <span id="exp-status" className="exp-status">{'\u2014'}</span>
        <button className="exp-stop" id="explore-stop-btn">{'\u25A0'} STOP</button>
      </div>

      {/* UFO Alert */}
      <div id="ufo-alert">
        <span className="ufo-msg">UNIDENTIFIED CRAFT DETECTED</span>
      </div>

      {/* Launch History Overlay */}
      <div id="launch-history" className="lh-overlay">
        <div className="lh-header">
          <button className="lh-back-btn" id="lh-back-btn">{'\u2190'} BACK</button>
          <div className="lh-title">LAUNCH HISTORY</div>
          <div className="lh-filter-row">
            <button className="lh-filter-btn active" data-org="All">ALL</button>
            <button className="lh-filter-btn" data-org="NASA">NASA</button>
            <button className="lh-filter-btn" data-org="SpaceX">SPACEX</button>
            <button className="lh-filter-btn" data-org="Soviet">SOVIET</button>
            <button className="lh-filter-btn" data-org="CNSA">CHINA</button>
            <button className="lh-filter-btn" data-org="ESA/NASA">ESA</button>
            <button className="lh-filter-btn" data-org="ISRO">INDIA</button>
          </div>
        </div>
        <div className="lh-body">
          <div className="lh-left" id="lh-mission-list"></div>
          <div className="lh-center"><canvas id="earth-canvas"></canvas></div>
          <div className="lh-right" id="lh-detail-panel">
            <div className="lh-detail-empty">SELECT A MISSION<br />TO VIEW DETAILS</div>
          </div>
        </div>
      </div>

      {/* Fun Facts Panel */}
      <div id="facts-panel">
        <div className="facts-card">
          <div className="facts-hdr" id="facts-toggle-btn">
            <div className="facts-hdr-title"><span className="facts-hdr-icon">{'\u25C8'}</span>Stellar Intelligence</div>
            <span className="facts-chevron">{'\u25BC'}</span>
          </div>
          <div className="facts-body">
            <div className="facts-inner">
              <div id="facts-badge" className="facts-badge nearby">{'\u25C9'} Nearby</div>
              <div id="facts-obj-name" className="facts-obj-name">{'\u2014'}</div>
              <div id="facts-text" className="facts-text"></div>
              <div id="facts-footer" className="facts-footer"></div>
              <button id="facts-suggest-btn" className="facts-suggest-btn" style={{display:'none'}}>{'\u2605'} TRAVEL HERE {'\u2192'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div id="mobile-controls">
        <div className="mobile-joystick" id="joystick-area">
          <div className="joystick-knob" id="joystick-knob"></div>
        </div>
        <div className="mobile-action-bar">
          <button className="mob-btn" id="mob-search" title="Search">F</button>
          <button className="mob-btn" id="mob-nav" title="Navigation">T</button>
          <button className="mob-btn" id="mob-explore" title="Explore">R</button>
          <button className="mob-btn" id="mob-scale" title="Scale">TAB</button>
          <button className="mob-btn" id="mob-nearest" title="Nearest">G</button>
          <button className="mob-btn" id="mob-time" title="Time">P</button>
        </div>
      </div>
      <div className="mobile-speed-area" id="mobile-speed">
        <button className="mob-speed-btn" id="mob-speed-up">+</button>
        <div className="mob-speed-label" id="mob-speed-label">SPD</div>
        <button className="mob-speed-btn" id="mob-speed-down">-</button>
      </div>

      <div id="labels" />
    </>
  )
}

export default App

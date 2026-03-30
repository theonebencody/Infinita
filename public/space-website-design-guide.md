# Design & UX Guide: 3D Interactive Space Exploration Website with Launch History Database

## Purpose of This Document

This document is a comprehensive design and UX reference for overhauling a 3D interactive space exploration website that includes a rocket launch history database. It synthesizes current (2025–2026) best practices across web design trends, 3D performance, data-heavy UI patterns, scrollytelling, accessibility, micro-interactions, gamification, and color theory — all calibrated for a space-themed experience targeting a broad user base.

Use this as a single source of truth when making architectural, visual, and interaction design decisions.

---

## 1. Design Philosophy: The Dual-Mode Experience

The site has two fundamental modes that must coexist harmoniously:

**Exploration Mode** — The immersive, 3D cinematic experience where users fly through space, orbit planets, and visually witness launch events. This is the emotional hook. It should feel like stepping into a planetarium or a mission control room.

**Database Mode** — The structured, searchable, filterable launch history database. This is the utility layer. It should feel as fast and precise as a well-built dashboard — think Bloomberg Terminal aesthetics meets NASA's clean data presentation.

The key design challenge is making the transition between these two modes feel seamless rather than jarring. The 3D experience should naturally lead users into the data, and the data should be able to launch users back into 3D context (e.g., clicking a launch record could fly the camera to the launch site or show the rocket's trajectory in 3D space).

---

## 2. Visual Identity & Color System

### 2.1 Dark Theme as Foundation

A space website demands a dark-first design. Deep blacks and dark blues form the cosmic canvas. But "dark theme" does not mean "low contrast" — this is where most space-themed sites fail.

**Primary Background Palette:**
- Deep space black: `#0a0a0f` to `#0d1117`
- Nebula dark blue: `#0b1528` to `#111d35`
- Panel/card surfaces: `#1a1a2e` to `#16213e` (slightly elevated from background to create depth)

**Accent Colors (functional, not decorative):**
- Launch success: A warm, luminous green — not neon, think bioluminescent. `#00d26a` or similar
- Launch failure: A muted warm red — informative, not alarming. `#ff6b6b`
- Partial success/anomaly: Amber/gold `#ffc107`
- Interactive highlight / primary action: Electric blue `#4fc3f7` or cyan `#00bcd4`
- Secondary accent: Soft violet/purple `#b388ff` — evokes nebulae and gives the palette warmth

**Typography Colors:**
- Primary text: `#e0e0e0` to `#f5f5f5` (never pure white `#ffffff` on dark backgrounds — it causes eye strain and halation)
- Secondary/muted text: `#9e9e9e` to `#b0b0b0`
- Disabled/tertiary: `#616161`

### 2.2 WCAG Compliance on Dark Backgrounds

Dark themes are notoriously harder to make accessible than light themes. WCAG 2.1 AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text and UI components.

Key rules:
- Always test every text/background combination with a contrast checker. Light gray text on dark blue backgrounds is the most common failure point.
- For body text on dark backgrounds, err toward contrast ratios of 7:1+ (AAA level) — dark themes cause more eye fatigue, so higher contrast compensates.
- Never rely solely on color to convey meaning (e.g., launch success vs. failure). Always pair color with icons, labels, or patterns. Roughly 8% of men and 0.5% of women have some form of color vision deficiency.
- Provide a light-mode toggle. Some users (especially those with astigmatism or dyslexia) genuinely read better with dark text on light backgrounds.

### 2.3 Typography

Use a modern, highly legible sans-serif font stack. For a space/tech aesthetic:

- **Headings:** A geometric sans-serif like Inter, Space Grotesk, or Outfit. These convey precision and modernity without feeling cold.
- **Body text:** Inter or system font stack for maximum performance and readability: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`
- **Data/monospace (for launch IDs, timestamps, coordinates):** JetBrains Mono, Fira Code, or Source Code Pro

Typography hierarchy should be dramatic. 2026 design trends emphasize exaggerated scale contrast — oversized hero headings paired with smaller body text creates visual energy. A launch count hero stat reading "7,476 MISSIONS" in a massive display font immediately communicates scale and importance.

---

## 3. Layout Architecture & Navigation

### 3.1 The Landing Experience

The first 3 seconds determine whether a user stays or bounces. The landing page should be a full-viewport 3D scene — a slowly rotating Earth, a star field with parallax depth, or an animated rocket trajectory. Overlay minimal UI: the site title, a single call-to-action ("Explore the Universe" or "Search Launches"), and a subtle scroll indicator.

Do not gate the experience behind a loading screen with a percentage counter. Instead, show the starfield and basic UI immediately (these are lightweight), then progressively load the 3D models and textures in the background. The user sees something beautiful within 1 second; the full experience loads within 3–5.

### 3.2 Navigation Paradigm

Avoid traditional top nav bars that feel disconnected from the 3D experience. Instead, consider:

**Floating Command Palette / Search Bar:** A single, prominent search input (like Spotlight/⌘K pattern) that is always accessible. Users can type a rocket name, launch date, mission name, or destination planet and get instant results. This serves both casual users ("show me SpaceX launches") and power users ("Falcon 9 Block 5 2024 Starlink").

**Contextual Side Panel:** When a user clicks on a 3D object (planet, launch trajectory, rocket) or a search result, a panel slides in from the right with detailed information. This keeps the 3D context visible in the background.

**Bottom Navigation Bar (mobile) / Sidebar Icons (desktop):** Minimal icon-based navigation for switching between core sections: Explore (3D view), Launches (database), Timeline, Statistics, and Settings.

**Breadcrumb Trails in 3D:** When a user navigates from the solar system view → Earth → Cape Canaveral → specific launch, maintain a visual breadcrumb trail so they can zoom back out at any level.

### 3.3 Responsive Design: Mobile Is Not Optional

Over 60% of web traffic is mobile. A 3D space site presents unique mobile challenges:

- **Touch-optimized 3D controls:** Replace mouse-hover interactions with tap-to-select. Use pinch-to-zoom and swipe-to-rotate. Provide a visible compass/gyroscope widget so users know how to navigate.
- **Simplified 3D on mobile:** Reduce polygon counts, disable post-processing effects (bloom, depth of field), and use lower-resolution textures. Detect device capability with `navigator.hardwareConcurrency` and `GPU` estimation.
- **Data tables → Card layout:** On mobile, transform the launch database table into swipeable cards with expandable detail sections. Tables with more than 3–4 columns become unreadable on small screens.
- **Bottom sheet pattern:** Use slide-up bottom sheets for detail views instead of full-page navigations. This preserves the user's context and sense of place.

---

## 4. The 3D Experience: Technical & Design Best Practices

### 4.1 Technology Foundation

**Three.js** remains the dominant framework for 3D web experiences in 2026. Key decisions:

- **Renderer choice:** Three.js now supports WebGPU (since r171) with automatic WebGL 2 fallback. Use the `WebGPURenderer` for modern browsers — it offers significantly better performance for complex scenes. But always test the WebGL fallback path.
- **React integration:** If using React, `@react-three/fiber` and `@react-three/drei` provide declarative 3D with React's component model. Lazy-load the 3D canvas component so it doesn't block initial page render.
- **Animation library:** GSAP (GreenSock) handles scroll-based animations with the highest performance. Use it for scroll-triggered 3D camera movements and UI transitions.

### 4.2 Performance Optimization (Critical)

A 3D space scene can easily tank performance. Every millisecond of load delay reduces engagement. Target: 60 FPS on mid-range devices, graceful degradation to 30 FPS on low-end.

**Asset Optimization:**
- Use glTF format for all 3D models (not OBJ or COLLADA). Compress with Draco — it can reduce file sizes to under 10% of the original.
- Use KTX2 texture compression. For space textures (planet surfaces, star fields), this dramatically reduces memory footprint.
- Implement Level of Detail (LOD): show high-poly planet models only when zoomed in close. At solar-system scale, planets can be simple spheres with texture maps.

**Rendering Optimization:**
- Target under 100 draw calls per frame. Use instancing for repeated objects (stars, asteroid particles, satellite constellations).
- Implement frustum culling — don't render objects outside the camera's view.
- Use `OffscreenCanvas` + Web Workers to move the render loop off the main thread. This prevents 3D rendering from blocking UI interactions and scroll performance.
- Set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — high-DPI screens (3x, 4x) cause massive performance hits with negligible visual improvement beyond 2x.

**Loading Strategy:**
- Show a lightweight star field (CSS or canvas-based) immediately on page load.
- Lazy-load Three.js and heavy 3D assets only when the user scrolls to or clicks into the 3D section.
- Use progressive loading: load low-res planet textures first (visible within 1 second), then swap in high-res textures once downloaded.
- Preload assets for the next likely navigation path (e.g., if the user is browsing Earth, start loading Mars assets).

### 4.3 3D Interaction Design

- **Camera movement should feel physical.** Use smooth easing (not linear interpolation) for all camera transitions. When zooming from the solar system to a specific launch pad, the motion should feel like a cinematic dolly shot — accelerating, cruising, then decelerating. GSAP's `power2.inOut` or custom cubic-bezier curves work well.
- **Objects should react to the cursor.** Planets glow subtly brighter on hover. Launch trajectories highlight. Rockets tilt slightly toward the cursor. These micro-interactions make the 3D scene feel alive rather than like a static diorama.
- **Always provide an escape hatch.** If a user gets lost in 3D space (zoomed too far, rotated to a disorienting angle), provide a "Reset View" button that smoothly animates back to a known-good camera position.
- **Visual onboarding for first-time users.** On first visit, show a brief (3–5 second) animated hint: a small hand icon demonstrating click-and-drag to rotate, scroll to zoom. Dismiss automatically after the user's first interaction. Don't use a modal — overlay it directly on the 3D scene.
- **Orbit controls as default.** OrbitControls (from Three.js) is the most intuitive for non-gamers. The center of rotation should be contextual — when viewing a planet, orbit around the planet; when viewing the solar system, orbit around the sun.

---

## 5. The Launch Database: Data-Heavy UX Done Right

### 5.1 Information Architecture

Organize the launch database around these primary dimensions, each of which should be a filterable/sortable axis:

- **Time:** Launch date/year — this is the primary axis for most users
- **Vehicle:** Rocket family and variant (Falcon 9, Atlas V, Soyuz, Electron, etc.)
- **Provider:** SpaceX, ULA, Roscosmos, ISRO, etc.
- **Outcome:** Success, failure, partial failure, anomaly
- **Destination/Orbit:** LEO, GTO, MEO, interplanetary, ISS resupply, etc.
- **Launch Site:** Cape Canaveral, Vandenberg, Baikonur, etc.
- **Payload Type:** Satellite (comms, Earth observation, navigation), crewed, cargo, science

### 5.2 Search & Filtering

Search is the most critical UX element for a data-heavy site. Design it for two personas simultaneously:

**Casual User (the "Googler"):** Wants to type "SpaceX 2024" or "Mars missions" and get meaningful results. The search must be fuzzy, forgiving of typos, and return blended results (launches, rockets, missions, facts).

**Power User (the "Excel Expert"):** Wants precise, multi-dimensional filtering. Provide a filter panel (collapsible sidebar on desktop, bottom sheet on mobile) with checkboxes, date range pickers, and dropdown selectors for every dimension.

**Search UX best practices:**
- Place the search bar prominently — top-center or accessible via keyboard shortcut (⌘K / Ctrl+K).
- Show results as the user types (instant/live search), not on form submit.
- Display results in a blended format: a "Top Result" card with rich detail, followed by categorized sections (Launches, Rockets, Missions).
- Remember recent searches and offer them as suggestions.
- Provide "smart filters" — when a user types "failed launches," automatically apply the outcome:failure filter.

### 5.3 Data Table Design

When displaying the full launch list in table format:

- **Default sort:** Reverse chronological (most recent first) — users care about recent launches.
- **Sticky header:** The column headers must remain visible during scroll.
- **Row density toggle:** Offer compact, comfortable, and spacious row heights. Power users want compact; casual browsers prefer spacious with imagery.
- **Essential visible columns (default):** Date, Mission Name, Rocket, Provider, Outcome (with color-coded icon), Orbit. Additional columns (launch site, payload mass, booster landing outcome) available via column picker.
- **Hover/click to expand:** On hover (desktop) or tap (mobile), show a preview card with mission patch, payload description, and a "View in 3D" button that flies the camera to that launch's trajectory.
- **Pagination vs. infinite scroll:** Use paginated results with a visible page count (e.g., "Page 3 of 156 — 7,476 launches"). Infinite scroll makes it impossible for users to find their place or share a specific position. But also provide a "Load More" option within each page for users who want to keep scrolling without clicking.
- **Color coding for outcome:** Use the accent color system (green = success, red = failure, amber = partial/anomaly), but always pair with an icon (✓, ✗, ⚠) and text label. Never rely on color alone.

### 5.4 Data Visualization

Transform raw data into visual insight. Key visualizations to include:

- **Launch frequency timeline:** A bar chart or streamgraph showing launches per month/year, colored by provider. This immediately tells the story of the space industry's acceleration.
- **Success rate over time:** A rolling line chart showing how launch reliability has improved decade over decade.
- **Launch site world map:** An interactive globe (ties into the 3D experience) with markers at every launch site, sized by launch count. Clicking a site filters the database.
- **Rocket comparison cards:** Side-by-side visual comparisons of rocket height, payload capacity, cost per kg to orbit, and launch count. Use proportional illustrations, not just numbers.
- **Orbital destination sunburst:** A radial chart showing the distribution of launches by destination orbit (LEO, GTO, interplanetary, etc.).

All visualizations should be interactive — hover for detail, click to filter the database. They serve as both eye candy and navigation.

---

## 6. Scrollytelling: Telling the Story of Space Exploration

Scrollytelling turns passive browsing into an active, narrative experience. For a space site, this is where you create emotional connection and hook non-expert users.

### 6.1 Where to Use Scrollytelling

- **The homepage journey:** As users scroll from the landing 3D scene, transition through key eras of space exploration — the Space Race, the Shuttle era, the commercial revolution, the Starship age. Each era gets a section with a 3D scene transition, key stats, and 2–3 highlighted launches.
- **Individual mission deep-dives:** For historically significant launches (Apollo 11, Challenger, Falcon Heavy demo, Starship's first orbital flight), create scrollytelling experiences with scroll-synchronized 3D animations of the flight profile.
- **Data stories:** "The Year SpaceX Launched Every 3 Days" — use scroll-triggered chart animations to reveal data progressively, turning statistics into narrative.

### 6.2 Scrollytelling Best Practices

- **Restraint beats spectacle.** Not every section needs animation. Let the data and imagery carry weight; use motion only when it adds understanding (e.g., showing a rocket's ascent profile) or emotion (e.g., a slow fade to a memorial section for lost crews).
- **Pace the reveals.** Each scroll "beat" should introduce one new piece of information — a stat, an image, a 3D transition. Don't overwhelm with simultaneous reveals.
- **Provide navigation landmarks.** Use a progress indicator (dots, timeline ticks, or a minimap) so users know where they are in the story and can jump ahead or back.
- **Ensure scroll-triggered animations have fallbacks.** If JavaScript fails to load, content should still be visible and readable as a static page. Use Intersection Observer for efficient, non-blocking scroll detection.
- **Test on mobile.** Scroll-triggered 3D transitions are the most likely thing to cause jank on mobile. Simplify or replace 3D transitions with image sequences or CSS animations on low-powered devices.
- **Respect `prefers-reduced-motion`.** Some users have vestibular disorders that make scroll-triggered animations physically uncomfortable. Detect this CSS media query and disable parallax/motion effects, replacing them with simple fade-in reveals.

---

## 7. Micro-Interactions & Delightful Details

Micro-interactions are the difference between a website that "works" and one that "feels alive." For a space site, they reinforce the theme and make every interaction satisfying.

### 7.1 Purposeful Micro-Interactions

- **Buttons glow on hover** like instrument panels. A subtle radial glow behind the button, with a smooth ease-in transition (~200ms).
- **Loading states use thematic animations:** A tiny orbiting satellite, a pulsing star, or a rocket exhaust particle effect. Never a generic spinner.
- **Successful actions trigger a brief particle burst** — a small spray of stars or sparks. Used sparingly (form submissions, filter applications, favoriting a launch), this creates a moment of delight without slowing the user down.
- **Data table rows highlight with a subtle glow trail** on hover, like a scanning laser moving across a display panel.
- **Scroll progress indicators** could be styled as a rocket ascending a vertical track, or a trajectory line being drawn across the viewport.
- **Toast notifications** slide in from the top with a brief "transmission received" style — a thin border animation that fills like a progress bar before the toast auto-dismisses.

### 7.2 The Rules of Micro-Interactions

- **Every animation must serve a purpose:** feedback, guidance, or spatial orientation. If an animation is purely decorative and doesn't help the user understand what just happened, remove it.
- **Keep them fast.** Hover effects: 100–200ms. Transitions between states: 200–400ms. Page-level transitions: 400–800ms. Anything over 1 second feels sluggish.
- **Consistency:** If one button glows on hover, all buttons should glow on hover. Establish a motion language and apply it everywhere.
- **Performance first.** Use CSS transforms and opacity for animations (GPU-accelerated). Avoid animating `width`, `height`, `top`, `left`, or `margin` — these trigger expensive layout recalculations.

---

## 8. Gamification & Engagement Mechanics

Gamification, when done tastefully, can transform a reference database into a place users return to regularly.

### 8.1 Appropriate Gamification for a Space Database

- **Exploration achievements:** "You've viewed launches from 10 different countries" or "You've explored every planet in the solar system." Award visual badges (styled as mission patches) that appear in a user profile panel.
- **Launch streak tracker:** For users who visit the site regularly, track their "observation streak" — how many consecutive days/weeks they've checked in. Style it as a mission log.
- **Knowledge quizzes:** Optional, non-intrusive quizzes triggered after viewing a mission detail page. "Can you guess which orbit this mission targeted?" with visual multiple-choice answers. This reinforces learning without feeling like a test.
- **Countdown to next launch:** A live (or near-live) countdown to the next scheduled launch, prominently displayed. This gives users a reason to return and creates temporal urgency.
- **Comparison challenges:** "Which rocket has more successful launches — Falcon 9 or Soyuz?" Let users guess before revealing the answer with an animated stat reveal.
- **Personalized dashboard:** Let logged-in users track favorite rockets, launch providers, or specific missions. Show a personal "mission control" with stats about their browsing (launches explored, data viewed, time spent).

### 8.2 Gamification Guardrails

- Never gate content behind gamification. All data and 3D experiences should be freely accessible.
- Keep it optional and non-intrusive. Gamification elements should be discoverable but never block the user's path.
- Avoid leaderboards unless the community is large enough — empty leaderboards feel lonely and demotivating.
- Ensure rewards feel meaningful and on-theme. Mission patch badges feel appropriate; generic "gold stars" do not.

---

## 9. Accessibility: Not Optional, Not an Afterthought

Accessibility is a legal requirement in many jurisdictions and a moral imperative everywhere. For a site aiming at a broad user base, it's also a practical necessity — poor accessibility excludes roughly 15–20% of your potential audience.

### 9.1 Core Accessibility Requirements

- **Keyboard navigation:** Every interactive element (buttons, links, filters, data table rows, search) must be reachable and operable via keyboard alone. Use visible focus indicators — a glowing ring that matches the site's accent color, with `outline-offset: 2px` so it doesn't overlap content.
- **Screen reader support:** All images need descriptive `alt` text. 3D scenes need text alternatives — provide a "Text Description" toggle that shows a written summary of what the 3D view contains. Data tables must use proper `<table>`, `<thead>`, `<th>`, and `<td>` semantics.
- **Reduced motion:** Detect `prefers-reduced-motion` and disable all parallax, scroll-triggered animations, and 3D camera movements. Replace with simple opacity transitions. This is critical — vestibular disorders can cause physical discomfort from web animations.
- **Text scaling:** The site must remain functional when browser text size is increased to 200%. Use `rem` units for all typography, not `px`.
- **Color independence:** Every piece of information conveyed by color (launch success/failure, data categories) must also be conveyed by text, icon, or pattern.

### 9.2 3D-Specific Accessibility

3D experiences are inherently inaccessible to screen reader users. Mitigate this:

- Provide a complete non-3D fallback for all information. The 3D view is an enhancement, not the only way to access data.
- Include descriptive `aria-label` attributes on the 3D canvas element (e.g., "Interactive 3D view of the solar system showing planet positions and launch trajectories").
- For keyboard users, provide arrow-key navigation between 3D objects (tab to the 3D canvas, then arrow keys to move between planets/launches, Enter to select).
- Ensure all data displayed in 3D pop-ups/tooltips is also available in the text-based database view.

---

## 10. Performance & Technical Architecture

### 10.1 Core Web Vitals Targets

Google's Core Web Vitals directly impact search ranking and user perception:

- **Largest Contentful Paint (LCP):** Under 2.5 seconds. The 3D scene should not be the LCP element — ensure a fast-loading hero image or text heading serves as LCP while 3D loads behind it.
- **First Input Delay (FID) / Interaction to Next Paint (INP):** Under 200ms. 3D rendering must not block the main thread. Use Web Workers and OffscreenCanvas.
- **Cumulative Layout Shift (CLS):** Under 0.1. Reserve explicit dimensions for the 3D canvas and all images/embeds to prevent layout shifts during loading.

### 10.2 Architecture Recommendations

- **Progressive enhancement:** The site should work (show data, allow searching) even with JavaScript disabled. The 3D layer loads on top as an enhancement.
- **Code splitting:** Split the application into chunks — the 3D engine, the database UI, the scrollytelling sections, and the visualization library should all be separate bundles loaded on demand.
- **Service worker caching:** Cache static assets (3D models, textures, icons) aggressively. For a returning user, the 3D scene should initialize almost instantly from cache.
- **CDN for assets:** Serve 3D models, textures, and media from a CDN with edge locations close to your users.
- **API design:** The launch database should be served via a paginated, filterable REST or GraphQL API. Never load the entire dataset (7,000+ launches) into the browser at once. Implement cursor-based pagination for infinite-scroll sections.

### 10.3 Mobile Performance Budget

Set a strict performance budget for mobile:

- Total JavaScript: Under 300KB gzipped (excluding lazy-loaded 3D engine)
- Total initial page weight: Under 1MB
- Time to interactive: Under 3 seconds on a mid-range phone (4G connection)
- 3D framerate: 30 FPS minimum on devices with at least 4GB RAM. Below this threshold, serve a static image with a "View in 3D" opt-in button.

---

## 11. Inspiration & Reference Sites

Study these existing sites for specific design patterns:

- **NASA's Eyes (eyes.nasa.gov):** The gold standard for accessible 3D space exploration in a browser. Study their progressive loading, camera controls, and how they layer data over 3D scenes.
- **Solar System Scope (solarsystemscope.com):** Excellent real-time 3D solar system model. Note their performance optimization and mobile fallbacks.
- **RocketLaunch.org:** Clean launch database with good filtering. Study their data structure and information hierarchy.
- **SpaceXNow (spacexnow.com):** Fan-made site with push notifications, dark mode, and filterable launch manifest. Good reference for community engagement features.
- **CSIS Aerospace Security Launch History:** Interactive chart showing Falcon 9 launch history with color-coded success/failure dots. Simple but effective data visualization.
- **The Pudding (pudding.cool):** Not space-related, but the best examples of scrollytelling and data-driven storytelling on the web. Study their pacing, visual design, and progressive data reveals.
- **Apple product pages (apple.com):** Study their scroll-triggered 3D product animations for performance optimization and cinematic camera movement techniques.

---

## 12. Implementation Priority: What to Build First

### Phase 1: Foundation (Must-Have)
1. Dark theme design system with full color palette, typography scale, and component library
2. Responsive layout with mobile-first database view (search, filter, sortable table/cards)
3. Basic 3D star field background with lightweight planet models
4. Launch database API with pagination and search
5. Keyboard accessibility and screen reader support
6. Core Web Vitals optimization

### Phase 2: Immersion (High Impact)
1. Full 3D solar system with interactive planets and orbital paths
2. Click-from-database-to-3D integration (view a launch in 3D space)
3. Scrollytelling homepage with space exploration timeline
4. Interactive data visualizations (launch frequency, success rates, world map)
5. Command palette / advanced search (⌘K pattern)
6. `prefers-reduced-motion` support and light mode toggle

### Phase 3: Engagement (Delight & Return)
1. Micro-interactions across all UI elements (hover glows, loading animations, particle effects)
2. Gamification layer (achievements, exploration tracker, quizzes)
3. Next-launch countdown with notifications
4. Personalized dashboard for returning users
5. Mission-specific scrollytelling deep-dives for historically significant launches
6. Performance polish: WebGPU renderer, OffscreenCanvas, service worker caching

---

## 13. Summary of Key Principles

1. **Performance is a feature.** A beautiful 3D scene that takes 8 seconds to load will never be seen. Optimize relentlessly. Load fast, enhance progressively.

2. **Data should be a first-class citizen.** The database is not a secondary feature hidden behind the 3D experience — it's the core value proposition. Make it searchable, filterable, and delightful to browse.

3. **Seamless dual-mode transitions.** The magic happens when 3D exploration and structured data feel like one unified experience, not two separate apps stitched together.

4. **Accessibility is the floor, not the ceiling.** Build for keyboard users, screen readers, reduced motion preferences, and color-blind users from day one. Retrofitting accessibility is always harder and more expensive.

5. **Restraint in motion.** Animate with purpose. Every scroll-triggered effect, hover state, and transition should help the user understand spatial relationships, receive feedback, or navigate — never just "look cool."

6. **Mobile is not a scaled-down desktop.** Design the mobile experience as its own first-class product with touch-optimized controls, simplified 3D, and card-based data layouts.

7. **Gamification should feel like discovery, not a game.** Achievement systems should reward genuine exploration and curiosity, not create anxiety or FOMO.

8. **Dark theme ≠ low contrast.** Space is dark, but your UI must be legible. Test every color combination against WCAG standards. When in doubt, increase contrast.

9. **Tell stories with data.** Don't just show 7,476 launches in a table. Show the arc of human spaceflight — the early failures, the breakthroughs, the commercial revolution, the push toward Mars. Data without narrative is just noise.

10. **Build for the broad audience.** A 10-year-old discovering space for the first time and a aerospace engineer verifying launch records should both feel served by this site. The casual path (explore, scroll, discover) and the power-user path (search, filter, export) should coexist without interfering.

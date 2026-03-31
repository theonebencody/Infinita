// Service Worker — Infinita
// Caches app shell + static assets with stale-while-revalidate

const CACHE_NAME = 'infinita-v1'
const APP_SHELL = ['/', '/Infinita/', '/Infinita/index.html', '/Infinita/favicon.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // Skip non-GET and cross-origin
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return

  // Static assets (fonts, images, models) — cache first
  if (/\.(woff2?|ttf|otf|png|jpg|webp|svg|glb|gltf|ktx2)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetch(e.request).then(resp => {
          const clone = resp.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          return resp
        })
      )
    )
    return
  }

  // JS/CSS — stale while revalidate
  if (/\.(js|css)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(resp => {
          const clone = resp.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          return resp
        }).catch(() => cached)
        return cached || fetchPromise
      })
    )
    return
  }

  // HTML — network first, fallback to cache
  if (e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const clone = resp.clone()
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
        return resp
      }).catch(() => caches.match(e.request))
    )
  }
})

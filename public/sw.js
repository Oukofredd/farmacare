
/* Farmacare service worker: offline app shell + runtime caching.
   Bump VERSION to clear old caches after a release. */

const VERSION = 'farmacare-v2'

// Automatically detects /farmacare/ on GitHub Pages.
const BASE = new URL('./', self.registration.scope)

const SHELL = [
  '',
  'index.html',
  'manifest.webmanifest',
  'icon.svg',
].map((path) => new URL(path, BASE).href)

const INDEX = new URL('index.html', BASE).href
const HOME = new URL('', BASE).href

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request

  if (req.method !== 'GET') return

  const url = new URL(req.url)

  if (url.origin !== self.location.origin) return

  // Handle page navigation.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(VERSION).then((cache) =>
              cache.put(INDEX, copy),
            )
          }

          return res
        })
        .catch(() =>
          caches.match(INDEX).then(
            (res) => res || caches.match(HOME),
          ),
        ),
    )

    return
  }

  // Serve cached assets immediately and refresh from the network.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone()
            caches.open(VERSION).then((cache) =>
              cache.put(req, copy),
            )
          }

          return res
        })
        .catch(() => cached)

      return cached || network
    }),
  )
})

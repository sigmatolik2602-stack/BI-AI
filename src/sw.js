const CACHE = 'bi-ai-shell-__VERSION__'
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    const page = await fetch('/', { cache: 'reload' })
    if (!page.ok) throw new Error('App shell unavailable')
    await cache.addAll(__ASSETS__)
    await cache.put('/', page)
    await self.skipWaiting()
  })())
})
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) if (key.startsWith('bi-ai-shell-') && key !== CACHE) await caches.delete(key)
  await self.clients.claim()
})()))
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')))
  } else {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request)))
  }
})

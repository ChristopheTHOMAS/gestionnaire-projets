const CACHE_NAME = 'mes-projets-v2'
const STATIC = ['/offline.html']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC).catch(() => {}))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Network-first: toujours essayer la version la plus récente en premier.
// Le cache ne sert qu'en secours si l'appareil est hors-ligne — sinon une
// ancienne version de l'appli reste coincée en mémoire après chaque mise à jour.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return

  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )
    return
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy))
        return response
      })
      .catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached
          if (event.request.mode === 'navigate') return caches.match('/offline.html')
          return Response.error()
        })
      )
  )
})

self.addEventListener('push', event => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Mes Projets', {
      body: data.body ?? 'Vous avez des tâches à faire ici.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url ?? '/dashboard' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})

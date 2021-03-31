// import workbox
importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js'
)
const { routing, strategies } = workbox

routing.registerRoute(
    ({ url }) =>
        url.origin === self.location.origin &&
        (url.pathname.startsWith('/assets/') || url.pathname === '/index.html'),
    new strategies.CacheFirst('cache-first')
)

// implements NetworkFirst to all routes
routing.registerRoute(() => true, new strategies.NetworkFirst('network-first'))

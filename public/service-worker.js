
// import workbox 	
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js')
const { routing, strategies } = workbox

routing.registerRoute(
    ({ url }) => url.origin === self.location.origin &&
        url.pathname.startsWith('/assets/'),
    new strategies.CacheFirst('cache-first')
)

// implements NetworkFirst to all routes	
routing.registerRoute(
    () => true,
    new strategies.NetworkFirst('network-first'),
)
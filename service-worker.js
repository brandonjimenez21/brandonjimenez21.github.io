// Service Worker para modo offline - OPTIMIZADO
const CACHE_NAME = 'portfolio-cache-v8';
const CACHE_IMAGES = 'portfolio-images-v1';
const CACHE_FONTS = 'portfolio-fonts-v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/scripts.js',
    '/assets/favicon.ico',
    '/manifest.json',
    '/assets/fonts/fontawesome.min.css',
    '/assets/yo.png'
];

// URLs externas importantes
const externalUrls = [
    'https://images.unsplash.com/'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Archivos en caché');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Error al cachear archivos:', error);
            })
    );
    // Activar inmediatamente el nuevo service worker
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    
    const cacheWhitelist = [CACHE_NAME, CACHE_IMAGES, CACHE_FONTS];
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Eliminar cachés que no están en la whitelist
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Service Worker: Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Tomar control inmediatamente de todas las páginas
    return self.clients.claim();
});

// Interceptar peticiones (estrategia optimizada)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Network First para HTML, CSS y JS (siempre intenta la red primero)
    const isMainResource = 
        event.request.url.includes('.html') ||
        event.request.url.includes('.css') ||
        event.request.url.includes('.js') ||
        event.request.url === self.location.origin + '/';
    
    // Cache First para imágenes
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.open(CACHE_IMAGES).then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((networkResponse) => {
                        // Solo cachear imágenes exitosas
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Placeholder para imágenes offline
                        return new Response(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f1f5f9"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b" font-family="Arial" font-size="18">Imagen no disponible</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    });
                });
            })
        );
        return;
    }
    
    // Cache First para fuentes
    if (event.request.url.includes('/fonts/') || event.request.destination === 'font') {
        event.respondWith(
            caches.open(CACHE_FONTS).then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }
    
    if (isMainResource) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cachear la nueva versión
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    // Si falla la red, usar caché como fallback
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // Cache First para otros recursos (fuentes, imágenes, etc.)
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Service Worker: Sirviendo desde caché:', event.request.url);
                    return response;
                }
                
                return fetch(event.request.clone())
                    .then((response) => {
                        // Verificar si es una respuesta válida
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        
                        // Solo cachear recursos del mismo origen y algunos externos específicos
                        const shouldCache = 
                            event.request.url.startsWith(self.location.origin) ||
                            event.request.url.includes('fonts.googleapis.com') ||
                            event.request.url.includes('fonts.gstatic.com') ||
                            event.request.url.includes('cdnjs.cloudflare.com') ||
                            event.request.url.includes('fa-');
                        
                        if (shouldCache && (response.type === 'basic' || response.type === 'cors')) {
                            // Clonar la respuesta
                            const responseToCache = response.clone();
                            
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                })
                                .catch(err => console.log('No se pudo cachear:', event.request.url));
                        }
                        
                        return response;
                    })
                    .catch((error) => {
                        console.log('Service Worker: Modo offline, buscando en caché:', event.request.url);
                        
                        // Intentar servir desde caché como fallback
                        return caches.match(event.request)
                            .then(cachedResponse => {
                                if (cachedResponse) {
                                    return cachedResponse;
                                }
                                
                                // Si es una imagen, retornar placeholder
                                if (event.request.destination === 'image') {
                                    return new Response(
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#f1f5f9"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b">Sin imagen</text></svg>',
                                        { headers: { 'Content-Type': 'image/svg+xml' } }
                                    );
                                }
                                
                                throw error;
                            });
                    });
            })
    );
});

// Escuchar mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

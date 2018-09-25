// Reference: https://developers.google.com/web/fundamentals/primers/service-workers/

const CACHE_NAME = 'restaurant-cache-1';

const filesToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

// Listens for cache install
self.addEventListener('install', (event) => {
    // Install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(filesToCache);
            })
    )
});

// Fetches cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Returns response when cache exists
                if (response) {
                    return response;
                }

                // Retrieve data from the network
                let clonedResponse = event.request.clone();

                return fetch(clonedResponse)
                    .then((response) => {
                        // Check if response is valid
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        let clonedResponseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                // Store cache
                                cache.put(event.request, clonedResponseToCache);
                            });

                        return response;
                    });
            }
        )
    )
});
/**
 * @file Service Worker para la Progressive Web App (PWA).
 * Este script se ejecuta en segundo plano y permite funcionalidades offline
 * al cachear los recursos estáticos de la aplicación.
 */

// Nombre de la caché. Se debe cambiar la versión al realizar cambios en los archivos cacheados.
const CACHE_NAME = 'home-task-manager-v1';
// Lista de URLs que se deben cachear al instalar el service worker.
const urlsToCache = [
  '/',
  '/index.html',
  // Se pueden añadir aquí otros assets estáticos como CSS, JS, imágenes, etc.
];

// Evento 'install': se dispara cuando el service worker se instala por primera vez.
self.addEventListener('install', event => {
  // `waitUntil` espera a que la promesa se resuelva antes de terminar la instalación.
  event.waitUntil(
    // Abrimos la caché con el nombre definido.
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta');
        // Añadimos todos los archivos de la lista a la caché.
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': se dispara cada vez que la aplicación realiza una petición de red.
self.addEventListener('fetch', event => {
  // `respondWith` intercepta la petición y la reemplaza con nuestra propia respuesta.
  event.respondWith(
    // Buscamos si la petición ya existe en nuestra caché.
    caches.match(event.request)
      .then(response => {
        // Si encontramos una respuesta en la caché, la devolvemos.
        if (response) {
          return response;
        }
        // Si no, realizamos la petición de red original.
        return fetch(event.request);
      }
    )
  );
});

var version = 1;

var CACHE_STATIC = 'service-worker-demo-cache-static-v' + version;
var staticResource = [
  '/',
  '/static-resources/',
  '/static-resources/style.css',
  '/static-resources/app.js',
  '/static-resources/drupal_logo.png',
  '/static-resources/drupal_logo_offline.png'
];

var CACHE_DYNAMIC = 'service-worker-cache-dyn-v' + version;
var dynamicResource = [
  '/dynamic-resources/drupal_logo.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(function(cache) {
          console.log('cache opened', cache);
          return cache.addAll(staticResource);
      })
  );

});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if(CACHE_STATIC.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }))
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log(event);
  if(!checkDynamicResource(event)) {
    event.respondWith(
      caches.open(CACHE_STATIC)
        .then(function(cache) {
          var fetchClone = event.request.clone();
          return fetch(fetchClone)
            .then(function(response) {
              console.log('fetch-event-response:', response);
              return response;
            })
            .catch(function(error) {
              console.log('fetch-event-error', error);
              return cache.match(event.request);
            })
        })
    );
  }

  function checkDynamicResource(event) {
    var reqPath = event.request.url.replace(event.request.referrer, '/');
    console.log(reqPath);
    if(dynamicResource.indexOf(reqPath) >= 0) {
      return true
    }else {
      return false;
    }
  }

});

self.addEventListener('push', function(event) {
  console.log(event);
  var title = "Hello Ping",
      message = "Notice me!";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      icon: '/static-resources/drupal_logo.png',
    }));
});

self.addEventListener('message', function(event) {

});

self.addEventListener('error', function(event) {

});

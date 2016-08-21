var CACHE_STATIC = 'service-worker-demo-cache-static-v1';
var staticResource = [
  '/',
  '/static-resources/',
  '/static-resources/style.css',
  '/static-resources/app.js',
  '/static-resources/drupal_logo.png',
  '/static-resources/drupal_logo_offline.png'
];

var CACHE_DYNAMIC = 'service-worker-cache-dyn-v1';
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

});

self.addEventListener('fetch', function(event) {
  var myHeaders = new Headers();
  var myInit = {
    mode: 'no-cors'
  };
  console.log(event.request);
  if(event.request.url != 'http://localhost:8080/dynamic-resources/drupal_logo.png') {
    event.respondWith(
      // caches.open(CACHE_STATIC)
      //   .then(function(cache) {
      //     return fetch(event.request.url, myInit)
      //       .then(function(response) {
      //         console.log(event, response);
      //         // cache.put(event.request.url, response.clone());
      //         if(response.type === 'basic') {
      //           return response;
      //         }else {
      //           return cache.match('/service-worker-cache/tk.png');
      //         }
      //       }).catch(function(err) {
      //         console.log(err);
      //         return cache.match(event.request.url)
      //           .then(function(response) {
      //             return response;
      //           })
      //       })
      //   })

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
              return cache.match('/static-resources/drupal_logo_offline.png');
            })
        })

      // caches.match(event.request)
      //   .then(function(response) {
      //     console.log(event.request);
      //     if(response) {
      //       console.log('has-response:', response);
      //       return response;
      //     }else if(!response) {
      //       console.log('no-response:', response);
      //       console.log('no-response-fetch:', fetch(event.request));
      //       return fetch(event.request)
      //         .then(function(response) {
      //           console.log('no-response-fetch-response:', response);
      //           return response;
      //         }).catch(function(err) {
      //           console.log('no-response-fetch-error:', err);
      //           return cache.match('/static-resources/drupal_logo_offline.png');
      //         })
      //     }
      //     // return fetch(event.request);
      //   })
    );
  }

});

self.addEventListener('message', function(event) {

});

self.addEventListener('error', function(event) {

});

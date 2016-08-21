var CACHE_NAME = 'service-worker-demo-cache-static-v1';
var staticResource = [
  '/',
  '/styles/style.css',
  '/app.js',
  '/service-worker-cache/tk.png'
];

var CACHE_DYNAMIC = 'service-worker-cache-dyn-v1';
var dynamicResource = [
  '/tk.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(
        function(cache) {
          console.log('cache opened', cache);
          return cache.addAll(resourceToCache);
        }
      )
  );
});

self.addEventListener('activate', function(event) {

});

self.addEventListener('fetch', function(event) {
  var myHeaders = new Headers();
  var myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'no-cors'
  };
  event.respondWith(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return fetch(event.request.url, myInit)
          .then(function(response) {
            console.log(event, response);
            // cache.put(event.request.url, response.clone());
            if(response.type === 'basic') {
              return response;
            }else {
              return cache.match('/service-worker-cache/tk.png');
            }
          }).catch(function(err) {
            console.log(err);
            return cache.match(event.request.url)
              .then(function(response) {
                return response;
              })
          })
      })

    // caches.match(event.request)
    //   .then(function(res) {
    //     if(res) {
    //       return res;
    //     }else if(!res) {

    //     }
    //     return fetch(event.request);
    //   })
  );
});

self.addEventListener('message', function(event) {

});

self.addEventListener('error', function(event) {

});

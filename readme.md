#Service worker

Service worker is an event driven script that runs independently of your website. It is a javascript file that runs in the background and can be used to modify request, sync resources in the background and provide offline experience and push notification. Due to its ability to modify network request, it must be served over a secure connection via HTTPS or run on localhost, reducing the chance of a MITM attacks.

## Lifecycle

![Lifecycle](demo/lifecycle.png)

## Register

Registering a service worker

```javascript
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    console.log('service-worker-registered');
  }).catch(function(e) {
    console.log('service-worker-failed', e);
  });
}
```

### Scope

By default scope is at the root of the service worker script. Script is limited to it's scope. Scope can be manually set by passing a second argument in the registration method. For example `{scope: '/css/'}`

## Events

### Installing

Specify cache

```javascript
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
```
Add cache during install event

```javascript
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(function(cache) {
          console.log('cache opened', cache);
          return cache.addAll(staticResource);
      })
  );

});
```

#### waitUntil

`event.waitUntil` ensures service worker wont install until code inside is completed.

### Activating

If cache has changed, delete old cache

```javascript
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
```
### Fetching

Intercept the network request, fetch from network or cache, etc.

```javascript
self.addEventListener('fetch', function(event) {
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
});
```
## Resources

MDN - https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
Firebase Cloud Messaging - https://firebase.google.com/docs/cloud-messaging/

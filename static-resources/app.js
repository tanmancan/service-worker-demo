// Register service worker
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function(registration) {
		console.log('service-worker-registered');

    // Check for push notificaiton
    if(!registration.pushManager) {
      console.log('push-notification-not-supported');
    }

    // Subscribe to push notification
    registration.pushManager.subscribe({
      userVisibleOnly: true
    }).then(function(subscription) {

    });
	}).catch(function(e) {
		console.log('service-worker-failed', e);
	});
}


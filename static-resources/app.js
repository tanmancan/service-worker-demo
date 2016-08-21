// Register service worker
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function(registration) {
		console.log('service-worker-registered');
	}).catch(function(e) {
		console.log('service-worker-failed', e);
	});
}

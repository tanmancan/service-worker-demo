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
      // console.log(subscription);
    });

    // Event listener for message
    navigator.serviceWorker.addEventListener('message', function(e) {
      console.log(e);
      var msgEl = document.querySelector('.notification p');
      msgEl.innerHTML = e.data;
      msgEl.classList = "";
      msgEl.classList = "blink";
    });
	}).catch(function(e) {
		console.log('service-worker-failed', e);
	});
}

function messageChannel(msg) {
  return new Promise(function(resolve, reject) {
    var msgChannel = new MessageChannel();
    msgChannel.port1.onmessage = function(e) {
      if(e.data.error) {
        reject(e.data.error);
      }else {
        resolve(e.data);
      }
    }
  });
}

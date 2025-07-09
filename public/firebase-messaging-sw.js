// Import Firebase scripts for app and messaging
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase App
firebase.initializeApp({
  apiKey: "AIzaSyBa8KvOUlyiE91Odt7l9b-aVeFOEr99abM",
  authDomain: "citycycle-fbdff.firebaseapp.com",
  projectId: "citycycle-fbdff",
  storageBucket: "citycycle-fbdff.firebasestorage.app",
  messagingSenderId: "793510424913",
  appId: "1:793510424913:web:4450ec870e7a05b8e86370",
  measurementId: "G-0NFVZC9ZVB"
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background push messages
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification.title || '🌟 New Update from MapMates!';
  const notificationOptions = {
    body: payload.notification.body || 'Tap to explore new job opportunities and services!',
    icon: 'images/favicon-96x96.png',             // ✅ Notification small icon
    vibrate: [200, 100, 200],             // ✅ Custom vibration pattern
    backgroundColor: '#ffffff',           // ✅ Notification panel background (For Web push styles - Supported browsers)
    actions: [                            // ✅ Optional actions (CTA Buttons)
      {
        action: 'open_app',
        title: 'Open NearChat',
        icon: 'icons/open.png'  // ✅ Action icon (ideal size: 48x48px)
      },
    ],
    data: {
      url: 'https://hunarhub-io.netlify.app/'  // ✅ Default click action
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
  console.log('[firebase-messaging-sw.js] Notification click Received:', event);

  event.notification.close();

  let targetUrl = event.notification.data?.url || 'https://hunarhub-io.netlify.app/';

  if (event.action === 'open_app') {
    targetUrl = 'https://hunarhub-io.netlify.app/';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

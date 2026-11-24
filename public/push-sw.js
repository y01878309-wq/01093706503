/* 🔔 Service Worker لإشعارات منصة فاهم - بيشتغل حتى لو التطبيق قافل خالص */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', function (event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'منصة فاهم التعليمية', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'منصة فاهم التعليمية';
  const options = {
    body: data.body || '',
    icon: '/youssef-photo-2026.jpg',
    badge: '/youssef-photo-2026.jpg',
    dir: 'rtl',
    lang: 'ar',
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(event.notification.data.url || '/');
    })
  );
});

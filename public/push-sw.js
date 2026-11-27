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
  const extra = data.data || {};
  const options = {
    body: data.body || '',
    icon: '/youssef-photo-2026.jpg',
    badge: '/youssef-photo-2026.jpg',
    dir: 'rtl',
    lang: 'ar',
    data: { url: data.url || '/', extra }
  };

  event.waitUntil((async () => {
    // 📹 مكالمة فيديو واردة: لو فيه تبويب مفتوح، نبلغه فورًا (مفيش داعي ينتظر لمس الإشعار)
    if (extra.type === 'video_call') {
      const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clientList) {
        client.postMessage({ type: 'incoming_call', callId: extra.callId, from: data.body });
      }
    }
    await self.registration.showNotification(title, options);
  })());
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const extra = (event.notification.data && event.notification.data.extra) || {};
  const targetUrl = extra.type === 'video_call'
    ? ('/?call=' + encodeURIComponent(extra.callId || ''))
    : (event.notification.data.url || '/');

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (extra.type === 'video_call') client.postMessage({ type: 'incoming_call', callId: extra.callId, from: event.notification.body });
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});

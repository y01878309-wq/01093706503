import webpush from 'web-push';

// 🔔 بيبعت إشعار Push حقيقي (بيوصل حتى لو الطالب قافل التطبيق/المتصفح خالص)
// لمجموعة اشتراكات (subscriptions) جاية من العميل (الأدمن) وقت ما ينشر فيديو/امتحان/واجب جديد.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const vapidPublic = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    if (!vapidPublic || !vapidPrivate) {
      res.status(500).json({ error: 'VAPID keys not configured' });
      return;
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const { title, body: msgBody, subscriptions, data } = body;
    if (!title || !Array.isArray(subscriptions) || subscriptions.length === 0) {
      res.status(400).json({ error: 'Missing title or subscriptions' });
      return;
    }

    webpush.setVapidDetails('mailto:y01878309@gmail.com', vapidPublic, vapidPrivate);

    const payload = JSON.stringify({ title, body: msgBody || '', url: '/', data: data || {} });

    let sent = 0;
    let failed = 0;
    const deadEndpoints = [];

    await Promise.all(subscriptions.map(async (entry) => {
      const sub = entry && entry.subscription ? entry.subscription : entry;
      if (!sub || !sub.endpoint) { failed++; return; }
      try {
        await webpush.sendNotification(sub, payload);
        sent++;
      } catch (err) {
        failed++;
        // 410/404 يعني الاشتراك ده بايظ أو اتلغى (مثلاً المستخدم شال التطبيق) - نرجعه عشان العميل يمسحه
        if (err && (err.statusCode === 410 || err.statusCode === 404)) {
          deadEndpoints.push(sub.endpoint);
        }
      }
    }));

    res.status(200).json({ sent, failed, deadEndpoints });
  } catch (e) {
    res.status(500).json({ error: e.message || 'internal error' });
  }
}

const messages = {
  support: 'Có yêu cầu nhận hỗ trợ nhân sự. Mở app để xác nhận.',
  approval: 'Có yêu cầu điều chỉnh nhân sự. Mở app để duyệt.'
};
self.addEventListener('push', event => {
  let kind;
  try { kind = event.data?.json().kind; } catch { return; }
  if (!Object.hasOwn(messages, kind)) return;
  event.waitUntil(self.registration.showNotification('Văn phòng Nhà hàng', {
    body: messages[kind], tag: 'staffing-' + kind
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({type:'window', includeUncontrolled:true});
    const app = windows.find(window => new URL(window.url).pathname === '/');
    if (app) await app.focus();
    else await self.clients.openWindow('/');
  })());
});

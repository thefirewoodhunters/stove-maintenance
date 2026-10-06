// 薪ストーブ管理 - キャッシュ更新用 Service Worker
// 2026-10-06
const VERSION = 'stove-maintenance-v20261006';

self.addEventListener('install', () => {
  // 古いService Workerを待機させず、すぐに更新する
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // GET以外、外部サイトへの通信はそのまま通す
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 常に最新ファイルをネットから取得する。
  // ネットワークが使えない場合だけ、残っているキャッシュを使用する。
  event.respondWith(
    fetch(request, { cache: 'no-store' })
      .catch(() => caches.match(request))
  );
});

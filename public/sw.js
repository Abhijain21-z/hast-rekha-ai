/* Hast Rekha AI service worker.
   Deliberately minimal and network-first: pages are always fetched fresh when
   the device is online, and the cache is only a fallback so the installed app
   still opens offline. Bump CACHE_VERSION to discard old entries. */
const CACHE_VERSION = "hr-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
      } catch {
        /* ignore */
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  // Only same-origin page/asset traffic; never API calls or third-party scripts.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res && res.ok && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches
            .open(CACHE_VERSION)
            .then((cache) => cache.put(req, copy))
            .catch(() => {});
        }
        return res;
      } catch {
        try {
          const cached = await caches.match(req);
          if (cached) return cached;
        } catch {
          /* ignore */
        }
        return Response.error();
      }
    })(),
  );
});

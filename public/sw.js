// Flash-Tech Contractor Portal — service worker.
// Keeps the app installable + usable offline (shell), while letting all
// live data (Supabase REST, /api/* functions, fonts, product images) hit the network.
const CACHE = "ftp-v2";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Let anything cross-origin (Supabase, Google Fonts, flash-techinc.com images) go straight to the network.
  if (url.origin !== self.location.origin) return;
  // Never cache the serverless API (email / AI identify must always be live).
  if (url.pathname.startsWith("/api/")) return;

  // Page navigations: network-first, fall back to the cached shell when offline.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("/index.html")));
    return;
  }

  // Same-origin static assets (JS/CSS/icons): stale-while-revalidate.
  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || net;
    })
  );
});

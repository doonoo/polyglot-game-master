// Offline support: serve from cache, refresh the cache in the background.
const CACHE = "pgm-v2", STATE = "pgm-state", STATE_URL = "./__reminders.json";
const FILES = ["./", "index.html", "manifest.webmanifest", "native-tts.js", "fonts/fonts.css",
  "fonts/bricolage-grotesque-latin-500-normal.woff2", "fonts/bricolage-grotesque-latin-700-normal.woff2", "fonts/bricolage-grotesque-latin-800-normal.woff2",
  "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-400-italic.woff2",
  "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-italic.woff2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== STATE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch:true});
    const net = fetch(e.request).then(r => { if(r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});

// Reminders: the page stores its notification schedule in the "pgm-state" cache.
// Installed Chrome/Edge wake the worker now and then (Periodic Background Sync), so
// reminders can appear even while the app is closed.
async function showDue(){
  const c = await caches.open(STATE);
  const r = await c.match(STATE_URL); if(!r) return;
  const st = await r.json(), now = Date.now();
  const due = st.list.filter(n => n.at <= now && now - n.at < 6 * 3600e3 && !st.shown.includes(n.tag));
  if(!due.length) return;
  const n = due[due.length - 1];
  st.shown = st.shown.concat(due.map(x => x.tag)).slice(-60);
  await c.put(STATE_URL, new Response(JSON.stringify(st), {headers:{"Content-Type":"application/json"}}));
  await self.registration.showNotification(n.title, {body:n.body, tag:n.tag, icon:"icons/icon-192.png", badge:"icons/icon-192.png"});
}
self.addEventListener("periodicsync", e => { if(e.tag === "pgm-reminders") e.waitUntil(showDue().catch(() => {})); });
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window", includeUncontrolled:true}).then(cs => {
    const c = cs.find(x => "focus" in x);
    return c ? c.focus() : self.clients.openWindow("./");
  }));
});

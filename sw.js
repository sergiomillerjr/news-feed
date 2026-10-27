const C='news-v2',A=['./','./index.html','./app.css','./app.js','./manifest.webmanifest','./icon-180.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{if(r.ok){const k=u.pathname.endsWith('news.json')?new Request(u.pathname):e.request;const cl=r.clone();caches.open(C).then(c=>c.put(k,cl))}return r}).catch(()=>caches.match(u.pathname.endsWith('news.json')?new Request(u.pathname):e.request)))});

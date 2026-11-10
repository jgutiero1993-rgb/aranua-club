// Aranua Club: guarda el juego en el móvil para poder jugar sin conexión
const CACHE='aranua-v24';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  // el juego: primero la red (para recibir actualizaciones) y si no hay conexión, la copia guardada
  if(r.mode==='navigate'){const main=!/coop\.html/.test(r.url);e.respondWith(fetch(r).then(res=>{if(main){const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp))}return res}).catch(()=>caches.match(main?'./index.html':r)));return}
  // iconos y letras: la copia guardada y, si no está, la red
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})))});

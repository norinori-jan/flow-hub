self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req=event.request;
  if(req.method==='GET' && new URL(req.url).pathname.endsWith('/flow-hub/') || req.method==='GET' && new URL(req.url).pathname.endsWith('/flow-hub/index.html')){
    event.respondWith(fetch(req).then(async r=>{
      const type=r.headers.get('content-type')||'';
      if(!type.includes('text/html'))return r;
      const text=await r.text();
      const injected='\n<script src="./next-action-model.js"></script><script src="./next-action-ui.js"></script>\n';
      return new Response(text.replace(/<\\/body>/i,injected+'</body>'),{status:r.status,statusText:r.statusText,headers:r.headers});
    }).catch(()=>fetch(req)));
    return;
  }
  event.respondWith(fetch(req));
});

// flow-hub next-action UI bridge
(function(){
  'use strict';
  function run(){
    if(!window.HubNextAction)return;
    try{
      const key='flow_hub_v1';
      const s=JSON.parse(localStorage.getItem(key)||'{}');
      const a=s.activity;
      if(!a)return;
      const r=window.HubNextAction.recommend(a);
      if(!r)return;
      s.nextActionRecommendation=r;
      s.nextActionMessage=r.message||'';
      localStorage.setItem(key,JSON.stringify(s));
      const title=document.getElementById('purposeTitle');
      const body=document.getElementById('purposeBody');
      if(!title||!body)return;
      title.textContent='次の一手';
      const summary=(a.summary||'専門アプリの実績を受け取りました。').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
      const label=(r.label||'次の工程を開く').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
      const msg=(r.message||'続きの作業を選べます。').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
      body.innerHTML='<div class="sub">'+summary+'</div><div class="next-action"><div class="body"><b>'+label+'</b><div class="sub">'+msg+'</div></div><button class="pri small" data-auto-next="1">続ける</button></div>';
      document.addEventListener('click',function(e){
        const b=e.target.closest('[data-auto-next]');
        if(b&&r.sourceRef)location.href=r.sourceRef;
      },{once:true});
    }catch(e){console.warn('next-action-ui failed',e)}
  }
  function loadModel(){
    if(window.HubNextAction){run();return}
    const s=document.createElement('script');
    s.src='./next-action-model.js';
    s.onload=run;
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadModel);else loadModel();
})();

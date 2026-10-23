// flow-hub next-action decision foundation
// Pure decision layer: does not mutate specialist-app data and does not navigate.
// Input: normalized hub activity (HubActivityModel.normalize-compatible shape)
// Output: a small recommendation object for future UI integration.
(function(){
  'use strict';

  const MODEL='hub_next_action_v1';
  const URLS={
    'flow-hub':'https://norinori-jan.github.io/flow-hub/',
    'voice-pad':'https://norinori-jan.github.io/voice-pad/',
    'table-pad':'https://norinori-jan.github.io/table-pad/',
    'quick-ref':'https://norinori-jan.github.io/quick-ref/',
    'flow-mind':'https://norinori-jan.github.io/flow-mind/',
    'music-suite':'https://norinori-jan.github.io/music-suite/'
  };

  const RANK={opened:10,searched:15,edited:20,created:30,saved:40,reviewed:50,exported:60,completed:70,sent:80};

  function clean(v,max){return String(v==null?'':v).replace(/\s+/g,' ').trim().slice(0,max||160)}
  function arr(v){return Array.isArray(v)?v:[]}
  function lastEvent(a){const ev=arr(a&&a.semanticEvents);return [...ev].reverse().find(e=>e&&e.type)||null}
  function has(a,type){return arr(a&&a.semanticEvents).some(e=>e&&e.type===type)}
  function targetOf(e){return clean(e&&e.target,60)}

  function recommend(activity){
    const a=activity||{};
    const app=clean(a.app,60);
    const stage=clean(a.stage,60);
    const last=lastEvent(a);
    const type=clean(a.status,40)||clean(last&&last.type,40)||'opened';
    const target=targetOf(last);
    const rank=RANK[type]||0;

    // Explicit handoff target always wins over generic status rules.
    if(type==='sent' && target==='table-pad') return make('table-pad','review','table-padで預けた表・フローを確認する','構造化した内容を確認・追加整理します。','data');
    if(type==='sent' && target==='quick-ref') return make('quick-ref','review','quick-refで預けた知識を確認する','預けた内容を知識として整理・再利用します。','knowledge');

    // Specialist completion routes.
    if(app==='table-pad' && (type==='completed'||type==='saved'||rank>=RANK.saved))
      return make('quick-ref','send','整理した内容をquick-refへ知識化する','表・集合・フローから、残す知識を選びます。','knowledge');
    if(app==='quick-ref' && (type==='created'||type==='saved'||type==='reviewed'||type==='completed'))
      return make('quick-ref','review','quick-refで知識を振り返る','保存した知識を確認し、必要なら再利用します。','review');
    if(app==='voice-pad' && type==='completed')
      return make('quick-ref','send','記録した内容をquick-refへ預ける','音声から残す価値のある内容を知識化します。','knowledge');

    // Conservative fallback: continue from the source of truth.
    const source=app&&URLS[app]?app:'flow-hub';
    return make(source,'continue',source==='flow-hub'?'目的を選んで次の一手を決める':source+'で作業を続ける','現在の実績を起点に、専門アプリ側で続けます。',stage||'continue');
  }

  function make(app,action,label,message,reason){
    return {
      model:MODEL,
      app,
      action,
      label,
      message,
      reason,
      sourceRef:URLS[app]||null
    };
  }

  window.HubNextAction={MODEL,URLS,recommend,lastEvent};
})();

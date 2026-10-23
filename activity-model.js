// flow-hub common activity display model
// Specialist apps remain the source of truth. This file normalizes their handoff activity
// into one small presentation model without changing specialist data.
(function(){
  const MODEL='hub_activity_v1';
  const STATUS_LABELS={
    opened:'開いた',edited:'編集中',saved:'保存済み',exported:'出力済み',
    completed:'完成',sent:'次へ送信',reviewed:'振り返り済み'
  };
  const STATUS_RANK={opened:10,edited:20,saved:40,exported:50,completed:60,sent:70,reviewed:80};
  function clean(v,max){return String(v==null?'':v).replace(/\s+/g,' ').trim().slice(0,max||160)}
  function arr(v){return Array.isArray(v)?v:[]}
  function unique(v){return [...new Set(arr(v).filter(Boolean))]}
  function statusFrom(a){
    if(a&&a.currentStatus)return clean(a.currentStatus,40);
    const ev=arr(a&&a.semanticEvents);
    const last=[...ev].reverse().find(e=>e&&e.type);
    return last?clean(last.type,40):'opened';
  }
  function normalize(raw){
    raw=raw||{};
    const activity=raw.activity||raw.payload&&raw.payload.activity||raw;
    const status=statusFrom(activity);
    const recommendation=raw.recommendation||raw.payload&&raw.payload.recommendation||null;
    const sourceRef=activity.sourceRef||raw.sourceRef||null;
    const events=arr(activity.semanticEvents).map(e=>({
      at:e.at||null,app:clean(e.app,80),stage:clean(e.stage,60),type:clean(e.type,40),detail:clean(e.detail)
    }));
    return {
      model:MODEL,
      projectName:clean(activity.projectName||''),
      app:clean(activity.app||raw.source||''),
      stage:clean(activity.stageLabel||activity.stage||''),
      status,
      statusLabel:STATUS_LABELS[status]||status,
      statusRank:STATUS_RANK[status]||0,
      canAdvance:!!activity.canAdvance,
      appsUsed:unique(activity.appsUsed).map(v=>clean(v,80)),
      completedSteps:unique(activity.completedSteps).map(v=>clean(v)),
      outputs:unique(activity.outputs).map(v=>clean(v)),
      semanticEvents:events.slice(-30),
      summary:clean(activity.summary||''),
      sourceAction:clean(activity.sourceAction||''),
      sourceRef,
      recommendation:recommendation?{
        app:clean(recommendation.app,80),action:clean(recommendation.action,80),
        label:clean(recommendation.label),sourceRef:recommendation.sourceRef||null
      }:null,
      nextMessage:clean(raw.payload&&raw.payload.message||raw.nextActionMessage||''),
      updatedAt:raw.createdAt||null
    };
  }
  function hasProgress(m){return !!m&&m.statusRank>=STATUS_RANK.saved}
  function canContinue(m){return !!m&&!!m.sourceRef}
  window.HubActivityModel={MODEL,STATUS_LABELS,normalize,hasProgress,canContinue};
})();

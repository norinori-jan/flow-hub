/* flow-hub handoff protocol v1 */
(function(){
  const PROTOCOL='hub_handoff_v1';
  function make(input){
    return {
      protocol:PROTOCOL,
      id:input.id||crypto.randomUUID(),
      createdAt:input.createdAt||new Date().toISOString(),
      source:input.source||'flow-hub',
      sourceRef:input.sourceRef||null,
      intent:input.intent||'',
      context:input.context||{text:'',tags:[],emotion:null,focus:null},
      payload:input.payload||{},
      next:input.next||null,
      returnTo:input.returnTo||'https://norinori-jan.github.io/flow-hub/'
    };
  }
  function save(h){localStorage.setItem('flow_handoff_v1',JSON.stringify(h));return h;}
  function read(){try{return JSON.parse(localStorage.getItem('flow_handoff_v1')||'null')}catch(e){return null}}
  function clear(){localStorage.removeItem('flow_handoff_v1')}
  function send(input){const h=save(make(input));if(h.next&&h.next.app){const urls={
    'flow-hub':'https://norinori-jan.github.io/flow-hub/',
    'flow-mind':'https://norinori-jan.github.io/flow-mind/',
    'quick-ref':'https://norinori-jan.github.io/quick-ref/',
    'ai-dojo':'https://norinori-jan.github.io/ai-dojo/',
    'speak-native':'https://norinori-jan.github.io/speak-native/',
    'ear-first':'https://norinori-jan.github.io/ear-first/',
    'voice-pad':'https://norinori-jan.github.io/voice-pad/',
    'music-suite':'https://norinori-jan.github.io/music-suite/',
    'lead-sheet':'https://norinori-jan.github.io/lead-sheet/',
    'table-pad':'https://norinori-jan.github.io/table-pad/'
  };if(urls[h.next.app])location.href=urls[h.next.app]}
  return h;}
  window.HubHandoff={PROTOCOL,make,save,read,clear,send};
})();

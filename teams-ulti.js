export const TEAMS=Object.freeze([
  {id:'slytherin',name:'Slytherin',color:0x32946c,accent:'#8ce4bd',letter:'S'},
  {id:'hufflepuff',name:'Hufflepuff',color:0xe9b840,accent:'#ffe09b',letter:'H'},
  {id:'gryffindor',name:'Gryffindor',color:0xc84953,accent:'#ffadb1',letter:'G'},
  {id:'ravenclaw',name:'Ravenclaw',color:0x477fce,accent:'#a5caff',letter:'R'}
].map(Object.freeze));
export const ULTI_WIN_POINTS=10,ULTI_LIFETIME_MS=72*60*60*1000;
// A stale live place or finish timestamp never turns a failure into a win.
export function isFinishEligible(race){
  if(!race||race.status!=='finished'||race.failureReason||race.breakdown||(race.damage||0)>=3)return false;
  return !Number.isFinite(race.arena?.length)||Number.isFinite(race.distance)&&race.distance>=race.arena.length;
}
export const teamById=id=>TEAMS.find(t=>t.id===id)||null;
export function newIdentity(prefix='run'){
  const id=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2);
  return prefix+'-'+id;
}
export function normaliseUlti(saved){
  saved.teamId=teamById(saved.teamId)?.id||null;
  const old=saved.ulti&&typeof saved.ulti==='object'?saved.ulti:{},seen=new Set();
  const receipts=(Array.isArray(old.receipts)?old.receipts:[]).filter(r=>{
    if(!r||r.sourceGame!=='wordshift-rally'||!teamById(r.teamId)||r.points!==ULTI_WIN_POINTS||typeof r.runId!=='string'||r.eventId!=='wordshift-rally:'+r.runId||!Number.isFinite(r.earnedAt)||r.expiresAt!==r.earnedAt+ULTI_LIFETIME_MS||seen.has(r.eventId))return false;
    seen.add(r.eventId);return true;
  }).map(r=>({...r}));
  saved.ulti={schemaVersion:1,driverId:typeof old.driverId==='string'&&old.driverId?old.driverId:newIdentity('driver'),receipts};
  return saved.ulti;
}
// Retain expired receipts for deduplication; they add nothing to the balance.
export function ultiSnapshot(saved,now=Date.now()){
  const ledger=normaliseUlti(saved),receipts=ledger.receipts.filter(r=>r.earnedAt<=now&&r.expiresAt>now).map(r=>({...r}));
  const totals=Object.fromEntries(TEAMS.map(t=>[t.id,receipts.filter(r=>r.teamId===t.id).reduce((n,r)=>n+r.points,0)]));
  return {schemaVersion:1,sourceGame:'wordshift-rally',driverId:ledger.driverId,generatedAt:now,validityHours:72,totals,receipts};
}
export function awardUltiWin(saved,race,position,now=Date.now()){
  const ledger=normaliseUlti(saved);
  if(!isFinishEligible(race)||race.reviewLap||position!==1||!teamById(race.teamId)||typeof race.runId!=='string'||!race.runId||!Number.isFinite(now))return null;
  const eventId='wordshift-rally:'+race.runId;
  if(ledger.receipts.some(r=>r.eventId===eventId))return null;
  const receipt={schemaVersion:1,sourceGame:'wordshift-rally',eventId,runId:race.runId,driverId:ledger.driverId,teamId:race.teamId,points:ULTI_WIN_POINTS,earnedAt:now,expiresAt:now+ULTI_LIFETIME_MS,grade:race.unit.grade??Number(race.unit.id.match(/^g(\d+)/)?.[1]),unitId:race.unit.id,difficulty:race.difficulty,arenaId:race.arena.id};
  ledger.receipts.push(receipt);return {...receipt};
}
export function exportUlti(saved,now=Date.now()){return JSON.stringify(ultiSnapshot(saved,now),null,2);}

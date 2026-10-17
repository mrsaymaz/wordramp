export const TEAMS=Object.freeze([
  {id:'slytherin',name:'Slytherin',color:0x32946c,accent:'#8ce4bd',letter:'S'},
  {id:'hufflepuff',name:'Hufflepuff',color:0xe9b840,accent:'#ffe09b',letter:'H'},
  {id:'gryffindor',name:'Gryffindor',color:0xc84953,accent:'#ffadb1',letter:'G'},
  {id:'ravenclaw',name:'Ravenclaw',color:0x477fce,accent:'#a5caff',letter:'R'}
].map(Object.freeze));
// Rules v2: points rise by arena, Challenge pays more, a win needs 2+ stars
// (75%+ first-try accuracy) and each browser earns at most ULTI_DAILY_CAP a
// local day. Version 1 receipts (10 per win) stay valid until they expire.
export const ULTI_POINTS=Object.freeze({relaxed:Object.freeze([2,4,6]),challenge:Object.freeze([5,7,9])}),ULTI_MIN_STARS=2,ULTI_DAILY_CAP=40;
export const ULTI_WIN_POINTS=10,ULTI_LIFETIME_MS=72*60*60*1000;
const ultiMode=difficulty=>difficulty==='challenge'||difficulty==='standard'?'challenge':'relaxed';
export const ultiPointsFor=(difficulty,arenaIndex)=>ULTI_POINTS[ultiMode(difficulty)][arenaIndex]??0;
const localDay=t=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
// Everything earned on this browser on the same local day, expired or not.
const earnedOn=(ledger,now)=>{const day=localDay(now);return ledger.receipts.filter(r=>localDay(r.earnedAt)===day).reduce((n,r)=>n+r.points,0);};
export function ultiEarnedToday(saved,now=Date.now()){return earnedOn(normaliseUlti(saved),now);}
function validReceipt(r){
  if(r.schemaVersion===2)return Number.isInteger(r.points)&&r.points>=1&&r.points<=ultiPointsFor(r.difficulty,r.arenaIndex);
  return r.points===ULTI_WIN_POINTS;
}
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
    if(!r||r.sourceGame!=='wordshift-rally'||!teamById(r.teamId)||!validReceipt(r)||typeof r.runId!=='string'||r.eventId!=='wordshift-rally:'+r.runId||!Number.isFinite(r.earnedAt)||r.expiresAt!==r.earnedAt+ULTI_LIFETIME_MS||seen.has(r.eventId))return false;
    seen.add(r.eventId);return true;
  }).map(r=>({...r}));
  saved.ulti={schemaVersion:1,driverId:typeof old.driverId==='string'&&old.driverId?old.driverId:newIdentity('driver'),receipts};
  return saved.ulti;
}
// Retain expired receipts for deduplication; they add nothing to the balance.
export function ultiSnapshot(saved,now=Date.now()){
  const ledger=normaliseUlti(saved),receipts=ledger.receipts.filter(r=>r.earnedAt<=now&&r.expiresAt>now).map(r=>({...r}));
  const totals=Object.fromEntries(TEAMS.map(t=>[t.id,receipts.filter(r=>r.teamId===t.id).reduce((n,r)=>n+r.points,0)]));
  return {schemaVersion:2,sourceGame:'wordshift-rally',driverId:ledger.driverId,generatedAt:now,validityHours:72,rules:{points:ULTI_POINTS,minStars:ULTI_MIN_STARS,dailyCap:ULTI_DAILY_CAP,earnedToday:ultiEarnedToday(saved,now)},totals,receipts};
}
// outcome.status: 'awarded' (receipt), 'stars' (first place below 2 stars),
// 'cap' (daily limit already reached) or 'none' (no eligible first place).
export function ultiWinOutcome(saved,race,position,stars,now=Date.now()){
  const ledger=normaliseUlti(saved);
  if(!isFinishEligible(race)||race.reviewLap||position!==1||!teamById(race.teamId)||typeof race.runId!=='string'||!race.runId||!Number.isFinite(now))return {status:'none'};
  const eventId='wordshift-rally:'+race.runId,existing=ledger.receipts.find(r=>r.eventId===eventId);
  if(existing)return {status:'awarded',receipt:{...existing},duplicate:true};
  if(!(stars>=ULTI_MIN_STARS))return {status:'stars',points:0};
  const tier=ultiPointsFor(race.difficulty,race.arenaIndex),left=Math.max(0,ULTI_DAILY_CAP-earnedOn(ledger,now)),points=Math.min(tier,left);
  if(points<=0)return {status:'cap',points:0};
  const receipt={schemaVersion:2,sourceGame:'wordshift-rally',eventId,runId:race.runId,driverId:ledger.driverId,teamId:race.teamId,points,earnedAt:now,expiresAt:now+ULTI_LIFETIME_MS,grade:race.unit.grade??Number(race.unit.id.match(/^g(\d+)/)?.[1]),unitId:race.unit.id,difficulty:ultiMode(race.difficulty),arenaId:race.arena.id,arenaIndex:race.arenaIndex,stars};
  ledger.receipts.push(receipt);return {status:'awarded',receipt:{...receipt},capped:points<tier};
}
export function awardUltiWin(saved,race,position,stars,now=Date.now()){
  const outcome=ultiWinOutcome(saved,race,position,stars,now);return outcome.status==='awarded'&&!outcome.duplicate?outcome.receipt:null;
}
export function exportUlti(saved,now=Date.now()){return JSON.stringify(ultiSnapshot(saved,now),null,2);}

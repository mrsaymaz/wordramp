export const TEAMS=Object.freeze([
  {id:'slytherin',name:'Slytherin',color:0x32946c,accent:'#8ce4bd',letter:'S'},
  {id:'hufflepuff',name:'Hufflepuff',color:0xe9b840,accent:'#ffe09b',letter:'H'},
  {id:'gryffindor',name:'Gryffindor',color:0xc84953,accent:'#ffadb1',letter:'G'},
  {id:'ravenclaw',name:'Ravenclaw',color:0x477fce,accent:'#a5caff',letter:'R'}
].map(Object.freeze));
// Ulti points live only in Mr. Saymaz's English League (league.js), which
// decides the points and limits. This game decides which wins it claims: a
// first place with 60%+ of tasks right first time on Relaxed, or 2+ stars
// (75%+) on Challenge.
export const ULTI_MIN_STARS=2,ULTI_MIN_RELAXED_ACCURACY=.6;
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
// status: 'qualified' (claim it), 'accuracy' (first place below the rule) or
// 'none' (no eligible first place: not first, unfinished, review lap, no team).
export function ultiWinStatus(race,position,stars){
  if(!isFinishEligible(race)||race.reviewLap||position!==1||!teamById(race.teamId)||typeof race.runId!=='string'||!race.runId)return 'none';
  // First-try accuracy from the race; without task data, 2+ stars implies 75%+.
  const accuracy=race.tasks?.length&&Number.isFinite(race.correct)?race.correct/race.tasks.length:null;
  const relaxed=race.difficulty!=='challenge'&&race.difficulty!=='standard';
  const ok=relaxed&&accuracy!=null?accuracy>=ULTI_MIN_RELAXED_ACCURACY-1e-9:stars>=ULTI_MIN_STARS;
  return ok?'qualified':'accuracy';
}
// Browser-only team points were retired for the League; drop old records.
export function retireLocalUlti(saved){const had=!!saved&&'ulti' in saved;if(had)delete saved.ulti;return had;}

import {teamById,retireLocalUlti,isFinishEligible} from './teams-ulti.js';
const ARENA_IDS=['boulevard','coast','storm'];
const raceDifficulty=value=>value==='standard'?'challenge':value;
export const PAINTS=[{id:'gold',name:'Sunrise Gold',color:0xf3bc55,tier:0},{id:'lagoon',name:'Lagoon Pearl',color:0x55b9ae,tier:1},{id:'ruby',name:'Ember Ruby',color:0xc76072,tier:2},{id:'midnight',name:'Midnight Violet',color:0x7973b5,tier:3}];
export function normaliseProgress(saved){
  if(saved.difficulty==='standard')saved.difficulty='challenge';
  saved.progress=saved.progress&&typeof saved.progress==='object'?saved.progress:{};
  for(const key of Object.keys(saved.progress))if(key.endsWith(':standard')){
    const target=key.slice(0,-9)+':challenge',old=saved.progress[key],current=saved.progress[target];
    saved.progress[target]=[0,1,2].map(i=>Math.max(0,Math.min(3,Number(old?.[i])||0),Math.min(3,Number(current?.[i])||0)));delete saved.progress[key];
  }
  saved.teamId=teamById(saved.teamId)?.id||null;
  // Stars describe learning; only explicit first-place results open arenas.
  // Retired browser-only Ulti receipts still prove past first places: carry
  // them into arena wins, then drop the old ledger (points live in the League).
  const wins={};
  for(const [key,row] of Object.entries(saved.arenaWins||{})){
    const target=key.endsWith(':standard')?key.slice(0,-9)+':challenge':key;
    wins[target]=ARENA_IDS.map((_,i)=>wins[target]?.[i]===true||row?.[i]===true);
  }
  for(const receipt of Array.isArray(saved.ulti?.receipts)?saved.ulti.receipts:[]){
    if(!receipt||receipt.sourceGame!=='wordshift-rally'||!teamById(receipt.teamId))continue;
    const arena=ARENA_IDS.indexOf(receipt.arenaId),difficulty=raceDifficulty(receipt.difficulty);
    if(arena<0||!['relaxed','challenge'].includes(difficulty)||typeof receipt.unitId!=='string'||!receipt.unitId)continue;
    const key=receipt.unitId+':'+difficulty;
    (wins[key]||=(ARENA_IDS.map(()=>false)))[arena]=true;
  }
  saved.arenaWins=wins;retireLocalUlti(saved);
  saved.fuel=Number.isFinite(saved.fuel)?Math.max(0,Math.min(100,saved.fuel)):0;
  saved.mastery=saved.mastery&&typeof saved.mastery==='object'?saved.mastery:{};
  saved.reviewQueue=saved.reviewQueue&&typeof saved.reviewQueue==='object'?saved.reviewQueue:{};
  saved.look={paint:'gold',badge:0,trail:false,...saved.look};return saved;
}
export function arenaUnlocked(saved,id,difficulty,arena){
  return Number.isInteger(arena)&&arena>=0&&arena<ARENA_IDS.length&&ARENA_IDS.slice(0,arena).every((_,i)=>saved.arenaWins?.[id+':'+raceDifficulty(difficulty)]?.[i]===true);
}
export function recordArenaWin(saved,race,position){
  if(!isFinishEligible(race)||race.reviewLap||position!==1||!Number.isInteger(race.arenaIndex)||race.arenaIndex<0||race.arenaIndex>=ARENA_IDS.length||typeof race.unit?.id!=='string'||!['relaxed','challenge'].includes(raceDifficulty(race.difficulty)))return false;
  const key=race.unit.id+':'+raceDifficulty(race.difficulty);
  saved.arenaWins||={};const row=saved.arenaWins[key]||=(ARENA_IDS.map(()=>false));
  const changed=row[race.arenaIndex]!==true;row[race.arenaIndex]=true;return changed;
}
function entry(saved,id){return saved.mastery[id]||=( {seen:{},clean:{},total:0,firstTry:0,arenas:0,tier:0});}
export function recordLearning(saved,id,events){const m=entry(saved,id);for(const e of events){m.seen[e.key]=true;m.total++;if(e.firstTry){m.firstTry++;m.clean[e.key]=true;}}return award(m);}
export function finishUnitArena(saved,id,arena){const m=entry(saved,id);m.arenas|=1<<arena;return award(m);}
function award(m){const before=m.tier,n=Object.keys(m.clean).length,accuracy=m.total?m.firstTry/m.total:0,arenas=[0,1,2].filter(i=>m.arenas&(1<<i)).length;if(accuracy>=.9){if(n>=6&&arenas>=1)m.tier=Math.max(m.tier,1);if(n>=12&&arenas>=2)m.tier=Math.max(m.tier,2);if(n>=18&&arenas===3)m.tier=3;}return m.tier>before?m.tier:0;}
export function masteryStats(saved,id){const m=entry(saved,id);return {unique:Object.keys(m.clean).length,accuracy:m.total?Math.round(m.firstTry/m.total*100):0,arenas:[0,1,2].filter(i=>m.arenas&(1<<i)).length,tier:m.tier};}
export function garageTier(saved){return Math.max(0,...Object.values(saved.mastery).map(m=>m.tier||0));}
export function equip(saved,kind,value){const tier=garageTier(saved);if(kind==='paint'){const paint=PAINTS.find(p=>p.id===value);if(!paint||paint.tier>tier)return false;saved.look.paint=value;}else if(kind==='badge'){if(!Number.isInteger(value)||value<0||value>tier)return false;saved.look.badge=value;}else if(kind==='trail'){if(value&&tier<3)return false;saved.look.trail=!!value;}else return false;return true;}
export function resolvedLook(saved){const tier=garageTier(saved),paint=PAINTS.find(p=>p.id===saved.look.paint&&p.tier<=tier)||PAINTS[0];return {color:teamById(saved.teamId)?.color??paint.color,teamId:teamById(saved.teamId)?.id??null,paint:paint.id,badge:Math.min(tier,Math.max(0,Number(saved.look.badge)||0)),trail:!!saved.look.trail&&tier>=3};}

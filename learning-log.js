// Learning log (English League "learn", format v1): after every League race,
// won or lost, the game sends one compact record of the English it asked and
// how each answer went, so Mr. Saymaz can see what a class or student keeps
// missing. The format is shared by every League game (LEARNING_LOG.md): each
// answer says WHAT English it tested (skill + target), not how this game asks
// it, so a word missed here and in another game adds up. Only answers from the
// game's own option lists are sent: never free text, never a points value.
// Pure functions only; app.js sends the record through league.learn().
export const LEARN_VERSION=1;
// The shared skill list (the same in every game).
export const LEARN_SKILLS=Object.freeze(['vocabulary','grammar','sentence-order','reading','spelling','listening']);
export const LEARN_RESULTS=Object.freeze(['first','retry','missed','timeout','skipped']);
export const LEARN_MAX_ITEMS=48;
const GAME='wordramp',MAX_TEXT=80;
const text=v=>typeof v==='string'?v.replace(/\s+/g,' ').trim().slice(0,MAX_TEXT):'';
const slug=v=>String(v??'').toLowerCase().replace(/\s+/g,' ').trim().slice(0,MAX_TEXT);
const baseId=id=>String(id||'').replace(/(?:-review)+$/,'');

// What English a road task tests. Mirrors game-core's learning keys (word:,
// grammar:, sentence:) and adds reading: for question signs.
export function taskTarget(t){
  const key=t.learningKey||'';
  if(t.kind==='repair'||key.startsWith('sentence:'))return {skill:'sentence-order',target:key.startsWith('sentence:')?key:'sentence:'+baseId(t.sourceId||t.reviewOf||t.id)};
  if(t.type==='grammar'||key.startsWith('grammar:'))return {skill:'grammar',target:key.startsWith('grammar:')?key:'grammar:'+baseId(t.sourceId||t.reviewOf||t.id)};
  if(t.type==='question')return {skill:'reading',target:'reading:'+baseId(t.reviewOf||t.id)};
  return {skill:'vocabulary',target:key.startsWith('word:')?'word:'+slug(key.slice(5)):'word:'+slug(t.answer)};
}
// This game's own name for the question type (only for looking at Wordramp).
export function taskType(t){
  if(t.kind==='repair')return 'bridge-blocks';
  if(t.kind==='pedestrian')return 'crosswalk-sort';
  return (t.kind==='junction'?'shortcut':'light')+'-'+(t.picture?'picture':t.type||'sign');
}
// One finished task (or one crosswalk visitor) → one learning item; null when
// the race ended before the student reached it.
function signItem(t){
  if(!t.completed)return null;
  const {skill,target}=taskTarget(t),row=t.rows?.[0],item={item:GAME+':'+baseId(t.reviewOf||t.id),skill,type:taskType(t),target,answer:text(t.answer)};
  if(t.kind==='repair'){
    item.result=t.success?'first':t.answeredRight?'retry':'missed';
    if(t.attempts)item.tries=t.attempts+(t.answeredRight?1:0);
    if(!t.success&&t.lastWrong&&t.blocks?.[t.lastWrong.block]!=null)item.wrong=text(t.blocks[t.lastWrong.block]);
  }else{
    item.result=t.success?'first':'missed';
    if(!t.success&&Number.isInteger(t.chosenIndex)&&row?.options?.[t.chosenIndex]!=null&&t.chosenIndex!==row.correctIndex)item.wrong=text(row.options[t.chosenIndex]);
  }
  if(t.reviewOf)item.review=true;
  if(skill==='grammar'||skill==='reading')item.prompt=text(t.prompt);
  return item;
}
function sortItems(t){
  return (t.people||[]).filter(p=>p.sent).map(p=>{
    const category=t.categoryIds?.[p.side]||t.labels?.[p.side]||'group',timeout=!p.correct&&p.selectedSide===p.side;
    const item={item:GAME+':'+category+':'+slug(p.word),skill:'vocabulary',type:'crosswalk-sort',target:'word:'+slug(p.word),answer:text(t.labels?.[p.side]),result:p.correct?'first':timeout?'timeout':'missed'};
    if(!p.correct&&!timeout)item.wrong=text(t.labels?.[p.selectedSide]);
    return item;
  });
}
// The record for one race. place: finishing position (null when not finished).
export function roundLog(race,{place=null}={}){
  const items=[];
  for(const t of race?.tasks||[]){
    if(t.kind==='pedestrian')items.push(...sortItems(t));
    else{const item=signItem(t);if(item)items.push(item);}
  }
  const kept=items.slice(0,LEARN_MAX_ITEMS);
  return {v:LEARN_VERSION,unit:text(race?.unit?.id),arena:race?.arenaIndex??null,pace:race?.difficulty==='challenge'?'challenge':'relaxed',finished:race?.status==='finished'&&!race?.failureReason,place:Number.isInteger(place)?place:null,seconds:Math.round(race?.elapsed||0),first:kept.filter(i=>i.result==='first').length,total:kept.length,items:kept};
}
// A record the League would accept (also used to check queued records).
export function validLog(log){
  return !!log&&log.v===LEARN_VERSION&&Array.isArray(log.items)&&log.items.length<=LEARN_MAX_ITEMS&&log.items.every(i=>typeof i.item==='string'&&i.item.length<=200&&LEARN_SKILLS.includes(i.skill)&&LEARN_RESULTS.includes(i.result)&&typeof i.target==='string');
}

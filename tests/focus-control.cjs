const assert=require('node:assert/strict');
global.window={};for(const file of ['language-bank','repair-bank','match-bank','game-core'])require('../dist/'+file+'.js');
const C=window.RallyCore,unit=window.LANGUAGE_BANK[0].units[0];let cases=0;
function prepare(kind,mode,arena,hz,entry){
 const s=C.createRace(unit,mode,arena,18,{fuel:100}),t=s.tasks.find(t=>t.kind===kind);
 s.status='driving';s.taskIndex=s.tasks.indexOf(t);s.distance=t.at-(kind==='pedestrian'?150:kind==='repair'?70:52);s.speedFactor=entry;s.obstacles=[];s.nitro=4;s.nitroLevel=2;
 s.rivals.forEach((r,i)=>Object.assign(r,{at:s.distance+35+i*30,lane:i?1:-1,lanePos:i?1:-1,nextTask:s.tasks.length,fuel:60,nitro:2}));
 for(let i=0;i<Math.ceil(hz*.65);i++){C.setAccelerating(s,true);C.tick(s,1/hz,s.lane);assert(C.focusCruise(s));assert.equal(s.focusAuto.returning,null,'An accelerator hold cannot answer a task');assert.equal(s.speedFactor,entry);assert.equal(s.nitro,4);}
 C.setAccelerating(s,false);return s;
}
function ready(s,hz){
 const t=s.task;
 if(t.kind==='repair')assert(C.connectRepair(s,[0,1,2]));
 else if(t.kind==='pedestrian'){
  for(let i=0;i<hz*12&&!t.completed;i++){if(C.pedestrianReady(s)&&!t.pedWait)C.sortPerson(s,t.people[t.personIndex].side);C.tick(s,1/hz,0);}
  assert(t.completed);assert(!C.crosswalkOccupied(s,t));
  if(s.focusAuto.returning==null)C.tick(s,1/hz,0);
 }else{
  assert(C.choose(s,t.correctIndex));
  for(let i=0;i<hz&&s.focusAuto.returning==null;i++)C.tick(s,1/hz,s.lane);
 }
 assert(s.focusAuto.returning!=null,JSON.stringify({kind:t.kind,mode:s.difficulty,arena:s.arenaIndex,hz,age:s.focusAuto.age,settle:s.focusAuto.choiceSettle,focusLane:t.focusLane,lane:s.lane,completed:t.completed}));assert(C.canShortenFocus(s));
}
function drain(s,hz,held){
 const at=s.elapsed;let changing=false;
 for(let i=0;i<hz*2&&C.focusCruise(s);i++){
  const charge=s.nitro,amount=s.focusAmount,scale=s.worldTimeScale,gaps=s.rivals.map(r=>r.at-s.distance);
  C.setAccelerating(s,held);C.tick(s,1/hz,s.lane);
  assert.equal(s.nitro,charge,'The whole return conserves charge');assert(!s.nitroActive);
  assert(s.focusAmount<=amount+1e-7);assert(s.worldTimeScale>=scale-1e-7);changing||=s.focusAmount>0&&s.focusAmount<amount;
  s.rivals.forEach((r,j)=>assert(r.at-s.distance<=gaps[j]+1e-7,'Quick return preserves task racing fairness'));
 }
 assert(!C.focusCruise(s));assert(changing,'The return fades rather than snapping');assert.equal(s.focusAmount,0);assert.equal(s.worldTimeScale,1);assert(s.speedFactor<=C.REGULAR_MAX_SPEED+1e-7);
 C.setAccelerating(s,held);assert.equal(s.accelerating,held);return s.elapsed-at;
}
for(const kind of ['light','junction','repair','pedestrian'])for(const mode of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(const hz of [30,60,120])for(const entry of [C.REGULAR_MAX_SPEED,C.MAX_SPEED]){
 const slow=prepare(kind,mode,arena,hz,entry),fast=prepare(kind,mode,arena,hz,entry);ready(slow,hz);ready(fast,hz);
 const normal=drain(slow,hz,false),quick=drain(fast,hz,true);
 assert(normal>=1.2&&normal<=1.4,`${kind}: hands-free return remains gentle`);assert(quick<=.3);assert(normal-quick>.9);
 cases++;
}
// A late press speeds the remaining fade, while release cancels a fast request.
for(const kind of ['light','junction','repair','pedestrian']){
 const late=prepare(kind,'challenge',0,60,C.REGULAR_MAX_SPEED);ready(late,60);
 for(let i=0;i<24;i++)C.tick(late,1/60,late.lane);assert(drain(late,60,true)<.25);
 const released=prepare(kind,'challenge',0,60,C.REGULAR_MAX_SPEED);ready(released,60);
 C.setAccelerating(released,true);for(let i=0;i<3;i++)C.tick(released,1/60,released.lane);
 C.setAccelerating(released,false);assert(drain(released,60,false)>.9,'Releasing during the fade restores its gentle rate');
 const paused=prepare(kind,'challenge',0,60,C.REGULAR_MAX_SPEED);ready(paused,60);C.setAccelerating(paused,true);C.pause(paused);
 assert(!paused.accelerationHeld);const frozen=JSON.stringify(paused);C.tick(paused,.1);assert.equal(JSON.stringify(paused),frozen);C.resume(paused);assert(drain(paused,60,false)>1.2);
}
for(const mode of Object.keys(C.DIFFICULTIES)){
 const gap=prepare('repair',mode,0,60,C.REGULAR_MAX_SPEED),t=gap.task;
 assert(!C.connectRepair(gap,[2,1,0]));
 for(let i=0;i<600;i++){C.setAccelerating(gap,true);C.tick(gap,.05,0);assert(C.focusCruise(gap));assert.equal(gap.focusAuto.returning,null);assert(gap.distance<=t.at-8+1e-7);assert.equal(gap.nitro,4);}
 const crossing=prepare('pedestrian',mode,0,60,C.REGULAR_MAX_SPEED),ped=crossing.task;
 crossing.distance=ped.stopAt;crossing.elapsed=(ped.sortStartedAt??crossing.elapsed)+ped.sortDuration+2;C.setAccelerating(crossing,true);C.tick(crossing,.05,0);
 assert(ped.completed&&!ped.answeredRight);
 for(let i=0;i<24;i++){C.setAccelerating(crossing,true);C.tick(crossing,.05,0);assert(C.crosswalkOccupied(crossing,ped));assert(C.focusCruise(crossing));assert.equal(crossing.focusAuto.returning,null);assert.equal(crossing.distance,ped.stopAt);}
 for(let i=0;i<20&&C.focusCruise(crossing);i++){C.setAccelerating(crossing,true);C.tick(crossing,.05,0);if(C.crosswalkOccupied(crossing,ped))assert.equal(crossing.distance,ped.stopAt);}
 assert(!C.focusCruise(crossing));assert(!C.crosswalkOccupied(crossing,ped));
}
// Pressing early still waits for the physical car to align with the answer.
const early=prepare('light','relaxed',0,60,C.REGULAR_MAX_SPEED);C.choose(early,1);C.setAccelerating(early,true);
for(let i=0;i<15;i++){C.tick(early,1/60,1);assert.equal(early.focusAuto.returning,null);}
for(let i=0;i<40&&C.focusCruise(early);i++)C.tick(early,1/60,0);assert(!C.focusCruise(early));assert(!early.task.completed,'Quick return never grades before the road line');
for(const kind of ['light','junction']){
 const wrong=prepare(kind,'challenge',0,60,C.REGULAR_MAX_SPEED),t=wrong.task;C.choose(wrong,(t.correctIndex+1)%3);
 for(let i=0;i<600&&!t.completed;i++){C.setAccelerating(wrong,true);C.tick(wrong,1/60,wrong.lane);}
 assert(t.completed&&!t.answeredRight);assert.equal(wrong.correct,0);assert(wrong.review.length);if(kind==='junction')assert(wrong.route&&!wrong.route.shortcut);
}
console.log(`PASS: ${cases} player-controlled returns across all task kinds, both modes, three arenas, 30/60/120 Hz and 90/200-entry speeds. Held returns finish within 0.3s; gentle returns, late presses, release/Pause cancellation, live acceleration, Nitro conservation, rival fairness, physical alignment/answer lines, repair gaps, occupied crossings and wrong-route penalties remain correct.`);

const assert=require('node:assert/strict');
global.window={};for(const file of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require('../dist/'+file+'.js');
const C=window.RallyCore,unit=window.LANGUAGE_BANK[0].units[0];let cases=0;
function approach(mode,arena,entry,rivals=true){
 const s=C.createRace(unit,mode,arena,45,{fuel:100,rivals}),t=s.tasks.find(t=>t.kind==='pedestrian');
 s.status='driving';s.taskIndex=s.tasks.indexOf(t);s.distance=t.at-150;s.speedFactor=entry;s.lane=0;s.obstacles=[];
 for(let i=0;i<3;i++)assert(C.activateNitro(s));
 s.rivals.forEach((r,i)=>Object.assign(r,{at:s.distance+35+i*25,lane:i?1:-1,lanePos:i?1:-1,nextTask:s.tasks.length,speed:s.arena.speed*C.REGULAR_MAX_SPEED,fuel:60,nitro:C.NITRO_DURATION}));return s;
}
for(const mode of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(const hz of [30,60,120])for(const entry of [1,C.REGULAR_MAX_SPEED,C.MAX_SPEED]){
 const s=approach(mode,arena,entry),t=s.tasks[s.taskIndex],charge=s.nitro;let stopped=false,readingAt=0,person=-1,completedAt=null;
 for(let frame=0;frame<hz*20;frame++){
  if(s.status==='task'&&C.pedestrianReady(s)&&!t.pedWait){if(person!==t.personIndex){person=t.personIndex;readingAt=s.elapsed;}if(s.elapsed-readingAt>.65)assert(C.move(s,t.people[person].side===0?-1:1));}
  const wasCruise=C.focusCruise(s)||s.status==='driving'&&!s.task,wasProtected=C.learningPaceProtected(s)||!s.task,gaps=s.rivals.map(r=>r.at-s.distance);C.setAccelerating(s,true);C.setNitroHeld(s,true);C.tick(s,1/hz,0);
  if(s.status==='task'){assert(C.focusCruise(s));assert(!C.repairCruise(s));assert.equal(s.speedFactor,entry);assert(!s.accelerating&&!s.nitroActive);assert.equal(s.lane,0);stopped||=s.worldTimeScale<1e-6;}
  if(C.crosswalkOccupied(s,t))assert(s.distance<=t.stopAt+1e-8,'No car may reach occupied stripes');
  if(C.focusCruise(s))assert.equal(s.nitro,charge,'Focus and its return preserve saved boost');
  if(wasProtected)s.rivals.forEach((r,i)=>assert(r.at-s.distance<=gaps[i]+1e-7,'Rivals cannot gain ground during crossing focus'));
  if(t.completed&&completedAt==null){completedAt=s.distance;assert(!C.crosswalkOccupied(s,t));assert(s.distance<t.stopAt-25,'All four words can be sorted well before arrival');}
  if(t.completed&&!C.focusCruise(s)){assert(s.accelerating||wasCruise);C.setAccelerating(s,true);C.tick(s,1/hz,0);assert(s.accelerating);break;}
  assert(frame<hz*20-1,'Focus must return control after sorting');
 }
 assert(t.completed&&t.answeredRight);assert.equal(s.correct,1);assert(!stopped,'Timely sorting never requires a full stop');assert.equal(s.worldTimeScale,1);assert.equal(s.focusAmount,0);assert.equal(s.nitro,charge);cases++;
}
for(const mode of Object.keys(C.DIFFICULTIES))for(const hz of [30,60,120]){
 const s=approach(mode,0,C.REGULAR_MAX_SPEED,false),t=s.tasks[s.taskIndex];s.distance=t.stopAt;C.tick(s,1/hz);for(let i=0;i<hz*2;i++)C.tick(s,1/hz);
 assert.equal(s.distance,t.stopAt);assert.equal(s.speedFactor,C.REGULAR_MAX_SPEED);assert.equal(s.worldTimeScale,0);assert(C.crosswalkOccupied(s,t));
 C.pause(s);const snapshot=JSON.stringify(s);C.tick(s,.1);assert.equal(JSON.stringify(s),snapshot);C.resume(s);
 s.elapsed=t.sortStartedAt+t.sortDuration;C.tick(s,1/hz);assert(t.completed&&!t.answeredRight);assert.equal(s.review.length,4);assert(C.focusCruise(s));
 for(let i=0;i<Math.floor(hz*1.3);i++){C.tick(s,1/hz);assert.equal(s.distance,t.stopAt);assert(C.crosswalkOccupied(s,t));assert.equal(s.focusAuto.returning,null);}
 for(let i=0;i<hz*3;i++)C.tick(s,1/hz);assert(!C.focusCruise(s));assert.equal(s.worldTimeScale,1);assert(s.distance>t.stopAt);assert.equal(s.collisions,0);
}
// Cars already on the stripes evacuate at normal time before people enter.
for(const bodyType of ['traffic','rival']){
 const s=approach('challenge',2,C.MAX_SPEED,bodyType==='rival'),t=s.tasks[s.taskIndex];
 if(bodyType==='traffic')s.obstacles=[{id:10,type:'traffic',at:t.at+3,lane:1,lanePos:1,speed:8,cruiseSpeed:8,target:1,laneProgress:0,changed:false,moving:false}];
 else{s.rivals=s.rivals.slice(0,1);Object.assign(s.rivals[0],{at:t.at+3,lane:1,lanePos:1,speed:s.arena.speed,fuel:0,nitro:0});}
 C.tick(s,.05);assert.equal(t.peopleEntryAt,undefined);assert(!C.pedestrianReady(s));
 for(let i=0;i<100&&!C.pedestrianReady(s);i++)C.tick(s,.05);assert(C.pedestrianReady(s),'Stripes must clear promptly despite world time dilation');assert(s.elapsed<4.5);const body=bodyType==='traffic'?s.obstacles[0]:s.rivals[0];assert(body.at-2.2>=t.at+14);assert(s.distance<t.stopAt-40);
}
console.log(`PASS: ${cases} moving pedestrian approaches across both modes, all arenas, 30/60/120 Hz and cruise/90/200 entry speeds. Four visitors clear before arrival without stopping; captured speed, rival fairness, saved Nitro and gradual handoff hold. Six timeout/Pause escorts wait safely; existing traffic and rivals promptly clear the stripes.`);

const assert=require('node:assert/strict');
global.window={};for(const name of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require('../dist/'+name+'.js');
const C=window.RallyCore,unit=window.LANGUAGE_BANK[0].units[0];let cases=0;
function approach(difficulty,arena,held,entry){
 const s=C.createRace(unit,difficulty,arena,23,{fuel:100}),t=s.tasks.find(t=>t.kind==='repair');
 s.status='driving';s.taskIndex=s.tasks.indexOf(t);s.distance=t.at-70;s.lane=0;s.speedFactor=entry;s.obstacles=[];
 for(let i=0;i<3;i++)assert(C.activateNitro(s));s.accelerating=held;s.nitroHeld=held;
 s.rivals.forEach((r,i)=>Object.assign(r,{at:s.distance+30+i*25,lane:i?1:-1,lanePos:i?1:-1,nextTask:s.tasks.length,speed:s.arena.speed*C.REGULAR_MAX_SPEED,fuel:60,nitro:C.NITRO_DURATION}));
 return s;
}
const distances=new Map();
for(const difficulty of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(const hz of [30,60,120])for(const entry of [1,C.REGULAR_MAX_SPEED,C.MAX_SPEED]){
 const free=approach(difficulty,arena,false,entry),held=approach(difficulty,arena,true,entry),t=free.tasks[free.taskIndex],charge=free.nitro,start=free.distance;
 for(let frame=0;frame<hz*24;frame++){
  for(const s of [free,held]){
   const gaps=s.rivals.map(r=>r.at-s.distance);C.tick(s,1/hz,s.lane);
   assert(C.repairCruise(s));assert.equal(s.speedFactor,entry,'Autopilot preserves the entry speed, including Nitro entries');assert(!s.accelerating&&!s.nitroHeld&&!s.nitroActive);assert.equal(s.nitro,charge);
   assert(s.worldTimeScale>=0&&s.worldTimeScale<=1+1e-9);assert(s.distance<=t.at-8+1e-8);
   s.rivals.forEach((r,i)=>assert(r.at-s.distance<=gaps[i]+1e-7,'Autopilot cannot give a rival extra ground'));
  }
  assert(Math.abs(free.distance-held.distance)<1e-8,'An old accelerator hold cannot rush a repair');
  if(frame===hz*2-1){assert(free.worldTimeScale<.2,'The world slows while engine speed is preserved');assert(free.distance>start+2);const key=[difficulty,arena,entry].join('/'),samples=distances.get(key)||[];samples.push(free.distance);distances.set(key,samples);}
 }
 assert.equal(free.status,'task');assert(!t.completed&&!t.solved);assert(Math.abs(free.distance-(t.at-8))<1e-5,'Extended thought safely freezes before the missing road');
 assert.equal(free.speedFactor,entry);assert.equal(free.worldTimeScale,0);assert(!C.setAccelerating(free,true));assert(!C.setNitroHeld(free,true));assert(!C.move(free,1));assert(!C.choose(free,2));assert.equal(free.lane,0);
 const beforeWrong=free.time;assert(!C.connectRepair(free,[1,0,2]));assert(Math.abs(free.time-(beforeWrong-1.5))<1e-8);assert(C.repairCruise(free));
 C.pause(free);const paused=JSON.stringify(free);C.tick(free,.1);assert.equal(JSON.stringify(free),paused);C.resume(free);assert(C.repairCruise(free));
 assert(C.connectRepair(free,[0,1,2]));assert(t.solved&&t.completed);assert.equal(free.status,'resolving');assert(C.repairCruise(free),'Autopilot owns the smooth return before handing back control');
 const stoppedAt=free.distance;let scale=0;
 for(let frame=0;frame<hz*3;frame++){
  // This case checks the gentle hands-free return; fast holds have their own matrix.
  const returning=C.repairCruise(free);if(returning){assert(!C.setAccelerating(free,false));assert(!C.setNitroHeld(free,true));assert(!C.canEngageNitro(free));}
  C.tick(free,1/hz,0);
  if(C.repairCruise(free)){assert(free.worldTimeScale>=scale-1e-8);scale=free.worldTimeScale;assert.equal(free.nitro,charge);}
  if(frame===Math.floor(hz*.5)){assert(C.repairCruise(free));assert(free.focusAmount>0&&free.focusAmount<1);assert(free.worldTimeScale>0&&free.worldTimeScale<1);}
 }
 assert(free.distance>stoppedAt+10);assert.equal(free.status,'driving');assert(!C.repairCruise(free));assert.equal(free.worldTimeScale,1);assert.equal(free.focusAmount,0);assert.equal(free.nitro,charge);assert(!free.accelerating&&!free.nitroHeld);assert(free.speedFactor<=C.REGULAR_MAX_SPEED,'Nitro entry speed cannot become a permanent free boost');assert(C.setAccelerating(free,true));assert(C.setNitroHeld(free,true));cases++;
}
for(const samples of distances.values())assert(Math.max(...samples)-Math.min(...samples)<1.25,'Dilation travel stays consistent across frame rates');
const ordinary=C.createRace(unit,'challenge',0,5);ordinary.status='task';ordinary.task=ordinary.tasks[0];assert(!C.repairCruise(ordinary));assert(C.setAccelerating(ordinary,true),'Lane-answer tasks retain the optional fast pass');
console.log(`PASS: ${cases} entry-speed-preserving autopilot cases across both modes, all arenas and 30/60/120 Hz; world time dilation, smooth controlled return, safe waiting, rival fairness, conserved Nitro, pause/resume, wrong-order retry and immediate repair.`);

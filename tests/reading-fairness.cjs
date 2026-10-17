const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
global.window={};for(const f of ['language-bank','match-bank','repair-bank','emoji-bank','game-core'])require(path.resolve((fs.existsSync('dist/game-core.js')?'dist/':'')+f+'.js'));
const C=window.RallyCore,u=window.LANGUAGE_BANK[0].units[0];
function reading(difficulty,arena,held=false){
 const s=C.createRace(u,difficulty,arena,31,{fuel:60}),t=s.tasks[0];s.status='task';s.task=t;s.taskIndex=0;s.distance=t.at-65;s.obstacles=[];s.lane=t.correctIndex-1;s.accelerating=held;
 for(const [i,r]of s.rivals.entries())Object.assign(r,{at:s.distance+35+i*25,lane:i?1:-1,lanePos:i?1:-1,nextTask:s.tasks.length,speed:s.arena.speed*1.8,fuel:50,nitro:C.NITRO_DURATION});
 return s;
}
let cases=0;
for(const difficulty of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(const hz of [30,60,120])for(const held of [false,true])for(const boostEntry of [false,true]){
 const s=reading(difficulty,arena,held);if(boostEntry){s.speedFactor=C.MAX_SPEED;s.nitro=C.NITRO_DURATION*3;s.nitroLevel=3;}let frames=0;
 while(s.status==='task'||s.status==='resolving'){
  const before=s.rivals.map(r=>r.at-s.distance),fuel=s.rivals.map(r=>r.fuel),nitro=s.rivals.map(r=>r.nitro),playerCharge=s.nitro,wasTask=s.status==='task';C.tick(s,1/hz,s.lane);if(wasTask)assert.equal(s.nitro,playerCharge,'Reading preserves the player boost');frames++;
  s.rivals.forEach((r,j)=>{assert(r.at-s.distance<=before[j]+1e-7,'A protected task or correct exit cannot grow the opponents’ lead');if(wasTask||!s.nitroActive){assert.equal(r.fuel,fuel[j]);assert.equal(r.nitro,nitro[j],'Mandatory reading preserves rival boost time');assert(!r.nitroActive);}else{assert(r.fuel<=fuel[j]);assert.equal((fuel[j]-r.fuel)%C.NITRO_COST,0,'Counterboosts spend real fuel');}});
  assert(frames<4000);
 }
 assert(s.tasks[0].answeredRight);assert.equal(s.correct,1);assert.equal(s.status,'driving');cases++;
}
// An unfinished repair can need an extended thought period. All rivals wait
// with the player, including when the player comes to a complete stop.
for(const difficulty of Object.keys(C.DIFFICULTIES)){
 const s=reading(difficulty,0),t=s.tasks[1];s.task=t;s.taskIndex=1;s.distance=t.at-50;s.rivals.forEach((r,i)=>r.at=s.distance+30+i*30);for(let frame=0;frame<100;frame++){const old=s.rivals.map(r=>r.at-s.distance);C.tick(s,.05,s.lane);s.rivals.forEach((r,i)=>assert(r.at-s.distance<=old[i]+1e-7));}
 assert(C.connectRepair(s,[0,1,2]));const old=s.rivals.map(r=>r.at-s.distance);for(let frame=0;frame<39;frame++)C.tick(s,.05,s.lane);s.rivals.forEach((r,i)=>assert(r.at-s.distance<=old[i]+1e-7));assert(C.learningPaceProtected(s));
}
// Held acceleration can lock a known answer sooner without surrendering
// protection from a mandatory slowdown or from the correct exit's recovery.
for(const held of [false,true])for(const index of [1,2]){
 const s=reading('challenge',2,held),t=s.tasks[index];s.task=t;s.taskIndex=index;s.distance=t.at-50;s.lane=(t.correctIndex??1)-1;s.rivals.forEach((r,i)=>r.at=s.distance+35+i*25);
 if(t.kind==='repair')assert(C.connectRepair(s,[0,1,2]));
 for(let frame=0;frame<1000&&(s.status==='task'||s.learningRecovery>0);frame++){
  const protectedBefore=C.learningPaceProtected(s),gaps=s.rivals.map(r=>r.at-s.distance);C.tick(s,.05,s.lane);
  if(protectedBefore)s.rivals.forEach((r,i)=>assert(r.at-s.distance<=gaps[i]+1e-7,'Correct repair/fork recovery cannot cost racing ground'));
 }
 assert(t.answeredRight);assert.equal(s.learningRecovery,0,'Recovery protection must end on the open road');
}
// Solved-task recovery cannot be used as a free Nitro pass: rivals may
// counter a player's active stacked boost while the distance cap stays fair.
for(const difficulty of Object.keys(C.DIFFICULTIES)){
 const s=C.createRace(u,difficulty,0,11,{fuel:100});s.status='resolving';s.task=s.tasks[0];s.task.answeredRight=true;s.resolve=2;s.learningRecovery=1.2;s.distance=300;s.tasks=[];s.obstacles=[];s.lane=1;s.speedFactor=C.REGULAR_MAX_SPEED;s.accelerating=true;s.rivals=s.rivals.slice(0,1);const r=s.rivals[0];Object.assign(r,{at:270,lane:-1,lanePos:-1,speed:s.arena.speed*C.REGULAR_MAX_SPEED,fuel:60,nextTask:0});
 for(let j=0;j<3;j++)assert(C.activateNitro(s));
 const before=r.at-s.distance;for(let j=0;j<18;j++){const gap=r.at-s.distance;C.tick(s,.05,1);assert(r.at-s.distance<=gap+1e-7);}
 assert(C.learningPaceProtected(s));assert(r.nitroActive);assert.equal(r.nitroUses,2);assert.equal(r.fuel,0);assert(r.at-s.distance<=before);
}
// Challenge resumes competitive racing on the road, with the same engine
// ceiling as the player. Extra speed must come from fuel-funded Nitro.
const road=reading('challenge',0,true);road.tasks=[];road.task=null;road.status='driving';road.distance=0;road.speedFactor=C.REGULAR_MAX_SPEED;road.rivals.forEach((r,i)=>Object.assign(r,{at:100+i*50,speed:21*C.REGULAR_MAX_SPEED,fuel:0,nitro:0}));const gap=road.rivals[0].at-road.distance;for(let i=0;i<40;i++)C.tick(road,.05,0);assert(!C.learningPaceProtected(road));assert(road.rivals[0].speed<=road.arena.speed*C.REGULAR_MAX_SPEED+1e-7);assert(road.rivals[0].at-road.distance<=gap+1e-7);
// Wrong routes still have their actual detour and recovery cost.
const wrong=reading('challenge',0);wrong.task=wrong.tasks[2];wrong.taskIndex=2;wrong.distance=wrong.task.at-.01;wrong.lane=(wrong.task.correctIndex+1)%3-1;C.tick(wrong,.05,wrong.lane);assert.equal(wrong.task.answeredRight,false);assert(!wrong.route.shortcut);assert(wrong.slow>0);for(let i=0;i<30&&C.focusCruise(wrong);i++)C.tick(wrong,.05,wrong.lane);assert(!C.learningPaceProtected(wrong),'Wrong detours resume real racing after the focus return');
// Crossings retain the safety exception: a rival already on the stripes exits
// before people enter. Protection then resumes; there is no crossing deadlock.
const crossing=C.createRace(u,'challenge',0,5),ped=crossing.tasks[3];crossing.status='driving';crossing.taskIndex=3;crossing.distance=ped.at-70;crossing.obstacles=[];crossing.rivals=crossing.rivals.slice(0,1);Object.assign(crossing.rivals[0],{at:ped.at,nextTask:3,reading:null});for(let i=0;i<500&&!C.pedestrianReady(crossing,ped);i++)C.tick(crossing,.05,0);assert(C.pedestrianReady(crossing,ped));assert(crossing.rivals[0].at-2.2>=ped.at+14);assert(C.crosswalkOccupied(crossing,ped));const at=crossing.rivals[0].at-crossing.distance;for(let i=0;i<100;i++)C.tick(crossing,.05,0);assert(crossing.rivals[0].at-crossing.distance-at<1e-5,'Rivals stay neutral while the player waits for visitors');
console.log(`PASS: ${cases} correct-answer reading zones across every difficulty/arena, at 30/60/120 Hz; no rival gains with held/released acceleration or Nitro entry, conserved boosts, immediate repairs, open-road Challenge pace, wrong detours and safe crossing clearance.`);

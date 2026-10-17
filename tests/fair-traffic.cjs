const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {keepHolding}=require('./attentive-driver.cjs');
global.window={};for(const f of ['language-bank.js','repair-bank.js','match-bank.js','emoji-bank.js','game-core.js'])require(path.resolve((fs.existsSync('dist/language-bank.js')?'dist/':'')+f));
const C=window.RallyCore,{createDrivingFeel,updateDrivingFeel}=require('./driving-feel-compiled.cjs'),u=window.LANGUAGE_BANK[0].units[0];
// This driver reads actual vehicles, not the generator's reserved escape lane.
function evade(s,m){
  const closing=Math.max(8,s.arena.speed*C.MAX_SPEED-8),range=closing*1.65+8;
  const threats=[...s.obstacles,...s.rivals].filter(o=>o.at>s.distance-8&&o.at-s.distance<range);
  if(!threats.length)return;
  const closest=Math.min(...threats.filter(o=>o.at>s.distance).map(o=>o.at)),row=threats.filter(o=>o.at>=closest&&o.at-closest<15);
  const options=[-1,0,1].filter(l=>row.every(o=>Math.abs(l-o.lanePos)>.8));
  const clear=options.filter(l=>C.playerLaneClear(s,m.lane,l));if(clear.length)s.lane=clear.sort((a,b)=>Math.abs(a-m.lane)-Math.abs(b-m.lane))[0];
}
const requestedSeeds=Number(process.env.WORDRAMP_TEST_SEEDS??process.env.WORDRIFT_TEST_SEEDS),seedCount=Number.isInteger(requestedSeeds)&&requestedSeeds>0?Math.min(24,requestedSeeds):24;
let races=0,vehicles=0;
for(const difficulty of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(let seed=1;seed<=seedCount;seed++)for(const accelerating of [false,true])for(const tasks of [false,true])for(const useNitro of [false,true]){
  const s=C.createRace(u,difficulty,arena,seed,{fuel:30}),m=createDrivingFeel();s.status='driving';if(!tasks)s.tasks=[];
  C.setAccelerating(s,accelerating);C.setNitroHeld(s,useNitro);let entered='',readAt=0,firstBump=null;
  for(let frame=0;frame<Math.ceil((s.initialTime+300)/.05)&&!['finished','failed'].includes(s.status);frame++){
    // Simulate a fresh hold whenever repair autopilot returns the controls.
    C.setAccelerating(s,accelerating);C.setNitroHeld(s,useNitro);
    if(s.status==='task'){
      const t=s.task,key=t.id+':'+(t.personIndex??0);if(key!==entered){entered=key;readAt=s.elapsed;}
      if(t.kind==='pedestrian'){if(C.pedestrianReady(s,t)&&!t.pedWait&&s.elapsed-readAt>.25)C.sortPerson(s,t.people[t.personIndex].side);}
      else if(t.kind==='repair'){if(s.elapsed-readAt>.25)C.connectRepair(s,[0,1,2]);}
      else C.choose(s,t.correctIndex);
    }else if(!C.exitAssist(s)&&!s.route)evade(s,m);
    if(useNitro)C.activateNitro(s);
    if(!keepHolding(C,s,m.lane)){C.setAccelerating(s,false);C.setNitroHeld(s,false);}const positions=s.obstacles.map(o=>o.at),bumps=s.collisions;C.tick(s,.05,m.lane);if(s.collisions>bumps&&!firstBump)firstBump={distance:s.distance,target:s.lane,task:s.task?.kind,taskIndex:s.taskIndex,lane:m.lane,cars:s.obstacles.filter(o=>o.at-s.distance>-10&&o.at-s.distance<50).map(o=>({at:o.at,lane:o.lanePos,route:o.crosswalkRoute,hit:o.hit}))};const oldLane=m.lane;updateDrivingFeel(m,s.lane,s.distance,s.arena.speed*s.speedFactor,.05);if(!C.playerLaneClear(s,oldLane,m.lane)){m.lane=oldLane;m.velocity=0;}
    s.obstacles.forEach((o,i)=>{assert(o.at>=positions[i]);assert(o.at-positions[i]<=o.cruiseSpeed*.05+1e-8,'Fairness cannot be obtained by teleporting vehicles');});
  }
  assert.equal(s.status,'finished',`${difficulty}/${arena}/${seed}/${accelerating}/${tasks}: ${JSON.stringify({distance:s.distance,lane:m.lane,target:s.lane,following:s.followingTraffic,near:[...s.obstacles,...s.rivals].filter(o=>Math.abs(o.at-s.distance)<80)})}`);
  assert.equal(s.collisions,0,`An attentive driver must have a clean route: ${difficulty}/${arena}/${seed}/${accelerating}/${tasks}/${useNitro} ${JSON.stringify(firstBump)}`);
  if(tasks){assert.equal(s.correct,s.tasks.length);assert.equal(C.stars(s),3);}
  races++;vehicles+=s.obstacles.length;
}
// A reckless driver still gets a real traffic penalty: clean-route checks must
// not pass merely because ordinary collision handling has been disabled.
const crash=C.createRace(u,'challenge',2,50);crash.tasks=[];crash.status='driving';crash.obstacles=[{id:0,at:25,lane:0,lanePos:0,type:'traffic',speed:0,cruiseSpeed:0,passed:false}];
// Recklessness means holding acceleration: an unheld car brakes (v0.23.1).
C.setAccelerating(crash,true);for(let i=0;i<40&&!crash.collisions;i++)C.tick(crash,.05,0);assert.equal(crash.collisions,1);assert(crash.slow>0);
// Ordinary close cut-ins stay signaled in their original lane. A merge into
// another vehicle's footprint must wait even when the player is far away.
function merge(at,target,other){const s=C.createRace(u);s.tasks=[];s.status='driving';s.obstacles=[{id:0,at,lane:-1,lanePos:-1,type:'traffic',speed:8,cruiseSpeed:8,moving:true,target,changed:false,laneProgress:0},...(other?[{id:1,at:at+1,lane:target,lanePos:target,type:'traffic',speed:8,cruiseSpeed:8,moving:false,target,laneProgress:0}]:[])];return s;}
let near=merge(20,0,false);for(let i=0;i<12;i++)C.tick(near,.05,-1);assert(near.obstacles[0].changed);assert.equal(near.obstacles[0].lanePos,-1,'No close cut-in, even after the signal delay');
let blocked=merge(100,0,true);for(let i=0;i<30;i++)C.tick(blocked,.05,1);assert.equal(blocked.obstacles[0].lanePos,-1,'Merging vehicles need physical clearance');
let clear=merge(110,0,false);for(let i=0;i<12;i++)C.tick(clear,.05,1);assert.equal(clear.obstacles[0].lanePos,-1,'The turn signal precedes lateral movement');for(let i=0;i<7;i++)C.tick(clear,.05,1);assert(clear.obstacles[0].lanePos>-1);
// Same steering timing at 30, 60 and 120 Hz; rapid reversals stay on the road.
for(const hz of [30,60,120]){const m=createDrivingFeel();for(let i=0;i<hz*.3;i++)updateDrivingFeel(m,1,(i+1)*20/hz,20,1/hz);assert(m.lane>.99&&m.lane<=1);assert(m.wheelAngle!==0);for(let i=0;i<hz;i++){updateDrivingFeel(m,i<hz/2?-1:1,6+(i+1)*20/hz,20,1/hz);assert(Math.abs(m.lane)<=1);assert(Math.abs(m.roll)<=.106);assert(Math.abs(m.pitch)<=.061);}const before=JSON.stringify(m);updateDrivingFeel(m,-1,200,40,.1,true);assert.equal(JSON.stringify(m),before,'Pause freezes steering and wheel rotation');}
let stop=createDrivingFeel();for(let i=0;i<10;i++)updateDrivingFeel(stop,0,0,0,.05);assert.equal(stop.bob,0);assert(stop.braking);updateDrivingFeel(stop,0,1,20,.05);assert(!stop.braking);updateDrivingFeel(stop,0,1.4,8,.05);assert(stop.braking);
console.log(`PASS: ${races} normal/full-acceleration/nitro races with and without learning zones; zero bumps on an independently chosen escape route, ${vehicles} continuously moving traffic identities. Real collision penalties, merge warnings/clearance, 30/60/120 Hz steering, bounded body motion, wheel travel, braking and pause verified.`);

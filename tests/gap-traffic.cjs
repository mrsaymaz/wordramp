const assert=require('node:assert/strict');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','game-core'])require('../dist/'+f+'.js');
const C=window.RallyCore,unit=window.LANGUAGE_BANK[0].units[0];let cases=0;
for(const mode of Object.keys(C.DIFFICULTIES))for(const hz of [30,60,120]){
 const s=C.createRace(unit,mode,2,5,{rivals:false});s.status='driving';s.tasks=[];s.obstacles=[];s.time=1000;
 // Mid-sequence rows: the v0.23.1 entry wait is checked separately below.
 s.patterns=[0,0,1,1,0].map((escapeLane,i)=>({id:i,at:160+i*64,escapeLane,entry:false}));
 for(const p of s.patterns)for(const lane of [-1,0,1].filter(l=>l!==p.escapeLane))s.obstacles.push({id:s.obstacles.length,patternId:p.id,type:'barrier',at:p.at,lane,lanePos:lane,speed:0,cruiseSpeed:0,halfLength:1.6,halfWidth:1.2});
 const car={id:20,type:'traffic',at:100,lane:-1,lanePos:-1,fromLane:-1,target:-1,speed:12,cruiseSpeed:12,changed:false,laneProgress:0,moving:false,color:0,passed:false};s.obstacles.push(car);let signalled=false;
 for(let i=0;i<hz*32;i++){
  // Keep the player outside this isolated traffic manoeuvre.
  s.distance=0;const at=car.at;C.tick(s,1/hz,0);signalled||=car.signalAt!=null;
  assert(car.at>=at&&car.at-at<=12/hz+1e-7,'Gap following must never reposition a car');assert(C.vehicleOnRoad(s,car));
  for(const o of s.obstacles.filter(o=>o!==car)){const along=Math.abs(o.at-car.at),across=Math.abs(C.actorX(s,o)-C.actorX(s,car));assert(along>=2.3+o.halfLength-.03||across>=1.25+o.halfWidth-.03,'The car must clear each solid road obstacle');}
 }
 assert(signalled);assert(car.at>440,'Traffic must pass successive changing gaps instead of blocking the road');assert(Math.abs(car.lanePos)<.1);cases++;
}
// Civilians wait before an obstacle sequence's entry row while the player is
// behind it, then resume once the player has cleared its entrance.
for(const hz of [30,60,120]){
 const s=C.createRace(unit,'challenge',2,5,{rivals:false});s.status='driving';s.tasks=[];s.time=1000;s.patterns=[{id:0,at:300,escapeLane:0,entry:true}];
 s.obstacles=[-1,1].map((lane,i)=>({id:i,patternId:0,type:'barrier',at:300,lane,lanePos:lane,speed:0,cruiseSpeed:0,halfLength:1.6,halfWidth:1.2}));
 const car={id:9,type:'traffic',at:200,lane:0,lanePos:0,fromLane:0,target:0,speed:12,cruiseSpeed:12,changed:false,laneProgress:0,moving:false,color:0,passed:false};s.obstacles.push(car);
 for(let i=0;i<hz*20;i++){s.distance=0;C.tick(s,1/hz,1);assert(car.at<=300-50+1e-6,'Civilians wait 50 m before an entry row while the player is behind');}
 assert(car.speed<.05);s.distance=361;for(let i=0;i<hz*6;i++){s.distance=361;C.tick(s,1/hz,1);}assert(car.at>255,'Civilians resume once the player has cleared the entrance');cases++;
}
console.log(`PASS: ${cases} civilian gap-following and entry-wait runs at 30/60/120 Hz; successive lane changes, visible signalling, no deadlock, no backward correction, no obstacle overlap and continuous on-road motion.`);
for(const hz of [30,60,120]){
 const s=C.createRace(unit,'challenge',2,1,{rivals:false});s.status='driving';s.tasks=[];s.patterns=[{id:0,at:160,escapeLane:-1}];s.distance=152.8;s.lane=1;s.speedFactor=0;
 s.obstacles=[0,1].map(lane=>({id:lane,patternId:0,at:160,lane,lanePos:lane,type:'barrier',speed:0,cruiseSpeed:0,halfLength:1.6,halfWidth:1.2}));
 const car={id:10,type:'traffic',at:152.8,lane:0,lanePos:0,fromLane:0,target:0,speed:0,cruiseSpeed:12,changed:false,laneProgress:0,moving:false,color:0};s.obstacles.push(car);
 for(let i=0;i<hz*3;i++)C.tick(s,1/hz,1);
 assert(car.lanePos<-.95&&car.at>153.2,'A stopped civilian beside the player can signal and move away into the clear gap');assert.equal(s.collisions,0);
}
console.log('PASS: stopped traffic can clear a blocked row beside the player at 30/60/120 Hz without a close cut-in or a collision.');
const {createDrivingFeel,updateDrivingFeel}=require('./driving-feel-compiled.cjs');
let shortcuts=0;
for(const mode of Object.keys(C.DIFFICULTIES))for(const hz of [30,60,120]){
 const s=C.createRace(unit,mode,0,1),fork=s.tasks[6];fork.correctIndex=2;fork.rows[0].correctIndex=2;s.taskRevision++;
 s.status='driving';s.taskIndex=7;s.obstacles=[];s.patterns=[];s.route=C.makeRoute(s,fork,2,true);s.distance=fork.at+43.4904340186458;s.roadTravel=s.distance;s.lane=1;s.speedFactor=0;
 const r=s.rivals[0];s.rivals=[r];Object.assign(r,{at:s.distance+4.8733064103037,lane:1,lanePos:1.7799998400506782,speed:0,fuel:0,nitro:0,route:{...s.route},nextTask:7,passingOffset:0});
 const start=s.distance,m=createDrivingFeel(1,s.roadTravel);
 assert(C.playerLaneClear(s,1,.7),'A safe separating movement remains available inside the extra collision margin');// v0.23.1 uses the physical body window for player lane steps; check the
 // block with the rival inside it, then restore the original scenario.
 const placed=r.at;r.at=s.distance+4.5;assert(!C.playerLaneClear(s,1,1.05),'Moving toward the nearby rival remains blocked');r.at=placed;
 for(let i=0;i<hz*8;i++){
  C.tick(s,1/hz,m.lane);const old=m.lane;updateDrivingFeel(m,s.lane,s.roadTravel,s.arena.speed*s.speedFactor,1/hz);if(!C.playerLaneClear(s,old,m.lane)){m.lane=old;m.velocity=0;}
  const body={at:s.distance,lanePos:m.lane,route:s.route};assert(Math.abs(r.at-s.distance)>=4.6-.03||Math.abs(C.actorX(s,r)-C.actorX(s,body))>=2.35-.03,'The guided shortcut must not overlap either car');
 }
 assert(s.distance>start+80&&r.at>start+80,'Both cars must leave the shared shortcut');assert.equal(s.collisions,0);shortcuts++;
}
console.log(`PASS: ${shortcuts} close-rival shortcut recoveries; a small guided movement keeps the chosen branch, lets both cars clear and preserves collision margins at 30/60/120 Hz.`);

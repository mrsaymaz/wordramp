const assert=require('node:assert/strict'),path=require('node:path');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require(path.resolve('dist/'+f+'.js'));
const C=window.RallyCore,{createDrivingFeel,updateDrivingFeel}=require('./driving-feel-compiled.cjs'),unit=window.LANGUAGE_BANK[0].units[0];
let impacts=0,passes=0;

// Releasing the forward inputs is an explicit way to coast/brake. Holding
// again commits to contact, so assistance cannot prevent an intentional crash.
for(const hz of [30,60,120]){
  const s=C.createRace(unit,'relaxed',0,26,{fuel:30,rivals:false});s.status='driving';s.tasks=[];s.patterns=[];s.obstacles=[{id:0,at:35,lane:0,lanePos:0,type:'barrier',speed:0,cruiseSpeed:0,halfLength:1.6,halfWidth:1.2}];s.speedFactor=C.REGULAR_MAX_SPEED;C.activateNitro(s);const saved=s.nitro;
  C.setAccelerating(s,false);C.setNitroHeld(s,false);for(let i=0;i<hz*4;i++)C.tick(s,1/hz,0);
  assert.equal(s.damage,0);assert(s.distance<=35-C.VEHICLE_GAP+.01);assert.equal(s.nitro,saved);
  C.setAccelerating(s,true,false);for(let i=0;i<hz*3&&!s.damage;i++)C.tick(s,1/hz,0);assert.equal(s.damage,1,'A held accelerator reaches the real bumper boundary');assert.equal(s.nitro,saved);
}

// A civilian yields before the obstacle sequence rather than parking in its
// sole gap. The player passes it and the two barriers without brake assistance.
let reservedOpenings=0;
for(const difficulty of ['relaxed','challenge'])for(let arena=0;arena<3;arena++)for(const hz of [30,60,120]){
  const s=C.createRace(unit,difficulty,arena,27,{rivals:false}),m=createDrivingFeel();s.status='driving';s.tasks=[];s.patterns=[{id:0,at:200,escapeLane:1}];
  const car={id:2,at:120,lane:1,lanePos:1,fromLane:1,target:1,laneProgress:0,type:'traffic',speed:8,cruiseSpeed:8,passed:false,hit:false,moving:false,changed:false};
  s.obstacles=[...[-1,0].map((lane,id)=>({id,patternId:0,at:200,lane,lanePos:lane,type:'barrier',speed:0,cruiseSpeed:0,halfLength:1.6,halfWidth:1.2})),car];let waited=false;
  for(let frame=0;frame<hz*17;frame++){
    const before=car.at;s.lane=s.distance<170?0:1;C.tick(s,1/hz,m.lane);const old=m.lane;updateDrivingFeel(m,s.lane,s.roadTravel,s.arena.speed*s.speedFactor,1/hz);if(!C.playerLaneClear(s,old,m.lane)){m.lane=old;m.velocity=0;}
    assert(car.at>=before&&car.at-before<=8/hz+1e-6,'Yielding keeps the same continuously moving identity');
    if(car.waiting){waited=true;assert(car.at<=150.01,'The stopped car leaves a separate readable obstacle row');}
  }
  assert(waited);assert.equal(s.damage,0);assert(s.distance>300);assert(car.at>152,'The civilian resumes once the racer clears the sequence');reservedOpenings++;
}

// Recovery aggression is suspended again for mandatory English time.
let protectedRecoveries=0;
for(const difficulty of ['relaxed','challenge'])for(const kind of ['light','repair','junction','pedestrian']){
  const s=C.createRace(unit,difficulty,0,28,{fuel:0}),t=s.tasks.find(t=>t.kind===kind);s.status='task';s.task=t;s.taskIndex=s.tasks.indexOf(t);s.distance=t.at-(kind==='pedestrian'?150:kind==='repair'?70:C.CHOICE_FOCUS_DISTANCE);s.speedFactor=C.REGULAR_MAX_SPEED;s.obstacles=[];s.damage=1;s.impactRecovery=C.IMPACT_RECOVERY;s.slow=3;
  s.rivals.forEach((r,i)=>Object.assign(r,{at:s.distance-35-i*20,lane:i?-1:1,lanePos:i?-1:1,nextTask:s.taskIndex,fuel:0}));
  const lead=s.rivals.map(r=>r.at-s.distance);
  for(let frame=0;frame<120;frame++){C.setAccelerating(s,true);C.tick(s,1/60,s.lane);s.rivals.forEach((r,i)=>assert(r.at-s.distance<=lead[i]+.002,'Recent impact recovery must not remove English-task fairness'));}
  assert.equal(s.impactRecovery,C.IMPACT_RECOVERY,'Task time does not consume the open-road recovery window');assert.equal(s.damage,1);protectedRecoveries++;
}

// Relative motion is resolved against the car's actual end-of-step position.
// A rear-end collision is possible; ordinary equal-speed following is stable.
let vehicleContacts=0;
for(const hz of [30,60,120])for(const boost of [false,true]){
  for(const following of [false,true]){
    const s=C.createRace(unit,'challenge',0,22,{fuel:100,rivals:false});s.status='driving';s.tasks=[];s.patterns=[];s.speedFactor=boost?C.MAX_SPEED:C.REGULAR_MAX_SPEED;
    const speed=following?s.arena.speed*s.speedFactor:8,o={id:0,at:following?5.5:80,lane:0,lanePos:0,fromLane:0,target:0,laneProgress:0,type:'traffic',speed,cruiseSpeed:speed,passed:false,hit:false,moving:false,changed:false};s.obstacles=[o];
    if(boost)for(let i=0;i<3;i++)C.activateNitro(s);
    const entry=s.speedFactor;
    for(let i=0;i<hz*4&&!s.damage;i++){
      C.setAccelerating(s,true);C.tick(s,1/hz,0);
      if(!s.damage)assert(s.speedFactor>=entry*.98,'Moving traffic does not create an early automatic-braking zone');
      assert(o.at-s.distance>=4.6+.2,'Moving bodies keep their physical gap');
    }
    assert.equal(s.damage,following?0:1,JSON.stringify({hz,boost,following,player:{distance:s.distance,speed:s.speedFactor},car:o}));if(!following)vehicleContacts++;
  }
}

// Use an actual generated obstacle row, its reserved gap and both rival AIs.
// These are swept driving collisions: never invoke contactBump directly.
for(const difficulty of ['relaxed','challenge'])for(let arena=0;arena<3;arena++)for(const hz of [30,60,120])for(const boost of [false,true]){
  const s=C.createRace(unit,difficulty,arena,23,{fuel:100}),pattern=s.patterns[0],row=s.obstacles.filter(o=>o.patternId===pattern.id),target=row[0];
  s.status='driving';s.tasks=[];s.patterns=[pattern];s.obstacles=row;s.distance=target.at-75;s.lane=target.lane;s.speedFactor=boost?C.MAX_SPEED:C.REGULAR_MAX_SPEED;
  s.rivals.forEach((r,i)=>Object.assign(r,{at:s.distance-12-i*14,lane:i?target.lane:pattern.escapeLane,lanePos:i?target.lane:pattern.escapeLane,speed:s.arena.speed*C.REGULAR_MAX_SPEED,fuel:0,nitro:0}));
  if(boost)for(let i=0;i<3;i++)C.activateNitro(s);
  const speed=s.speedFactor,clearance=2.3+(target.halfLength??2.3)+.25;let collision=null;
  for(let frame=0;frame<hz*8&&!collision;frame++){
    C.setAccelerating(s,true);const oldSpeed=s.speedFactor,before=s.distance;C.tick(s,1/hz,s.lane);
    if(!s.damage){assert(s.speedFactor>=speed*.98,'No invisible pre-impact brake zone');assert(s.distance>before);}
    else collision={at:s.elapsed,gaps:s.rivals.map(r=>s.distance-r.at),approach:oldSpeed};
  }
  assert(collision,'Holding an occupied lane must reach a real impact');assert(collision.approach>=speed*.98);assert.equal(s.damage,1);assert.equal(s.collisions,1);assert(Math.abs(target.at-s.distance-clearance)<.02,'Impact occurs at the bumper, not at the former 7.2 m queue line');
  assert(s.rivals.every(r=>r.at<s.distance),'The player is still leading at this impact');
  const savedCharge=s.nitro;
  for(let frame=0;frame<hz*3.5;frame++){
    const old=s.rivals.map(r=>r.at);C.setAccelerating(s,true);C.tick(s,1/hz,s.lane);
    s.rivals.forEach((r,i)=>{assert(r.at>=old[i]);assert(r.at-old[i]<=s.arena.speed*C.MAX_SPEED/hz+1e-5,'Catch-up advances continuously within the same speed limit');assert(C.vehicleOnRoad(s,r,r.at,r.lanePos));});
  }
  s.rivals.forEach((r,i)=>assert(s.distance-r.at<collision.gaps[i]-8,'Obstacle courtesy must not suppress rival recovery after a collision'));
  assert(s.rivals.some(r=>r.at>s.distance+5),'A nearby rival must visibly pass a driver who stays at the obstacle');passes++;
  assert.equal(s.damage,1,'Sustained bumper contact remains a single hit');assert.equal(s.nitro,savedCharge,'A held boost stays banked while pinned after impact');const escapeBlocker=C.playerLaneBlocker(s,s.lane,pattern.escapeLane);assert(!row.includes(escapeBlocker),'The obstacle itself must not trap a steering escape while rivals pass');impacts++;
}

// A driver who steers away immediately still loses ground during recovery.
let movingRecoveries=0;
for(const difficulty of ['relaxed','challenge'])for(let arena=0;arena<3;arena++)for(const hz of [30,60,120]){
  const s=C.createRace(unit,difficulty,arena,23,{fuel:0}),p=s.patterns[0],row=s.obstacles.filter(o=>o.patternId===p.id),o=row[0];
  s.status='driving';s.tasks=[];s.patterns=[p];s.obstacles=row;s.distance=o.at-75;s.lane=o.lane;s.speedFactor=C.REGULAR_MAX_SPEED;
  s.rivals.forEach((r,i)=>Object.assign(r,{at:s.distance-12-i*14,lane:i?o.lane:p.escapeLane,lanePos:i?o.lane:p.escapeLane,speed:s.arena.speed*C.REGULAR_MAX_SPEED,fuel:0}));
  while(!s.damage){C.setAccelerating(s,true);C.tick(s,1/hz,s.lane);}
  const m=createDrivingFeel(s.lane,s.roadTravel),gaps=s.rivals.map(r=>s.distance-r.at),before=s.distance;
  for(let frame=0;frame<hz*3.5;frame++){
    if(C.playerLaneClear(s,m.lane,p.escapeLane))s.lane=p.escapeLane;C.setAccelerating(s,true);C.tick(s,1/hz,m.lane);
    const old=m.lane;updateDrivingFeel(m,s.lane,s.roadTravel,s.arena.speed*s.speedFactor,1/hz);if(!C.playerLaneClear(s,old,m.lane)){m.lane=old;m.velocity=0;}
  }
  assert(s.distance>before+25,'The driver escapes and continues rather than staying parked');assert.equal(s.damage,1);assert(s.rivals.some((r,i)=>s.distance-r.at<gaps[i]-5),'Rivals close the gap during a genuine moving recovery: '+JSON.stringify({difficulty,arena,hz,gaps,after:s.rivals.map(r=>({gap:s.distance-r.at,lane:r.lanePos,target:r.lane,speed:r.speed})),player:{distance:s.distance,lane:m.lane,speed:s.speedFactor},pattern:p}));movingRecoveries++;
}

// Drive into three separate obstacles on one continuous course, steering out
// after each of the first two. A large earlier lead cannot turn DNF into a win.
let breakdowns=0;
for(const difficulty of ['relaxed','challenge'])for(const hz of [30,60,120]){
  const s=C.createRace(unit,difficulty,0,51,{fuel:0}),m=createDrivingFeel(0,0);s.status='driving';s.tasks=[];s.patterns=[];
  s.obstacles=[180,350,520].map((at,id)=>({id,at,lane:0,lanePos:0,type:'barrier',speed:0,cruiseSpeed:0,halfLength:1.6,halfWidth:1.2}));
  s.rivals.forEach((r,i)=>Object.assign(r,{at:-1200-i*20,lane:i?-1:1,lanePos:i?-1:1,fuel:0}));
  let lastHit=null,seen=0;
  for(let frame=0;frame<hz*70&&!['failed','finished'].includes(s.status);frame++){
    C.setAccelerating(s,true);
    if(s.damage>seen){seen=s.damage;lastHit=s.obstacles[seen-1];}
    const target=lastHit&&s.distance<lastHit.at+20?1:0;
    if(C.playerLaneClear(s,m.lane,target))s.lane=target;
    C.tick(s,1/hz,m.lane);const old=m.lane;updateDrivingFeel(m,s.lane,s.roadTravel,s.arena.speed*s.speedFactor,1/hz);if(!C.playerLaneClear(s,old,m.lane)){m.lane=old;m.velocity=0;}
  }
  assert.equal(s.damage,3);assert.equal(s.collisions,3);assert.equal(s.status,'failed');assert.equal(s.failureReason,'breakdown');assert(s.rivals.every(r=>r.at<s.distance),'Test retains the earlier physical lead');assert(C.raceFailed(s));assert(!C.raceSucceeded(s));assert.equal(C.stars(s),0);assert(C.raceOrder(s).find(r=>r.id==='player').dnf);assert.equal(C.raceOrder(s).at(-1).id,'player');breakdowns++;
  // Even stale finish metadata cannot revive the broken car.
  s.status='finished';s.finishedAt=1;s.distance=s.arena.length;assert(!C.raceSucceeded(s));assert.equal(C.stars(s),0);assert.equal(C.raceOrder(s).at(-1).id,'player');
}
console.log(`PASS: ${impacts} real bumper impacts and ${passes} visible rival passes with generated obstacles, both modes, all arenas, regular/Nitro entry and 30/60/120 Hz; ${vehicleContacts} moving-car contacts and stable equal-speed following; ${movingRecoveries} moving recoveries lose ground without extra damage; ${protectedRecoveries} task approaches suspend catch-up; ${reservedOpenings} civilian yields preserve the obstacle opening. No approach braking or teleports, one hit per scrape and a clear escape. ${breakdowns} continuous three-crash races fail despite a large lead; stale finish metadata remains DNF.`);

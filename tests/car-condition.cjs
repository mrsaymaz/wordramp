const assert=require('node:assert/strict'),path=require('node:path');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require(path.resolve('dist/'+f+'.js'));
const C=window.RallyCore,u=window.LANGUAGE_BANK[0].units[0];
const race=(difficulty='challenge',arena=0)=>{const s=C.createRace(u,difficulty,arena,81,{fuel:100});s.status='driving';s.tasks=[];s.obstacles=[];s.rivals=[];return s;};
const obstacle=(id,at=30,lane=0)=>({id,at,lane,lanePos:lane,type:'barrier',speed:0,cruiseSpeed:0,passed:false,hit:false});
function run(s,seconds,hz=60){for(let i=0;i<Math.ceil(seconds*hz);i++)C.tick(s,1/hz,s.lane);}

let scenarios=0;
for(const difficulty of ['relaxed','challenge'])for(let arena=0;arena<3;arena++)for(const hz of [30,60,120]){
  const s=race(difficulty,arena),grace=C.COLLISION_GRACE[difficulty];
  assert.deepEqual(C.carCondition(s),{damage:0,remaining:3,critical:false,broken:false});
  s.speedFactor=C.REGULAR_MAX_SPEED;C.activateNitro(s);C.setAccelerating(s,true);const charge=s.nitro,time=s.time;
  const first=obstacle(0,7.2);s.obstacles=[first];
  assert(C.contactBump(s,first));assert.equal(s.damage,1);assert.equal(s.collisions,1);assert.equal(s.time,time-s.diff.penalty);assert.equal(s.nitro,charge);assert(!s.nitroActive);assert(s.accelerationHeld);assert.equal(s.invulnerable,grace);
  run(s,grace+.5,hz);
  assert.equal(s.damage,1,'Waiting against the same obstacle cannot become a second impact');
  assert(!C.contactBump(s,first));assert.equal(s.status,'driving');
  const second=obstacle(1,s.distance+7.2);s.obstacles=[second];
  assert(C.contactBump(s,second));assert.equal(C.carCondition(s).remaining,1);assert(C.carCondition(s).critical);
  const protectedScrape=obstacle(2,s.distance+7.2);assert(!C.contactBump(s,protectedScrape));
  run(s,grace+.5,hz);assert(!C.contactBump(s,protectedScrape),'A scrape during protection cannot cause delayed damage');assert.equal(s.damage,2);
  s.obstacles=[];s.speedFactor=C.REGULAR_MAX_SPEED;s.distance=s.arena.length-.05;
  assert(C.contactBump(s,obstacle(3,s.distance+7.2)));assert.equal(s.status,'breakdown');assert.equal(s.failureReason,'breakdown');assert.equal(s.collisions,3);assert.equal(s.damage,3);assert(!s.accelerationHeld&&!s.accelerating&&!s.nitroHeld&&!s.nitroActive);assert(!C.move(s,1));assert(!C.canEngageNitro(s));
  let previous=s.speedFactor;
  while(s.status==='breakdown'){C.tick(s,1/hz,s.lane);assert(s.speedFactor<=previous+1e-8,'The engine decelerates continuously');previous=s.speedFactor;assert(s.distance<s.arena.length,'A third strike never becomes a finish-line win');}
  assert.equal(s.status,'failed');assert.equal(s.speedFactor,0);assert.equal(C.stars(s),0);assert(!C.contactBump(s));assert.equal(s.collisions,3);
  const frozen=JSON.stringify(s);run(s,1,hz);assert.equal(JSON.stringify(s),frozen,'Failure is terminal');
  const retry=C.createRace(u,difficulty,arena,81);assert.equal(C.carCondition(retry).remaining,3);assert.equal(retry.collisions,0);assert.equal(retry.lastImpact,null);scenarios++;
}

// Real forward-contact path, including its braking grace and contact identity.
for(const difficulty of ['relaxed','challenge']){
  const s=race(difficulty),o=obstacle(0,25);s.obstacles=[o];C.setAccelerating(s,true);
  for(let i=0;i<600&&!s.collisions;i++)C.tick(s,1/60,0);
  assert.equal(s.collisions,1);assert.equal(s.damage,1);assert(o.hit);run(s,6);assert.equal(s.damage,1);assert(o.at-s.distance>=2.3+(o.halfLength??2.3)+.2,'Bumper contact preserves the physical body gap');
  s.obstacles=[];run(s,2);assert(!s.damageContacts.includes(o),'A hazard unlatches only after physical separation');
}
// A side swipe carries the exact actor reference, even with duplicate ids.
{
  const s=race(),o=obstacle(0,0,1);s.obstacles=[o];assert.equal(C.playerLaneBlocker(s,0,1),o);assert(!C.playerLaneClear(s,0,1));assert(C.contactBump(s,C.playerLaneBlocker(s,0,1)));run(s,3);assert.equal(s.damage,1);
}

// English penalties and guided phases never consume condition marks.
let protectedCases=0;
for(const difficulty of ['relaxed','challenge'])for(const kind of ['light','repair','junction','pedestrian']){
  const s=C.createRace(u,difficulty,0,82),t=s.tasks.find(t=>t.kind===kind);s.task=t;s.taskIndex=s.tasks.indexOf(t);s.status='task';s.distance=t.at-35;s.speedFactor=C.REGULAR_MAX_SPEED;
  C.tick(s,.01,s.lane);const time=s.time;assert(!C.contactBump(s,obstacle(0,s.distance+4)));
  if(kind==='repair'){C.connectRepair(s,[0,2,1]);assert(s.time<time);}
  if(kind==='light'||kind==='junction'){s.lane=(t.correctIndex+1)%3-1;s.distance=t.at-.001;C.tick(s,.01,s.lane);assert(s.time<time);}
  if(kind==='pedestrian'){t.peopleEntryAt=s.elapsed-2;t.sortStartedAt=s.elapsed-2;t.people[0].entryAt=s.elapsed-2;C.sortPerson(s,1-t.people[0].side);assert(s.time<time);}
  assert.equal(s.damage,0);assert.equal(s.collisions,0);assert(!C.contactBump(s,obstacle(1,s.distance+4)));protectedCases++;
}
for(const flags of [{learningRecovery:1},{yielding:'crossing'},{route:{taskId:'route'}}]){
  const s=race();Object.assign(s,flags);assert(!C.contactBump(s));assert.equal(s.damage,0);
}
// Catch-up comes from continuous rival travel during the slowdown, not a jump.
for(const difficulty of ['relaxed','challenge']){
  const s=C.createRace(u,difficulty,0,83,{fuel:0});s.status='driving';s.tasks=[];s.obstacles=[];s.distance=100;s.lane=0;s.speedFactor=C.REGULAR_MAX_SPEED;
  s.rivals.forEach((r,i)=>{r.at=75-i*15;r.lane=r.lanePos=i?-1:1;r.speed=s.arena.speed*C.REGULAR_MAX_SPEED;});
  C.setAccelerating(s,true);const gaps=s.rivals.map(r=>s.distance-r.at);assert(C.contactBump(s));
  for(let i=0;i<72;i++){const positions=s.rivals.map(r=>r.at);C.tick(s,1/60,0);s.rivals.forEach((r,j)=>{assert(r.at>=positions[j]);assert(r.at-positions[j]<=s.arena.speed*C.MAX_SPEED/60+1e-6);assert(C.vehicleOnRoad(s,r,r.at,r.lanePos));});}
  s.rivals.forEach((r,i)=>assert(s.distance-r.at<gaps[i]-5,'Nearby rivals naturally close the lost ground'));
}
// Pausing a breakdown preserves the animation; a deadline remains a distinct reason.
{
  const s=race();s.damage=2;C.contactBump(s);C.pause(s);const age=s.breakdown.age;run(s,1);assert.equal(s.breakdown.age,age);C.resume(s);run(s,2);assert.equal(s.failureReason,'breakdown');assert.equal(s.status,'failed');
  const timeout=race();timeout.time=.001;C.tick(timeout,.01);assert.equal(timeout.status,'failed');assert.equal(timeout.failureReason,'time');assert.equal(timeout.damage,0);
}
console.log(`PASS: ${scenarios} three-strike races at 30/60/120 Hz across both modes and all arenas; real front/side contacts, single-scrape latching, mode-specific grace, saved Nitro, continuous rival catch-up, protected English (${protectedCases} wrong-answer cases), monotone breakdown, finish-line failure, pause, timeout and fully repaired retries.`);

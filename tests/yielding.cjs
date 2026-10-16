const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
global.window={};for(const file of ['language-bank.js','repair-bank.js','match-bank.js','game-core.js'])require(path.resolve((fs.existsSync('dist/language-bank.js')?'dist/':'')+file));
const C=window.RallyCore,u=window.LANGUAGE_BANK[0].units[0];
const car=(at,lane,id)=>({id,at,lane,lanePos:lane,type:'traffic',speed:8,cruiseSpeed:8,waiting:false,braking:false,passed:false,moving:false,target:lane,laneProgress:0});
function step(s,count){for(let i=0;i<count;i++)C.tick(s,.05,0);}
function approach(arena=0,difficulty='challenge',accelerate=false){
 const s=C.createRace(u,difficulty,arena,45),t=s.tasks[3];s.status='driving';s.taskIndex=3;s.distance=t.at-70;
 // A dense three-lane queue reproduces the former stop-and-crash transition.
 s.obstacles=[car(t.stopAt-14,0,0),car(t.stopAt-26,0,1),car(t.stopAt-8,1,2),car(t.stopAt-30,-1,3),car(t.at+25,-1,4)];C.setAccelerating(s,accelerate);C.tick(s,.01);return s;
}
let cases=0;
for(let arena=0;arena<3;arena++)for(const difficulty of Object.keys(C.DIFFICULTIES))for(const accelerated of [false,true]){
 const s=approach(arena,difficulty,accelerated),t=s.task;for(let i=0;i<400&&s.worldTimeScale!==0;i++)step(s,1);
 assert.equal(s.status,'task');assert.equal(s.speedFactor,1);assert.equal(s.worldTimeScale,0);assert(Math.abs(s.distance-t.stopAt)<1e-5,'The center lane lets the player reach the stop line instead of joining a long queue');
 assert(s.obstacles.filter(o=>o.at<=t.stopAt+.01).every(o=>Math.abs(o.lanePos)>.95),'Waiting vehicles leave a clear center lane');
 assert.equal(s.collisions,0);const heldAt=s.distance;step(s,10);assert.equal(s.distance,heldAt);
 for(let person=0;person<3;person++){assert(C.sortPerson(s,t.people[t.personIndex].side));step(s,18);assert.equal(s.distance,heldAt);}
 assert(C.sortPerson(s,t.people[3].side));step(s,26);assert(C.crosswalkOccupied(s,t));assert.equal(s.distance,heldAt,'The last person must reach the sidewalk before release');
 step(s,20);assert(!C.crosswalkOccupied(s,t));assert(s.distance>heldAt);assert(s.speedFactor>.9,'After clearance the player promptly regains driving speed');assert(C.exitAssist(s));assert(!C.move(s,1),'The short guided exit keeps the player out of the controlled queue');assert.equal(s.lane,0);assert.equal(s.collisions,0);
 for(let i=0;i<120&&C.exitAssist(s);i++){const before=s.distance;C.tick(s,.05,0);assert(s.distance>before,'There must be no second stop behind the departing queue');assert.equal(s.collisions,0);}
 assert(!C.exitAssist(s));assert(C.move(s,1),'Normal steering resumes after the departure');assert.equal(s.correct,1);cases++;
}
// Unreached crossings cannot build queues from the start of the race.
let future=C.createRace(u);future.status='driving';const later=future.tasks[3];assert(!C.crosswalkOccupied(future,later));step(future,40);assert(later.activatedAt==null);assert(later.clearedAt==null,'A future crossing cannot already be marked as cleared');assert(!future.obstacles.some(o=>o.waitedCrosswalk===later.id));
// Visitors wait on the curb while traffic already on the stripes clears.
let occupied=approach(),crossing=occupied.task;occupied.obstacles=[car(crossing.at,1,20)];crossing.peopleEntryAt=null;crossing.sortStartedAt=null;
C.tick(occupied,.05);assert(crossing.peopleEntryAt==null);assert(!C.sortPerson(occupied,crossing.people[0].side));
for(let i=0;i<200&&!C.pedestrianReady(occupied);i++)C.tick(occupied,.05);assert(C.pedestrianReady(occupied));assert(occupied.obstacles[0].at-2.2>=crossing.at+14);assert(C.sortPerson(occupied,crossing.people[0].side));
let timeout=approach();for(let i=0;i<400&&timeout.worldTimeScale!==0;i++)step(timeout,1);const t=timeout.task;timeout.elapsed=t.sortStartedAt+t.sortDuration;C.tick(timeout,.05);const at=timeout.distance;
assert.equal(timeout.status,'resolving');assert(t.people.every(p=>p.sent));step(timeout,20);assert.equal(timeout.distance,at);step(timeout,35);assert(timeout.distance>at);assert.equal(timeout.collisions,0);assert.equal(timeout.review.length,4);
let paused=approach();for(let i=0;i<400&&paused.worldTimeScale!==0;i++)step(paused,1);C.sortPerson(paused,paused.task.people[0].side);C.pause(paused);const snapshot=JSON.stringify({at:paused.distance,elapsed:paused.elapsed,cars:paused.obstacles.map(o=>o.at)});step(paused,20);assert.equal(JSON.stringify({at:paused.distance,elapsed:paused.elapsed,cars:paused.obstacles.map(o=>o.at)}),snapshot);C.resume(paused);assert(!paused.accelerating);
let last=approach();for(let i=0;i<400&&last.worldTimeScale!==0;i++)step(last,1);for(let i=0;i<3;i++){C.sortPerson(last,last.task.people[last.task.personIndex].side);step(last,18);}last.elapsed=last.task.sortStartedAt+last.task.sortDuration-.1;C.sortPerson(last,last.task.people[3].side);step(last,32);assert.equal(last.correct,1);
console.log(`PASS: ${cases} arena/difficulty/acceleration cases with a dense queue: stop-line access, clear center lane, full pedestrian clearance, prompt speed recovery, zero crossing/departure bumps, and steering restored. Future crossings, curb entry, timeout escorts, pause and final-second answers verified.`);

const assert=require('node:assert/strict');
global.window={};for(const name of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require('../dist/'+name+'.js');
const C=window.RallyCore,u=window.LANGUAGE_BANK[0].units[0];
assert.deepEqual(Object.keys(C.DIFFICULTIES),['relaxed','challenge']);assert.equal(C.createRace(u,'standard').difficulty,'challenge');
let checks=0;
for(const mode of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(const side of [-1,1]){
 const s=C.createRace(u,mode,arena,5),q=s.tasks[0],zone=C.taskZone(q);s.tasks=[q];q.completed=true;s.taskIndex=1;s.status='driving';s.distance=zone.end+26;s.obstacles=[];s.patterns=[];s.rivals=s.rivals.slice(0,1);
 const r=s.rivals[0];Object.assign(r,{at:zone.end+24,lane:side*2.05,lanePos:side*2.05,speed:10,nextTask:1,fuel:0});
 for(let i=0;i<180;i++){C.tick(s,1/60,0);assert(C.vehicleOnRoad(s,r));checks++;}
 assert(Math.abs(r.lanePos)<1.01,'A shoulder car rejoins a normal lane before the road narrows');assert(r.at>zone.end+90,'Rejoining must not strand the rival');
}
// A pair can block the nearest two lanes. Plan the complete safe path rather
// than stopping forever because the adjacent lane also has a barrier.
for(const side of [-1,1]){
 const s=C.createRace(u,'challenge',0,7);s.tasks=[];s.status='driving';s.rivals=s.rivals.slice(0,1);s.patterns=[{id:0,at:150,escapeLane:-side}];s.obstacles=[side,0].map((lane,id)=>({id,type:'barrier',patternId:0,at:150,lane,lanePos:lane,speed:0,halfWidth:1.2,halfLength:1.6}));const r=s.rivals[0];Object.assign(r,{at:100,lane:side,lanePos:side,speed:30,nextTask:100,fuel:0});
 for(let i=0;i<240;i++){C.tick(s,1/60,0);assert(C.vehicleOnRoad(s,r));checks++;}assert(r.at>160,'A rival must pass a two-lane obstacle through its open lane');
}
// Both rivals need the same narrow opening; they must take turns, not wedge
// side by side across its entrance.
{
 const s=C.createRace(u,'challenge',0,7);s.tasks=[];s.status='driving';s.patterns=[{id:0,at:150,escapeLane:0}];s.obstacles=[-1,1].map((lane,id)=>({id,type:'barrier',patternId:0,at:150,lane,lanePos:lane,speed:0,halfWidth:1.2,halfLength:1.6}));
 s.rivals.forEach((r,i)=>Object.assign(r,{at:100,lane:i?1:-1,lanePos:i?1:-1,speed:30,nextTask:100,fuel:0}));
 for(let i=0;i<360;i++){C.tick(s,1/60,0);s.rivals.forEach(r=>assert(C.vehicleOnRoad(s,r)));checks++;}assert(s.rivals.every(r=>r.at>170),'Both racers must clear a shared opening');
}
// Braking to a stop must not freeze a safely committed lane change.
{
 const s=C.createRace(u);s.tasks=[];s.rivals=[];s.patterns=[];s.status='driving';
 const o={id:50,type:'traffic',at:100,lane:0,lanePos:.352,speed:0,cruiseSpeed:12,fromLane:0,target:1,changed:true,laneProgress:.4,signalAt:-1,routeChanging:true};
 s.obstacles=[o,{id:51,type:'barrier',at:107.2,lane:0,lanePos:0,speed:0,cruiseSpeed:0,halfWidth:1.2,halfLength:1.6}];
 for(let i=0;i<300;i++){C.tick(s,1/60,-1);assert(C.vehicleOnRoad(s,o));checks++;}assert(o.at>110,JSON.stringify(o));assert(Math.abs(o.lanePos-1)<.01);
}
// After waiting for the racers, civilian traffic takes the visible central
// branch, not a shoulder that ends at the fork.
for(let arena=0;arena<3;arena++){
 const s=C.createRace(u,'relaxed',arena,8),q=s.tasks.find(t=>t.kind==='junction');s.tasks=[q];q.completed=true;q.enteredAt=0;s.taskIndex=1;s.status='driving';s.distance=q.at+300;s.rivals=[];s.patterns=[];
 const o={id:50,type:'traffic',at:q.at-100,lane:1,lanePos:2.9,speed:12,cruiseSpeed:12,fromLane:2.9,target:2.9,changed:false,laneProgress:1,passed:false};s.obstacles=[o];
 for(let i=0;i<2100;i++){C.tick(s,1/60,0);assert(C.vehicleOnRoad(s,o),JSON.stringify(o));checks++;}assert(o.at>q.at+210,'A civilian must complete its fork and rejoin');
}
console.log(`PASS: ${checks} road-containment steps; both shoulder exits, two-lane obstacle planning, civilian fork routing and legacy difficulty compatibility.`);

const assert=require('node:assert/strict');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require('../dist/'+f+'.js');
const C=window.RallyCore,{createDrivingFeel,updateDrivingFeel}=require('./driving-feel-compiled.cjs'),unit=window.LANGUAGE_BANK[0].units[0];
let cases=0;
for(const kind of ['light','junction'])for(const difficulty of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(const hz of [30,60,120])for(const entry of [1,C.REGULAR_MAX_SPEED,C.MAX_SPEED]){
 const s=C.createRace(unit,difficulty,arena,14,{fuel:100}),t=s.tasks.find(t=>t.kind===kind),dt=1/hz;
 s.status='driving';s.taskIndex=s.tasks.indexOf(t);s.distance=t.at-90;s.speedFactor=entry;s.obstacles=[];s.lane=0;
 // The preview/approach remains normal time. Capture the actual speed only
 // when the close-range zone is reached, not when a distant gate is visible.
 C.tick(s,dt,0);assert.equal(s.status,'driving');assert(!C.focusCruise(s));assert.equal(s.worldTimeScale,1);
 s.distance=t.at-C.CHOICE_FOCUS_DISTANCE-.01;C.tick(s,0,0);assert(!C.focusCruise(s));
 s.distance=t.at-C.CHOICE_FOCUS_DISTANCE;s.speedFactor=entry;s.nitro=4;s.nitroLevel=2;s.accelerating=true;s.nitroHeld=true;
 for(const [i,r]of s.rivals.entries())Object.assign(r,{at:s.distance+30+i*30,lane:i?1:-1,lanePos:i?1:-1,nextTask:s.tasks.length,speed:s.arena.speed*C.MAX_SPEED,nitro:2,fuel:60});
 const m=createDrivingFeel(0);let oldScale=1;
 for(let i=0;i<hz*.7;i++){
  const gaps=s.rivals.map(r=>r.at-s.distance);C.tick(s,dt,m.lane);
  assert(C.focusCruise(s));assert(!C.steeringLocked(s));assert.equal(s.speedFactor,entry);assert.equal(s.nitro,4);assert(!s.nitroActive);assert(s.worldTimeScale<=oldScale+1e-8);oldScale=s.worldTimeScale;
  s.rivals.forEach((r,j)=>assert(r.at-s.distance<=gaps[j]+1e-7,'Slow motion cannot give rivals an advantage'));
 }
 assert(s.focusAmount>.99);assert(s.distance<t.at);assert(!s.route,'A fork must start at its physical road line');
 assert(C.move(s,-1));assert.equal(s.lane,-1);assert(C.choose(s,t.correctIndex));assert.equal(s.lane,t.correctIndex-1);
 const choiceAt=s.elapsed;
 for(let i=0;i<hz*15&&(!t.completed||C.focusCruise(s));i++){
  const charge=s.nitro,gaps=s.rivals.map(r=>r.at-s.distance);C.setAccelerating(s,true);C.tick(s,dt,m.lane);updateDrivingFeel(m,s.lane,s.roadTravel,s.arena.speed*s.speedFactor,dt);
  if(C.focusCruise(s)){assert.equal(s.nitro,charge);s.rivals.forEach((r,j)=>assert(r.at-s.distance<=gaps[j]+1e-7));}
  if(!t.completed){assert(!s.route);assert.equal(s.correct,0,'A selected sign is judged only when the car reaches it');}
 }
 assert(t.completed&&t.answeredRight);assert.equal(s.correct,1);assert(!C.focusCruise(s));assert.equal(s.worldTimeScale,1);assert.equal(s.focusAmount,0);assert(t.focusDone);assert(s.elapsed-choiceAt<5,'A settled choice does not impose a long reading wait');
 if(kind==='junction'){assert(s.route.shortcut);assert.equal(s.route.start,t.at);}
 assert(s.speedFactor<=C.REGULAR_MAX_SPEED+1e-6,'Captured Nitro speed cannot become a free permanent boost');
 C.setAccelerating(s,true);assert(s.accelerating,'A live physical hold can resume at handoff');
 cases++;
}
// Recovery can finish before reaching the line at low entry speed. It must
// not re-enter focus, and students can still correct an earlier lane choice.
for(const kind of ['light','junction']){
 const s=C.createRace(unit,'relaxed',0,7,{rivals:false}),t=s.tasks.find(t=>t.kind===kind);s.taskIndex=s.tasks.indexOf(t);s.status='driving';s.distance=t.at-52;s.speedFactor=.2;s.obstacles=[];
 C.tick(s,.05,0);C.choose(s,(t.correctIndex+1)%3);
 for(let i=0;i<60&&C.focusCruise(s);i++)C.tick(s,.05,s.lane);
 assert(!C.focusCruise(s));assert(t.focusDone&&!t.completed);C.choose(s,t.correctIndex);
 for(let i=0;i<300&&!t.completed;i++){C.setAccelerating(s,true);C.tick(s,.05,s.lane);assert(!C.focusCruise(s),'A checkpoint gets one focus entry');}
 assert(t.answeredRight);assert.equal(s.correct,1);
}
// A close civilian can briefly freeze forward travel, but it must still
// finish its signalled move to the shoulder so focus never deadlocks traffic.
const queued=C.createRace(unit,'relaxed',0,5,{rivals:false});queued.status='driving';queued.taskIndex=0;queued.distance=queued.tasks[0].at-52;queued.speedFactor=C.REGULAR_MAX_SPEED;
const start=queued.distance;queued.obstacles=[{id:0,at:start+9,lane:0,lanePos:0,type:'traffic',speed:0,cruiseSpeed:8,passed:false,fromLane:0,target:0,changed:false,laneProgress:0}];let froze=false;
for(let i=0;i<120;i++){const at=queued.obstacles[0].at;C.tick(queued,.05,0);froze||=queued.worldTimeScale===0;assert(queued.obstacles[0].at>=at);assert(queued.obstacles[0].at-at<=8*.05+1e-8);assert.equal(queued.speedFactor,C.REGULAR_MAX_SPEED);}
assert(froze);assert(queued.distance>start+10);assert(queued.obstacles[0].lanePos>2.7);assert.equal(queued.collisions,0);
console.log(`PASS: ${cases} close-range light/fork focus cases; 30/60/120 Hz, captured cruise/90/200-entry engine speeds, conserved Nitro, responsive steering, fair rivals, settled-choice recovery, physical answer lines, smooth return, no focus re-entry and prompt civilian clearance from a stopped focus queue.`);

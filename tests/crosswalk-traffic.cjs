const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);for(const file of ['language-bank.js','repair-bank.js','match-bank.js','game-core.js'])vm.runInContext(fs.readFileSync((fs.existsSync('dist/language-bank.js')?'dist/':'')+file,'utf8'),ctx);
const C=ctx.window.RallyCore,bank=ctx.window.LANGUAGE_BANK;
const unit=bank[0].units[0];
function crosswalk(){const s=C.createRace(unit,'challenge',2,21);s.status='driving';s.taskIndex=3;s.distance=s.tasks[3].at-70;C.tick(s,.01);assert.equal(s.task.kind,'pedestrian');for(let i=0;i<160&&!C.pedestrianReady(s);i++)C.tick(s,.05);assert(C.pedestrianReady(s));return s;}
let s=crosswalk(),t=s.task,words=JSON.stringify(t.people.map(p=>p.word));
assert(!C.sortPerson(s,2));assert.equal(t.attempts,0);
for(let i=0;i<4;i++){
  const p=t.people[i];assert.equal(t.personIndex,i);const before=s.lane;
  assert(C.move(s,p.side===0?-1:1));assert(p.sent);assert(p.correct);assert.equal(s.lane,before,'Sorting must guide the person rather than change the car lane');
  assert(!C.sortPerson(s,p.side),'Repeated input while a visitor walks must not affect the queue');
  for(let j=0;j<(i===3?15:9);j++)C.tick(s,.1);
}
assert.equal(s.status,'resolving');assert.equal(s.taskIndex,4);assert.equal(s.correct,1);assert(t.completed);assert.equal(JSON.stringify(t.people.map(p=>p.word)),words,'Each person retains their original word');
let wrong=crosswalk(),wp=wrong.task.people[0],before=wrong.time;
assert(C.sortPerson(wrong,1-wp.side));assert.equal(wrong.time,before-1.5);assert.equal(wrong.review[0].prompt,wp.word);assert.equal(wrong.review[0].answer,wrong.task.labels[wp.side]);
while(wrong.status==='task') {const p=wrong.task.people[wrong.task.personIndex];if(!wrong.task.pedWait)C.sortPerson(wrong,p.side);C.tick(wrong,.1);}
assert.equal(wrong.correct,0,'One incorrect category prevents first-attempt checkpoint credit');assert.equal(wrong.task.attempts,1);assert.equal(wrong.review.length,1);
let deadline=crosswalk();deadline.elapsed=deadline.task.sortStartedAt+deadline.task.sortDuration;C.tick(deadline,.1);assert.equal(deadline.status,'resolving');assert.equal(deadline.review.length,4);assert(deadline.task.people.every(p=>p.sent));assert.equal(deadline.correct,0);
let paused=crosswalk();const person=paused.task.people[0];C.sortPerson(paused,person.side);C.pause(paused);const wait=paused.task.pedWait,elapsed=paused.elapsed;C.tick(paused,.1);assert.equal(paused.task.pedWait,wait);assert.equal(paused.elapsed,elapsed);
let repair=C.createRace(unit);repair.task=repair.tasks[1];repair.taskIndex=1;repair.status='task';repair.distance=repair.task.at-65;const at=repair.distance;
assert(C.connectRepair(repair,[0,1,2]));assert.equal(repair.distance,at);assert(repair.task.solved&&repair.task.completed);assert.equal(repair.taskIndex,2);assert.equal(repair.correct,1);assert.equal(repair.status,'resolving','Completion is immediate, with no deadline wait');
let totalTraffic=0,bankItems=0;
for(const grade of bank)for(const u of grade.units){
  const items=ctx.window.MATCH_BANK[u.id];assert(items.length>=18,'Every unit retains its reviewed minimum bank');for(const type of ['description','translation','grammar'])assert(items.some(i=>i.type===type),'Each original clue type retains coverage');bankItems+=items.length;
  for(const item of items){assert(['description','translation','grammar','question'].includes(item.type));const options=item.options||[item.answer,...item.decoys];assert.equal(new Set(options).size,options.length);assert.equal(options.filter(x=>x===item.answer).length,1);assert(!/…/.test(item.prompt),'Generic matching openings must be excluded');}
  for(let arena=0;arena<3;arena++){
    const race=C.createRace(u,'challenge',arena,72),pedestrians=race.tasks.filter(t=>t.kind==='pedestrian');
    for(const t of pedestrians){assert.equal(t.people.length,4);assert.equal(new Set(t.people.map(p=>p.word)).size,4);const categories=t.categoryIds.map(id=>u.categories.find(c=>c.id===id));for(const p of t.people){assert(categories[p.side].yes.includes(p.word));assert(!categories[1-p.side].yes.includes(p.word));}assert.equal(t.people.filter(p=>p.side===0).length,2);}
    race.status='driving';const initialObjects=race.obstacles.slice(),wordOptions=race.tasks.map(t=>JSON.stringify(t.rows[0].options));
    for(let step=0;step<1600&&!['finished','failed'].includes(race.status);step++){
      const previous=race.obstacles.map(o=>({at:o.at,lane:o.lanePos,progress:o.laneProgress,route:o.crosswalkRoute,from:o.fromLane,target:o.target}));
      if(race.status==='task'){if(race.task.kind==='repair')C.connectRepair(race,[0,1,2]);else if(race.task.kind==='pedestrian'){if(!race.task.pedWait)C.sortPerson(race,race.task.people[race.task.personIndex].side);}else C.choose(race,race.task.correctIndex);}
      C.tick(race,.05);if(race.status==='failed')break;
      race.obstacles.forEach((o,i)=>{assert.equal(o,initialObjects[i],'Traffic objects must not be recycled in view');assert(o.at>=previous[i].at&&o.at-previous[i].at<=o.cruiseSpeed*.05+1e-7,'Cars travel continuously, including while braking and stopped');assert(Math.abs(o.lanePos-previous[i].lane)<.12,'Lane changes cannot jump when the player reaches a distance boundary');if(o.type==='traffic'&&o.crosswalkRoute===previous[i].route&&o.fromLane===previous[i].from&&o.target===previous[i].target)assert(o.laneProgress>=previous[i].progress,'One lane-change maneuver progresses continuously');});
      race.tasks.forEach((t,i)=>assert.equal(JSON.stringify(t.rows[0].options),wordOptions[i],'Sign words stay fixed for the race'));
    }
    totalTraffic+=race.obstacles.filter(o=>o.type==='traffic').length;
  }
}
console.log(`PASS: ${bankItems} curated match entries; pedestrian category membership in all 44 units, correct/wrong/repeated sorting, deadline and pause; immediate repair. ${totalTraffic} traffic identities checked for continuous forward motion and smooth lane changes across all arenas. Semantic uniqueness of clues was reviewed separately.`);

const fs=require('node:fs'),assert=require('node:assert/strict');
// Run the standalone runtime in Node's normal realm so the full matrix uses
// the same plain JavaScript objects as the shipped build.
global.window={};for(const f of ['language-bank.js','repair-bank.js','match-bank.js','game-core.js'])require(require('node:path').resolve((fs.existsSync('dist/language-bank.js')?'dist/':'')+f));
const C=window.RallyCore,bank=window.LANGUAGE_BANK;
// Moving cars are assessed by relative closing speed; a vehicle that is
// pulling away is not a parked obstacle. Physical side clearance stays live.
function roadThreats(C,s,range){
  const speed=s.arena.speed*Math.max(s.speedFactor,s.accelerating?C.REGULAR_MAX_SPEED:1);
  return [...s.obstacles,...s.rivals].filter(o=>o.at>s.distance&&o.at-s.distance<range&&((o.speed||0)<.1||(o.at-s.distance-5)/Math.max(.01,speed-(o.speed||0))<1.65));
}
const requestedSeeds=Number(process.env.WORDRIFT_TEST_SEEDS),seedCount=Number.isInteger(requestedSeeds)&&requestedSeeds>0?Math.min(6,requestedSeeds):6;
// Optional sharding for parallel local runs; the default covers every grade.
const onlyGrade=Number(process.env.WORDRIFT_TEST_GRADE)||null;
let cases=0,totalRows=0,minTime=Infinity;
for(const grade of bank)if(!onlyGrade||grade.grade===onlyGrade)for(const unit of grade.units)for(const difficulty of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(let seed=1;seed<=seedCount;seed++){
  let s=C.createRace(unit,difficulty,arena,seed),physical=0,readingId='',started=0;cases++;
  for(const t of s.tasks){if(t.kind==='repair'){assert.equal(t.blocks.length,3);assert.equal(t.rows.length,1);assert.equal(new Set(t.order).size,3);assert(!t.order.every((x,i)=>x===i));}for(const row of t.rows){totalRows++;assert.equal(row.options.length,t.kind==='pedestrian'?2:3);assert.equal(new Set(row.options).size,row.options.length);if(!['repair','pedestrian'].includes(t.kind))assert.equal(row.options[row.correctIndex],row.answer);}}
  for(let steps=0;steps<10000&&!['finished','failed'].includes(s.status);steps++){
    if(s.status==='task'){
      const row=C.currentRow(s),id=s.task.id+':'+s.task.rowIndex+':'+(s.task.personIndex??'');
      if(s.task.kind==='pedestrian'&&!C.pedestrianReady(s)){readingId='';started=s.elapsed;}else if(readingId!==id){readingId=id;started=s.elapsed;}
      // Read lane signs for 4.5 seconds; allow one second per pedestrian word.
      if(s.task.kind==='pedestrian'){if(s.elapsed-started>1&&!s.task.pedWait)C.sortPerson(s,s.task.people[s.task.personIndex].side);}else if(s.elapsed-started>4.5){if(s.task.kind==='repair'&&!s.task.solved)C.connectRepair(s,[0,1,2]);else if(s.task.kind!=='repair')C.choose(s,row.correctIndex);}
      if(C.repairCruise(s))assert(!C.move(s,0),'Repair autopilot owns steering through its return');else if(s.task.kind==='pedestrian')assert(C.move(s,0),'Pedestrian sorting stays available');else assert(!C.steeringLocked(s),'Steering must remain available for lane-answer tasks');
    }else{
      // Anticipate the moving cars, including their committed lane changes.
      const threats=roadThreats(C,s,55);
      if(threats.length){
        const safe=[-1,0,1].map(l=>({l,score:Math.min(...threats.map(o=>Math.min(Math.abs(l-o.lanePos),o.changed&&o.laneProgress<1?Math.abs(l-o.target):2)+(o.at-s.distance)/100))})).sort((a,b)=>b.score-a.score||Math.abs(a.l-physical)-Math.abs(b.l-physical));
        const clear=safe.filter(o=>C.playerLaneClear(s,physical,o.l));if(clear.length)s.lane=clear[0].l;
      }
    }
    const before=s.distance,status=s.status;C.tick(s,.1,physical);const nextPhysical=physical+(s.lane-physical)*(1-Math.exp(-1));if(C.playerLaneClear(s,physical,nextPhysical))physical=nextPhysical;
    if(['task','driving','resolving'].includes(status)&&s.status!=='failed'){assert(s.distance>=before,'The car never moves backwards');if(!s.yielding&&!s.followingTraffic&&!(C.repairCruise(s)&&s.worldTimeScale===0))assert(s.distance>before,`Moving ${unit.id}/${difficulty}/${arena}/${seed}: ${JSON.stringify({distance:s.distance,lane:physical,target:s.lane,route:s.route,near:[...s.obstacles,...s.rivals].filter(o=>Math.abs(o.at-s.distance)<20)})}`);}
  }
  assert.equal(s.status,'finished',unit.id+' '+difficulty+' arena '+arena+' '+JSON.stringify({at:s.distance,lane:physical,target:s.lane,route:s.route,following:s.followingTraffic,near:[...s.obstacles,...s.rivals].filter(o=>Math.abs(o.at-s.distance)<30)}));assert.equal(s.correct,s.tasks.length,'Read and steer should correctly solve all tasks');assert(s.collisions<=6,'The sample driver must not get trapped in repeated traffic bumps');assert.equal(C.stars(s),s.collisions<=2?3:2,'Perfect English earns two stars, or three with at most two traffic bumps');minTime=Math.min(minTime,s.time);
}
let s=C.createRace(bank[0].units[0],'challenge',0,5);s.status='driving';s.distance=s.tasks[0].at-C.CHOICE_FOCUS_DISTANCE+1;C.tick(s,.1);assert.equal(s.status,'task');
let row=C.currentRow(s),time=s.time,distance=s.distance;C.choose(s,row.correctIndex);assert.equal(s.correct,0,'Tapping steers but must not judge before crossing');assert.equal(s.lane,row.correctIndex-1);C.pause(s);C.tick(s,.1);assert.equal(s.time,time);assert.equal(s.distance,distance);C.resume(s);
s.lane=(row.correctIndex+1)%3-1;s.distance=row.at-.02;C.tick(s,.1,s.lane);assert.equal(s.review.length,1);assert.equal(s.taskIndex,1);assert.equal(s.correct,0);assert.equal(s.status,'resolving');assert(s.distance>row.at);assert(s.detour>0);
let repair=C.createRace(bank[0].units[0]);repair.status='task';repair.task=repair.tasks[1];repair.taskIndex=1;repair.distance=repair.task.at-60;
let before=repair.time;
assert(!C.connectRepair(repair,[0,2,1]));assert.equal(repair.time,before-1.5);assert.equal(repair.task.attempts,1);assert.equal(repair.task.solved,false);assert.equal(repair.taskIndex,1);
assert(!C.connectRepair(repair,[0,0,1]));assert.equal(repair.task.attempts,1,'Invalid and partial strokes must not cost points');
assert(C.connectRepair(repair,[0,1,2]));assert.equal(repair.task.chosen.length,3);assert.equal(repair.task.solved,true);assert.equal(repair.taskIndex,2,'Correct order must repair and complete immediately');assert.equal(repair.status,'resolving');assert(repair.distance<repair.task.at);C.tick(repair,.1);assert.equal(repair.taskIndex,2);assert.equal(repair.correct,0,'A repaired mistake cannot earn first-attempt credit');
let timeout=C.createRace(bank[0].units[0]);timeout.status='task';timeout.task=timeout.tasks[1];timeout.taskIndex=1;timeout.distance=timeout.task.at-8;const waitingTime=timeout.time;C.tick(timeout,.1);assert.equal(timeout.taskIndex,1);assert(!timeout.task.completed);assert.equal(timeout.worldTimeScale,0);assert(timeout.time<waitingTime,'A construction wait still uses the task clock');assert(C.connectRepair(timeout,[0,1,2]));assert.equal(timeout.taskIndex,2);assert.equal(timeout.task.success,true);
let fail=C.createRace(bank[0].units[0]);fail.status='task';fail.task=fail.tasks[0];fail.distance=fail.task.at-30;fail.time=.001;C.tick(fail,.1);assert.equal(fail.status,'failed');assert.equal(C.stars(fail),0);
console.log(`PASS: ${cases} races, ${totalRows} road-answer rows, all 44 units / ${Object.keys(C.DIFFICULTIES).length} difficulties / 3 arenas. Physical steering, reading time, pause, wrong-lane correction, three-block repair order, immediate repair, retry, deadline, pedestrian sorting and stars verified. Tightest clean finish: ${minTime.toFixed(1)}s left.`);

const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {keepHolding}=require('./attentive-driver.cjs');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','game-core'])require(path.resolve((fs.existsSync('dist/game-core.js')?'dist/':'')+f+'.js'));
const C=window.RallyCore,{createDrivingFeel,updateDrivingFeel}=require('./driving-feel-compiled.cjs'),unit=window.LANGUAGE_BANK[0].units[0];

// Longer courses must add reviewed material without repeating a gate identity
// or placing a hazard in the shoulder/fork manoeuvre before an English task.
let courses=0;
for(const grade of window.LANGUAGE_BANK)for(const u of grade.units)for(let arena=0;arena<3;arena++){
 const s=C.createRace(u,'challenge',arena,17);
 assert.equal(s.tasks.length,[12,14,16][arena]);assert.equal(new Set(s.tasks.map(t=>t.id)).size,s.tasks.length);
 const clues=s.tasks.filter(t=>['light','junction'].includes(t.kind));assert.equal(new Set(clues.map(t=>t.prompt)).size,clues.length,'Each checkpoint needs a fresh reviewed clue');
 s.tasks.forEach((t,i)=>{if(i)assert(t.at-s.tasks[i-1].at>=500,'Long driving legs separate consecutive tasks');});
 for(const o of s.obstacles.filter(o=>o.type!=='traffic'))for(const t of s.tasks){const zone=C.taskZone(t);assert(o.at+o.halfLength<zone.start-120||o.at-o.halfLength>zone.end+80,'Hazards stay outside the entire clear approach and departure');}
 assert(s.obstacles.filter(o=>o.type==='traffic').length<=4);courses++;
}

function drive(difficulty,arena,style,seed){
 const s=C.createRace(unit,difficulty,arena,seed,{fuel:30}),m=createDrivingFeel();s.status='driving';let key='',readAt=0;
 for(let frame=0;frame<Math.ceil((s.initialTime+300)/.05)&&!['finished','failed'].includes(s.status);frame++){
  C.setAccelerating(s,style!=='reading'||s.status!=='task');
  if(s.status==='task'){
   const t=s.task,id=t.id+':'+(t.personIndex??0);if(id!==key){key=id;readAt=s.elapsed;}
   if(s.elapsed-readAt>(style==='reading'?2:.45)){if(t.kind==='repair')C.connectRepair(s,[0,1,2]);else if(t.kind==='pedestrian'){if(!t.pedWait&&C.pedestrianReady(s))C.sortPerson(s,t.people[t.personIndex].side);}else C.choose(s,t.correctIndex);}
  }else if(!s.route&&!C.exitAssist(s)){
   const range=(s.arena.speed*C.MAX_SPEED-8)*1.65+8,threats=[...s.obstacles,...s.rivals].filter(o=>o.at>s.distance-8&&o.at-s.distance<range);
   if(threats.length){const at=Math.min(...threats.filter(o=>o.at>s.distance).map(o=>o.at)),row=threats.filter(o=>o.at>=at&&o.at-at<15),safe=[-1,0,1].filter(l=>row.every(o=>Math.abs(l-o.lanePos)>.8)),clear=safe.filter(l=>C.playerLaneClear(s,m.lane,l));if(clear.length)s.lane=clear.sort((a,b)=>Math.abs(a-m.lane)-Math.abs(b-m.lane))[0];}
  }
  if(style==='nitro')C.activateNitro(s);
  if(!keepHolding(C,s,m.lane)){C.setAccelerating(s,false);C.setNitroHeld(s,false);}C.tick(s,.05,m.lane);const old=m.lane;updateDrivingFeel(m,s.lane,s.roadTravel,s.arena.speed*s.speedFactor,.05);if(!C.playerLaneClear(s,old,m.lane)){m.lane=old;m.velocity=0;}
 }
 assert.equal(s.status,'finished',`${difficulty}/${arena}/${style}/${seed} at ${s.distance}`);assert.equal(s.correct,s.tasks.length);assert.equal(s.collisions,0);
 return s.elapsed;
}
const times=[[],[],[]];let races=0;
for(const difficulty of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(const seed of [1,9]){
 const reading=drive(difficulty,arena,'reading',seed);times[arena].push(reading);races++;
 if(seed===1){const held=drive(difficulty,arena,'held',seed),nitro=drive(difficulty,arena,'nitro',seed);assert(held<reading*.95,`Quick answers with held acceleration should save at least 5% of a reading run: ${JSON.stringify({difficulty,arena,reading,held,nitro})}`);assert(nitro<held-8,`Earned Nitro remains a meaningful time advantage: ${JSON.stringify({difficulty,arena,reading,held,nitro})}`);races+=2;}
}
for(const samples of times){const mean=samples.reduce((a,b)=>a+b,0)/samples.length;assert(mean>=270&&mean<=330,'A drive with two-second reading decisions should average around five minutes');}
console.log(`PASS: ${courses} courses across all units; unique reviewed clues, 500m+ checkpoint spacing, clear approaches, sparse traffic. ${races} timed races with real steering: reading ranges ${JSON.stringify(times.map(a=>({min:+Math.min(...a).toFixed(1),max:+Math.max(...a).toFixed(1)})))} seconds. Acceleration and Nitro reward faster play.`);

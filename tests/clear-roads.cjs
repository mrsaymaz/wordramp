const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','game-core'])require(path.resolve((fs.existsSync('dist/game-core.js')?'dist/':'')+f+'.js'));
const C=window.RallyCore,{createDrivingFeel,updateDrivingFeel}=require('./driving-feel-compiled.cjs'),u=window.LANGUAGE_BANK[0].units[0];
const types=new Set();let races=0,frames=0,pairs=0,clearFrames=0;
function avoid(s,m){
 const range=s.arena.speed*C.MAX_SPEED*1.7+15,near=[...s.obstacles,...s.rivals].filter(o=>!o.passed&&o.at>s.distance&&o.at-s.distance<range);
 if(!near.length)return;const at=Math.min(...near.map(o=>o.at)),row=near.filter(o=>o.at-at<16),safe=[-1,0,1].filter(l=>row.every(o=>Math.abs(l-(o.lanePos+(o.passingOffset||0)/3.35+C.routeOffset(o.route,o.at)/3.35))>.82));
 if(safe.length)s.lane=safe.sort((a,b)=>Math.abs(a-m.lane)-Math.abs(b-m.lane))[0];
}
const requestedSeeds=Number(process.env.WORDRIFT_TEST_SEEDS),seedCount=Number.isInteger(requestedSeeds)&&requestedSeeds>0?Math.min(4,requestedSeeds):4;
for(const diff of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(let seed=1;seed<=seedCount;seed++){
 const s=C.createRace(u,diff,arena,seed,{fuel:60}),m=createDrivingFeel();s.status='driving';C.setAccelerating(s,seed%2===0);let entered='',readingAt=0;
 for(const o of s.obstacles){types.add(o.type);if(o.type!=='traffic')assert(s.tasks.every(t=>o.at+o.halfLength<C.taskZone(t).start||o.at-o.halfLength>C.taskZone(t).end),'Static obstacles must be outside every task buffer');}
 assert(s.obstacles.filter(o=>o.type==='traffic').length<=4,'Civilian traffic stays sparse');
 for(let frame=0;frame<14000&&!['finished','failed'].includes(s.status);frame++){
  // Resume the requested driving input after the repair handoff.
  C.setAccelerating(s,seed%2===0);
  if(s.status==='task'){
   const t=s.task,key=t.id+':'+(t.personIndex??0);if(key!==entered){entered=key;readingAt=s.elapsed;}
   if(s.elapsed-readingAt>.5){if(t.kind==='repair')C.connectRepair(s,[0,1,2]);else if(t.kind==='pedestrian'){if(!t.pedWait&&C.pedestrianReady(s))C.sortPerson(s,t.people[t.personIndex].side);}else C.choose(s,t.correctIndex);}
  }else if(!s.route&&!C.exitAssist(s))avoid(s,m);
  if(seed%2===0)C.activateNitro(s);
  const previous=[...s.obstacles,...s.rivals].map(o=>({at:o.at,lane:o.lanePos}));C.tick(s,.05,m.lane);const oldLane=m.lane;updateDrivingFeel(m,s.lane,s.roadTravel,s.arena.speed*s.speedFactor,.05);if(!C.playerLaneClear(s,oldLane,m.lane)){m.lane=oldLane;m.velocity=0;}
  const bodies=[...s.obstacles,...s.rivals];const player={at:s.distance,lanePos:m.lane,route:s.route,halfLength:2.3,halfWidth:1.25};for(const o of bodies){const along=Math.abs(o.at-player.at),across=Math.abs(C.actorX(s,o)-C.actorX(s,player));assert(along>=(o.halfLength??2.3)+2.3-.03||across>=(o.halfWidth??1.25)+1.25-.03,`Player model overlap ${diff}/${arena}/${seed}/${frame}`);}
  for(let i=0;i<bodies.length;i++){
   if(bodies[i].type==='traffic'||s.rivals.includes(bodies[i]))assert(C.vehicleOnRoad(s,bodies[i]),`Vehicle left the asphalt: ${diff}/${arena}/${seed}/${frame} ${JSON.stringify(bodies[i])}`);
   assert(bodies[i].at>=previous[i].at,'No model can be moved backwards to repair spacing');assert(bodies[i].at-previous[i].at<=s.arena.speed*C.MAX_SPEED*.05/Math.min(1,bodies[i].route?.ratio??1)+1e-6,'Each car step stays within its current maximum speed and route');
   for(let j=i+1;j<bodies.length;j++)if(bodies[i].type==='traffic'||bodies[j].type==='traffic'||s.rivals.includes(bodies[i])||s.rivals.includes(bodies[j])){
    const a=bodies[i],b=bodies[j],along=Math.abs(a.at-b.at),across=Math.abs(C.actorX(s,a)-C.actorX(s,b));
    assert(along>=(a.halfLength??2.3)+(b.halfLength??2.3)-.03||across>=(a.halfWidth??1.25)+(b.halfWidth??1.25)-.03,`Physical overlap ${diff}/${arena}/${seed}/${frame}: ${JSON.stringify({a:{id:a.id,type:a.type,at:a.at,lane:a.lanePos,route:a.route?.id},b:{id:b.id,type:b.type,at:b.at,lane:b.lanePos,route:b.route?.id},along,across})}`);pairs++;
   }
  }
  if(s.status==='task'){
   const t=s.task;for(const o of bodies)if((o.type==='traffic'||s.rivals.includes(o))&&!o.route&&o.at>=t.at-75&&o.at<=t.at+20)assert(Math.abs(o.lanePos)>1.75,`Task approach is blocked: ${diff}/${arena}/${seed}/${frame} ${JSON.stringify({at:o.at,lane:o.lanePos,task:t.at})}`);clearFrames++;
  }
  frames++;
 }
 assert.equal(s.status,'finished',`${diff}/${arena}/${seed}: ${JSON.stringify({distance:s.distance,lane:s.lane,task:s.task?.kind,following:s.followingTraffic,route:s.route,rivals:s.rivals,obstacles:s.obstacles.filter(o=>Math.abs(o.at-s.distance)<30)})}`);assert.equal(s.correct,s.tasks.length);assert.equal(s.collisions,0,`${diff}/${arena}/${seed}: cautious obstacle driver needs a clean route`);races++;
}
assert(types.has('traffic'));for(const type of ['cones','barrier','crates','pothole','barrels','fallen_branch','tire_stack','road_panels','rockfall'])assert(types.has(type),type);
// A civilian brakes for a slow rival; previously it passed through the rival.
const following=C.createRace(u,'challenge',0,8);following.tasks=[];following.obstacles=[{id:50,type:'traffic',at:100,lane:0,lanePos:0,speed:12,cruiseSpeed:12,target:0,changed:false,passed:false}];following.rivals=following.rivals.slice(0,1);Object.assign(following.rivals[0],{at:110,lane:0,lanePos:0,speed:0,fuel:0,nextTask:100});following.status='driving';following.distance=30;for(let i=0;i<80;i++){C.tick(following,.05,-1);assert(following.rivals[0].at-following.obstacles[0].at>=7.19||Math.abs(following.rivals[0].lanePos-following.obstacles[0].lanePos)>.8);}
// Finished cars coast beyond the line, leaving the player an open finish.
const finish=C.createRace(u);finish.tasks=[];finish.obstacles=[];finish.status='driving';finish.distance=finish.arena.length-30;finish.rivals=finish.rivals.slice(0,1);Object.assign(finish.rivals[0],{at:finish.arena.length,finishedAt:1,lane:0,lanePos:0,speed:20});for(let i=0;i<80&&finish.status!=='finished';i++)C.tick(finish,.05,0);assert.equal(finish.status,'finished');assert(finish.rivals[0].at>finish.arena.length+10);
console.log(`PASS: ${races} full obstacle races, ${frames} frames, ${pairs} model-pair checks, ${clearFrames} unobstructed question frames; nine obstacle types, sparse civilians, safe shared footprints, no backward corrections, civilian/rival following and clear finish lines.`);

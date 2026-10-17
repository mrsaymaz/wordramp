const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {keepHolding}=require('./attentive-driver.cjs');
global.window={};for(const f of ['language-bank','match-bank','repair-bank','emoji-bank','game-core'])require(path.resolve((fs.existsSync('dist/game-core.js')?'dist/':'')+f+'.js'));
const C=window.RallyCore,{createDrivingFeel,updateDrivingFeel}=require('./driving-feel-compiled.cjs'),u=window.LANGUAGE_BANK[0].units[0];
function drive(difficulty,arena,seed,nitro,traffic=true,fuel=30){
 const s=C.createRace(u,difficulty,arena,seed,{fuel}),m=createDrivingFeel();s.status='driving';if(!traffic)s.obstacles=[];C.setAccelerating(s,true);let key='',readAt=0,firstBump=null;
 for(let i=0;i<10000&&!['finished','failed'].includes(s.status);i++){
  // Retake acceleration after each deliberate autopilot handoff.
  C.setAccelerating(s,true);
  if(s.status==='task'){const t=s.task,id=t.id+':'+(t.personIndex??0);if(id!==key){key=id;readAt=s.elapsed;}if(s.elapsed-readAt>.45){if(t.kind==='repair')C.connectRepair(s,[0,1,2]);else if(t.kind==='pedestrian'){if(!t.pedWait&&C.pedestrianReady(s))C.sortPerson(s,t.people[t.personIndex].side);}else C.choose(s,t.correctIndex);}}
  else if(!s.route&&!C.exitAssist(s)){
   const range=(s.arena.speed*C.MAX_SPEED-8)*1.65+8,threats=[...s.obstacles,...s.rivals].filter(o=>o.at>s.distance-8&&o.at-s.distance<range);
   if(threats.length){const closest=Math.min(...threats.filter(o=>o.at>s.distance).map(o=>o.at)),row=threats.filter(o=>o.at>=closest&&o.at-closest<15),safe=[-1,0,1].filter(l=>row.every(o=>Math.abs(l-o.lanePos)>.8));const clear=safe.filter(l=>C.playerLaneClear(s,m.lane,l));if(clear.length)s.lane=clear.sort((a,b)=>Math.abs(a-m.lane)-Math.abs(b-m.lane))[0];}
  }
  if(nitro&&(nitro!=='single'||s.nitro<=0))C.activateNitro(s);if(!keepHolding(C,s,m.lane)){C.setAccelerating(s,false);C.setNitroHeld(s,false);}const old=s.rivals.map(r=>({at:r.at,lane:r.lanePos}));const bumps=s.collisions;C.tick(s,.05,m.lane);if(s.collisions>bumps&&!firstBump)firstBump={at:s.distance,lane:m.lane,target:s.lane,status:s.status,task:s.task?.kind,near:[...s.obstacles,...s.rivals].filter(o=>Math.abs(o.at-s.distance)<30).map(o=>({id:o.id,type:o.type,at:o.at,lane:o.lanePos,speed:o.speed,route:o.route?.id}))};const oldLane=m.lane;updateDrivingFeel(m,s.lane,s.distance,s.arena.speed*s.speedFactor,.05);if(!C.playerLaneClear(s,oldLane,m.lane)){m.lane=oldLane;m.velocity=0;}
  s.rivals.forEach((r,j)=>{assert(r.at>=old[j].at);assert(r.at-old[j].at<=s.arena.speed*C.MAX_SPEED*.05/Math.min(1,r.route?.ratio??1)+1e-6,'Racing position must advance continuously within its speed and route bound');assert(r.speed<=s.arena.speed*C.MAX_SPEED+1e-8,'Rivals use the same maximum nitro speed as the player');assert(r.fuel>=0&&r.fuel<=100);assert(r.nitro>=0&&r.nitro<=C.NITRO_DURATION*2+1e-8);if(!nitro&&difficulty!=='challenge')assert(r.nitroLevel<=1,'Relaxed saves stacked counterboosts for a player who is stacking');});
 }
 assert.equal(s.status,'finished',`${difficulty}/${arena}/${seed}/${nitro} ${JSON.stringify({distance:s.distance,lane:s.lane,route:s.route,following:s.followingTraffic,obstacles:s.obstacles.filter(o=>Math.abs(o.at-s.distance)<80),rivals:s.rivals})}`);assert.equal(s.correct,s.tasks.length);assert.equal(s.collisions,0,`Attentive driver: ${difficulty}/${arena}/${seed}/${nitro} ${JSON.stringify(firstBump)}`);assert.equal(C.stars(s),3);
 return {gap:Math.min(...s.rivals.map(r=>s.distance-r.at)),place:C.raceOrder(s).findIndex(r=>r.id==='player')+1,boosts:s.rivals.reduce((n,r)=>n+r.nitroUses,0),lanes:s.rivals.reduce((n,r)=>n+r.laneChanges,0)};
}
const requestedSeeds=Number(process.env.WORDRAMP_TEST_SEEDS??process.env.WORDRIFT_TEST_SEEDS),seedCount=Number.isInteger(requestedSeeds)&&requestedSeeds>0?Math.max(4,Math.min(12,requestedSeeds)):12;
const result={};let cases=0;
for(const difficulty of Object.keys(C.DIFFICULTIES)){
 result[difficulty]={};for(const nitro of [false,true]){
  const a=[];for(let arena=0;arena<3;arena++)for(let seed=1;seed<=seedCount;seed++){const r=drive(difficulty,arena,seed,nitro);a.push({...r,arena});cases++;}
  result[difficulty][nitro?'nitro':'held']={wins:a.filter(r=>r.place===1).length,total:a.length,meanPlace:a.reduce((n,r)=>n+r.place,0)/a.length,meanGap:Math.round(a.reduce((n,r)=>n+r.gap,0)/a.length),boosts:a.reduce((n,r)=>n+r.boosts,0),laneChanges:a.reduce((n,r)=>n+r.lanes,0),arenaWins:[0,1,2].map(i=>a.filter(r=>r.arena===i&&r.place===1).length)};
 }
}
console.log('Rival balance:',JSON.stringify(result));
assert(result.challenge.held.meanPlace>result.relaxed.held.meanPlace+.4,'Challenge must challenge a quick, accurate driver more than Relaxed');assert(result.challenge.nitro.wins>result.challenge.held.wins,'Earned nitro must help against Challenge rivals');assert(result.challenge.nitro.wins>=result.challenge.nitro.total*.75,'Challenge must be reliably winnable by an accurate, clean driver using earned Nitro');assert(result.challenge.nitro.arenaWins.every(n=>n>=Math.ceil(seedCount*2/3)),'Every arena needs a fair chance of first place');assert(result.challenge.nitro.boosts>0&&result.challenge.held.laneChanges>0);
// Relaxed is approachable, but first place must be earned even by a clean,
// accurate driver holding full throttle. Returning players also face a race.
assert(result.relaxed.held.wins>=result.relaxed.held.total*.3&&result.relaxed.held.wins<=result.relaxed.held.total*.85,'Relaxed must be competitive and winnable without Nitro');
assert(result.relaxed.nitro.wins>result.relaxed.held.wins,'Earned Nitro must improve the easiest mode too');
const reserves=[];for(const fuel of [0,100]){const races=[];for(let arena=0;arena<3;arena++)for(let seed=1;seed<=3;seed++)races.push(drive('relaxed',arena,seed,false,true,fuel));const wins=races.filter(r=>r.place===1).length;assert(wins>0&&wins<races.length,'Fresh and returning players both face competitive Relaxed rivals');reserves.push({fuel,wins,total:races.length});}
// Rivals cannot start with more fuel or an unboosted engine advantage.
for(const fuel of [0,30,100])for(let arena=0;arena<3;arena++){const s=C.createRace(u,'challenge',arena,7,{fuel});for(const r of s.rivals){assert(r.fuel<=s.fuel);assert(r.basePace<=C.REGULAR_MAX_SPEED);}}
// An alert rival starts its pass before reaching the braking zone and signals
// first. It waits when every adjacent lane has a nearby vehicle.
function approach(blocked){const s=C.createRace(u,'challenge',0,11);s.tasks=[];s.status='driving';s.distance=0;s.lane=1;s.rivals=s.rivals.slice(0,1);const r=s.rivals[0];Object.assign(r,{at:100,lane:0,lanePos:0,speed:35,fuel:0});const car=(id,at,lane)=>({id,at,lane,lanePos:lane,type:'traffic',speed:8,cruiseSpeed:8,passed:false,moving:false});s.obstacles=[car(0,150,0),...(blocked?[car(1,106,-1),car(2,106,1)]:[])];return {s,r};}
let open=approach(false);C.tick(open.s,.05,1);assert.equal(open.r.lanePos,0);assert(open.r.plannedLane!=null,'The driver identifies a pass at least 45m before traffic');for(let i=0;i<8;i++)C.tick(open.s,.05,1);assert.notEqual(open.r.lanePos,0);assert(open.r.at<open.s.obstacles[0].at-20,'The pass begins before the tight following zone');
let blocked=approach(true);for(let i=0;i<8;i++)C.tick(blocked.s,.05,1);assert.equal(blocked.r.lanePos,0,'No merge into a car in an adjacent lane');
// A rival spends real fuel, preserves boost time while reading and never
// acquires a position-based catch-up multiplier when the player jumps ahead.
let boost=C.createRace(u,'challenge',0,5);boost.tasks=[];boost.obstacles=[];boost.status='driving';boost.distance=70;boost.lane=1;boost.rivals=boost.rivals.slice(0,1);Object.assign(boost.rivals[0],{at:25,lane:-1,lanePos:-1,fuel:30});C.tick(boost,.05,1);assert.equal(boost.rivals[0].fuel,0);assert.equal(boost.rivals[0].nitroUses,1);assert(boost.rivals[0].nitroActive);const snapshot=JSON.stringify(boost.rivals);C.pause(boost);C.tick(boost,.1);assert.equal(JSON.stringify(boost.rivals),snapshot);
// Keeping up with a moving leader must use relative speed, not the braking
// distance for a stationary obstacle. This was making fast rivals crawl.
const follow=C.createRace(u,'challenge',0,11);follow.tasks=[];follow.status='driving';follow.distance=150;follow.lane=0;follow.speedFactor=1.8;follow.accelerating=true;follow.rivals=follow.rivals.slice(0,1);Object.assign(follow.rivals[0],{at:130,lane:0,lanePos:0,speed:37.8,fuel:0});follow.obstacles=[];C.tick(follow,.05,0);assert(follow.rivals[0].speed>35,'A moving leader must not be treated as a stationary roadblock');
console.log(`PASS: ${cases} races with normal traffic, held acceleration and optional nitro. Fast players retain clean routes and English stars; Challenge is challenging and beatable. Early signaled passes, blocked merges, bounded speed/fuel, tactical nitro and pause verified. Benchmark: ${JSON.stringify(result)}; Relaxed fuel reserves: ${JSON.stringify(reserves)}`);

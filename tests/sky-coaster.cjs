// Rides: every route choice hides a ride behind the correct sign (Sunlit's
// three Sky Coasters escalate; Coastal has a Sea Jump, Stormcrest a Cliff
// Plunge). Each gains exactly a shortcut's 18 m, never touches road traffic
// and keeps its landing clear. Review laps have none.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {keepHolding}=require('./attentive-driver.cjs');
global.window={};for(const f of ['language-bank','match-bank','repair-bank','emoji-bank','game-core'])require(path.resolve((fs.existsSync('dist/game-core.js')?'dist/':'')+f+'.js'));
const C=window.RallyCore,{createDrivingFeel,updateDrivingFeel}=require('./driving-feel-compiled.cjs'),units=window.LANGUAGE_BANK.flatMap(g=>g.units);
let rides=0,rivalRides=0,sims=0;
assert.deepEqual(C.RIDE_ORDER,[['gentle','classic','finale'],['seaJump'],['cliffPlunge']]);
for(const unit of units.slice(0,12))for(const difficulty of ['relaxed','challenge'])for(let arena=0;arena<3;arena++){
 const s=C.createRace(unit,difficulty,arena,unit.id.length*7+arena),forks=s.tasks.filter(t=>t.kind==='junction'),rides=forks.filter(t=>t.coaster);
 assert.equal(rides.length,forks.length,'Every route choice hides a ride');
 rides.forEach((t,k)=>{
  const order=C.RIDE_ORDER[arena],layout=order[Math.min(k,order.length-1)];assert.equal(t.coaster.layout,layout,'Sunlit escalates gentle, classic, finale');
  assert.equal(t.coaster.span,C.RIDE_LAYOUTS[layout].span);assert([-1,1].includes(t.coaster.side));if(t.correctIndex!==1)assert.equal(t.coaster.side,t.correctIndex-1,'An outer-lane ride stays on its own side');
  const zone=C.taskZone(t);assert.equal(zone.reach,t.at+t.coaster.span+60);assert.equal(zone.end,t.at+150,'The road shoulders are unchanged');
  assert(!s.obstacles.some(o=>o.at>t.at-100&&o.at<zone.reach+80),'Nothing waits in the landing stretch');
 });
 for(const t of s.tasks.filter(t=>!t.coaster))assert.equal(C.taskZone(t).reach,C.taskZone(t).end);
}
assert(!C.createReviewLap(units[0],[{id:'x',kind:'light',type:'translation',prompt:'p',answer:units[0].translations[0].en,tr:''}],'relaxed',3).tasks.some(t=>t.coaster));

// Every layout from every lane: smooth joins, exactly 18 m (feel only), a
// launch, road speed at both ends, a gentle glide to land, and below the
// clearance height it never overlaps a road branch.
{
 const s=C.createRace(units[0],'relaxed',0,5),base=s.tasks.find(t=>t.coaster);
 for(const [name,layout] of Object.entries(C.RIDE_LAYOUTS))for(const correct of [0,1,2]){
  const t={...base,correctIndex:correct,coaster:{layout:name,span:layout.span,side:correct===1?1:correct-1}},r=C.makeRoute(s,t,correct,true),ground=C.makeRoute(s,t,correct,true,true);
  assert(r.coaster&&!ground.coaster);assert.equal(ground.end-ground.start,90);assert.equal(C.rideTitle(r),layout.title);
  let physical=0;for(let at=r.start;at<r.end;at+=.25)physical+=C.routeRatio(r,at+.125)*.25;assert(Math.abs(physical-(r.end-r.start-C.COASTER_GAIN))<.05,name+' gains exactly a shortcut');
  const speed=u=>C.coasterPace(r,r.start+u);assert(speed(26)>1.65,name+': the right answer launches the car');
  assert(Math.abs(speed(0)-1)<1e-9&&Math.abs(speed(r.end-r.start)-1)<1e-9,'Ride speed meets road speed at both ends');
  let steepest=0;for(let at=r.end-70;at<r.end;at+=.5)steepest=Math.max(steepest,Math.abs(C.coasterHeight(r,at+.5)-C.coasterHeight(r,at))/.5);assert(steepest<.15,name+': the landing is a gentle glide: '+steepest);
  for(let u=0;u<r.end-r.start;u+=1)assert(Math.abs(speed(u+1)-speed(u))<.2,'Ride speed changes smoothly, never in a jump');
  for(let at=r.start;at<=r.end;at+=1)assert(C.routeRatio(r,at)>=r.ratio-1e-12,'route.ratio is the fastest point of the ride');
  assert.equal(C.coasterHeight(r,r.start),0);assert.equal(C.coasterHeight(r,r.end),0);
  for(let at=r.start;at<=r.end;at+=.5)if(C.coasterHeight(r,at)<C.COASTER_CLEAR)for(const g of C.groundRoutes(s,t))if(g.lane!==r.lane&&at<=g.end)assert(Math.abs(r.lane*3.35+C.routeOffset(r,at)-g.lane*3.35-C.routeOffset(g,at))>=3.35-1e-9,name+' crosses a road branch below the clearance');
 }
 const peak=name=>{const t={...base,coaster:{layout:name,span:C.RIDE_LAYOUTS[name].span,side:1}},r=C.makeRoute(s,t,base.correctIndex,true);let p=0;for(let at=r.start;at<=r.end;at+=1)p=Math.max(p,C.coasterHeight(r,at));return p;};
 assert(peak('finale')>peak('classic')&&peak('classic')>peak('gentle'),'Each Sunlit ride has a bigger first drop');assert(peak('cliffPlunge')>18);
 assert(!C.RIDE_LAYOUTS.gentle.elements.some(e=>e.kind==='loop'),'The first ride has no loop');assert(C.RIDE_LAYOUTS.classic.elements.some(e=>e.kind==='loop'));assert(C.RIDE_LAYOUTS.finale.elements.some(e=>e.kind==='loop'&&e.count===2)&&C.RIDE_LAYOUTS.finale.elements.some(e=>e.kind==='corkscrew'&&e.turns===2),'The finale doubles the loop and the corkscrew');
 // Levels: a car on the raised track never meets a car on the road below.
 const t={...base,coaster:{layout:'classic',span:340,side:base.correctIndex===1?1:base.correctIndex-1}},r=C.makeRoute(s,t,t.correctIndex,true);
 s.status='driving';s.route=r;s.lane=r.lane;s.distance=r.start+86;s.rivals=[];
 const below={id:99,type:'traffic',at:s.distance+3,lane:r.lane,lanePos:r.lane,route:null,halfWidth:1.2,halfLength:2.3,speed:0,dormant:false};
 below.passingOffset=C.routeOffset(r,below.at);s.obstacles=[below];
 assert.equal(C.deckLevel({route:r,at:s.distance}),1);assert.equal(C.deckLevel(below),0);
 assert.equal(C.playerLaneBlocker(s,r.lane,r.lane),null,'The road car below the track is not in the rider’s way');
 s.distance=r.start+2;below.at=s.distance+3;below.passingOffset=0;assert.notEqual(C.playerLaneBlocker(s,r.lane,r.lane),null,'At road level the same car is in the way');
}

// Full races in every arena with an attentive student: every right answer
// rides without a bump; wrong answers take the detour; traffic never rides.
function race(difficulty,seed,wrongAtForks,nitro,arena=0){
 const s=C.createRace(units[seed%units.length],difficulty,arena,seed,{fuel:30}),m=createDrivingFeel();s.status='driving';C.setAccelerating(s,true);let key='',readAt=0,ride=null,rode=0;
 for(let i=0;i<12000&&!['finished','failed'].includes(s.status);i++){
  C.setAccelerating(s,true);
  if(s.status==='task'){const t=s.task,id=t.id+':'+(t.personIndex??0);if(id!==key){key=id;readAt=s.elapsed;}if(s.elapsed-readAt>.45){if(t.kind==='repair')C.connectRepair(s,[0,1,2]);else if(t.kind==='pedestrian'){if(!t.pedWait&&C.pedestrianReady(s))C.sortPerson(s,t.people[t.personIndex].side);}else C.choose(s,t.kind==='junction'&&wrongAtForks?(t.correctIndex+1)%3:t.correctIndex);}}
  else if(!s.route&&!C.exitAssist(s)){
   const range=(s.arena.speed*C.MAX_SPEED-8)*1.65+8,threats=[...s.obstacles,...s.rivals].filter(o=>o.at>s.distance-8&&o.at-s.distance<range&&!C.deckLevel(o));
   if(threats.length){const closest=Math.min(...threats.filter(o=>o.at>s.distance).map(o=>o.at)),row=threats.filter(o=>o.at>=closest&&o.at-closest<15),safe=[-1,0,1].filter(l=>row.every(o=>Math.abs(l-o.lanePos)>.8));const clear=safe.filter(l=>C.playerLaneClear(s,m.lane,l));if(clear.length)s.lane=clear.sort((a,b)=>Math.abs(a-m.lane)-Math.abs(b-m.lane))[0];}
  }
  if(nitro)C.activateNitro(s);if(!keepHolding(C,s,m.lane)){C.setAccelerating(s,false);C.setNitroHeld(s,false);}
  const damage=s.damage;C.tick(s,.05,m.lane);const oldLane=m.lane;updateDrivingFeel(m,s.lane,s.distance,s.arena.speed*s.speedFactor,.05);if(!C.playerLaneClear(s,oldLane,m.lane)){m.lane=oldLane;m.velocity=0;}
  if(s.route?.coaster){if(ride!==s.route){ride=s.route;rode++;}assert.equal(s.damage,damage,'Riding the coaster never costs a hit');}
  else if(ride&&s.distance<ride.end+40){assert(!C.exitAssist(s),'A coaster lands straight in its lane, with no forced merge');assert.equal(s.damage,damage);}
  assert(!s.obstacles.some(o=>o.route?.coaster),'Road traffic never rides the coaster');
  for(const r of s.rivals)if(r.route?.coaster&&!r.counted){r.counted=r.route.id;rivalRides++;}else if(!r.route)r.counted=null;
 }
 sims++;assert.equal(s.status,'finished',`${difficulty}/${seed}/${wrongAtForks}`);assert.equal(s.collisions,0,`${difficulty}/${seed}/${wrongAtForks}/${nitro}: an attentive student finishes clean`);
 // A rival landing on the outer track touches down on the shoulder and races on.
 assert(s.rivals.every(r=>r.at>s.arena.length*.8),'No rival is left stranded after a coaster landing');
 const forks=s.tasks.filter(t=>t.coaster).length;assert.equal(rode,wrongAtForks?0:forks);rides+=rode;
 return s;
}
const seeds=Number(process.env.WORDRAMP_TEST_SEEDS)||8;
for(let arena=0;arena<3;arena++)for(const difficulty of ['relaxed','challenge'])for(let seed=1;seed<=seeds;seed++){race(difficulty,seed,false,seed%2===0,arena);if(seed<=seeds/2)race(difficulty,seed,true,false,arena);}
assert(rivalRides>0,'Rivals who answer right ride the coaster too');
console.log(`PASS: rides on every route choice (Sunlit escalating gentle/classic/finale, Coastal Sea Jump, Stormcrest Cliff Plunge; none on review laps); every layout from every lane gains exactly 18 m (feel only) with a launch, road speed at both ends, a gentle glide landing and no low crossing of road branches; raised and road levels never meet; ${sims} races in all arenas: ${rides} player rides and ${rivalRides} rival rides without a single bump, no forced merge, rivals land on asphalt, wrong answers take the detour, traffic never rides.`);

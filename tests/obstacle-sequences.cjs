const assert=require('node:assert/strict');
global.window={};for(const file of ['language-bank','repair-bank','match-bank','game-core'])require('../dist/'+file+'.js');
const C=window.RallyCore,unit=window.LANGUAGE_BANK[0].units[0];let courses=0,rows=0,obstacles=0,turns=0;const totals={relaxed:[[],[],[]],challenge:[[],[],[]]};
for(const mode of Object.keys(C.DIFFICULTIES))for(let arena=0;arena<3;arena++)for(let seed=1;seed<=32;seed++){
 const s=C.createRace(unit,mode,arena,seed),groups=Map.groupBy(s.patterns,p=>p.sequenceId);
 assert(s.patterns.length>=s.tasks.length*1.4,'Both modes need substantially more driving obstacles');
 // v0.24: civilian groups of 2-3 (6-26 cars) share the road with static rows.
 {const cars=s.obstacles.filter(o=>o.type==='traffic');assert(cars.length>=6&&cars.length<=30,'Civilian traffic follows the group plan');
  // Each group row blocks at most two lanes, so an open lane always remains.
  const rows=Map.groupBy(cars,o=>o.trafficGroup+':'+Math.round(o.at));for(const row of rows.values())assert(new Set(row.map(o=>o.lane)).size===row.length&&row.length<=2,'A traffic row never blocks all three lanes');}
 for(const car of s.obstacles.filter(o=>o.type==='traffic'))for(const hazard of s.obstacles.filter(o=>o.type!=='traffic')){
  assert(Math.abs(car.at-hazard.at)>2.3+hazard.halfLength||Math.abs(C.actorX(s,car)-C.actorX(s,hazard))>1.25+hazard.halfWidth,'Civilian starting footprints must be clear of every obstacle');
 }
 for(const sequence of groups.values()){
  for(let i=0;i<sequence.length;i++){
   const p=sequence[i],escape=p.escapeLane,previous=sequence[i-1];
   if(previous){assert(Math.abs(p.escapeLane-previous.escapeLane)<=1,'Only adjacent lane transitions are allowed');if(p.beatIndex===previous.beatIndex)assert.equal(p.escapeLane,previous.escapeLane,'Two-row beats retain a stable gap');}
   if(p.turn){assert(previous);assert.equal(Math.abs(p.escapeLane-previous.escapeLane),1);assert.equal(p.beatIndex,previous.beatIndex+1);turns++;}
   if(i)assert(p.at-sequence[i-1].at>=s.patternSpacing-1e-7);
   const hazards=s.obstacles.filter(o=>o.patternId===p.id);assert(hazards.length>=1&&hazards.length<=2);if(p.turn){assert.equal(hazards.length,2,'A lane-change beat has one unambiguous gap');assert(hazards.some(o=>o.lane===previous.escapeLane),'The old cruising lane is blocked to encourage an actual lane change');}
   assert(hazards.every(o=>o.lane!==escape));
   for(const o of hazards)for(const t of s.tasks){const z=C.taskZone(t);assert(o.at+o.halfLength<z.start-120||o.at-o.halfLength>z.end+80,'Task approaches and departures remain completely clear');}
  }
  if(sequence.length>=3){assert(sequence.some(p=>p.turn),'Long driving stretches must require lane changes');assert([-1,0,1].every(l=>sequence.some(p=>s.obstacles.some(o=>o.patternId===p.id&&o.lane===l))),'No lane stays empty for a whole long stretch');}
 }
 // Moving civilian groups are hazards too; escalation counts both kinds.
 totals[mode][arena].push(s.obstacles.length);
 const types=new Set(s.obstacles.map(o=>o.type));if(arena>0){assert(types.has('tire_stack'));assert(types.has('road_panels'));}if(arena===2)assert(types.has('rockfall'));
 rows+=s.patterns.length;obstacles+=s.obstacles.filter(o=>o.type!=='traffic').length;courses++;
}
for(const mode of Object.keys(totals)){const averages=totals[mode].map(a=>a.reduce((n,v)=>n+v,0)/a.length);assert(averages[1]>averages[0]*1.2&&averages[2]>averages[1]*1.1,'Later arenas need substantially more hazards');console.log(mode,'hazard counts by arena:',totals[mode].map(a=>({min:Math.min(...a),max:Math.max(...a)})));}
console.log(`PASS: ${courses} courses, ${rows} obstacle rows and ${obstacles} stationary hazards; denser Relaxed/Challenge sequences, ${turns} adjacent gap changes, stable two-row beats, no forced full-road reversals, clear task buffers and grouped civilian traffic.`);

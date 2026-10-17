const assert=require('node:assert/strict');
const {TEAMS,normaliseUlti,ultiSnapshot,awardUltiWin,exportUlti,ULTI_LIFETIME_MS,newIdentity}=require('./ulti-compiled.cjs');
const {normaliseProgress,resolvedLook}=require('./progression-compiled.cjs');
const saved={difficulty:'standard',progress:{'g5u1:standard':[2,0,1],'g5u1:challenge':[1,3,0],'g5u2:relaxed':[3,0,0]},fuel:73,look:{paint:'ruby',badge:2,trail:true},mastery:{g5u1:{tier:3}}};
normaliseProgress(saved);assert.equal(saved.difficulty,'challenge');assert.deepEqual(saved.progress['g5u1:challenge'],[2,3,1]);assert(!('g5u1:standard'in saved.progress));assert.equal(saved.fuel,73);assert.equal(saved.look.paint,'ruby');
assert.equal(TEAMS.length,4);assert.equal(new Set(TEAMS.map(t=>t.color)).size,4);assert.equal(new Set(Array.from({length:1000},()=>newIdentity())).size,1000);
for(const team of TEAMS){saved.teamId=team.id;assert.equal(resolvedLook(saved).color,team.color);assert.equal(resolvedLook(saved).badge,2);assert(resolvedLook(saved).trail);}
const {ULTI_POINTS,ULTI_MIN_STARS,ULTI_MIN_RELAXED_ACCURACY,ULTI_DAILY_CAP,ultiPointsFor,ultiWinOutcome,ultiEarnedToday}=require('./ulti-compiled.cjs');
// Local times, so the daily cap is checked against the device's own calendar.
const start=new Date(2026,9,15,8).getTime(),race={status:'finished',teamId:'slytherin',runId:'run-one',unit:{id:'g5u1'},difficulty:'relaxed',arena:{id:'boulevard'},arenaIndex:0};
assert.deepEqual(ULTI_POINTS,{relaxed:[2,4,6],challenge:[5,7,9]});assert.equal(ULTI_MIN_STARS,2);assert.equal(ULTI_MIN_RELAXED_ACCURACY,.6);assert.equal(ULTI_DAILY_CAP,40);
for(const [difficulty,row] of Object.entries(ULTI_POINTS))row.forEach((points,i)=>assert.equal(ultiPointsFor(difficulty,i),points));
assert.equal(ultiPointsFor('standard',2),9,'Former Standard saves pay as Challenge');
saved.teamId='ravenclaw';const first=awardUltiWin(saved,race,1,3,start);assert.equal(first.teamId,'slytherin','Reward belongs to the team at race start');assert.equal(first.points,2,'Relaxed Sunlit pays 2');assert.equal(first.schemaVersion,2);assert.equal(first.stars,3);assert.equal(first.arenaIndex,0);assert.equal(first.expiresAt,start+ULTI_LIFETIME_MS);assert.equal(first.grade,5);
assert.equal(awardUltiWin(saved,race,1,3,start+100),null);assert.equal(awardUltiWin(JSON.parse(JSON.stringify(saved)),race,1,3,start+200),null,'Reloaded results cannot duplicate rewards');
assert.equal(ultiWinOutcome(saved,race,1,3,start+300).duplicate,true);
for(const bad of [{status:'failed'},{status:'driving'},{damage:3},{failureReason:'breakdown'},{breakdown:{age:1}},{arena:{id:'boulevard',length:7200},distance:7000},{reviewLap:true},{teamId:'unknown'},{runId:null}])assert.equal(awardUltiWin(saved,{...race,runId:'invalid',...bad},1,3,start),null);
for(const place of [2,3])assert.equal(awardUltiWin(saved,{...race,runId:'place'+place},place,3,start),null);
// A first place needs 2+ stars (75%+ first-try accuracy); the reason is reported.
assert.deepEqual(ultiWinOutcome(saved,{...race,runId:'one-star'},1,1,start),{status:'stars',points:0});assert.equal(awardUltiWin(saved,{...race,runId:'one-star'},1,1,start),null);
assert.equal(awardUltiWin(saved,{...race,runId:'two-star',difficulty:'challenge',arenaIndex:2},1,2,start+1000).points,9,'Challenge Stormcrest pays 9 at two stars');
// Relaxed needs 60% of tasks right first time; Challenge keeps 2+ stars (75%).
{const r={teamId:'gryffindor'};normaliseUlti(r);const tasks=n=>Array.from({length:n},(_,i)=>({id:i})),at=new Date(2026,9,25,9).getTime();
 const relaxed=(id,correct,n,arenaIndex=0)=>({...race,teamId:'gryffindor',runId:id,arenaIndex,tasks:tasks(n),correct});
 const passed=awardUltiWin(r,relaxed('r8of12',8,12),1,1,at);assert.equal(passed.points,2,'Relaxed: 8 of 12 right first time (67%) earns at 1 star');assert.equal(passed.accuracy,.67);
 assert.equal(awardUltiWin(r,relaxed('r10of16',10,16,2),1,1,at+1).points,6,'Relaxed Stormcrest: 10 of 16 (62.5%) earns');
 assert.equal(ultiWinOutcome(r,relaxed('r7of12',7,12),1,1,at+2).status,'stars','Relaxed: 7 of 12 (58%) earns nothing');
 assert.equal(ultiWinOutcome(r,{...relaxed('c8of12',8,12),difficulty:'challenge'},1,1,at+3).status,'stars','Challenge: 8 of 12 is one star, not enough');
 assert.equal(awardUltiWin(r,{...relaxed('c9of12',9,12),difficulty:'challenge'},1,2,at+4).points,5,'Challenge: 9 of 12 (75%, 2 stars) earns');}
assert.equal(ultiSnapshot(saved,start-1).totals.slytherin,0);assert.equal(ultiSnapshot(saved,first.expiresAt-1).totals.slytherin,11);assert.equal(ultiSnapshot(saved,first.expiresAt+1001).totals.slytherin,0,'Points expire at exactly 72h');
// Daily cap: wins count until 40 points; the last win pays only what is left.
const cap={teamId:'gryffindor'};normaliseUlti(cap);const day=new Date(2026,9,20,9).getTime();let earned=[];
for(let n=0;n<6;n++){const r=awardUltiWin(cap,{...race,teamId:'gryffindor',runId:'cap'+n,difficulty:'challenge',arenaIndex:2},1,3,day+n*60000);earned.push(r?.points??0);}
assert.deepEqual(earned,[9,9,9,9,4,0],'The cap allows 40 points a day, with a partial last award');assert.equal(ultiEarnedToday(cap,day+3600000),40);
assert.equal(ultiWinOutcome(cap,{...race,teamId:'gryffindor',runId:'cap-more',difficulty:'challenge',arenaIndex:2},1,3,day+3600000).status,'cap');
assert.equal(awardUltiWin(cap,{...race,teamId:'gryffindor',runId:'next-day',difficulty:'challenge',arenaIndex:1},1,3,new Date(2026,9,21,0,5).getTime()).points,7,'The cap resets at local midnight');
// Version 1 receipts (10 per win) remain valid until they expire; tampered amounts are dropped.
const legacy={teamId:'hufflepuff',ulti:{schemaVersion:1,driverId:'driver-old',receipts:[
 {schemaVersion:1,sourceGame:'wordshift-rally',eventId:'wordshift-rally:old',runId:'old',driverId:'driver-old',teamId:'hufflepuff',points:10,earnedAt:start,expiresAt:start+ULTI_LIFETIME_MS},
 {schemaVersion:2,sourceGame:'wordshift-rally',eventId:'wordshift-rally:forged',runId:'forged',driverId:'driver-old',teamId:'hufflepuff',points:50,earnedAt:start,expiresAt:start+ULTI_LIFETIME_MS,difficulty:'relaxed',arenaIndex:0},
 {schemaVersion:2,sourceGame:'wordshift-rally',eventId:'wordshift-rally:too-high',runId:'too-high',driverId:'driver-old',teamId:'hufflepuff',points:3,earnedAt:start,expiresAt:start+ULTI_LIFETIME_MS,difficulty:'relaxed',arenaIndex:0}]}};
assert.equal(ultiSnapshot(legacy,start+1).totals.hufflepuff,10,'Old 10-point receipts count; forged or over-tier amounts do not');
const second=awardUltiWin(saved,{...race,runId:'run-two',teamId:'hufflepuff',difficulty:'challenge',arenaIndex:1},1,3,start+24*3600000);assert.equal(second.points,7);let snapshot=ultiSnapshot(saved,first.expiresAt+1001);assert.equal(snapshot.totals.slytherin,0);assert.equal(snapshot.totals.hufflepuff,7);assert.equal(snapshot.receipts.length,1);
const exported=JSON.parse(exportUlti(saved,first.expiresAt+1001));assert.equal(exported.schemaVersion,2);assert.deepEqual(exported.rules.points,ULTI_POINTS);assert.equal(exported.rules.dailyCap,40);assert.equal(exported.receipts[0].eventId,second.eventId);assert.equal(exported.receipts[0].expiresAt,second.expiresAt,'Export never renews points');assert.equal(exported.driverId,saved.ulti.driverId);
snapshot.receipts[0].points=1000;assert.equal(ultiSnapshot(saved,first.expiresAt+1001).totals.hufflepuff,7,'External snapshots are detached');
assert.equal(awardUltiWin(saved,race,1,3,first.expiresAt+1),null,'Expired receipts still deduplicate the original run');
const count=saved.ulti.receipts.length;saved.ulti.receipts.push({...second},{...second,eventId:'bad'},null);normaliseUlti(saved);assert.equal(saved.ulti.receipts.length,count,'Malformed and duplicate saved receipts are ignored');
assert.equal(ultiSnapshot(saved,second.expiresAt).receipts.length,0);
console.log('PASS: four team liveries, saved-progress migration, unique run IDs; rules v2 pay Relaxed 2/4/6 and Challenge 5/7/9 by arena for first place with 60%+ first-try accuracy on Relaxed or 2+ stars on Challenge, a 40-point local-day cap with a partial last award and midnight reset; v1 receipts honoured, forged amounts dropped; duplicate prevention across reload/expiry, independent 72h expiries and stable export receipts.');
